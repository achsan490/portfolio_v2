export const DEFAULT_PINNED_COMMENT = {
    id: 'pinned-1',
    user_name: 'Achsanul Khuluq',
    content: 'Selamat datang di portofolio saya! 👋 Silakan tinggalkan masukan, saran, atau sekadar menyapa di kolom komentar ini. Terima kasih sudah berkunjung! 🚀',
    profile_image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
    is_pinned: true,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
};

export const DEFAULT_COMMENTS = [
    {
        id: 'dummy-1',
        user_name: 'Rizky Pratama',
        content: 'Design portofolionya keren banget bro! Animasi dan paduan warnanya smooth banget di mata 🔥',
        profile_image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&q=80',
        is_pinned: false,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'dummy-2',
        user_name: 'Siti Nurhaliza',
        content: 'Suka banget sama layoutnya, sangat rapi dan responsive di mobile. Tampilannya kelihatan profesional bgt!',
        profile_image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
        is_pinned: false,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'dummy-3',
        user_name: 'Budi Santoso',
        content: 'Fullstack project-nya mantap, kodenya bersih dan fiturnya lengkap. Sukses terus buat karirnya mas! 👏',
        profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
        is_pinned: false,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'dummy-4',
        user_name: 'Amanda Putri',
        content: 'Inspiratif sekali portofolionya! Kombinasi warna biru & dark mode-nya dapet banget feel modern-nya ✨',
        profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        is_pinned: false,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'dummy-5',
        user_name: 'Dian Sastrowardoyo',
        content: 'Portofolio yang luar biasa! Desainnya sangat aesthetic dan fiturnya berjalan dengan baik. Good job! 👍',
        profile_image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
        is_pinned: false,
        created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'dummy-6',
        user_name: 'Fajar Nugraha',
        content: 'Fitur realtime dan UI-nya keren abis mas. Bikin betah ngelihatin showcase project-nya! 🚀',
        profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
        is_pinned: false,
        created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
    }
];

export const getLocalComments = () => {
    try {
        const saved = localStorage.getItem('portfolio_comments_data');
        if (saved) {
            return JSON.parse(saved);
        }
        localStorage.setItem('portfolio_comments_data', JSON.stringify(DEFAULT_COMMENTS));
        return DEFAULT_COMMENTS;
    } catch (e) {
        return DEFAULT_COMMENTS;
    }
};

export const getLocalPinnedComment = () => {
    try {
        const saved = localStorage.getItem('portfolio_pinned_comment_data');
        if (saved) {
            return JSON.parse(saved);
        }
        localStorage.setItem('portfolio_pinned_comment_data', JSON.stringify(DEFAULT_PINNED_COMMENT));
        return DEFAULT_PINNED_COMMENT;
    } catch (e) {
        return DEFAULT_PINNED_COMMENT;
    }
};

export const saveLocalComments = (comments) => {
    try {
        localStorage.setItem('portfolio_comments_data', JSON.stringify(comments));
    } catch (e) {
        console.error(e);
    }
};

export const saveLocalPinnedComment = (pinnedComment) => {
    try {
        if (pinnedComment) {
            localStorage.setItem('portfolio_pinned_comment_data', JSON.stringify(pinnedComment));
        } else {
            localStorage.removeItem('portfolio_pinned_comment_data');
        }
    } catch (e) {
        console.error(e);
    }
};
