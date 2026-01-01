import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sankey,
  Tooltip,
  Layer,
  Rectangle,
  ResponsiveContainer,
} from "recharts";

interface SankeyNode {
  name: string;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

// Mock Sankey data for call flow visualization
const sankeyData: SankeyData = {
  nodes: [
    // Source nodes (Level 0)
    { name: "Incoming Calls" },
    // Level 1
    { name: "IVR Menu" },
    { name: "Direct Transfer" },
    // Level 2
    { name: "AI Agent" },
    { name: "DTMF Handled" },
    { name: "Agent Queue" },
    // Level 3 (Outcomes)
    { name: "Resolved by AI" },
    { name: "Transferred to Agent" },
    { name: "Call Abandoned" },
    { name: "Callback Scheduled" },
  ],
  links: [
    // From Incoming Calls
    { source: 0, target: 1, value: 850 },
    { source: 0, target: 2, value: 150 },
    
    // From IVR Menu
    { source: 1, target: 3, value: 520 },
    { source: 1, target: 4, value: 230 },
    { source: 1, target: 5, value: 100 },
    
    // From Direct Transfer
    { source: 2, target: 5, value: 150 },
    
    // From AI Agent
    { source: 3, target: 6, value: 380 },
    { source: 3, target: 7, value: 95 },
    { source: 3, target: 9, value: 45 },
    
    // From DTMF Handled
    { source: 4, target: 6, value: 200 },
    { source: 4, target: 8, value: 30 },
    
    // From Agent Queue
    { source: 5, target: 7, value: 180 },
    { source: 5, target: 8, value: 70 },
  ],
};

const COLORS = [
  "#8b5cf6",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
  "#f97316",
  "#6366f1",
];

interface CustomNodeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  payload: SankeyNode;
}

const CustomNode = ({ x, y, width, height, index, payload }: CustomNodeProps) => {
  return (
    <Layer key={`CustomNode-${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={COLORS[index % COLORS.length]}
        fillOpacity="0.9"
        rx={4}
        ry={4}
      />
      <text
        textAnchor="middle"
        x={x + width / 2}
        y={y + height / 2}
        fontSize="11"
        fill="#fff"
        fontWeight="500"
      >
        {payload.name.length > 12 ? `${payload.name.slice(0, 12)}...` : payload.name}
      </text>
    </Layer>
  );
};

interface CustomLinkProps {
  sourceX: number;
  targetX: number;
  sourceY: number;
  targetY: number;
  sourceControlX: number;
  targetControlX: number;
  linkWidth: number;
  index: number;
}

const CustomLink = ({
  sourceX,
  targetX,
  sourceY,
  targetY,
  sourceControlX,
  targetControlX,
  linkWidth,
  index,
}: CustomLinkProps) => {
  return (
    <Layer key={`CustomLink-${index}`}>
      <path
        d={`
          M${sourceX},${sourceY}
          C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
        `}
        stroke={COLORS[index % COLORS.length]}
        strokeWidth={linkWidth}
        fill="none"
        strokeOpacity="0.3"
      />
    </Layer>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    if (data.source !== undefined && data.target !== undefined) {
      // Link tooltip
      return (
        <div className="overflow-hidden rounded-md shadow-lg border-0 bg-background/95 backdrop-blur-sm">
          <div className="px-3 py-2 bg-primary text-primary-foreground text-sm font-semibold">
            Call Flow
          </div>
          <div className="px-3 py-2 text-sm space-y-0.5">
            <div className="text-muted-foreground">
              From: <span className="font-semibold text-foreground">{sankeyData.nodes[data.source].name}</span>
            </div>
            <div className="text-muted-foreground">
              To: <span className="font-semibold text-foreground">{sankeyData.nodes[data.target].name}</span>
            </div>
            <div className="text-muted-foreground">
              Count: <span className="font-semibold text-foreground">{data.value}</span>
            </div>
          </div>
        </div>
      );
    } else {
      // Node tooltip
      return (
        <div className="overflow-hidden rounded-md shadow-lg border-0 bg-background/95 backdrop-blur-sm">
          <div className="px-3 py-2 bg-primary text-primary-foreground text-sm font-semibold">
            {data.name}
          </div>
          <div className="px-3 py-2 text-sm">
            <div className="text-muted-foreground">
              Total: <span className="font-semibold text-foreground">{data.value || 'N/A'}</span>
            </div>
          </div>
        </div>
      );
    }
  }
  return null;
};

export function AutopilotSankeyChart() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold">Call Flow Analysis</CardTitle>
          <UITooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Visualizes the flow of calls through different stages of the autopilot system</p>
            </TooltipContent>
          </UITooltip>
        </div>
        <p className="text-sm text-muted-foreground">Flow of calls through the autopilot system</p>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <ResponsiveContainer width="100%" height={400}>
                <Sankey
                  data={sankeyData}
                  nodePadding={50}
                  nodeWidth={10}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  link={<CustomLink sourceX={0} targetX={0} sourceY={0} targetY={0} sourceControlX={0} targetControlX={0} linkWidth={0} index={0} />}
                  node={<CustomNode x={0} y={0} width={0} height={0} index={0} payload={{ name: '' }} />}
                >
                  <Tooltip content={<CustomTooltip />} />
                </Sankey>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
