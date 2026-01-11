
export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in-progress',
  TESTING = 'testing',
  COMPLETED = 'completed',
  ON_HOLD = 'on-hold'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  avatar?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'contacted' | 'converted';
  createdAt: string;
}

export type InquiryType = 'call' | 'message' | 'quote' | 'general';
export type InquiryStatus = 'submitted' | 'contacted' | 'in-progress' | 'closed';

export interface Inquiry {
  id: string;
  userId?: string; // Nullable for guest users
  name: string;
  email: string;
  phone: string;
  inquiryType: InquiryType;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  enabled: boolean;
  learnMoreUrl: string;
  quoteUrl: string;
}

export interface Project {
  id: string;
  title: string;
  customerId: string;
  statusId: string;
  progress: number;
  description: string;
  updatedAt: string;
}

export interface Quote {
  id: string;
  customerId: string;
  serviceId: string;
  details: string;
  status: 'pending' | 'approved' | 'rejected';
  amount?: number;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export interface Testimonial {
  id: string;
  author: string;
  content: string;
  rating: number;
  approved: boolean;
}

export interface AppSettings {
  companyName: string;
  contactEmail: string;
  phone: string;
  address: string;
  maintenanceMode: boolean;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

// MEDIA TYPES
export interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  section?: string; // e.g., 'home-hero', 'about-us'
  createdAt: string;
}

export interface MediaAssignment {
  slotId: string; // unique identifier for a website position
  mediaId: string;
  page: string;
}
