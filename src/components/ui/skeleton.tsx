import { Skeleton as AntSkeleton } from "antd";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-md overflow-hidden", className)} {...props}>
      <AntSkeleton.Button active block style={{ width: '100%', height: '100%', minHeight: 'inherit' }} />
    </div>
  );
}

export { Skeleton };
