import { useState } from "react";
import { ReportSection } from "@/components/post-call/ReportSection";

export function CallDurationDistribution() {
  const mockData = [
    { name: "0-30s", value: 245 },
    { name: "30s-1m", value: 380 },
    { name: "1-2m", value: 290 },
    { name: "2-5m", value: 180 },
    { name: "5m+", value: 85 },
  ];

  return (
    <ReportSection
      id="call-duration-distribution"
      title="Call Duration Distribution"
      description="Distribution of call durations over time"
      hasChart={true}
      chartType="bar"
      chartData={mockData}
      hideAccentLine={true}
    />
  );
}
