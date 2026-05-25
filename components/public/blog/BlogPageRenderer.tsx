"use client";

import React from 'react';
import SimpleHero from '@/components/common/SimpleHero';
import GridHero from '@/components/common/GridHero';
import Paragraph from '@/components/common/Paragraph';
import ParagraphWithImage from '@/components/common/ParagraphWithImage';
import ActionCTA from '@/components/common/ActionCTA';
import Spacer from '@/components/common/Spacer';
import Quote from '@/components/common/Quote';
import { HorizontalScrollSection, ScrollItem } from '@/components/common/HorizontalScrollSection';
import { cn } from "@/lib/utils";

const PAGE_THEMES_MAP: Record<string, string> = {
  'blue-almond': 'bg-custom-almond dark:bg-custom-blue',
  'blue-coconut': 'bg-custom-coconut dark:bg-custom-blue',
  'green-almond': 'bg-custom-almond dark:bg-custom-green',
  'green-coconut': 'bg-custom-coconut dark:bg-custom-green',
  'rosewood-almond': 'bg-custom-almond dark:bg-custom-rosewood',
  'rosewood-coconut': 'bg-custom-coconut dark:bg-custom-rosewood',
};

const PAGE_TEXT_THEMES_MAP: Record<string, string> = {
  'blue-almond': 'text-custom-blue dark:text-custom-almond',
  'blue-coconut': 'text-custom-blue dark:text-custom-coconut',
  'green-almond': 'text-custom-green dark:text-custom-almond',
  'green-coconut': 'text-custom-green dark:text-custom-coconut',
  'rosewood-almond': 'text-custom-rosewood dark:text-custom-almond',
  'rosewood-coconut': 'text-custom-rosewood dark:text-custom-coconut',
};

const FONT_FAMILIES_MAP: Record<string, string> = {
  'standard': 'font-sans',
  'josefin': 'font-josefin',
  'kugile': 'font-kugile',
};

interface Module {
  id: string;
  type: string;
  props: Record<string, any>;
}

interface BlogPost {
  title: string;
  thumbnailUrl?: string | null;
  createdAt: Date | string;
  showAuthor?: boolean;
  author?: {
    name: string | null;
    surname?: string | null;
    imageUrl?: string | null;
    image?: string | null;
    biography?: string | null;
  } | null;
  [key: string]: any;
}

