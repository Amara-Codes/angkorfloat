"use client";

import { Input, Label } from "@/components/common/Input";
import { Select, SelectOption } from "@/components/common/Select";
import {
  OpacitySelector,
  Module
} from "../BlogForm";

interface SpacerModuleProps {
  module: Module;
  onChange: (newProps: Record<string, any>) => void;
}

export default function SpacerModule({ module, onChange }: SpacerModuleProps) {
  const { props } = module;

  const handleChange = (key: string, value: any) => {
    onChange({ ...props, [key]: value });
  };

  return (
    <div className="space-y-8 min-h-[280px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Height / Size</Label>
          <Select value={props.height} onChange={(v) => handleChange('height', v)} size="lg">
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
          <Select value={props.type} onChange={(v) => handleChange('type', v)} size="lg">
            <SelectOption value="spacer">Empty Space</SelectOption>
            <SelectOption value="divider">Horizontal Line</SelectOption>
          </Select>
        </div>
        {props.type === 'divider' && (
          <>
            <div className="space-y-2">
              <Label>Line Color</Label>
              <Select value={props.lineColor} onChange={(v) => handleChange('lineColor', v)} size="lg">
                <SelectOption value="coconut">Coconut</SelectOption>
                <SelectOption value="celadon">Celadon</SelectOption>
                <SelectOption value="blue">Blue</SelectOption>
                <SelectOption value="green">Green</SelectOption>
                <SelectOption value="rosewood">Rosewood</SelectOption>
                <SelectOption value="almond">Almond</SelectOption>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Line Thickness</Label>
              <Select value={props.lineHeight} onChange={(v) => handleChange('lineHeight', v)} size="lg">
                <SelectOption value="1">1 (Hairline)</SelectOption>
                <SelectOption value="2">2 (Thin)</SelectOption>
                <SelectOption value="4">4 (Standard)</SelectOption>
                <SelectOption value="8">8 (Thick)</SelectOption>
                <SelectOption value="16">16 (Heavy)</SelectOption>
                <SelectOption value="24">24 (Extra Heavy)</SelectOption>
                <SelectOption value="32">32 (Extreme)</SelectOption>
              </Select>
            </div>
            <Input label="Width (e.g. 100%, 200px)" value={props.lineWidth} onChange={(v) => handleChange('lineWidth', v)} />
            <OpacitySelector
              label="Line Opacity"
              value={props.opacity}
              onChange={(v) => handleChange('opacity', v)}
            />
          </>
        )}
      </div>
    </div>
  );
}
