"use client";

import { useState } from "react";
import { Input, Label } from "@/components/common/Input";
import { Select, SelectOption } from "@/components/common/Select";
import {
  ImageUpload,
  GranularColorPicker,
  FONT_FAMILIES,
  resolveMediaUrl,
  Module
} from "../BlogForm";

interface ActionCtaModuleProps {
  module: Module;
  onChange: (newProps: Record<string, any>) => void;
}

export default function ActionCtaModule({ module, onChange }: ActionCtaModuleProps) {
  const { props } = module;
  const [modulePreview, setModulePreview] = useState<string | null>(resolveMediaUrl(props.imageSrc));

  const handleChange = (key: string, value: any) => {
    onChange({ ...props, [key]: value });
  };

  return (
    <div className="space-y-8">
      {/* Media */}
      <div className="grid grid-cols-1 gap-8 items-start">
        <div className="space-y-4">
          <Label>CTA Image (Optional)</Label>
          <ImageUpload
            name={`module_${module.id}_image`}
            preview={modulePreview}
            onPreviewChange={(v) => {
              setModulePreview(v);
              handleChange('imageSrc', v);
            }}
          />
        </div>
        <div className="space-y-6 flex flex-col justify-between h-full">
          <Input label="Image Alt" value={props.imageAlt} onChange={(v) => handleChange('imageAlt', v)} />
          <div className="space-y-2">
            <Label>Image Position</Label>
            <Select value={props.imagePosition} onChange={(v) => handleChange('imagePosition', v)} size="lg">
              <SelectOption value="left">Left</SelectOption>
              <SelectOption value="right">Right</SelectOption>
            </Select>
          </div>
        </div>
      </div>

      <div className="h-px bg-custom-blue/5 dark:bg-custom-coconut/5 my-4" />

      {/* Content */}
      <div className="space-y-6">
        <Input label="Title" value={props.title} onChange={(v) => handleChange('title', v)} />
        <GranularColorPicker
          label="Title Color"
          value={props.titleColorClassName}
          onChange={(v) => handleChange('titleColorClassName', v)}
        />
        <Input label="Paragraph" value={props.paragraph} onChange={(v) => handleChange('paragraph', v)} as="textarea" />

        <GranularColorPicker
          label="Paragraph Color"
          value={props.paragraphColorClassName}
          onChange={(v) => handleChange('paragraphColorClassName', v)}
        />
        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select value={props.fontFamily} onChange={(v) => handleChange('fontFamily', v)} size="lg" fullWidth={true}>
            {FONT_FAMILIES.map(font => (
              <SelectOption key={font.id} value={font.id}>{font.label}</SelectOption>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-4">

        </div>
      </div>

      {/* Buttons */}
      <div className="p-6 rounded-3xl bg-custom-blue/2 dark:bg-custom-coconut/2 border border-custom-blue/5 dark:border-custom-coconut/5 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-custom-blue/60 dark:text-custom-celadon/60">Primary Button</h5>
            <Input label="Label" value={props.buttonOneLabel} onChange={(v) => handleChange('buttonOneLabel', v)} />
            <Input label="Link" value={props.buttonOneLink} onChange={(v) => handleChange('buttonOneLink', v)} />
            <div className="space-y-2">
              <Label>Variant</Label>
              <Select value={props.buttonOneVariant} onChange={(v) => handleChange('buttonOneVariant', v)} size="lg">
                <SelectOption value="primary">Primary</SelectOption>
                <SelectOption value="secondary">Secondary</SelectOption>
                <SelectOption value="outline">Outline</SelectOption>
                <SelectOption value="ghost">Ghost</SelectOption>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-custom-blue/60 dark:text-custom-celadon/60">Secondary Button (Optional)</h5>
            <Input label="Label" value={props.buttonTwoLabel} onChange={(v) => handleChange('buttonTwoLabel', v)} />
            <Input label="Link" value={props.buttonTwoLink} onChange={(v) => handleChange('buttonTwoLink', v)} />
            <div className="space-y-2">
              <Label>Variant</Label>
              <Select value={props.buttonTwoVariant} onChange={(v) => handleChange('buttonTwoVariant', v)} size="lg">
                <SelectOption value="primary">Primary</SelectOption>
                <SelectOption value="secondary">Secondary</SelectOption>
                <SelectOption value="outline">Outline</SelectOption>
                <SelectOption value="ghost">Ghost</SelectOption>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
