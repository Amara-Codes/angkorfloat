"use client";

import { useRef } from "react";
import { Label } from "@/components/common/Input";
import { Select, SelectOption } from "@/components/common/Select";
import {
  OpacitySelector,
  GranularBGColorPickerButton,
  Module
} from "../BlogForm";

interface SpacerModuleProps {
  module: Module;
  onChange: (newProps: Record<string, any>) => void;
}

// Line Width Selector: 10% → 100%, step 10 — stessa UI di OpacitySelector
function LineWidthSelector({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const parseWidth = (v: string): number => {
    const n = parseFloat(v);
    return isNaN(n) ? 100 : Math.min(Math.max(n, 10), 100);
  };

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const stepped = Math.round(pct * 9) * 10 + 10; // 10..100 step 10
    onChange(`${stepped}%`);
  };

  const current = parseWidth(value ?? "100%");
  const progress = (current - 10) / 90; // normalised 0..1

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="mb-0 text-custom-blue/80! dark:text-custom-celadon/80!">{label}</Label>
        <div className="text-[10px] font-black text-custom-blue dark:text-custom-celadon bg-custom-blue/10 dark:bg-custom-coconut/10 px-3 py-1 rounded-full border border-custom-blue/5 shadow-inner min-w-[45px] text-center transition-all duration-200">
          {current}%
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative h-3 w-full bg-custom-blue/10 dark:bg-custom-coconut/5 rounded-full cursor-pointer group touch-none"
        onPointerDown={(e) => {
          handleMove(e.clientX);
          const handlePointerMove = (moveEvent: PointerEvent) => handleMove(moveEvent.clientX);
          const handlePointerUp = () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
          };
          window.addEventListener("pointermove", handlePointerMove);
          window.addEventListener("pointerup", handlePointerUp);
        }}
      >
        <div
          className="absolute inset-0 rounded-full blur-[2px] opacity-20 bg-custom-blue dark:bg-custom-celadon transition-all duration-150"
          style={{ width: `${progress * 100}%` }}
        />
        <div
          className="absolute top-0 left-0 h-full bg-linear-to-r from-custom-blue to-custom-blue/80 dark:from-custom-celadon dark:to-custom-celadon/80 rounded-full z-10 transition-all duration-150"
          style={{ width: `${progress * 100}%`, opacity: 0.4 + progress * 0.6 }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-7 w-7 bg-custom-coconut dark:bg-custom-blue border-[5px] border-custom-blue dark:border-custom-celadon rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-grab active:cursor-grabbing z-20 hover:scale-110 transition-all duration-150"
          style={{ left: `calc(${progress * 100}% - 14px)` }}
        >
          <div className="absolute inset-0 rounded-full bg-custom-blue/5 dark:bg-custom-coconut/5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function SpacerModule({ module, onChange }: SpacerModuleProps) {
  const { props } = module;

  const handleChange = (key: string, value: any) => {
    onChange({ ...props, [key]: value });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">

      {/* Block 1: Height + Type */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Height / Size</Label>
            <Select value={props.height} onChange={(v) => handleChange("height", v)} size="lg">
              <SelectOption value="xs">Extra Small (16px)</SelectOption>
              <SelectOption value="sm">Small (32px)</SelectOption>
              <SelectOption value="md">Medium (64px)</SelectOption>
              <SelectOption value="lg">Large (96px)</SelectOption>
              <SelectOption value="xl">Extra Large (128px)</SelectOption>
              <SelectOption value="2xl">Huge (192px)</SelectOption>
              <SelectOption value="10vh">10vh</SelectOption>
              <SelectOption value="20vh">20vh</SelectOption>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={props.type} onChange={(v) => handleChange("type", v)} size="lg">
              <SelectOption value="spacer">Empty Space</SelectOption>
              <SelectOption value="divider">Horizontal Line</SelectOption>
            </Select>
          </div>
        </div>
      </div>

      {/* Block 2: Divider options (conditional) */}
      {props.type === "divider" && (
        <>
          {/* Line Color light + dark */}
          <div className="space-y-4 mb-16">
            <div className="grid grid-cols-2 gap-4">
              <GranularBGColorPickerButton
                label="Line Color - Light Mode"
                value={props.lineColorClassName}
                onChange={(v: string) => handleChange("lineColorClassName", v)}
                themeMode="light"
              />
              <GranularBGColorPickerButton
                label="Line Color - Dark Mode"
                value={props.lineColorClassNameDark}
                onChange={(v: string) => handleChange("lineColorClassNameDark", v)}
                themeMode="dark"
              />
            </div>
          </div>

          {/* Thickness */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Line Thickness</Label>
              <Select value={props.lineHeight} onChange={(v) => handleChange("lineHeight", v)} size="lg">
                <SelectOption value="1">1 (Hairline)</SelectOption>
                <SelectOption value="2">2 (Thin)</SelectOption>
                <SelectOption value="4">4 (Standard)</SelectOption>
                <SelectOption value="8">8 (Thick)</SelectOption>
                <SelectOption value="16">16 (Heavy)</SelectOption>
                <SelectOption value="24">24 (Extra Heavy)</SelectOption>
                <SelectOption value="32">32 (Extreme)</SelectOption>
              </Select>
            </div>
          </div>

          {/* Width + Opacity sliders */}
          <div className="space-y-4">
              <LineWidthSelector
                label="Line Width"
                value={props.lineWidth ?? "100%"}
                onChange={(v) => handleChange("lineWidth", v)}
              />
              <OpacitySelector
                label="Line Opacity"
                value={props.opacity ?? 0.2}
                onChange={(v) => handleChange("opacity", v)}
              />
            </div>
        </>
      )}

    </div>
  );
}
