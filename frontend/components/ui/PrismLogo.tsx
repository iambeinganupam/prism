"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface PrismLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number;
  variant?: "icon" | "full" | "stacked" | "hero";
  showBadge?: boolean;
  badgeText?: string;
  subtitle?: string;
  href?: string;
  className?: string;
  imgClassName?: string;
  animated?: boolean;
  priority?: boolean;
}

const SIZE_MAP = {
  xs: { px: 18, className: "w-[18px] h-[18px]" },
  sm: { px: 24, className: "w-6 h-6" },
  md: { px: 32, className: "w-8 h-8" },
  lg: { px: 40, className: "w-10 h-10" },
  xl: { px: 56, className: "w-14 h-14" },
  "2xl": { px: 84, className: "w-[84px] h-[84px]" },
};

export const PrismLogo: React.FC<PrismLogoProps> = ({
  size = "md",
  variant = "full",
  showBadge = true,
  badgeText = "AICTE",
  subtitle,
  href,
  className,
  imgClassName,
  animated = false,
  priority = true,
}) => {
  const sizeConfig = typeof size === "number" 
    ? { px: size, className: "" } 
    : SIZE_MAP[size] || SIZE_MAP.md;

  const widthPx = typeof size === "number" ? size : sizeConfig.px;
  // Calculate proportional height based on 1024:806 aspect ratio
  const heightPx = Math.round(widthPx * (806 / 1024));

  const logoImage = (
    <div
      className={cn(
        "relative shrink-0 flex items-center justify-center transition-transform duration-300",
        animated && "group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(242,140,40,0.5)]",
        typeof size === "string" ? sizeConfig.className : "",
        imgClassName
      )}
      style={typeof size === "number" ? { width: `${size}px`, height: `${size}px` } : undefined}
    >
      <Image
        src="/logo.png"
        alt="PRISM Logo"
        width={widthPx}
        height={heightPx}
        priority={priority}
        style={{ width: "auto", height: "auto" }}
        className="max-w-full max-h-full object-contain filter drop-shadow-sm select-none"
      />
    </div>
  );

  const textContent = (
    <div className="flex flex-col min-w-0">
      <div className="flex items-center gap-2">
        <span className="font-display font-black text-2xl tracking-tight text-white leading-none">
          PRISM<span className="text-coral">.</span>
        </span>
        {showBadge && (
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-white/10 text-white/90 uppercase tracking-wider">
            {badgeText}
          </span>
        )}
      </div>
      {subtitle && (
        <span className="text-[9px] uppercase tracking-widest text-[#9AA0B5] truncate mt-1">
          {subtitle}
        </span>
      )}
    </div>
  );

  const renderContent = () => {
    if (variant === "icon") {
      return logoImage;
    }

    if (variant === "stacked") {
      return (
        <div className="flex flex-col items-center text-center gap-2">
          {logoImage}
          {textContent}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        {logoImage}
        {textContent}
      </div>
    );
  };

  if (href) {
    return (
      <Link
        href={href}
        className={cn("group flex items-center overflow-hidden", className)}
      >
        {renderContent()}
      </Link>
    );
  }

  return (
    <div className={cn("flex items-center overflow-hidden", className)}>
      {renderContent()}
    </div>
  );
};

