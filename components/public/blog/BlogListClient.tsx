"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Tag, Clock, Calendar, User, ArrowDown, ChevronLeft, ChevronRight, X, Sliders } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SimpleHero from "@/components/common/SimpleHero";
import { Select, SelectOption } from "@/components/common/Select";
import { cn } from "@/lib/utils";

interface SerializedCategory {
  id: string;
  name: string;
}

interface SerializedPost {
  id: string;
  title: string;
  slug: string;
  caption: string | null;
  createdAt: string;
  thumbnailUrl: string | null;
  thumbnailImage: string | null;
  pageTheme: string | null;
  categories: { id: string; name: string }[];
  content: string;
  author: {
    id: string;
    name: string | null;
    surname: string | null;
    imageUrl: string | null;
    image: string | null;
  } | null;
}

interface BlogListClientProps {
  initialPosts: SerializedPost[];
  categories: SerializedCategory[];
}

// Framer Motion Animation Variants for the Card Grid
const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 18
    }
  }
};

// Helper: Estimate read time based on dynamic components or fallback to WPM
const getReadTime = (rawContent: string, caption: string | null, title: string) => {
  try {
    const modules = JSON.parse(rawContent);
    if (Array.isArray(modules)) {
      let totalMinutes = 0;
      let hasComponents = false;
      
      modules.forEach((module: any) => {
        if (!module || !module.type) return;
        const type = module.type.toLowerCase();
        
        if (type === 'paragraph') {
          totalMinutes += 3;
          hasComponents = true;
        } else if (type === 'paragraphwithimage') {
          totalMinutes += 2;
          hasComponents = true;
        } else if (type === 'quote') {
          totalMinutes += 1;
          hasComponents = true;
        } else if (type === 'actioncta') {
          totalMinutes += 1;
          hasComponents = true;
        }
      });
      
      if (hasComponents) {
        return totalMinutes || 1;
      }
    }
  } catch (e) {
    // Fallback if parsing fails
  }

  // Fallback: standard 200 WPM estimation
  const text = (caption || '') + ' ' + title;
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime || 1;
};

