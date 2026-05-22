"use client";

import { Input, Label } from "@/components/common/Input";
import { Select, SelectOption } from "@/components/common/Select";
import {
  Toggle,
  GranularColorPicker,
  FONT_FAMILIES,
  Module
} from "../BlogForm";

interface ParagraphModuleProps {
  module: Module;
  onChange: (newProps: Record<string, any>) => void;
}

export default function ParagraphModule({ module, onChange }: ParagraphModuleProps) {
  const { props } = module;

  const handleChange = (key: string, value: any) => {
    onChange({ ...props, [key]: value });
  };

  return (
    <div className="space-y-8">
      <Input label="Content Text" value={props.children} onChange={(v: string) => handleChange('children', v)} as="textarea" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>As Tag</Label>
          <Select value={props.as} onChange={(v: string) => handleChange('as', v)} size="lg">
            <SelectOption value="p">p</SelectOption>
            <SelectOption value="span">span</SelectOption>
            <SelectOption value="div">div</SelectOption>
            <SelectOption value="h2">h2</SelectOption>
            <SelectOption value="h1">h1</SelectOption>
          </Select>
        </div>
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
        <div className="space-y-2">
          <Label>Align</Label>
          <Select value={props.align} onChange={(v: string) => handleChange('align', v)} size="lg">
            <SelectOption value="left">Left</SelectOption>
            <SelectOption value="center">Center</SelectOption>
            <SelectOption value="right">Right</SelectOption>
          </Select>
        </div>
        <div className="md:col-span-2">
          <GranularColorPicker
            label="Text Color"
            value={props.colorClassName}
            onChange={(v: string) => handleChange('colorClassName', v)}
          />
        </div>
        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select value={props.fontFamily} onChange={(v: string) => handleChange('fontFamily', v)} size="lg">
            {FONT_FAMILIES.map((font: { id: string; label: string }) => (
              <SelectOption key={font.id} value={font.id}>{font.label}</SelectOption>
            ))}
          </Select>
        </div>
        <div className="flex flex-col justify-end">
          <div className="flex items-center justify-between p-4 bg-custom-blue/2 dark:bg-custom-coconut/2 rounded-2xl border-2 border-custom-blue/5 dark:border-custom-coconut/5 min-h-[66px]">
            <Label className="mb-0">Scroll Reveal</Label>
            <Toggle checked={props.scrollReveal} onChange={(v: boolean) => handleChange('scrollReveal', v)} />
          </div>
        </div>
      </div>
    </div>
  );
}
