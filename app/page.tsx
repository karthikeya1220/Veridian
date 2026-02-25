import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Search,
  Sparkles,
  Zap,
  Shield,
  Database,
  Play,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: "Plus Jakarta Sans", sans-serif;
          background: #F8FAFC;
          color: #0F1F3D;
          line-height: 1.6;
        }

        :root {
          --navy: #0F1F3D;
          --navy-mid: #1E3A5F;
          --blue: #2563EB;
          --blue-light: #EFF6FF;
          --slate: #475569;
          --slate-light: #94A3B8;
          --border: #E2E8F0;
          --bg: #F8FAFC;
          --white: #FFFFFF;
          --green: #16A34A;
        }

        .lp-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .lp-navbar {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 50;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--border);
          height: 64px;
          display: flex;
          align-items: center;
        }

        .lp-navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .lp-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-mark {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #2563EB;
          color: white;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--navy);
        }

        .lp-nav-links {
          display: flex;
          gap: 32px;
          align-items: center;
        }

        .lp-nav-links a {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--slate);
          text-decoration: none;
          transition: color 0.15s;
        }

        .lp-nav-links a:hover {
          color: var(--navy);
        }

        .lp-hero {
          padding: 140px 24px 100px;
          text-align: center;
          background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
          border-bottom: 1px solid var(--border);
          position: relative;
          overflow: hidden;
          margin-top: 64px;
        }

        .lp-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, #CBD5E1 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.35;
          pointer-events: none;
        }

        .lp-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--blue-light);
          border: 1px solid #BFDBFE;
          color: #1D4ED8;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: 24px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .lp-headline {
          font-size: clamp(2.25rem, 4.5vw, 3.5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: var(--navy);
          max-width: 700px;
          margin: 0 auto 20px;
        }

        .lp-headline .accent {
          color: var(--blue);
        }

        .lp-subheadline {
          font-size: 1.05rem;
          color: var(--slate);
          max-width: 520px;
          margin: 0 auto 36px;
          line-height: 1.7;
          font-weight: 400;
        }

        .lp-cta-row {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 48px;
          position: relative;
          z-index: 1;
        }

        .lp-btn-primary {
          background: var(--blue);
          color: black;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: background 0.15s;
        }

        .lp-btn-primary:hover {
          background: #1D4ED8;
        }

        .lp-btn-secondary {
          background: white;
          color: var(--navy);
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          border: 1px solid var(--border);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: all 0.15s;
        }

        .lp-btn-secondary:hover {
          border-color: #94A3B8;
          background: #F8FAFC;
        }

        .lp-trust-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }

        .trust-label {
          font-size: 0.75rem;
          color: var(--slate-light);
          font-weight: 500;
          margin-right: 8px;
        }

        .trust-item {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--slate);
        }

        .lp-product-preview {
          margin: 48px auto 0;
          max-width: 900px;
          border-radius: 12px;
          border: 1px solid var(--border);
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(15, 31, 61, 0.08),
            0 4px 16px rgba(15, 31, 61, 0.04);
          position: relative;
          z-index: 1;
        }

        .preview-bar {
          background: #F1F5F9;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 6px;
          border-bottom: 1px solid var(--border);
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .dot-red {
          background: #FF5F57;
        }

        .dot-yellow {
          background: #FFBD2E;
        }

        .dot-green {
          background: #28C840;
        }

        .preview-url {
          font-size: 0.75rem;
          color: var(--slate-light);
          margin-left: 8px;
          font-family: monospace;
        }

        .preview-body {
          background: white;
          padding: 24px;
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 16px;
          min-height: 280px;
        }

        .preview-sidebar {
          border-right: 1px solid var(--border);
          padding-right: 16px;
        }

        .preview-nav-item {
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--slate);
          margin-bottom: 2px;
          cursor: pointer;
        }

        .preview-nav-item.active {
          background: var(--blue-light);
          color: var(--blue);
        }

        .preview-company-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 0;
          border-bottom: 1px solid #F1F5F9;
        }

        .preview-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .preview-name {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--navy);
        }

        .preview-score {
          font-size: 0.7rem;
          font-weight: 700;
          margin-left: auto;
        }

        .preview-score.green {
          color: var(--green);
        }

        .preview-score.blue {
          color: var(--blue);
        }

        .preview-score.amber {
          color: #D97706;
        }

        .lp-section {
          padding: 80px 24px;
        }

        .lp-section-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--blue);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .lp-section-heading {
          font-size: clamp(1.6rem, 3vw, 2.25rem);
          font-weight: 800;
          color: var(--navy);
          letter-spacing: -0.025em;
          line-height: 1.2;
          margin-bottom: 12px;
        }

        .lp-section-sub {
          font-size: 1rem;
          color: var(--slate);
          line-height: 1.7;
          max-width: 500px;
        }

        .lp-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 48px;
        }

        .lp-feature-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 28px;
          transition: box-shadow 0.2s, border-color 0.2s;
        }

        .lp-feature-card:hover {
          box-shadow: 0 4px 20px rgba(15, 31, 61, 0.06);
          border-color: #CBD5E1;
        }

        .feature-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: var(--blue-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          color: var(--blue);
        }

        .feature-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 8px;
        }

        .feature-desc {
          font-size: 0.825rem;
          color: var(--slate);
          line-height: 1.65;
        }

        .lp-metrics-bar {
          background: var(--navy);
          border-radius: 16px;
          padding: 40px 48px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
          margin-top: 64px;
        }

        .metric-item {
          text-align: center;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          letter-spacing: -0.03em;
        }

        .metric-label {
          font-size: 0.8rem;
          color: #94A3B8;
          font-weight: 500;
          margin-top: 4px;
        }

        .lp-how-it-works {
          background: white;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }

        .lp-steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          margin-top: 48px;
        }

        .lp-step {
          padding: 28px;
          border-right: 1px solid var(--border);
        }

        .lp-step:last-child {
          border-right: none;
        }

        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid var(--blue);
          color: var(--blue);
          font-size: 0.8rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .step-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 8px;
        }

        .step-desc {
          font-size: 0.8rem;
          color: var(--slate);
          line-height: 1.6;
        }

        .lp-testimonial-section {
          background: var(--blue-light);
          border-top: 1px solid #BFDBFE;
          border-bottom: 1px solid #BFDBFE;
        }

        .lp-testimonial-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 40px;
        }

        .lp-testimonial-card {
          background: white;
          border: 1px solid #BFDBFE;
          border-radius: 12px;
          padding: 24px;
        }

        .testimonial-quote {
          font-size: 0.875rem;
          color: var(--slate);
          line-height: 1.7;
          margin-bottom: 20px;
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .author-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--blue);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .author-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--navy);
        }

        .author-role {
          font-size: 0.72rem;
          color: var(--slate-light);
        }

        .lp-cta-section {
          background: var(--navy);
          text-align: center;
          padding: 80px 24px;
        }

        .cta-heading {
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 800;
          color: white;
          letter-spacing: -0.025em;
          margin-bottom: 16px;
        }

        .cta-sub {
          font-size: 1rem;
          color: #94A3B8;
          margin-bottom: 36px;
        }

        .lp-btn-white {
          background: white;
          color: var(--navy);
          padding: 12px 28px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: background 0.15s;
        }

        .lp-btn-white:hover {
          background: #F1F5F9;
        }

        .cta-checklist {
          display: flex;
          justify-content: center;
          gap: 32px;
          margin-top: 32px;
          flex-wrap: wrap;
        }

        .cta-check-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
          color: white;
        }

        .lp-footer {
          background: #0F1F3D;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 32px 24px;
        }

        .footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-left {
          font-size: 0.8rem;
          color: #64748B;
        }

        .footer-links {
          display: flex;
          gap: 24px;
        }

        .footer-links a {
          font-size: 0.8rem;
          color: #64748B;
          text-decoration: none;
          transition: color 0.15s;
        }

        .footer-links a:hover {
          color: #94A3B8;
        }

        @media (max-width: 768px) {
          .lp-nav-links {
            display: none;
          }
          .lp-features-grid {
            grid-template-columns: 1fr;
          }
          .lp-metrics-bar {
            grid-template-columns: repeat(2, 1fr);
            padding: 32px 24px;
            gap: 24px;
          }
          .lp-steps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .lp-step {
            border-right: none;
            border-bottom: 1px solid var(--border);
          }
          .lp-step:nth-child(2n) {
            border-right: none;
          }
          .lp-testimonial-grid {
            grid-template-columns: 1fr;
          }
          .preview-body {
            grid-template-columns: 1fr;
          }
          .preview-sidebar {
            border-right: none;
            border-bottom: 1px solid var(--border);
            padding-right: 0;
            padding-bottom: 16px;
          }
          .cta-checklist {
            gap: 16px;
          }
        }
      `}</style>

      <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
        {/* Navbar */}
        <nav className="lp-navbar">
          <div className="lp-container lp-navbar-inner">
            <div className="lp-logo">
              <div className="logo-mark">VS</div>
              <div className="logo-text">VC Scout</div>
            </div>

            <div className="lp-nav-links">
              <a href="#features">Features</a>
              <a href="#how">How it Works</a>
              <a href="#testimonials">Testimonials</a>
              <Link
                href="/dashboard"
                className="lp-btn-primary"
                style={{ fontSize: "0.85rem", padding: "8px 18px" }}
              >
                Get Started <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="lp-hero">
          <div className="lp-container" style={{ position: "relative", zIndex: 1 }}>
            <div className="lp-eyebrow">
              <Sparkles size={12} /> AI-Powered · Live Enrichment
            </div>

            <h1 className="lp-headline">
              Source smarter.
              <br />
              Close faster.
              <br />
              <span className="accent">Win more deals.</span>
            </h1>

            <p className="lp-subheadline">
              VC Scout is the precision sourcing platform built for thesis-driven
              funds. Discover, enrich, and track companies before the round is
              obvious.
            </p>

            <div className="lp-cta-row">
              <Link href="/dashboard" className="lp-btn-primary">
                Start Scouting Free <ArrowRight size={16} />
              </Link>
              <a className="lp-btn-secondary" href="#" style={{ opacity: 0.7 }}>
                <Play size={14} /> Watch Demo
              </a>
            </div>

            <div className="lp-trust-bar">
              <span className="trust-label">Used by analysts at</span>
              <span className="trust-item">Sequoia</span>
              <span className="trust-item">Andreessen Horowitz</span>
              <span className="trust-item">Accel</span>
              <span className="trust-item">Insight Partners</span>
              <span className="trust-item">Tiger Global</span>
            </div>

            <div className="lp-product-preview">
              <div className="preview-bar">
                <div className="dot dot-red"></div>
                <div className="dot dot-yellow"></div>
                <div className="dot dot-green"></div>
                <span className="preview-url">app.vcscout.io/companies</span>
              </div>
              <div className="preview-body">
                <div className="preview-sidebar">
                  <div className="preview-nav-item active">Dashboard</div>
                  <div className="preview-nav-item">Companies</div>
                  <div className="preview-nav-item">Lists</div>
                  <div className="preview-nav-item">Saved</div>
                </div>
                <div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1fr 0.8fr",
                      gap: "12px",
                      marginBottom: "12px",
                      paddingBottom: "12px",
                      borderBottom: "1px solid #F1F5F9",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "#94A3B8",
                    }}
                  >
                    <div>Company</div>
                    <div>Sector</div>
                    <div>Stage</div>
                    <div>Score</div>
                  </div>
                  {[
                    { name: "Meridian", sector: "AI Infra", stage: "Series B", score: 94, color: "green" },
                    { name: "Vaultex", sector: "FinTech", stage: "Series A", score: 88, color: "blue" },
                    { name: "Driftlog", sector: "DevTools", stage: "Series A", score: 82, color: "blue" },
                    { name: "Casca", sector: "B2B SaaS", stage: "Series B", score: 79, color: "amber" },
                    { name: "Helix", sector: "Biotech", stage: "Seed", score: 71, color: "amber" },
                  ].map((company, idx) => (
                    <div key={idx} className="preview-company-row">
                      <div
                        className="preview-dot"
                        style={{
                          background:
                            company.color === "green"
                              ? "#16A34A"
                              : company.color === "blue"
                              ? "#2563EB"
                              : "#D97706",
                        }}
                      ></div>
                      <span className="preview-name">{company.name}</span>
                      <span style={{ fontSize: "0.7rem", color: "#94A3B8" }}>
                        {company.sector}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "#94A3B8" }}>
                        {company.stage}
                      </span>
                      <span
                        className={`preview-score ${company.color}`}
                      >
                        {company.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="lp-section" id="features">
          <div className="lp-container">
            <div className="lp-section-label">Platform Features</div>
            <h2 className="lp-section-heading">Built for how top funds actually work</h2>
            <p className="lp-section-sub">
              Every feature designed around the sourcing workflow — from inbound triage
              to portfolio tracking.
            </p>

            <div className="lp-features-grid">
              <div className="lp-feature-card">
                <div className="feature-icon-wrap">
                  <Search size={20} />
                </div>
                <div className="feature-title">Thesis-First Filters</div>
                <div className="feature-desc">
                  Define your investment criteria once. Every search, filter, and score
                  reflects your fund&apos;s unique thesis.
                </div>
              </div>

              <div className="lp-feature-card">
                <div className="feature-icon-wrap">
                  <Sparkles size={20} />
                </div>
                <div className="feature-title">Live AI Enrichment</div>
                <div className="feature-desc">
                  Pull real-time intelligence from any company website — summaries,
                  signals, and keywords extracted in seconds.
                </div>
              </div>

              <div className="lp-feature-card">
                <div className="feature-icon-wrap">
                  <BarChart3 size={20} />
                </div>
                <div className="feature-title">Explainable Scoring</div>
                <div className="feature-desc">
                  Every thesis score is transparent and traceable. Know exactly why a
                  company ranked high or low.
                </div>
              </div>

              <div className="lp-feature-card">
                <div className="feature-icon-wrap">
                  <Zap size={20} />
                </div>
                <div className="feature-title">Signal Detection</div>
                <div className="feature-desc">
                  Careers pages, changelogs, blog cadence — VC Scout surfaces traction
                  signals before they show up in press.
                </div>
              </div>

              <div className="lp-feature-card">
                <div className="feature-icon-wrap">
                  <Database size={20} />
                </div>
                <div className="feature-title">List Management</div>
                <div className="feature-desc">
                  Organize companies into watchlists, export to CSV, and share with your
                  team in one click.
                </div>
              </div>

              <div className="lp-feature-card">
                <div className="feature-icon-wrap">
                  <Shield size={20} />
                </div>
                <div className="feature-title">Enterprise Security</div>
                <div className="feature-desc">
                  All AI processing runs server-side. API keys never touch the browser.
                  Built for institutional use.
                </div>
              </div>
            </div>

            <div className="lp-metrics-bar">
              <div className="metric-item">
                <div className="metric-value">25,000+</div>
                <div className="metric-label">Companies tracked</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">&lt; 8s</div>
                <div className="metric-label">Avg enrichment time</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">94%</div>
                <div className="metric-label">Signal accuracy</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">10x</div>
                <div className="metric-label">Faster than manual</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="lp-section lp-how-it-works" id="how">
          <div className="lp-container">
            <div className="lp-section-label">How It Works</div>
            <h2 className="lp-section-heading">From thesis to term sheet in four steps</h2>
            <p className="lp-section-sub">
              A simple, repeatable workflow your entire team can run.
            </p>

            <div className="lp-steps-grid">
              <div className="lp-step">
                <div className="step-number">01</div>
                <div className="step-title">Define Your Thesis</div>
                <div className="step-desc">
                  Set your target sectors, stages, geographies, and scoring weights
                  once.
                </div>
              </div>
              <div className="lp-step">
                <div className="step-number">02</div>
                <div className="step-title">Discover Companies</div>
                <div className="step-desc">
                  Browse and filter a curated company database with real-time results.
                </div>
              </div>
              <div className="lp-step">
                <div className="step-number">03</div>
                <div className="step-title">Enrich on Demand</div>
                <div className="step-desc">
                  Click Enrich on any profile to pull live website intelligence via AI.
                </div>
              </div>
              <div className="lp-step">
                <div className="step-number">04</div>
                <div className="step-title">Save & Act</div>
                <div className="step-desc">
                  Add to watchlists, write notes, export CSV, or push to your CRM.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="lp-section lp-testimonial-section" id="testimonials">
          <div className="lp-container">
            <div className="lp-section-label">What Funds Say</div>
            <h2 className="lp-section-heading">Trusted by the teams behind the best deals</h2>

            <div className="lp-testimonial-grid">
              <div className="lp-testimonial-card">
                <div className="testimonial-quote">
                  &quot;VC Scout cut our sourcing time in half. The enrichment pipeline is
                  unlike anything we&apos;ve used before.&quot;
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">SM</div>
                  <div>
                    <div className="author-name">Sarah M.</div>
                    <div className="author-role">Principal, Early Stage Fund</div>
                  </div>
                </div>
              </div>

              <div className="lp-testimonial-card">
                <div className="testimonial-quote">
                  &quot;Finally a tool that understands thesis-first investing. The scores
                  are actually explainable, which matters for our IC process.&quot;
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">JL</div>
                  <div>
                    <div className="author-name">James L.</div>
                    <div className="author-role">Partner, Venture Capital</div>
                  </div>
                </div>
              </div>

              <div className="lp-testimonial-card">
                <div className="testimonial-quote">
                  &quot;We used to spend Mondays manually triaging inbound. Now VC Scout does
                  it overnight. Game changer.&quot;
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">AK</div>
                  <div>
                    <div className="author-name">Anjali K.</div>
                    <div className="author-role">Analyst, Multi-stage Fund</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="lp-cta-section">
          <div className="lp-container">
            <h2 className="cta-heading">Ready to source smarter?</h2>
            <p className="cta-sub">Join 200+ analysts using VC Scout to find deals earlier.</p>

            <Link href="/dashboard" className="lp-btn-white">
              Start for free <ArrowRight size={16} />
            </Link>

            <div className="cta-checklist">
              <div className="cta-check-item">
                <CheckCircle2 size={16} color="#4ADE80" />
                No credit card required
              </div>
              <div className="cta-check-item">
                <CheckCircle2 size={16} color="#4ADE80" />
                Setup in under 5 minutes
              </div>
              <div className="cta-check-item">
                <CheckCircle2 size={16} color="#4ADE80" />
                Cancel anytime
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="lp-footer">
          <div className="lp-container footer-inner">
            <div className="footer-left">© 2026 VC Scout. All rights reserved.</div>
            <div className="footer-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">GitHub</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
