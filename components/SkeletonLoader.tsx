"use client";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("skeleton rounded-lg", className)} />
  );
}

export function ChartSkeleton() {
  return (
    <div className="flex flex-col gap-3 w-full h-full p-4">
      <div className="flex items-end gap-1 flex-1">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="skeleton flex-1 rounded-sm"
            style={{ height: `${Math.round(20 + ((Math.sin(i * 1.5) + 1) / 2) * 60)}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-12" />
        ))}
      </div>
    </div>
  );
}

export function PriceCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="w-9 h-9 rounded-xl" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-3 w-14" />
      </div>
      <div className="text-right space-y-1.5">
        <Skeleton className="h-4 w-20 ml-auto" />
        <Skeleton className="h-3 w-14 ml-auto" />
      </div>
    </div>
  );
}
