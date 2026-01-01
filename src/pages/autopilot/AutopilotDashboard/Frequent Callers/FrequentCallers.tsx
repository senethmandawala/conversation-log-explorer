import { useState } from "react";
import { ReportSection } from "@/components/post-call/ReportSection";

export function FrequentCallers() {
  const mockData = [
    { name: "****5678", value: 12 },
    { name: "****1234", value: 8 },
    { name: "****9012", value: 6 },
    { name: "****3456", value: 5 },
    { name: "****7890", value: 4 },
  ];

  return (
    <ReportSection
      id="frequent-callers"
      title="Frequent Callers"
      description="Analysis of most frequent callers"
      hasChart={true}
      chartType="bar"
      chartData={mockData}
      hideAccentLine={true}
    />
  );
}
