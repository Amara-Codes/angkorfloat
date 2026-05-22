"use client";

import { useState } from "react";
import { Input, Label } from "@/components/common/Input";
import { Select, SelectOption } from "@/components/common/Select";
import {
  ImageUpload,
  OpacitySelector,
  GranularColorPicker,
  SITE_COLORS,
  resolveMediaUrl,
  Module
} from "../BlogForm";

interface SimpleHeroModuleProps {
  module: Module;
  onChange: (newProps: Record<string, any>) => void;
}

export default function SimpleHeroModule({ module, onChange }: SimpleHeroModuleProps) {
  const { props } = module;
  const [modulePreview, setModulePreview] = useState<string | null>(resolveMediaUrl(props.imageSrc));

  const handleChange = (key: string, value: any) => {
    onChange({ ...props, [key]: value });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1  gap-8">
        <Input label="Title" value={props.title} onChange={(v: string) => handleChange('title', v)} />
      <GranularColorPicker
          label="Title Color"
          value={props.titleColorClassName}
          onChange={(v: string) => handleChange('titleColorClassName', v)}
        />
      </div>
      <div className="grid grid-cols-1  gap-8">
        <Input label="Subtitle" value={props.subtitle} onChange={(v: string) => handleChange('subtitle', v)} />
      <GranularColorPicker
          label="Subtitle Color"
          value={props.subtitleColorClassName}
          onChange={(v: string) => handleChange('subtitleColorClassName', v)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label>Align</Label>
          <Select value={props.align} onChange={(v: string) => handleChange('align', v)} size="lg">
            <SelectOption value="left">Left</SelectOption>
            <SelectOption value="center">Center</SelectOption>
            <SelectOption value="right">Right</SelectOption>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>V Align</Label>
          <Select value={props.vAlign} onChange={(v: string) => handleChange('vAlign', v)} size="lg">
            <SelectOption value="top">Top</SelectOption>
            <SelectOption value="center">Center</SelectOption>
            <SelectOption value="bottom">Bottom</SelectOption>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1  gap-8">
        <Label>Hero Image</Label>
        <ImageUpload
          name={`module_${module.id}_image`}
          preview={modulePreview}
          onPreviewChange={(v: string | null) => {
            setModulePreview(v);
            handleChange('imageSrc', v);
          }}
        />
                <Input label="Image Alt" value={props.imageAlt} onChange={(v: string) => handleChange('imageAlt', v)} />
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label>Light Mode Overlay Color</Label>
          <Select value={props.lightOverlayColor} onChange={(v: string) => handleChange('lightOverlayColor', v)} size="lg">
            {SITE_COLORS.map((c: { id: string; label: string }) => (
              <SelectOption key={c.id} value={c.id}>{c.label}</SelectOption>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Dark Mode Overlay Color</Label>
          <Select value={props.darkOverlayColor} onChange={(v: string) => handleChange('darkOverlayColor', v)} size="lg">
            {SITE_COLORS.map((c: { id: string; label: string }) => (
              <SelectOption key={c.id} value={c.id}>{c.label}</SelectOption>
            ))}
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <OpacitySelector
          label="Overlay Opacity"
          value={props.overlayOpacity}
          onChange={(v: number) => handleChange('overlayOpacity', v)}
        />
      </div>



    </div>
  );
}
