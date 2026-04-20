import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, Share2, TrendingUp, Clock, User, Star, Plus, LayoutTemplate, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';

// Mock data for community setups
const MOCK_SETUPS = [
  {
    id: '1',
    author: 'Alex Chen',
    title: 'Minimalist Developer Setup',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1000',
    likes: 342,
    rating: 4.8,
    comments: 28,
    tags: ['Minimal', 'Developer', 'Mac'],
    timestamp: '2 hours ago',
    items: ['ErgoChair Pro', 'Standing Desk', 'UltraWide Monitor']
  },
  {
    id: '2',
    author: 'Sarah Jenkins',
    title: 'Cozy Gaming Corner',
    image: 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&q=80&w=1000',
    likes: 891,
    rating: 4.9,
    comments: 156,
    tags: ['Gaming', 'RGB', 'Cozy'],
    timestamp: '5 hours ago',
    items: ['Gaming Chair', 'RGB Keyboard', 'Dual Monitors']
  },
  {
    id: '3',
    author: 'David Kim',
    title: 'Productivity Powerhouse',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000',
    likes: 124,
    rating: 4.5,
    comments: 12,
    tags: ['Productivity', 'Clean', 'Windows'],
    timestamp: '1 day ago',
    items: ['Mechanical Keyboard', 'Vertical Mouse', '4K Monitor']
  },
  {
    id: '4',
    author: 'Elena Rostova',
    title: 'Creative Studio Oasis',
    image: 'https://images.unsplash.com/photo-1588661136976-5eeddb11c9db?auto=format&fit=crop&q=80&w=1000',
    likes: 543,
    rating: 5.0,
    comments: 45,
    tags: ['Creative', 'Mac', 'Audio'],
    timestamp: '2 days ago',
    items: ['Studio Monitors', 'Mac Studio', 'Drawing Tablet']
  },
  {
    id: '5',
    author: 'James Wilson',
    title: 'The Command Center',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=1000',
    likes: 215,
    rating: 4.2,
    comments: 8,
    tags: ['Multi-Monitor', 'Trading', 'Windows'],
    timestamp: '3 days ago',
    items: ['Quad Monitors', 'Ergo Chair', 'Stream Deck']
  }
];

