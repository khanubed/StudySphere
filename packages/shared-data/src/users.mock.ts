import {
  UserProfile,
  Institution,
  Branch,
  Semester,
  Subject,
} from '@studysphere/shared-types';

export const mockInstitution: Institution = {
  id: 'inst-apex-01',
  name: 'Apex Institute of Engineering & Technology',
  domain: 'apex.edu',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockBranches: Branch[] = [
  {
    id: 'branch-cse',
    institutionId: 'inst-apex-01',
    name: 'Computer Science & Engineering',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'branch-ece',
    institutionId: 'inst-apex-01',
    name: 'Electronics & Communication Engineering',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

export const mockSemesters: Semester[] = [
  {
    id: 'sem-6',
    branchId: 'branch-cse',
    number: 6,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

export const mockSubjects: Subject[] = [
  {
    id: 'CS-301',
    semesterId: 'sem-6',
    name: 'Database Management Systems',
    code: 'CS301',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'CS-302',
    semesterId: 'sem-6',
    name: 'Operating Systems',
    code: 'CS302',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'CS-304',
    semesterId: 'sem-6',
    name: 'Computer Networks',
    code: 'CS304',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

export const mockStudentUser: UserProfile = {
  id: 'usr-student-01',
  email: 'aravind.sharma@apex.edu',
  name: 'Aravind Sharma',
  role: 'student',
  institutionId: 'inst-apex-01',
  institution: mockInstitution,
  studentProfile: {
    userId: 'usr-student-01',
    branchId: 'branch-cse',
    semesterId: 'sem-6',
    cgpa: 8.75,
    attendancePct: 89.5,
  },
  privacySettings: {
    profileVisibility: 'public',
    showContactInfo: true,
    showAcademicStats: true,
  },
  createdAt: '2024-08-01T10:00:00.000Z',
  updatedAt: '2024-08-01T10:00:00.000Z',
};

export const mockFacultyUser: UserProfile = {
  id: 'usr-faculty-01',
  email: 'dr.priya.nair@apex.edu',
  name: 'Dr. Priya Nair',
  role: 'faculty',
  institutionId: 'inst-apex-01',
  institution: mockInstitution,
  facultyProfile: {
    userId: 'usr-faculty-01',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    experienceYears: 12,
  },
  privacySettings: {
    profileVisibility: 'public',
    showContactInfo: true,
    showAcademicStats: false,
  },
  createdAt: '2023-05-10T09:00:00.000Z',
  updatedAt: '2023-05-10T09:00:00.000Z',
};

export const mockAlumniUser: UserProfile = {
  id: 'usr-alumni-01',
  email: 'rohit.verma@alumni.apex.edu',
  name: 'Rohit Verma',
  role: 'alumni',
  institutionId: 'inst-apex-01',
  institution: mockInstitution,
  alumniProfile: {
    userId: 'usr-alumni-01',
    graduationYear: 2022,
    currentCompany: 'Google',
    designation: 'Senior Software Engineer',
    skills: ['System Design', 'Go', 'Kubernetes', 'Distributed Systems'],
    isVerified: true,
  },
  privacySettings: {
    profileVisibility: 'public',
    showContactInfo: true,
    showAcademicStats: true,
  },
  createdAt: '2021-06-15T08:00:00.000Z',
  updatedAt: '2021-06-15T08:00:00.000Z',
};

export const mockAdminUser: UserProfile = {
  id: 'usr-admin-01',
  email: 'admin@studysphere.app',
  name: 'Campus System Administrator',
  role: 'admin',
  institutionId: 'inst-apex-01',
  institution: mockInstitution,
  privacySettings: {
    profileVisibility: 'institution_only',
    showContactInfo: true,
    showAcademicStats: false,
  },
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
};

export const mockUsersList: UserProfile[] = [
  mockStudentUser,
  mockFacultyUser,
  mockAlumniUser,
  mockAdminUser,
];

export function findMockUserByEmail(email: string, role?: string): UserProfile {
  const normalized = email.toLowerCase().trim();
  const match = mockUsersList.find(
    (u) => u.email.toLowerCase() === normalized || (role && u.role === role)
  );
  return match || mockStudentUser;
}