export default function BlogPageRenderer({ content, post }: { content: string, post?: BlogPost }) {
  let modules: Module[] = [];
  
  try {
    modules = JSON.parse(content);
  } catch (e) {
    console.error("Failed to parse blog content:", e);
    return <div>Error loading content.</div>;
  }

  const replaceVariables = (text: string): string => {
    if (!text || !post) return text;
    return text.replace(/\{\{post\.(.*?)\}\}/g, (match, path) => {
      const value = path.split('.').reduce((obj: any, key: string) => obj?.[key], post);
      if (value instanceof Date) return value.toLocaleDateString();
      return value !== undefined && value !== null ? String(value) : match;
    });
  };

  const resolveMediaUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith('media://')) {
      const key = url.replace('media://', '');
      return `/api/media/${key}`;
    }
    return url;
  };

  const COLOR_PAIRS_MAP: Record<string, string> = {
    'coconut-green': 'bg-custom-coconut text-custom-blue dark:bg-custom-green dark:text-custom-coconut',
    'celadon-blue': 'bg-custom-celadon text-custom-blue dark:bg-custom-blue dark:text-custom-coconut',
    'blue-celadon': 'bg-custom-blue text-custom-celadon dark:bg-custom-celadon dark:text-custom-blue',
    'green-coconut': 'bg-custom-green text-custom-coconut dark:bg-custom-coconut dark:text-custom-blue',
    'almond-rosewood': 'bg-custom-almond text-custom-rosewood dark:bg-custom-rosewood dark:text-custom-almond',
    'rosewood-almond': 'bg-custom-rosewood text-custom-almond dark:bg-custom-almond dark:text-custom-rosewood',
    'almond-blue': 'bg-custom-almond text-custom-blue dark:bg-custom-blue dark:text-custom-almond',
    'blue-almond': 'bg-custom-blue text-custom-almond dark:bg-custom-almond dark:text-custom-blue',
    'celadon-rosewood': 'bg-custom-celadon text-custom-rosewood dark:bg-custom-rosewood dark:text-custom-celadon',
    'rosewood-celadon': 'bg-custom-rosewood text-custom-celadon dark:bg-custom-celadon dark:text-custom-rosewood',
    'coconut-rosewood': 'bg-custom-coconut text-custom-rosewood dark:bg-custom-rosewood dark:text-custom-coconut',
  };

  return (
    <div className={cn(
      "w-full flex flex-col gap-y-16 min-h-screen transition-colors duration-700 pb-32",
      post?.pageTheme ? PAGE_THEMES_MAP[post.pageTheme] : "bg-white dark:bg-custom-blue",
      post?.pageTheme ? PAGE_TEXT_THEMES_MAP[post.pageTheme] : "text-custom-blue dark:text-custom-coconut"
    )}>
      {modules.map((module) => {
        const { id, type, props } = module;

        switch (type) {
          case 'simpleHero':
            return (
              <SimpleHero
                key={id}
                title={replaceVariables(props.title || post?.title || "")}
                subtitle={replaceVariables(props.subtitle || "")}
                imageSrc={resolveMediaUrl(props.imageUrl || props.image || props.imageSrc || post?.thumbnailUrl || "") || ""}
                align={props.align}
                vAlign={props.vAlign}
                overlayOpacity={props.overlayOpacity}
                lightOverlayColor={props.lightOverlayColor}
                darkOverlayColor={props.darkOverlayColor}
                titleColorClassName={props.titleColorClassName}
                subtitleColorClassName={props.subtitleColorClassName}
                className={cn("", props.className)}
              />
            );

          case 'gridHero':
            const topBgClass = props.topBgColorClassName || COLOR_PAIRS_MAP[props.topBgColor] || "";
            const topTitleFont = FONT_FAMILIES_MAP[props.topTitleFontFamily] || FONT_FAMILIES_MAP[props.topFontFamily] || "";
            const topTitleColor = props.topTitleColorClassName || "";
            const topSubtitleFont = FONT_FAMILIES_MAP[props.topSubtitleFontFamily] || FONT_FAMILIES_MAP[props.topFontFamily] || "";
            const topSubtitleColor = props.topSubtitleColorClassName || "";

            const bottomBgClass = props.bottomBgColorClassName || COLOR_PAIRS_MAP[props.bottomBgColor] || "";
            const bottomFont = FONT_FAMILIES_MAP[props.bottomFontFamily] || "";
            const bottomParagraphColor = props.bottomParagraphColorClassName || "";

            return (
              <GridHero
                key={id}
                imageSrc={resolveMediaUrl(props.imageUrl || props.image || props.imageSrc) || ""}
                imageAlt={props.imageAlt}
                imagePosition={props.imagePosition}
              >
                <div className={cn(topBgClass)}>
                  <h1 className={cn("text-4xl md:text-6xl italic mb-4 break-words", topTitleFont, topTitleColor)}>
                    {replaceVariables(props.topTitle)}
                  </h1>
                  <p className={cn("text-lg opacity-80", topSubtitleFont, topSubtitleColor)}>
                    {replaceVariables(props.topSubtitle)}
                  </p>
                </div>
                <div className={cn(bottomBgClass)}>
                  <p className={cn("text-xl font-bold leading-relaxed mb-8", bottomFont, bottomParagraphColor)}>
                    {replaceVariables(props.bottomParagraph)}
                  </p>
                  {props.hasButton && props.buttonLabel && props.buttonHref && (
                    <ActionCTA
                      title=""
                      paragraph=""
                      buttonOneLabel={props.buttonLabel}
                      buttonOneLink={props.buttonHref}
                      buttonOneVariant={props.buttonVariant}
                      className="p-0 min-h-0 bg-transparent"
                    />
                  )}
                </div>
              </GridHero>
            );

          case 'paragraph':
            return (
              <section key={id} className="px-6 md:px-12 lg:px-24 transition-colors duration-500">
                <div className="max-w-7xl mx-auto">
                  <Paragraph
                    as={props.as}
                    size={props.size}
                    align={props.align}
                    scrollReveal={props.scrollReveal}
                    weight={props.weight}
                    colorClassName={props.colorClassName}
                    className={cn(
                      "lg:py-24 px-0 md:px-16 rounded-3xl", 
                      COLOR_PAIRS_MAP[props.colors],
                      FONT_FAMILIES_MAP[props.fontFamily]
                    )}
                  >
                    {replaceVariables(props.children)}
                  </Paragraph>
                </div>
              </section>
            );

          case 'paragraphWithImage': {
            const isBg = props.imagePosition === 'background';
            return (
              <section key={id} className={cn("transition-colors duration-500", !isBg && "md:px-12 lg:px-24")}>
                <div className={cn(!isBg && "max-w-7xl mx-auto")}>
                  <ParagraphWithImage
                    imageSrc={resolveMediaUrl(props.imageUrl || props.image || props.imageSrc) || ""}
                    imageAlt={props.imageAlt}
                    imagePosition={props.imagePosition}
                    imageAspectRatio={props.imageAspectRatio}
                    parallax={props.parallax}
                    parallaxSpeed={props.parallaxSpeed}
                    overlayOpacity={props.overlayOpacity}
                    size={props.size}
                    weight={props.weight}
                    colorClassName={props.colorClassName}
                    className={cn(COLOR_PAIRS_MAP[props.colors], FONT_FAMILIES_MAP[props.fontFamily])}
                  >
                    {replaceVariables(props.children)}
                  </ParagraphWithImage>
                </div>
              </section>
            );
          }

          case 'quote': {
            const hasCustomBg = !!props.bgColorClassName;
            const quoteBgClass = hasCustomBg 
              ? props.bgColorClassName 
              : (COLOR_PAIRS_MAP[props.colors] || "bg-custom-coconut/20 dark:bg-custom-blue/20");
            const quoteTextClass = hasCustomBg
              ? (props.colorClassName || "text-custom-blue/100 dark:text-custom-celadon/100")
              : "";

            return (
              <section key={id} className="px-6 md:px-12 lg:px-24 transition-colors duration-500">
                <div className="max-w-7xl mx-auto">
                  <Quote
                    author={replaceVariables(props.author)}
                    authorDates={replaceVariables(props.authorDates)}
                    authorInfo={replaceVariables(props.authorInfo)}
                    colorClassName={quoteTextClass}
                    className={cn(
                      "rounded-3xl p-8 sm:p-12 md:p-16 border border-custom-blue/5 dark:border-custom-coconut/5 backdrop-blur-md", 
                      quoteBgClass,
                      FONT_FAMILIES_MAP[props.fontFamily]
                    )}
                  >
                    {replaceVariables(props.children)}
                  </Quote>
                </div>
              </section>
            );
          }

          case 'horizontalSlider':
            return (
              <HorizontalScrollSection
                key={id}
                title={props.title}
                subtitle={props.subtitle}
                className="pb-32"
              >
                {props.items?.map((item: any, idx: number) => (
                  <ScrollItem
                    key={item.id || idx}
                    title={item.title}
                    description={item.description}
                  />
                ))}
              </HorizontalScrollSection>
            );

          case 'actioncta':
            return (
              <ActionCTA
                key={id}
                title={props.title}
                paragraph={props.paragraph}
                buttonOneLabel={props.buttonOneLabel}
                buttonOneLink={props.buttonOneLink}
                buttonOneVariant={props.buttonOneVariant}
                buttonTwoLabel={props.buttonTwoLabel}
                buttonTwoLink={props.buttonTwoLink}
                buttonTwoVariant={props.buttonTwoVariant}
                imageSrc={resolveMediaUrl(props.imageUrl || props.image || props.imageSrc) || ""}
                imageAlt={props.imageAlt}
                imagePosition={props.imagePosition}
                titleColorClassName={props.titleColorClassName}
                paragraphColorClassName={props.paragraphColorClassName}
                className={FONT_FAMILIES_MAP[props.fontFamily]}
              />
            );

          case 'spacer':
            return (
              <section key={id} className="px-6 md:px-12 lg:px-24 transition-colors duration-500">
                <div className="max-w-7xl mx-auto">
                  <Spacer
                    height={props.height}
                    type={props.type}
                    lineColor={props.lineColor}
                    opacity={props.opacity}
                    lineWidth={props.lineWidth}
                    lineHeight={props.lineHeight}
                  />
                </div>
              </section>
            );

          default:
            return (
              <div key={id} className="py-12 px-8 bg-red-50 text-red-500 text-xs font-mono">
                Unknown module type: {type}
              </div>
            );
        }
      })}

      {/* Author Card Footer */}
      {post?.showAuthor && post.author && (
        <section className="px-6 md:px-12 lg:px-24 mt-16 transition-colors duration-500">
          <div className="max-w-3xl mx-auto">            
            {/* Author Card */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 p-8 sm:p-10 rounded-3xl bg-custom-coconut/20 dark:bg-custom-blue/20 border border-custom-blue/5 dark:border-custom-coconut/5 backdrop-blur-md shadow-lg hover:shadow-2xl hover:border-custom-celadon/30 dark:hover:border-custom-celadon/20 transition-all duration-500 group">
              <div className="h-20 w-20 rounded-full border-2 border-custom-celadon/40 dark:border-custom-celadon/20 shadow-md overflow-hidden flex items-center justify-center shrink-0 bg-custom-coconut/40 dark:bg-custom-blue/40 group-hover:scale-105 transition-transform duration-500">
                {post.author.imageUrl ? (
                  <img src={post.author.imageUrl} alt={post.author.name || ""} className="h-full w-full object-cover" />
                ) : post.author.image ? (
                  <img src={post.author.image} alt={post.author.name || ""} className="h-full w-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-custom-celadon/20 via-custom-blue/5 to-custom-rosewood/10 flex items-center justify-center">
                    <span className="text-2xl font-black font-kugile opacity-40">{post.author.name?.[0]?.toUpperCase() || "A"}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-3">
                <p className="text-[10px] font-bold text-custom-blue/40 dark:text-custom-celadon/50 uppercase tracking-[0.2em]">Published By</p>
                <h4 className="text-3xl font-kugile leading-tight text-custom-blue dark:text-custom-celadon">
                  {post.author.name} {post.author.surname || ""}
                </h4>
                <p className="text-sm opacity-80 leading-relaxed max-w-xl text-custom-blue/80 dark:text-custom-celadon/70">
                  {post.author.biography || "Dedicated author sharing wisdom, insights, and stories to support your floating journey and overall well-being."}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
