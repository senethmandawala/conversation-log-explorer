import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, ArrowRight, GitBranch, Shuffle } from "lucide-react";
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
import { InfoCircleOutlined } from "@ant-design/icons";

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
    <AntCard
      style={{
        borderRadius: 12,
        border: '1px solid #e8e8e8',
        background: '#ffffff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '16px 16px 16px 16px'
      }}
    >
      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ marginTop: -12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Space align="center" size="middle">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <GitBranch style={{ fontSize: 20 }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                    Intent Transition Analysis
                  </Title>
                  <AntTooltip title="Shows how callers transition between different intents during a single call">
                    <div style={{ marginTop: '-4px' }}>
                      <InfoCircleOutlined 
                        style={{ fontSize: 14, color: '#64748b' }}
                      />
                    </div>
                  </AntTooltip>
                </div>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  Analysis of intent transitions during calls
                </Text>
              </div>
            </Space>
          </div>
        </div>
        
        {/* Chart Content */}
        <div style={{ marginTop: 10 }}>
        {/* Total Calls Section */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'hsl(var(--muted) / 0.5)', borderRadius: 8, padding: '8px 16px' }}>
            <span style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))' }}>Total Multi-Category Calls</span>
            <AntTag color="default" style={{ fontSize: 14, fontWeight: 'bold', padding: '2px 8px' }}>
              {totalMultiCategoryCalls.toLocaleString()}
            </AntTag>
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : intentTransitions.length > 0 ? (
          <div style={{ maxHeight: 400, overflow: 'auto', borderRadius: 8, border: '1px solid hsl(var(--border))' }}>
            <AntTable
              dataSource={intentTransitions.map((item, index) => ({ ...item, key: index }))}
              columns={[
                {
                  title: 'Intent Change',
                  dataIndex: 'combination',
                  key: 'combination',
                  render: (combination: string[]) => (
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
                      {combination.map((intent, i) => (
                        <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
                          <AntTag 
                            color={COLORS[i % COLORS.length]} 
                            style={{ fontSize: 11, margin: 0 }}
                          >
                            {intent}
                          </AntTag>
                          {i < combination.length - 1 && (
                            <span style={{ margin: '0 4px', color: 'hsl(var(--muted-foreground))' }}>→</span>
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
                    <Text strong style={{ fontSize: 14 }}>
                      {count.toLocaleString()}
                    </Text>
                  ),
                },
              ]}
              pagination={false}
              size="small"
              style={{ width: '100%' }}
              rowClassName={(record, index) => 
                index % 2 === 0 ? 'bg-gray-50/50' : ''
              }
            />
          </div>
        ) : (
          <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'hsl(var(--muted-foreground))' }}>No data available</p>
          </div>
        )}
      </div>
    </Space>
  </AntCard>
  );
}
