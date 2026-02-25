import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// In-memory cache for enriched data
const cache = new Map<
  string,
  { data: EnrichedData; cachedAt: number }
>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

// Rate limiting store
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // max 10 requests per minute per IP

// Type definitions (server-side)
interface Signal {
  label: string;
  value: string;
  type: "positive" | "neutral" | "warning";
}

interface Source {
  url: string;
  scrapedAt: string;
}

interface EnrichedData {
  summary: string;
  bullets: string[];
  keywords: string[];
  signals: Signal[];
  sources: Source[];
  cachedAt: string;
}

interface ScrapedPage {
  text: string;
  url: string;
}

// Extract domain from URL for cache key
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname ?? url;
  } catch {
    return url;
  }
}

// Scrape a URL using Jina.ai reader
async function scrapeUrl(url: string): Promise<ScrapedPage | null> {
  try {
    const jinaUrl = `https://r.jina.ai/${url}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

    const response = await fetch(jinaUrl, {
      method: "GET",
      headers: {
        Accept: "text/plain",
        "X-Return-Format": "text",
        "X-Timeout": "15",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const text = await response.text();
    return { text, url };
  } catch (error) {
    // Silently catch errors (timeout, network issues, etc.)
    void error; // Acknowledge error without using it
    return null;
  }
}

// Build array of URLs to scrape (homepage, about, careers)
function buildUrlsToScrape(baseUrl: string): string[] {
  return [
    baseUrl,
    baseUrl.endsWith("/") ? `${baseUrl}about` : `${baseUrl}/about`,
    baseUrl.endsWith("/") ? `${baseUrl}careers` : `${baseUrl}/careers`,
  ];
}

// Extract structured data from scraped pages using Google Gemini
async function extractWithGemini(
  scrapedPages: ScrapedPage[],
  companyUrl: string
): Promise<Partial<EnrichedData>> {
  // Build context from all scraped pages
  const context = scrapedPages
    .map((page) => `=== PAGE: ${page.url} ===\n${page.text}`)
    .join("\n\n")
    .slice(0, 12000);

  const prompt = `You are a VC analyst assistant that extracts structured company intelligence from website content.

Company URL: ${companyUrl}

Scraped Content:
${context}

Return ONLY a valid JSON object, no markdown, no backticks, no explanation.
Use this exact schema:
{
  "summary": "1-2 sentence description of what the company does",
  "bullets": ["3-6 key things about the company, product, or traction"],
  "keywords": ["5-10 relevant keywords or technology tags"],
  "signals": [
    {
      "label": "Signal name",
      "value": "What was observed in the content",
      "type": "positive"
    }
  ],
  "sources": []
}

Signal type must be exactly: "positive", "neutral", or "warning"
Infer signals from content:
- Active careers page with open roles → positive
- Recent blog posts or changelog → positive
- Open source repo mentioned → positive
- No about page found → warning
- Thin or generic content → warning
Include 2-4 signals total.`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();

  // Strip markdown fences if Gemini wraps response in ```json
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  return JSON.parse(cleaned);
}

// Main POST handler
export async function POST(req: NextRequest) {
  try {
    // 1. Parse request
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "url is required" },
        { status: 400 }
      );
    }

    // Rate limiting check
    const clientIp = req.headers.get("x-forwarded-for") ?? "unknown";
    const now = Date.now();
    const timestamps = rateLimitMap.get(clientIp) ?? [];
    const recentTimestamps = timestamps.filter(
      (ts) => now - ts < RATE_LIMIT_WINDOW_MS
    );

    if (recentTimestamps.length >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again in a minute." },
        { status: 429 }
      );
    }

    recentTimestamps.push(now);
    rateLimitMap.set(clientIp, recentTimestamps);

    // Normalize URL
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
    const domain = extractDomain(normalizedUrl);

    // 3. Check cache
    const cached = cache.get(domain);
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      console.log(`[/api/enrich] Cache hit for ${domain}`);
      return NextResponse.json(cached.data);
    }

    console.log(`[/api/enrich] Enriching ${normalizedUrl}`);

    // 4. Scrape pages in parallel
    const urlsToScrape = buildUrlsToScrape(normalizedUrl);
    const results = await Promise.all(urlsToScrape.map(scrapeUrl));
    const scrapedPages = results.filter(
      (r): r is ScrapedPage => r !== null
    );

    if (scrapedPages.length === 0) {
      return NextResponse.json(
        { error: "Could not fetch any content from this website" },
        { status: 422 }
      );
    }

    console.log(
      `[/api/enrich] Scraped ${scrapedPages.length} pages for ${domain}`
    );

    // 5. Extract with Gemini
    const extracted = await extractWithGemini(scrapedPages, normalizedUrl);

    // 6. Build response object
    const enrichedData: EnrichedData = {
      summary: extracted.summary ?? "No summary available",
      bullets: extracted.bullets ?? [],
      keywords: extracted.keywords ?? [],
      signals: extracted.signals ?? [],
      sources: scrapedPages.map((p) => ({
        url: p.url,
        scrapedAt: new Date().toISOString(),
      })),
      cachedAt: new Date().toISOString(),
    };

    // 7. Store in cache
    cache.set(domain, {
      data: enrichedData,
      cachedAt: Date.now(),
    });

    console.log(`[/api/enrich] Enrichment complete for ${domain}`);

    // 8. Return response
    return NextResponse.json(enrichedData);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    console.error("[/api/enrich] Error:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
