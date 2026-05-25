"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Props ---
interface SectionProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  headingClassName?: string;
  children: React.ReactNode;
  titleClasses?: string[];
  subtitleClasses?: string[];
}

interface ItemCardProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

// --- Sottocomponente Card ---
export const ScrollItem = ({ 
  title, 
  description, 
  className, 
  children 
}: ItemCardProps) => {
  return (
    <div className={cn(
      "w-[100vw] md:w-[33.333333vw] shrink-0 h-full flex flex-col p-10 md:p-16 border-r border-black/5 last:border-r-0",
      "justify-center items-start text-left bg-transparent", 
      className
    )}>
      {title && (
        <div className="text-2xl md:text-3xl font-serif mb-6 leading-tight text-balance">
          {title}
        </div>
      )}
      {description && (
        <div className="text-sm md:text-base opacity-80 font-light leading-relaxed">
          {description}
        </div>
      )}
      {children && <div className="mt-6 w-full">{children}</div>}
    </div>
  );
};

// --- Componente Principale ---
export const HorizontalScrollSection = ({ 
  title, 
  subtitle, 
  className,
  containerClassName,
  headingClassName,
  children,
  titleClasses = ["text-custom-blue dark:text-custom-almond", "text-custom-coconut dark:text-custom-almond"],
  subtitleClasses = ["text-custom-blue dark:text-custom-almond", "text-custom-celadon dark:text-custom-celadon"],
}: SectionProps) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef(0);
  const [sectionHeight, setSectionHeight] = useState("100dvh");

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, (v) => -(v * overflowRef.current));

  const [currentTitleClass, setCurrentTitleClass] = useState(titleClasses[0]);
  const [currentSubtitleClass, setCurrentSubtitleClass] = useState(subtitleClasses[0]);

  useEffect(() => {
    const measure = () => {
      const slider = sliderRef.current;
      if (!slider || slider.children.length === 0) return;

      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      const visibleCards = isDesktop ? 3 : 1;
      const totalCards = slider.children.length;

      if (totalCards > visibleCards) {
        // La larghezza esatta di una card (calcolata in base alla viewport)
        const cardWidth = (slider.children[0] as HTMLElement).getBoundingClientRect().width;
        
        // Calcoliamo lo scroll in modo che l'ultima card si fermi sul bordo DESTRO
        // (comportamento standard di uno slider senza lasciare buchi vuoti).
        const overflow = (totalCards - visibleCards) * cardWidth;
        overflowRef.current = overflow;
        
        // L'altezza è la viewport + lo spazio necessario per completare l'overflow
        setSectionHeight(`${window.innerHeight + overflow}px`);
      } else {
        // Se non superiamo le card visibili, niente scroll!
        overflowRef.current = 0;
        setSectionHeight("100dvh");
      }
    };

    // RAF garantisce che il DOM sia aggiornato
    const rafId = requestAnimationFrame(() => {
      // E usiamo un piccolo timeout in caso di font caricati in ritardo
      setTimeout(measure, 50);
    });
    
    const ro = new ResizeObserver(() => measure());
    if (sliderRef.current) ro.observe(sliderRef.current);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [children]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (titleClasses.length > 0) {
      const tIndex = Math.min(Math.floor(latest * titleClasses.length), titleClasses.length - 1);
      setCurrentTitleClass(titleClasses[tIndex]);
    }
    if (subtitleClasses.length > 0) {
      const sIndex = Math.min(Math.floor(latest * subtitleClasses.length), subtitleClasses.length - 1);
      setCurrentSubtitleClass(subtitleClasses[sIndex]);
    }
  });

  return (
    <section 
      ref={targetRef} 
      style={{ height: sectionHeight }}
      className={cn("relative", className)}
    >
      <div className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden bg-inherit">
        {/* Header */}
        {(title || subtitle) && (
          <div className={`px-8 md:px-16 pt-24 pb-8 ${headingClassName}`}>
            {subtitle && (
              <p className={cn(
                "text-xs md:text-sm uppercase tracking-widest mb-3 opacity-50 font-semibold transition-colors duration-500",
                currentSubtitleClass
              )}>
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className={cn(
                "text-4xl md:text-6xl font-serif tracking-tight transition-colors duration-500",
                currentTitleClass
              )}>
                {title}
              </h2>
            )}
          </div>
        )}

        {/* Scroll area */}
        <div className={cn("flex-1 flex items-center overflow-hidden", containerClassName)}>
          <motion.div ref={sliderRef} style={{ x }} className="flex h-full w-max">
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
};