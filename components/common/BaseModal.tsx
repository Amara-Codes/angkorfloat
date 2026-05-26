"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl";
  className?: string;
}

export default function BaseModal({
  isOpen,
  onClose,
  children,
  size = "md",
  className,
}: BaseModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isMounted || !isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    "8xl": "max-w-8xl",
    "9xl": "max-w-9xl",
  };

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-custom-blue/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className={cn(
          "relative w-full bg-white/80 dark:bg-custom-blue/90 border border-white/20 dark:border-white/10 rounded-4xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300",
          sizeClasses[size],
          className
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

// Structured Sub-components
BaseModal.Header = function BaseModalHeader({ children, onClose, className }: { children: ReactNode, onClose?: () => void, className?: string }) {
  return (
    <div className={cn("flex items-center justify-between p-6 sm:p-8 border-b border-custom-blue/5 dark:border-white/5", className)}>
      <div className="flex-1">
        {typeof children === "string" ? (
          <h3 className="text-2xl font-kugile text-custom-blue dark:text-custom-celadon">
            {children}
          </h3>
        ) : (
          children
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-2 text-custom-blue/40 dark:text-custom-celadon/50 hover:text-custom-blue dark:hover:text-custom-celadon hover:bg-custom-blue/5 dark:hover:bg-white/10 rounded-xl transition-all"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

BaseModal.Body = function BaseModalBody({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={cn("flex-1 p-6 sm:p-8 overflow-y-auto max-h-[70vh]", className)}>
      {children}
    </div>
  );
};

BaseModal.Footer = function BaseModalFooter({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={cn("p-6 sm:p-8 border-t border-custom-blue/5 dark:border-white/5 bg-custom-blue/5 dark:bg-white/5", className)}>
      {children}
    </div>
  );
};