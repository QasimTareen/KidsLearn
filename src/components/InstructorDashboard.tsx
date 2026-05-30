import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Megaphone, 
  PlusCircle, 
  Check, 
  Search, 
  TrendingUp, 
  Send, 
  Trash2,
  FileText,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { Course, StudentRosterItem, CourseReport } from '../types';
import { useLanguage } from '../LanguageContext';

interface InstructorDashboardProps {
  courses: Course[];
  studentRoster: StudentRosterItem[];
  courseReports: CourseReport[];
  onUploadLesson: (courseId: string, lessonTitle: string, duration: string, videoUrl: string) => void;
  teacherSpecialty?: string;
}

export default function InstructorDashboard({
  courses,
  studentRoster,
  courseReports,
  onUploadLesson,
  teacherSpecialty = "Mathematics",
}: InstructorDashboardProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'roster' | 'upload' | 'assessments' | 'announcements' | 'courses'>('roster');
  
  // Lesson uploader form states
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [lessonTitle, setLessonTitle] = useState('');
  const [duration, setDuration] = useState('08:00');
  const [youtubeUrl, setYoutubeUrl] = useState('https://www.youtube.com/embed/2_m97z_uM6Y');
  
  // Live roster search state
  const [rosterSearch, setRosterSearch] = useState('');
  
  // Static mock interactive submissions matching teacher's specialty subject
  const [submissions, setSubmissions] = useState([
    { id: 'sub-1', studentName: 'Li-Wei Chen', grade: 'Grade 8', subject: 'Mathematics', lesson: 'Square Roots 101', score: 100, status: 'Completed', submittedAt: 'Today, 10:15 AM' },
    { id: 'sub-2', studentName: 'Emma Watson', grade: 'Grade 9', subject: 'Science', lesson: 'Inertia & Newton', score: 50, status: 'Pending Review', submittedAt: 'Today, 9:30 AM' },
    { id: 'sub-3', studentName: 'Lucas Miller', grade: 'Grade 10', subject: 'Coding', lesson: 'Slices & Loops', score: 100, status: 'Pending Review', submittedAt: 'Yesterday, 4:12 PM' },
    { id: 'sub-4', studentName: 'Sophia Loren', grade: 'Grade 8', subject: 'Mathematics', lesson: 'Solve for X Equations', score: 100, status: 'Pending Review', submittedAt: 'Yesterday, 2:45 PM' },
  ]);

  // Live announcements list state
  const [announcements, setAnnouncements] = useState([
    { id: 'ann-1', title: language === 'ur' ? 'کل ریاضی کی کلاس کے لیے ایک سرخ سیب لائیں!' : 'Bring a shiny red apple to math tomorrow!', date: 'Today, 2:15 PM', views: 42 },
    { id: 'ann-2', title: language === 'ur' ? 'حروفِ تہجی کے بیجز کامیابی سے جاری ہو چکےہیں!' : 'New Alphabet badges are unlocked!', date: 'May 20, 2026', views: 89 },
  ]);
  const [newAnnTitle, setNewAnnTitle] = useState('');

  const filteredRoster = studentRoster.filter(s => 
    s.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
    s.parentName.toLowerCase().includes(rosterSearch.toLowerCase())
  );

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim()) return;
    setAnnouncements([
      { id: Date.now().toString(), title: newAnnTitle, date: 'Just now', views: 0 },
      ...announcements
    ]);
    setNewAnnTitle('');
    
    if (language === 'ur') {
      alert('کامیابی! نیا تعلیمی اعلان کامیابی سے پبلش کر دیا گیا ہے۔');
    } else {
      alert('Success! Custom Announcement published to student & parent billboards.');
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !selectedCourseId) return;
    
    onUploadLesson(selectedCourseId, lessonTitle, duration, youtubeUrl);
    setLessonTitle('');
    
    if (language === 'ur') {
      alert('بہت خوب! آپ کا نیا سیکھنے کا سبق کامیابی سے پبلش ہو چکا ہے۔');
    } else {
      alert('Awesome! Your lesson is uploaded, and the syllabus index is updated catalog-wide.');
    }
  };

  const handleReviewSubmission = (id: string) => {
    setSubmissions(prev => 
      prev.map(sub => sub.id === id ? { ...sub, status: 'Approved / Checked 🌟' } : sub)
    );
    
    if (language === 'ur') {
      alert("ٹیسٹ کامیابی سے چیک کر کے ستارے تفویض کر دیے گئے ہیں! 🏆");
    } else {
      alert("Submission checked successfully ! Student performance records synced and stars awarded 🏆");
    }
  };

  return (
    <div className={`p-6 bg-slate-50 min-h-screen text-slate-800 ${language === 'ur' ? 'font-urdu' : ''}`}>
      <div className="max-w-7xl mx-auto space-y-8 text-left">
        
        {/* Title workspace banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
              👨‍🏫 {language === 'ur' ? "اکیڈمی ایڈوائزر سینٹر" : "Academy Advisor Center"}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-2 font-display">
              {language === 'ur' ? "اساتذہ پورٹل" : "Instructor Panel"}: <span className="text-blue-600">{language === 'ur' ? "سلیبس روم" : "Teacher’s Desk"}</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium font-sans mt-1">
              {language === 'ur' ? "مضمون کی مہارت:" : "Subject Focus:"} <span className="text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md font-bold">{teacherSpecialty === "Mathematics" && language === 'ur' ? "ریاضی" : teacherSpecialty} {language === 'ur' ? "ماہرِ مضمون" : "Specialist"}</span>. {language === 'ur' ? "حل کردہ ٹیسٹ چیک کریں، نیا سلیبس شامل کریں، اور ہوم ورک تفویض کریں۔" : "Review assessment submissions, create custom syllabi, and set homework."}
            </p>
          </div>

          <div className="flex gap-2">
            <span className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 font-sans">
              <Calendar className="w-4 h-4 text-yellow-700 shrink-0" /> {language === 'ur' ? "تعلیمی سال: گرمیاں ۲۰۲۶" : "Active Term: Summer 2026"}
            </span>
          </div>
        </div>

        {/* Stats counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="bg-blue-105 bg-blue-50 text-blue-600 p-4 rounded-2xl text-2xl">👨‍👩‍👧‍👦</div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{language === 'ur' ? "کل داخلہ شدہ بچے" : "Total Enrolled Kids"}</p>
              <p className="text-3xl font-black text-slate-900 font-fun">544 {language === 'ur' ? "طلباء" : "Students"}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="bg-green-105 bg-green-50 text-green-600 p-4 rounded-2xl text-2xl">🎓</div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{language === 'ur' ? "فعال نصاب" : "Target Teaching Paths"}</p>
              <p className="text-3xl font-black text-slate-900 font-fun">{courses.length} {language === 'ur' ? "کورسز" : "Courses"}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="bg-yellow-105 bg-yellow-50 text-yellow-600 p-4 rounded-2xl text-2xl text-yellow-550">⭐️</div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{language === 'ur' ? "اوسط امتحانی فیصد" : "Average Performance"}</p>
              <p className="text-3xl font-black text-slate-900 font-fun">91% Score</p>
            </div>
          </div>

          <div className="bg-indigo-100 text-indigo-600 p-4 rounded-3xl flex flex-col justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-700">{language === 'ur' ? "اگلی لائیو کلاس:" : "Next Live Class:"}</h4>
            <p className="text-sm font-bold mt-1 text-indigo-900 leading-tight">
              {teacherSpecialty === 'Coding' 
                ? (language === 'ur' ? 'کمپیوٹر کوڈنگ اور لوپس' : 'Scratch Loops & Logic') 
                : (language === 'ur' ? 'انٹرایکٹو فونکس کلاس' : 'Interactive Phonics Review')}
            </p>
            <span className="text-[10px] text-indigo-500 mt-2 font-extrabold flex items-center gap-1">
              ⏰ {language === 'ur' ? "الٹی گنتی: ۱۵ گھنٹے" : "Countdown: 15h 24m"}
            </span>
          </div>
        </div>

        {/* Dashboard sub-panels structure */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Tab switches */}
          <div className="lg:col-span-1 space-y-4 font-sans">
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              {[
                { 
                  id: 'roster', 
                  label: language === 'ur' ? '👥 طلباء کی لسٹ' : '👥 Student Roster', 
                  desc: language === 'ur' ? "فعال سرچ انڈیکس روم" : 'Realtime search index' 
                },
                { 
                  id: 'assessments', 
                  label: language === 'ur' ? '📝 کوئز ریویو' : '📝 Check Assessments', 
                  desc: language === 'ur' ? "بچوں کے حل کردہ ٹیسٹ دیکھیں" : 'Verify student submissions' 
                },
                { 
                  id: 'upload', 
                  label: language === 'ur' ? '📤 نیا سبق اپلوڈ' : '📤 Upload Video Lesson', 
                  desc: language === 'ur' ? "ویڈیو سلیبس شامل کریں" : 'Add video to syllabus' 
                },
                { 
                  id: 'courses', 
                  label: language === 'ur' ? '📊 مجموعی کارکردگی' : '📊 Course Performance', 
                  desc: language === 'ur' ? "کلاس کورسز رزلٹ معلومات" : 'Completion statistics' 
                },
                { 
                  id: 'announcements', 
                  label: language === 'ur' ? '📢 پبلش اعلانات' : '📢 Publish Bulletins', 
                  desc: language === 'ur' ? "ڈیش بورڈ پر نوٹس بورڈ" : 'Post daily bulletins' 
                }
              ].map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`instructor-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full p-4 rounded-2xl text-left block transition-all cursor-pointer ${
                      active 
                        ? 'bg-blue-600 text-white shadow shadow-blue-500/20' 
                        : 'hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <p className={`text-sm font-bold font-fun ${active ? 'text-white' : 'text-slate-800'}`}>
                      {tab.label}
                    </p>
                    <p className={`text-[11px] mt-0.5 ${active ? 'text-blue-100' : 'text-slate-400'}`}>
                      {tab.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active section container */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: Real-time search student roster */}
              {activeTab === 'roster' && (
                <motion.div
                  key="roster"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 font-sans">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <h3 className="text-xl font-bold font-fun text-slate-900">
                        👥 {language === 'ur' ? "کلاسروم کے طلباء کا انڈیکس" : "Student Enrollment Roster Table"}
                      </h3>

                      {/* Search box overlay */}
                      <div className="relative w-full sm:w-64">
                        <input
                          type="text"
                          value={rosterSearch}
                          onChange={(e) => setRosterSearch(e.target.value)}
                          placeholder={language === 'ur' ? "طالب علم یا والدین کا نام..." : "Search student or parent..."}
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20"
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 shrink-0" />
                      </div>
                    </div>

                    <div className="overflow-hidden border border-slate-200 rounded-2xl">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold border-b border-slate-200">
                          <tr>
                            <th className="p-4">{language === 'ur' ? "طالب علم کا نام" : "Student Name"}</th>
                            <th className="p-4">{language === 'ur' ? "عمر کا سال" : "Age Bracket"}</th>
                            <th className="p-4">{language === 'ur' ? "سرپرست / رابطہ" : "Guardian / Contact"}</th>
                            <th className="p-4">{language === 'ur' ? "مکمل شدہ اسباق" : "Completion Index"}</th>
                            <th className="p-4">{language === 'ur' ? "اوسط فیصد" : "Average Quiz Acc"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                          {filteredRoster.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 font-black text-slate-900 flex items-center gap-2">
                                <span className="text-base">👦</span>
                                {item.name}
                              </td>
                              <td className="p-4">
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">
                                  {language === 'ur' ? "عمر" : "Ages"} {item.ageGroup}
                                </span>
                              </td>
                              <td className="p-4 text-slate-500 font-bold">{item.parentName}</td>
                              <td className="p-4">
                                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-bold font-mono">
                                  {item.lessonsCompleted}/{item.totalLessons} {language === 'ur' ? "اسباق" : "Lessons"}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className="font-extrabold text-blue-600 font-fun text-sm">
                                  {item.avgQuizScore}% Correct
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB: Check assessments submitted by students */}
              {activeTab === 'assessments' && (
                <motion.div
                  key="assessments"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 animate-fade-in"
                >
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 font-sans">
                    <div>
                      <h3 className="text-xl font-bold font-fun text-slate-900 flex items-center gap-2">
                        📝 {language === 'ur' ? "حل شدہ تعلیمی ٹیسٹ اور پرچے" : "Review & Check Student Assessments"}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {language === 'ur' 
                          ? "بچوں کی طرف سے بھیجے گئے ہوم ورک اور کوئز کے نتائج چیک کر کے پاس کریں۔" 
                          : "Here are current quiz and homework submissions matching grades. Reject or verify them to issue stars."}
                      </p>
                    </div>

                    <div className="overflow-hidden border border-slate-200 rounded-2xl">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold border-b border-slate-200">
                          <tr>
                            <th className="p-4">{language === 'ur' ? "طالب علم" : "Student"}</th>
                            <th className="p-4">{language === 'ur' ? "کلاس" : "Grade"}</th>
                            <th className="p-4">{language === 'ur' ? "سبق کا نام" : "Lesson Module"}</th>
                            <th className="p-4">{language === 'ur' ? "مضمون" : "Subject"}</th>
                            <th className="p-4">{language === 'ur' ? "سکور" : "Quiz Score"}</th>
                            <th className="p-4">{language === 'ur' ? "تصدیقی کام" : "Routing Action"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-805">
                          {submissions.map((sub) => (
                            <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 font-bold text-slate-900 flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shrink-0"></span>
                                {sub.studentName}
                              </td>
                              <td className="p-4 text-slate-500 font-bold">{sub.grade}</td>
                              <td className="p-4 font-bold max-w-[120px] truncate">{sub.lesson}</td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  sub.subject === 'Mathematics' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                }`}>
                                  {sub.subject === "Mathematics" && language === 'ur' ? "ریاضی" : sub.subject}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`font-mono text-sm font-extrabold ${sub.score >= 90 ? 'text-emerald-600' : 'text-amber-500'}`}>
                                  {sub.score}% Correct
                                </span>
                              </td>
                              <td className="p-4">
                                {sub.status.includes('Approved') ? (
                                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full text-[10px]">
                                    <CheckCircle className="w-3.5 h-3.5 shrink-0" /> {language === 'ur' ? "مکمل اور پاس شدہ" : "Checked & Passed"}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleReviewSubmission(sub.id)}
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black rounded-lg shadow-sm font-fun transition-colors cursor-pointer"
                                  >
                                    {language === 'ur' ? "ٹیسٹ پاس کریں" : "Verify Lesson"}
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: Upload play lesson form */}
              {activeTab === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 font-sans">
                    <div>
                      <h3 className="text-xl font-bold font-fun text-slate-900">
                        📤 {language === 'ur' ? "نیا ویڈیو لیکچر سبق شامل کریں" : "Provision New Video Lesson"}
                      </h3>
                      <p className="text-xs text-slate-400 font-semibold mt-1">
                        {language === 'ur' 
                          ? "اسٹوڈنٹس کے تعلیمی ڈیش بورڈ پر نیا تعلیمی سبق فورا شامل کرنے کا فارم۔" 
                          : "Use this playground form to upload a new video. The lesson is added to the database, instantly expanding the student syllabus."}
                      </p>
                    </div>

                    <form onSubmit={handleUploadSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 text-left">
                          <label className="text-xs font-extrabold text-slate-500">{language === 'ur' ? "مطلوبہ کورس منتخب کریں" : "Destination Pathway Course"}</label>
                          <select
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 outline-none p-3 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20"
                          >
                            {courses.map(c => (
                              <option key={c.id} value={c.id}>{c.title} ({language === 'ur' ? "عمر" : "Age"} {c.ageGroup})</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5 text-left">
                          <label className="text-xs font-extrabold text-slate-500">{language === 'ur' ? "سبق کا عنوان / نام" : "Lesson Zone Title"}</label>
                          <input
                            type="text"
                            value={lessonTitle}
                            onChange={(e) => setLessonTitle(e.target.value)}
                            placeholder={language === 'ur' ? "مثال: حروفِ تہجی کی کہانی" : "e.g. Crazy letter Z or Star loops"}
                            required
                            className="w-full bg-slate-50 border border-slate-200 outline-none p-3 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>

                        <div className="space-y-1.5 text-left">
                          <label className="text-xs font-extrabold text-slate-500">{language === 'ur' ? "ویڈیو ڈیوریشن" : "Video Duration"}</label>
                          <input
                            type="text"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="e.g. 08:30"
                            required
                            className="w-full bg-slate-50 border border-slate-200 outline-none p-3 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>

                        <div className="space-y-1.5 text-left">
                          <label className="text-xs font-extrabold text-slate-500">{language === 'ur' ? "یوٹیوب ویڈیو ایمبیڈ لنک" : "Interactive Video Embed URL Link"}</label>
                          <input
                            type="text"
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            placeholder="Embed link, e.g. https://www.youtube.com/embed/2_m97z_uM6Y"
                            required
                            className="w-full bg-slate-50 border border-slate-200 outline-none p-3 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow font-fun flex items-center gap-1.5 cursor-pointer"
                        >
                          <PlusCircle className="w-4 h-4 shrink-0" /> {language === 'ur' ? "ویڈیو کلاس میں پبلش کریں" : "Deploy Video to Classroom"}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: Course Analytics overview */}
              {activeTab === 'courses' && (
                <motion.div
                  key="courses"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 font-sans">
                    <h3 className="text-xl font-bold font-fun text-slate-900 border-b border-slate-100 pb-3">
                      📈 {language === 'ur' ? "اکیڈمک کارکردگی اور رزلٹ موازنہ" : "Academic Performance & Completions"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {courseReports.map((report) => (
                        <div key={report.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/50 text-left space-y-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-extrabold text-sm text-slate-900 font-fun leading-tight">{report.title}</h4>
                            <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded uppercase leading-none">
                              {report.enrolledStudents} {language === 'ur' ? "داخلہ یافتہ" : "Enrolled"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 border-t border-slate-200/50 pt-3 text-xs">
                            <div>
                              <p className="text-slate-400 font-bold uppercase text-[9px]">{language === 'ur' ? "کوئز کی اوسط درستگی" : "Quiz Accuracy"}</p>
                              <p className="text-base font-black text-slate-800 font-fun mt-1">{report.avgQuizScore}% Accurate</p>
                            </div>
                            <div>
                              <p className="text-slate-400 font-bold uppercase text-[9px]">{language === 'ur' ? "کورس مکمل فیصد" : "Completion Quotient"}</p>
                              <p className="text-base font-black text-blue-600 font-fun mt-1">{report.completionRate}% Done</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: General Announcements bulletins */}
              {activeTab === 'announcements' && (
                <motion.div
                  key="announcements"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 font-sans">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-xl font-bold font-fun text-slate-900">
                        📢 {language === 'ur' ? "نوٹس بورڈ پینل" : "Bulletins Board"}
                      </h3>
                      <p className="text-xs text-slate-400 font-semibold mt-1">
                        {language === 'ur' 
                          ? "طلباء اور والدین کو ضروری اعلانات پہنچانے کا فوری پینل۔" 
                          : "Post direct notification blocks that parents and child dashboards will instantly preview."}
                      </p>
                    </div>

                    {/* Announcement input form */}
                    <form onSubmit={handleCreateAnnouncement} className="flex gap-2">
                      <input
                        type="text"
                        value={newAnnTitle}
                        onChange={(e) => setNewAnnTitle(e.target.value)}
                        placeholder={language === 'ur' ? "اعلانات کا مضمون یہاں لکھیں..." : "Write dynamic announcements here..."}
                        required
                        className="flex-1 bg-slate-50 border border-slate-200 outline-none p-3 rounded-xl text-xs placeholder-slate-400 font-medium font-sans focus:ring-2 focus:ring-blue-500/20"
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-md cursor-pointer transition-all shrink-0 font-fun text-xs font-bold"
                      >
                        {language === 'ur' ? "پبلش کریں 🚀" : "Publish Bulletin 🚀"}
                      </button>
                    </form>

                    {/* Announcements grid log */}
                    <div className="space-y-3 pt-3">
                      {announcements.map((bulletin) => (
                        <div key={bulletin.id} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-colors flex items-center justify-between text-xs font-semibold">
                          <div className="flex items-center gap-3">
                            <Megaphone className="w-5 h-5 text-blue-500 shrink-0" />
                            <div className="text-left space-y-1">
                              <p className="text-slate-800 font-bold font-fun leading-tight">{bulletin.title}</p>
                              <p className="text-[10px] text-slate-400">{language === 'ur' ? "تاریخ اشاعت:" : "Date posted:"} {bulletin.date}</p>
                            </div>
                          </div>

                          <span className="text-[10px] bg-slate-200/50 text-slate-600 px-2 py-1 rounded">
                            👁️ {bulletin.views} {language === 'ur' ? "ویوز" : "Views"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
