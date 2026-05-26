"use client";

import { useState, useRef } from "react";
import { Input, Label } from "@/components/common/Input";
import { Select, SelectOption } from "@/components/common/Select";
import {
  ImageUpload,
  Toggle,
  OpacitySelector,
  GranularColorPickerButton,
  GranularColorPicker,
  FONT_FAMILIES,
  resolveMediaUrl,
  Module
} from "../BlogForm";

interface ParagraphWithImageModuleProps {
  module: Module;
  onChange: (newProps: Record<string, any>) => void;
}

export default function ParagraphWithImageModule({ module, onChange }: ParagraphWithImageModuleProps) {
  const { props } = module;
  const [modulePreview, setModulePreview] = useState<string | null>(resolveMediaUrl(props.imageSrc));

  const handleChange = (key: string, value: any) => {
    onChange({ ...props, [key]: value });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="space-y-4 mb-16">
        <Input label="Content Text" value={props.children} onChange={(v: string) => handleChange('children', v)} as="textarea" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Size</Label>
            <Select value={props.size} onChange={(v: string) => handleChange('size', v)} size="lg">
              {['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'].map(s => (
                <SelectOption key={s} value={s}>{s}</SelectOption>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Weight</Label>
            <Select value={props.weight} onChange={(v: string) => handleChange('weight', v)} size="lg">
              <SelectOption value="normal">Normal</SelectOption>
              <SelectOption value="medium">Medium</SelectOption>
              <SelectOption value="bold">Bold</SelectOption>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <GranularColorPickerButton
            label="Text Color"
            value={props.colorClassName}
            onChange={(v: string) => handleChange('colorClassName', v)}
          />
          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select value={props.fontFamily} onChange={(v: string) => handleChange('fontFamily', v)} size="lg">
              {FONT_FAMILIES.map((font: { id: string; label: string }) => (
                <SelectOption key={font.id} value={font.id}>{font.label}</SelectOption>
              ))}
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-16">
        <div className="space-y-4">
          <Label>Paragraph Image</Label>
          <ImageUpload
            name={`module_${module.id}_image`}
            preview={modulePreview}
            onPreviewChange={(v: string | null) => {
              setModulePreview(v);
              handleChange('imageSrc', v);
            }}
          />
        </div>
        <Input label="Image Alt" value={props.imageAlt} onChange={(v: string) => handleChange('imageAlt', v)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Image Position</Label>
            <Select value={props.imagePosition} onChange={(v: string) => handleChange('imagePosition', v)} size="lg">
              <SelectOption value="left">Left</SelectOption>
              <SelectOption value="right">Right</SelectOption>
              <SelectOption value="top">Top</SelectOption>
              <SelectOption value="bottom">Bottom</SelectOption>
              <SelectOption value="background">Background</SelectOption>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Aspect Ratio</Label>
            <Select value={props.imageAspectRatio} onChange={(v: string) => handleChange('imageAspectRatio', v)} size="lg">
              <SelectOption value="square">Square</SelectOption>
              <SelectOption value="video">Video</SelectOption>
              <SelectOption value="portrait">Portrait</SelectOption>
              <SelectOption value="wide">Wide</SelectOption>
              <SelectOption value="auto">Auto</SelectOption>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col justify-end">
            <div className="flex items-center justify-between p-4 bg-custom-blue/2 dark:bg-custom-coconut/2 rounded-2xl border-2 border-custom-blue/5 dark:border-custom-coconut/5 min-h-[66px]">
              <Label className="mb-0">Parallax</Label>
              <Toggle checked={props.parallax} onChange={(v: boolean) => handleChange('parallax', v)} />
            </div>
          </div>

          {props.parallax ? (
            <ParallaxSpeedSelector
              label="Parallax Speed"
              value={props.parallaxSpeed}
              onChange={(v: number) => handleChange('parallaxSpeed', v)}
            />
          ) : (
            <div className="flex items-center justify-center p-4 bg-custom-blue/2 dark:bg-custom-coconut/2 rounded-2xl border-2 border-custom-blue/5 dark:border-custom-coconut/5 min-h-[66px]">
              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-custom-blue/40 dark:text-custom-celadon/40">Parallax Disabled</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <OpacitySelector
          label="Overlay Opacity"
          value={props.overlayOpacity}
          onChange={(v: number) => handleChange('overlayOpacity', v)}
        />
      </div>
    </div>
  );
}

// Custom Parallax Speed Slider [0.05 to 0.75] with step 0.05
function ParallaxSpeedSelector({ value, onChange, label }: { value: number, onChange: (v: number) => void, label: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeValue = value !== undefined && value !== null ? value : 0.3;

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    
    const minVal = 0.05;
    const maxVal = 0.75;
    const step = 0.05;
    
    const rawVal = minVal + pct * (maxVal - minVal);
    const steppedVal = Math.round(rawVal / step) * step;
    const finalVal = Math.min(Math.max(steppedVal, minVal), maxVal);
    
    onChange(parseFloat(finalVal.toFixed(2)));
  };

  const trackPercent = ((activeValue - 0.05) / (0.75 - 0.05)) * 100;

  return (
    <div className="space-y-4 py-2">
      <div className="flex justify-between items-center">
        <Label className="mb-0 text-custom-blue/80! dark:text-custom-celadon/80!">{label}</Label>
        <div className="text-[10px] font-black text-custom-blue dark:text-custom-celadon bg-custom-blue/10 dark:bg-custom-coconut/10 px-3 py-1 rounded-full border border-custom-blue/5 shadow-inner min-w-[45px] text-center transition-all duration-200">
          {activeValue.toFixed(2)}x
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative h-3 w-full bg-custom-blue/10 dark:bg-custom-coconut/5 rounded-full cursor-pointer group touch-none"
        onPointerDown={(e) => {
          handleMove(e.clientX);
          const handlePointerMove = (moveEvent: PointerEvent) => handleMove(moveEvent.clientX);
          const handlePointerUp = () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
          };
          window.addEventListener('pointermove', handlePointerMove);
          window.addEventListener('pointerup', handlePointerUp);
        }}
      >
        {/* Track Glow */}
        <div
          className="absolute inset-0 rounded-full blur-[2px] opacity-20 bg-custom-blue dark:bg-custom-celadon transition-all duration-150"
          style={{ width: `${trackPercent}%` }}
        />

        {/* Progress Bar */}
        <div
          className="absolute top-0 left-0 h-full bg-linear-to-r from-custom-blue to-custom-blue/80 dark:from-custom-celadon dark:to-custom-celadon/80 rounded-full z-10 transition-all duration-150"
          style={{ width: `${trackPercent}%`, opacity: 0.4 + (activeValue / 0.75) * 0.6 }}
        />

        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-7 w-7 bg-custom-coconut dark:bg-custom-blue border-[5px] border-custom-blue dark:border-custom-celadon rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-grab active:cursor-grabbing z-20 hover:scale-110 transition-all duration-150"
          style={{ left: `calc(${trackPercent}% - 14px)` }}
        >
          <div className="absolute inset-0 rounded-full bg-custom-blue/5 dark:bg-custom-coconut/5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
