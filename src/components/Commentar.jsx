import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { MessageCircle, UserCircle2, Loader2, AlertCircle, Send, ImagePlus, X, Pin } from 'lucide-react';
import AOS from "aos";
import "aos/dist/aos.css";
import { supabase } from '../supabase';
import { getLocalComments, getLocalPinnedComment, saveLocalComments } from '../utils/dummyComments';

const Comment = memo(({ comment, formatDate, index, isPinned = false }) => (
    <div
        className={`px-4 pt-4 pb-3 rounded-2xl border transition-all group hover:shadow-lg hover:-translate-y-0.5 ${isPinned
                ? 'bg-white/[0.04] border-white/20 shadow-[0_4px_20px_rgba(255,255,255,0.05)]'
                : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/15'
            }`}
    >
        {isPinned && (
            <div className="flex items-center gap-1.5 mb-2.5 text-zinc-300">
                <Pin className="w-3.5 h-3.5" />
                <span className="text-[0.68rem] font-semibold uppercase tracking-wider">Pinned Comment</span>
            </div>
        )}
        <div className="flex items-start gap-3">
            <img
                src={comment.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user_name)}&background=27272a&color=ffffff&bold=true`}
                alt={`${comment.user_name}'s profile`}
                className={`w-9 h-9 rounded-full object-cover border flex-shrink-0 ${isPinned ? 'border-white/40' : 'border-white/15'}`}
                loading="lazy"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user_name)}&background=27272a&color=ffffff&bold=true`;
                }}
            />
            <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-4 mb-1">
                    <div className="flex items-center gap-2">
                        <h4 className={`font-medium text-sm truncate ${isPinned ? 'text-white font-semibold' : 'text-zinc-200'}`}>
                            {comment.user_name}
                        </h4>
                        {isPinned && (
                            <span className="px-2 py-0.5 text-[0.62rem] font-mono bg-white/10 text-white border border-white/15 rounded-full">
                                Admin
                            </span>
                        )}
                    </div>
                    <span className="text-[0.68rem] text-zinc-500 whitespace-nowrap font-mono">
                        {formatDate(comment.created_at)}
                    </span>
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm break-words leading-relaxed font-light">
                    {comment.content}
                </p>
            </div>
        </div>
    </div>
));

const CommentForm = memo(({ onSubmit, isSubmitting, error }) => {
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB. Please choose a smaller image.');
                if (e.target) e.target.value = '';
                return;
            }

            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file.');
                if (e.target) e.target.value = '';
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    }, []);

    const handleTextareaChange = useCallback((e) => {
        setNewComment(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!newComment.trim() || !userName.trim()) return;

        onSubmit({ newComment, userName, imageFile });
        setNewComment('');
        setUserName('');
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, [newComment, userName, imageFile, onSubmit]);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5" data-aos="fade-up" data-aos-duration="1000">
                <label className="block text-xs font-medium text-zinc-300">
                    Name <span className="text-white">*</span>
                </label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    maxLength={15}
                    placeholder="Enter your name"
                    className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                    required
                />
            </div>

            <div className="space-y-1.5" data-aos="fade-up" data-aos-duration="1200">
                <label className="block text-xs font-medium text-zinc-300">
                    Message <span className="text-white">*</span>
                </label>
                <textarea
                    ref={textareaRef}
                    value={newComment}
                    maxLength={200}
                    onChange={handleTextareaChange}
                    placeholder="Write your message here..."
                    className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all resize-none min-h-[100px]"
                    required
                />
            </div>

            <div className="space-y-1.5" data-aos="fade-up" data-aos-duration="1400">
                <label className="block text-xs font-medium text-zinc-300">
                    Profile Photo <span className="text-zinc-500">(optional)</span>
                </label>
                <div className="flex items-center gap-4 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                    {imagePreview ? (
                        <div className="flex items-center gap-4">
                            <img
                                src={imagePreview}
                                alt="Profile preview"
                                className="w-12 h-12 rounded-full object-cover border border-white/30"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview(null);
                                    setImageFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-zinc-300 hover:text-white hover:bg-white/20 text-xs transition-all"
                            >
                                <X className="w-3.5 h-3.5" />
                                <span>Remove Photo</span>
                            </button>
                        </div>
                    ) : (
                        <div className="w-full">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] text-zinc-300 hover:text-white hover:bg-white/[0.07] transition-all border border-dashed border-white/15 hover:border-white/30 text-xs group"
                            >
                                <ImagePlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>Choose Profile Photo</span>
                            </button>
                            <p className="text-center text-zinc-500 text-[0.68rem] mt-1.5">
                                Max file size: 5MB
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                data-aos="fade-up" data-aos-duration="1000"
                className="w-full bg-white text-black h-11 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 hover:bg-zinc-200 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Posting...</span>
                    </>
                ) : (
                    <>
                        <Send className="w-4 h-4 text-black" />
                        <span>Post Comment</span>
                    </>
                )}
            </button>
        </form>
    );
});

const Komentar = () => {
    const [comments, setComments] = useState([]);
    const [pinnedComment, setPinnedComment] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        AOS.init({
            once: false,
            duration: 1000,
        });
    }, []);

    const fileToBase64 = useCallback((file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }, []);

    const uploadImage = useCallback(async (file) => {
        if (!file) return null;

        if (supabase) {
            try {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `comment-images/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('portfolio_assets')
                    .upload(filePath, file);

                if (!uploadError) {
                    const { data: { publicUrl } } = supabase.storage
                        .from('portfolio_assets')
                        .getPublicUrl(filePath);
                    return publicUrl;
                }
            } catch (err) {
                console.warn('Supabase storage upload failed, falling back to Base64:', err);
            }
        }

        try {
            return await fileToBase64(file);
        } catch (err) {
            console.error('Error converting file to Base64:', err);
            return null;
        }
    }, [fileToBase64]);

    useEffect(() => {
        const fetchComments = async () => {
            if (supabase) {
                try {
                    const { data: pinnedData, error: pinnedError } = await supabase
                        .from('portfolio_comments')
                        .select('*')
                        .eq('is_pinned', true)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .maybeSingle();

                    if (!pinnedError && pinnedData) {
                        setPinnedComment(pinnedData);
                    } else {
                        setPinnedComment(getLocalPinnedComment());
                    }

                    const { data, error } = await supabase
                        .from('portfolio_comments')
                        .select('*')
                        .eq('is_pinned', false)
                        .order('created_at', { ascending: false });

                    if (!error && data && data.length > 0) {
                        setComments(data);
                        return;
                    }
                } catch (err) {
                    console.warn('Supabase fetch failed, using local comments:', err);
                }
            }

            setPinnedComment(getLocalPinnedComment());
            setComments(getLocalComments());
        };

        fetchComments();

        if (supabase) {
            const channel = supabase
                .channel('schema-db-changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'portfolio_comments'
                    },
                    () => {
                        fetchComments();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, []);

    const handleCommentSubmit = useCallback(async ({ newComment, userName, imageFile }) => {
        setError('');
        setIsSubmitting(true);

        try {
            const profileImageUrl = await uploadImage(imageFile);

            if (supabase) {
                const { error } = await supabase
                    .from('portfolio_comments')
                    .insert([
                        {
                            content: newComment,
                            user_name: userName,
                            profile_image: profileImageUrl,
                            is_pinned: false,
                            created_at: new Date().toISOString()
                        }
                    ]);

                if (!error) {
                    setIsSubmitting(false);
                    return;
                }
            }

            const newCommentObj = {
                id: `local-${Date.now()}`,
                user_name: userName,
                content: newComment,
                profile_image: profileImageUrl,
                is_pinned: false,
                created_at: new Date().toISOString()
            };

            await new Promise((resolve) => setTimeout(resolve, 400));

            setComments((prev) => {
                const updated = [newCommentObj, ...prev];
                saveLocalComments(updated);
                return updated;
            });
        } catch (error) {
            setError('Failed to post comment. Please try again.');
            console.error('Error adding comment: ', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [uploadImage]);

    const formatDate = useCallback((timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }, []);

    const totalComments = comments.length + (pinnedComment ? 1 : 0);

    return (
        <div className="w-full h-full flex flex-col" data-aos="fade-up" data-aos-duration="1000">
            <div className="pb-5 border-b border-white/10" data-aos="fade-down" data-aos-duration="800">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10">
                        <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', 'Poppins', sans-serif" }}>
                        Comments <span className="text-zinc-500 font-mono text-sm">({totalComments})</span>
                    </h3>
                </div>
            </div>
            <div className="py-5 space-y-5 flex-1 flex flex-col min-h-0">
                {error && (
                    <div className="flex items-center gap-2 p-3 text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl text-xs" data-aos="fade-in">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <div>
                    <CommentForm onSubmit={handleCommentSubmit} isSubmitting={isSubmitting} error={error} />
                </div>

                <div className="space-y-3 flex-1 min-h-[360px] lg:min-h-[420px] overflow-y-auto overflow-x-hidden custom-scrollbar pt-2 pr-1" data-aos="fade-up" data-aos-delay="200">
                    {pinnedComment && (
                        <div data-aos="fade-down" data-aos-duration="800">
                            <Comment
                                comment={pinnedComment}
                                formatDate={formatDate}
                                index={0}
                                isPinned={true}
                            />
                        </div>
                    )}

                    {comments.length === 0 && !pinnedComment ? (
                        <div className="text-center py-8" data-aos="fade-in">
                            <UserCircle2 className="w-10 h-10 text-zinc-600 mx-auto mb-2 opacity-50" />
                            <p className="text-zinc-500 text-xs">No comments yet. Start the conversation!</p>
                        </div>
                    ) : (
                        comments.map((comment, index) => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                formatDate={formatDate}
                                index={index + (pinnedComment ? 1 : 0)}
                                isPinned={false}
                            />
                        ))
                    )}
                </div>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
};

export default Komentar;
