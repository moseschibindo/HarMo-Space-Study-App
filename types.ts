export type UserRole = 'student' | 'admin' | 'suspended';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: UserRole;
  status: 'active' | 'suspended';
  createdAt: string;
  pinnedDocIds?: string[];
}

export interface StudyDocument {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'docx';
  url: string;
  thumbnailUrl?: string;
  category: string;
  authorId: string;
  authorName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  fileSize?: number; // in bytes
  views?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Notification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  createdAt: string;
  active: boolean;
  read: boolean;
  showOnHome?: boolean;
}

export interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  type: 'lost' | 'found';
  location: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  authorId: string;
  authorName: string;
  authorPhone?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface BusinessListing {
  id: string;
  title: string;
  description: string;
  price?: string;
  category: string;
  location: string;
  contactPhone: string;
  imageUrls: string[];
  status: 'pending' | 'approved' | 'rejected';
  authorId: string;
  authorName: string;
  createdAt: string;
  viewedBy?: string[];
}
