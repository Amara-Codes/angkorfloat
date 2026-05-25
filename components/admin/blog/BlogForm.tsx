"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { saveBlogPost } from "@/lib/actions/blog";
import {
  Globe,
  Lock,
  FileText,
  Trash2,
  ChevronDown,
  ChevronUp,
  Settings,
  Image as ImageIcon,
  Layout,
  Type,
  Quote as QuoteIcon,
  Columns,
  Search,
  Upload,
  X,
  Target,
  Tag,
  Eye,
  Share2,
  MoveRight,
  GripVertical,
  Maximize2,
  Minimize2,
  ExternalLink,
  Minus,
  Loader2,
  User
} from "lucide-react";
import imageCompression from 'browser-image-compression';
import { cn } from "@/lib/utils";
import FormActions from "@/components/admin/common/FormActions";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import { Select, SelectOption } from "@/components/common/Select";
import BaseModal from "@/components/common/BaseModal";
import { Input, Label } from "@/components/common/Input";

// Module Sub-components
import SimpleHeroModule from "./blog-module/SimpleHeroModule";
import GridHeroModule from "./blog-module/GridHeroModule";
import ParagraphModule from "./blog-module/ParagraphModule";
import QuoteModule from "./blog-module/QuoteModule";
import ParagraphWithImageModule from "./blog-module/ParagraphWithImageModule";
import HorizontalSliderModule from "./blog-module/HorizontalSliderModule";
import ActionCtaModule from "./blog-module/ActionCtaModule";
import SpacerModule from "./blog-module/SpacerModule";

// Design System Constants
const INPUT_CLASSES = "w-full bg-custom-coconut/40 dark:bg-custom-blue border-2 border-custom-blue/10 dark:border-custom-celadon/10 rounded-2xl h-[60px] px-6 text-lg font-black text-custom-blue dark:text-custom-celadon focus:outline-none focus:ring-2 focus:ring-custom-blue/20 dark:focus:ring-custom-celadon/30 placeholder:text-custom-blue/20 dark:placeholder:text-custom-celadon/20 transition-all shadow-sm focus:bg-custom-coconut";
const LABEL_CLASSES = "text-[10px] font-bold text-custom-blue/60 dark:text-custom-celadon/60 uppercase tracking-[0.2em]";
const CARD_CLASSES = "bg-custom-coconut/50 dark:bg-custom-blue border border-custom-blue/5 dark:border-custom-coconut/5 rounded-2xl shadow-2xl backdrop-blur-sm";

export const COLOR_PAIRS = [
  { id: 'coconut-green', label: 'Coconut / Green', classes: 'bg-custom-coconut text-custom-blue dark:bg-custom-green dark:text-custom-coconut' },
  { id: 'celadon-blue', label: 'Celadon / Blue', classes: 'bg-custom-celadon text-custom-blue dark:bg-custom-blue dark:text-custom-coconut' },
  { id: 'blue-celadon', label: 'Blue / Celadon', classes: 'bg-custom-blue text-custom-celadon dark:bg-custom-celadon dark:text-custom-blue' },
  { id: 'green-coconut', label: 'Green / Coconut', classes: 'bg-custom-green text-custom-coconut dark:bg-custom-coconut dark:text-custom-blue' },
  { id: 'almond-rosewood', label: 'Almond / Rosewood', classes: 'bg-custom-almond text-custom-rosewood dark:bg-custom-rosewood dark:text-custom-almond' },
  { id: 'rosewood-almond', label: 'Rosewood / Almond', classes: 'bg-custom-rosewood text-custom-almond dark:bg-custom-almond dark:text-custom-rosewood' },
  { id: 'almond-blue', label: 'Almond / Blue', classes: 'bg-custom-almond text-custom-blue dark:bg-custom-blue dark:text-custom-almond' },
  { id: 'blue-almond', label: 'Blue / Almond', classes: 'bg-custom-blue text-custom-almond dark:bg-custom-almond dark:text-custom-blue' },
  { id: 'celadon-rosewood', label: 'Celadon / Rosewood', classes: 'bg-custom-celadon text-custom-rosewood dark:bg-custom-rosewood dark:text-custom-celadon' },
  { id: 'rosewood-celadon', label: 'Rosewood / Celadon', classes: 'bg-custom-rosewood text-custom-celadon dark:bg-custom-celadon dark:text-custom-rosewood' },
  { id: 'coconut-rosewood', label: 'Coconut / Rosewood', classes: 'bg-custom-coconut text-custom-rosewood dark:bg-custom-rosewood dark:text-custom-coconut' },
];

export const PAGE_THEMES = [
  { id: 'blue-almond', label: 'Blue / Almond', classes: 'bg-custom-almond dark:bg-custom-blue' },
  { id: 'blue-coconut', label: 'Blue / Coconut', classes: 'bg-custom-coconut dark:bg-custom-blue' },
  { id: 'green-almond', label: 'Green / Almond', classes: 'bg-custom-almond dark:bg-custom-green' },
  { id: 'green-coconut', label: 'Green / Coconut', classes: 'bg-custom-coconut dark:bg-custom-green' },
  { id: 'rosewood-almond', label: 'Rosewood / Almond', classes: 'bg-custom-almond dark:bg-custom-rosewood' },
  { id: 'rosewood-coconut', label: 'Rosewood / Coconut', classes: 'bg-custom-coconut dark:bg-custom-rosewood' },
];

export const FONT_FAMILIES = [
  { id: 'standard', label: 'Standard (Sans)', class: 'font-sans' },
  { id: 'josefin', label: 'Josefin Sans', class: 'font-josefin' },
  { id: 'kugile', label: 'Kugile (Display)', class: 'font-kugile' },
];

export const SITE_COLORS = [
  { id: 'black', label: 'Black' },
  { id: 'white', label: 'White' },
  { id: 'coconut', label: 'Coconut' },
  { id: 'celadon', label: 'Celadon' },
  { id: 'blue', label: 'Blue' },
  { id: 'green', label: 'Green' },
  { id: 'rosewood', label: 'Rosewood' },
  { id: 'almond', label: 'Almond' },
];

export const colorMap: Record<string, string> = {
  'black': 'black',
  'white': 'white',
  'coconut': 'custom-coconut',
  'celadon': 'custom-celadon',
  'blue': 'custom-blue',
  'green': 'custom-green',
  'rosewood': 'custom-rosewood',
  'almond': 'custom-almond',
};

export const reverseColorMap: Record<string, string> = {
  'black': 'black',
  'white': 'white',
  'custom-coconut': 'coconut',
  'custom-celadon': 'celadon',
  'custom-blue': 'blue',
  'custom-green': 'green',
  'custom-rosewood': 'rosewood',
  'custom-almond': 'almond',
};

