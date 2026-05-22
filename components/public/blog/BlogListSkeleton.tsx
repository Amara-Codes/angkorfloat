import React from 'react';
import SimpleHero from "@/components/common/SimpleHero";
import { useTranslations } from 'next-intl';

export default function BlogListSkeleton({ limit = 6 }: { limit?: number }) {
  const skeletons = Array.from({ length: limit });

  return (
    <div className="flex flex-col flex-1 w-full font-sans">
      {/* Dynamic Serene Hero Section (Static version for skeleton) */}
      <div className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center bg-custom-blue overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center gap-4 text-custom-almond opacity-50">
          <div className="h-10 w-64 bg-white/20 rounded animate-pulse" />
          <div className="h-6 w-96 bg-white/20 rounded animate-pulse" />
        </div>
      </div>

      {/* Main Listing Viewport */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-24 py-12 md:py-20 bg-linear-to-b from-custom-celadon to-custom-almond dark:from-custom-green dark:to-custom-blue transition-colors duration-500 min-h-[60vh]">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* SEARCH & FILTERS BAR SKELETON */}
          <div className="w-full md:w-fit md:ml-auto p-4 sm:p-6 md:p-8 relative z-30 bg-linear-to-b from-custom-coconut/50 to-custom-green/20 dark:bg-linear-to-b dark:from-custom-blue/10 dark:to-custom-blue/80 border border-custom-blue/5 dark:border-white/5 rounded-3xl md:rounded-4xl shadow-2xl backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 md:gap-6">
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <div className="h-3 w-32 bg-custom-blue/20 dark:bg-white/20 rounded animate-pulse" />
                <div className="h-12 w-full md:w-40 bg-white/40 dark:bg-custom-blue/40 rounded-2xl animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-4 w-full md:flex md:items-center md:gap-6 md:w-auto">
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-3 w-16 bg-custom-blue/20 dark:bg-white/20 rounded animate-pulse" />
                  <div className="h-12 w-full md:w-32 bg-white/40 dark:bg-custom-blue/40 rounded-2xl animate-pulse" />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-3 w-16 bg-custom-blue/20 dark:bg-white/20 rounded animate-pulse" />
                  <div className="h-12 w-full md:w-28 bg-white/40 dark:bg-custom-blue/40 rounded-2xl animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* BLOG POST CARD GRID SKELETON */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {skeletons.map((_, idx) => (
                <article
                  key={idx}
                  className="relative flex flex-col h-full bg-white/40 dark:bg-custom-blue/40 border border-custom-blue/5 dark:border-white/5 rounded-3xl sm:rounded-4xl overflow-hidden shadow-2xl backdrop-blur-md"
                >
                  {/* Thumbnail Container */}
                  <div className="relative w-full h-[200px] sm:h-[240px] overflow-hidden bg-custom-blue/10 dark:bg-white/10 animate-pulse" />

                  {/* Content Card Body */}
                  <div className="flex flex-col flex-1 p-5 sm:p-8 space-y-4 relative z-10">
                    <div className="flex flex-wrap gap-1.5">
                      <div className="h-4 w-16 bg-custom-blue/10 dark:bg-white/10 rounded-lg animate-pulse" />
                      <div className="h-4 w-20 bg-custom-blue/10 dark:bg-white/10 rounded-lg animate-pulse" />
                    </div>

                    {/* Title */}
                    <div className="h-6 w-3/4 bg-custom-blue/10 dark:bg-white/10 rounded animate-pulse" />
                    <div className="h-6 w-1/2 bg-custom-blue/10 dark:bg-white/10 rounded animate-pulse" />

                    {/* Caption/Summary */}
                    <div className="space-y-2 mt-4">
                      <div className="h-3 w-full bg-custom-blue/10 dark:bg-white/10 rounded animate-pulse" />
                      <div className="h-3 w-full bg-custom-blue/10 dark:bg-white/10 rounded animate-pulse" />
                      <div className="h-3 w-2/3 bg-custom-blue/10 dark:bg-white/10 rounded animate-pulse" />
                    </div>

                    <div className="w-full h-[1px] bg-custom-blue/5 dark:bg-white/5 my-2" />

                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-custom-blue/10 dark:bg-white/10 animate-pulse" />
                        <div className="h-3 w-20 bg-custom-blue/10 dark:bg-white/10 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Bottom Buffer Divider */}
      <section className="h-32 sm:h-64 transition-colors duration-500 flex items-center justify-center bg-custom-almond dark:bg-custom-blue">
        <div className="w-px h-16 sm:h-24 bg-linear-to-b from-custom-rosewood dark:from-custom-almond to-transparent opacity-50"></div>
      </section>
    </div>
  );
}
