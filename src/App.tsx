import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  FileText, 
  Download, 
  Trash2, 
  Edit3, 
  MoreVertical,
  BookOpen,
  LayoutGrid,
  List as ListIcon,
  X,
  FileDown,
  ExternalLink,
  Home,
  Compass,
  Bell,
  User as UserIcon,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  Heart,
  Bookmark,
  Settings,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  LogOut,
  Mail,
  Lock,
  Phone,
  User,
  Eye,
  EyeOff,
  MapPin,
  Calendar,
  Package,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  CheckCheck,
  Filter,
  Clock,
  Trash,
  Users,
  Shield,
  UserMinus,
  UserPlus,
  Ban,
  Store,
  TrendingUp,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  ShieldAlert,
  Info,
  Tag,
  DollarSign,
  Image as ImageIcon,
  Sun,
  Moon
} from 'lucide-react';
import { supabase } from './lib/supabase';
import { useAuth } from './contexts/AuthContext';
import { StudyDocument, LostFoundItem, BusinessListing, Notification, UserProfile } from './types';
import { cn } from './lib/utils';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './components/Logo';
import { GoogleGenAI } from "@google/genai";
import { toast } from 'react-hot-toast';

const LoadingText = () => {
  const [text, setText] = useState('Initializing Systems');
  const messages = [
    'Initializing Systems',
    'Synchronizing Neural Links',
    'Optimizing Study Modules',
    'Loading Academic Assets',
    'Calibrating Interface',
    'Preparing Your Universe'
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setText(messages[i]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return <>{text}</>;
};

const CoolLoader = ({ size = 24, color = "white" }: { size?: number, color?: string }) => {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{ 
            duration: 0.8, 
            repeat: Infinity, 
            delay: i * 0.15 
          }}
          className="rounded-full"
          style={{ 
            width: size / 4, 
            height: size / 4, 
            backgroundColor: color === "white" ? "white" : "currentColor" 
          }}
        />
      ))}
    </div>
  );
};

