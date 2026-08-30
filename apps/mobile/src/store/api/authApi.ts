import { baseApi } from './baseApi';
import {
  UserProfile,
  ApiResponse,
} from '@studysphere/shared-types';
import {
  mockStudentUser,
  mockUsersList,
  findMockUserByEmail,
} from '@studysphere/shared-data';
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

// In-memory mock session store for local prototyping
let currentMockUser: UserProfile = { ...mockStudentUser };

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<ApiResponse<UserProfile>, void>({
      queryFn: async () => {
        return {
          data: {
            success: true,
            data: currentMockUser,
            message: 'Session retrieved successfully',
          },
        };
      },
      providesTags: ['Auth', 'Profile'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.data) {
            dispatch(setCredentials({ user: data.data }));
          }
        } catch {
          // Ignore
        }
      },
    }),
    getProfile: builder.query<ApiResponse<UserProfile>, void>({
      queryFn: async () => {
        return {
          data: {
            success: true,
            data: currentMockUser,
          },
        };
      },
      providesTags: ['Profile'],
    }),
    login: builder.mutation<ApiResponse<AuthResponseData>, LoginRequest>({
      queryFn: async (credentials) => {
        const user = findMockUserByEmail(credentials.email);
        currentMockUser = { ...user };
        return {
          data: {
            success: true,
            data: {
              user: currentMockUser,
              token: 'mock-jwt-access-token-studysphere-2026',
              expiresIn: 86400,
            },
            message: 'Login successful',
          },
        };
      },
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
      queryFn: async (userData) => {
        const role = userData.role || 'student';
        const baseUser = mockUsersList.find((u) => u.role === role) || mockStudentUser;
        currentMockUser = {
          ...baseUser,
          id: `usr-${Date.now()}`,
          name: userData.name,
          email: userData.email,
          role,
        };
        return {
          data: {
            success: true,
            data: {
              user: currentMockUser,
              token: 'mock-jwt-registered-token-studysphere',
              expiresIn: 86400,
            },
            message: 'Registration successful',
          },
        };
      },
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
      queryFn: async () => {
        currentMockUser = { ...mockStudentUser };
        return {
          data: {
            success: true,
            data: {
              user: currentMockUser,
              token: 'mock-google-oauth-jwt-token',
              expiresIn: 86400,
            },
          },
        };
      },
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
      queryFn: async () => {
        return {
          data: {
            success: true,
            data: {
              token: 'mock-jwt-refreshed-token-studysphere',
            },
          },
        };
      },
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
      queryFn: async () => {
        return {
          data: {
            success: true,
            data: null,
            message: 'Logged out successfully',
          },
        };
      },
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
      queryFn: async () => {
        return {
          data: {
            success: true,
            data: null,
            message: 'Logged out from all sessions',
          },
        };
      },
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
      queryFn: async ({ email }) => {
        return {
          data: {
            success: true,
            data: { message: `Password reset link sent to ${email}` },
          },
        };
      },
    }),
    resetPassword: builder.mutation<ApiResponse<{ message: string }>, ResetPasswordRequest>({
      queryFn: async () => {
        return {
          data: {
            success: true,
            data: { message: 'Password has been reset successfully' },
          },
        };
      },
    }),
    updateProfile: builder.mutation<
      ApiResponse<UserProfile>,
      Partial<UserProfile>
    >({
      queryFn: async (body) => {
        currentMockUser = {
          ...currentMockUser,
          ...body,
          updatedAt: new Date().toISOString(),
        };
        return {
          data: {
            success: true,
            data: currentMockUser,
          },
        };
      },
      invalidatesTags: ['Profile', 'Auth'],
    }),
    updatePrivacySettings: builder.mutation<
      ApiResponse<UserProfile>,
      PrivacySettingsRequest
    >({
      queryFn: async (body) => {
        const profileVisibility =
          body.profileVisibility === 'campus'
            ? 'institution_only'
            : body.profileVisibility || currentMockUser.privacySettings?.profileVisibility || 'public';

        currentMockUser = {
          ...currentMockUser,
          privacySettings: {
            profileVisibility,
            showContactInfo: Boolean(body.showEmail ?? body.showPhone ?? currentMockUser.privacySettings?.showContactInfo),
            showAcademicStats: Boolean(body.showAcademicStats ?? currentMockUser.privacySettings?.showAcademicStats),
          },
          updatedAt: new Date().toISOString(),
        };
        return {
          data: {
            success: true,
            data: currentMockUser,
          },
        };
      },
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
