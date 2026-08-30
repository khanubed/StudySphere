import { baseApi } from './baseApi';
import { ApiResponse } from '@studysphere/shared-types';

export interface PresignUploadRequest {
  fileType: string;
  fileSize: number;
  purpose: 'resource' | 'resume' | 'submission' | 'avatar';
  fileName?: string;
}

export interface PresignUploadResponse {
  uploadUrl: string;
  fileUrl: string;
  key: string;
  expiresInSeconds: number;
}

export interface CompleteUploadRequest {
  key: string;
  purpose: 'resource' | 'resume' | 'submission' | 'avatar';
  fileUrl: string;
  metadata?: Record<string, any>;
}

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPresignedUrl: builder.mutation<
      ApiResponse<PresignUploadResponse>,
      PresignUploadRequest
    >({
      query: (body) => ({
        url: '/uploads/presign',
        method: 'POST',
        body,
      }),
    }),
    completeUpload: builder.mutation<
      ApiResponse<{ id: string; fileUrl: string }>,
      CompleteUploadRequest
    >({
      query: (body) => ({
        url: '/uploads/complete',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Resource', 'Dashboard', 'Profile'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPresignedUrlMutation,
  useCompleteUploadMutation,
} = uploadApi;
