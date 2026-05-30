import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smile, 
  Users, 
  BookOpen, 
  Award, 
  Video, 
  Layers, 
  ShieldAlert, 
  CheckCircle, 
  Star, 
  HelpCircle, 
  Info, 
  ArrowRight,
  Menu,
  X,
  User,
  LogOut,
  Lock,
  GraduationCap
} from 'lucide-react';

import { 
  INITIAL_COURSES, 
  INITIAL_STUDENTS, 
  INITIAL_MESSAGES, 
  PAYMENT_HISTORY, 
  STUDENT_ROSTER, 
  COURSE_REPORTS, 
  MOCK_USERS_MANAGEMENT, 
  COURSE_APPROVALS 
} from './initialData';

import { Course, StudentProfile, InstructorMessage, PaymentInvoice } from './types';

import Homepage from './components/Homepage';
import StudentDashboard from './components/StudentDashboard';
import ParentDashboard from './components/ParentDashboard';
import CoursePlayer from './components/CoursePlayer';
import InstructorDashboard from './components/InstructorDashboard';
import AdminPanel from './components/AdminPanel';
import AuthRoom from './components/AuthRoom';
import { auth } from './firebase/config';
import { signOut } from 'firebase/auth';
import { useLanguage } from './LanguageContext';

export default function App() {
  const { language, setLanguage, t } = useLanguage();
  // Global simulation state variables
  const [activeView, setActiveView] = useState<string>('home');
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [students, setStudents] = useState<StudentProfile[]>(INITIAL_STUDENTS);
  const [currentStudentId, setCurrentStudentId] = useState<string>('child-1');
  const [messages, setMessages] = useState<InstructorMessage[]>(INITIAL_MESSAGES);
  const [paymentHistory, setPaymentHistory] = useState<PaymentInvoice[]>(PAYMENT_HISTORY);
  const [studentRoster, setStudentRoster] = useState(STUDENT_ROSTER);
  const [courseApprovals, setCourseApprovals] = useState(COURSE_APPROVALS);
  const [userManagement, setUserManagement] = useState(MOCK_USERS_MANAGEMENT);
  
  // Realtime Session User Roles
  const [userSession, setUserSession] = useState<{ uid: string; email: string; displayName?: string } | null>(null);
  const [userRole, setUserRole] = useState<'Student' | 'Parent' | 'Teacher' | 'Admin' | null>(null);
  const [teacherSpecialty, setTeacherSpecialty] = useState<string>('Mathematics');

  // Modal Auth Switcher
  const [showAuthRoom, setShowAuthRoom] = useState<boolean>(false);

  // Active lesson/course tracking for Course Player
  const [activeCourseId, setActiveCourseId] = useState<string>('course-1');
  const [activeLessonId, setActiveLessonId] = useState<string>('c1-l1');

  // Branding platform customization values
  const [brandingName, setBrandingName] = useState<string>('KidsLearn Platform');

  // Interactive Demo checklist display toggler
  const [showDemoConsole, setShowDemoConsole] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Listen to Firebase Authenticated states
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        // Simple automatic mapper
        setUserSession({
          uid: user.uid,
          email: user.email || 'learner@classroom.com',
          displayName: user.displayName || 'Authorized Learner'
        });
        // Default to student if none set yet
        if (!userRole) {
          setUserRole('Student');
        }
      } else {
        setUserSession(null);
      }
    });
    return () => unsub();
  }, [userRole]);

  // Dynamic navigation links based on user role and authentication state
  const navTabs = userSession
    ? [
        { id: 'home', label: t('nav.home'), style: 'hover:bg-slate-100 text-slate-650' },
        ...(userRole === 'Student' ? [
          { id: 'student', label: t('nav.student'), style: 'hover:bg-slate-100 text-slate-650' },
          { id: 'player', label: t('nav.player'), style: 'hover:bg-slate-100 text-slate-650' },
        ] : []),
        ...(userRole === 'Parent' ? [
          { id: 'parent', label: t('nav.parent'), style: 'hover:bg-slate-150 text-slate-650' },
        ] : []),
        ...(userRole === 'Teacher' ? [
          { id: 'instructor', label: t('nav.teacher'), style: 'hover:bg-slate-100 text-slate-650' },
          { id: 'player', label: t('nav.player'), style: 'hover:bg-slate-100 text-slate-650' },
        ] : []),
        ...(userRole === 'Admin' ? [
          { id: 'admin', label: t('nav.admin'), style: 'hover:bg-slate-100 text-slate-650' }
        ] : []),
      ]
    : [
        { id: 'home', label: t('nav.home'), style: 'hover:bg-slate-100 text-slate-650' }
      ];

  // Dynamic navigation handler protecting paths for unregistered users
  const handleNavigateToView = (view: string) => {
    if (view === 'home') {
      setActiveView('home');
      return;
    }
    if (!userSession) {
      setShowAuthRoom(true);
      return;
    }
    setActiveView(view);
  };

  const handleStartLearning = (courseId?: string) => {
    if (!userSession) {
      setShowAuthRoom(true);
      return;
    }
    if (courseId) {
      setActiveCourseId(courseId);
      const targetCourse = courses.find(c => c.id === courseId) || courses[0];
      const incompleteLesson = targetCourse.lessons.find(l => !l.completed) || targetCourse.lessons[0];
      setActiveLessonId(incompleteLesson.id);
    }
    setActiveView('player');
  };

  // Helper selectors
  const currentStudent = students.find(s => s.id === currentStudentId) || students[0];
  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];

  // Action: Increment stars for students
  const handleAddStars = (amount: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id === currentStudentId) {
        return {
          ...s,
          stars: s.stars + amount
        };
      }
      return s;
    }));
  };

  // Action: Complete lesson quiz or watchers
  const handleCompleteLesson = (courseId: string, lessonId: string) => {
    // 1. Update courses lesson completion
    setCourses(prevCourses => prevCourses.map(course => {
      if (course.id === courseId) {
        const updatedLessons = course.lessons.map(lesson => {
          if (lesson.id === lessonId) {
            return { ...lesson, completed: true };
          }
          return lesson;
        });

        // Calculate progress percentage
        const completedCount = updatedLessons.filter(l => l.completed).length;
        const totalCount = updatedLessons.length;
        const newProgress = Math.round((completedCount / totalCount) * 100);

        return {
          ...course,
          lessons: updatedLessons,
          progress: newProgress
        };
      }
      return course;
    }));

    // 2. Add gold achievements badges and stars if progress reaches 100%
    const courseObj = courses.find(c => c.id === courseId);
    if (courseObj) {
      const isFinishing = courseObj.lessons.filter(l => l.id !== lessonId && l.completed).length + 1 === courseObj.lessons.length;
      if (isFinishing) {
        // Unlock new badge in current child profile
        setStudents(prevStudents => prevStudents.map(student => {
          if (student.id === currentStudentId) {
            const newBadge = {
              id: `badge-unlocked-${Date.now()}`,
              title: 'Course Graduate!',
              description: `Graduated from "${courseObj.title}"`,
              icon: 'Award',
              dateEarned: '2026-05-26',
              color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
            };
            return {
              ...student,
              badges: [...student.badges, newBadge],
              stars: student.stars + 50 // Course finished bonus!
            };
          }
          return student;
        }));
      }
    }
  };

  // Action: Enroll student in a new course
  const handleEnrollCourse = (studentId: string, courseId: string, price: number) => {
    // Set course progress to 5% with draft lessons
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          progress: 5 // Enroll gives immediate starter progression
        };
      }
      return c;
    }));

    // Append to invoice logger
    const newInvoice: PaymentInvoice = {
      id: `inv-${Math.floor(Math.random() * 900) + 100}`,
      courseTitle: courses.find(c => c.id === courseId)?.title || 'Academy Core Module',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: price,
      status: 'Paid'
    };
    setPaymentHistory([newInvoice, ...paymentHistory]);
  };

  // Action: Custom lesson uploader from Teacher
  const handleUploadLesson = (courseId: string, title: string, duration: string, videoUrl: string) => {
    setCourses(prevCourses => prevCourses.map(course => {
      if (course.id === courseId) {
        const newLesson = {
          id: `lesson-uploaded-${Date.now()}`,
          title: title,
          duration: duration,
          completed: false,
          videoUrl: videoUrl, // YouTube embed
          hasQuiz: true,
          quiz: {
            questions: [
              { id: 'q-up-1', question: 'What does this lesson main topic focus on?', options: ['Counting stars', 'Core logical analysis', 'Standard glossary definitions', 'Sandbox exploration'], correctAnswer: 1 }
            ]
          }
        };
        return {
          ...course,
          lessons: [...course.lessons, newLesson]
        };
      }
      return course;
    }));
  };

  // Action: Send real-time parent messaging feedback
  const handleSendMessage = (text: string) => {
    const freshMsg: InstructorMessage = {
      id: `msg-${Date.now()}`,
      sender: 'Parent',
      senderName: 'Emily\'s Guardian',
      content: text,
      timestamp: 'Just now'
    };
    setMessages(prev => [...prev, freshMsg]);

    // Fast simulated checkmark answer from teacher
    setTimeout(() => {
      const teacherReply: InstructorMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: 'Teacher',
        senderName: 'Dr. Helen Carter',
        content: `Hello! I received your feedback regarding our weekly lesson. I am checking the current progress marks and average quiz scores. Feel free to download our referenced worksheets! 📚`,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, teacherReply]);
    }, 1200);
  };

  // Action: Admin approval panel
  const handleApproveCourse = (reqId: string) => {
    setCourseApprovals(prev => prev.map(item => item.id === reqId ? { ...item, status: 'Approved' } : item));
    const requestItem = courseApprovals.find(c => c.id === reqId);
    if (requestItem) {
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        title: requestItem.courseTitle,
        instructorName: requestItem.instructorName || 'Academy Specialist',
        description: `Deep dive study session for ${requestItem.title} modules.`,
        ageGroup: requestItem.ageGroup,
        level: 'Average',
        progress: 0,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
        lessons: [
          { id: 'l1', title: 'Interactive Glossary Review', duration: '08:30', completed: false, videoUrl: 'https://www.youtube.com/embed/2_m97z_uM6Y' }
        ]
      };
      setCourses([...courses, newCourse]);
    }
  };

  const handleRejectCourse = (reqId: string) => {
    setCourseApprovals(prev => prev.map(item => item.id === reqId ? { ...item, status: 'Rejected' } : item));
  };

  const handleToggleUserStatus = (userId: string) => {
    setUserManagement(prev => prev.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'Active' ? 'Suspended' : 'Active'
        };
      }
      return user;
    }));
  };

  // Handle successful logins of family, teacher, admin
  const handleAuthSuccess = (user: any, role: 'Student' | 'Parent' | 'Teacher' | 'Admin', extraData?: any) => {
    setUserSession({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || extraData?.name || `${role} Scholar`
    });
    setUserRole(role);
    setShowAuthRoom(false);

    if (extraData?.specialty) {
      setTeacherSpecialty(extraData.specialty);
    }

    // Redirect user to their respective classroom desk instantly
    if (role === 'Student') setActiveView('student');
    else if (role === 'Parent') setActiveView('parent');
    else if (role === 'Teacher') setActiveView('instructor');
    else if (role === 'Admin') setActiveView('admin');
  };

  // Log the active user out cleanly
  const handleLogOut = async () => {
    await signOut(auth);
    setUserSession(null);
    setUserRole(null);
    setActiveView('home');
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col font-sans select-none antialiased p-3 sm:p-5 lg:p-6 space-y-4">
      
      {/* Playful Sticky Ribbon Top Bar switcher for Presentation */}
      <header className="sticky top-0 z-40 bg-white rounded-3xl p-1.5 shadow-sm border-b-4 border-blue-200 max-w-7xl w-full mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          
          {/* Logo Brand with Sunshine decoration */}
          <div 
            onClick={() => setActiveView('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_#1D4ED8] border-2 border-slate-900 group-hover:scale-105 transition-all">
              <span className="text-blue-900 text-2xl font-black font-fun">K</span>
            </div>
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-black font-fun tracking-tight text-blue-900 leading-none">
                {brandingName}
              </h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5 leading-none">Kids Educational Hub</p>
            </div>
          </div>

          {/* Desktop Navigation Swapping tabs dynamically based on user session role */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
            {navTabs.map(tab => {
              const active = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-link-${tab.id}`}
                  onClick={() => {
                    handleNavigateToView(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    active 
                      ? 'bg-yellow-400 text-slate-950 shadow-[2px_2px_0px_#1e40af] border-2 border-slate-900 font-fun font-bold scale-102' 
                      : `text-slate-700 ${tab.style}`
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
            {!userSession && (
              <span className="hidden xl:inline-block px-3.5 py-2 text-[10px] font-black text-blue-600 animate-pulse bg-blue-50 rounded-lg border border-blue-100">
                ⭐ Enter Classroom to unlock interactive dashboards!
              </span>
            )}
          </nav>

          {/* Authentication State and Switchers */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Language Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  language === 'en' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-650 hover:bg-slate-200'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ur')}
                className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  language === 'ur' 
                    ? 'bg-blue-600 text-white shadow-sm font-urdu leading-none' 
                    : 'text-slate-650 hover:bg-slate-200 font-urdu leading-none'
                }`}
              >
                اردو
              </button>
            </div>

            {userSession ? (
              <div className="flex items-center gap-3 bg-slate-55 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-200">
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[9px] uppercase font-black text-indigo-700 font-mono">
                    ● {userRole} MODE
                  </span>
                  <p className="text-xs font-black text-slate-800 leading-none">
                    {userSession.displayName}
                  </p>
                </div>
                
                <button
                  onClick={handleLogOut}
                  className="p-2 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                  title={t('nav.logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthRoom(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-3 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_#000000] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#000000] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Lock className="w-4 h-4" />
                {t('nav.enter')}
              </button>
            )}

            {/* Quick Profile switcher indicator for visual reference */}
            <div className="text-right border-l-2 border-slate-200 pl-4">
              <p className="text-[9px] font-bold text-slate-400 uppercase">{t('nav.selectedKid')}</p>
              <p className="text-xs font-black text-blue-900 font-fun leading-none mt-0.5 animate-pulse">
                {currentStudent.avatar} {currentStudent.name}
              </p>
            </div>
            
            <button
              onClick={() => {
                const nextId = currentStudentId === 'child-1' ? 'child-2' : 'child-1';
                setCurrentStudentId(nextId);
              }}
              className="bg-white hover:bg-slate-50 text-slate-900 text-[10px] font-black px-3 py-2.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#000000] transition-all active:translate-y-[2px] active:shadow-none cursor-pointer"
            >
              {t('nav.swapPlayer')}
            </button>
          </div>

          {/* Mobile hamburger menu toggler */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => {
                const nextId = currentStudentId === 'child-1' ? 'child-2' : 'child-1';
                setCurrentStudentId(nextId);
              }}
              className="text-base bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 p-2 rounded-xl"
              title="Change active profile"
            >
              {currentStudent.avatar}
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border-2 border-slate-900 bg-white hover:bg-slate-50 text-slate-900 rounded-xl cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile menu expanded */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white border-t-2 border-slate-100 overflow-hidden rounded-b-3xl"
            >
              <div className="px-4 py-4 space-y-2 text-left">
                {navTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      handleNavigateToView(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left text-xs font-black transition-all ${
                      activeView === tab.id 
                        ? 'bg-yellow-400 text-slate-950 shadow border-2 border-slate-900 font-bold' 
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}

                {/* Mobile Language Switcher */}
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-black text-slate-700">Language / زبان:</span>
                  <div className="flex bg-slate-250/20 bg-slate-200 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setLanguage('en')}
                      className={`px-3 py-1 text-xs font-black rounded-md transition-all ${
                        language === 'en' 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-slate-600'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('ur')}
                      className={`px-3 py-1 text-xs font-black rounded-md transition-all ${
                        language === 'ur' 
                          ? 'bg-blue-600 text-white shadow-sm font-urdu' 
                          : 'text-slate-600 font-urdu'
                      }`}
                    >
                      اردو
                    </button>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-slate-100">
                  {userSession ? (
                    <button
                      onClick={() => {
                        handleLogOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2.5 bg-red-50 text-red-700 text-xs font-black rounded-xl text-left pl-3 flex items-center gap-1.5"
                    >
                      <LogOut className="w-4 h-4" /> {t('nav.logout')} ({userRole})
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowAuthRoom(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2.5 bg-blue-600 text-white text-xs font-black rounded-xl text-center"
                    >
                      {t('nav.enter')}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </header>

      {/* Main interactive content windows mapped elegantly */}
      <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          
          {activeView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <Homepage 
                courses={courses}
                onStartLearning={handleStartLearning}
                onNavigateToView={handleNavigateToView}
              />
            </motion.div>
          )}

          {activeView === 'student' && (
            <motion.div
              key="student"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <StudentDashboard 
                students={students}
                currentStudentId={currentStudentId}
                onChangeStudent={setCurrentStudentId}
                courses={courses}
                onStartCourse={(courseId) => {
                  setActiveCourseId(courseId);
                  
                  // Pick first incomplete lesson
                  const targetCourse = courses.find(c => c.id === courseId) || courses[0];
                  const incompleteLesson = targetCourse.lessons.find(l => !l.completed) || targetCourse.lessons[0];
                  setActiveLessonId(incompleteLesson.id);
                  setActiveView('player');
                }}
                onUpdateStudent={(updated) => {
                  setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
                }}
              />
            </motion.div>
          )}

          {activeView === 'parent' && (
            <motion.div
              key="parent"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <ParentDashboard 
                students={students}
                currentStudentId={currentStudentId}
                onChangeStudent={setCurrentStudentId}
                courses={courses}
                messages={messages}
                onSendMessage={handleSendMessage}
                paymentHistory={paymentHistory}
                onEnrollCourse={handleEnrollCourse}
              />
            </motion.div>
          )}

          {activeView === 'player' && (
            <motion.div
              key="player"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <CoursePlayer 
                course={activeCourse}
                activeLessonId={activeLessonId}
                onSelectLesson={setActiveLessonId}
                onCompleteLesson={handleCompleteLesson}
                onBackToDashboard={() => setActiveView('student')}
                currentStudent={currentStudent}
                onAddStars={handleAddStars}
                userRole={userRole}
              />
            </motion.div>
          )}

          {activeView === 'instructor' && (
            <motion.div
              key="instructor"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <InstructorDashboard 
                courses={courses}
                studentRoster={studentRoster}
                courseReports={COURSE_REPORTS}
                onUploadLesson={handleUploadLesson}
                teacherSpecialty={teacherSpecialty}
              />
            </motion.div>
          )}

          {activeView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <AdminPanel 
                userManagement={userManagement}
                courseApprovals={courseApprovals}
                courses={courses}
                onToggleUserStatus={handleToggleUserStatus}
                onApproveCourse={handleApproveCourse}
                onRejectCourse={handleRejectCourse}
                onUpdateBranding={setBrandingName}
                brandingName={brandingName}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Floating Interactive Live Firebase Authenticity Modal */}
      <AnimatePresence>
        {showAuthRoom && (
          <AuthRoom 
            onAuthSuccess={handleAuthSuccess}
            onClose={() => setShowAuthRoom(false)}
          />
        )}
      </AnimatePresence>

      {/* Footer System signature bar with telemetry block hidden */}
      <footer className="py-4 text-center text-[11px] text-slate-400 font-semibold tracking-wider max-w-7xl mx-auto w-full">
        Designed & Built under KidsLearn Platform Guidelines · Connected securely to Cloud Auth Nodes 🛡️
      </footer>

    </div>
  );
}
