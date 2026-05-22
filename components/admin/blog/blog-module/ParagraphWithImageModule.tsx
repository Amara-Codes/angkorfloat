"use client";

import { useState } from "react";
import { Input, Label } from "@/components/common/Input";
import { Select, SelectOption } from "@/components/common/Select";
import {
  ImageUpload,
  Toggle,
  OpacitySelector,
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-8">
        <Input label="Content Text" value={props.children} onChange={(v: string) => handleChange('children', v)} as="textarea" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

      <div className="grid grid-cols-1 gap-8">

        <GranularColorPicker
          label="Text Color"
          value={props.colorClassName}
          onChange={(v: string) => handleChange('colorClassName', v)}
        />
      </div>
      <div>
        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select value={props.fontFamily} onChange={(v: string) => handleChange('fontFamily', v)} size="lg" fullWidth>
            {FONT_FAMILIES.map((font: { id: string; label: string }) => (
              <SelectOption key={font.id} value={font.id}>{font.label}</SelectOption>
            ))}
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 mt-16">
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
      </div>
      <div className="grid grid-cols-1 gap-6">
        <Input label="Image Alt" value={props.imageAlt} onChange={(v: string) => handleChange('imageAlt', v)} />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col justify-end">
            <div className="flex items-center justify-between p-4 bg-custom-blue/2 dark:bg-custom-coconut/2 rounded-2xl border-2 border-custom-blue/5 dark:border-custom-coconut/5 min-h-[66px]">
              <Label className="mb-0">Parallax</Label>
              <Toggle checked={props.parallax} onChange={(v: boolean) => handleChange('parallax', v)} />
            </div>
          </div>

          <Input label="Parallax Speed" value={String(props.parallaxSpeed)} onChange={(v: string) => handleChange('parallaxSpeed', parseFloat(v))} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8">

        <OpacitySelector
          label="Overlay Opacity"
          value={props.overlayOpacity}
          onChange={(v: number) => handleChange('overlayOpacity', v)}
        />
      </div>
    </div>
  );
}
