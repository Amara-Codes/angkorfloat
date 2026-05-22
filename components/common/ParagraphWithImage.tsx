"use client"

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionValue, useAnimationFrame } from 'framer-motion';
import Paragraph from './Paragraph';
import { twMerge } from 'tailwind-merge';

interface ParagraphWithImageProps {
    children: React.ReactNode;
    as?: 'p' | 'span' | 'div' | 'h2' | 'h1';
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
    weight?: 'normal' | 'medium' | 'bold';
    variant?: 'default' | 'muted' | 'error';
    align?: 'left' | 'center' | 'right';
    className?: string;
    colorClassName?: string;

    // Image Props
    imageSrc: string;
    imageAlt?: string;
    imagePosition?: 'left' | 'right' | 'top' | 'bottom' | 'background';
    imageClassName?: string;
    imageAspectRatio?: 'square' | 'video' | 'portrait' | 'wide' | 'auto';

    // Animation & Visual
    parallax?: boolean;
    parallaxSpeed?: number;
    overlayOpacity?: number;
    containerClassName?: string;
    minHeight?: string;
}

const ParagraphWithImage = ({
    children,
    as = 'p',
    size = 'md',
    weight = 'normal',
    variant = 'default',
    align = 'left',
    className = '',
    colorClassName = "",
    imageSrc,
    imageAlt = '',
    imagePosition = 'left',
    imageClassName = '',
    imageAspectRatio = 'video',
    parallax = true,
    parallaxSpeed = 0.3,
    overlayOpacity = 0.4,
    containerClassName = '',
    minHeight = '',
}: ParagraphWithImageProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Custom Weighted Smoothing Logic (LERP Filter)
    // This creates a buffer that mitigates mouse wheel "ticks"
    const smoothProgress = useMotionValue(0);
    
    useAnimationFrame(() => {
        const target = scrollYProgress.get();
        const current = smoothProgress.get();
        
        // The smoothing factor (0.1 means we move 10% towards the target every frame)
        // This acts as a weighted average over time, effectively filtering out 
        // the acceleration spikes of a mechanical trackwheel.
        const lerpFactor = 0.1; 
        const next = current + (target - current) * lerpFactor;
        
        if (Math.abs(next - target) < 0.0001) {
            smoothProgress.set(target);
        } else {
            smoothProgress.set(next);
        }
    });

    // Parallax logic linked to the smooth progress
    const movement = parallaxSpeed * 40; 
    const bgMovement = parallaxSpeed * 60;

    const y = useTransform(smoothProgress, [0, 1], [`-${movement}%`, `${movement}%`]);
    const bgY = useTransform(smoothProgress, [0, 1], [`-${bgMovement}%`, `${bgMovement}%`]);

    const aspectMap = {
        square: 'aspect-square',
        video: 'aspect-video',
        portrait: 'aspect-[3/4]',
        wide: 'aspect-[21/9]',
        auto: 'h-full',
    };

    const isHorizontal = imagePosition === 'left' || imagePosition === 'right';
    const isVertical = imagePosition === 'top' || imagePosition === 'bottom';
    const isBackground = imagePosition === 'background';

    const containerClasses = twMerge(
        'relative overflow-hidden w-full z-0',
        isHorizontal && 'grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-24',
        isVertical && 'flex flex-col gap-12',
        isBackground && (minHeight || 'min-h-[80vh]'),
        isBackground && 'flex items-center justify-center py-32',
        containerClassName
    );

    const textWrapperClasses = twMerge(
        'relative z-10 w-full',
        isHorizontal && (imagePosition === 'left' ? 'lg:order-2' : 'lg:order-1'),
        isVertical && (imagePosition === 'top' ? 'order-2' : 'order-1'),
        isBackground && 'max-w-4xl px-6',
        className
    );

    const imageWrapperClasses = twMerge(
        'relative overflow-hidden rounded-sm z-10 w-full min-h-[300px] sm:min-h-[400px]',
        isHorizontal && (imagePosition === 'left' ? 'lg:order-1' : 'lg:order-2'),
        isVertical && (imagePosition === 'top' ? 'order-1' : 'order-2'),
        isBackground && 'absolute inset-0 z-0 rounded-none h-full min-h-0',
        !isBackground && aspectMap[imageAspectRatio],
        imageClassName
    );

    const imageSize = 100 + (isBackground ? bgMovement : movement) * 2;
    const imageOffset = -(isBackground ? bgMovement : movement);

    return (
        <div ref={containerRef} className={containerClasses}>
            {/* Image Section */}
            <div className={imageWrapperClasses}>
                <motion.div
                    className="absolute left-0 w-full"
                    style={{ 
                        height: `${imageSize}%`, 
                        top: `${imageOffset}%`,
                        y: parallax ? (isBackground ? bgY : y) : 0
                    }}
                >
                    {imageSrc ? (
                        <Image
                            src={imageSrc}
                            alt={imageAlt}
                            fill
                            className="object-cover"
                            sizes={isBackground ? "100vw" : "(max-width: 1024px) 100vw, 50vw"}
                            priority={isBackground}
                        />
                    ) : null}
                </motion.div>

                {isBackground && (
                    <div
                        className="absolute inset-0 bg-black/40 z-10"
                        style={{ opacity: overlayOpacity }}
                    />
                )}
            </div>

            {/* Text Section */}
            <div className={textWrapperClasses}>
                <Paragraph
                    as={as}
                    size={size}
                    weight={weight}
                    variant={variant}
                    align={isBackground ? 'center' : align}
                    className={className}
                    colorClassName={colorClassName}
                    scrollReveal={false}
                >
                    {children}
                </Paragraph>
            </div>
        </div>
    );
};

export default ParagraphWithImage;
