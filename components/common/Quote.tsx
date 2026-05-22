"use client";

import { Quote as QuoteIcon } from "lucide-react";
import { ReactNode } from "react";
import Paragraph from "@/components/common/Paragraph";
import { cn } from "@/lib/utils";

interface QuoteProps {
  children: ReactNode;
  author?: string;
  authorDates?: string;
  authorInfo?: string;
  className?: string;
  colorClassName?: string;
}

export default function Quote({ 
  children,
  author, 
  authorDates, 
  authorInfo, 
  className,
  colorClassName = "",
}: QuoteProps) {
  return (
    <div className={cn(
      "flex flex-col items-center gap-0 py-24 max-w-full mx-auto relative group transition-colors duration-500", 
      className,
      colorClassName
    )}>
      <div className="max-w-5xl mx-auto flex flex-col items-center w-full">
      <QuoteIcon
        size={80}
        strokeWidth={0.5}
        className="text-current/20 self-start transition-transform duration-700 group-hover:translate-x-4"
      />

      <Paragraph
        as="p"
        size="4xl"
        weight="bold"
        align="center"
        className="text-current/90 leading-relaxed italic lg:px-8"
      >
        {children}
      </Paragraph>

      <QuoteIcon
        size={80}
        strokeWidth={0.5}
        className="text-current/20 self-end rotate-180 transition-transform duration-700 group-hover:-translate-x-4"
      />

      {(author || authorDates || authorInfo) && (
        <div className="mt-16 lg:mt-8 flex flex-col items-center text-center">
          {author && (
            <p className="text-xl font-kugile text-current">
              {author}
            </p>
          )}
          {(authorDates || authorInfo) && (
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-current/40 mt-1">
              {authorDates && <span>{authorDates}</span>}
              {authorDates && authorInfo && <span className="mx-2">&bull;</span>}
              {authorInfo && <span>{authorInfo}</span>}
            </p>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