// Module Types
export type ModuleType =
  | 'simpleHero'
  | 'gridHero'
  | 'paragraph'
  | 'paragraphWithImage'
  | 'horizontalSlider'
  | 'quote'
  | 'actioncta'
  | 'spacer';

export interface Module {
  id: string;
  type: ModuleType;
  props: Record<string, any>;
}

interface SeoData {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  robots: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  ogImage: string;
  canonicalUrl: string;
}

interface BlogFormProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    caption?: string;
    content?: string;
    published: boolean;
    showAuthor?: boolean;
    thumbnailUrl?: string;
    thumbnailCaption?: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    robots?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImageUrl?: string;
    ogImage?: string;
    ogType?: string;
    canonicalUrl?: string;
    thumbnailImage?: string;
    pageTheme?: string;
  };
  categories?: { id: string; name: string }[];
  initialCategoryIds?: string[];
  canPublish?: boolean;
}

export const resolveMediaUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.startsWith('media://')) {
    const key = url.replace('media://', '');
    return `/api/media/${key}`;
  }
  return url;
};

export default function BlogForm({ post, categories = [], initialCategoryIds = [], canPublish = true }: BlogFormProps) {
  const saveAction = (prevState: any, formData: FormData) => saveBlogPost(prevState, formData, post?.id);
  const [errorMessage, dispatch] = useActionState(saveAction, undefined);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (errorMessage) setShowError(true);
  }, [errorMessage]);

  // State
  const [published, setPublished] = useState(post?.published || false);
  const [showAuthor, setShowAuthor] = useState(post?.showAuthor ?? true);
  const [pageTheme, setPageTheme] = useState(post?.pageTheme || 'blue-coconut');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(initialCategoryIds);
  const [modules, setModules] = useState<Module[]>([]);
  const [collapsedModules, setCollapsedModules] = useState<Set<string>>(new Set());
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const [buttonStyle, setButtonStyle] = useState<{ left: string; width: string }>({ left: 'auto', width: 'auto' });
  const [showSeoWarningModal, setShowSeoWarningModal] = useState(false);
  const bypassSeoCheckRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [seo, setSeo] = useState<SeoData>({
    metaTitle: post?.metaTitle || '',
    metaDescription: post?.metaDescription || '',
    keywords: post?.keywords || '',
    robots: post?.robots || 'index, follow',
    ogTitle: post?.ogTitle || '',
    ogDescription: post?.ogDescription || '',
    ogType: post?.ogType || 'article',
    ogImage: post?.ogImageUrl || post?.ogImage || '',
    canonicalUrl: post?.canonicalUrl || '',
  });
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');

  // Previews
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(resolveMediaUrl(post?.thumbnailUrl || post?.thumbnailImage));
  const [ogPreview, setOgPreview] = useState<string | null>(resolveMediaUrl(post?.ogImageUrl || post?.ogImage));

  // Initialize from post data
  useEffect(() => {
    if (post) {
      try {
        if (post.content) {
          const parsedModules = JSON.parse(post.content).map((m: any) => {
            const defaults = getDefaultProps(m.type) as Record<string, any>;
            const mergedProps = { ...defaults };
            const mProps = (m.props || {}) as Record<string, any>;
            for (const key in mProps) {
              if (mProps[key] !== undefined && mProps[key] !== null) {
                mergedProps[key] = mProps[key];
              }
            }
            return {
              ...m,
              props: mergedProps
            };
          });
          setModules(parsedModules);
          // Start with all modules collapsed in edit mode for better overview
          setCollapsedModules(new Set(parsedModules.map((m: any) => m.id)));
        }
      } catch (e) {
        console.error("Failed to parse post content", e);
      }
    }
  }, [post]);

  useEffect(() => {
    if (lastAddedId) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`module-card-${lastAddedId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setLastAddedId(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [lastAddedId]);

  useEffect(() => {
    const updatePosition = () => {
      const element = document.getElementById("canvas-controls");
      if (element) {
        const rect = element.getBoundingClientRect();
        setShowBackToTop(rect.top < -150);
      }

      const rightCol = rightColumnRef.current;
      if (rightCol) {
        const colRect = rightCol.getBoundingClientRect();
        setButtonStyle({
          left: `${colRect.left}px`,
          width: `${colRect.width}px`
        });
      }
    };

    // Capture phase (true) lets us listen to scrolling inside ANY container (divs, window, etc.)
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    updatePosition(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  const handleEditMetaTags = () => {
    setShowSeoWarningModal(false);
    setActiveTab('seo');
    setTimeout(() => {
      const element = document.getElementById("canvas-controls");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handlePublishAnyway = () => {
    setShowSeoWarningModal(false);
    bypassSeoCheckRef.current = true;
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
    setTimeout(() => {
      bypassSeoCheckRef.current = false;
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (bypassSeoCheckRef.current) return;

    const isMissingSeo = !seo.metaTitle?.trim() || !seo.metaDescription?.trim();
    if (published && isMissingSeo) {
      e.preventDefault();
      setShowSeoWarningModal(true);
    }
  };

  const addModule = (type: ModuleType) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newModule: Module = {
      id: newId,
      type,
      props: getDefaultProps(type),
    };
    setModules([...modules, newModule]);
    setLastAddedId(newId);
  };

  const removeModule = (id: string) => {
    setModules(modules.filter(m => m.id !== id));
    const newCollapsed = new Set(collapsedModules);
    newCollapsed.delete(id);
    setCollapsedModules(newCollapsed);
  };

  const updateModuleProps = (id: string, newProps: Record<string, any>) => {
    setModules(modules.map(m => m.id === id ? { ...m, props: newProps } : m));
  };

  const toggleCollapse = (id: string) => {
    const newCollapsed = new Set(collapsedModules);
    if (newCollapsed.has(id)) {
      newCollapsed.delete(id);
    } else {
      newCollapsed.add(id);
    }
    setCollapsedModules(newCollapsed);
  };

  const expandAll = () => setCollapsedModules(new Set());
  const collapseAll = () => setCollapsedModules(new Set(modules.map(m => m.id)));

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      action={dispatch}
      className="max-w-6xl space-y-12 pb-32 transition-colors duration-300"
    >
      <FormActions
        backLink="/admin/blog"
        backLabel="Back to list"
        buttonLabel={post ? "Update Article" : "Create Post"}
        disabled={!canPublish && published}
      />

      {/* Hidden Inputs for JSON data */}
      <input type="hidden" name="content" value={JSON.stringify(modules)} />
      <input type="hidden" name="published" value={String(published)} />
      <input type="hidden" name="showAuthor" value={String(showAuthor)} />
      <input type="hidden" name="pageTheme" value={pageTheme} />

      {/* Grid 1: Basic Info & Main Sidebar Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-2 space-y-10">
          {/* Phase 1: Basic Info */}
          <div className={cn(CARD_CLASSES, "p-8 sm:p-10")}>
            <div className="flex items-center gap-4 mb-10 border-b border-custom-blue/5 dark:border-custom-coconut/5 pb-6">
              <div className="p-3 bg-custom-blue/5 dark:bg-custom-coconut/10 rounded-2xl shadow-inner">
                <FileText className="h-8 w-8 text-custom-blue dark:text-custom-celadon" />
              </div>
              <div>
                <h3 className="text-3xl font-kugile text-custom-blue dark:text-custom-celadon">Article Content</h3>
                <p className="text-[10px] ps-1 uppercase tracking-widest font-bold text-custom-blue/60 dark:text-custom-celadon/50 mt-1">Add Title, Slug, Thumbnail, & Caption</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input label="Post Title" name="title" defaultValue={post?.title} placeholder="The Power of Silence..." />
                <Input label="URL Slug" name="slug" defaultValue={post?.slug} placeholder="the-power-of-silence" className="font-mono" />
              </div>

              <Input label="Article Caption / Summary" name="caption" defaultValue={post?.caption} placeholder="A brief introduction..." as="textarea" />

              <div className="space-y-4">
                <Label>Page Theme (Background)</Label>
                <div className="overflow-visible!">
                  <Select
                    value={pageTheme}
                    onChange={setPageTheme}
                    fullWidth
                    size="lg"
                  >
                    {PAGE_THEMES.map(t => (
                      <SelectOption key={t.id} value={t.id}>{t.label}</SelectOption>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Thumbnail Image</Label>
                <ImageUpload
                  name="thumbnailImage"
                  preview={thumbnailPreview}
                  onPreviewChange={setThumbnailPreview}
                />
                <div className="space-y-2 mt-4">
                  <Input label="Thumbnail Caption" name="thumbnailCaption" defaultValue={post?.thumbnailCaption} placeholder="Image by..." />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Settings */}
        <div className="lg:col-span-1 space-y-8">
          {/* Status Settings */}
          <div className={cn(CARD_CLASSES, "p-8")}>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-custom-blue/5 dark:bg-custom-coconut/10 rounded-2xl">
                <Settings className="h-6 w-6 text-custom-blue dark:text-custom-celadon" />
              </div>
              <div>
                <h3 className="text-2xl font-kugile text-custom-blue dark:text-custom-celadon">Visibility</h3>
                <Label className="mb-0">Publish Status</Label>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-custom-blue/2 dark:bg-custom-coconut/5 rounded-2xl border-2 border-custom-blue/5 dark:border-custom-coconut/5">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-xl", published ? "bg-emerald-500/10 text-emerald-500" : "bg-custom-rosewood/10 text-custom-rosewood")}>
                    {published ? <Globe className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-black text-xs text-custom-blue dark:text-custom-almond">{published ? "Published" : "Draft"}</p>
                    <p className="text-[9px] text-custom-blue/60 dark:text-custom-celadon/40 font-bold uppercase tracking-wider">{published ? "Live" : "Staging"}{!canPublish && " (Read-only)"}</p>
                  </div>
                </div>
                <Toggle checked={published} onChange={setPublished} disabled={!canPublish} />
              </div>
            </div>

            {/* Show Author Settings */}
            <div className="flex items-center justify-between p-5 bg-custom-blue/2 dark:bg-custom-coconut/5 rounded-2xl border-2 border-custom-blue/5 dark:border-custom-coconut/5 mt-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-xl", showAuthor ? "bg-emerald-500/10 text-emerald-500" : "bg-custom-rosewood/10 text-custom-rosewood")}>
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-black text-xs text-custom-blue dark:text-custom-almond">Show Author</p>
                    <p className="text-[9px] text-custom-blue/60 dark:text-custom-celadon/40 font-bold uppercase tracking-wider">{showAuthor ? "Visible" : "Hidden"}</p>
                  </div>
                </div>
                <Toggle checked={showAuthor} onChange={setShowAuthor} />
              </div>
            </div>
          </div>

          {/* Category Settings */}
          <div className={cn(CARD_CLASSES, "p-8")}>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-custom-blue/5 dark:bg-custom-coconut/10 rounded-2xl">
                <Tag className="h-6 w-6 text-custom-blue dark:text-custom-celadon" />
              </div>
              <div>
                <h3 className="text-2xl font-kugile text-custom-blue dark:text-custom-celadon">Category</h3>
                <span className="text-[10px] font-bold text-custom-blue/60 dark:text-custom-celadon/60 uppercase tracking-[0.2em]">Assign Categories</span>
              </div>
            </div>

            <div className="space-y-4">
              <Select
                value={selectedCategoryIds.join(',')}
                onChange={(val) => {
                  const arr = val ? val.split(',') : [];
                  setSelectedCategoryIds(arr);
                }}
                size="lg"
                multiselectMode={true}
                placeholder="Select categories..."
              >
                {categories.map((cat) => (
                  <SelectOption key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectOption>
                ))}
              </Select>

              {/* Selected Categories Badges */}
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {selectedCategoryIds.map((id) => {
                    const category = categories.find((c) => c.id === id);
                    if (!category) return null;
                    return (
                      <motion.span
                        key={id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-custom-blue/10 dark:bg-custom-celadon/10 text-custom-blue dark:text-custom-celadon border border-custom-blue/5 dark:border-custom-celadon/5 shadow-sm"
                      >
                        {category.name}
                        <button
                          type="button"
                          onClick={() => {
                            const newIds = selectedCategoryIds.filter((cid) => cid !== id);
                            setSelectedCategoryIds(newIds);
                          }}
                          className="hover:text-custom-rosewood dark:hover:text-custom-rosewood transition-colors p-0.5"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </motion.span>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
            <input type="hidden" name="categoryIds" value={selectedCategoryIds.join(',')} />
          </div>
        </div>
      </div>

      {/* Grid 2: Builder Canvas & Add Module Toolkit */}
      <div id="canvas-controls" className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 items-start scroll-mt-[100px]">
        {/* Left Column: Canvas Builder Area */}
        <div className="lg:col-span-2 space-y-10">

          {/* Builder Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2 p-1.5 bg-custom-coconut/40 dark:bg-custom-blue/40 border border-custom-coconut/20 dark:border-custom-coconut/10 rounded-2xl backdrop-blur-xl w-fit">
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all",
                  activeTab === 'content'
                    ? "bg-custom-blue text-custom-coconut shadow-lg"
                    : "text-custom-blue/50 dark:text-custom-celadon/50 hover:bg-custom-coconut/50 dark:hover:bg-custom-coconut/10"
                )}
              >
                Page Content
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('seo')}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all",
                  activeTab === 'seo'
                    ? "bg-custom-blue text-custom-coconut shadow-lg"
                    : "text-custom-blue/50 dark:text-custom-celadon/50 hover:bg-custom-coconut/50 dark:hover:bg-custom-coconut/10"
                )}
              >
                SEO & Social
              </button>
            </div>

            {activeTab === 'content' && modules.length > 0 && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={expandAll}
                  className="p-2.5 bg-custom-coconut/40 dark:bg-custom-coconut/5 border border-custom-coconut/20 dark:border-custom-coconut/10 rounded-xl text-custom-blue/60 dark:text-custom-almond/60 hover:bg-custom-coconut dark:hover:bg-custom-coconut/10 transition-all shadow-sm"
                  title="Expand All"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="p-2.5 bg-custom-coconut/40 dark:bg-custom-coconut/5 border border-custom-coconut/20 dark:border-custom-coconut/10 rounded-xl text-custom-blue/60 dark:text-custom-almond/60 hover:bg-custom-coconut dark:hover:bg-custom-coconut/10 transition-all shadow-sm"
                  title="Collapse All"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Content Tab */}
          <div className={activeTab === 'content' ? "block" : "hidden"}>
            <>
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Module List with Reorder */}
                <Reorder.Group
                  axis="y"
                  values={modules}
                  onReorder={setModules}
                  className="space-y-6"
                >
                  {modules.map((module) => (
                    <Reorder.Item
                      key={module.id}
                      value={module}
                      id={`module-card-${module.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: "visible", scrollMarginTop: "100px" }}
                    >
                      <div className={cn(
                        "group relative bg-custom-coconut/50 dark:bg-custom-blue border border-custom-blue/5 dark:border-custom-coconut/5 rounded-2xl shadow-xl transition-all hover:shadow-2xl hover:border-custom-blue/20 dark:hover:border-custom-coconut/20 overflow-visible!",
                        !collapsedModules.has(module.id) ? "z-30" : "z-10"
                      )}>
                        {/* Module Header - Accordion Trigger */}
                        <div
                          className={cn(
                            "flex items-center justify-between p-6 cursor-pointer select-none transition-colors",
                            collapsedModules.has(module.id) ? "hover:bg-custom-blue/5 dark:hover:bg-custom-coconut/5" : "bg-custom-blue/2 dark:bg-custom-coconut/2 border-b border-custom-blue/5 dark:border-custom-coconut/5"
                          )}
                          onClick={() => toggleCollapse(module.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-custom-blue/5 dark:bg-custom-coconut/10 rounded-lg text-custom-blue/60 dark:text-custom-celadon/40">
                              {getModuleIcon(module.type)}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-custom-blue dark:text-custom-celadon uppercase tracking-[0.2em]">{module.type.replace(/([A-Z])/g, ' $1')}</h4>
                              <p className="text-[9px] text-custom-blue/30 dark:text-custom-celadon/30 font-bold uppercase mt-0.5">Instance ID: {module.id}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeModule(module.id); }}
                                className="p-2 text-custom-rosewood/40 hover:text-custom-rosewood transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <div className="p-2 text-custom-blue/20 dark:text-custom-coconut/20 cursor-grab active:cursor-grabbing">
                                <GripVertical className="h-4 w-4" />
                              </div>
                            </div>
                            <div className={cn("transition-transform duration-300", collapsedModules.has(module.id) ? "" : "rotate-180")}>
                              <ChevronDown className="h-5 w-5 text-custom-blue/20 dark:text-custom-celadon/20" />
                            </div>
                          </div>
                        </div>

                        {/* Module Body - Content */}
                        <div className={collapsedModules.has(module.id) ? "hidden" : "block"}>
                          <div className="p-8 sm:p-10 pt-8 border-t border-custom-blue/5 dark:border-custom-coconut/5 overflow-visible!">
                            <ModuleForm
                              module={module}
                              onChange={(newProps) => updateModuleProps(module.id, newProps)}
                            />
                          </div>
                        </div>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>

                {modules.length === 0 && (
                  <div className="border-2 border-dashed border-custom-blue/10 dark:border-custom-coconut/10 rounded-4xl py-24 flex flex-col items-center justify-center text-center px-10">
                    <div className="h-20 w-20 rounded-full bg-custom-blue/5 dark:bg-custom-coconut/5 flex items-center justify-center mb-6">
                      <Layout className="h-10 w-10 text-custom-blue/20 dark:text-custom-celadon/20" />
                    </div>
                    <h4 className="text-xl font-kugile text-custom-blue/60 dark:text-custom-celadon/40">No modules added yet</h4>
                    <p className="text-xs text-custom-blue/30 dark:text-custom-celadon/30 mt-2 max-w-xs mx-auto">Start building your page by selecting a module from the sidebar palette.</p>
                  </div>
                )}
              </div>
            </>
          </div>

          {/* SEO Module Section */}
          <div className={activeTab === 'seo' ? "block" : "hidden"}>
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Google Search Preview */}
              <div className={cn(CARD_CLASSES, "p-8 sm:p-12")}>
                <div className="flex items-center gap-4 mb-10 border-b border-custom-blue/5 dark:border-custom-coconut/5 pb-8">
                  <div className="p-4 bg-emerald-500/10 rounded-2xl shadow-inner">
                    <Target className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-kugile text-custom-blue dark:text-custom-celadon">Search Engine Optimization</h3>
                    <p className="text-[10px] ps-1 uppercase tracking-widest font-bold text-custom-blue/60 dark:text-custom-celadon/50 mt-1">Configure metadata and robots</p>
                  </div>
                </div>

                <div className="space-y-10">
                  <Input
                    label="Meta Title"
                    name="metaTitle"
                    value={seo.metaTitle}
                    onChange={(v) => setSeo({ ...seo, metaTitle: v })}
                    placeholder="Angkor Float | The Power of Silence"
                  />

                  <Input
                    label="Meta Description"
                    as="textarea"
                    name="metaDescription"
                    value={seo.metaDescription}
                    onChange={(v) => setSeo({ ...seo, metaDescription: v })}
                    placeholder="Discover the therapeutic benefits of floating in Siem Reap..."
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input
                      label="Keywords"
                      name="keywords"
                      value={seo.keywords}
                      onChange={(v) => setSeo({ ...seo, keywords: v })}
                      placeholder="floating, siem reap, spa, wellness..."
                    />
                    <div className="space-y-2">
                      <Label icon={Eye}>Robots</Label>
                      <Select
                        value={seo.robots}
                        onChange={(v) => setSeo({ ...seo, robots: v })}
                        size="lg"
                        name="robots"
                      >
                        <SelectOption value="index, follow">Index, Follow</SelectOption>
                        <SelectOption value="noindex, follow">Noindex, Follow</SelectOption>
                        <SelectOption value="index, nofollow">Index, Nofollow</SelectOption>
                        <SelectOption value="noindex, nofollow">Noindex, Nofollow</SelectOption>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* OpenGraph Section */}
              <div className={cn(CARD_CLASSES, "p-8 sm:p-12")}>
                <div className="flex items-center gap-4 mb-10 border-b border-custom-blue/5 dark:border-custom-coconut/5 pb-8">
                  <div className="p-4 bg-custom-blue/5 dark:bg-custom-coconut/10 rounded-2xl shadow-inner text-custom-blue dark:text-custom-celadon">
                    <Share2 className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-kugile text-custom-blue dark:text-custom-celadon">Social Sharing (OG)</h3>
                    <p className={LABEL_CLASSES}>Customize appearance on social media</p>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input
                      label="OG Title"
                      name="ogTitle"
                      value={seo.ogTitle}
                      onChange={(v) => setSeo({ ...seo, ogTitle: v })}
                      placeholder="Angkor Float - Experience Silence"
                    />
                    <div className="space-y-2">
                      <Label>OG Type</Label>
                      <Select
                        value={seo.ogType}
                        onChange={(v) => setSeo({ ...seo, ogType: v })}
                        size="lg"
                        name="ogType"
                      >
                        <SelectOption value="article">Article</SelectOption>
                        <SelectOption value="website">Website</SelectOption>
                      </Select>
                    </div>
                  </div>

                  <Input
                    label="OG Description"
                    as="textarea"
                    name="ogDescription"
                    value={seo.ogDescription}
                    onChange={(v) => setSeo({ ...seo, ogDescription: v })}
                    placeholder="Share the silence with your followers..."
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <Label>OG Image</Label>
                      <ImageUpload
                        name="ogImage"
                        preview={ogPreview}
                        onPreviewChange={setOgPreview}
                      />
                    </div>
                    <div className="space-y-4 self-end">
                      <Input label="Canonical URL" name="canonicalUrl" value={seo.canonicalUrl} onChange={(v) => setSeo({ ...seo, canonicalUrl: v })} placeholder="https://angkorfloat.com/blog/..." />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Palette */}
        <div ref={rightColumnRef} className="lg:col-span-1">
          {/* Add Content Module (Only visible when activeTab === 'content') */}
          {activeTab === 'content' && (
            <div className={cn(CARD_CLASSES, "p-6 sm:p-8")}>
              <div className="flex items-center gap-3 mb-6 border-b border-custom-blue/5 dark:border-custom-coconut/5 pb-4">
                <div className="p-2 bg-custom-blue/5 dark:bg-custom-coconut/10 rounded-xl shadow-inner">
                  <Layout className="h-5 w-5 text-custom-blue dark:text-custom-celadon" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-custom-blue dark:text-custom-celadon uppercase tracking-[0.2em]">Add Module</h3>
                  <p className="text-[9px] font-bold text-custom-blue/40 dark:text-custom-celadon/40 uppercase tracking-widest mt-0.5">Click to insert on canvas</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {moduleOptions.map(option => (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => addModule(option.type)}
                    className="flex items-center gap-4 w-full p-4 rounded-2xl bg-custom-coconut/40 dark:bg-custom-coconut/5 border border-custom-coconut/20 dark:border-custom-coconut/10 hover:bg-custom-coconut hover:border-custom-blue/20 dark:hover:bg-custom-coconut/10 transition-all duration-300 group shadow-xs hover:shadow-md hover:translate-x-1"
                  >
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-custom-blue/5 dark:bg-custom-coconut/10 flex items-center justify-center text-custom-blue dark:text-custom-celadon group-hover:scale-105 transition-transform duration-300">
                      {option.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-custom-blue/60 dark:text-custom-celadon/60 text-left">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <BaseModal isOpen={showError} onClose={() => setShowError(false)} size="lg">
        <BaseModal.Header onClose={() => setShowError(false)}>
          <div className="flex items-end gap-4">
            <div className="p-3 bg-custom-rosewood/10 rounded-2xl">
              <Lock className="h-6 w-6 text-custom-rosewood" />
            </div>
            <span className="text-custom-rosewood font-black tracking-tight">Post Save Failed</span>
          </div>
        </BaseModal.Header>
        <BaseModal.Body>
          <div className="space-y-4">
            <p className="text-custom-blue dark:text-custom-coconut font-medium leading-relaxed">
              We encountered an issue while trying to save your article. Please check the details below:
            </p>
            <div className="p-6 bg-custom-rosewood/5 border-2 border-custom-rosewood/10 rounded-3xl">
              <code className="text-custom-rosewood text-sm font-mono wrap-break-word whitespace-pre-wrap">
                {errorMessage}
              </code>
            </div>
          </div>
        </BaseModal.Body>
        <BaseModal.Footer>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowError(false)}
              className="px-8 py-4 bg-custom-rosewood text-custom-coconut rounded-2xl font-black text-sm shadow-xl shadow-custom-rosewood/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Got it, thanks
            </button>
          </div>
        </BaseModal.Footer>
      </BaseModal>

       {/* Premium Floating Back to Controls Button, fixed and aligned to right column */}
       <AnimatePresence>
         {showBackToTop && (
           <motion.button
             type="button"
             initial={{ opacity: 0, scale: 0.8, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.8, y: 20 }}
             transition={{ type: "spring", stiffness: 260, damping: 20 }}
             onClick={() => {
               const element = document.getElementById("canvas-controls");
               if (element) {
                 element.scrollIntoView({ behavior: "smooth", block: "start" });
               }
             }}
             style={{
               left: buttonStyle.left,
               width: buttonStyle.width,
             }}
             className="fixed bottom-8 z-50 pointer-events-auto cursor-pointer flex items-center justify-center gap-2.5 px-6 py-4.5 rounded-2xl bg-custom-blue/95 dark:bg-custom-coconut/95 text-custom-coconut dark:text-custom-blue border border-custom-coconut/10 dark:border-custom-blue/10 shadow-[0_12px_40px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-black text-[10px] uppercase tracking-[0.2em]"
           >
             <ChevronUp className="h-4 w-4 text-custom-coconut dark:text-custom-blue animate-bounce" />
             Back to Controls
           </motion.button>
         )}
       </AnimatePresence>

       {/* SEO Warning Modal */}
       <BaseModal isOpen={showSeoWarningModal} onClose={() => setShowSeoWarningModal(false)} size="lg">
         <BaseModal.Header onClose={() => setShowSeoWarningModal(false)}>
           <div className="flex items-end gap-4">
             <div className="p-3 bg-amber-500/10 rounded-2xl">
               <Settings className="h-6 w-6 text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />
             </div>
             <span className="text-amber-500 font-black tracking-tight">SEO Metadata Missing</span>
           </div>
         </BaseModal.Header>
         <BaseModal.Body>
           <div className="space-y-6">
             <p className="text-custom-blue dark:text-custom-coconut font-medium leading-relaxed">
               You are about to publish this article without a <strong className="font-bold">Meta Title</strong> or <strong className="font-bold">Meta Description</strong>. These tags are critical for search engine visibility and listing quality:
             </p>
             <div className="space-y-4 p-6 bg-custom-coconut/60 dark:bg-custom-blue/40 border border-custom-blue/5 dark:border-custom-coconut/5 rounded-3xl">
               <div className="space-y-3">
                 <h4 className="text-xs font-black uppercase tracking-[0.1em] text-custom-blue dark:text-custom-celadon flex items-center gap-2">
                   <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                   Meta Title Importance
                 </h4>
                 <p className="text-xs text-custom-blue/70 dark:text-custom-celadon/70 leading-relaxed ps-4">
                   Google uses this as the primary clickable headline in search results. Leaving it empty forces Google to auto-generate one, which is rarely optimized for your target audience.
                 </p>
               </div>
               <div className="space-y-3 pt-3 border-t border-custom-blue/5 dark:border-custom-coconut/5">
                 <h4 className="text-xs font-black uppercase tracking-[0.1em] text-custom-blue dark:text-custom-celadon flex items-center gap-2">
                   <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                   Meta Description Importance
                 </h4>
                 <p className="text-xs text-custom-blue/70 dark:text-custom-celadon/70 leading-relaxed ps-4">
                   This description is displayed below your title in Google search results. It serves as your organic advertisement copy, directly influencing whether users click through to your article.
                 </p>
               </div>
             </div>
           </div>
         </BaseModal.Body>
         <BaseModal.Footer>
           <div className="flex flex-col sm:flex-row justify-end gap-4 w-full">
             <button
               type="button"
               onClick={handlePublishAnyway}
               className="px-8 py-4 bg-custom-rosewood/10 text-custom-rosewood hover:bg-custom-rosewood/20 rounded-2xl font-black text-sm transition-all"
             >
               Publish Anyway
             </button>
             <button
               type="button"
               onClick={handleEditMetaTags}
               className="px-8 py-4 bg-custom-blue text-custom-coconut dark:bg-custom-celadon dark:text-custom-blue rounded-2xl font-black text-sm shadow-xl shadow-custom-blue/20 dark:shadow-custom-celadon/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
             >
               Edit Meta Tags
             </button>
           </div>
         </BaseModal.Footer>
       </BaseModal>
     </form>
  );
}

// Sub-components
export function ImageUpload({ name, preview, onPreviewChange }: { name: string, preview: string | null, onPreviewChange: (v: string | null) => void }) {
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsCompressing(true);

        // Compression Options
        const options = {
          maxSizeMB: 2, // Max 2MB
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        // Transparently replace the file in the input using DataTransfer
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(new File([compressedFile], file.name, { type: file.type }));
        if (fileInputRef.current) {
          fileInputRef.current.files = dataTransfer.files;
        }

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
          onPreviewChange(reader.result as string);
          setIsCompressing(false);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Image compression failed:", error);
        setIsCompressing(false);
      }
    }
  };

  return (
    <div
      className={cn(
        "relative group flex flex-col items-center justify-center border-2 border-dashed border-custom-blue/10 dark:border-custom-coconut/10 rounded-3xl transition-all duration-500 hover:border-custom-blue/30 dark:hover:border-custom-coconut/30 overflow-hidden",
        preview ? "aspect-video" : "py-12"
      )}
    >
      {isCompressing ? (
        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
          <div className="relative">
            <div className="h-20 w-20 rounded-3xl bg-custom-blue/5 dark:bg-custom-coconut/10 flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-custom-rosewood animate-spin" />
            </div>
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-custom-rosewood animate-ping" />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-custom-rosewood">Optimizing</p>
            <p className="text-[8px] font-bold text-custom-blue/40 dark:text-custom-coconut/20 uppercase tracking-tighter mt-1">Shrinking file under the hood</p>
          </div>
        </div>
      ) : preview ? (
        <>
          <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-custom-blue/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-custom-coconut text-custom-blue rounded-2xl shadow-xl hover:scale-110 transition-transform"
            >
              <Upload className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => onPreviewChange(null)}
              className="p-3 bg-custom-rosewood text-custom-coconut rounded-2xl shadow-xl hover:scale-110 transition-transform"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-6 group relative w-full h-full py-16"
        >
          <div className="absolute inset-0 bg-linear-to-br from-custom-celadon/10 via-custom-blue/5 to-custom-rosewood/5 opacity-50 group-hover:opacity-80 transition-opacity" />
          <div className="relative h-20 w-20 rounded-3xl bg-custom-coconut/40 dark:bg-custom-coconut/5 flex items-center justify-center text-custom-blue/20 dark:text-custom-coconut/20 group-hover:scale-110 group-hover:bg-custom-coconut/60 dark:group-hover:bg-custom-coconut/10 transition-all duration-500 shadow-xl border border-custom-coconut/20">
            <Upload className="h-8 w-8 text-custom-blue dark:text-custom-celadon opacity-40 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="relative text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-custom-blue/60 dark:text-custom-celadon/60">Upload Thumbnail</p>
            <p className="text-[8px] font-bold text-custom-blue/30 dark:text-custom-coconut/20 uppercase tracking-tighter mt-2">Recommended: 1920x1080</p>
          </div>
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}

// Module Form Renderer
function ModuleForm({ module, onChange }: { module: Module, onChange: (newProps: Record<string, any>) => void }) {
  const { type } = module;

  switch (type) {
    case 'simpleHero':
      return <SimpleHeroModule module={module} onChange={onChange} />;
    case 'gridHero':
      return <GridHeroModule module={module} onChange={onChange} />;
    case 'paragraph':
      return <ParagraphModule module={module} onChange={onChange} />;
    case 'quote':
      return <QuoteModule module={module} onChange={onChange} />;
    case 'paragraphWithImage':
      return <ParagraphWithImageModule module={module} onChange={onChange} />;
    case 'horizontalSlider':
      return <HorizontalSliderModule module={module} onChange={onChange} />;
    case 'actioncta':
      return <ActionCtaModule module={module} onChange={onChange} />;
    case 'spacer':
      return <SpacerModule module={module} onChange={onChange} />;
    default:
      return <div className="text-xs text-custom-blue/60 italic">Module configuration coming soon...</div>;
  }
}

// UI Helpers

export function Toggle({ checked, onChange, disabled }: { checked: boolean, onChange: (v: boolean) => void, disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 rounded-full border-2 border-transparent transition-all duration-300",
        checked ? "bg-emerald-500" : "bg-custom-rosewood/30",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      )}
    >
      <span className={cn(
        "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-custom-coconut shadow-xl transition duration-300",
        checked ? "translate-x-5" : "translate-x-0"
      )} />
    </button>
  );
}