function MarketCard({ business, onClick, compact = false }: { business: BusinessListing, onClick: () => void, compact?: boolean, key?: any }) {
  return (
    <motion.div 
      layout
      onClick={onClick}
      className={cn(
        "glass-panel rounded-[2rem] overflow-hidden flex flex-col group cursor-pointer transition-all hover:shadow-2xl hover:shadow-brand-500/10 h-full",
        compact ? "border-slate-100 dark:border-slate-800" : "border-transparent"
      )}
    >
      {/* Image Gallery */}
      <div className={cn(
        "relative bg-slate-100 dark:bg-slate-800 overflow-hidden",
        compact ? "aspect-square" : "aspect-[4/3]"
      )}>
        {business.imageUrls?.length > 0 ? (
          <img 
            src={business.imageUrls[0]} 
            alt={business.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700">
            <Store size={compact ? 32 : 48} />
          </div>
        )}
        
        {business.price && (
          <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl shadow-lg">
            <span className="text-brand-600 dark:text-brand-400 font-bold text-[10px] sm:text-xs">{business.price}</span>
          </div>
        )}

        <div className="absolute bottom-3 right-3 px-2 py-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-lg flex items-center gap-1.5 shadow-sm">
          <Eye size={12} className="text-slate-500" />
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
            {business.viewedBy?.length || 0}
          </span>
        </div>

        {!compact && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-dark-surface/80 backdrop-blur-md rounded-lg text-white text-[8px] font-bold uppercase tracking-widest">
            {business.category}
          </div>
        )}
      </div>

      <div className={cn(
        "p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 flex flex-col",
        compact ? "p-2 sm:p-3" : "p-4 sm:p-5"
      )}>
        <div className="space-y-1">
          <h3 className={cn(
            "font-bold text-dark-surface dark:text-white line-clamp-1",
            compact ? "text-sm" : "text-lg"
          )}>{business.title}</h3>
          {!compact && (
            <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{business.description}</p>
          )}
        </div>

        <div className="space-y-2 pt-1 flex-1">
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin size={compact ? 12 : 14} className="shrink-0" />
            <span className="text-[10px] font-medium truncate">{business.location}</span>
          </div>
          {!compact && (
            <div className="flex items-center gap-2 text-slate-400">
              <UserIcon size={14} className="shrink-0" />
              <span className="text-[10px] font-medium truncate">By {business.authorName}</span>
            </div>
          )}
        </div>

        {!compact && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="w-full py-3 bg-brand-50 dark:bg-brand-900/10 text-brand-600 dark:text-brand-400 rounded-xl font-bold text-[10px] flex items-center justify-center gap-2 group-hover:bg-brand-600 group-hover:text-white transition-all">
              <Phone size={14} />
              Contact Seller
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'danger' 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: () => void, 
  title: string, 
  message: string,
  type?: 'danger' | 'warning' | 'info'
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl space-y-6"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center",
              type === 'danger' ? "bg-red-50 text-red-600" :
              type === 'warning' ? "bg-amber-50 text-amber-600" :
              "bg-brand-50 text-brand-600"
            )}>
              {type === 'danger' ? <Trash2 size={28} /> :
               type === 'warning' ? <AlertTriangle size={28} /> :
               <Info size={28} />}
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-display font-bold text-dark-surface dark:text-white">{title}</h3>
              <p className="text-sm text-slate-500 font-medium">{message}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={cn(
                "flex-1 py-4 rounded-2xl font-bold text-white shadow-lg transition-all hover:scale-[1.02]",
                type === 'danger' ? "bg-red-600 shadow-red-200" :
                type === 'warning' ? "bg-amber-600 shadow-amber-200" :
                "bg-brand-600 shadow-brand-200"
              )}
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  const { user, profile, isAdmin, loading: authLoading, signIn, signUp, signOut, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'marketplace' | 'profile' | 'admin' | 'lostfound' | 'notifications' | 'users' | 'manage-docs' | 'manage-notifications' | 'manage-lostfound' | 'manage-marketplace' | 'my-resources'>('home');
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [authFormData, setAuthFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    phoneNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const [documents, setDocuments] = useState<StudyDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('searchHistory');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
  }, [searchHistory]);

  useEffect(() => {
    if (!searchQuery.trim()) return;
    
    const timer = setTimeout(() => {
      setSearchHistory(prev => {
        const trimmed = searchQuery.trim();
        if (prev[0] === trimmed) return prev;
        const newHistory = [trimmed, ...prev.filter(q => q !== trimmed)].slice(0, 5);
        return newHistory;
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getDynamicPlaceholder = () => {
    if (searchHistory.length > 0) {
      return `Search materials eg ${searchHistory[0]}...`;
    }
    return "Search materials eg AGED...";
  };

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  const [marketSearchQuery, setMarketSearchQuery] = useState('');
  const [lostFoundSearchQuery, setLostFoundSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<StudyDocument | null>(null);
  const [previewBusiness, setPreviewBusiness] = useState<BusinessListing | null>(null);
  const [previewLostFound, setPreviewLostFound] = useState<LostFoundItem | null>(null);
  const [recentlyViewedBusinesses, setRecentlyViewedBusinesses] = useState<BusinessListing[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [readingDoc, setReadingDoc] = useState<StudyDocument | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isReaderLoading, setIsReaderLoading] = useState(true);

  useEffect(() => {
    if (readingDoc) setIsReaderLoading(true);
  }, [readingDoc]);
  const [readerZoom, setReaderZoom] = useState(100);
  const [readerFontSize, setReaderFontSize] = useState(20);
  const [readerTheme, setReaderTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [isReaderSettingsOpen, setIsReaderSettingsOpen] = useState(false);
  const [isReaderSearchOpen, setIsReaderSearchOpen] = useState(false);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [manageDocsFilter, setManageDocsFilter] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });
  const [myDocsFilter, setMyDocsFilter] = useState({
    status: 'all',
    search: ''
  });
  const [readerSearchQuery, setReaderSearchQuery] = useState('');
  const [showReaderControls, setShowReaderControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'danger'
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  }, [theme]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [notificationFormData, setNotificationFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'success',
    active: true,
    showOnHome: false,
    userId: '' as string | undefined
  });

  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>([]);
  const [isLostFoundModalOpen, setIsLostFoundModalOpen] = useState(false);
  const [editingLostFound, setEditingLostFound] = useState<LostFoundItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [lostFoundFormData, setLostFoundFormData] = useState({
    title: '',
    description: '',
    type: 'lost' as 'lost' | 'found',
    location: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [businessListings, setBusinessListings] = useState<BusinessListing[]>([]);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<BusinessListing | null>(null);
  const [selectedBusinessImages, setSelectedBusinessImages] = useState<File[]>([]);
  const [isUploadingBusiness, setIsUploadingBusiness] = useState(false);
  const [businessFormData, setBusinessFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'General',
    location: '',
    contactPhone: '',
  });

  const categories = ['All', 'Pinned', 'Notes', 'Past Paper'];

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'pdf' as 'pdf' | 'docx',
    url: '',
    category: 'General'
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [restrictToPdf, setRestrictToPdf] = useState(false);

  useEffect(() => {
    fetchDocuments();
    fetchLostFound();
    fetchBusinessListings();
    fetchNotifications();
    if (isAdmin) fetchUsers();

    // Real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents'
        },
        () => {
          fetchDocuments();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'businesses'
        },
        () => {
          fetchBusinessListings();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lost_found'
        },
        () => {
          fetchLostFound();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAdmin]);

  useEffect(() => {
    if (editingDoc) {
      setFormData({
        title: editingDoc.title,
        description: editingDoc.description,
        type: editingDoc.type,
        url: editingDoc.url,
        category: editingDoc.category
      });
    } else {
      setFormData({ title: '', description: '', type: 'pdf', url: '', category: 'General' });
    }
    setSelectedFiles([]);
  }, [editingDoc, isAddModalOpen]);

  const fetchNotifications = async () => {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profile?.uid) {
        query = query.or(`user_id.eq.${profile.uid},user_id.is.null`);
      } else {
        query = query.is('user_id', null);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      const mappedData = (data || []).map(n => ({
        id: n.id,
        userId: n.user_id,
        title: n.title,
        message: n.message,
        type: n.type,
        createdAt: n.created_at,
        active: n.active,
        read: n.read,
        showOnHome: n.show_on_home
      }));
      
      setNotifications(mappedData);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      
      const mappedUsers = (data || []).map(u => ({
        uid: u.id,
        email: u.email,
        displayName: u.display_name,
        phoneNumber: u.phone_number,
        avatarUrl: u.avatar_url,
        role: u.role,
        status: u.status,
        createdAt: u.created_at,
        pinnedDocIds: u.pinned_doc_ids || []
      }));
      
      setUsers(mappedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedDocs: StudyDocument[] = (data || []).map(doc => ({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        type: doc.type,
        url: doc.url,
        thumbnailUrl: doc.thumbnail_url,
        category: doc.category,
        authorId: doc.author_id,
        authorName: doc.author_name,
        status: doc.status,
        createdAt: doc.created_at,
        updatedAt: doc.updated_at,
        fileSize: doc.file_size,
        views: doc.views
      }));
      
      setDocuments(mappedDocs);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Reader idle detection for distraction-free mode
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowReaderControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (readingDoc) setShowReaderControls(false);
      }, 3000);
    };

    if (readingDoc) {
      window.addEventListener('mousemove', handleMouseMove);
      handleMouseMove();
    } else {
      setShowReaderControls(true);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [readingDoc]);

  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    // Basic Validation
    if (!authFormData.email.includes('@')) {
      setAuthError('Please enter a valid email address');
      return;
    }
    if (authFormData.password.length < 6) {
      setAuthError('Password must be at least 6 characters long');
      return;
    }
    if (authView === 'signup' && !authFormData.displayName.trim()) {
      setAuthError('Please enter your full name');
      return;
    }

    setAuthSubmitting(true);
    try {
      if (authView === 'login') {
        await signIn(authFormData.email, authFormData.password);
      } else {
        await signUp(authFormData.email, authFormData.password, authFormData.displayName, authFormData.phoneNumber);
        setAuthSuccess('Account created successfully! You can now sign in.');
        setAuthView('login');
        setAuthFormData({ ...authFormData, password: '' });
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      let message = err.message || 'An error occurred during authentication';
      
      // User-friendly error mapping
      if (message.includes('Invalid login credentials')) {
        message = 'Invalid email or password. Please try again.';
      } else if (message.includes('User already registered')) {
        message = 'An account with this email already exists.';
      } else if (message.includes('Database error saving new user')) {
        message = 'There was a temporary issue creating your profile. Please try signing in now; your profile will be created automatically.';
      }
      
      setAuthError(message);
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (selectedFiles.length === 0 && !editingDoc) {
      toast.error('Please select at least one file to upload');
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    const totalFiles = selectedFiles.length;
    try {
      if (editingDoc) {
        // Single document update logic
        let fileUrl = formData.url;
        if (selectedFiles.length > 0) {
          const file = selectedFiles[0];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);
          
          fileUrl = publicUrl;
        }

        const docData = {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          url: fileUrl,
          category: formData.category,
          status: isAdmin ? 'approved' : 'pending',
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('documents')
          .update(docData)
          .eq('id', editingDoc.id);
        if (error) throw error;
      } else {
        // Bulk upload logic
        setUploadProgress({ current: 0, total: selectedFiles.length });
        
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          setUploadProgress({ current: i + 1, total: selectedFiles.length });
          
          try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from('documents')
              .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from('documents')
              .getPublicUrl(filePath);

            const docData = {
              title: selectedFiles.length === 1 ? formData.title : file.name.split('.')[0],
              description: formData.description,
              type: (file.name.split('.').pop()?.toLowerCase() === 'docx' ? 'pdf' : 'pdf') as 'pdf' | 'docx', // Default to pdf for now, or detect
              url: publicUrl,
              category: formData.category,
              status: isAdmin ? 'approved' : 'pending',
              author_id: user.id,
              author_name: profile?.displayName || (isAdmin ? 'Admin' : 'User'),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              file_size: file.size
            };

            // Better type detection
            const actualExt = file.name.split('.').pop()?.toLowerCase();
            if (actualExt === 'docx') docData.type = 'docx';

            const { error } = await supabase
              .from('documents')
              .insert([docData]);
            if (error) throw error;
            successCount++;
          } catch (fileErr) {
            console.error(`Failed to upload ${file.name}:`, fileErr);
            toast.error(`Failed to upload ${file.name}`);
          }
        }
      }

      setIsAddModalOpen(false);
      setEditingDoc(null);
      setSelectedFiles([]);
      setUploadProgress(null);
      setRestrictToPdf(false);
      setFormData({ title: '', description: '', type: 'pdf', url: '', category: 'General' });
      fetchDocuments();
      
      if (editingDoc) {
        toast.success('Document updated');
      } else {
        if (successCount === totalFiles) {
          toast.success(`Successfully uploaded all ${totalFiles} document(s)`);
          notifyAdmins('New Document Submission', `${profile?.displayName || 'A user'} has uploaded ${totalFiles} new document(s) for approval.`);
        } else if (successCount > 0) {
          toast.success(`Uploaded ${successCount} of ${totalFiles} document(s)`);
          notifyAdmins('New Document Submission', `${profile?.displayName || 'A user'} has uploaded ${successCount} new document(s) for approval.`);
        } else {
          toast.error('Failed to upload any documents');
        }
      }
    } catch (err: any) {
      console.error('Error saving document:', err);
      toast.error(`Error: ${err.message || 'Failed to save document'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      if (error) throw error;
      
      // Update local state immediately
      setDocuments(prev => prev.filter(d => d.id !== id));
      
      // Also re-fetch to be absolutely sure
      fetchDocuments();
      
      toast.success('Document deleted');
    } catch (err: any) {
      console.error('Error deleting document:', err);
      toast.error(`Failed to delete document: ${err.message || 'Unknown error'}`);
    }
  };

  const handleApproveDocument = async (id: string, status: 'approved' | 'rejected') => {
    if (!isAdmin) return;
    try {
      const doc = documents.find(d => d.id === id);
      const { error } = await supabase
        .from('documents')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      
      if (doc) {
        await supabase.from('notifications').insert([{
          user_id: doc.authorId,
          title: `Document ${status === 'approved' ? 'Approved' : 'Rejected'}`,
          message: `Your document "${doc.title}" has been ${status}.`,
          type: status === 'approved' ? 'success' : 'warning',
          active: true,
          show_on_home: false,
          read: false,
          created_at: new Date().toISOString()
        }]);
      }
      
      fetchDocuments();
      toast.success(`Document ${status}`);
    } catch (err: any) {
      console.error('Error approving/rejecting document:', err);
      toast.error(`Failed to update document: ${err.message}`);
      setDocuments(documents.map(doc => doc.id === id ? { ...doc, status } : doc));
    }
  };

  const handleBulkApprove = async (status: 'approved' | 'rejected') => {
    if (!isAdmin || selectedDocIds.length === 0) return;
    try {
      const docsToNotify = documents.filter(d => selectedDocIds.includes(d.id));
      
      const { error } = await supabase
        .from('documents')
        .update({ status })
        .in('id', selectedDocIds);
      if (error) throw error;

      // Send notifications to each author
      const notificationsToInsert = docsToNotify.map(doc => ({
        user_id: doc.authorId,
        title: `Document ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        message: `Your document "${doc.title}" has been ${status} in bulk action.`,
        type: status === 'approved' ? 'success' : 'warning',
        active: true,
        show_on_home: false,
        read: false,
        created_at: new Date().toISOString()
      }));

      if (notificationsToInsert.length > 0) {
        await supabase.from('notifications').insert(notificationsToInsert);
      }

      fetchDocuments();
      setSelectedDocIds([]);
      toast.success(`${selectedDocIds.length} documents ${status}`);
    } catch (err: any) {
      console.error('Error bulk approving/rejecting documents:', err);
      toast.error(`Failed to bulk update documents: ${err.message}`);
      setDocuments(documents.map(doc => selectedDocIds.includes(doc.id) ? { ...doc, status } : doc));
      setSelectedDocIds([]);
    }
  };

  const handleBulkDelete = async () => {
    if (!isAdmin || selectedDocIds.length === 0) return;
    
    setConfirmModal({
      isOpen: true,
      title: 'Bulk Delete',
      message: `Are you sure you want to delete ${selectedDocIds.length} documents? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('documents')
            .delete()
            .in('id', selectedDocIds);
          if (error) throw error;
          fetchDocuments();
          setSelectedDocIds([]);
          toast.success(`${selectedDocIds.length} documents deleted`);
        } catch (err: any) {
          console.error('Error bulk deleting documents:', err);
          toast.error(`Failed to bulk delete: ${err.message}`);
          setDocuments(documents.filter(doc => !selectedDocIds.includes(doc.id)));
          setSelectedDocIds([]);
        }
      },
      type: 'danger'
    });
  };

  const handleAddNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dbData = {
        title: notificationFormData.title,
        message: notificationFormData.message,
        type: notificationFormData.type,
        active: notificationFormData.active,
        show_on_home: notificationFormData.showOnHome,
        user_id: notificationFormData.userId || null
      };

      if (editingNotification) {
        const { error } = await supabase
          .from('notifications')
          .update({
            ...dbData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingNotification.id);
        if (error) throw error;
        toast.success('Notification updated');
      } else {
        const { error } = await supabase
          .from('notifications')
          .insert([{
            ...dbData,
            created_at: new Date().toISOString(),
            read: false
          }]);
        if (error) throw error;
        toast.success('Notification created');
      }
      setIsNotificationModalOpen(false);
      setEditingNotification(null);
      setNotificationFormData({
        title: '',
        message: '',
        type: 'info',
        active: true,
        showOnHome: false,
        userId: ''
      });
      fetchNotifications();
    } catch (err: any) {
      console.error('Error saving notification:', err);
      toast.error(`Error: ${err.message}`);
    }
  };

  const notifyAdmins = async (title: string, message: string) => {
    try {
      const admins = users.filter(u => u.role === 'admin');
      if (admins.length === 0) return;

      const notificationsToInsert = admins.map(admin => ({
        user_id: admin.uid,
        title,
        message,
        type: 'info' as const,
        active: true,
        show_on_home: false,
        read: false,
        created_at: new Date().toISOString()
      }));

      await supabase.from('notifications').insert(notificationsToInsert);
    } catch (err) {
      console.error('Error notifying admins:', err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      if (error) throw error;
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Error marking as read:', err);
      toast.error('Failed to update notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', unreadIds)
        .or(`user_id.eq.${profile?.uid},user_id.is.null`);
      
      if (error) throw error;
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Error marking all as read:', err);
      toast.error('Failed to update notifications');
    }
  };

  const handleClearRead = async () => {
    try {
      const readIds = notifications.filter(n => n.read).map(n => n.id);
      if (readIds.length === 0) return;

      const { error } = await supabase
        .from('notifications')
        .delete()
        .in('id', readIds)
        .eq('user_id', profile?.uid);
      
      if (error) throw error;
      setNotifications(prev => prev.filter(n => !n.read));
      toast.success('Read notifications cleared');
    } catch (err) {
      console.error('Error clearing read notifications:', err);
      toast.error('Failed to clear notifications');
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      const userToUpdate = users.find(u => u.uid === userId);
      if (!userToUpdate) return;

      const newStatus = userToUpdate.status === 'active' ? 'suspended' : 'active';
      const newRole = newStatus === 'suspended' ? 'suspended' : 'student';

      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus, role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(u => {
        if (u.uid === userId) {
          return { ...u, status: newStatus, role: newRole };
        }
        return u;
      }));
      toast.success(`User ${newStatus === 'suspended' ? 'suspended' : 'activated'}`);
    } catch (err: any) {
      console.error('Error suspending user:', err);
      toast.error(`Failed to update user: ${err.message}`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      // Update local state immediately
      setUsers(users.filter(u => u.uid !== userId));
      
      // Also re-fetch to be absolutely sure
      fetchUsers();
      
      toast.success('User deleted successfully');
    } catch (err: any) {
      console.error('Error deleting user:', err);
      toast.error(`Failed to delete user: ${err.message || 'Unknown error'}`);
    }
  };

  const handlePromoteUser = async (userId: string) => {
    try {
      const userToUpdate = users.find(u => u.uid === userId);
      if (!userToUpdate) return;

      const newRole = userToUpdate.role === 'admin' ? 'student' : 'admin';

      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(u => {
        if (u.uid === userId) {
          return { ...u, role: newRole };
        }
        return u;
      }));
      toast.success(`User ${newRole === 'admin' ? 'promoted to admin' : 'demoted to student'}`);
    } catch (err: any) {
      console.error('Error promoting user:', err);
      toast.error(`Failed to update user role: ${err.message}`);
    }
  };

  const handleAddLostFound = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUploading(true);
    try {
      let imageUrl = editingLostFound?.imageUrl || '';

      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `lost_found/${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, selectedImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      const itemData = {
        title: lostFoundFormData.title,
        description: lostFoundFormData.description,
        type: lostFoundFormData.type,
        location: lostFoundFormData.location,
        date: lostFoundFormData.date,
        image_url: imageUrl,
        status: isAdmin ? 'approved' : 'pending'
      };

      if (editingLostFound) {
        const { error } = await supabase
          .from('lost_found')
          .update(itemData)
          .eq('id', editingLostFound.id);
        if (error) throw error;
        toast.success('Item updated');
      } else {
        const { error } = await supabase
          .from('lost_found')
          .insert([{
            ...itemData,
            author_id: user.id,
            author_name: profile?.displayName || 'User',
            author_phone: profile?.phoneNumber,
            created_at: new Date().toISOString()
          }]);
        if (error) throw error;
        toast.success('Item submitted for approval');
        notifyAdmins('New Lost & Found Item', `${profile?.displayName || 'A user'} has posted a new ${lostFoundFormData.type} item: "${lostFoundFormData.title}".`);
      }

      setIsLostFoundModalOpen(false);
      setEditingLostFound(null);
      setSelectedImage(null);
      setLostFoundFormData({
        title: '',
        description: '',
        type: 'lost',
        location: '',
        date: new Date().toISOString().split('T')[0],
      });
      fetchLostFound();
    } catch (err: any) {
      console.error('Error saving lost/found item:', err);
      if (err.message === 'Failed to fetch') {
        alert('Network Error: Could not connect to Supabase. Please check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Settings > Secrets.');
      } else {
        alert(`Failed to save lost/found item: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const { error } = await supabase.from('notifications').delete().eq('id', id);
      if (error) throw error;
      
      // Update local state immediately
      setNotifications(prev => prev.filter(n => n.id !== id));
      
      // Also re-fetch to be absolutely sure
      fetchNotifications();
      
      toast.success('Notification deleted');
    } catch (err: any) {
      console.error('Error deleting notification:', err);
      toast.error(`Failed to delete notification: ${err.message || 'Unknown error'}`);
    }
  };

  const handleDeleteLostFound = async (id: string) => {
    try {
      const { error } = await supabase.from('lost_found').delete().eq('id', id);
      if (error) throw error;
      
      // Update local state immediately
      setLostFoundItems(prev => prev.filter(i => i.id !== id));
      
      // Also re-fetch to be absolutely sure
      fetchLostFound();
      
      toast.success('Item deleted successfully');
    } catch (err: any) {
      console.error('Error deleting item:', err);
      toast.error(`Failed to delete item: ${err.message || 'Unknown error'}`);
    }
  };

  const handleDeleteBusiness = async (id: string) => {
    try {
      const { error } = await supabase.from('businesses').delete().eq('id', id);
      if (error) throw error;
      
      // Update local state immediately
      setBusinessListings(prev => prev.filter(b => b.id !== id));
      
      // Also re-fetch to be absolutely sure
      fetchBusinessListings();
      
      toast.success('Listing deleted successfully');
    } catch (err: any) {
      console.error('Error deleting listing:', err);
      toast.error(`Failed to delete listing: ${err.message || 'Unknown error'}`);
    }
  };

  const handleApproveLostFound = async (id: string, status: 'approved' | 'rejected') => {
    if (!isAdmin) return;
    try {
      const item = lostFoundItems.find(i => i.id === id);
      const { error } = await supabase
        .from('lost_found')
        .update({ status })
        .eq('id', id);
      if (error) throw error;

      if (item) {
        await supabase.from('notifications').insert([{
          user_id: item.authorId,
          title: `Lost & Found Item ${status === 'approved' ? 'Approved' : 'Rejected'}`,
          message: `Your item "${item.title}" has been ${status}.`,
          type: status === 'approved' ? 'success' : 'warning',
          active: true,
          show_on_home: false,
          read: false,
          created_at: new Date().toISOString()
        }]);
      }

      fetchLostFound();
      toast.success(`Item ${status}`);
    } catch (err: any) {
      console.error('Error approving/rejecting item:', err);
      toast.error(`Failed to update item: ${err.message}`);
      setLostFoundItems(lostFoundItems.map(item => item.id === id ? { ...item, status } : item));
    }
  };

  const handleViewBusiness = async (business: BusinessListing) => {
    setCurrentImageIndex(0);
    setPreviewBusiness(business);
    setRecentlyViewedBusinesses(prev => {
      const filtered = prev.filter(item => item.id !== business.id);
      return [business, ...filtered].slice(0, 10);
    });

    if (user && (!business.viewedBy || !business.viewedBy.includes(user.id))) {
      const newViewedBy = [...(business.viewedBy || []), user.id];
      const { error } = await supabase
        .from('businesses')
        .update({ viewed_by: newViewedBy })
        .eq('id', business.id);
      
      if (!error) {
        setBusinessListings(prev => prev.map(b => b.id === business.id ? { ...b, viewedBy: newViewedBy } : b));
      }
    }
  };

  const handleAddBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUploadingBusiness(true);
    try {
      let imageUrls = editingBusiness?.imageUrls || [];

      if (selectedBusinessImages.length > 0) {
        const newUrls = await Promise.all(selectedBusinessImages.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `businesses/${user.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);
          
          return publicUrl;
        }));
        imageUrls = [...imageUrls, ...newUrls].slice(0, 2);
      }

      const businessData = {
        title: businessFormData.title,
        description: businessFormData.description,
        price: businessFormData.price,
        category: businessFormData.category,
        location: businessFormData.location,
        contact_phone: businessFormData.contactPhone,
        image_urls: imageUrls,
        status: isAdmin ? 'approved' : 'pending'
      };

      if (editingBusiness) {
        const { error } = await supabase
          .from('businesses')
          .update(businessData)
          .eq('id', editingBusiness.id);
        if (error) throw error;
        toast.success('Listing updated');
      } else {
        const { error } = await supabase
          .from('businesses')
          .insert([{
            ...businessData,
            author_id: user.id,
            author_name: profile?.displayName || 'User',
            created_at: new Date().toISOString(),
            viewed_by: []
          }]);
        if (error) throw error;
        toast.success('Listing submitted for approval');
        notifyAdmins('New Marketplace Listing', `${profile?.displayName || 'A user'} has posted a new listing: "${businessFormData.title}".`);
      }

      setIsBusinessModalOpen(false);
      setEditingBusiness(null);
      setSelectedBusinessImages([]);
      setBusinessFormData({
        title: '',
        description: '',
        price: '',
        category: 'General',
        location: '',
        contactPhone: '',
      });
      fetchBusinessListings();
    } catch (err: any) {
      console.error('Error saving business listing:', err);
      if (err.message === 'Failed to fetch') {
        alert('Network Error: Could not connect to Supabase. Please check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Settings > Secrets.');
      } else {
        alert(`Failed to save business listing: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setIsUploadingBusiness(false);
    }
  };

  const handleApproveBusiness = async (id: string, status: 'approved' | 'rejected') => {
    if (!isAdmin) return;
    try {
      const business = businessListings.find(b => b.id === id);
      const { error } = await supabase
        .from('businesses')
        .update({ status })
        .eq('id', id);
      if (error) throw error;

      if (business) {
        await supabase.from('notifications').insert([{
          user_id: business.authorId,
          title: `Marketplace Listing ${status === 'approved' ? 'Approved' : 'Rejected'}`,
          message: `Your listing "${business.title}" has been ${status}.`,
          type: status === 'approved' ? 'success' : 'warning',
          active: true,
          show_on_home: false,
          read: false,
          created_at: new Date().toISOString()
        }]);
      }

      fetchBusinessListings();
      toast.success(`Listing ${status}`);
    } catch (err: any) {
      console.error('Error updating business status:', err);
      toast.error(`Failed to update listing: ${err.message}`);
    }
  };

  const handleTogglePin = async (docId: string) => {
    if (!profile) return;
    const isPinned = profile.pinnedDocIds?.includes(docId);
    const newPinnedIds = isPinned 
      ? profile.pinnedDocIds?.filter(id => id !== docId)
      : [...(profile.pinnedDocIds || []), docId];
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ pinned_doc_ids: newPinnedIds })
        .eq('id', profile.uid);
      
      if (error) throw error;
      updateProfile({ pinnedDocIds: newPinnedIds });
    } catch (error) {
      console.error('Error toggling pin:', error);
      // Fallback for local state
      updateProfile({ pinnedDocIds: newPinnedIds });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB.');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      updateProfile({ avatarUrl: publicUrl });
    } catch (err) {
      console.error('Error uploading avatar:', err);
      alert('Failed to upload profile picture. Check console for details.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const incrementViews = async (docId: string) => {
    try {
      const docToUpdate = documents.find(d => d.id === docId);
      if (!docToUpdate) return;

      const newViews = (docToUpdate.views || 0) + 1;
      
      const { error } = await supabase
        .from('documents')
        .update({ views: newViews })
        .eq('id', docId);
      
      if (error) throw error;
      setDocuments(prev => prev.map(d => d.id === docId ? { ...d, views: newViews } : d));
    } catch (error) {
      console.error('Error incrementing views:', error);
      // Fallback for local state
      setDocuments(prev => prev.map(d => d.id === docId ? { ...d, views: (d.views || 0) + 1 } : d));
    }
  };

  const fetchLostFound = async () => {
    try {
      const { data, error } = await supabase
        .from('lost_found')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      
      const mappedItems: LostFoundItem[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type,
        location: item.location,
        date: item.date,
        status: item.status,
        authorId: item.author_id,
        authorName: item.author_name,
        authorPhone: item.author_phone,
        imageUrl: item.image_url,
        createdAt: item.created_at
      }));
      
      setLostFoundItems(mappedItems);
    } catch (err) {
      console.error('Error fetching lost/found items:', err);
    }
  };

  const fetchBusinessListings = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      
      const mappedListings: BusinessListing[] = (data || []).map(b => ({
        id: b.id,
        title: b.title,
        description: b.description,
        price: b.price,
        category: b.category,
        location: b.location,
        contactPhone: b.contact_phone,
        imageUrls: b.image_urls || [],
        status: b.status,
        authorId: b.author_id,
        authorName: b.author_name,
        createdAt: b.created_at,
        viewedBy: b.viewed_by || []
      }));
      
      setBusinessListings(mappedListings);
    } catch (err) {
      console.error('Error fetching business listings:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchDocuments();
      toast.success('Document deleted');
    } catch (err) {
      console.error('Error deleting document:', err);
      setDocuments(documents.filter(d => d.id !== id));
      toast.error('Failed to delete document');
    }
  };

  const displayDocs = documents.filter(doc => doc.status === 'approved');

  const filteredDocs = displayDocs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || 
                           (selectedCategory === 'Pinned' ? profile?.pinnedDocIds?.includes(doc.id) : doc.category === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const recentlyViewed = displayDocs.slice(0, 4);
  const trendingMaterials = [...displayDocs].reverse().slice(0, 4);

  const filteredMarketItems = businessListings.filter(item => 
    item.status === 'approved' && (
      item.title.toLowerCase().includes(marketSearchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(marketSearchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(marketSearchQuery.toLowerCase())
    )
  );

  const filteredLostFoundItems = lostFoundItems.filter(item => 
    item.status === 'approved' && (
      item.title.toLowerCase().includes(lostFoundSearchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(lostFoundSearchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(lostFoundSearchQuery.toLowerCase())
    )
  );

  const manageFilteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(manageDocsFilter.search.toLowerCase()) ||
                         doc.authorName.toLowerCase().includes(manageDocsFilter.search.toLowerCase());
    const matchesStatus = manageDocsFilter.status === 'all' || doc.status === manageDocsFilter.status;
    const matchesCategory = manageDocsFilter.category === 'all' || doc.category === manageDocsFilter.category;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const [resourceTypeFilter, setResourceTypeFilter] = useState<'all' | 'documents' | 'marketplace' | 'lostfound'>('all');

  const myFilteredResources = [
    ...documents.filter(d => d.authorId === user?.id).map(d => ({ ...d, resourceType: 'document' as const })),
    ...businessListings.filter(b => b.authorId === user?.id).map(b => ({ ...b, resourceType: 'marketplace' as const })),
    ...lostFoundItems.filter(i => i.authorId === user?.id).map(i => ({ ...i, resourceType: 'lostfound' as const }))
  ].filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(myDocsFilter.search.toLowerCase());
    const matchesStatus = myDocsFilter.status === 'all' || item.status === myDocsFilter.status;
    const matchesType = resourceTypeFilter === 'all' || item.resourceType === resourceTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen bg-[#F0F7FF] dark:bg-[#020617] transition-colors duration-500">
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617] overflow-hidden"
          >
            {/* Scanning Line Effect */}
            <motion.div
              initial={{ top: "-10%" }}
              animate={{ top: "110%" }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-400/50 to-transparent z-20"
            />

            {/* Dynamic Colorful Blobs */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-brand-600/30 rounded-full blur-[120px]"
              />
              <motion.div
                animate={{
                  x: [0, -80, 0],
                  y: [0, 100, 0],
                  scale: [1, 1.3, 1],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-[10%] -right-[10%] w-[70%] h-[70%] bg-violet-600/20 rounded-full blur-[120px]"
              />
              <motion.div
                animate={{
                  x: [0, 50, 0],
                  y: [0, 80, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[100px]"
              />
              <motion.div
                animate={{
                  x: [0, -60, 0],
                  y: [0, -40, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[20%] left-[10%] w-[45%] h-[45%] bg-amber-500/10 rounded-full blur-[100px]"
              />
            </div>

            {/* Particle field effect */}
            <div className="absolute inset-0 opacity-30">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    y: [0, -100],
                    x: Math.random() * 40 - 20
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 5
                  }}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                />
              ))}
            </div>
            
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
              className="relative z-10 text-center space-y-8"
            >
              <motion.div 
                animate={{ 
                  y: [0, -15, 0],
                }}
                transition={{ 
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                }}
                className="mx-auto relative group"
              >
                <Logo size={120} />
              </motion.div>
              
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <h1 className="text-5xl sm:text-7xl font-display font-black text-white tracking-tighter flex items-center justify-center gap-2 relative">
                    <motion.span 
                      animate={{ 
                        textShadow: [
                          "0 0 0px rgba(255,255,255,0)",
                          "2px 0 5px rgba(124,58,237,0.5)",
                          "-2px 0 5px rgba(16,185,129,0.5)",
                          "0 0 0px rgba(255,255,255,0)"
                        ],
                        x: [0, -1, 1, -1, 0]
                      }}
                      transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                      className="bg-clip-text text-transparent bg-gradient-to-r from-white via-brand-200 to-white animate-gradient-x"
                    >
                      HarMo Space
                    </motion.span>
                    <span className="text-brand-400">360</span>
                  </h1>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="flex flex-col items-center gap-4"
                >
                  <p className="text-brand-200/80 font-bold tracking-[0.4em] uppercase text-[10px] sm:text-xs">
                    Your Academic Universe
                  </p>
                  
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                    <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse"></div>
                    <motion.span 
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-[10px] font-bold text-white/60 uppercase tracking-widest"
                    >
                      <LoadingText />
                    </motion.span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            <div className="absolute bottom-20 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-brand-400 to-transparent shadow-[0_0_20px_rgba(124,58,237,0.8)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {authLoading ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] overflow-hidden relative">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[120px] animate-pulse"></div>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 flex flex-col items-center gap-8"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-8 border-2 border-dashed border-brand-400/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-12 border border-brand-500/20 rounded-full"
              />
              <div className="relative bg-[#020617] p-4 rounded-3xl border border-white/10 shadow-2xl">
                <Logo size={80} />
              </div>
            </div>

            <div className="space-y-4 text-center">
              <CoolLoader size={32} color="brand" />
              <p className="text-brand-200/60 font-bold tracking-[0.3em] uppercase text-[10px]">
                Securing Connection
              </p>
            </div>
          </motion.div>
        </div>
      ) : !user ? (
        <div className="min-h-screen bg-[#F0F7FF] dark:bg-[#020617] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md space-y-8 my-auto"
          >
            <div className="text-center space-y-2">
              <Logo size={80} className="mx-auto mb-6" />
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-dark-surface dark:text-white">
                {authView === 'login' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-slate-500 text-sm sm:text-base">
                {authView === 'login' ? 'Sign in to continue your learning journey' : 'Join HarMo Space 360 today'}
              </p>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-[2.5rem] space-y-6">
              <form onSubmit={handleAuth} className="space-y-4">
                {authView === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required
                        type="text"
                        value={authFormData.displayName}
                        onChange={e => setAuthFormData({...authFormData, displayName: e.target.value})}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition-all text-dark-surface dark:text-white"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required
                      type="email"
                      value={authFormData.email}
                      onChange={e => setAuthFormData({...authFormData, email: e.target.value})}
                      placeholder="name@example.com"
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition-all text-dark-surface dark:text-white"
                    />
                  </div>
                </div>

                {authView === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required
                        type="tel"
                        value={authFormData.phoneNumber}
                        onChange={e => setAuthFormData({...authFormData, phoneNumber: e.target.value})}
                        placeholder="+263 771 234 567"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition-all text-dark-surface dark:text-white"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                    {authView === 'login' && (
                      <button 
                        type="button"
                        onClick={() => alert('Password reset link has been sent to your email.')}
                        className="text-[10px] font-bold text-brand-600 hover:text-brand-700 uppercase tracking-widest"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required
                      type={showPassword ? "text" : "password"}
                      value={authFormData.password}
                      onChange={e => setAuthFormData({...authFormData, password: e.target.value})}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition-all text-dark-surface dark:text-white"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
                    {authError}
                  </div>
                )}

                {authSuccess && (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-sm font-medium">
                    {authSuccess}
                  </div>
                )}

                <button 
                  disabled={authSubmitting}
                  type="submit"
                  className="w-full py-5 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white rounded-[2rem] font-bold transition-all shadow-xl shadow-brand-200 flex items-center justify-center gap-3 text-lg"
                >
                  {authSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    authView === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>

              <div className="text-center space-y-4">
                <button 
                  onClick={() => {
                    setAuthView(authView === 'login' ? 'signup' : 'login');
                    setAuthError(null);
                  }}
                  className="text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors"
                >
                  {authView === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => {
                      setConfirmModal({
                        isOpen: true,
                        title: 'Reset Session',
                        message: 'This will clear your local session and reload the app. Use this if you are experiencing login errors. Continue?',
                        onConfirm: () => {
                          localStorage.clear();
                          sessionStorage.clear();
                          window.location.reload();
                        },
                        type: 'warning'
                      });
                    }}
                    className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                  >
                    Trouble signing in? Reset Session
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <>
          {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-panel border-b border-brand-100/50 dark:border-slate-800/50 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <Logo size={48} />
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-display font-bold text-dark-surface dark:text-white truncate">HarMo Space 360</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">HarMoTech Ventures</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <button 
            onClick={() => setActiveTab('notifications')}
            className={cn(
              "relative p-2.5 rounded-xl transition-all",
              activeTab === 'notifications' 
                ? "bg-brand-600 text-white shadow-lg shadow-brand-200" 
                : "bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            )}
          >
            <Bell size={20} />
            {notifications.filter(n => n.active && !n.read).length > 0 && (
              <span className={cn(
                "absolute top-2 right-2 w-2 h-2 rounded-full border-2",
                activeTab === 'notifications' ? "bg-white border-brand-600" : "bg-red-500 border-white dark:border-slate-800"
              )}></span>
            )}
          </button>

          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-bold text-dark-surface dark:text-white">{getGreeting()}, {profile?.displayName?.split(' ')[0] || 'Student'}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Academic Universe</span>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setActiveTab('profile')}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border-2 border-white shadow-md hover:border-brand-300 transition-all"
            >
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-lg">
                  {(profile?.displayName || 'S')[0]}
                </div>
              )}
            </button>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-72 flex-col fixed left-0 top-0 bottom-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 z-50 pt-28 pb-8 px-6 space-y-8">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-4">Navigation</p>
            <nav className="space-y-1">
              {[
                { id: 'home', label: 'Home', icon: Home },
                { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
                { id: 'lostfound', label: 'Lost & Found', icon: Package },
                { id: 'profile', label: 'My Profile', icon: UserIcon },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all",
                    activeTab === item.id 
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-200" 
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-600"
                  )}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {isAdmin && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-4">Administration</p>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('admin')}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all",
                    activeTab === 'admin' 
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-200" 
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-600"
                  )}
                >
                  <Settings size={20} />
                  <span>Admin Panel</span>
                </button>
              </nav>
            </div>
          )}

          <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 lg:ml-72 pt-28 space-y-8 pb-32 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {activeTab === 'home' && (
          <>
            {/* Notifications Banner */}
            {notifications.filter(n => n.active && n.showOnHome).length > 0 && (
              <div className="px-4 sm:px-6 space-y-3">
                {notifications.filter(n => n.active && n.showOnHome).map(notif => (
                  <motion.div 
                    key={`banner-${notif.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "p-4 rounded-2xl flex items-start gap-3 shadow-sm border",
                      notif.type === 'info' ? "bg-blue-50 border-blue-100 text-blue-800" :
                      notif.type === 'warning' ? "bg-amber-50 border-amber-100 text-amber-800" :
                      "bg-emerald-50 border-emerald-100 text-emerald-800"
                    )}
                  >
                    <Bell size={18} className="shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-bold">{notif.title}</p>
                      <p className="text-xs opacity-80">{notif.message}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Search Bar */}
            <div className="px-4 sm:px-6">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-dark-surface dark:group-focus-within:text-white transition-colors" size={20} />
                <input 
                  type="text"
                  placeholder={getDynamicPlaceholder()}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 border-none rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-dark-surface/5 dark:focus:ring-white/5 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-lg text-dark-surface dark:text-white"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-200">
                  <ListIcon size={18} />
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="flex gap-3 overflow-x-auto px-4 sm:px-6 pb-2 scrollbar-hide">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "category-pill",
                    selectedCategory === cat ? "active" : ""
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Recently Viewed */}
            {searchQuery === '' && (
              <div className="space-y-6">
                <div className="px-4 sm:px-6 flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-dark-surface dark:text-white tracking-tight">Recently viewed</h3>
                  <button className="text-sm font-bold text-slate-400 hover:text-dark-surface dark:hover:text-white transition-colors">See all</button>
                </div>
                
                <div className="flex gap-5 overflow-x-auto px-4 sm:px-6 pb-4 scrollbar-hide">
                  {recentlyViewed.map((doc) => (
                      <motion.div
                        key={`recent-${doc.id}`}
                        whileHover={{ y: -5 }}
                        onClick={() => {
                          setReadingDoc(doc);
                          incrementViews(doc.id);
                        }}
                        className="w-64 sm:w-72 shrink-0 glass-panel p-4 rounded-[2.5rem] space-y-4 group cursor-pointer"
                      >
                        <div className="aspect-square rounded-[2rem] overflow-hidden relative">
                          <img 
                            src={`https://picsum.photos/seed/recent-${doc.id}/400/400`} 
                            alt={doc.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 flex flex-col gap-2">
                            <div className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-dark-surface dark:text-white">
                              {doc.type}
                            </div>
                            <div className="px-3 py-1 bg-brand-600/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-white flex items-center gap-1">
                              <Eye size={10} />
                              {doc.views || 0}
                            </div>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTogglePin(doc.id);
                            }}
                            className={cn(
                              "absolute bottom-3 right-3 p-2 rounded-xl transition-all shadow-lg",
                              profile?.pinnedDocIds?.includes(doc.id) 
                                ? "bg-brand-600 text-white" 
                                : "bg-white/90 text-slate-400 hover:text-brand-600"
                            )}
                          >
                            <Bookmark size={16} fill={profile?.pinnedDocIds?.includes(doc.id) ? "currentColor" : "none"} />
                          </button>
                        </div>
                        <div className="space-y-1 px-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-dark-surface dark:text-white truncate flex-1">{doc.title}</h4>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setReadingDoc(doc);
                                incrementViews(doc.id);
                              }}
                              className="px-3 py-1 bg-brand-50 text-brand-600 rounded-lg text-[10px] font-bold hover:bg-brand-600 hover:text-white transition-all"
                            >
                              Read
                            </button>
                          </div>
                          <p className="text-xs text-slate-400 font-medium">{doc.category}</p>
                        </div>
                      </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Materials */}
            {searchQuery === '' && (
              <div className="space-y-6 mt-12">
                <div className="px-4 sm:px-6 flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-dark-surface dark:text-white tracking-tight">Trending materials</h3>
                  <button className="text-sm font-bold text-slate-400 hover:text-dark-surface dark:hover:text-white transition-colors">See all</button>
                </div>
                
                <div className="flex gap-5 overflow-x-auto px-4 sm:px-6 pb-4 scrollbar-hide">
                  {trendingMaterials.map((doc) => (
                      <motion.div
                        key={`trending-${doc.id}`}
                        whileHover={{ y: -5 }}
                        onClick={() => {
                          setReadingDoc(doc);
                          incrementViews(doc.id);
                        }}
                        className="w-72 sm:w-80 shrink-0 featured-card aspect-[16/10] relative overflow-hidden rounded-[2.5rem] cursor-pointer"
                      >
                        <img 
                          src={`https://picsum.photos/seed/trending-${doc.id}/600/400`} 
                          alt={doc.title}
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/20 to-transparent"></div>
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white flex items-center gap-1">
                            <Eye size={10} />
                            {doc.views || 0}
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTogglePin(doc.id);
                            }}
                            className={cn(
                              "p-2 rounded-xl transition-all shadow-lg",
                              profile?.pinnedDocIds?.includes(doc.id) 
                                ? "bg-brand-600 text-white" 
                                : "bg-white/20 text-white/70 hover:text-white"
                            )}
                          >
                            <Bookmark size={16} fill={profile?.pinnedDocIds?.includes(doc.id) ? "currentColor" : "none"} />
                          </button>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                          <div className="min-w-0">
                            <h4 className="text-lg font-display font-bold text-white truncate">{doc.title}</h4>
                            <div className="flex items-center gap-2 text-white/70 text-[10px] font-bold uppercase tracking-widest">
                              <span>{doc.category}</span>
                              <span>•</span>
                              <span>{doc.type}</span>
                            </div>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setReadingDoc(doc);
                              incrementViews(doc.id);
                            }}
                            className="px-4 py-2 bg-white text-brand-600 rounded-xl text-[10px] font-bold hover:bg-brand-600 hover:text-white transition-all shadow-lg shrink-0"
                          >
                            Read Now
                          </button>
                        </div>
                      </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Section */}
            <div className="px-4 sm:px-6 space-y-6 mt-12">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-display font-bold text-dark-surface dark:text-white tracking-tight">
                  {searchQuery ? 'Search Results' : 'Featured for you'}
                </h3>
                {!searchQuery && <button className="text-sm font-bold text-slate-400 hover:text-dark-surface dark:hover:text-white transition-colors">View all</button>}
              </div>

              {loading && documents.length === 0 ? (
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-[85%] sm:w-[45%] lg:w-[30%] shrink-0 aspect-[4/5] bg-slate-200 animate-pulse rounded-[2.5rem]"></div>
                  ))}
                </div>
              ) : filteredDocs.length === 0 ? (
                <div className="text-center py-12 glass-panel rounded-[2.5rem] space-y-4">
                  <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto">
                    <FileText size={32} />
                  </div>
                  <p className="text-slate-500 font-medium">
                    {selectedCategory === 'Pinned' ? "You haven't pinned any documents yet." : "No materials found"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 pb-8">
                  {filteredDocs.map((doc) => (
                    <motion.div
                      layout
                      key={`featured-${doc.id}`}
                      onClick={() => {
                        setReadingDoc(doc);
                        incrementViews(doc.id);
                      }}
                      className="featured-card aspect-[3/4] relative overflow-hidden rounded-[2rem] cursor-pointer"
                    >
                      <img 
                        src={`https://picsum.photos/seed/featured-${doc.id}/600/800`} 
                        alt={doc.title}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/30 to-transparent"></div>
                      
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white flex items-center gap-1">
                          <Eye size={10} />
                          {doc.views || 0}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePin(doc.id);
                          }}
                          className={cn(
                            "p-2 rounded-xl transition-all shadow-lg",
                            profile?.pinnedDocIds?.includes(doc.id) 
                              ? "bg-brand-600 text-white" 
                              : "bg-white/20 text-white/70 hover:text-white"
                          )}
                        >
                          <Bookmark size={16} fill={profile?.pinnedDocIds?.includes(doc.id) ? "currentColor" : "none"} />
                        </button>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 space-y-2">
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-display font-bold text-white leading-tight line-clamp-2">{doc.title}</h4>
                          <div className="flex items-center gap-1.5 text-white/70 text-[10px] font-medium">
                            <Compass size={10} />
                            <span className="uppercase tracking-wider font-bold">{doc.category}</span>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setReadingDoc(doc);
                            incrementViews(doc.id);
                          }}
                          className="w-full py-2 bg-white text-dark-surface rounded-xl font-bold text-[10px] shadow-xl shadow-brand-900/10 flex items-center justify-center gap-1 hover:scale-105 transition-transform"
                        >
                          Read Now
                          <ChevronRight size={10} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'marketplace' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 sm:px-6 space-y-8"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-display font-bold text-dark-surface dark:text-white tracking-tight">Marketplace</h1>
                <p className="text-slate-500 font-medium">Advertise your business or items for sale.</p>
              </div>
              <button 
                onClick={() => {
                  setEditingBusiness(null);
                  setBusinessFormData({
                    title: '',
                    description: '',
                    price: '',
                    category: 'General',
                    location: '',
                    contactPhone: '',
                  });
                  setIsBusinessModalOpen(true);
                }}
                className="w-14 h-14 bg-brand-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-brand-200 hover:scale-105 transition-transform"
              >
                <Plus size={28} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="px-0">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                <input 
                  type="text"
                  value={marketSearchQuery}
                  onChange={(e) => setMarketSearchQuery(e.target.value)}
                  placeholder="Search products, services, or categories..."
                  className="w-full pl-16 pr-6 py-5 bg-white dark:bg-slate-900 border-none rounded-[2rem] shadow-xl shadow-brand-900/5 focus:ring-4 focus:ring-brand-500/10 transition-all text-lg font-medium text-dark-surface dark:text-white"
                />
              </div>
            </div>

            {/* Safety Warning */}
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3 text-amber-800">
              <ShieldAlert className="shrink-0 mt-0.5" size={20} />
              <div className="space-y-1">
                <p className="text-sm font-bold">Safety First!</p>
                <p className="text-xs opacity-90">Never send money before meeting with the seller in a safe, public place. Verify items before payment.</p>
              </div>
            </div>

            {/* Marketplace Sections */}
            <div className="space-y-10 pb-8">
              {/* Recently Viewed */}
              {recentlyViewedBusinesses.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xl font-bold text-dark-surface dark:text-white">Recently Viewed</h3>
                    <button 
                      onClick={() => setRecentlyViewedBusinesses([])}
                      className="text-xs font-bold text-slate-400 hover:text-brand-600 transition-colors uppercase tracking-widest"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x">
                    {recentlyViewedBusinesses.map((business) => (
                      <div key={`recent-${business.id}`} className="min-w-[240px] max-w-[240px] snap-start">
                        <MarketCard business={business} onClick={() => handleViewBusiness(business)} compact />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Products */}
              {filteredMarketItems.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xl font-bold text-dark-surface dark:text-white">Trending Markets</h3>
                    <div className="flex items-center gap-1 text-brand-600">
                      <TrendingUp size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Hot Now</span>
                    </div>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x">
                    {filteredMarketItems.slice(0, 6).map((business) => (
                      <div key={`trending-${business.id}`} className="min-w-[240px] max-w-[240px] snap-start">
                        <MarketCard business={business} onClick={() => handleViewBusiness(business)} compact />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Products Grid */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-dark-surface dark:text-white px-1">All Products</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
                  {filteredMarketItems.length === 0 ? (
                    <div className="col-span-full text-center py-20 glass-panel rounded-[3rem] space-y-6">
                      <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-[2rem] flex items-center justify-center mx-auto">
                        <Store size={48} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-dark-surface dark:text-white">No listings found</h3>
                        <p className="text-slate-400 max-w-[200px] mx-auto text-sm">
                          {marketSearchQuery ? "Try adjusting your search terms." : "Be the first to advertise your business here!"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    filteredMarketItems.map((business) => (
                      <MarketCard 
                        key={business.id} 
                        business={business} 
                        onClick={() => handleViewBusiness(business)} 
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 sm:px-6 space-y-8"
          >
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-brand-50 rounded-[2.5rem] flex items-center justify-center mx-auto border-4 border-white shadow-xl relative overflow-hidden">
                  {profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover rounded-[2.5rem]" />
                  ) : (
                    <UserIcon className="text-brand-600" size={48} />
                  )}
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <CoolLoader size={32} />
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-0 right-0 p-3 bg-brand-600 text-white rounded-2xl shadow-lg border-4 border-white hover:scale-110 transition-all disabled:opacity-50"
                >
                  <Edit3 size={18} />
                </button>
                <input 
                  type="file"
                  ref={avatarInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-dark-surface dark:text-white">{profile?.displayName}</h2>
                <p className="text-slate-500 font-medium capitalize">{profile?.role} Account</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Personal Information</h3>
                <div className="glass-panel p-6 rounded-[2.5rem] space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                      <Mail size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                      <p className="font-bold text-dark-surface dark:text-white">{profile?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                      <Phone size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</p>
                      <p className="font-bold text-dark-surface dark:text-white">{profile?.phoneNumber || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Account Actions</h3>
                <div className="glass-panel p-6 rounded-[2.5rem] space-y-4">
                  <button 
                    onClick={() => setActiveTab('my-resources')}
                    className="w-full py-5 bg-brand-600 text-white rounded-[2rem] font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-brand-200"
                  >
                    <Package size={20} />
                    My Resources
                  </button>
                  <button 
                    onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                    className="w-full py-5 bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400 rounded-[2rem] font-bold transition-all flex items-center justify-center gap-3 border border-brand-100 dark:border-brand-500/20"
                  >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
                  </button>
                  <button 
                    onClick={() => signOut()}
                    className="w-full py-5 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-[2rem] font-bold transition-all flex items-center justify-center gap-3 border border-red-100 dark:border-red-500/20"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'my-resources' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 sm:px-6 space-y-8 pb-24"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-brand-600 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="space-y-1">
                  <h1 className="text-3xl font-display font-bold text-dark-surface dark:text-white tracking-tight">My Resources</h1>
                  <p className="text-slate-500 font-medium">Manage all your uploads in one place</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setEditingDoc(null);
                    setFormData({ title: '', description: '', type: 'pdf', url: '', category: 'General' });
                    setRestrictToPdf(true);
                    setIsAddModalOpen(true);
                  }}
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-brand-200 flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Document
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="glass-panel p-4 sm:p-6 rounded-[2.5rem] space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1 group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                  <input 
                    type="text"
                    placeholder="Search your resources..."
                    value={myDocsFilter.search}
                    onChange={(e) => setMyDocsFilter({...myDocsFilter, search: e.target.value})}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition-all"
                  />
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <select 
                    value={resourceTypeFilter}
                    onChange={(e) => setResourceTypeFilter(e.target.value as any)}
                    className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition-all text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none min-w-[140px]"
                  >
                    <option value="all">All Types</option>
                    <option value="documents">Documents</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="lostfound">Lost & Found</option>
                  </select>

                  <select 
                    value={myDocsFilter.status}
                    onChange={(e) => setMyDocsFilter({...myDocsFilter, status: e.target.value})}
                    className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition-all text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none min-w-[140px]"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Resource List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myFilteredResources.length === 0 ? (
                <div className="col-span-full text-center py-20 glass-panel rounded-[3rem] space-y-6">
                  <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 text-slate-300 rounded-[2rem] flex items-center justify-center mx-auto">
                    <Package size={48} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-dark-surface dark:text-white">No resources found</h3>
                    <p className="text-slate-400 max-w-[250px] mx-auto text-sm">
                      Try adjusting your filters or upload something new.
                    </p>
                  </div>
                </div>
              ) : (
                myFilteredResources.map((item, index) => (
                  <motion.div
                    key={`${item.resourceType}-${item.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-panel p-6 rounded-[2.5rem] space-y-4 group relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
                          item.resourceType === 'document' ? "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400" :
                          item.resourceType === 'marketplace' ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400" :
                          "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                        )}>
                          {item.resourceType === 'document' ? <FileText size={24} /> :
                           item.resourceType === 'marketplace' ? <Store size={24} /> :
                           <Package size={24} />}
                        </div>
                        <div>
                          <h3 className="font-bold text-dark-surface dark:text-white truncate max-w-[150px]">{item.title}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {item.resourceType === 'document' ? (item as any).category :
                             item.resourceType === 'marketplace' ? (item as any).category :
                             (item as any).type}
                          </p>
                        </div>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        item.status === 'approved' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400" :
                        item.status === 'pending' ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" :
                        "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                      )}>
                        {item.status}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Clock size={12} />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        {item.resourceType === 'document' && (
                          <button 
                            onClick={() => setReadingDoc(item as any)}
                            className="px-4 py-2 bg-brand-50 text-brand-600 rounded-xl text-xs font-bold hover:bg-brand-600 hover:text-white transition-all"
                          >
                            Read
                          </button>
                        )}
                        {(!(item.resourceType === 'document' && item.status === 'approved' && !isAdmin)) && (
                          <button 
                            onClick={() => {
                              if (item.resourceType === 'document') {
                                const doc = item as any;
                                setEditingDoc(doc);
                                setFormData({ title: doc.title, description: doc.description, type: doc.type, url: doc.url, category: doc.category });
                                setRestrictToPdf(false);
                                setIsAddModalOpen(true);
                              } else if (item.resourceType === 'marketplace') {
                                const biz = item as any;
                                setEditingBusiness(biz);
                                setBusinessFormData({ title: biz.title, description: biz.description, price: biz.price || '', category: biz.category, location: biz.location, contactPhone: biz.contactPhone });
                                setIsBusinessModalOpen(true);
                              } else {
                                const lf = item as any;
                                setEditingLostFound(lf);
                                setLostFoundFormData({ title: lf.title, description: lf.description, type: lf.type, location: lf.location, date: lf.date });
                                setIsLostFoundModalOpen(true);
                              }
                            }}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-brand-600 transition-all"
                          >
                            <Edit3 size={18} />
                          </button>
                        )}
                        {(!(item.resourceType === 'document' && item.status === 'approved' && !isAdmin)) && (
                          <button 
                            onClick={() => {
                              setConfirmModal({
                                isOpen: true,
                                title: 'Delete Resource',
                                message: 'Are you sure you want to delete this resource? This action cannot be undone.',
                                onConfirm: () => {
                                  if (item.resourceType === 'document') handleDeleteDocument(item.id);
                                  else if (item.resourceType === 'marketplace') handleDeleteBusiness(item.id);
                                  else handleDeleteLostFound(item.id);
                                },
                                type: 'danger'
                              });
                            }}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 sm:px-6 space-y-8 pb-24"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-display font-bold text-dark-surface dark:text-white tracking-tight">Notifications</h1>
                <p className="text-slate-500 font-medium">Stay updated with the latest activity</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleMarkAllAsRead}
                  className="p-3 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 text-sm font-bold"
                >
                  <CheckCheck size={18} />
                  <span className="hidden sm:inline">Mark all as read</span>
                </button>
                <button 
                  onClick={handleClearRead}
                  className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all flex items-center gap-2 text-sm font-bold"
                >
                  <Trash size={18} />
                  <span className="hidden sm:inline">Clear read</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {notifications.length > 0 ? (
                notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((notif) => (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "glass-panel p-6 rounded-[2.5rem] flex items-start gap-5 transition-all relative overflow-hidden group",
                      !notif.read ? "border-brand-200 dark:border-brand-500/30 bg-brand-50/30 dark:bg-brand-900/10" : "opacity-75"
                    )}
                  >
                    {!notif.read && (
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-600"></div>
                    )}
                    
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                      notif.type === 'info' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                      notif.type === 'warning' ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                    )}>
                      {notif.type === 'info' ? <Info size={28} /> : 
                       notif.type === 'warning' ? <AlertTriangle size={28} /> : 
                       <CheckCircle size={28} />}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className={cn(
                          "font-bold text-lg truncate",
                          !notif.read ? "text-dark-surface dark:text-white" : "text-slate-500 dark:text-slate-400"
                        )}>
                          {notif.title}
                        </h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 shrink-0">
                          <Clock size={12} />
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={cn(
                        "text-sm leading-relaxed",
                        !notif.read ? "text-slate-600 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"
                      )}>
                        {notif.message}
                      </p>
                      
                      <div className="pt-4 flex items-center gap-3">
                        {!notif.read && (
                          <button 
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                          >
                            Mark as read
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteNotification(notif.id)}
                          className="text-xs font-bold text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {notif.read && (
                      <div className="absolute top-6 right-6 text-slate-200 dark:text-slate-800">
                        <CheckCheck size={48} />
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-24 glass-panel rounded-[3rem] space-y-6">
                  <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200 dark:text-slate-800">
                    <Bell size={48} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-display font-bold text-dark-surface dark:text-white">All caught up!</h3>
                    <p className="text-slate-500 font-medium">You have no new notifications at the moment.</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'manage-docs' && isAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 sm:px-6 space-y-8 pb-24"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveTab('admin')}
                  className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-brand-600 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="space-y-1">
                  <h1 className="text-3xl font-display font-bold text-dark-surface dark:text-white tracking-tight">Manage Documents</h1>
                  <p className="text-slate-500 font-medium">View, edit, and delete all study materials</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  setEditingDoc(null);
                  setFormData({ title: '', description: '', type: 'pdf', url: '', category: 'General' });
                  setRestrictToPdf(false);
                  setIsAddModalOpen(true);
                }}
                className="px-6 py-3 bg-brand-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-brand-200 hover:scale-105 transition-all"
              >
                <Plus size={20} />
                Add Document
              </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total', value: documents.length, color: 'brand', icon: FileText },
                { label: 'Approved', value: documents.filter(d => d.status === 'approved').length, color: 'emerald', icon: CheckCircle },
                { label: 'Pending', value: documents.filter(d => d.status === 'pending').length, color: 'amber', icon: Clock },
                { label: 'Rejected', value: documents.filter(d => d.status === 'rejected').length, color: 'red', icon: ShieldAlert }
              ].map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel p-4 sm:p-6 rounded-[2rem] flex items-center gap-4"
                >
                  <div className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0",
                    stat.color === 'brand' ? "bg-brand-50 text-brand-600" :
                    stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                    stat.color === 'amber' ? "bg-amber-50 text-amber-600" :
                    "bg-red-50 text-red-600"
                  )}>
                    <stat.icon size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-display font-bold text-dark-surface dark:text-white">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Advanced Toolbar */}
            <div className="glass-panel p-4 sm:p-6 rounded-[2.5rem] space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1 group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                  <input 
                    type="text"
                    placeholder="Search by title or author..."
                    value={manageDocsFilter.search}
                    onChange={(e) => setManageDocsFilter({...manageDocsFilter, search: e.target.value})}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition-all"
                  />
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <select 
                    value={manageDocsFilter.status}
                    onChange={(e) => setManageDocsFilter({...manageDocsFilter, status: e.target.value})}
                    className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition-all text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none min-w-[140px]"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <select 
                    value={manageDocsFilter.category}
                    onChange={(e) => setManageDocsFilter({...manageDocsFilter, category: e.target.value})}
                    className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 transition-all text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none min-w-[140px]"
                  >
                    <option value="all">All Categories</option>
                    {Array.from(new Set(documents.map(d => d.category))).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  {selectedDocIds.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-900/20 rounded-2xl border border-brand-100 dark:border-brand-800"
                    >
                      <span className="text-xs font-bold text-brand-600 dark:text-brand-400 mr-2">{selectedDocIds.length} Selected</span>
                      <button 
                        onClick={() => handleBulkApprove('approved')}
                        className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-sm"
                        title="Bulk Approve"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button 
                        onClick={() => handleBulkApprove('rejected')}
                        className="p-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all shadow-sm"
                        title="Bulk Reject"
                      >
                        <X size={16} />
                      </button>
                      <button 
                        onClick={handleBulkDelete}
                        className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-sm"
                        title="Bulk Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Table View */}
            <div className="glass-panel overflow-hidden rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                      <th className="px-6 py-5 w-12">
                        <input 
                          type="checkbox"
                          checked={selectedDocIds.length === manageFilteredDocs.length && manageFilteredDocs.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDocIds(manageFilteredDocs.map(d => d.id));
                            } else {
                              setSelectedDocIds([]);
                            }
                          }}
                          className="w-5 h-5 rounded-lg border-slate-300 text-brand-600 focus:ring-brand-500 transition-all cursor-pointer"
                        />
                      </th>
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">Author</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden lg:table-cell">Category</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Status</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden xl:table-cell">Date</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                    {manageFilteredDocs.map((doc, index) => (
                      <motion.tr 
                        key={doc.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={cn(
                          "group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all",
                          selectedDocIds.includes(doc.id) ? "bg-brand-50/30 dark:bg-brand-900/10" : ""
                        )}
                      >
                        <td className="px-6 py-5">
                          <input 
                            type="checkbox"
                            checked={selectedDocIds.includes(doc.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDocIds([...selectedDocIds, doc.id]);
                              } else {
                                setSelectedDocIds(selectedDocIds.filter(id => id !== doc.id));
                              }
                            }}
                            className="w-5 h-5 rounded-lg border-slate-300 text-brand-600 focus:ring-brand-500 transition-all cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-brand-600 shadow-sm border border-slate-100 dark:border-slate-700">
                              <FileText size={20} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-dark-surface dark:text-white truncate max-w-[200px]">{doc.title}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.type.toUpperCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 font-bold text-[10px]">
                              {(doc.authorName || 'U')[0]}
                            </div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{doc.authorName || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 hidden lg:table-cell">
                          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {doc.category}
                          </span>
                        </td>
                        <td className="px-6 py-5 hidden md:table-cell">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5",
                            doc.status === 'approved' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400" :
                            doc.status === 'pending' ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" :
                            "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                          )}>
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              doc.status === 'approved' ? "bg-emerald-500" :
                              doc.status === 'pending' ? "bg-amber-500" :
                              "bg-red-500"
                            )} />
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 hidden xl:table-cell">
                          <p className="text-xs text-slate-500 font-medium">{new Date(doc.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => setReadingDoc(doc)}
                              title="Read"
                              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-brand-600 transition-all"
                            >
                              <BookOpen size={18} />
                            </button>
                            <button 
                              onClick={() => {
                                setEditingDoc(doc);
                                setRestrictToPdf(false);
                                setIsAddModalOpen(true);
                              }}
                              title="Edit"
                              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-brand-600 transition-all"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button 
                              onClick={() => setConfirmModal({
                              isOpen: true,
                              title: 'Delete Document',
                              message: 'Are you sure you want to delete this document?',
                              onConfirm: () => handleDelete(doc.id),
                              type: 'danger'
                            })}
                              title="Delete"
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-500 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {manageFilteredDocs.length === 0 && (
                <div className="text-center py-24 space-y-4">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto text-slate-300">
                    <FileText size={40} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-display font-bold text-dark-surface dark:text-white">No documents found</h3>
                    <p className="text-slate-500 font-medium">Try adjusting your filters or search query.</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && isAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 sm:px-6 space-y-8 pb-24"
          >
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab('admin')}
                className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-brand-600 transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="space-y-1">
                <h1 className="text-3xl font-display font-bold text-dark-surface dark:text-white tracking-tight">User Management</h1>
                <p className="text-slate-500 font-medium">Manage user accounts, roles, and status</p>
              </div>
            </div>

            <div className="glass-panel overflow-hidden rounded-[2.5rem]">
              {/* Mobile View: Card List */}
              <div className="block sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <div key={u.uid} className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center text-brand-600 font-bold text-xl">
                          {(u.displayName || 'U')[0]}
                        </div>
                        <div>
                          <p className="font-bold text-dark-surface dark:text-white">{u.displayName || 'User'}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          u.role === 'admin' ? "bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        )}>
                          {u.role}
                        </span>
                        <span className={cn(
                          "flex items-center gap-1.5 text-[10px] font-bold uppercase",
                          u.status === 'active' ? "text-emerald-500" : "text-red-500"
                        )}>
                          <div className={cn("w-1.5 h-1.5 rounded-full", u.status === 'active' ? "bg-emerald-500" : "bg-red-500")} />
                          {u.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Joined {new Date(u.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handlePromoteUser(u.uid)}
                          className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl text-brand-600 dark:text-brand-400 transition-all active:scale-95"
                        >
                          {u.role === 'admin' ? <Shield size={20} /> : <UserPlus size={20} />}
                        </button>
                        <button 
                          onClick={() => handleSuspendUser(u.uid)}
                          className={cn(
                            "p-3 rounded-xl transition-all active:scale-95",
                            u.status === 'active' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                          )}
                        >
                          <Ban size={20} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u.uid)}
                          className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 transition-all active:scale-95"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                    {users.map((u) => (
                      <tr key={u.uid} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/20 rounded-xl flex items-center justify-center text-brand-600 font-bold">
                              {(u.displayName || 'U')[0]}
                            </div>
                            <div>
                              <p className="font-bold text-dark-surface dark:text-white">{u.displayName || 'User'}</p>
                              <p className="text-xs text-slate-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            u.role === 'admin' ? "bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          )}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={cn(
                            "flex items-center gap-1.5 text-xs font-bold",
                            u.status === 'active' ? "text-emerald-500" : "text-red-500"
                          )}>
                            <div className={cn("w-1.5 h-1.5 rounded-full", u.status === 'active' ? "bg-emerald-500" : "bg-red-500")} />
                            {u.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-xs text-slate-500 font-medium">{new Date(u.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handlePromoteUser(u.uid)}
                              title={u.role === 'admin' ? "Demote to Student" : "Promote to Admin"}
                              className="p-2 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg text-brand-600 dark:text-brand-400 transition-colors"
                            >
                              {u.role === 'admin' ? <Shield size={18} /> : <UserPlus size={18} />}
                            </button>
                            <button 
                              onClick={() => handleSuspendUser(u.uid)}
                              title={u.status === 'active' ? "Suspend User" : "Activate User"}
                              className={cn(
                                "p-2 rounded-lg transition-colors",
                                u.status === 'active' ? "hover:bg-amber-50 text-amber-600" : "hover:bg-emerald-50 text-emerald-600"
                              )}
                            >
                              <Ban size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u.uid)}
                              title="Delete User"
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'admin' && isAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 sm:px-6 space-y-8"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-display font-bold text-dark-surface dark:text-white tracking-tight">Admin Dashboard</h1>
                <p className="text-slate-500 font-medium">Manage platform activity and users</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <button 
                onClick={() => setActiveTab('manage-notifications')}
                className="p-4 sm:p-6 glass-panel rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center gap-2 sm:gap-3 text-amber-600 hover:bg-amber-50 transition-colors"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <Bell size={20} className="sm:w-6 sm:h-6" />
                </div>
                <span className="font-bold text-[10px] sm:text-xs text-center">Manage Notifications</span>
              </button>
              <button 
                onClick={() => setActiveTab('manage-lostfound')}
                className="p-4 sm:p-6 glass-panel rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center gap-2 sm:gap-3 text-emerald-600 hover:bg-emerald-50 transition-colors"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <Package size={20} className="sm:w-6 sm:h-6" />
                </div>
                <span className="font-bold text-[10px] sm:text-xs text-center">Manage Lost & Found</span>
              </button>
              <button 
                onClick={() => setActiveTab('manage-marketplace')}
                className="p-4 sm:p-6 glass-panel rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center gap-2 sm:gap-3 text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <Store size={20} className="sm:w-6 sm:h-6" />
                </div>
                <span className="font-bold text-[10px] sm:text-xs text-center">Manage Marketplace</span>
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className="p-4 sm:p-6 glass-panel rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center gap-2 sm:gap-3 text-brand-600 hover:bg-brand-50 transition-colors"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <Users size={20} className="sm:w-6 sm:h-6" />
                </div>
                <span className="font-bold text-[10px] sm:text-xs text-center">Manage Users</span>
              </button>
              <button 
                onClick={() => setActiveTab('manage-docs')}
                className="p-4 sm:p-6 glass-panel rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center gap-2 sm:gap-3 text-brand-600 hover:bg-brand-50 transition-colors"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <FileText size={20} className="sm:w-6 sm:h-6" />
                </div>
                <span className="font-bold text-[10px] sm:text-xs text-center">Manage Documents</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-display font-bold text-dark-surface dark:text-white tracking-tight">Pending Approvals</h3>
                  <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {lostFoundItems.filter(i => i.status === 'pending').length + businessListings.filter(b => b.status === 'pending').length + documents.filter(d => d.status === 'pending').length} Total
                  </span>
                </div>
                <div className="space-y-4">
                  {/* Documents */}
                  {documents.filter(doc => doc.status === 'pending').map(doc => (
                    <div key={`pending-doc-${doc.id}`} className="glass-panel p-6 rounded-[2rem] space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <FileText size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-dark-surface dark:text-white">{doc.title}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document • {doc.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleApproveDocument(doc.id, 'approved')}
                            className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleApproveDocument(doc.id, 'rejected')}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">{doc.description}</p>
                    </div>
                  ))}

                  {/* Lost & Found */}
                  {lostFoundItems.filter(item => item.status === 'pending').map(item => (
                    <div key={`pending-lf-${item.id}`} className="glass-panel p-6 rounded-[2rem] space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            item.type === 'lost' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                          )}>
                            <Package size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-dark-surface dark:text-white">{item.title}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lost & Found • {item.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleApproveLostFound(item.id, 'approved')}
                            className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleApproveLostFound(item.id, 'rejected')}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                      {item.imageUrl && (
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-50">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
                    </div>
                  ))}

                  {/* Businesses */}
                  {businessListings.filter(b => b.status === 'pending').map(business => (
                    <div key={`pending-biz-${business.id}`} className="glass-panel p-6 rounded-[2rem] space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                            <Store size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-dark-surface dark:text-white">{business.title}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business • {business.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleApproveBusiness(business.id, 'approved')}
                            className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleApproveBusiness(business.id, 'rejected')}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                      {business.imageUrls?.length > 0 && (
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-50">
                          <img 
                            src={business.imageUrls[0]} 
                            alt={business.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <p className="text-sm text-slate-600 line-clamp-2">{business.description}</p>
                      {business.price && <p className="text-sm font-bold text-brand-600">{business.price}</p>}
                    </div>
                  ))}

                  {lostFoundItems.filter(item => item.status === 'pending').length === 0 && 
                   businessListings.filter(b => b.status === 'pending').length === 0 && 
                   documents.filter(d => d.status === 'pending').length === 0 && (
                    <p className="text-sm text-slate-400 font-medium italic ml-1">No pending approvals.</p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-display font-bold text-dark-surface dark:text-white tracking-tight">Active Notifications</h3>
                <div className="space-y-4">
                  {notifications.map(notif => (
                    <div key={notif.id} className="glass-panel p-6 rounded-[2rem] flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          notif.type === 'info' ? "bg-blue-100 text-blue-600" :
                          notif.type === 'warning' ? "bg-amber-100 text-amber-600" :
                          "bg-emerald-100 text-emerald-600"
                        )}>
                          <Bell size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-dark-surface dark:text-white">{notif.title}</h4>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-slate-500 line-clamp-1">{notif.message}</p>
                            <span className={cn(
                              "text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter",
                              notif.showOnHome ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                            )}>
                              {notif.showOnHome ? 'Home' : 'Private'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setEditingNotification(notif);
                            setNotificationFormData({
                              title: notif.title,
                              message: notif.message,
                              type: notif.type,
                              active: notif.active,
                              showOnHome: notif.showOnHome || false,
                              userId: notif.userId || ''
                            });
                            setIsNotificationModalOpen(true);
                          }}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => setNotifications(notifications.filter(n => n.id !== notif.id))}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'manage-notifications' && isAdmin && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-4 sm:px-6 space-y-8 pb-24"
          >
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab('admin')}
                className="p-3 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="space-y-1">
                <h1 className="text-3xl font-display font-bold text-dark-surface dark:text-white tracking-tight">Manage Notifications</h1>
                <p className="text-slate-500 font-medium">Create and manage platform-wide alerts</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => {
                  setEditingNotification(null);
                  setNotificationFormData({ title: '', message: '', type: 'info', active: true, showOnHome: false });
                  setIsNotificationModalOpen(true);
                }}
                className="px-6 py-3 bg-brand-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-brand-200 hover:scale-105 transition-all"
              >
                <Plus size={20} />
                Add Notification
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {notifications.map(notif => (
                <div key={notif.id} className="glass-panel p-6 rounded-[2.5rem] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center",
                      notif.type === 'info' ? "bg-blue-100 text-blue-600" :
                      notif.type === 'warning' ? "bg-amber-100 text-amber-600" :
                      "bg-emerald-100 text-emerald-600"
                    )}>
                      <Bell size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-dark-surface dark:text-white">{notif.title}</h4>
                      <p className="text-sm text-slate-500">{notif.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest",
                          notif.active ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                        )}>
                          {notif.active ? 'Active' : 'Inactive'}
                        </span>
                        {notif.showOnHome && (
                          <span className="text-[10px] px-2 py-0.5 bg-brand-100 text-brand-600 rounded-full font-bold uppercase tracking-widest">
                            Home
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setEditingNotification(notif);
                        setNotificationFormData({
                          title: notif.title,
                          message: notif.message,
                          type: notif.type,
                          active: notif.active,
                          showOnHome: notif.showOnHome || false
                        });
                        setIsNotificationModalOpen(true);
                      }}
                      className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button 
                      onClick={() => handleDeleteNotification(notif.id)}
                      className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'manage-lostfound' && isAdmin && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-4 sm:px-6 space-y-8 pb-24"
          >
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab('admin')}
                className="p-3 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="space-y-1">
                <h1 className="text-3xl font-display font-bold text-dark-surface dark:text-white tracking-tight">Manage Lost & Found</h1>
                <p className="text-slate-500 font-medium">Approve and manage lost and found items</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => {
                  setEditingLostFound(null);
                  setLostFoundFormData({
                    title: '',
                    description: '',
                    type: 'lost',
                    location: '',
                    date: new Date().toISOString().split('T')[0],
                  });
                  setIsLostFoundModalOpen(true);
                }}
                className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-200 hover:scale-105 transition-all"
              >
                <Plus size={20} />
                Add Item
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {lostFoundItems.map(item => (
                <div key={item.id} className="glass-panel p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0",
                      item.type === 'lost' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                    )}>
                      <Package size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-base sm:text-lg text-dark-surface dark:text-white truncate">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-500 truncate">{item.location} • {item.date}</p>
                      <div className="flex items-center gap-2 sm:gap-3 mt-1">
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest",
                          item.status === 'approved' ? "bg-emerald-100 text-emerald-600" :
                          item.status === 'pending' ? "bg-amber-100 text-amber-600" :
                          "bg-red-100 text-red-600"
                        )}>
                          {item.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">By {item.authorName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleApproveLostFound(item.id, 'approved')}
                          className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                          title="Approve"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button 
                          onClick={() => handleApproveLostFound(item.id, 'rejected')}
                          className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                          title="Reject"
                        >
                          <X size={20} />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => {
                        setEditingLostFound(item);
                        setLostFoundFormData({
                          title: item.title,
                          description: item.description,
                          type: item.type,
                          location: item.location,
                          date: item.date,
                        });
                        setIsLostFoundModalOpen(true);
                      }}
                      className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button 
                      onClick={() => setConfirmModal({
                        isOpen: true,
                        title: 'Delete Item',
                        message: 'Are you sure you want to delete this lost/found item?',
                        onConfirm: () => handleDeleteLostFound(item.id),
                        type: 'danger'
                      })}
                      className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'manage-marketplace' && isAdmin && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-4 sm:px-6 space-y-8 pb-24"
          >
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab('admin')}
                className="p-3 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="space-y-1">
                <h1 className="text-3xl font-display font-bold text-dark-surface dark:text-white tracking-tight">Manage Marketplace</h1>
                <p className="text-slate-500 font-medium">Approve and manage business listings</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => {
                  setEditingBusiness(null);
                  setBusinessFormData({
                    title: '',
                    description: '',
                    price: '',
                    category: 'General',
                    location: '',
                    contactPhone: '',
                  });
                  setIsBusinessModalOpen(true);
                }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 hover:scale-105 transition-all"
              >
                <Plus size={20} />
                Add Business
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {businessListings.map(business => (
                <div key={business.id} className="glass-panel p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 text-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                      <Store size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-base sm:text-lg text-dark-surface dark:text-white truncate">{business.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-500 truncate">{business.category} • {business.price || 'No price'}</p>
                      <div className="flex items-center gap-2 sm:gap-3 mt-1">
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest",
                          business.status === 'approved' ? "bg-emerald-100 text-emerald-600" :
                          business.status === 'pending' ? "bg-amber-100 text-amber-600" :
                          "bg-red-100 text-red-600"
                        )}>
                          {business.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">By {business.authorName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {business.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleApproveBusiness(business.id, 'approved')}
                          className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                          title="Approve"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button 
                          onClick={() => handleApproveBusiness(business.id, 'rejected')}
                          className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                          title="Reject"
                        >
                          <X size={20} />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => {
                        setEditingBusiness(business);
                        setBusinessFormData({
                          title: business.title,
                          description: business.description,
                          price: business.price || '',
                          category: business.category,
                          location: business.location,
                          contactPhone: business.contactPhone,
                        });
                        setIsBusinessModalOpen(true);
                      }}
                      className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button 
                      onClick={() => handleDeleteBusiness(business.id)}
                      className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'lostfound' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 sm:px-6 space-y-8"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-dark-surface dark:text-white tracking-tight">Lost & Found</h1>
                <p className="text-slate-500 font-medium">Help others find their belongings.</p>
              </div>
              <button 
                onClick={() => {
                  setEditingLostFound(null);
                  setLostFoundFormData({
                    title: '',
                    description: '',
                    type: 'lost',
                    location: '',
                    date: new Date().toISOString().split('T')[0],
                  });
                  setIsLostFoundModalOpen(true);
                }}
                className="w-14 h-14 bg-brand-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-brand-200 hover:scale-105 transition-transform"
              >
                <Plus size={28} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="px-0">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                <input 
                  type="text"
                  value={lostFoundSearchQuery}
                  onChange={(e) => setLostFoundSearchQuery(e.target.value)}
                  placeholder="Search for lost or found items, locations..."
                  className="w-full pl-16 pr-6 py-5 bg-white dark:bg-slate-900 border-none rounded-[2rem] shadow-xl shadow-brand-900/5 focus:ring-4 focus:ring-brand-500/10 transition-all text-lg font-medium text-dark-surface dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {filteredLostFoundItems.length === 0 ? (
                <div className="col-span-full text-center py-20 glass-panel rounded-[3rem] space-y-6">
                  <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-[2rem] flex items-center justify-center mx-auto">
                    <Package size={48} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-dark-surface dark:text-white">No items found</h3>
                    <p className="text-slate-400 max-w-[200px] mx-auto text-sm">
                      {lostFoundSearchQuery ? "Try adjusting your search terms." : "Be the first to post a lost or found item."}
                    </p>
                  </div>
                </div>
              ) : (
                filteredLostFoundItems.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => setPreviewLostFound(item)}
                    className="glass-panel p-3 sm:p-6 rounded-2xl sm:rounded-[2.5rem] space-y-3 sm:space-y-4 flex flex-col cursor-pointer hover:shadow-2xl hover:shadow-brand-500/10 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className={cn(
                          "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0",
                          item.type === 'lost' ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                        )}>
                          <Package size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <div className="min-w-0">
                          <span className={cn(
                            "text-[8px] sm:text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md",
                            item.type === 'lost' ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          )}>
                            {item.type}
                          </span>
                          <h3 className="text-sm sm:text-xl font-bold text-dark-surface dark:text-white mt-0.5 sm:mt-1 line-clamp-1">{item.title}</h3>
                        </div>
                      </div>
                    </div>
                    {item.imageUrl && (
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <p className="text-xs sm:text-slate-600 leading-relaxed line-clamp-2 sm:line-clamp-3 flex-1">{item.description}</p>
                    <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-2 sm:gap-4 pt-2">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500">
                        <MapPin size={14} className="sm:w-4 sm:h-4" />
                        <span className="text-[10px] sm:text-sm font-medium truncate">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500">
                        <Calendar size={14} className="sm:w-4 sm:h-4" />
                        <span className="text-[10px] sm:text-sm font-medium">{format(new Date(item.date), 'MMM d')}</span>
                      </div>
                    </div>
                    <div className="pt-3 sm:pt-4 border-t border-slate-100 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                          <UserIcon size={12} className="sm:w-3.5 sm:h-3.5" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold text-slate-500 truncate max-w-[60px] sm:max-w-[80px]">{item.authorName}</span>
                      </div>
                      {item.authorPhone && (
                        <a 
                          href={`tel:${item.authorPhone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 sm:gap-2 text-brand-600 font-bold text-[10px] sm:text-sm"
                        >
                          <Phone size={14} className="sm:w-4 sm:h-4" />
                          Contact
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav-container lg:hidden">
        <button 
          onClick={() => setActiveTab('home')}
          className={cn("bottom-nav-item", activeTab === 'home' ? "active" : "")}
        >
          <Home size={22} />
          <span>Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('marketplace')}
          className={cn("bottom-nav-item", activeTab === 'marketplace' ? "active" : "")}
        >
          <ShoppingBag size={22} />
          <span>Market</span>
        </button>
        <button 
          onClick={() => setActiveTab('lostfound')}
          className={cn("bottom-nav-item", activeTab === 'lostfound' ? "active" : "")}
        >
          <Package size={22} />
          <span>Lost</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={cn("bottom-nav-item", activeTab === 'profile' ? "active" : "")}
        >
          <UserIcon size={22} />
          <span>Profile</span>
        </button>
        {isAdmin && (
          <button 
            onClick={() => setActiveTab('admin')}
            className={cn("bottom-nav-item", activeTab === 'admin' ? "active" : "")}
          >
            <Settings size={22} />
            <span>Admin</span>
          </button>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAddModalOpen(false);
                setRestrictToPdf(false);
              }}
              className="absolute inset-0 bg-dark-surface/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-lg bg-white rounded-t-[3rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-dark-surface">
                  {editingDoc ? 'Edit Material' : 'New Material'}
                </h2>
                <button onClick={() => {
                  setIsAddModalOpen(false);
                  setRestrictToPdf(false);
                }} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddDocument} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Title</label>
                  <input 
                    required={!editingDoc && selectedFiles.length > 1 ? false : true}
                    disabled={!editingDoc && selectedFiles.length > 1}
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder={!editingDoc && selectedFiles.length > 1 ? "Titles will be set from filenames" : "Calculus II Notes"}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-dark-surface/5 transition-all text-lg disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Type</label>
                    <select 
                      value={formData.type}
                      disabled={restrictToPdf}
                      onChange={e => setFormData({...formData, type: e.target.value as 'pdf' | 'docx'})}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-dark-surface/5 transition-all disabled:opacity-50"
                    >
                      <option value="pdf">PDF</option>
                      {!restrictToPdf && <option value="docx">DOCX</option>}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Category</label>
                    <input 
                      required
                      type="text"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      placeholder="Math"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-dark-surface/5 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Document File(s)</label>
                  <div className="relative">
                    <input 
                      type="file"
                      accept={restrictToPdf ? ".pdf" : ".pdf,.docx"}
                      multiple={!editingDoc}
                      onChange={e => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) {
                          setSelectedFiles(files);
                          
                          // If single file, auto-fill title
                          if (files.length === 1) {
                            const file = files[0] as File;
                            setFormData(prev => ({
                              ...prev, 
                              title: file.name.split('.')[0],
                              type: (file.name.split('.').pop()?.toLowerCase() === 'docx' ? 'docx' : 'pdf') as 'pdf' | 'docx'
                            }));
                          } else {
                            // Multiple files: clear title as it will be automatic
                            setFormData(prev => ({...prev, title: ''}));
                          }
                        }
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <label 
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full px-6 py-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-slate-100 hover:border-brand-300 transition-all group"
                    >
                      {selectedFiles.length > 0 ? (
                        <div className="space-y-4 w-full">
                          <div className="flex items-center justify-center gap-3 text-brand-600">
                            <FileText size={32} />
                            <span className="font-bold text-lg">{selectedFiles.length} file(s) selected</span>
                          </div>
                          <div className="max-h-32 overflow-y-auto space-y-2 px-4">
                            {selectedFiles.map((file, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate max-w-[200px]">{file.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                  {!isUploading && (
                                    <button 
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
                                      }}
                                      className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all"
                                    >
                                      <X size={14} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="text-brand-600" size={32} />
                          </div>
                          <p className="font-bold text-dark-surface">Choose file(s)</p>
                          <p className="text-sm text-slate-400">{restrictToPdf ? "PDF only" : "PDF or DOCX"} up to 10MB each</p>
                        </>
                      )}
                    </label>
                  </div>
                  {editingDoc && selectedFiles.length === 0 && (
                    <p className="text-xs text-slate-400 ml-1 italic">Leave empty to keep existing file</p>
                  )}
                </div>

                {!isAdmin && (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                    <ShieldAlert className="text-amber-600 shrink-0" size={18} />
                    <p className="text-xs text-amber-800 font-medium leading-relaxed">
                      Your submission will be reviewed by an administrator before it becomes visible to other users.
                    </p>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-5 bg-dark-surface hover:bg-black disabled:bg-slate-400 text-white rounded-[2rem] font-bold transition-all shadow-xl flex items-center justify-center gap-3 text-lg"
                >
                  {isUploading ? (
                    <div className="flex items-center gap-3">
                      <CoolLoader size={32} />
                      <span className="font-display">
                        {uploadProgress ? `Uploading ${uploadProgress.current}/${uploadProgress.total}` : 'Uploading...'}
                      </span>
                    </div>
                  ) : (
                    <>
                      {editingDoc ? <Edit3 size={24} /> : <Plus size={24} />}
                      {editingDoc ? 'Update' : 'Publish'}
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Business Preview Modal */}
      <AnimatePresence>
        {previewBusiness && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewBusiness(null)}
              className="absolute inset-0 bg-dark-surface/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-6 sm:px-8 py-4 sm:py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0">
                    <Store size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-display font-bold text-dark-surface dark:text-white leading-tight truncate max-w-[150px] sm:max-w-md">{previewBusiness.title}</h3>
                    <p className="text-[10px] sm:text-sm text-slate-400 font-medium">{previewBusiness.category} • {previewBusiness.price || 'Contact for Price'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setPreviewBusiness(null)}
                  className="p-2 sm:p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors text-slate-400 hover:text-dark-surface dark:hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
                {/* Image Carousel */}
                <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-slate-900 group">
                  {previewBusiness.imageUrls.length > 0 ? (
                    <div className="w-full h-full flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                      {previewBusiness.imageUrls.map((url, idx) => (
                        <div key={idx} className="w-full h-full shrink-0 flex items-center justify-center bg-slate-900">
                          <img 
                            src={url} 
                            alt={`${previewBusiness.title} - ${idx + 1}`}
                            className="max-w-full max-h-full object-contain cursor-pointer"
                            onClick={() => setFullscreenImage(url)}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                      <Store size={64} />
                    </div>
                  )}

                  {previewBusiness.imageUrls.length > 0 && (
                    <button 
                      onClick={() => setFullscreenImage(previewBusiness.imageUrls[currentImageIndex])}
                      className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                    >
                      <Maximize2 size={20} />
                    </button>
                  )}

                  {previewBusiness.imageUrls.length > 1 && (
                    <>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(prev => prev === 0 ? previewBusiness.imageUrls.length - 1 : prev - 1);
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(prev => prev === previewBusiness.imageUrls.length - 1 ? 0 : prev + 1);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight size={20} />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {previewBusiness.imageUrls.map((_, idx) => (
                          <div 
                            key={idx}
                            className={cn(
                              "w-2 h-2 rounded-full transition-all",
                              currentImageIndex === idx ? "bg-white w-6" : "bg-white/50"
                            )}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-dark-surface dark:text-white">Description</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                        <Eye size={16} />
                        <span className="text-sm font-bold">{previewBusiness.viewedBy?.length || 0} Views</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin size={16} />
                        <span className="text-sm font-medium">{previewBusiness.location}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                    {previewBusiness.description}
                  </p>
                </div>

                {/* Seller Info */}
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm">
                      <UserIcon size={24} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Seller</p>
                      <p className="font-bold text-dark-surface dark:text-white">{previewBusiness.authorName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Listed On</p>
                    <p className="font-bold text-dark-surface dark:text-white">{new Date(previewBusiness.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 shrink-0">
                <a 
                  href={`tel:${previewBusiness.contactPhone}`}
                  className="w-full py-5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-brand-200 flex items-center justify-center gap-3 text-lg"
                >
                  <Phone size={24} />
                  Contact Seller
                </a>
              </div>
            </motion.div>
          </div>
        )}

        {previewLostFound && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewLostFound(null)}
              className="absolute inset-0 bg-dark-surface/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-6 sm:px-8 py-4 sm:py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0",
                    previewLostFound.type === 'lost' ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                  )}>
                    <Package size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-display font-bold text-dark-surface dark:text-white leading-tight truncate max-w-[150px] sm:max-w-md">{previewLostFound.title}</h3>
                    <p className="text-[10px] sm:text-sm text-slate-400 font-medium capitalize">{previewLostFound.type} Item • {previewLostFound.location}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setPreviewLostFound(null)}
                  className="p-2 sm:p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors text-slate-400 hover:text-dark-surface dark:hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
                {/* Image */}
                {previewLostFound.imageUrl ? (
                  <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-800 group cursor-pointer" onClick={() => setFullscreenImage(previewLostFound.imageUrl!)}>
                    <img 
                      src={previewLostFound.imageUrl} 
                      alt={previewLostFound.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Maximize2 className="text-white" size={32} />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 space-y-4">
                    <ImageIcon size={64} />
                    <p className="font-medium">No image provided</p>
                  </div>
                )}

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                      <MapPin size={16} />
                      <span className="text-sm font-bold">{previewLostFound.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                      <Calendar size={16} />
                      <span className="text-sm font-bold">{format(new Date(previewLostFound.date), 'MMMM d, yyyy')}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-dark-surface dark:text-white">Description</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                      {previewLostFound.description}
                    </p>
                  </div>
                </div>

                {/* Author Info */}
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm">
                      <UserIcon size={24} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Posted By</p>
                      <p className="font-bold text-dark-surface dark:text-white">{previewLostFound.authorName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Posted On</p>
                    <p className="font-bold text-dark-surface dark:text-white">{new Date(previewLostFound.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 shrink-0">
                {previewLostFound.authorPhone && (
                  <a 
                    href={`tel:${previewLostFound.authorPhone}`}
                    className="w-full py-5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-brand-200 flex items-center justify-center gap-3 text-lg"
                  >
                    <Phone size={24} />
                    Contact Finder/Owner
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Business Listing Modal */}
      <AnimatePresence>
        {isBusinessModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBusinessModalOpen(false)}
              className="absolute inset-0 bg-dark-surface/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-lg bg-white rounded-t-[3rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <Store size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-dark-surface">
                      {editingBusiness ? 'Edit Listing' : 'Add Listing'}
                    </h2>
                    <p className="text-slate-400 text-sm">Advertise your business</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsBusinessModalOpen(false)}
                  className="p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddBusiness} className="space-y-6 max-h-[60vh] overflow-y-auto px-1">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Business/Item Title</label>
                  <input 
                    required
                    type="text"
                    value={businessFormData.title}
                    onChange={e => setBusinessFormData({...businessFormData, title: e.target.value})}
                    placeholder="e.g. HarMoTech Web Services"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Price (Optional)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text"
                        value={businessFormData.price}
                        onChange={e => setBusinessFormData({...businessFormData, price: e.target.value})}
                        placeholder="e.g. $50 or Negotiable"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select 
                        value={businessFormData.category}
                        onChange={e => setBusinessFormData({...businessFormData, category: e.target.value})}
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                      >
                        <option value="General">General</option>
                        <option value="Services">Services</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Food">Food</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Education">Education</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    required
                    value={businessFormData.description}
                    onChange={e => setBusinessFormData({...businessFormData, description: e.target.value})}
                    placeholder="Describe your business or item..."
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all min-h-[120px] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required
                        type="text"
                        value={businessFormData.location}
                        onChange={e => setBusinessFormData({...businessFormData, location: e.target.value})}
                        placeholder="e.g. Main Campus"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required
                        type="tel"
                        value={businessFormData.contactPhone}
                        onChange={e => setBusinessFormData({...businessFormData, contactPhone: e.target.value})}
                        placeholder="e.g. +123456789"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Images (1-2)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all">
                      <ImageIcon className="text-slate-400 mb-1" size={20} />
                      <span className="text-[10px] font-bold text-slate-400">Add</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files) {
                            const files = Array.from(e.target.files).slice(0, 2);
                            setSelectedBusinessImages(files);
                          }
                        }}
                      />
                    </label>
                    {selectedBusinessImages.map((file, i) => (
                      <div key={i} className="aspect-square bg-slate-100 rounded-2xl overflow-hidden relative">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                        />
                        <button 
                          type="button"
                          onClick={() => setSelectedBusinessImages(selectedBusinessImages.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow-lg"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium italic">Max 2 images. First image will be the cover.</p>
                </div>

                <div className="pt-4">
                  <button 
                    disabled={isUploadingBusiness}
                    type="submit"
                    className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-bold shadow-xl shadow-indigo-200 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {isUploadingBusiness ? (
                      <CoolLoader size={32} />
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        {editingBusiness ? 'Update Listing' : 'Submit for Approval'}
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 font-medium mt-4">
                    Your listing will be reviewed by an admin before it goes live.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Direct Document Viewer Modal */}
      <AnimatePresence>
        {readingDoc && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex flex-col"
          >
            {/* Minimal Header */}
            <div className="h-20 flex items-center justify-between px-6 sm:px-10 shrink-0">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20 shrink-0">
                  <FileText size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-white text-lg font-display font-bold truncate max-w-[200px] sm:max-w-xl">{readingDoc.title}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{readingDoc.type.toUpperCase()} • {readingDoc.category}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <a 
                  href={readingDoc.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/10"
                >
                  <ExternalLink size={16} />
                  Open Native
                </a>
                <button 
                  onClick={() => setReadingDoc(null)}
                  className="w-12 h-12 flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all border border-red-500/20"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Viewer Content */}
            <div className="flex-1 p-4 sm:p-6 sm:pt-0">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                {isReaderLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10">
                    <div className="w-16 h-16 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-6" />
                    <p className="text-slate-400 font-bold tracking-widest uppercase text-xs animate-pulse">Initializing Viewer</p>
                  </div>
                )}
                <iframe 
                  src={readingDoc.type === 'pdf' 
                    ? `${readingDoc.url}#view=FitH&scrollbar=1&toolbar=1` 
                    : `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(readingDoc.url)}`
                  }
                  className="w-full h-full border-none"
                  title={readingDoc.title}
                  onLoad={() => setIsReaderLoading(false)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Notification Modal */}
      <AnimatePresence>
        {isNotificationModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotificationModalOpen(false)}
              className="absolute inset-0 bg-dark-surface/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-lg bg-white rounded-t-[3rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-dark-surface">
                  {editingNotification ? 'Edit Notification' : 'New Notification'}
                </h2>
                <button onClick={() => setIsNotificationModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddNotification} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Title</label>
                  <input 
                    required
                    type="text"
                    value={notificationFormData.title}
                    onChange={e => setNotificationFormData({...notificationFormData, title: e.target.value})}
                    placeholder="System Maintenance"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-dark-surface/5 transition-all text-lg"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    required
                    value={notificationFormData.message}
                    onChange={e => setNotificationFormData({...notificationFormData, message: e.target.value})}
                    placeholder="The system will be down for 2 hours..."
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-dark-surface/5 transition-all min-h-[120px]"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Target User</label>
                  <select 
                    value={notificationFormData.userId || ''}
                    onChange={e => setNotificationFormData({...notificationFormData, userId: e.target.value || undefined})}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-dark-surface/5 transition-all"
                  >
                    <option value="">All Users (Global)</option>
                    {users.map(u => (
                      <option key={u.uid} value={u.uid}>{u.displayName} ({u.email})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Type</label>
                    <select 
                      value={notificationFormData.type}
                      onChange={e => setNotificationFormData({...notificationFormData, type: e.target.value as any})}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-dark-surface/5 transition-all"
                    >
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="success">Success</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Status</label>
                    <div className="flex items-center gap-3 h-[60px]">
                      <button 
                        type="button"
                        onClick={() => setNotificationFormData({...notificationFormData, active: !notificationFormData.active})}
                        className={cn(
                          "w-14 h-8 rounded-full p-1 transition-colors duration-300",
                          notificationFormData.active ? "bg-brand-600" : "bg-slate-200"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300",
                          notificationFormData.active ? "translate-x-6" : "translate-x-0"
                        )} />
                      </button>
                      <span className="font-bold text-slate-500">{notificationFormData.active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Visibility</label>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                    <button 
                      type="button"
                      onClick={() => setNotificationFormData({...notificationFormData, showOnHome: !notificationFormData.showOnHome})}
                      className={cn(
                        "w-14 h-8 rounded-full p-1 transition-colors duration-300",
                        notificationFormData.showOnHome ? "bg-brand-600" : "bg-slate-200"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300",
                        notificationFormData.showOnHome ? "translate-x-6" : "translate-x-0"
                      )} />
                    </button>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-dark-surface">Show on Home Page</p>
                      <p className="text-[10px] text-slate-500 font-medium">If disabled, notification only appears on the notifications page.</p>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-dark-surface hover:bg-black text-white rounded-[2rem] font-bold transition-all shadow-xl flex items-center justify-center gap-3 text-lg"
                >
                  {editingNotification ? <Edit3 size={24} /> : <Plus size={24} />}
                  {editingNotification ? 'Update' : 'Publish'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lost & Found Modal */}
      <AnimatePresence>
        {isLostFoundModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLostFoundModalOpen(false)}
              className="absolute inset-0 bg-dark-surface/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-lg bg-white rounded-t-[3rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-dark-surface">
                  {editingLostFound ? 'Edit Item' : 'Post Item'}
                </h2>
                <button onClick={() => setIsLostFoundModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddLostFound} className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-1 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setLostFoundFormData({...lostFoundFormData, type: 'lost'})}
                    className={cn(
                      "py-3 rounded-xl font-bold text-sm transition-all",
                      lostFoundFormData.type === 'lost' ? "bg-white text-red-600 shadow-sm" : "text-slate-500"
                    )}
                  >
                    Lost
                  </button>
                  <button
                    type="button"
                    onClick={() => setLostFoundFormData({...lostFoundFormData, type: 'found'})}
                    className={cn(
                      "py-3 rounded-xl font-bold text-sm transition-all",
                      lostFoundFormData.type === 'found' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"
                    )}
                  >
                    Found
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Title</label>
                  <input 
                    required
                    type="text"
                    value={lostFoundFormData.title}
                    onChange={e => setLostFoundFormData({...lostFoundFormData, title: e.target.value})}
                    placeholder="Black Wallet, Keys, etc."
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-dark-surface/5 transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    required
                    value={lostFoundFormData.description}
                    onChange={e => setLostFoundFormData({...lostFoundFormData, description: e.target.value})}
                    placeholder="Provide details about the item..."
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-dark-surface/5 transition-all min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Location</label>
                    <input 
                      required
                      type="text"
                      value={lostFoundFormData.location}
                      onChange={e => setLostFoundFormData({...lostFoundFormData, location: e.target.value})}
                      placeholder="Library, Cafeteria..."
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-dark-surface/5 transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Date</label>
                    <input 
                      required
                      type="date"
                      value={lostFoundFormData.date}
                      onChange={e => setLostFoundFormData({...lostFoundFormData, date: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-dark-surface/5 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Item Image</label>
                  <div className="relative group">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={e => setSelectedImage(e.target.files?.[0] || null)}
                      className="hidden"
                      id="lost-found-image"
                    />
                    <label 
                      htmlFor="lost-found-image"
                      className="w-full px-6 py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-100 hover:border-brand-300 transition-all group"
                    >
                      {selectedImage ? (
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle className="text-emerald-500" size={32} />
                          <span className="text-sm font-bold text-emerald-600">{selectedImage.name}</span>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-brand-500 transition-colors">
                            <ImageIcon size={24} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-slate-600">Click to upload image</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">PNG, JPG up to 5MB</p>
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-5 bg-dark-surface hover:bg-black text-white rounded-[2rem] font-bold transition-all shadow-xl flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <CoolLoader size={32} />
                  ) : (
                    editingLostFound ? <Edit3 size={24} /> : <Plus size={24} />
                  )}
                  {isUploading ? 'Uploading...' : (editingLostFound ? 'Update' : 'Post Item')}
                </button>
                {!isAdmin && (
                  <p className="text-center text-xs text-slate-400 font-medium">
                    Your post will be live after admin approval.
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {fullscreenImage && (
          <div 
            onClick={() => setFullscreenImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-10 cursor-zoom-out"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-full flex items-center justify-center"
            >
              <button 
                onClick={() => setFullscreenImage(null)}
                className="absolute top-0 right-0 p-4 text-white/50 hover:text-white transition-colors z-10"
              >
                <X size={40} />
              </button>
              <img 
                src={fullscreenImage} 
                alt="Fullscreen Preview"
                className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 sm:bottom-32 right-6 sm:right-10 z-[45] p-4 bg-brand-600 text-white rounded-2xl shadow-2xl shadow-brand-200 hover:scale-110 transition-all lg:bottom-10"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
      <ConfirmationModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />
    </>
  )}
</div>
  );
}
