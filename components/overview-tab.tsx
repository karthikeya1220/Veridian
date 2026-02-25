"use client";

import { Company } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sectorIcon, stageColor, scoreColor, cn } from "@/lib/utils";
import {
  MapPin,
  Users,
  Calendar,
  Tag,
  TrendingUp,
  Globe,
} from "lucide-react";

interface OverviewTabProps {
  company: Company;
}

export function OverviewTab({ company }: OverviewTabProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Left Column */}
      <div className="col-span-2 flex flex-col gap-4">
        {/* Card 1 - About */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 leading-relaxed">
              {company.description}
            </p>
            <a
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-3 w-fit"
            >
              <Globe size={12} />
              Visit website
            </a>
          </CardContent>
        </Card>

        {/* Card 2 - Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {company.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="col-span-1 flex flex-col gap-4">
        {/* Card 3 - Company Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* HQ */}
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={14} className="text-gray-400" />
                <span className="text-gray-500 w-24">HQ</span>
                <span className="text-gray-900 font-medium">{company.hq}</span>
              </div>

              {/* Team Size */}
              <div className="flex items-center gap-2 text-sm">
                <Users size={14} className="text-gray-400" />
                <span className="text-gray-500 w-24">Team Size</span>
                <span className="text-gray-900 font-medium">
                  {company.employees}
                </span>
              </div>

              {/* Founded */}
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={14} className="text-gray-400" />
                <span className="text-gray-500 w-24">Founded</span>
                <span className="text-gray-900 font-medium">
                  {company.founded}
                </span>
              </div>

              {/* Stage */}
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp size={14} className="text-gray-400" />
                <span className="text-gray-500 w-24">Stage</span>
                <Badge className={stageColor(company.stage)}>
                  {company.stage}
                </Badge>
              </div>

              {/* Thesis Score */}
              <div className="flex items-center gap-2 text-sm">
                <Tag size={14} className="text-gray-400" />
                <span className="text-gray-500 w-24">Thesis Fit</span>
                <span
                  className={cn("font-bold text-sm", scoreColor(company.thesisScore))}
                >
                  {company.thesisScore}/100
                </span>
                <span className="text-xs text-gray-400">match</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4 - Sector */}
        <Card>
          <CardContent className="p-4 text-center">
            <span className="text-4xl mb-2 block">{sectorIcon(company.sector)}</span>
            <p className="text-sm font-medium text-gray-700">
              {company.sector}
            </p>
            <p className="text-xs text-gray-400">sector</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