export default function BlogListClient({ initialPosts, categories }: BlogListClientProps) {
  const t = useTranslations('BlogPage');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Scroll anchor reference for page changes
  const gridAnchorRef = useRef<HTMLDivElement>(null);

  // 1. STATE INITIALIZATION FROM URL SEARCH PARAMS
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const cats = searchParams.get('categories');
    return cats ? cats.split(',') : [];
  });

  const [sortBy, setSortBy] = useState(() => searchParams.get('sort') || 'newest');

  const [currentPage, setCurrentPage] = useState<number>(() => {
    const p = parseInt(searchParams.get('page') || '1', 10);
    return isNaN(p) || p < 1 ? 1 : p;
  });

  const [pageSize, setPageSize] = useState<number>(() => {
    const l = parseInt(searchParams.get('limit') || '6', 10);
    // Validate that limit is divisible by 3 and between 6 and 24
    if (isNaN(l) || l < 6 || l > 24 || (l - 6) % 3 !== 0) {
      return 6;
    }
    return l;
  });

  // Modal specific state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingCategories, setPendingCategories] = useState<string[]>([]);

  // Calculate dynamic count of published posts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach(cat => {
      counts[cat.name] = 0;
    });
    initialPosts.forEach(post => {
      post.categories.forEach(cat => {
        if (counts[cat.name] !== undefined) {
          counts[cat.name]++;
        } else {
          counts[cat.name] = 1;
        }
      });
    });
    return counts;
  }, [initialPosts, categories]);

  // 2. SYNCHRONIZE STATE WITH THE URL (REPLACE HISTORY ON STATE UPDATES)
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','));
    }
    if (sortBy !== 'newest') {
      params.set('sort', sortBy);
    }
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    if (pageSize !== 6) {
      params.set('limit', pageSize.toString());
    }

    const newQueryString = params.toString();
    const currentQueryString = searchParams.toString();

    if (newQueryString !== currentQueryString) {
      const targetUrl = newQueryString ? `${pathname}?${newQueryString}` : pathname;
      router.replace(targetUrl, { scroll: false });
    }
  }, [selectedCategories, sortBy, currentPage, pageSize, pathname, router, searchParams]);

  // 2b. SYNCHRONIZE STATE WHEN URL QUERY PARAMS CHANGE (E.G. BACK/FORWARD BUTTONS)
  useEffect(() => {
    const cats = searchParams.get('categories') ? searchParams.get('categories')!.split(',') : [];
    const sort = searchParams.get('sort') || 'newest';
    const p = parseInt(searchParams.get('page') || '1', 10);
    const pageVal = isNaN(p) || p < 1 ? 1 : p;
    const l = parseInt(searchParams.get('limit') || '6', 10);
    const limitVal = isNaN(l) || l < 6 || l > 24 || (l - 6) % 3 !== 0 ? 6 : l;

    setSelectedCategories(prev => {
      if (prev.length !== cats.length || !prev.every((v, i) => v === cats[i])) {
        return cats;
      }
      return prev;
    });
    setSortBy(prev => prev !== sort ? sort : prev);
    setCurrentPage(prev => prev !== pageVal ? pageVal : prev);
    setPageSize(prev => prev !== limitVal ? limitVal : prev);
  }, [searchParams]);

  // 3. FILTERING & SORTING COMPUTATION (MEMOIZED FULL DATASET)
  const allFilteredPosts = useMemo(() => {
    let result = [...initialPosts];

    // Category Filter (OR logic: posts must belong to at least one of the selected categories)
    if (selectedCategories.length > 0) {
      result = result.filter(post =>
        post.categories.some(cat => selectedCategories.includes(cat.name))
      );
    }

    // Sorting (Newest vs Oldest based on createdAt string)
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [initialPosts, selectedCategories, sortBy]);

  // 4. PAGINATION CALCULATIONS
  const totalPostsCount = allFilteredPosts.length;
  const totalPages = Math.ceil(totalPostsCount / pageSize);

  // Guard current page boundary
  const activePage = Math.min(Math.max(1, currentPage), totalPages || 1);

  const paginatedPosts = useMemo(() => {
    const startIndex = (activePage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return allFilteredPosts.slice(startIndex, endIndex);
  }, [allFilteredPosts, activePage, pageSize]);

  // Page switcher with smooth scroll anchor behavior
  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    setTimeout(() => {
      gridAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleSortToggle = () => {
    setSortBy(prev => (prev === 'newest' ? 'oldest' : 'newest'));
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSortBy('newest');
    setCurrentPage(1);
    setPageSize(6);
  };

  // Modal action handlers
  const handleOpenModal = () => {
    setPendingCategories([...selectedCategories]);
    setIsModalOpen(true);
  };

  const handlePendingCategoryToggle = (name: string) => {
    setPendingCategories(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const handleClearPendingCategories = () => {
    setPendingCategories([]);
    setSelectedCategories([]);
    setCurrentPage(1);
    setIsModalOpen(false);
  };

  const handleApplyPendingCategories = () => {
    setSelectedCategories(pendingCategories);
    setCurrentPage(1);
    setIsModalOpen(false);
  };

  // Pagination helper to build pages with ellipses (e.g. 1, 2, ..., 5)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const range = 1; // Show one page before and after activePage

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= activePage - range && i <= activePage + range)
      ) {
        pages.push(i);
      } else if (
        i === 2 ||
        i === totalPages - 1
      ) {
        pages.push('...');
      }
    }

    return pages.filter((item, index, self) => {
      return item !== '...' || self[index - 1] !== '...';
    });
  };

  const isNewest = sortBy === 'newest';

  return (
    <div className="flex flex-col flex-1 w-full font-sans">
      {/* Dynamic Serene Hero Section */}
      <SimpleHero
        title={t("title")}
        subtitle={t("subtitle")}
        imageSrc="/images/simple-hero/img-blog.jpg"
        align="center"
        overlayOpacity={0.45}
        darkOverlayColor="blue"
        lightOverlayColor="green"
        className="text-custom-almond font-kugile"
      />

      {/* Main Listing Viewport */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-24 py-12 md:py-20 bg-linear-to-b from-custom-celadon to-custom-almond dark:from-custom-green dark:to-custom-blue transition-colors duration-500 min-h-[60vh]">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* SEARCH & FILTERS BAR */}
          <div className="
          w-full md:w-fit md:ml-auto
          p-4 sm:p-6 md:p-8
          relative z-30 
          bg-linear-to-b from-custom-coconut/50 to-custom-green/20
          dark:bg-linear-to-b 
          dark:from-custom-blue/10 
          dark:to-custom-blue/80
          border border-custom-blue/5 
          dark:border-white/5 rounded-4xl
          shadow-2xl backdrop-blur-md
          ">
            <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 md:gap-6">

              {/* Category Filter Button */}
              <div className="flex flex-col gap-2 min-w-0 w-full md:w-auto">
                <label className="text-[10px] font-bold text-custom-blue/60 dark:text-custom-celadon/60 uppercase tracking-widest ps-1">
                  {t("filterCategories")}
                </label>
                <div>
                  <button
                    type="button"
                    onClick={handleOpenModal}
                    className="flex items-center justify-center gap-3 w-full md:w-auto px-6 h-12 rounded-2xl bg-white/40 dark:bg-custom-blue/40 hover:bg-white/60 dark:hover:bg-custom-blue/60 border border-custom-blue/10 dark:border-white/10 text-xs font-black uppercase tracking-wider text-custom-blue dark:text-custom-celadon transition-all duration-300 active:scale-95 shadow-sm"
                  >
                    <Sliders className="h-4 w-4 text-custom-blue/50 dark:text-custom-celadon/50" />
                    <span>{t("filterCategories")}</span>
                    {selectedCategories.length > 0 && (
                      <span className="flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-custom-blue dark:bg-custom-celadon text-white dark:text-custom-blue text-[9px] font-black leading-none animate-pulse">
                        {selectedCategories.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Right sorting and pagination limits side by side */}
              <div className="grid grid-cols-2 gap-4 w-full md:flex md:items-center md:gap-6 md:w-auto">

                {/* Minimalist Modern Sort Toggle */}
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-[10px] font-bold text-custom-blue/60 dark:text-custom-celadon/60 uppercase tracking-widest ps-1">
                    {t("sortBy")}
                  </label>
                  <button
                    type="button"
                    onClick={handleSortToggle}
                    className="flex items-center justify-center gap-3 w-full px-5 h-12 rounded-2xl bg-white/40 dark:bg-custom-blue/40 hover:bg-white/60 dark:hover:bg-custom-blue/60 border border-custom-blue/10 dark:border-white/10 text-xs font-black uppercase tracking-wider text-custom-blue dark:text-custom-celadon transition-all duration-300 active:scale-95 shrink-0 shadow-sm"
                  >
                    <span className="truncate">{isNewest ? t("moreRecentFirst") : t("olderFirst")}</span>
                    <motion.div
                      animate={{ rotate: isNewest ? 0 : 180 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="flex items-center justify-center shrink-0"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </motion.div>
                  </button>
                </div>

                {/* Page Size Selector at Top */}
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-[10px] font-bold text-custom-blue/60 dark:text-custom-celadon/60 uppercase tracking-widest ps-1">
                    {t("show")}
                  </label>
                  <div className="w-full md:w-28">
                    <Select
                      value={pageSize.toString()}
                      onChange={(val) => handlePageSizeChange(parseInt(val, 10))}
                      size="md"
                      placeholder="6"
                      triggerClassName={(open) => cn(
                        "h-12 w-full px-4 rounded-2xl border transition-all duration-300 active:scale-95 shadow-sm font-black text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer outline-none select-none",
                        open
                          ? "bg-white/60 dark:bg-custom-blue/60 border-custom-blue/20 dark:border-white/20 text-custom-blue dark:text-custom-celadon"
                          : "bg-white/40 dark:bg-custom-blue/40 hover:bg-white/60 dark:hover:bg-custom-blue/60 border-custom-blue/10 dark:border-white/10 text-custom-blue dark:text-custom-celadon"
                      )}
                      chevronClassName="h-4 w-4 text-custom-blue/50 dark:text-custom-celadon/50"
                    >
                      {[6, 9, 12, 15, 18, 21, 24].map((size) => (
                        <SelectOption key={size} value={size.toString()}>
                          {size.toString()}
                        </SelectOption>
                      ))}
                    </Select>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* BLOG POST CARD GRID ANCHOR WITH SCROLL OFFSET */}
          <div ref={gridAnchorRef} className="scroll-mt-44" />

          {/* BLOG POST CARD GRID */}
          <AnimatePresence mode="popLayout">
            {paginatedPosts.length > 0 ? (
              <div className="space-y-12">
                <motion.div
                  key="grid"
                  variants={gridVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
                >
                  {paginatedPosts.map((post) => {
                    const readTime = getReadTime(post.content, post.caption, post.title);

                    return (
                      <motion.article
                        key={post.id}
                        variants={cardVariants}
                        layout
                        className="relative flex flex-col h-full bg-white/40 dark:bg-custom-blue/40 border border-custom-blue/5 dark:border-white/5 rounded-4xl overflow-hidden shadow-2xl backdrop-blur-md transition-all duration-500 hover:shadow-custom-blue/5 hover:-translate-y-2 hover:border-custom-blue/15 dark:hover:border-custom-celadon/15 group cursor-pointer"
                      >
                        {/* Absolute Clickable Overlay */}
                        <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-20" aria-label={post.title} />

                        {/* Thumbnail Container */}
                        <div className="relative w-full h-[200px] sm:h-[240px] overflow-hidden block z-10">
                          {post.thumbnailImage || post.thumbnailUrl ? (
                            <img
                              src={post.thumbnailImage || post.thumbnailUrl!}
                              alt={post.title}
                              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-linear-to-tr from-custom-blue/20 to-custom-celadon/25 dark:from-custom-green/20 dark:to-custom-blue/30 flex items-center justify-center relative">
                              <Tag className="h-12 w-12 text-custom-blue/20 dark:text-custom-celadon/20" />
                            </div>
                          )}

                          {/* Elegant overlay gradient */}
                          <div className="absolute inset-0 bg-linear-to-t from-custom-blue/10 to-transparent pointer-events-none opacity-60" />
                        </div>

                        {/* Content Card Body */}
                        <div className="flex flex-col flex-1 p-5 sm:p-8 space-y-4 relative z-10">

                          {/* Categories list */}
                          {post.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {post.categories.map((cat) => (
                                <span
                                  key={cat.id}
                                  className="px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-custom-blue/5 dark:bg-custom-celadon/10 text-custom-blue dark:text-custom-celadon border border-custom-blue/5 dark:border-custom-celadon/5"
                                >
                                  {cat.name}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Title */}
                          <h3 className="text-xl sm:text-2xl font-kugile text-custom-blue dark:text-custom-celadon line-clamp-2 leading-snug group-hover:text-custom-rosewood dark:group-hover:text-custom-almond transition-colors duration-300">
                            {post.title}
                          </h3>

                          {/* Caption/Summary */}
                          {post.caption && (
                            <p className="text-sm text-custom-blue/70 dark:text-custom-celadon/70 font-josefin line-clamp-3 leading-relaxed flex-1">
                              {post.caption}
                            </p>
                          )}

                          {/* Card Divider */}
                          <div className="w-full h-[1px] bg-custom-blue/5 dark:bg-white/5 my-2" />

                          {/* Card Bottom Meta (Author + Date/Time) */}
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            {/* Author Avatar & Name */}
                            {post.author && (
                              <div className="flex items-center gap-2">
                                {post.author.image || post.author.imageUrl ? (
                                  <img
                                    src={post.author.image || post.author.imageUrl!}
                                    alt={post.author.name || 'Author'}
                                    className="w-8 h-8 rounded-full object-cover border border-custom-blue/10 dark:border-white/10"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-custom-blue/5 dark:bg-custom-celadon/15 flex items-center justify-center border border-custom-blue/10 dark:border-white/10">
                                    <User className="w-4 h-4 text-custom-blue/50 dark:text-custom-celadon/50" />
                                  </div>
                                )}
                                <span className="text-xs font-bold text-custom-blue dark:text-custom-almond">
                                  {post.author.name} {post.author.surname}
                                </span>
                              </div>
                            )}

                            {/* Read Time & Date */}
                            <div className="flex flex-col items-end text-[9px] uppercase font-bold text-custom-blue/40 dark:text-custom-celadon/40 tracking-wider space-y-0.5">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(post.createdAt).toLocaleDateString(undefined, {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {t("minRead", { count: readTime })}
                              </span>
                            </div>
                          </div>

                        </div>
                      </motion.article>
                    );
                  })}
                </motion.div>

                {/* PREMIUM PAGINATION CONTROLS BLOCK */}
                <div className="flex items-center justify-center pt-10 border-t border-custom-blue/5 dark:border-white/5">
                  {totalPages > 1 && (
                    <nav className="flex items-center gap-2" aria-label="Pagination">
                      {/* Prev Button */}
                      <button
                        type="button"
                        disabled={activePage === 1}
                        onClick={() => handlePageChange(Math.max(1, activePage - 1))}
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-300 active:scale-95 disabled:pointer-events-none shadow-xs",
                          activePage === 1
                            ? "border-custom-blue/5 dark:border-white/5 text-custom-blue/30 dark:text-custom-celadon/30 opacity-40"
                            : "border-custom-blue/10 dark:border-white/10 text-custom-blue dark:text-custom-celadon hover:bg-white/40 dark:hover:bg-custom-blue/40"
                        )}
                        aria-label="Previous Page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      {/* Page numbers */}
                      {getPageNumbers().map((pageNum, idx) => {
                        if (pageNum === '...') {
                          return (
                            <span
                              key={`ellipsis-${idx}`}
                              className="flex items-center justify-center w-10 h-10 text-[10px] font-black text-custom-blue/40 dark:text-custom-celadon/40"
                            >
                              &bull;&bull;&bull;
                            </span>
                          );
                        }

                        const isPageActive = pageNum === activePage;
                        return (
                          <button
                            key={`page-${pageNum}`}
                            type="button"
                            onClick={() => handlePageChange(pageNum as number)}
                            className={cn(
                              "relative flex items-center justify-center w-10 h-10 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-95 border shadow-xs",
                              isPageActive
                                ? "border-transparent text-white dark:text-custom-blue font-black"
                                : "border-custom-blue/10 dark:border-white/10 text-custom-blue/70 dark:text-custom-celadon/70 hover:bg-white/40 dark:hover:bg-custom-blue/40"
                            )}
                          >
                            {isPageActive && (
                              <motion.div
                                layoutId="activePageCircle"
                                className="absolute inset-0 bg-custom-blue dark:bg-custom-celadon rounded-xl z-0 shadow-md"
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                              />
                            )}
                            <span className="relative z-10">{pageNum}</span>
                          </button>
                        );
                      })}

                      {/* Next Button */}
                      <button
                        type="button"
                        disabled={activePage === totalPages}
                        onClick={() => handlePageChange(Math.min(totalPages, activePage + 1))}
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-300 active:scale-95 disabled:pointer-events-none shadow-xs",
                          activePage === totalPages
                            ? "border-custom-blue/5 dark:border-white/5 text-custom-blue/30 dark:text-custom-celadon/30 opacity-40"
                            : "border-custom-blue/10 dark:border-white/10 text-custom-blue dark:text-custom-celadon hover:bg-white/40 dark:hover:bg-custom-blue/40"
                        )}
                        aria-label="Next Page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </nav>
                  )}
                </div>

              </div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="text-center py-24 bg-white/30 dark:bg-custom-blue/20 rounded-4xl border border-dashed border-custom-blue/10 dark:border-white/10 max-w-2xl mx-auto flex flex-col items-center gap-5 backdrop-blur-xs"
              >
                <div className="h-20 w-20 rounded-full bg-white/50 dark:bg-white/5 flex items-center justify-center shadow-inner">
                  <Tag className="h-10 w-10 text-custom-blue/30 dark:text-custom-celadon/30" />
                </div>
                <p className="text-custom-blue/60 dark:text-custom-celadon/60 text-sm font-bold uppercase tracking-widest max-w-md px-6">
                  {t("noPosts")}
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-6 py-3 rounded-full bg-custom-blue dark:bg-custom-celadon text-custom-coconut dark:text-custom-blue font-black uppercase text-xs tracking-widest shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                  {t("resetFilters")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* TACTILE CATEGORY FILTER MODAL OVERLAY */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-custom-blue/50 dark:bg-custom-blue/70 backdrop-blur-md"
            />

            {/* Modal Panel content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="relative w-full max-w-md bg-custom-coconut dark:bg-custom-blue border border-custom-blue/10 dark:border-white/10 p-5 sm:p-8 rounded-3xl sm:rounded-4xl shadow-2xl z-10 flex flex-col space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-kugile text-custom-blue dark:text-custom-celadon">
                  {t("filterCategories")}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-custom-blue/5 dark:hover:bg-white/5 text-custom-blue/50 dark:text-custom-celadon/50 hover:text-custom-rosewood transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Creative Masonry-style tag cloud of categories to pick */}
              <div className="flex flex-wrap gap-3 overflow-y-auto max-h-[300px] pr-2 scrollbar-none py-2 justify-start items-center">
                {categories
                  .filter((cat) => (categoryCounts[cat.name] || 0) > 0)
                  .map((cat) => {
                  const isSelected = pendingCategories.includes(cat.name);
                  const count = categoryCounts[cat.name] || 0;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handlePendingCategoryToggle(cat.name)}
                      className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-95 border-2 shadow-xs cursor-pointer",
                        isSelected
                          ? "bg-custom-blue dark:bg-custom-celadon text-white dark:text-custom-blue border-custom-blue dark:border-custom-celadon scale-105"
                          : "bg-white/40 dark:bg-custom-blue/20 text-custom-blue/70 dark:text-custom-celadon/70 border-custom-blue/10 dark:border-white/10 hover:bg-white/60 dark:hover:bg-custom-blue/30"
                      )}
                    >
                      <span>{cat.name}</span>
                      <span className="opacity-40 font-normal select-none">&bull;</span>
                      <span className={cn(
                        "text-[10px] font-black font-mono",
                        isSelected ? "text-white/80 dark:text-custom-blue/80" : "text-custom-blue/60 dark:text-custom-celadon/60"
                      )}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-custom-blue/5 dark:border-white/5">
                <button
                  type="button"
                  onClick={handleClearPendingCategories}
                  className="text-xs font-black uppercase tracking-wider text-custom-rosewood hover:text-custom-rosewood/80 transition-colors underline underline-offset-4 self-center sm:self-auto"
                >
                  {t("clearAll")}
                </button>

                <div className="flex items-center justify-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 sm:flex-none px-5 h-11 rounded-full border border-custom-blue/10 dark:border-white/10 text-xs font-black uppercase tracking-wider text-custom-blue/70 dark:text-custom-celadon/70 hover:bg-white/40 dark:hover:bg-custom-blue/30 transition-all text-center"
                  >
                    {t("cancel")}
                  </button>

                  <button
                    type="button"
                    onClick={handleApplyPendingCategories}
                    className="flex-1 sm:flex-none px-6 h-11 rounded-full bg-custom-blue dark:bg-custom-celadon text-white dark:text-custom-blue font-black uppercase text-xs tracking-widest shadow-md hover:scale-105 active:scale-95 transition-all text-center"
                  >
                    {t("apply")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Buffer Divider */}
      <section className="h-32 sm:h-64 transition-colors duration-500 flex items-center justify-center bg-custom-almond dark:bg-custom-blue">
        <div className="w-px h-16 sm:h-24 bg-linear-to-b from-custom-rosewood dark:from-custom-almond to-transparent opacity-50"></div>
      </section>
    </div>
  );
}
