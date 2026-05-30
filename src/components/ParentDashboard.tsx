import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Send, CheckCircle, Download, FileText, PlusCircle, Star, Users, Briefcase } from 'lucide-react';
import { StudentProfile, Course, InstructorMessage, PaymentInvoice } from '../types';
import { useLanguage } from '../LanguageContext';

interface ParentDashboardProps {
  students: StudentProfile[];
  currentStudentId: string;
  onChangeStudent: (id: string) => void;
  courses: Course[];
  messages: InstructorMessage[];
  onSendMessage: (msg: string) => void;
  paymentHistory: PaymentInvoice[];
  onEnrollCourse: (studentId: string, courseId: string, price: number) => void;
}

export default function ParentDashboard({
  students,
  currentStudentId,
  onChangeStudent,
  courses,
  messages,
  onSendMessage,
  paymentHistory,
  onEnrollCourse,
}: ParentDashboardProps) {
  const { t, language } = useLanguage();
  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];
  const [typedMessage, setTypedMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'progress' | 'enroll' | 'invoice' | 'message'>('progress');
  const [showCertificateModal, setShowCertificateModal] = useState<string | null>(null);
  
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom when message arrives
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Find courses student is already enrolled in
  const enrolledCourseIds = courses.filter((c) => {
    if (currentStudent.ageGroup === '3-5' || currentStudent.ageGroup === '6-7') {
      return c.ageGroup === '3-5' || c.ageGroup === '6-7';
    } else {
      return c.ageGroup === '8-10' || c.ageGroup === '11-12';
    }
  }).map(c => c.id);

  // Other school courses parents is browsing to enroll the child in
  const availableBuyCourses = courses.filter(c => !enrolledCourseIds.includes(c.id));

  // Determine earned certificates
  const completedCourses = courses.filter(c => enrolledCourseIds.includes(c.id) && c.progress === 100);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    onSendMessage(typedMessage);
    setTypedMessage('');
  };

  const handleEnrollClick = (course: Course) => {
    const price = course.level === 'Hard' ? 69.00 : 49.00;
    onEnrollCourse(currentStudent.id, course.id, price);
    
    if (language === 'ur') {
      alert(`کامیابی! آپ نے ${currentStudent.name} کا داخلہ "${course.title}" میں کر دیا ہے۔ $${price.toFixed(2)} کا رسید بل نیچے شامل کر دیا گیا ہے اور یہ کورس بچے کے فلیش ڈیش بورڈ پر لائیو کر دیا گیا ہے۔`);
    } else {
      alert(`Success! Enrolled ${currentStudent.name} in "${course.title}". A tuition invoice of $${price.toFixed(2)} has been appended, and the module is now live on their dashboard.`);
    }
  };

  return (
    <div className={`p-6 bg-slate-50 min-h-screen text-slate-800 ${language === 'ur' ? 'font-urdu' : ''}`}>
      <div className="max-w-7xl mx-auto space-y-8 text-left">
        
        {/* Page title header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
              👩‍👦 {language === 'ur' ? "سرپرست کنٹرول ورک سپیس" : "Guardian Control Panel"}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-2 font-display">
              {language === 'ur' ? "والدین پورٹل" : "Parent Portal"}: <span className="text-blue-600">{language === 'ur' ? "کڈز سپیر" : "KidsLearn Tech"}</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              {language === 'ur' 
                ? "بچوں کی کارکردگی پر نظر رکھیں، نئے نصاب کے کورسز خریدیں، اور اساتذہ سے براہِ راست رابطہ کریں۔" 
                : "Monitor milestones, purchase interactive content modules, and communicate with instructors."}
            </p>
          </div>

          {/* Rapid Child Switcher Widget */}
          <div className="flex flex-col items-start gap-1 p-1 bg-slate-50 rounded-2xl border border-slate-200 font-sans">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-3 pt-1">
              {language === 'ur' ? "بچے کی کارکردگی کا موازنہ:" : "Quick Child Progress View:"}
            </span>
            <div className="flex gap-2 p-2">
              {students.map((child) => {
                const isSelected = child.id === currentStudentId;
                return (
                  <button
                    key={child.id}
                    id={`parent-select-child-${child.id}`}
                    onClick={() => onChangeStudent(child.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-blue-600 text-white shadow-md scale-105' 
                        : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-base">{child.avatar}</span>
                    <span>{child.name} ({language === 'ur' ? "گریڈ" : "Grade"} {child.grade})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar + Tab controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation vertical list */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              {[
                { 
                  id: 'progress', 
                  label: language === 'ur' ? '📊 بچوں کی اچیومنٹس' : '📊 Children Milestones', 
                  desc: language === 'ur' ? 'کورسز کے درجات اور گراف' : 'Grades & completion curves' 
                },
                { 
                  id: 'enroll', 
                  label: language === 'ur' ? '🛍️ کورسز میں داخلہ' : '🛍️ Course Enrollment', 
                  desc: language === 'ur' ? 'نئے جدید نصاب چنیں اور خریدیں' : 'Securely browse & buy' 
                },
                { 
                  id: 'message', 
                  label: language === 'ur' ? '💬 اساتذہ سے چیٹ' : '💬 Teacher Messaging', 
                  desc: language === 'ur' ? 'براہِ راست ڈسکشن چیمبر' : 'Direct chat channel' 
                },
                { 
                  id: 'invoice', 
                  label: language === 'ur' ? '💳 رسیدیں اور ادائیگی' : '💳 Payment History', 
                  desc: language === 'ur' ? "سابقہ ماہانہ بلز اور فیس ہسٹری" : 'Past invoices & receipts' 
                }
              ].map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`parent-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full p-3.5 rounded-2xl text-left block transition-all cursor-pointer ${
                      active 
                        ? 'bg-blue-600 text-white shadow' 
                        : 'hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <p className={`text-sm font-bold font-fun ${active ? 'text-white' : 'text-slate-800'}`}>
                      {tab.label}
                    </p>
                    <p className={`text-[11px] mt-0.5 ${active ? 'text-blue-105 text-blue-200' : 'text-slate-400'}`}>
                      {tab.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Quick stats on the currently viewed child */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-md space-y-4 relative overflow-hidden font-sans">
              <div className="absolute top-1 right-2 text-7xl opacity-5 select-none font-fun animate-pulse">🏅</div>
              <h3 className="font-extrabold font-fun text-base text-yellow-400 flex items-center gap-1.5">
                <Star className="w-5 h-5 text-yellow-400 shrink-0" />
                {language === 'ur' ? "کل سنہرے ستارے" : "Active Stars Score"}
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-xs text-indigo-200">
                  <span>{language === 'ur' ? "عمر کا گروپ:" : "Student Track:"}</span>
                  <span className="font-bold text-white uppercase">{currentStudent.ageGroup} {language === 'ur' ? "سال" : "Tracks"}</span>
                </div>
                <div className="flex justify-between text-xs text-indigo-200">
                  <span>{language === 'ur' ? "بچت ستارے:" : "Golden Stars:"}</span>
                  <span className="font-bold text-white text-sm">{currentStudent.stars} 🌟</span>
                </div>
              </div>

              {completedCourses.length > 0 ? (
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-350">{language === 'ur' ? "جاری کردہ اسناد" : "Earned Diplomas"}</h4>
                  {completedCourses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setShowCertificateModal(c.title)}
                      className="w-full text-left p-2.5 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer"
                    >
                      <span className="truncate pr-2">🎓 {c.title}</span>
                      <Download className="w-4 h-4 text-yellow-300 shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="pt-3 border-t border-white/10 text-[11px] text-indigo-200 text-center">
                  {language === 'ur' ? "ابھی تک کوئی نصاب ۱۰۰٪ مکمل نہیں ہوا تاکہ آفیشل سند جاری ہو۔" : "No modules fully 100% completed yet to unlock diplomas."}
                </div>
              )}
            </div>
          </div>

          {/* Active Panel View */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: Progress Milestones Dashboard */}
              {activeTab === 'progress' && (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-xl font-bold font-fun text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1.5">
                      📈 {language === 'ur' ? `${currentStudent.name} کی پڑھائی کا ریکارڈ` : `${currentStudent.name}’s Learning Progression`}
                    </h3>

                    {/* Simulating per-child progress charts */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                      <div className="bg-slate-50 p-4 rounded-2xl text-left">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          {language === 'ur' ? "اسباق کی پیش رفت" : "Lesson Progress"}
                        </span>
                        <p className="text-2xl font-black text-slate-800 font-fun mt-1">2 / 4</p>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                          {language === 'ur' ? "آج مکمل حروف تہجی اور گنتی مشق۔" : "Completed letter sets A & B today."}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl text-left">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          {language === 'ur' ? "کوئز کے درست جوابات" : "Avg Quiz Accuracy"}
                        </span>
                        <p className="text-2xl font-black text-blue-600 font-fun mt-1">94% Accuracy</p>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                          {language === 'ur' ? "ٹیکنیکل صلاحیت اور فونکس ٹیسٹ مکمل۔" : "Stellar performance on phonics."}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl text-left">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          {language === 'ur' ? "کل تعلیمی وقت" : "Total Core Time"}
                        </span>
                        <p className="text-2xl font-black text-slate-800 font-fun mt-1">
                          {currentStudent.completedHours} {language === 'ur' ? "گھنٹے" : "Hours"}
                        </p>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                          {language === 'ur' ? "ویڈیو اور ڈیجیٹل پڑھائی وقت کا تخمینہ۔" : "Active engagement counter."}
                        </p>
                      </div>
                    </div>

                    {/* Progress tracking details item */}
                    <div className="space-y-4 pt-2 font-sans">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                        {language === 'ur' ? "نصاب کے بنیادی کورس کی تفصیلات" : "Individual Course Curves"}
                      </h4>
                      
                      {courses.filter(c => {
                        if (currentStudent.ageGroup === '3-5' || currentStudent.ageGroup === '6-7') {
                          return c.ageGroup === '3-5' || c.ageGroup === '6-7';
                        } else {
                          return c.ageGroup === '8-10' || c.ageGroup === '11-12';
                        }
                      }).map((course) => (
                        <div key={course.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                          <div className="space-y-1">
                            <h5 className="font-bold text-slate-900 text-sm font-fun">{course.title}</h5>
                            <p className="text-xs text-slate-500">{language === 'ur' ? "نگرانِ استاد:" : "Instructor:"} {course.instructorName}</p>
                          </div>
                          
                          <div className="w-full sm:w-48 space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-600">
                              <span>{course.progress}% {language === 'ur' ? "سیکھ چکے ہیں" : "Completed"}</span>
                              <span className="text-blue-600">{course.progress === 100 ? (language === 'ur' ? '⭐ فائنل مہر شدہ' : '⭐ Completed!') : (language === 'ur' ? 'جاری ہے' : 'In Progress')}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
                              <div className="bg-blue-600 h-full" style={{ width: `${course.progress}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Completed Certificates banner */}
                    <div className="bg-blue-50/50 border border-blue-105 border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
                      <div className="flex items-center gap-3 text-left">
                        <div className="text-3xl shrink-0">������</div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{language === 'ur' ? "آفیشل تعلیمی اسناد" : "Official Course Diplomas"}</h4>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5">
                            {language === 'ur' 
                              ? "سرٹیفکیٹ خودکار طریقے سے فورا جاری ہوتا ہے جب سبق ۱۰۰٪ مکمل ہو جائے۔" 
                              : "Completion certificates are generated instantly when course progress reaches 100%."}
                          </p>
                        </div>
                      </div>
                      
                      {completedCourses.length > 0 ? (
                        <button
                          onClick={() => setShowCertificateModal(completedCourses[0].title)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-4 h-4 shrink-0" /> {language === 'ur' ? "سند حاصل کریں" : "View Emma’s Diploma"}
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-right">
                          {language === 'ur' ? "تکمیل کا انتظار" : "Pending completion"}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: Secure Course Enrollment Catalog */}
              {activeTab === 'enroll' && (
                <motion.div
                  key="enroll"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 animate-fade-in"
                >
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-xl font-bold font-fun text-slate-900 flex items-center gap-2">
                        🛍️ {language === 'ur' ? `نصاب داخلہ چیمبر (${currentStudent.name})` : `Explore & Purchase Modules (${currentStudent.name})`}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        {language === 'ur' 
                          ? "جدید سمارٹ کورسز میں بچوں کو داخل کریں تاکہ اکیڈمک اور ذہنی نشوونما تیز ہو۔" 
                          : "Enroll your child in additional curriculums safely. The course is provisioned immediately."}
                      </p>
                    </div>

                    {availableBuyCourses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 font-sans">
                        {availableBuyCourses.map((course) => {
                          const price = course.level === 'Hard' ? 69 : 49;
                          return (
                            <div key={course.id} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/60 p-5 flex flex-col justify-between text-left space-y-4">
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="bg-blue-105 bg-blue-100 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase font-fun">
                                    🐣 {language === 'ur' ? "عمر" : "Age"} {course.ageGroup}
                                  </span>
                                  <span className="text-lg font-black text-slate-900 font-fun">
                                    ${price}.00
                                  </span>
                                </div>

                                <h4 className="text-base font-extrabold text-slate-900 font-fun leading-tight">
                                  {course.title}
                                </h4>
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                  {course.description}
                                </p>
                              </div>

                              <button
                                id={`parent-enroll-btn-${course.id}`}
                                onClick={() => handleEnrollClick(course)}
                                className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-extrabold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5 font-fun cursor-pointer"
                              >
                                <PlusCircle className="w-4 h-4 shrink-0" /> {language === 'ur' ? "داخلہ فارم بھیجیں" : `Enroll ${currentStudent.name}`}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200 font-sans">
                        <p className="font-fun text-lg font-bold text-indigo-600">
                          {language === 'ur' ? "شاندار! ✨" : "Hooray! ✨"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {language === 'ur' ? "بچے تمام دستیاب کورسز میں کامیابی سے داخلہ لے چکے ہیں!" : "This child is enrolled in all courses matching their age track."}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 3: Instructor Direct Messenger Chat */}
              {activeTab === 'message' && (
                <motion.div
                  key="message"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[500px] justify-between">
                    
                    {/* Instructor header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-left font-sans">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-700 font-black rounded-lg flex items-center justify-center text-xl">
                          👩‍🏫
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 font-fun">
                            {language === 'ur' ? "پروفیسر سارہ اور تعلیمی پینل" : "Sarah & David (Advisors)"}
                          </h4>
                          <p className="text-[10px] font-bold text-green-600">
                            ● {language === 'ur' ? "اساتذہ آن لائن اور مدد کے لئے حاضر ہیں" : "Instructors Online & Ready to Assist"}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-semibold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        {language === 'ur' ? "کڈز اساتذہ" : "Leo & Emma’s Teachers"}
                      </span>
                    </div>

                    {/* Chat Messages Stream */}
                    <div className="flex-1 overflow-y-auto py-4 space-y-4 px-1 max-h-[340px] font-sans">
                      {messages.map((msg) => {
                        const isStudent = msg.sender === 'Parent';
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isStudent ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[80%] rounded-2xl p-4 text-left ${
                              isStudent 
                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-205 border-slate-200'
                            }`}>
                              <p className="text-[10px] font-extrabold opacity-75 leading-none mb-1">
                                {msg.senderName} ({msg.timestamp})
                              </p>
                              <p className="text-xs font-medium leading-relaxed">{msg.content}</p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={chatBottomRef} />
                    </div>

                    {/* Action form to write a chat message */}
                    <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-100 pt-3">
                      <input
                        type="text"
                        value={typedMessage}
                        onChange={(e) => setTypedMessage(e.target.value)}
                        placeholder={language === 'ur' ? "استاد سے اپنے سوالات یہاں لکھ کر براہِ راست پوچھیں..." : "Type standard parents instructions or progress questions here..."}
                        className="flex-1 bg-slate-50 border border-slate-200 outline-none p-3 rounded-xl text-xs placeholder-slate-400 font-medium font-sans focus:ring-2 focus:ring-blue-500/20"
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-md cursor-pointer transition-all shrink-0"
                      >
                        <Send className="w-4 h-4 shrink-0" />
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: Tuition Payments Invoice logs */}
              {activeTab === 'invoice' && (
                <motion.div
                  key="invoice"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-xl font-bold font-fun text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      {language === 'ur' ? "ٹیوشن رسیدیں اور چالان بوکس" : "Tuition Invoices & Renewals"}
                    </h3>

                    <div className="overflow-hidden border border-slate-200 rounded-2xl font-sans">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold border-b border-slate-205">
                          <tr>
                            <th className="p-4">{language === 'ur' ? "رسید آئی ڈی" : "Invoice ID"}</th>
                            <th className="p-4">{language === 'ur' ? "کورس تفصیل" : "Item Catalog Desc"}</th>
                            <th className="p-4">{language === 'ur' ? "ادائیگی کی تاریخ" : "Payment Date"}</th>
                            <th className="p-4">{language === 'ur' ? "فیس کا حجم" : "Price"}</th>
                            <th className="p-4">{language === 'ur' ? "ادائیگی اسٹیٹس" : "Status"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {paymentHistory.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 font-mono font-bold text-slate-500">{invoice.id}</td>
                              <td className="p-4 text-slate-900 font-bold">{invoice.courseTitle}</td>
                              <td className="p-4 text-slate-500 font-bold">{invoice.date}</td>
                              <td className="p-4 text-slate-900 font-bold">${invoice.amount.toFixed(2)}</td>
                              <td className="p-4">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                  invoice.status === 'Paid' 
                                    ? 'bg-green-105 bg-green-100 text-green-700' 
                                    : 'bg-yellow-105 bg-yellow-100 text-yellow-700 animate-pulse'
                                }`}>
                                  {invoice.status === 'Paid' ? (language === 'ur' ? "ادا شدہ" : "Paid") : (language === 'ur' ? "باقی فیس" : "Pending")}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-4 bg-yellow-50/70 border border-yellow-100 rounded-xl text-left space-y-1 font-sans">
                      <h4 className="font-bold text-slate-900 text-xs font-fun">
                        {language === 'ur' ? "ماہانہ تعلیمی ماڈل سبسکرپشن" : "Recurring Subscription Model"}
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                        {language === 'ur' 
                          ? "ٹیوشن فیس خودکار طور پر ہر مہینے کی یکم تاریخ کو چالان کی جاتی ہے۔ آپ کسی بھی وقت پلان منسوخ کر سکتے ہیں۔" 
                          : "Subscriptions renew automatically on the 1st of each month. Change or cancel plans anytime without penalty."}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Course Diploma certificate modal popup viewer */}
      <AnimatePresence>
        {showCertificateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-[32px] max-w-2xl w-full shadow-2xl space-y-6 relative border-8 border-yellow-300 text-center"
            >
              {/* Star details */}
              <div className="absolute top-4 left-4 text-2xl">🌟</div>
              <div className="absolute top-4 right-4 text-2xl">🚀</div>
              <div className="absolute bottom-4 left-4 text-2xl">🏅</div>
              <div className="absolute bottom-4 right-4 text-2xl text-yellow-500">🏆</div>

              <div className="border-4 border-double border-blue-600 p-8 rounded-2xl bg-gradient-to-b from-yellow-50/20 via-white to-blue-50/10 space-y-6">
                
                <span className="text-sm font-black text-blue-600 uppercase tracking-widest block font-fun">
                  ★★★ {language === 'ur' ? "سرکاری رزلٹ گریجویشن سند" : "★★★ OFFICIAL graduation diploma ★★★"} ★★★
                </span>
                
                <h2 className="text-4xl font-extrabold font-display text-slate-900 tracking-tight leading-none font-fun">
                  {language === 'ur' ? "سرٹیفکیٹ آف میرٹ" : "Certificate of Achievement"}
                </h2>

                <p className="text-xs text-slate-400 font-bold italic">
                  {language === 'ur' ? "یہ سندِ امتیاز بامتیاز پیش کی جاتی ہے برائے" : "This certified award is proudly presented to"}
                </p>

                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-blue-700 underline decoration-yellow-400 font-fun leading-none capitalize">
                    {currentStudent.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold">
                    {language === 'ur' ? `گریڈ ${currentStudent.grade} • کڈز ہنر مند پاتھ وے ٹریک` : `Grade ${currentStudent.grade} • Pathway Explorer Track`}
                  </p>
                </div>

                <p className="text-xs text-slate-600 max-w-md mx-auto font-semibold leading-relaxed">
                  {language === 'ur' 
                    ? "سائنس، کمپیوٹر اور منطق کے میدان میں شاندار کوئز سو فیصد درستگی سے پاس کرنے اور تمام آزمائشی راکٹ لانچ کے مراحل کامیابی سے مکمل کرنے پر۔" 
                    : "For showing excellent scientific logic, passing all gravity module questions with 100% accuracy, and launching their virtual rocket launcher successfully."}
                </p>

                <div className="border-t border-dashed border-slate-200 pt-4 flex justify-between items-center text-left text-xs text-slate-500">
                  <div>
                    <p className="font-extrabold text-slate-700 text-[10px] uppercase font-mono">{language === 'ur' ? "تصدیقی تاریخ" : "Date Verified"}</p>
                    <p className="font-bold text-slate-950 font-fun">May 26, 2026</p>
                  </div>

                  <div className="text-right">
                    <p className="font-extrabold text-slate-700 text-[10px] uppercase font-mono">{language === 'ur' ? "چیف سپروائزر" : "Curriculum Lead"}</p>
                    <p className="font-bold text-slate-950 font-fun">David Lee, MSc</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    alert(language === 'ur' ? "ڈاؤن لوڈنگ اور ویکٹر پرنٹنگ کا موازنہ شروع کیا جا رہا ہے۔" : 'Simulating PDF rendering and printing flow... Diplomas are high resolution 300DPI vectors.');
                  }}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow transition-colors font-fun flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 shrink-0" /> {language === 'ur' ? "پی ڈی ایف فائل محفوظ کریں" : "Save PDF Copy"}
                </button>
                <button
                  onClick={() => setShowCertificateModal(null)}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-colors font-fun cursor-pointer"
                >
                  {language === 'ur' ? "بند کریں" : "Done, Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
