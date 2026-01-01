import { useState } from "react";
import { ReportSection } from "@/components/post-call/ReportSection";

export function CategoryDistribution() {
  const mockData = [
    { name: "Billing Inquiries", value: 35 },
    { name: "Technical Support", value: 25 },
    { name: "General Questions", value: 20 },
    { name: "Sales", value: 12 },
    { name: "Others", value: 8 },
  ];

  return (
    <ReportSection
      id="category-distribution"
      title="Category Distribution"
      description="Distribution of calls across different categories"
      hasChart={true}
      chartType="pie"
      chartData={mockData}
      hideAccentLine={true}
    />
  );
}
