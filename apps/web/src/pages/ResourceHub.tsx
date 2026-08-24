import React, { useState } from 'react';
import { Search, Heart, Bookmark, Eye, UploadCloud } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  subject: string;
  type: string;
  author: string;
  authorBadge: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  views: number;
  likes: number;
  bookmarked: boolean;
}

const initialResources: Resource[] = [
  {
    id: 'res-1',
    title: 'Database Management Systems - Normalized Forms PYQ Notes',
    subject: 'DBMS',
    type: 'Notes',
    author: 'Amit Sharma',
    authorBadge: 'Gold',
    views: 142,
    likes: 38,
    bookmarked: true,
  },
  {
    id: 'res-2',
    title: 'Computer Networks - TCP/IP Protocol Layering Slides',
    subject: 'Computer Networks',
    type: 'Slides',
    author: 'Prof. Rajesh Verma',
    authorBadge: 'Diamond',
    views: 405,
    likes: 120,
    bookmarked: false,
  },
  {
    id: 'res-3',
    title: 'Operating Systems - Process Scheduling Cheat Sheet',
    subject: 'Operating Systems',
    type: 'Cheat Sheet',
    author: 'Neha Patil',
    authorBadge: 'Silver',
    views: 93,
    likes: 15,
    bookmarked: false,
  },
];

export const ResourceHub: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [search, setSearch] = useState('');

  const toggleLike = (id: string) => {
    setResources(
      resources.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
    );
  };

  const toggleBookmark = (id: string) => {
    setResources(
      resources.map((r) => (r.id === id ? { ...r, bookmarked: !r.bookmarked } : r))
    );
  };

  const badgeColors = {
    Bronze: 'bg-amber-700/10 text-amber-700 border-amber-700/20',
    Silver: 'bg-slate-400/10 text-slate-500 border-slate-400/20',
    Gold: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    Platinum: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    Diamond: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Resource Hub</h1>
          <p className="text-sm text-muted-foreground">Browse academic files uploaded by students and faculty, moderated for quality.</p>
        </div>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-4 py-2 rounded-button flex items-center gap-2 transition-colors w-fit">
          <UploadCloud className="w-4 h-4" /> Upload Resource
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, subject, or author..."
            className="w-full border border-border bg-muted/10 rounded-input pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources
          .filter((r) =>
            r.title.toLowerCase().includes(search.toLowerCase()) ||
            r.subject.toLowerCase().includes(search.toLowerCase()) ||
            r.author.toLowerCase().includes(search.toLowerCase())
          )
          .map((res) => (
            <div key={res.id} className="border border-border rounded-card bg-muted/5 p-5 flex flex-col justify-between hover:border-primary/30 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-primary/10 text-primary font-bold text-xs px-2.5 py-0.5 rounded-full uppercase">
                    {res.type}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">{res.subject}</span>
                </div>

                <h3 className="font-bold text-base line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                  {res.title}
                </h3>

                <div className="flex items-center gap-1.5 pt-1">
                  <div className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center">
                    {res.author[0]}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{res.author}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${badgeColors[res.authorBadge]}`}>
                    {res.authorBadge}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4 mt-4 text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs">
                    <Eye className="w-4 h-4" /> {res.views}
                  </span>
                  <button onClick={() => toggleLike(res.id)} className="flex items-center gap-1 text-xs hover:text-destructive transition-colors">
                    <Heart className="w-4 h-4" /> {res.likes}
                  </button>
                </div>

                <button onClick={() => toggleBookmark(res.id)} className="hover:text-primary transition-colors">
                  <Bookmark className={`w-4 h-4 ${res.bookmarked ? 'fill-primary text-primary' : ''}`} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
