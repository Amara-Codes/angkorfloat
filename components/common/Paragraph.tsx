"use client"

import { useMemo, useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useAnimationFrame, useSpring } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface ScrollRevealOptions {
    enableBlur?: boolean;
    baseOpacity?: number;
    baseRotation?: number;
    blurStrength?: number;
    containerClassName?: string;
    textClassName?: string;
    offset?: any;
}

interface ParagraphProps {
    children: React.ReactNode;
    as?: 'p' | 'span' | 'div' | 'h2' | 'h1';
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
    weight?: 'normal' | 'medium' | 'bold';
    variant?: 'default' | 'muted' | 'error';
    align?: 'left' | 'center' | 'right';
    className?: string;
    skeleton?: boolean;
    scrollReveal?: boolean;
    colorClassName?: string;
    revealOptions?: ScrollRevealOptions;
}

const Paragraph = ({
    children,
    as = 'p',
    size = 'md',
    weight = 'normal',
    variant = 'default',
    align = 'left',
    className = '',
    skeleton = false,
    scrollReveal = false,
    colorClassName = "",
    revealOptions = {},
}: ParagraphProps) => {
    const targetRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const {
        enableBlur = true,
        baseOpacity = 0.3,
        baseRotation = 0,
        blurStrength = 4,
        containerClassName = '',
        textClassName = '',
        offset = ["start end", "end start"]
    } = revealOptions;

    // 1. Setup dello Scroll Progress
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: offset as any
    });

    // Custom LERP Smoothing to mitigate trackwheel ticks
    const smoothProgress = useMotionValue(0);
    
    useAnimationFrame(() => {
        const target = scrollYProgress.get();
        const current = smoothProgress.get();
        
        // Smoothing factor: 0.1 provides a buttery feel without excessive lag
        const lerpFactor = 0.1; 
        const next = current + (target - current) * lerpFactor;
        
        if (Math.abs(next - target) < 0.0001) {
            smoothProgress.set(target);
        } else {
            smoothProgress.set(next);
        }
    });

    // 2. Trasformazioni animate basate sullo smoothProgress (LERP-filtered)
    const rotate = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [baseRotation, 0, 0, -baseRotation]);
    const opacity = useTransform(
        smoothProgress,
        [0, 0.2, 0.5, 0.8, 1],
        [baseOpacity, 0.9, 1, 0.9, baseOpacity]
    );
    
    const blurValue = useTransform(
        smoothProgress,
        [0, 0.2, 0.5, 0.8, 1],
        [blurStrength, 2, 0, 2, blurStrength]
    );
    // We keep a light spring on the blur for micro-smoothness
    const springBlur = useSpring(blurValue, { stiffness: 150, damping: 40 });
    const filter = useTransform(springBlur, (v) => enableBlur ? `blur(${v}px)` : 'none');

    // 3. Logica di Splitting
    const splitText = useMemo(() => {
        if (!scrollReveal || typeof children !== 'string') return children;
        return children.split(/(\s+)/).map((word, index) => {
            if (word.match(/^\s+$/)) return word;
            return (
                <motion.span
                    key={index}
                    style={{ opacity, filter }}
                    className={`inline-block ${textClassName}`}
                >
                    {word}
                </motion.span>
            );
        });
    }, [children, scrollReveal, opacity, filter, textClassName]);

    const sizeMap = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
        '6xl': 'text-6xl',
    };

    const weightMap = {
        normal: 'font-normal',
        medium: 'font-medium',
        bold: 'font-bold',
    };

    const variantMap = {
        default: 'text-current',
        muted: 'opacity-60',
        error: 'text-red-600',
    };

    const alignMap = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    };



    const baseStyles = `${sizeMap[size]} ${weightMap[weight]} ${variantMap[variant]} ${alignMap[align]} ${colorClassName} px-6 lg:px-0`;

    if (skeleton) {
        return <div className={`bg-custom-blue/20 animate-pulse rounded h-4 w-full ${className}`} />;
    }

    const MotionComponent = motion.create(as as any);

    return (
        <div 
            ref={targetRef} 
            className={twMerge(
                "relative w-full",
                className,
                
            )}
        >
            <MotionComponent
                style={scrollReveal ? { rotate, originX: 0 } : {}}
                className={twMerge(baseStyles, containerClassName, className)}
            >
                {isMounted && scrollReveal ? splitText : children}
            </MotionComponent>
        </div>
    );
};

export default Paragraph;