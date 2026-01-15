import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconInfoCircle, IconArrowRight, IconGitBranch, IconArrowsShuffle } from "@tabler/icons-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Card as AntCard, 
  Typography, 
  Space, 
  Tooltip as AntTooltip,
  Table as AntTable,
  Tag as AntTag
} from "antd";
import { IconInfoCircle as InfoIcon } from "@tabler/icons-react";

const { Title, Text } = Typography;

// Get colors from environment configuration
const COLORS = (window as any).env_vars?.colors || [
  '#FB6767', '#5766BC', '#62B766', '#FBA322', '#E83B76', 
  '#3EA1F0', '#98C861', '#FB6C3E', '#24B1F1', '#D0DD52'
];

interface IntentTransition {
  combination: string[];
  count: number;
}

// Mock data for intent transitions
const intentTransitions: IntentTransition[] = [
  { combination: ["Billing Inquiry", "Payment Support", "Balance Check"], count: 145 },
  { combination: ["Technical Support", "Troubleshooting"], count: 128 },
  { combination: ["Account Info", "Plan Upgrade", "Billing"], count: 112 },
  { combination: ["General Query", "Technical Support"], count: 98 },
  { combination: ["Sales", "Product Info", "Pricing"], count: 87 },
  { combination: ["Complaint", "Escalation", "Manager Request"], count: 76 },
  { combination: ["Service Status", "Outage Info"], count: 65 },
  { combination: ["Appointment", "Reschedule"], count: 54 },
];

const totalMultiCategoryCalls = intentTransitions.reduce((sum, item) => sum + item.count, 0);

export function IntentTransitionAnalysis() {
  const [isLoading, setIsLoading] = useState(false);

  const formatCombination = (combination: string[]): string => {
    return combination.join(" → ");
  };

  return (
    <AntCard className="rounded-xl border-gray-200 bg-white shadow-sm p-4">
      <Space orientation="vertical" size="middle" className="w-full">
        <div className="-mt-3">
          <div className="flex justify-between items-center w-full">
            <Space align="center" size="middle">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <IconGitBranch className="text-xl" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Title level={4} className="!m-0 !text-lg !font-semibold">
                    Intent Transition Analysis
                  </Title>
                  <AntTooltip title="Shows how callers transition between different intents during a single call">
                    <div className="-mt-1">
                      <InfoIcon className="text-sm text-slate-500" />
                    </div>
                  </AntTooltip>
                </div>
                <Text type="secondary" className="text-sm">
                  Analysis of intent transitions during calls
                </Text>
              </div>
            </Space>
          </div>
        </div>
        
        {/* Chart Content */}
        <div className="mt-2">
        {/* Total Calls Section */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2">
            <span className="text-sm text-muted-foreground">Total Multi-Category Calls</span>
            <AntTag color="default" className="text-sm font-bold px-2 py-0.5">
              {totalMultiCategoryCalls.toLocaleString()}
            </AntTag>
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : intentTransitions.length > 0 ? (
          <div className="max-h-[400px] overflow-auto rounded-lg border border-border">
            <AntTable
              dataSource={intentTransitions.map((item, index) => ({ ...item, key: index }))}
              columns={[
                {
                  title: 'Intent Change',
                  dataIndex: 'combination',
                  key: 'combination',
                  render: (combination: string[]) => (
                    <div className="flex flex-wrap items-center gap-1">
                      {combination.map((intent, i) => (
                        <span key={i} className="flex items-center">
                          <AntTag 
                            color={COLORS[i % COLORS.length]} 
                            className="text-[11px] m-0"
                          >
                            {intent}
                          </AntTag>
                          {i < combination.length - 1 && (
                            <span className="mx-1 text-muted-foreground">→</span>
                          )}
                        </span>
                      ))}
                    </div>
                  ),
                },
                {
                  title: 'Call Count',
                  dataIndex: 'count',
                  key: 'count',
                  width: 120,
                  align: 'center',
                  render: (count: number) => (
                    <Text strong className="text-sm">
                      {count.toLocaleString()}
                    </Text>
                  ),
                },
              ]}
              pagination={false}
              size="small"
              className="w-full"
              rowClassName={(record, index) => 
                index % 2 === 0 ? 'bg-gray-50/50' : ''
              }
            />
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        )}
      </div>
    </Space>
  </AntCard>
  );
}
