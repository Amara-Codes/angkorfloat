"use client";

import { useState } from "react";
import { FileText, Globe, Lock, Edit, ChevronLeft, ChevronRight, Clock, CheckCircle2, Circle, AlertTriangle, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import DeletePostButton from "./DeletePostButton";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Select, SelectOption } from "@/components/common/Select";
import { bulkDeleteBlogPosts, bulkUnpublishBlogPosts, bulkPublishBlogPosts } from "@/lib/actions/blog";
import BaseModal from "@/components/common/BaseModal";
import { Button } from "@/components/common/Button";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  thumbnailUrl?: string | null;
  thumbnailImage?: string | null;
  createdAt: Date | string;
  author: {
    name: string | null;
  };
}

interface BlogPostsTableProps {
  posts: BlogPost[];
  canDelete: boolean;
  canUpdate: boolean;
  canPublish: boolean;
  page: number;
  perPage: number;
  totalCount: number;
  sort: 'asc' | 'desc';
}

export default function BlogPostsTable({ posts, canDelete, canUpdate, canPublish, page, perPage, totalCount, sort }: BlogPostsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Mass Actions State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [massActionType, setMassActionType] = useState<'publish' | 'unpublish' | 'delete' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPages = Math.ceil(totalCount / perPage);

  const handlePageChange = (newPage: number) => {
    router.push(`${pathname}?page=${newPage}&perPage=${perPage}&sort=${sort}`);
  };

  const handlePerPageChange = (newPerPage: string) => {
    router.push(`${pathname}?page=1&perPage=${newPerPage}&sort=${sort}`);
  };

  const handleSortChange = (newSort: string) => {
    router.push(`${pathname}?page=1&perPage=${perPage}&sort=${newSort}`);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds([]);
  };

  const toggleSelectPost = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const openMassActionModal = (type: 'publish' | 'unpublish' | 'delete') => {
    if (selectedIds.length === 0) return;
    setMassActionType(type);
    setIsModalOpen(true);
  };

  const executeMassAction = async () => {
    if (!massActionType || selectedIds.length === 0) return;
    setIsProcessing(true);
    try {
      if (massActionType === 'delete') {
        await bulkDeleteBlogPosts(selectedIds);
      } else if (massActionType === 'unpublish') {
        await bulkUnpublishBlogPosts(selectedIds);
      } else if (massActionType === 'publish') {
        await bulkPublishBlogPosts(selectedIds);
      }
      setIsSelectionMode(false);
      setSelectedIds([]);
      setIsModalOpen(false);
      router.refresh();
    } catch (e) {
      alert("Mass action failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-custom-coconut/60 dark:bg-custom-blue border border-custom-blue/5 dark:border-custom-coconut/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Table Header Controls */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-custom-blue/10 dark:border-custom-coconut/10 bg-custom-blue/5 dark:bg-custom-coconut/5 gap-4 h-[100px]">
        
        {/* Left Side: Select Button or Selection Count */}
        <div className="flex items-center gap-3">
          {(canDelete || canPublish) && (
            !isSelectionMode ? (
              <Button
                onClick={toggleSelectionMode}
                variant="theme-responsive"
                size="sm"
                roundness="xl"
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Select Posts
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-custom-blue dark:text-custom-celadon bg-custom-blue/5 dark:bg-white/5 px-4 py-2 rounded-xl text-sm font-bold">
                  {selectedIds.length} Selected
                </span>
                <Button
                  onClick={toggleSelectionMode}
                  variant="outline-light"
                  size="sm"
                  roundness="xl"
                >
                  Cancel
                </Button>
              </div>
            )
          )}
        </div>

        {/* Right Side: Filters or Mass Actions */}
        <div className="flex items-center gap-3">
          {isSelectionMode ? (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
              {canPublish && (
                <>
                  <Button
                    onClick={() => openMassActionModal('publish')}
                    disabled={selectedIds.length === 0}
                    variant="secondary"
                    size="sm"
                    roundness="xl"
                  >
                    Publish
                  </Button>
                  <Button
                    onClick={() => openMassActionModal('unpublish')}
                    disabled={selectedIds.length === 0}
                    variant="theme-responsive"
                    size="sm"
                    roundness="xl"
                  >
                    Unpublish
                  </Button>
                </>
              )}
              {canDelete && (
                <Button
                  onClick={() => openMassActionModal('delete')}
                  disabled={selectedIds.length === 0}
                  variant="rosewood"
                  size="sm"
                  roundness="xl"
                >
                  Delete
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Sort Controls */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-custom-blue/60 dark:text-custom-celadon/50 hidden sm:block">Sort by</span>
                <Select 
                  value={sort} 
                  onChange={handleSortChange} 
                  size="sm"
                  fullWidth={false}
                >
                  <SelectOption value="desc" icon={<Clock className="w-4 h-4" />}>Most Recent</SelectOption>
                  <SelectOption value="asc" icon={<Clock className="w-4 h-4" />}>Less Recent</SelectOption>
                </Select>
              </div>

              {/* Per Page Controls */}
              <div className="flex items-center gap-3 border-l border-custom-blue/10 dark:border-white/10 pl-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-custom-blue/60 dark:text-custom-celadon/50 hidden sm:block">Show</span>
                <Select 
                  value={perPage.toString()} 
                  onChange={handlePerPageChange} 
                  size="sm"
                  fullWidth={false}
                >
                  <SelectOption value="10">10</SelectOption>
                  <SelectOption value="20">20</SelectOption>
                  <SelectOption value="50">50</SelectOption>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table Header Columns */}
      <div className="flex items-center px-8 py-4 border-b border-custom-blue/5 dark:border-custom-coconut/5 bg-custom-blue/2 dark:bg-custom-coconut/2">
        <div className="flex-3 text-[10px] font-bold uppercase tracking-widest text-custom-blue/60 dark:text-custom-celadon/50">Article</div>
        <div className="flex-1 text-[10px] font-bold uppercase tracking-widest text-custom-blue/60 dark:text-custom-celadon/50 hidden sm:block">Status</div>
        <div className="flex-1 text-[10px] font-bold uppercase tracking-widest text-custom-blue/60 dark:text-custom-celadon/50 hidden md:block">Author</div>
        <div className="flex-1 text-[10px] font-bold uppercase tracking-widest text-custom-blue/60 dark:text-custom-celadon/50 hidden lg:block">Date</div>
        <div className="flex-1 text-[10px] font-bold uppercase tracking-widest text-custom-blue/60 dark:text-custom-celadon/50 text-right">Actions</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-custom-blue/5 dark:divide-custom-coconut/5">
        {posts.map((post) => (
          <div 
            key={post.id} 
            onClick={() => isSelectionMode && toggleSelectPost(post.id)}
            className={`flex items-center px-8 py-6 transition-all duration-300 group ${isSelectionMode ? 'cursor-pointer hover:bg-custom-blue/5 dark:hover:bg-white/5' : 'hover:bg-custom-coconut/50 dark:hover:bg-custom-coconut/5'} ${selectedIds.includes(post.id) ? 'bg-custom-blue/5 dark:bg-custom-celadon/10' : ''}`}
          >
            {/* Selection Checkbox */}
            {isSelectionMode && (
              <div className="mr-6 shrink-0 text-custom-blue/40 dark:text-custom-celadon/40">
                {selectedIds.includes(post.id) ? (
                  <CheckCircle2 className="w-6 h-6 text-custom-blue dark:text-custom-celadon fill-custom-blue/10 dark:fill-custom-celadon/20 animate-in zoom-in duration-200" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </div>
            )}

            {/* Article Info */}
            <div className="flex-3 flex items-center gap-4 min-w-0">
              <div className="h-16 w-16 rounded-xl bg-custom-blue/5 dark:bg-custom-coconut/5 flex items-center justify-center text-custom-blue/30 dark:text-custom-celadon/30 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500 overflow-hidden relative">
                {(post.thumbnailUrl || post.thumbnailImage) ? (
                  <img 
                    src={post.thumbnailUrl || post.thumbnailImage || ""} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-custom-celadon/20 via-custom-blue/5 to-custom-rosewood/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 opacity-30" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-kugile text-2xl text-custom-blue dark:text-custom-celadon line-clamp-1 leading-tight">{post.title}</p>
                <p className="text-xs text-custom-blue/60 dark:text-custom-celadon/60 font-mono font-bold tracking-tighter mt-1 truncate italic">/{post.slug}</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex-1 hidden sm:block">
              {post.published ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-600">
                  <Globe className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Published</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-custom-rosewood/10 text-custom-rosewood">
                  <Lock className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Draft</span>
                </div>
              )}
            </div>

            {/* Author */}
            <div className="flex-1 hidden md:block">
              <p className="text-sm font-bold text-custom-blue/80 dark:text-custom-celadon/80 capitalize">{post.author?.name || "Anonymous"}</p>
            </div>

            {/* Date */}
            <div className="flex-1 hidden lg:block">
              <p className="text-sm font-medium text-custom-blue/50 dark:text-custom-celadon/60">
                {new Date(post.createdAt).toLocaleDateString(undefined, { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            {/* Actions */}
            <div className="flex-1 flex items-center justify-end gap-3">
              <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 transform lg:translate-x-4 lg:group-hover:translate-x-0">
                {canPublish && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIds([post.id]);
                      setMassActionType(post.published ? 'unpublish' : 'publish');
                      setIsModalOpen(true);
                    }}
                    className="p-2.5 text-custom-blue/60 dark:text-custom-celadon/50 hover:text-custom-blue dark:hover:text-custom-almond hover:bg-custom-coconut dark:hover:bg-custom-coconut/10 rounded-xl transition-all shadow-sm"
                  >
                    {post.published ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4 text-emerald-500" />}
                  </button>
                )}
                {canUpdate && (
                  <Link 
                    href={`/admin/blog/${post.id}/edit` as any}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2.5 text-custom-blue/60 dark:text-custom-celadon/50 hover:text-custom-blue dark:hover:text-custom-almond hover:bg-custom-coconut dark:hover:bg-custom-coconut/10 rounded-xl transition-all shadow-sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                )}
                {canDelete && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <DeletePostButton id={post.id} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="py-32 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-custom-coconut/50 dark:bg-custom-coconut/5 flex items-center justify-center shadow-inner">
                <FileText className="h-10 w-10 text-custom-blue/20 dark:text-custom-celadon/20" />
              </div>
              <div className="space-y-2">
                <p className="text-custom-blue/60 dark:text-custom-celadon/50 text-xs font-bold uppercase tracking-[0.2em]">No blog posts found.</p>
                <p className="text-custom-blue/30 dark:text-custom-celadon/30 text-[10px] uppercase font-bold tracking-widest">Start by creating your first article</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalCount > 0 && !isSelectionMode && (
        <div className="flex items-center justify-between px-8 py-5 border-t border-custom-blue/10 dark:border-custom-coconut/10 bg-custom-blue/5 dark:bg-custom-coconut/5">
          <div className="text-xs text-custom-blue/60 dark:text-custom-celadon/60">
            Showing <span className="font-bold text-custom-blue dark:text-custom-celadon">{(page - 1) * perPage + 1}</span> to <span className="font-bold text-custom-blue dark:text-custom-celadon">{Math.min(page * perPage, totalCount)}</span> of <span className="font-bold text-custom-blue dark:text-custom-celadon">{totalCount}</span> Blog Posts
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="p-2 rounded-lg bg-white/50 dark:bg-custom-blue/50 border border-custom-blue/10 dark:border-white/10 text-custom-blue dark:text-custom-celadon disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-custom-blue transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-bold text-custom-blue dark:text-custom-celadon px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-2 rounded-lg bg-white/50 dark:bg-custom-blue/50 border border-custom-blue/10 dark:border-white/10 text-custom-blue dark:text-custom-celadon disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-custom-blue transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mass Action Confirmation Modal */}
      <BaseModal
        isOpen={isModalOpen}
        onClose={() => !isProcessing && setIsModalOpen(false)}
      >
        <BaseModal.Header onClose={() => !isProcessing && setIsModalOpen(false)}>
          <div className="flex items-end gap-4">
            <div className={`p-2 rounded-xl ${massActionType === 'delete' ? 'bg-custom-rosewood/10' : massActionType === 'publish' ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
              {massActionType === 'publish' ? (
                <Globe className="w-6 h-6 text-emerald-500" />
              ) : (
                <AlertTriangle className={`w-6 h-6 ${massActionType === 'delete' ? 'text-custom-rosewood' : 'text-amber-500'}`} />
              )}
            </div>
            <h2 className="text-2xl font-kugile text-custom-blue dark:text-custom-almond capitalize">
              Confirm {massActionType}
            </h2>
          </div>
        </BaseModal.Header>
        <BaseModal.Body>
          <div className="space-y-4">
            <p className="text-lg font-bold text-custom-blue dark:text-custom-celadon leading-tight">
              Are you sure you want to {massActionType} {selectedIds.length === 1 ? 'this' : `these ${selectedIds.length}`} blog post{selectedIds.length !== 1 && 's'}?
            </p>
            <p className="text-sm text-custom-blue/60 dark:text-custom-celadon/60 leading-relaxed">
              {massActionType === 'delete' 
                ? 'These articles will be permanently removed along with their images. This action cannot be undone.'
                : massActionType === 'publish' 
                  ? 'These articles will become visible to everyone on the public site.'
                  : 'These articles will be moved to draft mode and hidden from the public site.'}
            </p>
          </div>
        </BaseModal.Body>
        <BaseModal.Footer>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-end">
            <Button
              onClick={() => setIsModalOpen(false)}
              variant="outline"
              size="md"
              roundness="xl"
              fullWidth
              className="sm:w-auto"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={executeMassAction}
              variant={massActionType === 'delete' ? 'rosewood' : massActionType === 'publish' ? 'primary' : 'secondary'}
              size="md"
              roundness="xl"
              fullWidth
              className="sm:w-auto"
              disabled={isProcessing}
              icon={isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : massActionType === 'publish' ? <Globe className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            >
              {isProcessing ? "Processing..." : `Confirm ${massActionType}`}
            </Button>
          </div>
        </BaseModal.Footer>
      </BaseModal>
    </div>
  );
}
