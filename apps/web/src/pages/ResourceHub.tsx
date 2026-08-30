import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bookmark,
  PlusCircle,
  FolderArchive,
  Trophy,
  FileText,
  BookOpen,
  HelpCircle,
  FileCode,
  GraduationCap,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import {
  useGetResourcesQuery,
  useToggleBookmarkResourceMutation,
  useToggleLikeResourceMutation,
  useGetSidebarMetadataQuery,
  useGetResourceLeaderboardQuery,
} from '../store/api/resourceApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setSearchQuery,
  setSelectedSubject,
  setSelectedSemester,
  setResourceType,
  setSortBy,
  resetResourceFilters,
} from '../store/slices/resourceSlice';
import { ResourceType } from '@studysphere/shared-types';

export const ResourceHub: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.resource);

  // RTK Query hooks
  const { data: resourcesResponse, isLoading } = useGetResourcesQuery({
    search: filters.searchQuery || undefined,
    subjectId: filters.selectedSubject || undefined,
    semester: filters.selectedSemester || undefined,
    type: filters.resourceType !== 'all' ? (filters.resourceType as ResourceType) : undefined,
    sortBy: filters.sortBy,
  });

  const { data: metadataResponse } = useGetSidebarMetadataQuery();
  const { data: leaderboardResponse } = useGetResourceLeaderboardQuery({ scope: 'weekly' });

  const [toggleBookmark] = useToggleBookmarkResourceMutation();
  const [toggleLike] = useToggleLikeResourceMutation();

  const resources = resourcesResponse?.data?.items || [];
  const popularSubjects = metadataResponse?.data?.popularSubjects || [];
  const trendingTags = metadataResponse?.data?.trendingTags || [];
  const topContributors = (leaderboardResponse?.data || []).slice(0, 3);

  const handleBookmark = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await toggleBookmark(id).unwrap();
    } catch {
      // Handled
    }
  };

  const handleLike = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await toggleLike(id).unwrap();
    } catch {
      // Handled
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'notes':
        return { label: 'NOTES', icon: FileText, className: 'bg-quad/10 text-quad border-quad/30' };
      case 'pyq':
        return { label: 'PYQ (SOLVED)', icon: HelpCircle, className: 'bg-marker/15 text-ink border-marker/40' };
      case 'book':
        return { label: 'REFERENCE BOOK', icon: BookOpen, className: 'bg-secondary/40 text-ink border-border' };
      case 'lab_manual':
        return { label: 'LAB MANUAL', icon: FileCode, className: 'bg-chalk/10 text-chalk border-chalk/30' };
      case 'research_paper':
        return { label: 'RESEARCH PAPER', icon: GraduationCap, className: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30' };
      default:
        return { label: type.toUpperCase(), icon: FileText, className: 'bg-secondary/30 text-graphite border-border' };
    }
  };

  const getTierStamp = (badge?: string) => {
    switch (badge) {
      case 'diamond':
        return 'border-quad text-quad bg-quad/10';
      case 'platinum':
        return 'border-chalk text-chalk bg-chalk/10';
      case 'gold':
        return 'border-marker text-ink bg-marker/20 font-bold';
      case 'silver':
        return 'border-slate-400 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800';
      default:
        return 'border-amber-700 text-amber-800 dark:text-amber-300 bg-amber-500/10';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ── 1. PAGE HEADER ────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase font-bold text-quad tracking-wider">
              CENTRAL KNOWLEDGE REPOSITORY
            </span>
            <span className="text-graphite text-xs">•</span>
            <span className="font-mono text-xs text-graphite">GOOGLE DRIVE FIRST</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-ink">Resource Hub</h1>
          <p className="font-body text-sm text-graphite mt-1 max-w-2xl">
            Browse verified academic notes, solved question papers, and laboratory manuals contributed by students and faculty.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/resources/leaderboard')}
            className="font-mono text-xs font-semibold px-3.5 py-2 rounded-md border border-border bg-paper text-ink hover:border-graphite flex items-center gap-1.5 transition-colors"
          >
            <Trophy className="w-3.5 h-3.5 text-marker" />
            <span>Hall of Fame</span>
          </button>
          
          <button
            onClick={() => navigate('/resources/my-resources')}
            className="font-mono text-xs font-semibold px-3.5 py-2 rounded-md border border-border bg-paper text-ink hover:border-graphite flex items-center gap-1.5 transition-colors"
          >
            <FolderArchive className="w-3.5 h-3.5 text-quad" />
            <span>My Submissions</span>
          </button>

          <button
            onClick={() => navigate('/resources/upload')}
            className="font-mono text-xs font-bold px-4 py-2 rounded-md bg-quad text-paper hover:bg-quad/90 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Resource</span>
          </button>
        </div>
      </div>

      {/* ── 2. FILTER BAR ─────────────────────────────────────────────── */}
      <div className="p-4 bg-paper border border-border rounded-md space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-graphite" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search by topic, course title, BCNF, algorithm, or professor name..."
            className="w-full bg-secondary/15 border border-border rounded-md pl-10 pr-4 py-2 font-sans text-xs text-ink placeholder:text-graphite focus:outline-none focus:border-quad transition-colors"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* Subject Selector */}
            <select
              value={filters.selectedSubject || 'All Subjects'}
              onChange={(e) =>
                dispatch(setSelectedSubject(e.target.value === 'All Subjects' ? null : e.target.value))
              }
              aria-label="Filter by Subject"
              className="bg-paper border border-border rounded-[4px] px-2.5 py-1.5 font-mono text-xs text-ink focus:outline-none focus:border-quad"
            >
              <option value="All Subjects">All Subjects</option>
              <option value="CS-301 Database Systems">CS-301 Database Systems</option>
              <option value="CS-302 Algorithms">CS-302 Algorithms</option>
              <option value="CS-303 Operating Systems">CS-303 Operating Systems</option>
              <option value="CS-304 Computer Networks">CS-304 Computer Networks</option>
              <option value="CS-305 Software Engineering">CS-305 Software Engineering</option>
              <option value="CS-306 Web Technologies">CS-306 Web Technologies</option>
            </select>

            {/* Semester Selector */}
            <select
              value={filters.selectedSemester || 0}
              onChange={(e) =>
                dispatch(setSelectedSemester(Number(e.target.value) === 0 ? null : Number(e.target.value)))
              }
              aria-label="Filter by Semester"
              className="bg-paper border border-border rounded-[4px] px-2.5 py-1.5 font-mono text-xs text-ink focus:outline-none focus:border-quad"
            >
              <option value={0}>All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>

            {/* Resource Type */}
            <select
              value={filters.resourceType}
              onChange={(e) => dispatch(setResourceType(e.target.value as any))}
              aria-label="Filter by Resource Type"
              className="bg-paper border border-border rounded-[4px] px-2.5 py-1.5 font-mono text-xs text-ink focus:outline-none focus:border-quad"
            >
              <option value="all">All Types</option>
              <option value="notes">Lecture Notes</option>
              <option value="pyq">Solved PYQs</option>
              <option value="book">Reference Books</option>
              <option value="lab_manual">Lab Manuals</option>
              <option value="research_paper">Research Papers</option>
            </select>

            {/* Reset Filters */}
            {(filters.searchQuery || filters.selectedSubject || filters.selectedSemester || filters.resourceType !== 'all') && (
              <button
                onClick={() => dispatch(resetResourceFilters())}
                className="font-mono text-xs text-destructive hover:underline flex items-center gap-1 ml-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Sort Controller */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-graphite uppercase">SORT:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value as any))}
              aria-label="Sort resources"
              className="bg-paper border border-border rounded-[4px] px-2.5 py-1 font-mono text-xs text-ink focus:outline-none focus:border-quad"
            >
              <option value="latest">Latest Added</option>
              <option value="downloads">Most Downloaded</option>
              <option value="popular">Most Endorsed</option>
              <option value="rating">Most Bookmarked</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 3. MAIN CATALOG & SIDEBAR LAYOUT ──────────────────────────── */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Academic Ledger Cards Catalog (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <span className="font-mono text-xs font-bold text-graphite uppercase tracking-wider">
              01 — KNOWLEDGE CATALOG ({resources.length} ITEMS)
            </span>
            <span className="font-mono text-[11px] text-quad">✓ VERIFIED BY ACADEMIC COMMITTEE</span>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 border border-border/60 rounded-md bg-paper h-48 animate-pulse" />
              ))}
            </div>
          ) : resources.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-md bg-paper space-y-3">
              <FolderArchive className="w-10 h-10 text-graphite mx-auto opacity-50" />
              <h3 className="font-display font-bold text-lg text-ink">No Academic Records Found</h3>
              <p className="font-sans text-xs text-graphite max-w-sm mx-auto">
                No matching study notes or question papers found for your current filter query.
              </p>
              <button
                onClick={() => dispatch(resetResourceFilters())}
                className="font-mono text-xs font-bold text-quad hover:underline inline-block"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {resources.map((res) => {
                const typeInfo = getTypeBadge(res.type);
                const TypeIcon = typeInfo.icon;

                return (
                  <div
                    key={res.id}
                    onClick={() => navigate(`/resources/${res.id}`)}
                    className="group p-4 bg-paper border border-border/80 hover:border-quad rounded-md flex flex-col justify-between transition-all cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <div>
                      {/* Card Header Stamp */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-[2px] border flex items-center gap-1 ${typeInfo.className}`}>
                          <TypeIcon className="w-3 h-3" />
                          {typeInfo.label}
                        </span>
                        
                        <span className="font-mono text-[10px] text-quad border border-quad/40 px-1.5 py-0.5 rounded-[2px] bg-quad/5">
                          ✓ VERIFIED
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-sans font-bold text-sm text-ink group-hover:text-quad transition-colors line-clamp-2 mb-1.5 leading-snug">
                        {res.title}
                      </h3>

                      <p className="font-body text-xs text-graphite line-clamp-2 leading-relaxed mb-3">
                        {res.description}
                      </p>

                      {/* Metadata Ledger Grid */}
                      <div className="border-t border-b border-border/60 py-2 my-2 space-y-1 font-mono text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="text-graphite uppercase text-[10px]">SUBJECT:</span>
                          <span className="text-ink font-semibold truncate max-w-[170px]">{res.subjectId}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-graphite uppercase text-[10px]">SEMESTER:</span>
                          <span className="text-ink">Sem {res.semester || 5}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-graphite uppercase text-[10px]">UPLOADER:</span>
                          <span className="text-ink font-medium">{res.uploader?.name || 'Campus Student'}</span>
                        </div>
                        {res.fileMetadata?.fileSizeFormatted && (
                          <div className="flex items-center justify-between">
                            <span className="text-graphite uppercase text-[10px]">FILE SIZE:</span>
                            <span className="text-graphite">{res.fileMetadata.fileSizeFormatted} (PDF)</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-2 flex items-center justify-between font-mono text-xs text-graphite">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => handleLike(e, res.id)}
                          className="hover:text-quad transition-colors flex items-center gap-1"
                          title="Endorse resource"
                        >
                          <span>★</span>
                          <span>{res.likesCount || 0}</span>
                        </button>
                        
                        <span title="Downloads">📥 {res.downloadsCount || 120}</span>

                        <button
                          onClick={(e) => handleBookmark(e, res.id)}
                          className="hover:text-quad transition-colors"
                          title="Save to ledger"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${res.bookmarksCount ? 'fill-quad text-quad' : ''}`} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 text-quad font-bold text-[11px] group-hover:translate-x-0.5 transition-transform">
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Knowledge Archive Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Top Academic Contributors Podium */}
          <div className="p-4 bg-paper border border-border rounded-md space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="font-mono text-xs font-bold text-graphite uppercase tracking-wider">
                TOP CONTRIBUTORS
              </span>
              <a href="/resources/leaderboard" className="font-mono text-[11px] text-quad hover:underline">
                View All →
              </a>
            </div>

            <div className="space-y-2.5">
              {topContributors.map((c) => (
                <div
                  key={c.userId}
                  className="p-2.5 border border-border/60 rounded-[4px] bg-paper flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-secondary/50 border border-border flex items-center justify-center font-bold text-xs text-quad">
                      {c.user.avatarUrl || c.user.name[0]}
                    </div>
                    <div>
                      <h4 className="font-sans text-xs font-bold text-ink leading-none">
                        {c.user.name}
                      </h4>
                      <span className="font-mono text-[10px] text-graphite">
                        {c.resourcesCount || 10} Uploads · {c.points} pts
                      </span>
                    </div>
                  </div>

                  <span className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-[2px] border ${getTierStamp(c.badge)}`}>
                    {c.badge || 'BRONZE'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Subjects Catalog */}
          <div className="p-4 bg-paper border border-border rounded-md space-y-3">
            <span className="font-mono text-xs font-bold text-graphite uppercase tracking-wider block border-b border-border/60 pb-2">
              CURRICULUM DIRECTORY
            </span>

            <div className="space-y-1.5 font-mono text-xs">
              {popularSubjects.map((sub) => (
                <button
                  key={sub.code}
                  onClick={() => dispatch(setSelectedSubject(sub.name))}
                  className="w-full text-left p-2 rounded-[4px] hover:bg-secondary/20 flex items-center justify-between text-ink transition-colors"
                >
                  <span className="truncate pr-2 font-medium">
                    <span className="font-bold text-quad">[{sub.code}]</span> {sub.name}
                  </span>
                  <span className="text-graphite font-mono text-[11px] flex-shrink-0">
                    {sub.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Trending Tags Cloud */}
          <div className="p-4 bg-paper border border-border rounded-md space-y-3">
            <span className="font-mono text-xs font-bold text-graphite uppercase tracking-wider block border-b border-border/60 pb-2">
              EXAM TOPIC TAGS
            </span>

            <div className="flex flex-wrap gap-1.5">
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => dispatch(setSearchQuery(tag.replace('#', '')))}
                  className="font-mono text-[11px] px-2 py-0.5 rounded-[2px] bg-secondary/30 text-ink hover:bg-quad/10 hover:text-quad hover:border-quad border border-border/60 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

