import { Resource, Comment, ContributorPoints, LeaderboardEntry } from '@studysphere/shared-types';
import { mockStudentUser, mockFacultyUser } from './users.mock.js';

export const mockResourcesList: Resource[] = [
  {
    id: 'res-101',
    title: 'Complete DBMS Normalization (1NF to 5NF) Handwritten Notes',
    description: 'Comprehensive lecture and revision notes covering 1NF, 2NF, 3NF, BCNF, 4NF, 5NF with real university exam examples.',
    type: 'notes',
    subjectId: 'CS-301',
    uploadedBy: 'usr-student-01',
    uploader: mockStudentUser,
    fileUrl: 'https://storage.studysphere.app/resources/dbms_normalization.pdf',
    likesCount: 142,
    bookmarksCount: 68,
    commentsCount: 12,
    status: 'published',
    createdAt: '2024-08-10T10:00:00.000Z',
    updatedAt: '2024-08-10T10:00:00.000Z',
  },
  {
    id: 'res-102',
    title: 'Operating Systems Previous 5 Years Solved Question Papers',
    description: 'University end-sem question papers with complete step-by-step answers on process scheduling, semaphores, and memory management.',
    type: 'pyq',
    subjectId: 'CS-302',
    uploadedBy: 'usr-faculty-01',
    uploader: mockFacultyUser,
    fileUrl: 'https://storage.studysphere.app/resources/os_pyqs_solved.pdf',
    likesCount: 230,
    bookmarksCount: 115,
    commentsCount: 19,
    status: 'published',
    createdAt: '2024-07-20T08:30:00.000Z',
    updatedAt: '2024-07-20T08:30:00.000Z',
  },
  {
    id: 'res-103',
    title: 'Computer Networks Top-Down Approach Reference Notes',
    description: 'Detailed protocol layer diagrams, subnetting tricks, TCP vs UDP comparison sheets, and Wireshark lab manuals.',
    type: 'book',
    subjectId: 'CS-304',
    uploadedBy: 'usr-student-01',
    uploader: mockStudentUser,
    fileUrl: 'https://storage.studysphere.app/resources/cn_top_down.pdf',
    likesCount: 89,
    bookmarksCount: 44,
    commentsCount: 6,
    status: 'published',
    createdAt: '2024-08-15T12:00:00.000Z',
    updatedAt: '2024-08-15T12:00:00.000Z',
  },
];

export const mockCommentsList: Comment[] = [
  {
    id: 'comm-1',
    resourceId: 'res-101',
    userId: 'usr-student-01',
    user: mockStudentUser,
    content: 'The BCNF lossy vs lossless decomposition examples on page 14 cleared all my doubts for the midterm!',
    status: 'visible',
    createdAt: '2024-08-12T14:20:00.000Z',
    updatedAt: '2024-08-12T14:20:00.000Z',
  },
  {
    id: 'comm-2',
    resourceId: 'res-101',
    userId: 'usr-faculty-01',
    user: mockFacultyUser,
    content: 'Well structured and accurate notes. Recommended for revision for CS-301 students.',
    status: 'visible',
    createdAt: '2024-08-13T09:15:00.000Z',
    updatedAt: '2024-08-13T09:15:00.000Z',
  },
];

export const mockLeaderboardEntries: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'usr-student-01',
    user: {
      id: 'usr-student-01',
      name: 'Aravind Sharma',
    },
    points: 1250,
    badge: 'gold',
  },
  {
    rank: 2,
    userId: 'usr-alumni-01',
    user: {
      id: 'usr-alumni-01',
      name: 'Rohit Verma',
    },
    points: 980,
    badge: 'silver',
  },
];

export const mockContributorPoints: ContributorPoints[] = [
  {
    id: 'cp-1',
    userId: 'usr-student-01',
    resourceId: 'res-101',
    action: 'upload',
    points: 50,
    createdAt: '2024-08-10T10:00:00.000Z',
  },
  {
    id: 'cp-2',
    userId: 'usr-student-01',
    resourceId: 'res-101',
    action: 'like_received',
    points: 10,
    createdAt: '2024-08-11T12:00:00.000Z',
  },
];