export function OpacitySelector({ value, onChange, label }: { value: number, onChange: (v: number) => void, label: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newValue = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    onChange(parseFloat(newValue.toFixed(2)));
  };

  return (
    <div className="space-y-4 py-2">
      <div className="flex justify-between items-center">
        <Label className="mb-0 text-custom-blue/80! dark:text-custom-celadon/80!">{label}</Label>
        <div className="text-[10px] font-black text-custom-blue dark:text-custom-celadon bg-custom-blue/10 dark:bg-custom-coconut/10 px-3 py-1 rounded-full border border-custom-blue/5 shadow-inner min-w-[45px] text-center transition-all duration-200">
          {(value * 100).toFixed(0)}%
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative h-3 w-full bg-custom-blue/10 dark:bg-custom-coconut/5 rounded-full cursor-pointer group touch-none"
        onPointerDown={(e) => {
          handleMove(e.clientX);
          const handlePointerMove = (moveEvent: PointerEvent) => handleMove(moveEvent.clientX);
          const handlePointerUp = () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
          };
          window.addEventListener('pointermove', handlePointerMove);
          window.addEventListener('pointerup', handlePointerUp);
        }}
      >
        {/* Track Glow */}
        <div
          className="absolute inset-0 rounded-full blur-[2px] opacity-20 bg-custom-blue dark:bg-custom-celadon transition-all duration-150"
          style={{ width: `${value * 100}%` }}
        />

        {/* Progress Bar */}
        <div
          className="absolute top-0 left-0 h-full bg-linear-to-r from-custom-blue to-custom-blue/80 dark:from-custom-celadon dark:to-custom-celadon/80 rounded-full z-10 transition-all duration-150"
          style={{ width: `${value * 100}%`, opacity: 0.4 + value * 0.6 }}
        />

        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-7 w-7 bg-custom-coconut dark:bg-custom-blue border-[5px] border-custom-blue dark:border-custom-celadon rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-grab active:cursor-grabbing z-20 hover:scale-110 transition-all duration-150"
          style={{ left: `calc(${value * 100}% - 14px)` }}
        >
          <div className="absolute inset-0 rounded-full bg-custom-blue/5 dark:bg-custom-coconut/5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function OpacityRangeSelector({ value, onChange, label }: { value: number, onChange: (v: number) => void, label: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const val = Math.round(pct * 9 + 1) * 10;
    onChange(val);
  };

  return (
    <div className="space-y-3 py-1">
      <div className="flex justify-between items-center">
        <Label className="mb-0 text-custom-blue/80! dark:text-custom-celadon/80!">{label}</Label>
        <div className="text-[10px] font-black text-custom-blue dark:text-custom-celadon bg-custom-blue/10 dark:bg-custom-coconut/10 px-2.5 py-0.5 rounded-full border border-custom-blue/5 shadow-inner min-w-[40px] text-center transition-all duration-200">
          {value}%
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative h-2.5 w-full bg-custom-blue/10 dark:bg-custom-coconut/5 rounded-full cursor-pointer group touch-none"
        onPointerDown={(e) => {
          handleMove(e.clientX);
          const handlePointerMove = (moveEvent: PointerEvent) => handleMove(moveEvent.clientX);
          const handlePointerUp = () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
          };
          window.addEventListener('pointermove', handlePointerMove);
          window.addEventListener('pointerup', handlePointerUp);
        }}
      >
        {/* Track Glow */}
        <div
          className="absolute inset-0 rounded-full blur-[2px] opacity-20 bg-custom-blue dark:bg-custom-celadon transition-all duration-150"
          style={{ width: `${value}%` }}
        />

        {/* Progress Bar */}
        <div
          className="absolute top-0 left-0 h-full bg-linear-to-r from-custom-blue to-custom-blue/80 dark:from-custom-celadon dark:to-custom-celadon/80 rounded-full z-10 transition-all duration-150"
          style={{ width: `${value}%` }}
        />

        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-5 w-5 bg-custom-coconut dark:bg-custom-blue border-4 border-custom-blue dark:border-custom-celadon rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15)] cursor-grab active:cursor-grabbing z-20 hover:scale-110 transition-all duration-150"
          style={{ left: `calc(${value}% - 10px)` }}
        />
      </div>
    </div>
  );
}

