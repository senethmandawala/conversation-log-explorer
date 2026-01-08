import React, { useState } from "react";
import { 
  Card, 
  Typography, 
  Space, 
  Skeleton,
  Tooltip
} from "antd";
import { 
  ShareAltOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import {
  Sankey,
  Layer,
  Rectangle,
  ResponsiveContainer,
} from "recharts";

const { Title, Text } = Typography;

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
        rx={6}
        ry={6}
        className="cursor-move hover:fill-opacity-100 transition-all duration-200"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          transition: 'all 0.2s ease-in-out'
        }}
        onMouseDown={(e) => onMouseDown?.(e, index, payload)}
        onMouseEnter={(e) => onMouseEnter?.(e, index, payload)}
        onMouseLeave={onMouseLeave}
      />
      {/* External label with Bootstrap styling */}
      <text
        textAnchor="middle"
        x={x + width / 2}
        y={y - 8}
        fontSize="12"
        fill="#374151"
        fontWeight="600"
        pointerEvents="none"
        className="text-xs font-semibold"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}
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
  setTooltipData,
}: CustomLinkProps & { source?: number; target?: number; value?: number; setTooltipData: (data: { x: number; y: number; content: React.ReactNode } | null) => void }) => {
  const showTooltip = (e: React.MouseEvent) => {
    const content = (
      <div 
        style={{ 
          minWidth: 140, 
          borderRadius: 8,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          backdropFilter: 'blur(8px)'
        }}
        className="bg-white"
      >
        <div 
          style={{ 
            fontSize: 14, 
            fontWeight: 600, 
            padding: '10px 14px', 
            backgroundColor: COLORS[0], 
            color: 'white',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
          className="font-semibold"
        >
          Call Flow
        </div>
        <div style={{ padding: '10px 14px', backgroundColor: '#ffffff' }}>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }} className="text-muted">
            From: <span style={{ fontWeight: 600, color: '#111827', marginLeft: 4 }} className="text-dark font-semibold">{sankeyData.nodes[source || 0].name}</span>
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }} className="text-muted">
            To: <span style={{ fontWeight: 600, color: '#111827', marginLeft: 4 }} className="text-dark font-semibold">{sankeyData.nodes[target || 0].name}</span>
          </div>
          <div style={{ fontSize: 12, color: '#6b7280' }} className="text-muted">
            Count: <span style={{ fontWeight: 600, color: '#111827', marginLeft: 4 }} className="text-dark font-semibold">{value}</span>
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

// Create a wrapped CustomLink that receives setTooltipData
const createCustomLink = (setTooltipData: (data: { x: number; y: number; content: React.ReactNode } | null) => void) => {
  return (props: CustomLinkProps & { source?: number; target?: number; value?: number }) => (
    <CustomLink
      {...props}
      setTooltipData={setTooltipData}
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
      <div 
        style={{ 
          minWidth: 120, 
          borderRadius: 6,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          border: 'none',
          overflow: 'hidden'
        }}
      >
        <div 
          style={{ 
            fontSize: 14, 
            fontWeight: 600, 
            padding: '8px 12px', 
            backgroundColor: COLORS[index % COLORS.length], 
            color: 'white' 
          }}
        >
          {payload.name}
        </div>
        <div style={{ padding: '8px 12px', backgroundColor: '#f5f5f5' }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 2 }}>
            Total Flow: <span style={{ fontWeight: 600, color: '#333' }}>N/A</span>
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
        <div 
          style={{ 
            minWidth: 120, 
            borderRadius: 6,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            border: 'none',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{ 
              fontSize: 14, 
              fontWeight: 600, 
              padding: '8px 12px', 
              backgroundColor: COLORS[draggedNode.index % COLORS.length], 
              color: 'white' 
            }}
          >
            {draggedNode.payload.name}
          </div>
          <div style={{ padding: '8px 12px', backgroundColor: '#f5f5f5' }}>
            <div style={{ fontSize: 12, color: '#666' }}>
              Position: <span style={{ fontWeight: 600, color: '#333' }}>({e.clientX}, {e.clientY})</span>
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

  const WrappedCustomLink = createCustomLink(setTooltipData);

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
    <Card
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
                <ShareAltOutlined style={{ fontSize: 20 }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                    Call Flow Analysis
                  </Title>
                  <Tooltip title="Visualizes the flow of calls through different stages of the autopilot system">
                    <div style={{ marginTop: '-4px' }}>
                      <InfoCircleOutlined 
                        style={{ fontSize: 14, color: '#64748b' }}
                      />
                    </div>
                  </Tooltip>
                </div>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  Flow of calls through the autopilot system
                </Text>
              </div>
            </Space>
          </div>
        </div>

        {/* Chart Content */}
        <div style={{ marginTop: 30 }}>
          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <div className="overflow-x-auto">
              <div style={{ minWidth: '900px', height: '450px' }}>
                <ResponsiveContainer width="100%" height={450}>
                  <Sankey
                    data={sankeyData}
                    nodePadding={60}
                    nodeWidth={12}
                    margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                    link={WrappedCustomLink}
                    node={WrappedCustomNode}
                  >
                  </Sankey>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Custom Tooltip */}
        {tooltipData && (
          <div
            style={{
              position: 'fixed',
              zIndex: 50,
              pointerEvents: 'none',
              left: tooltipData.x + 10,
              top: tooltipData.y - 10,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {tooltipData.content}
          </div>
        )}
      </Space>
    </Card>
  );
}
