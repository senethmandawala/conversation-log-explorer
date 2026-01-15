import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface SubCategoryListProps {
  category: { name: string; color: string };
  level: 3 | 4 | 5;
  breadcrumb: string[];
  onSubCategorySelect: (subCategory: string) => void;
}

const level3Data: Record<string, { name: string; value: number }[]> = {
  "Invoice Disputes": [
    { name: "Incorrect Amount", value: 45 },
    { name: "Missing Discount", value: 35 },
    { name: "Duplicate Charge", value: 25 },
    { name: "Late Fee Issues", value: 15 },
  ],
  "Payment Failed": [
    { name: "Card Declined", value: 40 },
    { name: "Bank Error", value: 30 },
    { name: "Invalid Details", value: 15 },
    { name: "Expired Card", value: 10 },
  ],
  "Login Problems": [
    { name: "Forgot Password", value: 35 },
    { name: "Account Locked", value: 30 },
    { name: "2FA Issues", value: 20 },
    { name: "Session Expired", value: 10 },
  ],
};

const level4Data: Record<string, { name: string; value: number }[]> = {
  "Incorrect Amount": [
    { name: "Overcharged", value: 20 },
    { name: "Undercharged", value: 15 },
    { name: "Wrong Rate", value: 10 },
  ],
  "Card Declined": [
    { name: "Insufficient Funds", value: 18 },
    { name: "Card Expired", value: 12 },
    { name: "Bank Block", value: 10 },
  ],
  "Forgot Password": [
    { name: "Email Not Received", value: 15 },
    { name: "Link Expired", value: 12 },
    { name: "Wrong Email", value: 8 },
  ],
};

const level5Data: Record<string, { name: string; value: number }[]> = {
  "Overcharged": [
    { name: "Tax Error", value: 10 },
    { name: "Promo Not Applied", value: 7 },
    { name: "System Glitch", value: 3 },
  ],
  "Insufficient Funds": [
    { name: "Account Empty", value: 10 },
    { name: "Hold on Funds", value: 5 },
    { name: "Pending Transactions", value: 3 },
  ],
};

function generateShades(baseColor: string, count: number): string[] {
  const hslMatch = baseColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!hslMatch) return Array(count).fill(baseColor);
  
  const [, h, s, l] = hslMatch;
  const lightness = parseInt(l);
  
  return Array.from({ length: count }, (_, i) => {
    const newLightness = lightness - (i * 8);
    return `hsl(${h}, ${s}%, ${Math.max(20, newLightness)}%)`;
  });
}

export function SubCategoryList({ category, level, breadcrumb, onSubCategorySelect }: SubCategoryListProps) {
  const lastItem = breadcrumb[breadcrumb.length - 1];
  
  let data: { name: string; value: number }[] = [];
  if (level === 3) {
    data = level3Data[lastItem] || [
      { name: "Type A", value: 30 },
      { name: "Type B", value: 25 },
      { name: "Type C", value: 15 },
    ];
  } else if (level === 4) {
    data = level4Data[lastItem] || [
      { name: "Detail A", value: 15 },
      { name: "Detail B", value: 10 },
      { name: "Detail C", value: 5 },
    ];
  } else if (level === 5) {
    data = level5Data[lastItem] || [
      { name: "Sub-detail A", value: 8 },
      { name: "Sub-detail B", value: 5 },
      { name: "Sub-detail C", value: 3 },
    ];
  }
  
  const colors = generateShades(category.color, data.length);
  
  const chartData = data.map((item, idx) => ({
    ...item,
    fill: colors[idx],
  }));

  const handleClick = (data: any) => {
    if (data?.activePayload?.[0]?.payload?.name) {
      onSubCategorySelect(data.activePayload[0].payload.name);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 mt-4">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
            onClick={handleClick}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
            <XAxis 
              dataKey="name" 
              stroke="#666" 
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#666" 
              fontSize={11}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e8e8e8",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} cursor="pointer">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-xs text-center text-gray-500 mt-2 pt-2 border-t border-gray-100"></div>
    </div>
  );
}