interface GranularColorPickerProps {
  label: string;
  value?: string;
  onChange: (newValue: string) => void;
  mode?: 'text' | 'bg';
}

export function GranularColorPicker({ label, value = "", onChange, mode = 'text' }: GranularColorPickerProps) {
  let lightColor = "blue";
  let lightOpacity = 100;
  let darkColor = "celadon";
  let darkOpacity = 100;

  const prefix = mode === 'bg' ? 'bg-' : 'text-';
  const darkPrefix = mode === 'bg' ? 'dark:bg-' : 'dark:text-';

  const tokens = value ? value.split(" ") : [];

  const lightToken = tokens.find(t => t.startsWith(prefix));
  if (lightToken) {
    const regex = new RegExp(`${prefix}([a-zA-Z0-9\\-]+)(?:\\/(\\d+))?`);
    const match = lightToken.match(regex);
    if (match) {
      const parsedColor = reverseColorMap[match[1]] || match[1];
      if (SITE_COLORS.some(c => c.id === parsedColor)) {
        lightColor = parsedColor;
      }
      if (match[2]) {
        lightOpacity = parseInt(match[2], 10);
      }
    }
  }

  const darkToken = tokens.find(t => t.startsWith(darkPrefix));
  if (darkToken) {
    const regex = new RegExp(`${darkPrefix}([a-zA-Z0-9\\-]+)(?:\\/(\\d+))?`);
    const match = darkToken.match(regex);
    if (match) {
      const parsedColor = reverseColorMap[match[1]] || match[1];
      if (SITE_COLORS.some(c => c.id === parsedColor)) {
        darkColor = parsedColor;
      }
      if (match[2]) {
        darkOpacity = parseInt(match[2], 10);
      }
    }
  }

  const updateColor = (lc: string, lo: number, dc: string, do_: number) => {
    const lightTailwindColor = colorMap[lc] || lc;
    const darkTailwindColor = colorMap[dc] || dc;
    const lightClass = `${prefix}${lightTailwindColor}/${lo}`;
    const darkClass = `${darkPrefix}${darkTailwindColor}/${do_}`;
    onChange(`${lightClass} ${darkClass}`);
  };

  return (
    <div className="space-y-4 p-5 bg-custom-blue/2 dark:bg-custom-coconut/2 border border-custom-blue/5 dark:border-custom-coconut/5 rounded-3xl">
      <Label className="mb-2 text-custom-blue dark:text-custom-celadon font-black">{label}</Label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 p-4 rounded-2xl bg-custom-coconut/40 dark:bg-custom-blue/40 border border-custom-blue/5 dark:border-custom-coconut/5">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-custom-blue/5 dark:border-custom-coconut/5">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <h6 className="text-[10px] font-black uppercase tracking-widest text-custom-blue/60 dark:text-custom-celadon/50">Light Mode</h6>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <Select
              value={lightColor}
              onChange={(c) => updateColor(c, lightOpacity, darkColor, darkOpacity)}
              size="lg"
            >
              {SITE_COLORS.map(c => (
                <SelectOption key={c.id} value={c.id}>{c.label}</SelectOption>
              ))}
            </Select>
          </div>

          <OpacityRangeSelector
            label="Opacity"
            value={lightOpacity}
            onChange={(o) => updateColor(lightColor, o, darkColor, darkOpacity)}
          />
        </div>

        <div className="space-y-4 p-4 rounded-2xl bg-custom-coconut/40 dark:bg-custom-blue/40 border border-custom-blue/5 dark:border-custom-coconut/5">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-custom-blue/5 dark:border-custom-coconut/5">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <h6 className="text-[10px] font-black uppercase tracking-widest text-custom-blue/60 dark:text-custom-celadon/50">Dark Mode</h6>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <Select
              value={darkColor}
              onChange={(c) => updateColor(lightColor, lightOpacity, c, darkOpacity)}
              size="lg"
            >
              {SITE_COLORS.map(c => (
                <SelectOption key={c.id} value={c.id}>{c.label}</SelectOption>
              ))}
            </Select>
          </div>

          <OpacityRangeSelector
            label="Opacity"
            value={darkOpacity}
            onChange={(o) => updateColor(lightColor, lightOpacity, darkColor, o)}
          />
        </div>
      </div>
    </div>
  );
}

