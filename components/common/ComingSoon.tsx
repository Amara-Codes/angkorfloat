"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Compass, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface ComingSoonProps {
  title: string;
  subtitle: string;
  description: string;
  backHomeText: string;
  pageName: string;
  className?: string;
  auraClassName?: string;
}

export default function ComingSoon({
  title,
  subtitle,
  description,
  backHomeText,
  pageName,
  className,
  auraClassName = "text-custom-rosewood dark:text-custom-celadon",
}: ComingSoonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Soft organic blob shapes for a gentle flow
  const blobShapes = useMemo(() => {
    const shapeVariations = [
      "40% 60% 60% 40% / 40% 40% 60% 60%",
      "60% 40% 40% 60% / 60% 60% 40% 40%",
      "50% 50% 50% 50% / 50% 50% 50% 50%",
      "55% 45% 65% 35% / 45% 55% 35% 65%",
      "45% 55% 35% 65% / 55% 45% 65% 35%"
    ];
    return {
      layer1: [shapeVariations[0], shapeVariations[1], shapeVariations[3], shapeVariations[0]],
      layer2: [shapeVariations[3], shapeVariations[4], shapeVariations[1], shapeVariations[3]]
    };
  }, []);

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[90vh] px-6 py-16 relative overflow-hidden font-sans", className)}>
      {/* Soft Ambient Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-custom-rosewood/60 dark:bg-custom-coconut/20 blur-xl -z-10 animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-custom-almond/60 dark:bg-custom-rosewood/20 blur-2xl -z-10 animate-pulse duration-[10000ms]" />

      <div className="max-w-3xl w-full text-center relative z-10 pb-32">
        {/* Page Context Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-block px-4 py-1.5 rounded-full bg-custom-rosewood/10 dark:bg-custom-celadon/10 border border-custom-rosewood/20 dark:border-custom-celadon/20 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-custom-rosewood dark:text-custom-celadon mb-8"
        >
          {pageName}
        </motion.div>

        {/* Main Content Card with Hover Container */}
        <div 
          className="relative group p-1"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Organica Fluida Continua Aura (from SacredGeometryGrid) */}
          <motion.div
            className={cn(
              "absolute -inset-12 sm:-inset-20 flex items-center justify-center pointer-events-none drop-shadow-[0_0_2.5rem_currentColor] transition-all duration-1000 z-0",
              auraClassName
            )}
            animate={{
              scale: isHovered ? 1.08 : 0.96,
              opacity: isHovered ? 0.85 : 0.45
            }}
            transition={{ type: "spring", stiffness: 45, damping: 25 }}
          >
            {/* Layer Interno Fluido (Constant slow duration prevents snaps on hover) */}
            <motion.div
              className="absolute inset-0 blur-[20px] sm:blur-[32px]"
              animate={{ 
                borderRadius: blobShapes.layer1,
                boxShadow: ["inset 0px 0px 45px 18px currentColor", "inset 0px 0px 20px 8px currentColor", "inset 0px 0px 45px 18px currentColor"],
                rotate: [0, 180, 360],
                scale: [1, 1.04, 1]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Layer Esterno Fluido e Contro-rotante */}
            <motion.div
              className="absolute top-4 left-4 right-4 bottom-4 blur-[24px] sm:blur-[36px]"
              animate={{ 
                borderRadius: blobShapes.layer2,
                boxShadow: ["0px 0px 45px 18px currentColor", "0px 0px 20px 8px currentColor", "0px 0px 45px 18px currentColor"],
                rotate: [360, 180, 0],
                scale: [0.96, 1.02, 0.96]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Pulsing Core background light */}
          <motion.div
            className="absolute inset-0 rounded-3xl blur-3xl z-0 bg-current transition-all duration-1000 opacity-0 group-hover:opacity-10"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* The Glassmorphic Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative z-10 bg-custom-coconut/80 dark:bg-custom-blue/80 backdrop-blur-xl border border-custom-blue/20 dark:border-custom-coconut/20 shadow-2xl rounded-4xl p-8 sm:p-12 transition-all duration-1000 group-hover:bg-custom-coconut/80 dark:group-hover:bg-custom-blue/50"
          >
            <h1 className="font-kugile text-4xl sm:text-6xl text-custom-rosewood dark:text-custom-almond font-normal italic tracking-wide leading-tight mb-6">
              {title}
            </h1>

            <p className="font-josefin text-lg sm:text-xl text-custom-blue/80 dark:text-custom-celadon/80 max-w-xl mx-auto leading-relaxed mb-8">
              {subtitle}
            </p>

            <div className="w-16 h-px bg-linear-to-r from-transparent via-custom-rosewood/30 dark:via-custom-celadon/30 to-transparent mx-auto mb-8" />

            <p className="text-sm sm:text-base text-custom-blue/70 dark:text-custom-coconut/70 font-sans leading-relaxed max-w-lg mx-auto">
              {description}
            </p>
          </motion.div>
        </div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center mt-8"
        >
          <Button
            variant="theme-responsive"
            size="md"
            roundness="full"
            href="/"
            icon={<ArrowLeft size={16} />}
            iconPosition="left"
            className="hover:shadow-md"
          >
            {backHomeText}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
