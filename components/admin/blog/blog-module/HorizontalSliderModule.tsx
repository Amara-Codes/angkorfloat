"use client";

import { Input, Label } from "@/components/common/Input";
import { Reorder } from "framer-motion";
import { Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import { Module } from "../BlogForm";

interface HorizontalSliderModuleProps {
  module: Module;
  onChange: (newProps: Record<string, any>) => void;
}

export default function HorizontalSliderModule({ module, onChange }: HorizontalSliderModuleProps) {
  const { props } = module;

  const handleChange = (key: string, value: any) => {
    onChange({ ...props, [key]: value });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Input label="Title" value={props.title} onChange={(v) => handleChange('title', v)} />
        <Input label="Subtitle" value={props.subtitle} onChange={(v) => handleChange('subtitle', v)} />
      </div>

      <div className="h-px bg-custom-blue/5 dark:bg-custom-coconut/5 my-4" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label className="mb-0">Slider Items</Label>
          <button
            type="button"
            onClick={() => {
              const newItems = [...(props.items || []), { title: '', description: '', id: Math.random().toString(36).substr(2, 9) }];
              handleChange('items', newItems);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-custom-blue/5 dark:bg-custom-coconut/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-custom-blue/60 dark:text-custom-celadon/60 hover:bg-custom-blue/10 transition-all"
          >
            <Plus className="h-3 w-3" />
            Add Item
          </button>
        </div>

        <Reorder.Group
          axis="y"
          values={props.items || []}
          onReorder={(newItems) => handleChange('items', newItems)}
          className="space-y-4"
        >
          {(props.items || []).map((item: any, index: number) => (
            <Reorder.Item
              key={item.id || index}
              value={item}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="p-6 rounded-3xl bg-custom-blue/2 dark:bg-custom-coconut/2 border border-custom-blue/5 dark:border-custom-coconut/5 relative group/item">
                <div className="flex items-center justify-between mb-6 border-b border-custom-blue/5 dark:border-custom-coconut/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-custom-blue/60 dark:bg-custom-celadon/60 rounded-lg text-custom-blue/60 dark:text-custom-celadon">
                      <ImageIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-custom-blue/60 dark:text-custom-celadon">Item #{index + 1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = props.items.filter((_: any, i: number) => i !== index);
                        handleChange('items', newItems);
                      }}
                      className="p-2 text-custom-rosewood/40 hover:text-custom-rosewood transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="p-2 text-custom-blue/40 dark:text-custom-celadon/40 cursor-grab active:cursor-grabbing">
                      <GripVertical className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <Input
                    label="Item Title"
                    value={item.title}
                    onChange={(v) => {
                      const newItems = [...props.items];
                      newItems[index] = { ...newItems[index], title: v };
                      handleChange('items', newItems);
                    }}
                  />
                  <Input
                    label="Item Description"
                    value={item.description}
                    onChange={(v) => {
                      const newItems = [...props.items];
                      newItems[index] = { ...newItems[index], description: v };
                      handleChange('items', newItems);
                    }}
                    as="textarea"
                  />
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {(!props.items || props.items.length === 0) && (
          <div className="py-12 border-2 border-dashed border-custom-blue/5 dark:border-custom-coconut/5 rounded-3xl flex flex-col items-center justify-center text-center px-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-custom-blue/20">No items added to slider</p>
          </div>
        )}
      </div>
    </div>
  );
}
