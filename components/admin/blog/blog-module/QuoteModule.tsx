"use client";

import { Input, Label } from "@/components/common/Input";
import { Select, SelectOption } from "@/components/common/Select";
import {
  GranularColorPicker,
  FONT_FAMILIES,
  Module
} from "../BlogForm";

interface QuoteModuleProps {
  module: Module;
  onChange: (newProps: Record<string, any>) => void;
}

export default function QuoteModule({ module, onChange }: QuoteModuleProps) {
  const { props } = module;

  const handleChange = (key: string, value: any) => {
    onChange({ ...props, [key]: value });
  };

  return (
    <div className="space-y-8">
      <Input label="Quote Content" value={props.children} onChange={(v: string) => handleChange('children', v)} as="textarea" />
      <div className="grid grid-cols-1">
        <Input label="Author" value={props.author} onChange={(v: string) => handleChange('author', v)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Input label="Author Dates" value={props.authorDates} onChange={(v: string) => handleChange('authorDates', v)} />
        <Input label="Author Info" value={props.authorInfo} onChange={(v: string) => handleChange('authorInfo', v)} />

        <div className="md:col-span-2 space-y-6">
          <GranularColorPicker
            label="Text Color"
            value={props.colorClassName}
            onChange={(v: string) => handleChange('colorClassName', v)}
          />
          <GranularColorPicker
            label="Background Color"
            value={props.bgColorClassName}
            onChange={(v: string) => handleChange('bgColorClassName', v)}
            mode="bg"
          />
        </div>
      </div>
        <div className="grid grid-cols-1">

          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select value={props.fontFamily} onChange={(v: string) => handleChange('fontFamily', v)} size="lg" fullWidth>
              {FONT_FAMILIES.map((font: { id: string; label: string }) => (
                <SelectOption key={font.id} value={font.id}>{font.label}</SelectOption>
              ))}
            </Select>
          </div>
        </div>
    </div>
  );
}
