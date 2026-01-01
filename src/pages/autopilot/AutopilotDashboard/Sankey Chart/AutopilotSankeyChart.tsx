import React, { useState } from "react";
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

const CustomNode = ({ x, y, width, height, index, payload, onMouseEnter, onMouseLeave, onMouseDown }: CustomNodeProps & {
  onMouseEnter?: (e: React.MouseEvent, index: number, payload: SankeyNode) => void;
  onMouseLeave?: () => void;
  onMouseDown?: (e: React.MouseEvent, index: number, payload: SankeyNode) => void;
}) => {
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
        className="cursor-move hover:fill-opacity-100 transition-all"
        onMouseDown={(e) => onMouseDown?.(e, index, payload)}
        onMouseEnter={(e) => onMouseEnter?.(e, index, payload)}
        onMouseLeave={onMouseLeave}
      />
      {/* External label only */}
      <text
        textAnchor="middle"
        x={x + width / 2}
        y={y - 8}
        fontSize="12"
        fill="#374151"
        fontWeight="600"
        pointerEvents="none"
      >
        {payload.name}
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
  source,
  target,
  value,
}: CustomLinkProps & { source?: number; target?: number; value?: number }) => {
  const showTooltip = (e: React.MouseEvent) => {
    const content = (
      <div className="overflow-hidden rounded-md shadow-lg border-0" style={{ minWidth: 120 }}>
        <div 
          className="text-sm font-semibold px-3 py-2" 
          style={{ backgroundColor: COLORS[0], color: "white" }}
        >
          Call Flow
        </div>
        <div className="bg-muted px-3 py-2 text-sm space-y-0.5">
          <div className="text-muted-foreground">
            From: <span className="font-semibold text-foreground">{sankeyData.nodes[source || 0].name}</span>
          </div>
          <div className="text-muted-foreground">
            To: <span className="font-semibold text-foreground">{sankeyData.nodes[target || 0].name}</span>
          </div>
          <div className="text-muted-foreground">
            Count: <span className="font-semibold text-foreground">{value}</span>
          </div>
        </div>
      </div>
    );
    
    const event = e as any;
    event.target?.dispatchEvent(new CustomEvent('show-tooltip', { detail: content }));
  };

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
        className="hover:stroke-opacity-50 transition-all cursor-pointer"
        onMouseEnter={showTooltip}
        onMouseLeave={() => {
          const event = new Event('hide-tooltip');
          document.dispatchEvent(event);
        }}
      />
    </Layer>
  );
};

// Create a wrapped CustomNode that receives handlers
const createCustomNode = (handlers: {
  onMouseEnter: (e: React.MouseEvent, index: number, payload: SankeyNode) => void;
  onMouseLeave: () => void;
  onMouseDown: (e: React.MouseEvent, index: number, payload: SankeyNode) => void;
}) => {
  return (props: CustomNodeProps) => (
    <CustomNode
      {...props}
      onMouseEnter={handlers.onMouseEnter}
      onMouseLeave={handlers.onMouseLeave}
      onMouseDown={handlers.onMouseDown}
    />
  );
};

export function AutopilotSankeyChart() {
  const [isLoading, setIsLoading] = useState(false);
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    content: React.ReactNode;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState<{ index: number; payload: SankeyNode } | null>(null);

  const handleNodeMouseEnter = (e: React.MouseEvent, index: number, payload: SankeyNode) => {
    const content = (
      <div className="overflow-hidden rounded-md shadow-lg border-0" style={{ minWidth: 120 }}>
        <div 
          className="text-sm font-semibold px-3 py-2" 
          style={{ backgroundColor: COLORS[index % COLORS.length], color: "white" }}
        >
          {payload.name}
        </div>
        <div className="bg-muted px-3 py-2 text-sm space-y-0.5">
          <div className="text-muted-foreground">
            Total Flow: <span className="font-semibold text-foreground">N/A</span>
          </div>
        </div>
      </div>
    );
    
    setTooltipData({
      x: e.clientX,
      y: e.clientY,
      content
    });
  };

  const handleNodeMouseLeave = () => {
    setTooltipData(null);
  };

  const handleNodeMouseDown = (e: React.MouseEvent, index: number, payload: SankeyNode) => {
    setIsDragging(true);
    setDraggedNode({ index, payload });
    e.preventDefault();
  };

  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (isDragging && draggedNode) {
      const content = (
        <div className="overflow-hidden rounded-md shadow-lg border-0" style={{ minWidth: 120 }}>
          <div 
            className="text-sm font-semibold px-3 py-2" 
            style={{ backgroundColor: COLORS[draggedNode.index % COLORS.length], color: "white" }}
          >
            {draggedNode.payload.name}
          </div>
          <div className="bg-muted px-3 py-2 text-sm space-y-0.5">
            <div className="text-muted-foreground">
              Position: <span className="font-semibold text-foreground">({e.clientX}, {e.clientY})</span>
            </div>
          </div>
        </div>
      );
      
      setTooltipData({
        x: e.clientX,
        y: e.clientY,
        content
      });
    } else if (tooltipData) {
      setTooltipData(prev => prev ? {
        ...prev,
        x: e.clientX,
        y: e.clientY
      } : null);
    }
  };

  const handleGlobalMouseUp = () => {
    setIsDragging(false);
    setDraggedNode(null);
  };

  const WrappedCustomNode = createCustomNode({
  onMouseEnter: handleNodeMouseEnter,
  onMouseLeave: handleNodeMouseLeave,
  onMouseDown: handleNodeMouseDown,
});

React.useEffect(() => {
    const handleShowTooltip = (e: Event) => {
      const customEvent = e as CustomEvent;
      setTooltipData({
        x: (customEvent as any).clientX || 0,
        y: (customEvent as any).clientY || 0,
        content: customEvent.detail
      });
    };

    const handleHideTooltip = () => {
      setTooltipData(null);
    };

    document.addEventListener('show-tooltip', handleShowTooltip);
    document.addEventListener('hide-tooltip', handleHideTooltip);
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('show-tooltip', handleShowTooltip);
      document.removeEventListener('hide-tooltip', handleHideTooltip);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [tooltipData, isDragging, draggedNode, handleGlobalMouseMove, handleGlobalMouseUp]);

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
            <div className="min-w-[800px]">
              <ResponsiveContainer width="100%" height={450}>
                <Sankey
                  data={sankeyData}
                  nodePadding={60}
                  nodeWidth={12}
                  margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                  link={CustomLink}
                  node={WrappedCustomNode}
                >
                </Sankey>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Custom Tooltip */}
      {tooltipData && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltipData.x + 10,
            top: tooltipData.y - 10,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {tooltipData.content}
        </div>
      )}
    </Card>
  );
}
