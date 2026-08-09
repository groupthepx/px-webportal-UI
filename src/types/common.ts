/**
 * Common Types
 * ======================================
 * Type definitions ที่ใช้ร่วมกันทั่วทั้ง project
 */

import { ReactNode } from 'react';

// Base API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedApiResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common Component Props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface ResponsiveProps {
  xs?: boolean | number;
  sm?: boolean | number;
  md?: boolean | number;
  lg?: boolean | number;
  xl?: boolean | number;
}

// Status Types
export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'completed';

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'tel' | 'date' | 'select';
  required?: boolean;
  placeholder?: string;
  options?: { value: string | number; label: string }[];
}

export interface FormErrors {
  [key: string]: string | undefined;
}

// Image Types
export interface ImageData {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

// User Types (Basic)
export interface BaseUser {
  id: string | number;
  username?: string;
  email?: string;
  fullName?: string;
  avatar?: string;
}

// Date Range
export interface DateRange {
  startDate: Date | string | null;
  endDate: Date | string | null;
}

// Sort & Filter
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  [key: string]: any;
}

// Table Types
export interface TableColumn<T = any> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => string | ReactNode;
  sortable?: boolean;
}

export interface TableData<T = any> {
  rows: T[];
  columns: TableColumn<T>[];
  total?: number;
}

// Modal/Dialog Types
export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

// Notification Types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id?: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

// File Upload Types
export interface FileUpload {
  file: File;
  preview?: string;
  progress?: number;
  error?: string;
}

// Color Types
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';

// Size Types
export type SizeVariant = 'small' | 'medium' | 'large';

// Helper Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// Action Types (for Redux/State Management)
export interface Action<T = any> {
  type: string;
  payload?: T;
}

export interface AsyncAction<T = any> extends Action<T> {
  loading?: boolean;
  error?: string | null;
}

// Route Types
export interface Route {
  path: string;
  label: string;
  icon?: ReactNode;
  exact?: boolean;
  children?: Route[];
}

// Breakpoint Type
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Theme Mode
export type ThemeMode = 'light' | 'dark';

// Language
export type Language = 'th' | 'en' | 'la';

// Export all types as namespace
export type * from './common';

