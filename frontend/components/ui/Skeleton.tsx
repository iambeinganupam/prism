"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-surface-alt border border-line",
        className
      )}
      {...props}
    />
  );
};

export const CardSkeleton: React.FC<{ rows?: number; className?: string }> = ({
  rows = 3,
  className,
}) => {
  return (
    <div className={cn("editorial-tile bg-surface p-6 border border-line space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-14 w-1/2" />
      <div className="space-y-2 pt-2 border-t border-line">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
    </div>
  );
};
