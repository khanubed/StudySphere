import { baseApi } from './baseApi';
import {
  UserProfile,
  ApiResponse,
} from '@studysphere/shared-types';
import { setCredentials, setToken, clearCredentials } from '../slices/authSlice';

export interface LoginRequest {
  email: string;
  password?: string;
  code?: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  name: string;
  role?: 'student' | 'faculty' | 'admin' | 'alumni';
  institutionId?: string;
}

export interface AuthResponseData {
  user: UserProfile;
  token?: string;
  expiresIn?: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword?: string;
  password?: string;
}

export interface PrivacySettingsRequest {
  profileVisibility?: 'public' | 'campus' | 'private';
  showEmail?: boolean;
  showPhone?: boolean;
  showAcademicStats?: boolean;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<ApiResponse<UserProfile>, void>({
      query: () => '/auth/me',
      providesTags: ['Auth', 'Profile'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.data) {
            dispatch(setCredentials({ user: data.data }));
          }
        } catch {
          // Ignore unauthenticated error on boot
        }
      },
    }),
    getProfile: builder.query<ApiResponse<UserProfile>, void>({
      query: () => '/profile',
      providesTags: ['Profile'],
    }),
    login: builder.mutation<ApiResponse<AuthResponseData>, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'Profile', 'Dashboard'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.data) {
            dispatch(
              setCredentials({
                user: data.data.user,
                token: data.data.token,
              })
            );
          }
        } catch {
          // Login failed
        }
      },
    }),
    register: builder.mutation<ApiResponse<AuthResponseData>, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth', 'Profile', 'Dashboard'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.data) {
            dispatch(
              setCredentials({
                user: data.data.user,
                token: data.data.token,
              })
            );
          }
        } catch {
          // Registration failed
        }
      },
    }),
    googleAuth: builder.mutation<ApiResponse<AuthResponseData>, { code: string }>({
      query: (body) => ({
        url: '/auth/google',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'Profile', 'Dashboard'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.data) {
            dispatch(
              setCredentials({
                user: data.data.user,
                token: data.data.token,
              })
            );
          }
        } catch {
          // OAuth failed
        }
      },
    }),
    refreshToken: builder.mutation<ApiResponse<{ token: string }>, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.data?.token) {
            dispatch(setToken(data.data.token));
          }
        } catch {
          // Refresh failed
        }
      },
    }),
    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'Profile', 'Dashboard', 'Notification'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearCredentials());
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),
    logoutAll: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: '/auth/logout-all',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'Profile', 'Dashboard', 'Notification'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearCredentials());
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),
    forgotPassword: builder.mutation<ApiResponse<{ message: string }>, ForgotPasswordRequest>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<ApiResponse<{ message: string }>, ResetPasswordRequest>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
    updateProfile: builder.mutation<
      ApiResponse<UserProfile>,
      Partial<UserProfile>
    >({
      query: (body) => ({
        url: '/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Profile', 'Auth'],
    }),
    updatePrivacySettings: builder.mutation<
      ApiResponse<UserProfile>,
      PrivacySettingsRequest
    >({
      query: (body) => ({
        url: '/profile/privacy',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useGetProfileQuery,
  useLoginMutation,
  useRegisterMutation,
  useGoogleAuthMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useLogoutAllMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useUpdatePrivacySettingsMutation,
} = authApi;
