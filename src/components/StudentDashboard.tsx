import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, BookOpen, Star, Play, Flame, Calendar, Clock, Smile, ChevronRight, CheckCircle } from 'lucide-react';
import { Course, StudentProfile, Badge, AgeGroup } from '../types';
import { useLanguage } from '../LanguageContext';

interface StudentDashboardProps {
  students: StudentProfile[];
  currentStudentId: string;
  onChangeStudent: (id: string) => void;
  courses: Course[];
  onStartCourse: (courseId: string) => void;
  onUpdateStudent: (updated: StudentProfile) => void;
}

export default function StudentDashboard({
  students,
  currentStudentId,
  onChangeStudent,
  courses,
  onStartCourse,
  onUpdateStudent,
}: StudentDashboardProps) {
  const { t, language } = useLanguage();
  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];
  const isYounger = currentStudent.ageGroup === '3-5' || currentStudent.ageGroup === '6-7';

  // State for avatar selection modal
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showRewardPop, setShowRewardPop] = useState(false);
  
  const childAvatars = ['🦁', '🦄', '🦊', '🐼', '🐯', '🐨', '🦖', '🚀', '🎨', '🐸', '🦄', '🐰'];

  // Filter courses suitable for current student's age group
  const relevantCourses = courses.filter((c) => {
    if (isYounger) {
      return c.ageGroup === '3-5' || c.ageGroup === '6-7';
    } else {
      return c.ageGroup === '8-10' || c.ageGroup === '11-12';
    }
  });

  // Find most recent in-progress course
  const inProgressCourses = relevantCourses.filter(c => c.progress > 0 && c.progress < 100);
  const continueCourse = inProgressCourses.length > 0 ? inProgressCourses[0] : relevantCourses[0];

  const handleSelectAvatar = (emoji: string) => {
    onUpdateStudent({
      ...currentStudent,
      avatar: emoji
    });
    setShowAvatarModal(false);
  };

  const handleClaimDailyReward = () => {
    onUpdateStudent({
      ...currentStudent,
      stars: currentStudent.stars + 15,
      streak: currentStudent.streak + 1
    });
    setShowRewardPop(true);
    setTimeout(() => {
      setShowRewardPop(false);
    }, 4000);
  };

  const upcomingClasses = isYounger ? [
    { 
      title: language === 'ur' ? 'کلاس: فونکس اور کہانیوں کی تفریح سارہ کے ساتھ' : 'Storytime & Sound Rhymes with Sarah', 
      time: language === 'ur' ? 'کل صبح ۱۰:۰۰ بجے' : 'Tomorrow 10:00 AM', 
      status: language === 'ur' ? 'آن لائن کلاس' : 'Live Class' 
    },
    { 
      title: language === 'ur' ? 'کلاس: کارٹون گنتی اور ریاضی کی مشق' : 'Math Monsters Count Practice', 
      time: language === 'ur' ? 'جمعرات صبح ۱۱:۳۰ بجے' : 'Thursday 11:30 AM', 
      status: language === 'ur' ? 'مشق سیشن' : 'Practice Session' 
    },
  ] : [
    { 
      title: language === 'ur' ? 'کلاس: کمپیوٹر کوڈنگ اور بھول بھلیاں بنانا' : 'Maze Game Coding Workshop with David', 
      time: language === 'ur' ? 'کل سہ پہر ۳:۳۰ بجے' : 'Tomorrow 3:30 PM', 
      status: language === 'ur' ? 'کوڈنگ ورکشاپ' : 'Live Coding' 
    },
    { 
      title: language === 'ur' ? 'کلاس: خلائی سائنس اور خلائی راکٹ سے گفتگو' : 'Space Science Live Rocket Chat', 
      time: language === 'ur' ? 'جمعہ شام ۴:۰۰ بجے' : 'Friday 4:00 PM', 
      status: language === 'ur' ? 'خلائی سیشن' : 'Science Meetup' 
    },
  ];

  return (
    <div className={`p-6 min-h-screen transition-all duration-300 ${
      isYounger 
        ? 'bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50 font-fun text-slate-900' 
        : 'bg-gradient-to-b from-slate-50 via-blue-50/20 to-indigo-50/20 font-sans text-slate-800'
    } ${language === 'ur' ? 'font-urdu' : ''}`}>
      <div className="max-w-7xl mx-auto space-y-8 text-left">
        
        {/* Profile Switcher & Avatar Creator Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white rounded-[32px] border-2 border-blue-100 shadow-sm border-b-8 border-blue-200 gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                id="student-avatar-button"
                onClick={() => setShowAvatarModal(true)}
                className="w-20 h-20 rounded-full bg-blue-100 hover:bg-yellow-200 border-4 border-slate-900 flex items-center justify-center text-5xl shadow-[4px_4px_0px_#2563eb] cursor-pointer transition-transform transform active:translate-y-1 active:shadow-none"
              >
                {currentStudent.avatar}
              </button>
              <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-slate-900 p-1.5 rounded-full text-xs animate-float border-2 border-slate-900 shadow">
                👑
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-3xl font-extrabold font-fun ${isYounger ? 'text-amber-600' : 'text-slate-800'}`}>
                  {language === 'ur' ? `خوش آمدید، ${currentStudent.name}! 👋` : `Howdy, ${currentStudent.name}!`}
                </h1>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded-full font-bold border border-yellow-300">
                  {currentStudent.grade}
                </span>
              </div>
              <p className="text-slate-500 text-sm font-semibold mt-1">
                {isYounger 
                  ? (language === 'ur' ? '🐥 جونیئر ٹریک (عمر ۳-۷)' : '🐥 Early Childhood Track (Ages 3-7)') 
                  : (language === 'ur' ? '🚀 سینئر ٹریک (عمر ۸-۱۲)' : '🚀 Skills Builder Track (Ages 8-12)')}
              </p>
              <button 
                onClick={() => setShowAvatarModal(true)}
                className="text-xs text-blue-600 font-bold hover:underline mt-1 block"
              >
                {language === 'ur' ? 'کارٹون کردار تبدیل کریں ›' : 'Change Avatar Character ›'}
              </button>
            </div>
          </div>

          {/* Persona Switch Box */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500">
              {language === 'ur' ? "پروفائل تبدیل کریں:" : "Demo Profiles:"}
            </span>
            {students.map((student) => {
              const active = student.id === currentStudentId;
              return (
                <button
                  key={student.id}
                  id={`btn-student-select-${student.id}`}
                  onClick={() => onChangeStudent(student.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                    active 
                      ? 'bg-blue-600 text-white shadow-[2px_2px_0px_#1e40af] scale-105 border border-blue-800' 
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>{student.avatar}</span>
                  <span>{student.name} ({student.ageGroup})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gamified Stat Badges grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
            <div className="bg-yellow-50 text-yellow-600 p-4 rounded-2xl text-3xl">
              ⭐️
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                {language === 'ur' ? "حاصل کردہ سنہرے ستارے" : "Golden Stars Earned"}
              </p>
              <p className="text-3xl font-black text-slate-900 font-fun">{currentStudent.stars}</p>
            </div>
            {/* Ambient shine */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-yellow-400/10 rounded-full blur-xl animate-pulse" />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
            <div className="bg-orange-50 text-orange-600 p-4 rounded-2xl text-3xl">
              🔥
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                {language === 'ur' ? "مسلسل پڑھائی کی ترتیب" : "Daily Day Streak"}
              </p>
              <p className="text-3xl font-black text-slate-900 font-fun">
                {currentStudent.streak} {language === 'ur' ? "دن" : "Days"}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
            <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl text-3xl">
              ⏱️
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                {language === 'ur' ? "سیکھنے کے گھنٹے" : "Hours Watched"}
              </p>
              <p className="text-3xl font-black text-slate-900 font-fun">{currentStudent.completedHours}h</p>
            </div>
          </div>

          <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-2 right-2 text-6xl opacity-10 font-fun select-none">🎁</div>
            <div>
              <h4 className="font-extrabold text-white text-base font-fun leading-tight flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-300" />
                {language === 'ur' ? "روزانہ بونس!" : "Daily Bonus!"}
              </h4>
              <p className="text-xs text-blue-200 mt-1">
                {language === 'ur' ? "کیا ۱۵ مفت ستارے چاہیے؟" : "Ready for 15 instant stars?"}
              </p>
            </div>
            <button
              id="student-claim-star-reward"
              onClick={handleClaimDailyReward}
              className="mt-3 w-full py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold text-xs rounded-xl shadow transition-colors font-fun cursor-pointer"
            >
              {language === 'ur' ? "مفت ستارے حاصل کریں!" : "Claim Daily Stars!"}
            </button>
          </div>
        </div>

        {/* Continue Learning Callout for quick resume action */}
        {continueCourse && (
          <div className={`p-6 md:p-8 rounded-[32px] shadow-sm relative overflow-hidden border ${
            isYounger 
              ? 'bg-amber-100/75 border-amber-200' 
              : 'bg-blue-600 text-white border-blue-700'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold w-fit uppercase font-fun ${
                  isYounger ? 'bg-amber-200 text-amber-800' : 'bg-blue-500 text-white'
                }`}>
                  👟 {language === 'ur' ? "اپنی مہم جاری رکھیں" : "Resume Your Adventure"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-fun leading-tight">
                  {continueCourse.title}
                </h2>
                <p className={`text-sm ${isYounger ? 'text-slate-700' : 'text-blue-100'} max-w-xl font-medium`}>
                  {language === 'ur' 
                    ? `آپ نے اپنے تعلیمی راستے کا ${continueCourse.progress}٪ حصہ مکمل کر لیا ہے! اگلا چیلنج کھیلیں اور ستارے حاصل کریں۔` 
                    : `You already cleared ${continueCourse.progress}% of this path! Play the next happy challenge to score star achievements.`}
                </p>
                <div className="w-full bg-slate-200/50 rounded-full h-3 max-w-md overflow-hidden flex">
                  <div className="bg-yellow-400 h-full" style={{ width: `${continueCourse.progress}%` }} />
                </div>
              </div>

              <div className="flex md:justify-end">
                <button
                  id="student-resume-course-btn"
                  onClick={() => onStartCourse(continueCourse.id)}
                  className={`px-8 py-4 font-extrabold rounded-full shadow-lg transform active:scale-95 transition-all text-base inline-flex items-center gap-2 font-fun ${
                    isYounger 
                      ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                      : 'bg-yellow-400 hover:bg-yellow-300 text-slate-900'
                  }`}
                >
                  {language === 'ur' ? "سبق شروع کریں" : "Play Next Lesson"}
                  <Play className={`w-5 h-5 fill-current ${language === 'ur' ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Enrolled Courses Grid with Age Adaptive Styles */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900 font-fun flex items-center gap-2">
              🧭 {language === 'ur' ? "آپ کے تعلیمی کمرے" : "Your Core Classrooms"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in font-sans">
              {relevantCourses.map((course) => (
                <div
                  key={course.id}
                  className={`bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                    isYounger ? 'ring-4 ring-amber-100/50' : ''
                  }`}
                >
                  <div>
                    <div className="relative aspect-video bg-slate-100">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute top-3 left-3 bg-yellow-400 text-slate-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                        {language === 'ur' ? "عمر" : "Ages"} {course.ageGroup}
                      </div>
                    </div>

                    <div className="p-5 text-left space-y-3">
                      <h3 className="text-lg font-bold text-slate-900 font-fun leading-tight line-clamp-2">
                        {course.title}
                      </h3>
                      
                      {/* Interactive Progress Indicators */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                          <span>{language === 'ur' ? "سیکھنے کی پیش رفت" : "Adventure Progress"}</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                          <div 
                            className={`h-full rounded-full ${isYounger ? 'bg-amber-500' : 'bg-blue-600'}`} 
                            style={{ width: `${course.progress}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      id={`student-play-course-${course.id}`}
                      onClick={() => onStartCourse(course.id)}
                      className={`w-full py-3 font-extrabold rounded-2xl flex items-center justify-center gap-2 transition-all font-fun text-sm cursor-pointer ${
                        isYounger 
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-800' 
                          : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-current shrink-0" />
                      {course.progress === 100 
                        ? (language === 'ur' ? 'دوبارہ دیکھیں (۱۰۰٪)' : 'Play Again (100%)') 
                        : (language === 'ur' ? 'کلاس شروع کریں' : 'Resume Play')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Area: Badges list & live class calendar widget */}
          <div className="space-y-6">
            
            {/* Live Class Schedule Widget */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 font-fun mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                {language === 'ur' ? "براہِ راست کلاسز" : "Live Playground"}
              </h3>
              <div className="space-y-3 font-sans">
                {upcomingClasses.map((item, i) => (
                  <div key={i} className="p-3.5 bg-blue-50/50 hover:bg-blue-50 rounded-2xl border border-blue-100 transition-all text-left">
                    <span className="text-[10px] font-extrabold uppercase bg-blue-600 text-white px-2 py-0.5 rounded-md leading-none">
                      {item.status}
                    </span>
                    <h4 className="font-bold text-slate-900 mt-1.5 text-xs font-fun leading-tight">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {item.time}
                    </p>
                    <button 
                      onClick={() => alert(`Simulated Zoom Playground: Connecting securely to ${item.title}`)}
                      className="mt-2 text-[11px] font-bold text-blue-600 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      {language === 'ur' ? "کلاس میں شامل ہوں" : "Join Class Meeting"} <ChevronRight className={`w-3 h-3 ${language === 'ur' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges and Achievements Vault */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-left">
              <h3 className="text-lg font-bold text-slate-900 font-fun mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                {language === 'ur' ? "آپ کے اعزازی بیجز" : "Badge Vault"} ({currentStudent.badges.length})
              </h3>
              <div className="grid grid-cols-1 gap-3 font-sans">
                {currentStudent.badges.map((badge) => (
                  <div 
                    key={badge.id}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 flex items-center gap-3 transition-colors"
                  >
                    <div className="text-2xl">
                      {badge.icon === 'BookOpen' ? '📖' : badge.icon === 'Star' ? '⭐️' : badge.icon === 'Cpu' ? '💻' : badge.icon === 'Zap' ? '⚡' : '🧭'}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 font-fun">{badge.title}</h4>
                      <p className="text-[11px] text-slate-500">{badge.description}</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-0.5">
                        {language === 'ur' ? "انعام ملا" : "Unlocked"} {badge.dateEarned}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Reward Glow Pop-Up banner */}
      <AnimatePresence>
        {showRewardPop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-10 inset-x-6 mx-auto max-w-sm bg-yellow-400 text-slate-950 p-5 rounded-3xl shadow-2xl z-50 text-center space-y-2 border-4 border-white font-fun"
          >
            <div className="text-4xl animate-bounce">🌟🌟🌟</div>
            <h3 className="text-xl font-black">{language === 'ur' ? 'بہت خوب! +۱۵ ستارے!' : 'Yippe! +15 Gold Stars!'}</h3>
            <p className="text-xs font-semibold">
              {language === 'ur' 
                ? 'آپ نے اپنا روزانہ کا انعام حاصل کر لیا ہے اور مسلسل پڑھائی کا ہدف پورا کر لیا ہے!' 
                : 'You claimed your daily task and incremented your streak counter like a learning champion!'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Creator Select Modal */}
      <AnimatePresence>
        {showAvatarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-[32px] max-w-sm w-full shadow-2xl space-y-6 relative border border-slate-100 font-sans"
            >
              <div className="text-center space-y-2 border-b border-slate-100 pb-4">
                <h3 className="text-xl font-extrabold text-slate-900 font-fun">
                  {language === 'ur' ? "اپنا پسندیدہ کردار چنیں!" : "Choose Your Character!"}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  {language === 'ur' ? "کوئی بھی خوبصورت اوتار منتخب کریں۔" : "Pick a cool cartoon avatar that suits your path."}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {childAvatars.map((emoji, idx) => (
                  <button
                    key={idx}
                    id={`student-avatar-select-${idx}`}
                    onClick={() => handleSelectAvatar(emoji)}
                    className="aspect-square bg-slate-50 hover:bg-yellow-105 bg-yellow-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-205 border-slate-200 hover:border-yellow-400 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <button
                id="btn-close-avatar-modal"
                onClick={() => setShowAvatarModal(false)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm rounded-xl transition-colors font-fun cursor-pointer"
              >
                {language === 'ur' ? "بند کریں" : "Close Back"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