// Helpers
function getDefaultProps(type: ModuleType) {
  switch (type) {
    case 'simpleHero': return { title: '', subtitle: '', imageSrc: '', imageAlt: 'Hero image', align: 'center', vAlign: 'center', overlayOpacity: 0.4, lightOverlayColor: 'black', darkOverlayColor: 'black', parallax: true, titleColorClassName: 'text-custom-coconut/100 dark:text-custom-celadon/100', subtitleColorClassName: 'text-custom-coconut/80 dark:text-custom-celadon/80' };
    case 'gridHero': return {
      imageSrc: '',
      imageAlt: 'GridHero image',
      imagePosition: 'left',
      topTitle: '',
      topSubtitle: '',
      topBgColorClassName: 'bg-custom-coconut/100 dark:bg-custom-blue/100',
      topTitleColorClassName: 'text-custom-blue/100 dark:text-custom-celadon/100',
      topSubtitleColorClassName: 'text-custom-blue/80 dark:text-custom-celadon/80',
      topTitleFontFamily: 'standard',
      topSubtitleFontFamily: 'standard',
      bottomParagraph: '',
      bottomBgColorClassName: 'bg-custom-coconut/80 dark:bg-custom-blue/80',
      bottomParagraphColorClassName: 'text-custom-blue/100 dark:text-custom-celadon/100',
      bottomFontFamily: 'standard',
      hasButton: false,
      buttonLabel: 'Discovery',
      buttonHref: '/',
      buttonVariant: 'primary'
    };
    case 'paragraph': return { children: '', as: 'p', size: 'md', weight: 'normal', variant: 'default', align: 'left', scrollReveal: false, colorClassName: 'text-custom-blue/100 dark:text-custom-celadon/100', fontFamily: 'standard' };
    case 'quote': return { children: '', author: '', authorDates: '', authorInfo: '', colorClassName: 'text-custom-blue/100 dark:text-custom-celadon/100', bgColorClassName: 'bg-custom-coconut/20 dark:bg-custom-blue/20', fontFamily: 'standard' };
    case 'paragraphWithImage': return { children: '', as: 'p', size: 'md', weight: 'normal', variant: 'default', align: 'left', imageSrc: '', imageAlt: '', imagePosition: 'left', imageAspectRatio: 'video', parallax: true, parallaxSpeed: 0.3, overlayOpacity: 0.4, colorClassName: 'text-custom-blue/100 dark:text-custom-celadon/100', fontFamily: 'standard' };
    case 'horizontalSlider': return { title: '', subtitle: '', scrollDistance: 'auto', items: [] };
    case 'actioncta': return { title: '', paragraph: '', imageSrc: '', imageAlt: '', imagePosition: 'right', buttonOneLabel: 'Learn More', buttonOneLink: '/', buttonOneVariant: 'outline', buttonTwoLabel: '', buttonTwoLink: '', buttonTwoVariant: 'secondary', fontFamily: 'standard', titleColorClassName: 'text-custom-rosewood/100 dark:text-custom-celadon/100', paragraphColorClassName: 'text-custom-blue/100 dark:text-custom-celadon/100' };
    case 'spacer': return { height: 'md', type: 'spacer', lineColor: 'transparent', lineWidth: '100%', opacity: 0.2, lineHeight: '1' };
    default: return {};
  }
}

