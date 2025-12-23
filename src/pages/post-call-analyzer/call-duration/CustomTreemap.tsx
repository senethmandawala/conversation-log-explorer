import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TreemapData {
  name: string;
  value: number;
  fill: string;
}

interface CustomTreemapProps {
  data: TreemapData[];
  width: number;
  height: number;
  onCategoryClick: (name: string) => void;
}

export function CustomTreemap({ data, width, height, onCategoryClick }: CustomTreemapProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const boxes = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const size = percentage > 25 ? 'col-span-2' : 'col-span-1';
    const boxHeight = percentage > 25 ? 'h-32' : percentage > 18 ? 'h-28' : 'h-24';
    
    return { ...item, size, boxHeight, percentage };
  });

  return (
    <div className="grid grid-cols-2 gap-2" style={{ height: `${height}px` }}>
      {boxes.map((item, index) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <div
              className={`${item.size} ${item.boxHeight} rounded-lg p-4 flex flex-col justify-center items-center text-white transition-all hover:scale-[1.02] cursor-pointer shadow-md`}
              style={{ backgroundColor: item.fill }}
              onClick={() => onCategoryClick(item.name)}
            >
              <p className="text-sm font-semibold text-center mb-2">{item.name}</p>
              <p className="text-3xl font-bold">{item.value}</p>
              <p className="text-xs opacity-90 mt-1">{item.value} calls</p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <p className="font-semibold">{item.name}</p>
              </div>
              <p className="text-sm"><span className="font-medium">Average Call Duration:</span> {Math.floor(Math.random() * 15) + 5}min {Math.floor(Math.random() * 60)}sec</p>
              <p className="text-sm"><span className="font-medium">Call Duration:</span> {item.value * (Math.floor(Math.random() * 10) + 8)}min {Math.floor(Math.random() * 60)}sec</p>
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