export const CommunitySetups: React.FC = () => {
  const { t } = useSettings();
  const { showToast } = useToast();
  const [setups, setSetups] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('desksetup_community_setups');
      const parsedSaved = saved ? JSON.parse(saved) : [];
      // Deduplicate by ID
      const allSetups = [...parsedSaved, ...MOCK_SETUPS];
      const uniqueSetups = Array.from(new Map(allSetups.map(item => [item.id, item])).values());
      return uniqueSetups;
    } catch(e) {
      return MOCK_SETUPS;
    }
  });
  
  const [activeTab, setActiveTab] = useState<'trending' | 'recent' | 'following' | 'my_setups'>('trending');
  const [likedSetups, setLikedSetups] = useState<Set<string>>(new Set());
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [selectedSetup, setSelectedSetup] = useState<any | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const displayedSetups = React.useMemo(() => {
    let filtered = [...setups];
    
    if (selectedTag) {
      filtered = filtered.filter(s => s.tags.includes(selectedTag));
    }

    if (activeTab === 'following') {
      return filtered.filter(s => ['1', '4'].includes(s.id)); // Mock following
    }
    if (activeTab === 'my_setups') {
      return setups.filter(s => s.author === 'Current User' || s.isPersonal); // Mock personal
    }

    return activeTab === 'trending' 
      ? filtered.sort((a, b) => b.likes - a.likes)
      : filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
  }, [setups, activeTab, selectedTag]);

  const handleLike = (id: string) => {
    setLikedSetups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleShare = () => {
    showToast('Link copied to clipboard!', 'success');
  };

  const handlePostComment = (id: string) => {
    if (!commentText.trim()) return;
    showToast('Comment posted successfully!', 'success');
    setCommentText('');
    setActiveCommentId(null);
  };

  const handleRate = (id: string, rating: number) => {
    setUserRatings(prev => ({ ...prev, [id]: rating }));
    showToast(`You rated this setup ${rating} stars!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-heading font-bold text-white mb-4">Community Setups</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
          Get inspired by workspaces built by our community. Share your own setup and connect with others.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
          <button
            onClick={() => { setActiveTab('trending'); setSelectedTag(null); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === 'trending' && !selectedTag
                ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <TrendingUp size={18} /> {t('community.trending') || 'Trending'}
          </button>
          <button
            onClick={() => { setActiveTab('recent'); setSelectedTag(null); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === 'recent' && !selectedTag
                ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Clock size={18} /> {t('community.recent') || 'Recent'}
          </button>
          <button
            onClick={() => { setActiveTab('following'); setSelectedTag(null); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === 'following'
                ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <User size={18} /> {t('community.following') || 'Following'}
          </button>
          <div className="w-px h-8 bg-white/10 hidden sm:block mx-2"></div>
          <button
            onClick={() => { setActiveTab('my_setups'); setSelectedTag(null); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === 'my_setups'
                ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutTemplate size={18} /> {t('community.my_setups') || 'My Setups'}
          </button>
          <button
            onClick={() => showToast(t('community.wizard_soon') || 'Setup sharing wizard coming soon!', 'info')}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-neon-purple hover:bg-neon-purple/80 text-white transition-all shadow-[0_0_15px_rgba(157,78,221,0.3)] ml-auto"
          >
            <Plus size={18} /> {t('community.share') || 'Share Setup'}
          </button>
        </div>
        {selectedTag && (
          <div className="flex justify-center items-center gap-2 mb-8 animate-in fade-in slide-in-from-top-2">
            <span className="text-gray-400">{t('community.filter_by') || 'Filtering by tag:'}</span>
            <span className="bg-neon-blue/20 text-neon-blue px-3 py-1 rounded-full text-sm flex items-center gap-2">
              {selectedTag}
              <button onClick={() => setSelectedTag(null)} className="hover:text-white"><X size={14} /></button>
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedSetups.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 py-20 text-center glass-card rounded-3xl">
            <h3 className="text-2xl text-white font-medium mb-2">{t('community.no_setups') || 'No setups found'}</h3>
            <p className="text-gray-400">{t('community.be_first') || 'Be the first to share your workspace here!'}</p>
          </div>
        )}
        {displayedSetups.map((setup, index) => {
          const isLiked = likedSetups.has(setup.id);
          const likesCount = setup.likes + (isLiked ? 1 : 0);

          return (
            <motion.div
              key={setup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-3xl overflow-hidden flex flex-col"
            >
              <div 
                className="relative aspect-[4/3] overflow-hidden bg-[#11111a] cursor-pointer"
                onClick={() => setSelectedSetup(setup)}
              >
                <img
                  src={setup.image}
                  alt={setup.title}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {setup.tags.map(tag => (
                    <button
                      key={tag}
                      onClick={(e) => { e.stopPropagation(); setSelectedTag(tag); }}
                      className="px-2.5 py-1 text-xs font-medium bg-black/50 backdrop-blur-md rounded-full text-gray-300 border border-white/10 hover:border-neon-blue hover:text-neon-blue transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <User size={16} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{setup.author}</p>
                      <p className="text-xs text-gray-500">{setup.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                    <Star size={14} className="text-yellow-400" fill="currentColor" />
                    <span className="text-sm font-medium text-white">{setup.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-heading font-bold text-white mb-2">{setup.title}</h3>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-2">Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {setup.items.map(item => (
                      <span key={item} className="text-xs text-neon-blue bg-neon-blue/10 px-2 py-1 rounded-md">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/10 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleLike(setup.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          isLiked ? 'text-neon-purple' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                        <span className="text-sm font-medium">{likesCount}</span>
                      </button>
                      <button
                        onClick={() => setActiveCommentId(activeCommentId === setup.id ? null : setup.id)}
                        className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
                      >
                        <MessageCircle size={18} />
                        <span className="text-sm font-medium">{setup.comments}</span>
                      </button>
                    </div>
                    <button
                      onClick={handleShare}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Share2 size={18} />
                    </button>
                  </div>
                  
                  {/* Rating System */}
                  <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl">
                    <span className="text-xs text-gray-400">Rate this setup:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRate(setup.id, star)}
                          className="focus:outline-none"
                        >
                          <Star
                            size={16}
                            className={`transition-colors ${
                              (userRatings[setup.id] || 0) >= star
                                ? 'text-yellow-400'
                                : 'text-gray-600 hover:text-yellow-400/50'
                            }`}
                            fill={(userRatings[setup.id] || 0) >= star ? 'currentColor' : 'none'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                {activeCommentId === setup.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-white/5"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-purple/50"
                      />
                      <button
                        onClick={() => handlePostComment(setup.id)}
                        disabled={!commentText.trim()}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        Post
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Setup Details Modal */}
      {selectedSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#121216] border border-white/10 rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row"
          >
            <div className="md:w-1/2 bg-black relative">
              <img src={selectedSetup.image} alt={selectedSetup.title} className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedSetup.title}</h2>
                  <p className="text-gray-400 text-sm">by {selectedSetup.author}</p>
                </div>
                <button onClick={() => setSelectedSetup(null)} className="text-gray-400 hover:text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-white font-medium mb-2">Items in this setup:</h3>
                <ul className="space-y-2">
                  {selectedSetup.items.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300 bg-white/5 p-2 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-neon-blue"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-auto pt-6 flex gap-4">
                <button 
                  onClick={() => handleLike(selectedSetup.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  <Heart size={18} fill={likedSetups.has(selectedSetup.id) ? "currentColor" : "none"} className={likedSetups.has(selectedSetup.id) ? "text-neon-purple" : ""} />
                  {likedSetups.has(selectedSetup.id) ? 'Liked' : 'Like'}
                </button>
                <button 
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  <Share2 size={18} /> Share
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
