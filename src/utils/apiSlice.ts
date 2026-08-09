

import { SessionModel } from "@/model/session";
import { createApi } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
// import { useRouter } from 'next/navigation'
// const router = useRouter()
import { apiClient } from "./api";

// Custom base query using our shared API client
const customBaseQuery = async (args: any) => {
  try {
    // Get session for authentication
    const sessionData: any = await getSession();
    const session = sessionData as SessionModel | undefined;

    // Extract method, url, and data from args
    const { url, method = 'GET', body, headers, skipAuth = false, absoluteUrl = false } = args;

    // Check if this is an absolute URL (for local files, etc.)
    if (absoluteUrl) {
      // Use fetch directly for absolute URLs (like local JSON files)
      const response = await fetch(url, {
        method: method.toUpperCase(),
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    }

    // For API calls, use apiClient with auth
    if (!skipAuth && session?.accessToken) {
      apiClient.setAuthToken(session.accessToken);
    } else {
      apiClient.clearAuthToken();
    }

    // Make the API call using our shared client
    let result;
    switch (method.toUpperCase()) {
      case 'GET':
        result = await apiClient.get(url, headers);
        break;
      case 'POST':
        result = await apiClient.post(url, body, headers);
        break;
      case 'PUT':
        result = await apiClient.put(url, body, headers);
        break;
      case 'DELETE':
        result = await apiClient.delete(url, headers);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return {
      data: result,
    };
  } catch (error: any) {
    return {
      error: {
        status: error.response?.status || 500,
        data: error.response?.data || error.message,
      },
    };
  }
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  endpoints: (_builder) => ({}),
  tagTypes: ['withdraw', 'member', 'profile', 'kyc', 'gift', 'live', 'VoiceRoom'],

  // Performance Optimization: Cache Configuration
  keepUnusedDataFor: 300, // เก็บ cache 5 นาที
  refetchOnMountOrArgChange: 600, // Refetch ทุก 10 นาทีเมื่อ mount ใหม่
  refetchOnFocus: false, // ไม่ refetch เมื่อ focus window (ลด network requests)
  refetchOnReconnect: true, // Refetch เมื่อ internet กลับมา

});

