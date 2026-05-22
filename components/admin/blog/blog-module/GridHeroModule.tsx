"use client";

import { useState } from "react";
import { Input, Label } from "@/components/common/Input";
import { Select, SelectOption } from "@/components/common/Select";
import { cn } from "@/lib/utils";
import {
  ImageUpload,
  Toggle,
  GranularColorPicker,
  FONT_FAMILIES,
  resolveMediaUrl,
  Module
} from "../BlogForm";

interface GridHeroModuleProps {
  module: Module;
  onChange: (newProps: Record<string, any>) => void;
}

export default function GridHeroModule({ module, onChange }: GridHeroModuleProps) {
  const { props } = module;
  const [modulePreview, setModulePreview] = useState<string | null>(resolveMediaUrl(props.imageSrc));

  const handleChange = (key: string, value: any) => {
    onChange({ ...props, [key]: value });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Phase 1: Media & Position */}
      <div className="grid grid-cols-1 gap-8 items-start">
        <div className="space-y-4">
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
          <Label>Image Position</Label>
          <Select value={props.imagePosition} onChange={(v: string) => handleChange('imagePosition', v)} size="lg">
            <SelectOption value="left">Left</SelectOption>
            <SelectOption value="right">Right</SelectOption>
          </Select>
        </div>
      </div>

      <div className="h-px bg-custom-blue/5 dark:bg-custom-coconut/5 mt-4 mb-8" />

      {/* Phase 2: Top Container (Children Part 1) */}
      <div className="space-y-6 p-6 rounded-3xl bg-custom-blue/2 dark:bg-custom-coconut/2 border border-custom-blue/5 dark:border-custom-coconut/5">
        <div className="mb-8">
          <h5 className="text-sm font-bold uppercase tracking-widest text-center text-custom-blue/60 dark:text-custom-celadon/40">Top Section</h5>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <Input label="Title" value={props.topTitle} onChange={(v: string) => handleChange('topTitle', v)} />
            <GranularColorPicker
              label="Title Color"
              value={props.topTitleColorClassName}
              onChange={(v: string) => handleChange('topTitleColorClassName', v)}
            />
            <div className="space-y-2">
              <Label>Title Font Family</Label>
              <Select value={props.topTitleFontFamily} onChange={(v: string) => handleChange('topTitleFontFamily', v)} size="lg">
                {FONT_FAMILIES.map((font: { id: string; label: string }) => (
                  <SelectOption key={font.id} value={font.id}>{font.label}</SelectOption>
                ))}
              </Select>
            </div>
          </div>

 

          <div className="space-y-4 mt-16">
            <Input label="Subtitle" value={props.topSubtitle} onChange={(v: string) => handleChange('topSubtitle', v)} as="textarea" />
            <GranularColorPicker
              label="Subtitle Color"
              value={props.topSubtitleColorClassName}
              onChange={(v: string) => handleChange('topSubtitleColorClassName', v)}
            />
            <div className="space-y-2">
              <Label>Subtitle Font Family</Label>
              <Select value={props.topSubtitleFontFamily} onChange={(v: string) => handleChange('topSubtitleFontFamily', v)} size="lg">
                {FONT_FAMILIES.map((font: { id: string; label: string }) => (
                  <SelectOption key={font.id} value={font.id}>{font.label}</SelectOption>
                ))}
              </Select>
            </div>
          </div>

          <GranularColorPicker
            label="Background Color"
            value={props.topBgColorClassName}
            onChange={(v: string) => handleChange('topBgColorClassName', v)}
            mode="bg"
          />
        </div>
      </div>

      {/* Phase 3: Bottom Container (Children Part 2) */}
      <div className="space-y-6 p-6 rounded-3xl bg-custom-blue/2 dark:bg-custom-coconut/2 border border-custom-blue/5 dark:border-custom-coconut/5">
        <div className="mb-8">
          <h5 className="text-sm font-bold uppercase tracking-widest text-center text-custom-blue/60 dark:text-custom-celadon/40">Bottom Section</h5>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <Input label="Paragraph" value={props.bottomParagraph} onChange={(v: string) => handleChange('bottomParagraph', v)} as="textarea" />
            <GranularColorPicker
              label="Paragraph Color"
              value={props.bottomParagraphColorClassName}
              onChange={(v: string) => handleChange('bottomParagraphColorClassName', v)}
            />
            <div className="space-y-2">
              <Label>Paragraph Font Family</Label>
              <Select value={props.bottomFontFamily} onChange={(v: string) => handleChange('bottomFontFamily', v)} size="lg">
                {FONT_FAMILIES.map((font: { id: string; label: string }) => (
                  <SelectOption key={font.id} value={font.id}>{font.label}</SelectOption>
                ))}
              </Select>
            </div>
          </div>

          <GranularColorPicker
            label="Background Color"
            value={props.bottomBgColorClassName}
            onChange={(v: string) => handleChange('bottomBgColorClassName', v)}
            mode="bg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end mt-8">
          <div className={cn(
            "flex items-center justify-between p-4 bg-custom-blue/2 dark:bg-custom-coconut/2 rounded-2xl border-2 border-custom-blue/5 dark:border-custom-coconut/5 min-h-[66px] transition-all duration-500",
            !props.hasButton && "md:col-span-2"
          )}>
            <Label className="mb-0">Has Button</Label>
            <Toggle checked={props.hasButton} onChange={(v: boolean) => handleChange('hasButton', v)} />
          </div>

          {props.hasButton && (
            <>
              <div className="space-y-2 animate-in fade-in slide-in-from-right-2 duration-300">
                <Label>Button Variant</Label>
                <Select value={props.buttonVariant} onChange={(v: string) => handleChange('buttonVariant', v)} size="lg">
                  <SelectOption value="primary">Primary</SelectOption>
                  <SelectOption value="secondary">Secondary</SelectOption>
                  <SelectOption value="outline">Outline</SelectOption>
                  <SelectOption value="ghost">Ghost</SelectOption>
                </Select>
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-75">
                <Input label="Button Label" value={props.buttonLabel} onChange={(v: string) => handleChange('buttonLabel', v)} />
              </div>
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
                <Input label="Button Href" value={props.buttonHref} onChange={(v: string) => handleChange('buttonHref', v)} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
