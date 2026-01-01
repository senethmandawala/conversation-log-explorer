import { useState } from "react";
import { ReportSection } from "@/components/post-call/ReportSection";

export function IntentTransitionAnalysis() {
  const mockData = [
    { name: "00:00", billing: 10, support: 15, sales: 5 },
    { name: "04:00", billing: 8, support: 12, sales: 3 },
    { name: "08:00", billing: 45, support: 60, sales: 25 },
    { name: "12:00", billing: 80, support: 95, sales: 40 },
    { name: "16:00", billing: 65, support: 80, sales: 35 },
    { name: "20:00", billing: 30, support: 40, sales: 15 },
  ];

  return (
    <ReportSection
      id="intent-transition-analysis"
      title="Intent Transition Analysis"
      description="Analysis of intent transitions during calls"
      hasChart={true}
      chartType="line"
      chartData={mockData}
      hideAccentLine={true}
    />
  );
}
