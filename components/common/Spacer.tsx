"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SpacerProps {
  height?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | string;
  type?: "spacer" | "divider";
  lineColor?: "coconut" | "celadon" | "blue" | "green" | "rosewood" | "almond" | "transparent";
  opacity?: number;
  className?: string;
  lineWidth?: string; // e.g. "100%", "50%", "200px"
  lineHeight?: "1" | "2" | "4" | "8" | "16" | "24" | "32";
}

const heightMap: Record<string, string> = {
  xs: "h-4",
  sm: "h-8",
  md: "h-16",
  lg: "h-24",
  xl: "h-32",
  "2xl": "h-48",
};

const colorMap: Record<string, string> = {
  coconut: "bg-custom-coconut",
  celadon: "bg-custom-celadon",
  blue: "bg-custom-blue",
  green: "bg-custom-green",
  rosewood: "bg-custom-rosewood",
  almond: "bg-custom-almond",
  transparent: "bg-transparent",
};

const thicknessMap: Record<string, string> = {
  "1": "h-px",
  "2": "h-0.5",
  "4": "h-1",
  "8": "h-2",
  "16": "h-4",
  "24": "h-6",
  "32": "h-8",
};

export default function Spacer({
  height = "md",
  type = "spacer",
  lineColor = "transparent",
  opacity = 0.2,
  className = "",
  lineWidth = "100%",
  lineHeight = "1",
}: SpacerProps) {
  const hClass = heightMap[height] || "";
  const hStyle = !heightMap[height] ? { height } : {};

  return (
    <div 
      className={cn("w-full flex items-center justify-center", hClass, className)} 
      style={hStyle}
    >
      {type === "divider" && (
        <div 
          className={cn(thicknessMap[lineHeight] || "h-px", colorMap[lineColor])} 
          style={{ width: lineWidth, opacity }}
        />
      )}
    </div>
  );
}
