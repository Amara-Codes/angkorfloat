import React, { ReactNode } from 'react';
import Image from 'next/image';
import { cn } from "@/lib/utils";

interface SimpleHeroProps {
  imageSrc?: string;
  imageAlt?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  titleColorClassName?: string;
  subtitleColorClassName?: string;
  overlayOpacity?: number;
  vAlign?: 'top' | 'center' | 'bottom';
  lightOverlayColor?: string;
  darkOverlayColor?: string;
  children?: ReactNode;
}

const SimpleHero: React.FC<SimpleHeroProps> = ({
  imageSrc,
  imageAlt = 'Hero image',
  title,
  subtitle,
  align = 'center',
  className = '',
  titleColorClassName = "",
  subtitleColorClassName = "",
  overlayOpacity = 0.4,
  vAlign = 'center',
  lightOverlayColor = 'black',
  darkOverlayColor = 'black',
  children,
}) => {
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  const containerAlignment = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  const vAlignmentClasses = {
    top: 'justify-start',
    center: 'justify-center',
    bottom: 'justify-end',
  };

  const overlayColorClasses = {
    coconut: "bg-custom-coconut",
    celadon: "bg-custom-celadon",
    blue: "bg-custom-blue",
    green: "bg-custom-green",
    rosewood: "bg-custom-rosewood",
    almond: "bg-custom-almond",
    black: "bg-black",
    white: "bg-white",
  };

  const finalTitleColor = titleColorClassName || "text-custom-coconut/100 dark:text-custom-celadon/100";
  const finalSubtitleColor = subtitleColorClassName || "text-custom-coconut/80 dark:text-custom-celadon/80";

  return (
    <section 
      className={`relative w-full min-h-dvh flex flex-col ${vAlignmentClasses[vAlign]} overflow-hidden py-24 ${className}`}
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        {imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        ) : null}
        {/* Dynamic Overlay */}
        <div 
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            overlayColorClasses[lightOverlayColor as keyof typeof overlayColorClasses] || "bg-black",
            `dark:${overlayColorClasses[darkOverlayColor as keyof typeof overlayColorClasses] || "bg-black"}`
          )} 
          style={{ opacity: overlayOpacity }}
        />
      </div>

      {/* Content Container */}
      <div className={`container mx-auto px-6 md:px-12 lg:px-24 flex relative z-10 ${containerAlignment[align]}`}>
        <div className={`flex flex-col max-w-4xl ${alignmentClasses[align]} transition-all duration-700`}>
          <h1 className={cn("text-5xl md:text-7xl lg:text-8xl font-kugile mb-6 drop-shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 whitespace-pre-line", finalTitleColor)}>
            {title}
          </h1>
          
          {subtitle && (
            <p className={cn("text-xl md:text-2xl font-josefin mb-10 leading-relaxed drop-shadow-lg max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 whitespace-pre-line", finalSubtitleColor)}>
              {subtitle}
            </p>
          )}

          {children && (
            <div className="flex flex-wrap gap-4 mt-2 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-400">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SimpleHero;
