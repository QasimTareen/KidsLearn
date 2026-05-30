import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smile, 
  BookOpen, 
  Users, 
  ShieldAlert, 
  ArrowRight, 
  Mail, 
  Lock, 
  Phone, 
  User, 
  Briefcase, 
  CheckCircle,
  X,
  Laptop,
  Copy,
  Check
} from 'lucide-react';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { 
  signInWithGoogleAndValidate, 
  enforceSingleProviderLock, 
  completeTeacherRegistration 
} from '../firebase/authService';
import { useLanguage } from '../LanguageContext';

interface AuthRoomProps {
  onAuthSuccess: (user: any, role: 'Student' | 'Parent' | 'Teacher' | 'Admin', extraData?: any) => void;
  onClose: () => void;
}

export default function AuthRoom({ onAuthSuccess, onClose }: AuthRoomProps) {
  const { language } = useLanguage();
  const isUrdu = language === 'ur';

  const [activeTab, setActiveTab] = useState<'family' | 'teacher' | 'founder'>('family');
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  
  // Input fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('Grade 8');
  
  // Teacher specialty
  const [specialty, setSpecialty] = useState('Mathematics');

  // Async indicators
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Google teacher completion state
  const [googleCompletionRequired, setGoogleCompletionRequired] = useState<boolean>(false);
  const [googleTeacherUid, setGoogleTeacherUid] = useState<string>('');
  const [unauthorizedDomainHost, setAuthorizedDomainHost] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Handle Family Sign-in / Sign-up
  const handleFamilyAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg(isUrdu ? "براہ کرم ای میل اور پاس ورڈ دونوں فراہم کریں۔" : "Please provide both email and password.");
      return;
    }

    if (phoneNumber) {
      const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
      const isPakPhone = /^(?:\+92|92)?(?:0?3\d{9})$/.test(cleanPhone);
      if (!isPakPhone) {
        setErrorMsg(isUrdu 
          ? "غلط فون نمبر! براہ کرم درست پاکستانی فارمیٹ استعمال کریں (جیسے +92 300 1234567 یا 03001234567)" 
          : "Invalid phone format! Please use a valid Pakistani phone format (e.g. +92 300 1234567 or 03331234567).");
        return;
      }
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (isSignUp) {
        // Enforce single provider lock checks
        await enforceSingleProviderLock(email, 'Email/Password');
        
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const user = credential.user;
        
        await updateProfile(user, { displayName: name || 'Learner' });
        
        // Write Firestore node
        const userDocRef = doc(db, 'users', user.uid);
        const profilePayload = {
          uid: user.uid,
          name: name || 'Learner',
          email: user.email,
          role: 'Student', // Defaults to Student; parent analytics enabled under student view
          grade: selectedGrade,
          phoneNumber: phoneNumber || '',
          stars: 50, // Welcome stars!
          streak: 1,
          provider: 'Email/Password',
          createdAt: serverTimestamp()
        };
        
        await setDoc(userDocRef, profilePayload);
        setSuccessMsg(isUrdu ? "اکاؤنٹ بن گیا! کلاس روم میں خوش آمدید 🌟" : "Account created! Welcome to the classroom 🌟");
        setTimeout(() => {
          onAuthSuccess(user, 'Student', profilePayload);
        }, 1500);

      } else {
        // Enforce single provider lock checks
        await enforceSingleProviderLock(email, 'Email/Password');
        
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const user = credential.user;

        // Fetch user document from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const profile = userSnap.data();
          // Optional update if phone is appended
          if (phoneNumber && !profile.phoneNumber) {
            await setDoc(userDocRef, { phoneNumber }, { merge: true });
            profile.phoneNumber = phoneNumber;
          }
          onAuthSuccess(user, profile.role || 'Student', profile);
        } else {
          // Fallback if auth exists but no doc
          const fallbackProfile = {
            uid: user.uid,
            name: user.displayName || 'Learner',
            email: user.email,
            role: 'Student',
            grade: 'Grade 8',
            provider: 'Email/Password'
          };
          onAuthSuccess(user, 'Student', fallbackProfile);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || (isUrdu ? "لاگ ان ناکام رہا۔ براہ کرم اپنی معلومات چیک کریں۔" : "Authentication failed. Please verify credentials."));
    } finally {
      setLoading(false);
    }
  };

  // Google sign in trigger
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const isTeacherFlow = activeTab === 'teacher';
      const result = await signInWithGoogleAndValidate(isTeacherFlow);
      
      if (result.step === 'COMPLETION_REQUIRED') {
        // Trigger teacher completing specialized credentials
        setGoogleTeacherUid(result.user.uid);
        setEmail(result.user.email);
        setName(result.user.name);
        setGoogleCompletionRequired(true);
        setSuccessMsg(isUrdu ? "گوگل منسلک ہے۔ براہ کرم رجسٹریشن مکمل کریں۔" : "Google connected. Please complete details to continue.");
      } else {
        setSuccessMsg(isUrdu ? "خوش آمدید! داخلہ کامیاب رہا 🚀" : "Welcome connected! 🚀");
        setTimeout(() => {
          onAuthSuccess(auth.currentUser, result.role as any, result.profile);
        }, 1000);
      }
    } catch (err: any) {
      const isUnauthorized = 
        err.code === 'auth/unauthorized-domain' || 
        err.message?.includes('unauthorized-domain') || 
        err.message?.includes('auth/unauthorized-domain');
      const isUserClosed = 
        err.code === 'auth/popup-closed-by-user' || 
        err.code === 'auth/cancelled-popup-request' ||
        err.message?.includes('popup-closed-by-user') ||
        err.message?.includes('cancelled-popup-request');

      if (isUnauthorized) {
        console.warn("Domain authentication warning: Host needs to be whitelisted under Authorized Domains in the Firebase console.", err);
        setAuthorizedDomainHost(window.location.hostname);
        setErrorMsg("Firebase Authorized Domain Error: This domain has not been registered in your Firebase project's Authorized redirect list. Please add it in Firebase Console → Authentication → Settings → Authorized Domains.");
      } else if (isUserClosed) {
        console.warn("User cancelled Google popup auth or closed the tab.", err);
        setErrorMsg(isUrdu 
          ? "سائن ان ونڈو بند کردی گئی تھی۔ دوبارہ کوشش کریں یا ای میل ایڈریس، سینڈ باکس شارٹ کٹس استعمال کریں۔" 
          : "The sign-in window was closed. Please try again when you're ready, or use the Sandbox shortcuts / Email address choices.");
      } else {
        console.error("Authentication error det:", err);
        setErrorMsg(err.message || "Google authentication was suspended or blocked.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Intercept Completion for Teachers
  const handleGoogleTeacherComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await completeTeacherRegistration(
        googleTeacherUid,
        {
          fullName: name || 'Educator',
          email: email,
          specialty: specialty
        },
        'Google'
      );
      setSuccessMsg(isUrdu ? "تفصیلات جمع ہو گئیں۔ ہیڈ کوارٹر جائزہ لے رہا ہے 🛡️" : "Details submitted! Pending approval by Founder HQ 🛡️");
      setTimeout(() => {
        onAuthSuccess(auth.currentUser, 'Teacher', result.profile);
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Could not save your specialist preferences.");
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Registration trigger for Teachers
  const handleTeacherAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg(isUrdu ? "براہ کرم ای میل اور پاس ورڈ دونوں فراہم کریں۔" : "Please provide both email and password.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (isSignUp) {
        await enforceSingleProviderLock(email, 'Email/Password');
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const user = credential.user;
        await updateProfile(user, { displayName: name || 'Teacher' });

        const result = await completeTeacherRegistration(
          user.uid,
          {
            fullName: name || 'Teacher',
            email: email,
            specialty: specialty
          },
          'Email/Password'
        );

        setSuccessMsg(isUrdu ? "درخواست موصول ہو گئی! ہیڈ کوارٹر جائزہ لے رہا ہے 📝" : "Teacher account applied! Under physical review by Founder HQ 📝");
        setTimeout(() => {
          onAuthSuccess(user, 'Teacher', result.profile);
        }, 2000);
      } else {
        await enforceSingleProviderLock(email, 'Email/Password');
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const user = credential.user;

        // Fetch instructor data from Firestore
        const teacherSnap = await getDoc(doc(db, 'teachers', user.uid));
        if (teacherSnap.exists()) {
          const teacherData = teacherSnap.data();
          onAuthSuccess(user, 'Teacher', teacherData);
        } else {
          setErrorMsg(isUrdu 
            ? "اس ای میل پر کوئی ٹیچر اکاؤنٹ نہیں ملا۔ کیا آپ نے طالب علم کے طور پر رجسٹریشن کرائی تھی؟" 
            : "No teacher registration found for this email. Did you sign up as Student instead?");
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Teacher authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  // Founder HQ Bypass login
  const handleFounderAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const adminUser = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD;
    if (!adminPass) {
      setErrorMsg("Admin access is not configured. Please set VITE_ADMIN_USERNAME and VITE_ADMIN_PASSWORD in your environment.");
      return;
    }
    if (name === adminUser && password === adminPass) {
      setSuccessMsg(isUrdu ? "برائے بانی ہیڈ کوارٹر بائی پاس لاگ ان کامیاب۔ منتقلی جاری ہے... 🛡️" : "Founder HQ Bypass Authorized. Fetching global metrics... 🛡️");
      setTimeout(() => {
        onAuthSuccess({ uid: 'founder-admin', email: 'founder@kidslearn.org', displayName: 'Founder Admin' }, 'Admin');
      }, 1000);
    } else {
      setErrorMsg(isUrdu ? "غیر مجاز پاس ورڈ یا صارف کا نام۔" : "Unauthorized credentials. Please check your admin username and password.");
    }
  };

  // Fallback Playground Guest Entrance (In case Firebase has quota issues or offline testing)
  const handleGuestEntrance = (role: 'Student' | 'Parent' | 'Teacher' | 'Admin') => {
    const mockUser = {
      uid: `guest-${role.toLowerCase()}-${Math.floor(Math.random() * 10000)}`,
      email: `${role.toLowerCase()}-guest@kidslearn.org`,
      displayName: role === 'Admin' ? 'Founder HQ' : `${role} Guest`
    };
    setErrorMsg(null);
    setSuccessMsg(isUrdu ? `بطور ${role === 'Admin' ? 'بانی' : role === 'Student' ? 'طالب علم' : role === 'Parent' ? 'والدین' : 'استاد'} سینڈ باکس داخلہ...` : `Entering sandbox as ${role} Demo Guest...`);
    setTimeout(() => {
      onAuthSuccess(mockUser, role);
    }, 1000);
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto ${isUrdu ? 'font-urdu' : ''}`} dir={isUrdu ? 'rtl' : 'ltr'}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-[36px] w-full max-w-lg border-4 border-slate-900 shadow-2xl relative overflow-hidden text-slate-800 flex flex-col max-h-[92vh]"
      >
        {/* Playful top background curve */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-left relative">
          <button 
            onClick={onClose}
            className={`absolute top-4 p-2 bg-black/20 hover:bg-black/45 rounded-full text-white transition-all cursor-pointer ${isUrdu ? 'left-4' : 'right-4'}`}
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">🎓</span>
            <div className="text-left">
              <h2 className="text-2xl font-black font-fun tracking-tight">
                {isUrdu ? 'کلاس روم اکاؤنٹ لاگ ان' : 'Ecosystem Classroom Entry'}
              </h2>
              <p className="text-xs text-blue-100 font-bold">
                {isUrdu ? 'محفوظ فائر بیس ہب اور تعلیمی لائسنسنگ پورٹل' : 'Secure Firebase Hub & Teacher Licensing Channel'}
              </p>
            </div>
          </div>
        </div>

        {/* Roles Segment Filters */}
        {!googleCompletionRequired && (
          <div className="flex border-b-2 border-slate-100 bg-slate-50 p-1 gap-1 shrink-0">
            {[
              { id: 'family', labelUr: 'طالب علم اور والدین', labelEn: 'Student & Family', emoji: '🐣' },
              { id: 'teacher', labelUr: 'باصابطہ استاد', labelEn: 'Teacher' , emoji: '👨‍🏫' },
              { id: 'founder', labelUr: 'ہیڈ کوارٹر بانی', labelEn: 'Founder HQ', emoji: '🛡️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                  setIsSignUp(false);
                }}
                className={`flex-1 py-3 text-xs font-black font-fun rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === tab.id 
                    ? 'bg-yellow-400 text-slate-950 border-2 border-slate-900 shadow' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{isUrdu ? tab.labelUr : tab.labelEn}</span>
              </button>
            ))}
          </div>
        )}

        {/* Form area */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-4 text-left">

          {/* Quick Informative Workspace Guide based on active tab selection */}
          {!googleCompletionRequired && (
            <div className="bg-blue-50/70 rounded-2xl p-3 px-4 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900 font-medium">
              <span className="text-xl shrink-0">
                {activeTab === 'family' ? '🎒' : activeTab === 'teacher' ? '🎓' : '🛡️'}
              </span>
              <div className="text-left w-full">
                <p className="font-black text-blue-950">
                  {activeTab === 'family' 
                    ? (isUrdu ? 'اسٹودنٹ اور فیملی ڈیسک:' : 'Student & Family Desk:') 
                    : activeTab === 'teacher' 
                    ? (isUrdu ? 'تدریسی ورک اسپیس ڈیسک:' : 'Teacher Workspace Dashboard:') 
                    : (isUrdu ? 'بانی ہیڈ کوارٹر آفیشل پورٹل:' : 'Founder Headquarters (HQ):')}
                </p>
                <p className="opacity-90 leading-normal text-[10px] mt-0.5">
                  {activeTab === 'family' 
                    ? (isUrdu 
                        ? 'بچوں کے خوبصورت پلے رومز، تفریحی کوئزز، لائیو ویڈیو پلے لسٹس اور فیس کڈز پورٹل دیکھنے کے لیے لاگ ان کریں۔' 
                        : 'Access dynamic kid playrooms, complete active video quizzes, earn star points, and review child progress and payment status.') 
                    : activeTab === 'teacher' 
                    ? (isUrdu 
                        ? 'بچوں کے جوابات کی توثیق کریں، نئے ویڈیو تعلیمی اسباق شامل کریں اور بانی نصاب منظوری کا آڈٹ کریں۔' 
                        : 'Verify, review, and assess student submissions. Upload additional video lessons and manage course curriculum.') 
                    : (isUrdu 
                        ? 'انتظامی ہیڈ کوارٹر۔ برانڈ کے ناموں کی ترتیبات تبدیل کریں، لائیو صارفین کا ڈیٹا بیس دیکھیں، اور اساتذہ کے اکاؤنٹس معطل/بحال کریں۔' 
                        : 'System Administrator dashboard. Manage credentials, override user statuses, configure school branding, and inspect approvals.')}
                </p>
              </div>
            </div>
          )}
          
          {/* Diagnostic Display Message block */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-red-50 text-red-700 p-4 rounded-2xl border-2 border-red-200 text-xs font-bold leading-relaxed flex gap-2"
              >
                <ShieldAlert className="w-5 h-5 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border-2 border-emerald-200 text-xs font-bold flex gap-2"
              >
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {unauthorizedDomainHost && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50/90 text-amber-900 p-5 rounded-2xl border-2 border-amber-200 text-xs space-y-3.5 relative overflow-hidden"
            >
              <div className="absolute top-1 right-2 text-5xl opacity-10 select-none">🌐</div>
              <h4 className="font-extrabold text-amber-950 flex items-center gap-1.5 text-[13px] font-fun">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                Configure Authorized Redirect Domain
              </h4>
              <p className="leading-relaxed opacity-95">
                Google popup auth checks whitelist redirect domains to secure OAuth. Add this dynamic container URL to your Firebase Settings:
              </p>
              
              <div className="bg-white/80 p-3.5 rounded-xl border border-amber-200/65 font-mono space-y-2 text-slate-800">
                <div>
                  <p className="text-[9px] text-amber-800 font-extrabold uppercase tracking-wide">1. Visit link</p>
                  <a 
                    href={`https://console.firebase.google.com/project/${import.meta.env.VITE_FIREBASE_PROJECT_ID}/authentication/providers`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 text-indigo-700 hover:underline font-bold text-[11px] mt-0.5"
                  >
                    🔗 Open Firebase Auth settings ({import.meta.env.VITE_FIREBASE_PROJECT_ID})
                  </a>
                </div>
                
                <div>
                  <p className="text-[9px] text-amber-800 font-extrabold uppercase tracking-wide">2. Settings tab</p>
                  <p className="text-[11px] text-slate-700 font-bold mt-0.5">Authentication &gt; Settings &gt; Authorized domains</p>
                </div>
                
                <div>
                  <p className="text-[9px] text-amber-800 font-extrabold uppercase tracking-wide">3. Add & save this domain</p>
                  <div className="flex items-center gap-2 mt-1 bg-slate-100 p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-800 font-bold break-all flex-1 text-[11px] select-all">{unauthorizedDomainHost}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(unauthorizedDomainHost);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="p-1.5 px-2.5 bg-white border border-slate-300 hover:bg-slate-50 active:bg-slate-100 rounded-md text-[10px] font-black text-slate-700 cursor-pointer flex items-center gap-1 transition-all"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-amber-900 border-t border-amber-200/50 pt-2 leading-relaxed opacity-95">
                💡 <strong>Immediate bypass:</strong> Don\'t want to configure Firebase? You don\'t have to! You can log in/sign up instantly using the <strong>Email Address</strong> option above, or use any of the direct <strong>Sandbox Testing Shortcuts</strong> below!
              </div>
            </motion.div>
          )}

          {/* GOOGLE TEACHER DETAILS EXTRA FORM */}
          {googleCompletionRequired ? (
            <form onSubmit={handleGoogleTeacherComplete} className="space-y-4">
              <div className="bg-yellow-50 text-yellow-800 p-4 rounded-2xl border border-yellow-200 text-xs font-medium">
                {isUrdu 
                  ? "جناب استاد! ہم گوگل سے منسلک ہو چکے ہیں، تاہم تدریسی لائسنس کے تحت آپ کا مضمون منتخب کرنا ضروری ہے۔" 
                  : "Almost there, Professor! We gathered your details from Google Auth but require your official educational specialty line to route student assessments."}
              </div>
              
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-black text-slate-700">{isUrdu ? 'تدریسی مضمون' : 'Educator Specialty Topic'}</label>
                <select 
                  value={specialty} 
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold focus:border-blue-500 outline-none"
                >
                  <option value="Mathematics">{isUrdu ? 'ریاضی (کلاس ۸-۱۲)' : 'Mathematics (Grades 8-12)'}</option>
                  <option value="Science">{isUrdu ? 'سائنس (بیالوجی، طبیعیات، کیمیا)' : 'Science (Biology, Physics, Chemistry)'}</option>
                  <option value="Coding">{isUrdu ? 'کمپیوٹر پروگرامنگ اور بلاکس' : 'Computer Programming & Blocks'}</option>
                  <option value="Phonics">{isUrdu ? 'زبانیں اور ادب' : 'Languages & Literature'}</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black text-sm rounded-2xl transition-all shadow-md font-fun flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isUrdu ? 'رجسٹریشن مکمل کریں' : 'Complete Registration'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <>
              {/* TAB 1: Student & Parents Form */}
              {activeTab === 'family' && (
                <form onSubmit={handleFamilyAuth} className="space-y-4">
                  <h3 className="text-base font-extrabold text-slate-900 font-fun flex items-center gap-1.5">
                    <Smile className="w-5 h-5 text-blue-600" />
                    {isSignUp 
                      ? (isUrdu ? "نئے طالبعلم کا اکاؤنٹ بنائیں" : "Register New Student Account") 
                      : (isUrdu ? "طالب علم کے ڈیسک پیج پر جائیں" : "Access Kid's Classroom Desk")}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isUrdu 
                      ? "طلباء امتحانات حل کر سکتے ہیں اور اپنے گارڈین پورٹل سے پیشرفت رپورٹ ٹریک کر سکتے ہیں۔" 
                      : "Students can learn and solve quizzes. The same credentials can also log into our Parent Portal to track grade analytics."}
                  </p>

                  <div className="space-y-3.5">
                    {isSignUp && (
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-bold text-slate-600">{isUrdu ? 'طالب علم کا نام' : 'Student Name'}</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                          <input 
                            type="text" 
                            required 
                            placeholder={isUrdu ? "جیسے علی، زارا" : "e.g. Liam, Sophia"}
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 rounded-xl text-xs font-bold outline-none"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-slate-600">{isUrdu ? 'ای میل ایڈریس' : 'Email Address'}</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input 
                          type="email" 
                          required 
                          placeholder="student@school.org"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-slate-600">{isUrdu ? 'پاس ورڈ (کم از کم ۶ ہندسے)' : 'Password'}</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input 
                          type="password" 
                          required 
                          placeholder="••••••••"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-600">
                          {isUrdu ? 'فون نمبر (پاکستانی فارمیٹ میں اختیاری)' : 'Phone Number (Optional - Pakistani format only)'}
                        </label>
                        {phoneNumber && (() => {
                          const isPak = /^(?:\+92|92)?(?:0?3\d{9})$/.test(phoneNumber.replace(/[\s\-\(\)]/g, ''));
                          return (
                            <span className={`text-[10px] uppercase font-mono font-bold ${isPak ? 'text-emerald-600' : 'text-rose-600 animate-pulse'}`}>
                              {isPak ? (isUrdu ? '✓ درست فارمیٹ' : '✓ Valid Pakistani Format') : (isUrdu ? '✗ غلط پاکستانی فارمیٹ' : '✗ Invalid Pakistani format')}
                            </span>
                          );
                        })()}
                      </div>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input 
                          type="tel" 
                          placeholder="e.g. 0300 1234567 or +92 300 1234567"
                          value={phoneNumber}
                          onChange={e => setPhoneNumber(e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 bg-slate-50 border-2 rounded-xl text-xs font-bold outline-none transition-all ${
                            !phoneNumber 
                              ? 'border-slate-200 focus:border-blue-500' 
                              : /^(?:\+92|92)?(?:0?3\d{9})$/.test(phoneNumber.replace(/[\s\-\(\)]/g, ''))
                              ? 'border-emerald-300 focus:border-emerald-500'
                              : 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                          }`}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        {isUrdu 
                          ? "نمبر کا فارمیٹ پلس نو دو تین (923+) یا صفر تین (03+) سے شروع ہونا لازمی ہے۔" 
                          : "Must match standard Pakistani layout: starts with +92 3xx or 03xx, followed by 9 digits."}
                      </p>
                    </div>

                    {isSignUp && (
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-bold text-slate-600">{isUrdu ? 'تعلیمی درجہ / کلاس' : 'Current Study Grade'}</label>
                        <select 
                          value={selectedGrade} 
                          onChange={e => setSelectedGrade(e.target.value)}
                          className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-extrabold outline-none"
                        >
                          <option value="Grade 8">{isUrdu ? 'کلاس ۸ (مڈل اسکول)' : 'Grade 8 (Middle School)'}</option>
                          <option value="Grade 9">{isUrdu ? 'کلاس ۹ (میٹرک حصہ اول)' : 'Grade 9 (Freshman)'}</option>
                          <option value="Grade 10">{isUrdu ? 'کلاس ۱۰ (میٹرک حصہ دوم)' : 'Grade 10 (Sophomore)'}</option>
                          <option value="Grade 11">{isUrdu ? 'کلاس ۱۱ (انٹرمیڈیٹ حصہ اول)' : 'Grade 11 (Junior)'}</option>
                          <option value="Grade 12">{isUrdu ? 'کلاس ۱۲ (انٹرمیڈیٹ حصہ دوم)' : 'Grade 12 (Senior)'}</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black text-sm rounded-2xl transition-all shadow-md font-fun flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isSignUp ? (isUrdu ? "نیا کلاس اکاؤنٹ بنائیں 🌟" : "Create My Class Account 🌟") : (isUrdu ? "کلاس روم ڈیسک میں لاگ ان کریں" : "Login to my Classroom")}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Provider Separation bar */}
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t-2 border-slate-100"></div>
                    <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-extrabold uppercase">
                      {isUrdu ? "یا گوگل اکاؤنٹ استعمال کریں" : "or lock-verified Google login"}
                    </span>
                    <div className="flex-grow border-t-2 border-slate-100"></div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-3 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs font-black shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.29 1.48 15.54 0 12.24 0 5.58 0 .193 5.37.193 12s5.387 12 12.047 12c6.96 0 11.57-4.89 11.57-11.79 0-.795-.085-1.4-.19-1.925H12.24z"/>
                    </svg>
                    {isUrdu ? "گوگل سروس کے ذریعے منسلق کریں" : "Google Account Connect"}
                  </button>

                  <div className="text-center pt-2">
                    <button 
                      type="button"
                      onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(null); }}
                      className="text-xs font-black text-indigo-600 hover:underline"
                    >
                      {isSignUp ? (isUrdu ? "پہلے سے اکاؤنٹ ہے؟ سائن ان کریں" : "Already registered? Let's Sign In") : (isUrdu ? "بچوں کا نیا اکاؤنٹ بنائیں" : "New explorer? Sign up for a Grade Account")}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: Teacher Application and Login Form */}
              {activeTab === 'teacher' && (
                <form onSubmit={handleTeacherAuth} className="space-y-4">
                  <h3 className="text-base font-extrabold text-slate-900 font-fun flex items-center gap-1.5">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    {isSignUp ? (isUrdu ? "باصابطہ لائق استاد بنیں" : "Register Professional Teacher") : (isUrdu ? "استاد کے ورک اسپیس لاگ ان" : "Teacher Workspace Login")}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isUrdu 
                      ? "اساتذہ بچوں کے جوابات ٹریک کر سکتے ہیں، ان کے ہوم ورک کی توثیق کرتے ہیں اور لامتناہی کورس بنا سکتے ہیں۔" 
                      : "Instructors view matching assessments, approve kids works, and upload new video guides. Account must first be validated by the Founder HQ."}
                  </p>

                  <div className="space-y-3.5 font-sans">
                    {isSignUp && (
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-bold text-slate-600">{isUrdu ? 'استاد کا مکمل نام' : 'Full Scholar Name'}</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                          <input 
                            type="text" 
                            required 
                            placeholder={isUrdu ? "جیسے ڈاکٹر زاہد اقبال" : "e.g. Dr. Helen Carter"}
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 rounded-xl text-xs font-bold outline-none"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-slate-600">{isUrdu ? 'ای میل ایڈریس' : 'Teacher Email'}</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input 
                          type="email" 
                          required 
                          placeholder="educator@kidslearn.org"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-slate-600">{isUrdu ? 'پاس ورڈ' : 'Password'}</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input 
                          type="password" 
                          required 
                          placeholder="••••••••"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                    </div>

                    {isSignUp && (
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-black text-slate-700">{isUrdu ? 'تدریسی مضمون' : 'Educator Specialty (Target Course Subject)'}</label>
                        <select 
                          value={specialty} 
                          onChange={(e) => setSpecialty(e.target.value)}
                          className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold focus:border-blue-500 outline-none"
                        >
                          <option value="Mathematics">{isUrdu ? 'ریاضی (میٹرک اور گنتی)' : 'Mathematics (Algebra, Counting)'}</option>
                          <option value="Science">{isUrdu ? 'سائنس (علم نباتات، خلاء)' : 'Science (Botany, Space)'}</option>
                          <option value="Coding">{isUrdu ? 'کمپیوٹر پروگرامنگ (کوڈنگ بلاکس)' : 'Coding (Blocks, Loops)'}</option>
                          <option value="Phonics">{isUrdu ? 'لسانیات اور صوتیات' : 'Languages & Phonics'}</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black text-sm rounded-2xl transition-all shadow-md font-fun flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isSignUp ? (isUrdu ? "تدریسی درخواست جمع کرائیں 📝" : "Submit Teacher Application 📝") : (isUrdu ? "استاد کے ٹیبل پر سائن ان کریں" : "Sign in to Teacher Table")}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Provider Separation bar */}
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t-2 border-slate-100"></div>
                    <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-extrabold uppercase">
                      {isUrdu ? "یا فیکلٹی گوگل سائن ان" : "or join/sign in with Google"}
                    </span>
                    <div className="flex-grow border-t-2 border-slate-100"></div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-3 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs font-black shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.29 1.48 15.54 0 12.24 0 5.58 0 .193 5.37.193 12s5.387 12 12.047 12c6.96 0 11.57-4.89 11.57-11.79 0-.795-.085-1.4-.19-1.925H12.24z"/>
                    </svg>
                    {isUrdu ? "گوگل معلم اسناد کی توثیق" : "Google Workspace Teacher verification"}
                  </button>

                  <div className="text-center pt-2">
                    <button 
                      type="button"
                      onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(null); }}
                      className="text-xs font-black text-blue-600 hover:underline"
                    >
                      {isSignUp ? (isUrdu ? "لاگ ان پر واپس جائیں" : "Back to Login Desk") : (isUrdu ? "متحرک معلم لائسنس کی اپیل جمع کریں" : "Apply for dynamic teaching credentials")}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: Founder HQ Form */}
              {activeTab === 'founder' && (
                <form onSubmit={handleFounderAuth} className="space-y-4 font-sans">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-red-600 to-amber-500 rounded-md text-white text-[10px] font-black uppercase tracking-wider">
                    {isUrdu ? "انتظامی لاگ ان" : "Administrative Entrance"}
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 font-fun">
                    {isUrdu ? "رکن بانی کمانڈ پینل" : "Founder HQ Command Desk"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isUrdu 
                      ? "عالمی تعلیمی پیمائش، سائٹ کے برانڈنگ ڈیزائن اور کڈز لرن کے اساتذہ کی منظوری کے اختیارات کا نظام۔" 
                      : "Oversight portal key to audit all educational structures, approve applicants, and review global student achievements."}
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-slate-600">{isUrdu ? 'خصوصی انتظامی کوڈ نام (admin)' : 'Secret Code Word (admin)'}</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. admin"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-red-500 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-slate-600">{isUrdu ? 'انتظامی پاس ورڈ' : 'Access Password'}</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input 
                          type="password" 
                          required 
                          placeholder="Enter admin password"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-red-500 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl transition-all shadow-md font-fun flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isUrdu ? "بانی ڈیسک پر داخل ہوں" : "Authenticate Command Desk"}
                    <ArrowRight className="w-4 h-4 text-yellow-400" />
                  </button>
                </form>
              )}
            </>
          )}

          {/* SIMULATED GUEST ENTRANCES IN CASE THE CLIENT PREFERS OFFLINE PRESENTATION */}
          <div className="pt-4 border-t-2 border-slate-50">
            <p className="text-[10px] font-extrabold text-center text-slate-400 uppercase tracking-widest mb-3">
              {isUrdu ? "- مختصر ٹیسٹنگ ڈیمو لاگ ان -" : "- Quick Sandbox Testing Shortcuts -"}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleGuestEntrance('Student')}
                className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-black font-fun rounded-xl transition-all cursor-pointer"
              >
                {isUrdu ? "👦 مہمان طالب علم" : "👦 Guest Student"}
              </button>
              <button 
                onClick={() => handleGuestEntrance('Parent')}
                className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-black font-fun rounded-xl transition-all cursor-pointer"
              >
                {isUrdu ? "👩 مہمان والدین" : "👩 Guest Parent"}
              </button>
              <button 
                onClick={() => handleGuestEntrance('Teacher')}
                className="py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-[10px] font-black font-fun rounded-xl transition-all cursor-pointer"
              >
                {isUrdu ? "👨‍🏫 مہمان استاد" : "👨‍🏫 Guest Instructor"}
              </button>
              <button 
                onClick={() => handleGuestEntrance('Admin')}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-[10px] font-black font-fun rounded-xl transition-all cursor-pointer"
              >
                {isUrdu ? "🛡️ مہمان ایڈمنسٹریٹر" : "🛡️ Guest Founder HQ"}
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
