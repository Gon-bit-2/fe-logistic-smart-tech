import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({
  columns = 4,
  rows = 5,
  className = "",
}: {
  columns?: number;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-xl border border-outline-variant/15 bg-surface-container-lowest ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-outline-variant/15 bg-surface-container-low/30">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={`th-${i}`} className="px-6 py-4">
                  <Skeleton className="h-4 w-24" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={`tr-${rowIndex}`}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={`td-${rowIndex}-${colIndex}`} className="px-6 py-5">
                    {colIndex === 0 ? (
                      <div className="flex items-center gap-4">
                        <Skeleton className="size-12 shrink-0 rounded-xl" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    ) : (
                      <Skeleton className="h-4 w-20" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
