"use client";

import React, { useRef, useState } from "react";
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
  /** Determina la "lunghezza" dello scroll verticale (es: 300vh) */
  scrollDistance?: string; 
  /** Array di classi Tailwind per la transizione del titolo durante lo scroll (es. ["text-black dark:text-white", "text-blue-500"]) */
  titleClasses?: string[];
  /** Array di classi Tailwind per la transizione del sottotitolo durante lo scroll */
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
      "min-w-[85vw] md:min-w-[33.33vw] h-full flex flex-col p-10 md:p-16 border-r border-black/5 last:border-r-0",
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
  scrollDistance = "300vh",
  titleClasses = ["text-custom-blue dark:text-custom-almond", "text-custom-coconut dark:text-custom-almond"],
  subtitleClasses = ["text-custom-blue dark:text-custom-almond", "text-custom-celadon dark:text-custom-celadon"],
}: SectionProps) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Calcolo dinamico dello spostamento:
  // Se hai molte card, potresti voler regolare il valore finale (es: -70%)
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.7%"]);

  // Gestione delle classi Tailwind in base allo scroll progress
  const [currentTitleClass, setCurrentTitleClass] = useState(titleClasses[0]);
  const [currentSubtitleClass, setCurrentSubtitleClass] = useState(subtitleClasses[0]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Calcola l'indice della classe in base alla percentuale di scroll (0 - 1)
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
      style={{ height: scrollDistance }}
      className={cn("relative overflow-visible", className)}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden bg-inherit">
        {/* Header dinamico */}
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

        {/* Area di scorrimento */}
        <div className={cn("flex-1 flex items-center", containerClassName)}>
          <motion.div style={{ x }} className="flex">
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
};