function getModuleIcon(type: ModuleType) {
  switch (type) {
    case 'simpleHero': return <ImageIcon className="h-5 w-5" />;
    case 'paragraph': return <Type className="h-5 w-5" />;
    case 'quote': return <QuoteIcon className="h-5 w-5" />;
    case 'paragraphWithImage': return <Columns className="h-5 w-5" />;
    case 'gridHero': return <Layout className="h-5 w-5" />;
    case 'horizontalSlider': return <MoveRight className="h-5 w-5" />;
    case 'actioncta': return <ExternalLink className="h-5 w-5" />;
    case 'spacer': return <Minus className="h-5 w-5" />;
    default: return <Layout className="h-5 w-5" />;
  }
}

const moduleOptions = [
  { type: 'simpleHero', label: 'Simple Hero', icon: <ImageIcon className="h-6 w-6" /> },
  { type: 'gridHero', label: 'Grid Hero', icon: <Layout className="h-6 w-6" /> },
  { type: 'paragraph', label: 'Paragraph', icon: <Type className="h-6 w-6" /> },
  { type: 'paragraphWithImage', label: 'Text + Image', icon: <Columns className="h-6 w-6" /> },
  { type: 'quote', label: 'Quote', icon: <QuoteIcon className="h-6 w-6" /> },
  { type: 'horizontalSlider', label: 'Slider', icon: <MoveRight className="h-6 w-6" /> },
  { type: 'actioncta', label: 'Action CTA', icon: <ExternalLink className="h-6 w-6" /> },
  { type: 'spacer', label: 'Spacer / Line', icon: <Minus className="h-6 w-6" /> },
] as const;
