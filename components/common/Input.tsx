"use client";

import React from 'react';
import { cn } from "@/lib/utils";

const INPUT_CLASSES = "w-full bg-custom-coconut/40 dark:bg-custom-blue border-2 border-custom-blue/10 dark:border-custom-celadon/10 rounded-2xl h-[60px] px-6 text-lg font-black text-custom-blue dark:text-custom-celadon focus:outline-none focus:ring-2 focus:ring-custom-blue/20 dark:focus:ring-custom-celadon/30 placeholder:text-custom-blue/20 dark:placeholder:text-custom-celadon/20 transition-all shadow-sm focus:bg-custom-coconut disabled:opacity-50 disabled:cursor-not-allowed";
const LABEL_CLASSES = "text-[10px] font-bold text-custom-blue/60 dark:text-custom-celadon/60 uppercase tracking-[0.2em]";

export function Label({ children, icon: Icon, className }: { children: React.ReactNode, icon?: any, className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 mb-2 ml-1", className)}>
      {Icon && <Icon className="h-3 w-3 text-custom-blue/30 dark:text-custom-celadon/40" />}
      <span className={LABEL_CLASSES}>
        {children}
      </span>
    </div>
  );
}

interface BaseInputProps {
  label: string;
  icon?: any; // Label icon (beside label text)
  leftIcon?: React.ReactNode; // Input left inline icon
  rightIcon?: React.ReactNode; // Input right inline icon
  labelClassName?: string; // Optional class for the label wrapper
  as?: 'input' | 'textarea';
  onChange?: (value: string) => void;
}

type HTMLInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>;
type HTMLTextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'>;

export type InputProps = BaseInputProps & HTMLInputProps & HTMLTextareaProps;

export function Input({
  label,
  icon,
  leftIcon,
  rightIcon,
  labelClassName,
  as = 'input',
  onChange,
  className,
  ...props
}: InputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="space-y-2 w-full">
      <Label icon={icon} className={labelClassName}>{label}</Label>
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-custom-blue/20 dark:text-custom-celadon/20 flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        {as === 'input' ? (
          <input
            {...(props as HTMLInputProps)}
            onChange={handleInputChange}
            className={cn(
              INPUT_CLASSES,
              leftIcon && "pl-14",
              rightIcon && "pr-14",
              className
            )}
          />
        ) : (
          <textarea
            {...(props as HTMLTextareaProps)}
            onChange={handleInputChange}
            rows={props.rows || 4}
            className={cn(
              INPUT_CLASSES,
              "h-auto py-4",
              leftIcon && "pl-14",
              rightIcon && "pr-14",
              className
            )}
          />
        )}
        {rightIcon && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-custom-blue/20 dark:text-custom-celadon/20 flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
}
