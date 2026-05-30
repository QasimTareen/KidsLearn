import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ur';

export interface Translations {
  [key: string]: {
    en: string;
    ur: string;
  };
}

export const translations: Translations = {
  // Navigation
  'nav.home': { en: '🌐 Homepage', ur: '🌐 ہوم پیج' },
  'nav.student': { en: '👦 Student Desk', ur: '👦 طالب علم کی ڈیسک' },
  'nav.player': { en: '📺 Course Playroom', ur: '📺 کورس پلے روم' },
  'nav.parent': { en: '👩 Parent Portal', ur: '👩 والدین کا پورٹل' },
  'nav.teacher': { en: '👨‍🏫 Teacher Desk', ur: '👨‍🏫 ٹیچر ڈیسک' },
  'nav.admin': { en: '🛡️ Founder HQ', ur: '🛡️ بانی کا ہیڈ کوارٹر' },
  'nav.unlock': { en: '⭐ Enter Classroom to unlock interactive dashboards!', ur: '⭐ انٹرایکٹو ڈیش بورڈز کو کھولنے کے لیے کلاس روم میں داخل ہوں!' },
  'nav.enter': { en: 'Enter Classroom', ur: 'کلاس روم میں داخل ہوں' },
  'nav.logout': { en: 'Logout classroom', ur: 'لاگ آؤٹ کریں' },
  'nav.selectedKid': { en: 'Selected Kid:', ur: 'منتخب بچہ:' },
  'nav.swapPlayer': { en: '🔄 Swap Player', ur: '🔄 کھلاڑی بدلیں' },

  // Homepage
  'home.badge': { en: 'Where Learning Feels Like Play!', ur: 'جہاں سیکھنا کھیل جیسا لگتا ہے!' },
  'home.heroTitle1': { en: 'Fun Courses That Grow With ', ur: 'دلچسپ کورسز جو بڑھتے ہیں ' },
  'home.heroTitle2': { en: 'Your Kids', ur: 'آپ کے بچوں کے ساتھ' },
  'home.heroDesc': { en: 'Connect your little genius with structured paths for coding, counting, reading & speaking. Designed by psychologists and top certified teachers.', ur: 'اپنے چھوٹے ذہین بچے کو کوڈنگ، گنتی، پڑھنے اور بولنے کے منظم راستوں سے جوڑیں۔ ماہرینِ نفسیات اور اعلیٰ تصدیق شدہ اساتذہ کا تیار کردہ۔' },
  'home.ctaStart': { en: 'Start Learning Now', ur: 'ابھی سیکھنا شروع کریں' },
  'home.ctaParent': { en: 'Parent Hub', ur: 'والدین کا مرکز' },
  'home.trustText': { en: '4.9/5 from 10,000+ happy kids and parents', ur: '4.9/5، 10,000 سے زائد خوش بچوں اور والدین کی طرف سے' },
  'home.previewCourse': { en: 'Age 3-5 Course', ur: '3 سے 5 سال کا کورس' },
  'home.previewTitle': { en: 'Phonics with Sarah Jenkins', ur: 'سارہ جینکنز کے ساتھ صوتیات (فو نکس)' },
  'home.exploreTitle': { en: 'Explore Classrooms', ur: 'کلاس رومز کو دریافت کریں' },
  'home.exploreDesc': { en: 'Pick an age group to see tailored playful adventure courses', ur: 'اپنی مرضی کے مطابق کورسز دیکھنے کے لیے عمر کا گروپ منتخب کریں' },
  'home.courseLevel': { en: 'Level:', ur: 'لیول:' },
  'home.courseAge': { en: 'Age:', ur: 'عمر:' },
  'home.courseLessons': { en: 'Lessons:', ur: 'اسباق:' },
  'home.noCoursesAvailable': { en: 'No courses found for this age group.', ur: 'اس عمر کے گروپ کے لیے کوئی کورس نہیں ملا۔' },

  // Filters (Ages)
  'age.all': { en: 'All Ages', ur: 'تمام عمریں' },
  'age.early': { en: 'Ages 3–5', ur: 'عمریں 3–5' },
  'age.starters': { en: 'Ages 6–7', ur: 'عمریں 6–7' },
  'age.builders': { en: 'Ages 8–10', ur: 'عمریں 8–10' },
  'age.champions': { en: 'Ages 11–12', ur: 'عمریں 11–12' },
  'age.desc.all': { en: 'Explorers', ur: 'دریافت کنندہ' },
  'age.desc.early': { en: 'Early Littles', ur: 'چھوٹے بچے' },
  'age.desc.starters': { en: 'Fun Starters', ur: 'بنیادی آغاز' },
  'age.desc.builders': { en: 'Skill Builders', ur: 'مہارت بنانے والے' },
  'age.desc.champions': { en: 'Champions', ur: 'چیمپئنز' },

  // Testimonials
  'testimonials.heading': { en: 'What Parents & Experts Say', ur: 'والدین اور ماہرین کیا کہتے ہیں' },
  'testimonials.subheading': { en: 'Real reviews from families on their learning adventures.', ur: 'سیکھنے کے سفر پر خاندانوں کے حقیقی تبصرے۔' },

  // Student Dashboard
  'student.welcome': { en: 'Welcome back, Little Scholar! Learn, Earn Stars & Unlock Badges!', ur: 'خوش آمدید، ننھے طالب علم! سیکھیں، ستارے کمائیں اور بیجز غیر مقفل کریں!' },
  'student.deskTitle': { en: 'Student Desk & Achievements', ur: 'طالب علم کی ڈیسک اور کامیابیاں' },
  'student.badgesTitle': { en: 'My Adventure Badges', ur: 'میرے مہم جوئی کے بیجز' },
  'student.badgesDesc': { en: 'Earned during learning quests', ur: 'سیکھنے کے دوران کمائے گئے' },
  'student.noBadges': { en: 'No badges earned yet. Complete your first lesson to earn one!', ur: 'ابھی تک کوئی بیج نہیں کمایا۔ سبق مکمل کر کے اپنا پہلا بیج حاصل کریں!' },
  'student.questsTitle': { en: 'My Enrolled Learning Quests', ur: 'میرے داخل شدہ سیکھنے کے اسباق' },
  'student.resume': { en: 'Resume Adventure', ur: 'سفر جاری رکھیں' },
  'student.noQuests': { en: 'Not started or enrolled yet. Speak to your parent to enroll in fun lessons!', ur: 'ابھی تک کوئی کھیل نہیں مہم شروع ہوئی ہے۔ سبق شروع کروانے کے لیے اپنے والدین سے کہیں!' },
  'student.stars': { en: 'Stars', ur: 'ستارے' },
  'student.streak': { en: 'Day Streak', ur: 'دن کا سلسلہ' },
  'student.completedHours': { en: 'Completed Hours', ur: 'مکمل شدہ گھنٹے' },
  'student.grade': { en: 'Grade', ur: 'گریڈ' },
  'student.academicProfile': { en: 'Academic Profile', ur: 'تعلیمی پروفائل' },

  // Parent Dashboard
  'parent.title': { en: 'Parent Dashboard & Portal', ur: 'والدین کا ڈیش بورڈ اور پورٹل' },
  'parent.description': { en: 'Manage enrollment, inspect lesson completions, review invoice logs and contact instructors.', ur: 'داخلہ کا انتظام کریں، سبق کی تکمیل کا جائزہ لیں، انوائس لاگز دیکھیں اور اساتذہ سے رابطہ کریں۔' },
  'parent.tabAccounts': { en: 'Children Accounts', ur: 'بچوں کے اکاؤنٹس' },
  'parent.tabBilling': { en: 'Family Billing Logs', ur: 'بلنگ کی معلومات' },
  'parent.tabRelay': { en: 'Direct Teacher Relay', ur: 'ٹیچر سے براه راست رابطہ' },
  'parent.enrollCourse': { en: 'Enroll New Course', ur: 'نئے کورس میں داخلہ لیں' },
  'parent.selectCourse': { en: 'Select Course to Purchase', ur: 'خریدنے کے لیے کورس منتخب کریں' },
  'parent.courseFee': { en: 'Course Fee', ur: 'کورس فیس' },
  'parent.purchaseEnroll': { en: 'Purchase & Enroll', ur: 'خریدیں اور داخلہ لیں' },
  'parent.invoiceHistory': { en: 'Invoice History', ur: 'انوائسز کی تاریخ' },
  'parent.invoiceId': { en: 'Invoice ID', ur: 'انوائس آئی ڈی' },
  'parent.amount': { en: 'Amount', ur: 'رقم' },
  'parent.status': { en: 'Status', ur: 'حیثیت' },
  'parent.date': { en: 'Date', ur: 'تاریخ' },
  'parent.lessonComp': { en: 'Lessons Completed', ur: 'سبق مکمل ہوئے' },
  'parent.streakDays': { en: 'Streak Days', ur: 'سلسلے کے دن' },
  'parent.placeholderMsg': { en: 'Send message to teacher...', ur: 'ٹیچر کو پیغام بھیجیں...' },
  'parent.sendReply': { en: 'Send Message', ur: 'پیغام بھیجیں' },
  'parent.statusPaid': { en: 'Paid', ur: 'ادا شدہ' },
  'parent.statusPending': { en: 'Pending', ur: 'التواء میں' },

  // Course Player
  'player.back': { en: 'Back to Student Desk', ur: 'طالب علم کی ڈیسک پر واپس جائیں' },
  'player.lessonsList': { en: 'Lessons List', ur: 'اسباق کی فہرست' },
  'player.watch': { en: 'Watch Video Lesson', ur: 'ویڈیو سبق دیکھیں' },
  'player.takeQuiz': { en: 'Take Quiz & Earn Stars!', ur: 'کوئز لیں اور ستارے کمائیں!' },
  'player.downloadWorksheet': { en: 'Worksheet Download', ur: 'ورک شیٹ ڈاؤن لوڈ کریں' },
  'player.noLessons': { en: 'This course does not have lessons scheduled yet.', ur: 'اس کورس کے اسباق ابھی شیڈول نہیں کیے گئے ہیں۔' },
  'player.noVideo': { en: 'Learning Playroom', ur: 'پلے روم سیکھنا' },
  'player.noVideoDesc': { en: 'Pick a lesson from the list left to start learning adventures!', ur: 'مہم جوئی شروع کرنے کے لیے بائیں فہرست سے ایک سبق منتخب کریں!' },
  'player.noQuiz': { en: 'No quiz has been added to this lesson yet!', ur: 'اس سبق میں ابھی تک کوئی کوئز شامل نہیں کیا گیا ہے!' },
  'player.lessonComplete': { en: 'Lesson completed', ur: 'سبق مکمل ہو گیا' },
  'player.markComp': { en: 'Mark as Completed', ur: 'سبق مکمل قرار دیں' },
  'player.congrats': { en: 'Congratulations! 🎉', ur: 'مبارک ہو! 🎉' },
  'player.quizFinishedDesc': { en: 'You completed this lesson quiz successfully!', ur: 'آپ نے اس سبق کا کوئز کامیابی سے مکمل کر لیا ہے!' },
  'player.closeQuiz': { en: 'Close Quiz', ur: 'کوئز بند کریں' },
  'player.correctAnswer': { en: 'Correct! You earned', ur: 'درست جواب! آپ نے کمائے' },
  'player.incorrect': { en: "Incorrect. Let's try again!", ur: 'غلط جواب۔ دوبارہ کوشش کریں!' },
  'player.submitAnswer': { en: 'Submit Answer', ur: 'جواب جمع کروائیں' },

  // Teacher Dashboard
  'teacher.title': { en: 'Instructor & Teacher Desk', ur: 'انسٹرکٹر اور ٹیچر ڈیش بورڈ' },
  'teacher.desc': { en: 'Draft custom lesson videos, manage pupil rosters, inspect learning graphs and propose new courses.', ur: 'حسب ضرورت سبق کی ویڈیوز بنائیں، طلباء کی فہرست کا انتظام کریں، اور نئے کورسز تجویز کریں۔' },
  'teacher.tabRoster': { en: 'Classroom Pupils Roster', ur: 'کلاس روم کے طلباء کی فہرست' },
  'teacher.tabGraphs': { en: 'Course Report Graphs', ur: 'کورس رپورٹ کے گراف' },
  'teacher.tabUploader': { en: 'Upload New Lesson Video', ur: 'نیا سبق اپ لوڈ کریں' },
  'teacher.specialty': { en: 'Teacher Specialty:', ur: 'ٹیچر کی مہارت:' },
  'teacher.lessonsCompleted': { en: 'Lessons completed:', ur: 'اسباق مکمل:' },
  'teacher.avgQuiz': { en: 'Avg Quiz Score:', ur: 'اوسط کوئز اسکور:' },
  'teacher.parentName': { en: 'Parent Name:', ur: 'والدین کا نام:' },
  'teacher.proposalsTitle': { en: 'Active Classroom Curriculum proposals', ur: 'موجودہ درسی کتب کی تجاویز' },
  'teacher.uploadTitle': { en: 'Upload New Lesson', ur: 'نیا سبق اپ لوڈ کریں' },
  'teacher.selectCourseOpt': { en: 'Select Channel/Course', ur: 'کورس منتخب کریں' },
  'teacher.inputTitle': { en: 'Lesson Video Title', ur: 'سبق کی ویڈیو کا عنوان' },
  'teacher.inputDuration': { en: 'Lesson Duration', ur: 'دورانیہ' },
  'teacher.inputUrl': { en: 'YouTube Video Code or URL (Embed URL)', ur: 'یوٹیوب ویڈیو لنک یا کوڈ' },
  'teacher.btnSubmit': { en: 'Publish lesson to Sandbox', ur: 'سبق رن ٹائم پر شائع کریں' },

  // Admin Dashboard
  'admin.title': { en: 'Founder HQ and Governance Portal', ur: 'بانی کا ہیڈ کوارٹر اور انتظامی پورٹل' },
  'admin.desc': { en: 'Approve course drafts, toggle simulator user roles, configure institutional branding, and preview analytics.', ur: 'کورس کے خاکوں کی منظوری دیں، رول تبدیل کریں، برانڈنگ ترتیب دیں اور تجزیات دیکھیں۔' },
  'admin.tabProposals': { en: 'Pending Course Proposals', ur: 'زیر التوا کورس کی تجاویز' },
  'admin.tabUsers': { en: 'Active App Users Simulator', ur: 'صارفین کا سمیلیٹر' },
  'admin.tabBranding': { en: 'Institutional Branding Customizer', ur: 'برانڈنگ اپنی مرضی کے مطابق کریں' },
  'admin.brandingTitle': { en: 'Change KidsLearn Title', ur: 'برانڈنگ کا نام تبدیل کریں' },
  'admin.brandingPlaceholder': { en: 'Branding Name', ur: 'برانڈنگ کا نام' },
  'admin.btnUpdateBranding': { en: 'Update Branding Name', ur: 'نام تبدیل کریں' },
  'admin.role': { en: 'System Role', ur: 'نظام کا غلبہ' },
  'admin.status': { en: 'Status', ur: 'حالت' },
  'admin.action': { en: 'Action', ur: 'عمل' },
  'admin.btnApprove': { en: 'Approve Proposal', ur: 'تجویز منظور کریں' },
  'admin.btnReject': { en: 'Reject Proposal', ur: 'تجویز مسترد کریں' },
  'admin.toggleStatus': { en: 'Toggle User Status', ur: 'صارف کی حیثیت تبدیل کریں' },

  // Authentication Room
  'auth.lobby': { en: 'Classroom Access Lobby', ur: 'کلاس روم تک رسائی' },
  'auth.sub': { en: 'Sign in as Student, Parent, Teacher or System Admin using email or simulated sandbox testing keys.', ur: 'اپنے کردار کے مطابق ای میل یا سمیلیٹر ٹیسٹ کیز کے ساتھ لاگ ان کریں۔' },
  'auth.chooseRole': { en: 'Choose Account Role Profile', ur: 'اکاؤنٹ کا کردار منتخب کریں' },
  'auth.fullName': { en: 'Full Name', ur: 'پورا نام' },
  'auth.email': { en: 'Email Address', ur: 'ای میل ایڈریس' },
  'auth.password': { en: 'Password', ur: 'پاس ورڈ' },
  'auth.btnSignIn': { en: 'Sign In Classroom', ur: 'کلاس روم میں لاگ ان کریں' },
  'auth.btnSignUp': { en: 'Sign Up Classroom', ur: 'کھاتہ کھولیں' },
  'auth.signing': { en: 'Signing in...', ur: 'لاگ ان ہو رہا ہے...' },
  'auth.gotoSignUp': { en: "Don't have a family account? Sign Up", ur: 'کھاتہ نہیں ہے؟ ایک نیا بنائیں!' },
  'auth.gotoSignIn': { en: 'Already have an account? Sign In', ur: 'پہلے سے کھاتہ موجود ہے؟ لاگ ان کریں' },
  'auth.sandboxShortcuts': { en: 'Sandbox Testing Shortcuts', ur: 'ٹیسٹنگ شارٹ کٹس' },
  'auth.sandboxDesc': { en: 'Instantly bypass registration using standard pre-configured role mocks.', ur: 'پہلے سے تیار شدہ کرداروں کا استعمال کرتے ہوئے بغیر رجسٹریشن کے داخل ہوں۔' },
  
  // Levels
  'Beginner': { en: 'Beginner', ur: 'مبتدی (ابتدائی)' },
  'Average': { en: 'Average', ur: 'اوسط (درمیانی)' },
  'Hard': { en: 'Hard', ur: 'مشکل' },
  'Paid': { en: 'Paid', ur: 'ادا شدہ' },
  'Pending': { en: 'Pending', ur: 'التواء میں' },
  'Approved': { en: 'Approved', ur: 'منظور شدہ' },
  'Rejected': { en: 'Rejected', ur: 'مسترد شدہ' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('kids_classroom_language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kids_classroom_language', lang);
  };

  const t = (key: string): string => {
    const item = translations[key];
    if (!item) return key;
    return item[language] || item['en'] || key;
  };

  useEffect(() => {
    // We can also toggle document direction based on language
    const root = document.documentElement;
    if (language === 'ur') {
      root.dir = 'rtl';
      root.classList.add('font-urdu');
    } else {
      root.dir = 'ltr';
      root.classList.remove('font-urdu');
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
