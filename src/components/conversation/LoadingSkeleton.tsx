import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-32" />
        ))}
      </div>
      <div className="border rounded-lg">
        <div className="border-b p-3">
          <div className="flex gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-24" />
            ))}
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border-b last:border-0 p-3">
            <div className="flex gap-4">
              {[...Array(8)].map((_, j) => (
                <Skeleton key={j} className="h-4 w-24" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
