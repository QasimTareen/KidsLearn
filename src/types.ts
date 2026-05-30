export type AgeGroup = '3-5' | '6-7' | '8-10' | '11-12';

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  ageGroup: AgeGroup;
  grade: string;
  stars: number;
  streak: number;
  completedHours: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  dateEarned: string;
  color: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  completed: boolean;
  worksheetUrl?: string;
  quiz?: {
    questions: QuizQuestion[];
  };
}

export interface Course {
  id: string;
  title: string;
  instructorName: string;
  ageGroup: AgeGroup;
  description: string;
  progress: number; // 0 to 100
  image: string;
  lessons: Lesson[];
  level: 'Beginner' | 'Average' | 'Hard';
}

export interface InstructorMessage {
  id: string;
  sender: 'Teacher' | 'Parent';
  senderName: string;
  content: string;
  timestamp: string;
}

export interface PaymentInvoice {
  id: string;
  date: string;
  amount: number;
  courseTitle: string;
  status: 'Paid' | 'Pending';
}

export interface StudentRosterItem {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  parentName: string;
  lessonsCompleted: number;
  totalLessons: number;
  avgQuizScore: number;
}

export interface CourseReport {
  id: string;
  title: string;
  enrolledStudents: number;
  avgQuizScore: number;
  completionRate: number;
}

export interface UserManagementItem {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Parent' | 'Instructor' | 'Admin';
  status: 'Active' | 'Suspended';
}

export interface CourseApprovalRequest {
  id: string;
  title: string;
  instructorName: string;
  ageGroup: AgeGroup;
  status: 'Pending' | 'Approved' | 'Rejected';
  dateSubmitted: string;
}
