"use client";
import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from "@/lib/utils";

// --- TIPI ---
interface OptionProps {
  value: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

type SelectSize = 'sm' | 'md' | 'lg';

interface SelectContextProps {
  selectedValue: string;
  selectedValues: string[];
  multiselectMode: boolean;
  onSelect: (value: string) => void;
  size: SelectSize;
}

const SelectContext = createContext<SelectContextProps | undefined>(undefined);

// --- COMPONENTE SELECT (PADRE) ---
interface SelectProps {
  children: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: SelectSize;
  fullWidth?: boolean; // Nuova prop: controlla se il div deve essere w-full o w-fit
  disabled?: boolean;   // Nuova prop: per gestire lo stato disabilitato
  name?: string;        // Nuova prop: per il supporto ai form (Next.js server actions)
  multiselectMode?: boolean; // Nuova prop: abilita multiselezione
  triggerClassName?: string | ((isOpen: boolean) => string);
  chevronClassName?: string;
}

export function Select({ 
  children, 
  value, 
  onChange, 
  placeholder = "Select...", 
  className = "",
  size = "lg",
  fullWidth = true,
  disabled = false,
  name,
  multiselectMode = false,
  triggerClassName,
  chevronClassName
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  const childrenArray = React.Children.toArray(children) as React.ReactElement<OptionProps>[];
  
  const selectedValues = multiselectMode ? (value ? value.split(',') : []) : [value];

  const handleSelect = (val: string) => {
    if (multiselectMode) {
      const currentValues = value ? value.split(',') : [];
      let nextValues: string[];
      if (currentValues.includes(val)) {
        nextValues = currentValues.filter(v => v !== val);
      } else {
        nextValues = [...currentValues, val];
      }
      onChange(nextValues.join(','));
    } else {
      onChange(val);
      setIsOpen(false);
    }
  };

  let displayContent: React.ReactNode;

  if (multiselectMode) {
    const selectedChildren = childrenArray.filter(
      (child) => React.isValidElement(child) && selectedValues.includes(child.props.value)
    );

    displayContent = selectedChildren.length > 0 ? (
      <span className="truncate block w-full text-left font-black">
        {selectedChildren.map((child) => child.props.children).join(', ')}
      </span>
    ) : (
      <span className="opacity-50">{placeholder}</span>
    );
  } else {
    const selectedChild = childrenArray.find(
      (child) => React.isValidElement(child) && child.props.value === value
    );

    displayContent = selectedChild ? (
      <div className="flex items-center gap-2">
        {selectedChild.props.children}
        {selectedChild.props.icon}
      </div>
    ) : (
      <span className="opacity-50">{placeholder}</span>
    );
  }

  const handleToggle = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  // Classi base per il trigger
  const triggerBase = "flex items-center justify-between cursor-pointer transition-all outline-none select-none";
  
  const sizeClasses = {
    lg: "h-[60px] px-6 rounded-2xl font-black border-2 dark:bg-custom-blue border-custom-blue/10 dark:border-custom-celadon/10",
    md: "px-4 py-2.5 rounded-xl font-bold text-sm border border-custom-blue/10 dark:border-custom-celadon/10 dark:bg-custom-blue",
    sm: "px-4 py-2 rounded-xl font-bold text-sm border-none bg-custom-blue/5 dark:bg-custom-celadon/5"
  };

  return (
    <SelectContext.Provider value={{ 
      selectedValue: value, 
      selectedValues,
      multiselectMode,
      onSelect: handleSelect, 
      size 
    }}>
      <div 
        ref={containerRef} 
        className={cn(
          "relative transition-opacity",
          isOpen ? "z-[100]" : "z-10",
          fullWidth ? "w-full" : "w-fit min-w-[100px]",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
      >
        {/* TRIGGER */}
        <div
          onClick={handleToggle}
          className={cn(
            triggerBase,
            sizeClasses[size],
            size === 'lg' && (isOpen ? 'border-custom-blue/20 dark:border-custom-celadon/20' : 'border-transparent'),
            "text-custom-blue dark:text-custom-celadon",
            isOpen ? "bg-custom-coconut" : "bg-custom-coconut/40",
            typeof triggerClassName === 'function' ? triggerClassName(isOpen) : triggerClassName
          )}
        >
          <div className="flex items-center gap-2 truncate pointer-events-none pr-2 w-full">
            {displayContent}
          </div>
          <ChevronDown 
            className={cn(
              "transition-transform duration-300 pointer-events-none shrink-0",
              isOpen ? "rotate-180" : "",
              size === 'sm' ? "w-4 h-4 opacity-50" : "w-5 h-5",
              chevronClassName
            )}
          />
        </div>

        {/* DROPDOWN MENU */}
        {isOpen && (
          <ul className={cn(
            "absolute z-50 mt-2 bg-custom-coconut dark:bg-custom-blue border-2 border-custom-blue/20 dark:border-custom-celadon/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-60 overflow-y-auto select-scrollbar",
            fullWidth ? "w-full" : "min-w-full w-max", // w-max permette al menu di essere più largo del trigger se serve
            size === 'sm' ? "mt-1 rounded-xl" : "rounded-2xl"
          )}>
            {children}
          </ul>
        )}

        {name && <input type="hidden" name={name} value={value} />}
      </div>
    </SelectContext.Provider>
  );
}

// --- COMPONENTE OPTION (FIGLIO) ---
export function SelectOption({ value, children, icon }: OptionProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectOption must be used inside Select");

  const isSelected = context.multiselectMode
    ? context.selectedValues.includes(value)
    : context.selectedValue === value;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    context.onSelect(value);
  };

  const optionPadding = {
    sm: "px-4 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-4 text-lg"
  }[context.size];

  return (
    <li
      onClick={handleClick}
      className={cn(
        "flex items-center justify-between cursor-pointer transition-all font-bold whitespace-nowrap",
        optionPadding,
        isSelected
          ? context.multiselectMode
            ? 'bg-custom-blue/5 dark:bg-custom-celadon/10 text-custom-blue dark:text-custom-celadon'
            : 'bg-custom-blue dark:bg-custom-celadon text-custom-coconut dark:text-custom-blue'
          : 'hover:bg-custom-blue/10 dark:hover:bg-custom-celadon/5 text-custom-blue dark:text-custom-celadon/80'
      )}
    >
      <span className="flex items-center gap-2 w-full pr-4">
        {children}
      </span>
      {context.multiselectMode ? (
        isSelected && (
          <Check className="h-4 w-4 text-custom-blue dark:text-custom-celadon ml-auto shrink-0 animate-in zoom-in-50 duration-200" />
        )
      ) : (
        icon && <span className="ml-auto shrink-0">{icon}</span>
      )}
    </li>
  );
}