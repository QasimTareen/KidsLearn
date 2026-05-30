import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Users, BookOpen, DollarSign, Search, Award, CheckCircle, XCircle, Settings, Sliders, Play, Trash2 } from 'lucide-react';
import { UserManagementItem, CourseApprovalRequest, Course } from '../types';
import { useLanguage } from '../LanguageContext';

interface AdminPanelProps {
  userManagement: UserManagementItem[];
  courseApprovals: CourseApprovalRequest[];
  courses: Course[];
  onToggleUserStatus: (userId: string) => void;
  onApproveCourse: (requestId: string) => void;
  onRejectCourse: (requestId: string) => void;
  onUpdateBranding: (newName: string) => void;
  brandingName: string;
}

export default function AdminPanel({
  userManagement,
  courseApprovals,
  courses,
  onToggleUserStatus,
  onApproveCourse,
  onRejectCourse,
  onUpdateBranding,
  brandingName,
}: AdminPanelProps) {
  const { language } = useLanguage();
  const isUrdu = language === 'ur';

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'approvals' | 'revenue' | 'settings'>('overview');
  
  // Realtime search inputs
  const [userSearchText, setUserSearchText] = useState('');
  
  // Branding settings form states
  const [customPlatformName, setCustomPlatformName] = useState(brandingName);
  const [brandingThemeColor, setBrandingThemeColor] = useState('Royal Blue + Sunshine Yellow');
  const [dailyDigestTemplate, setDailyDigestTemplate] = useState('Playful Welcome Email');

  // Filter users based on search text input
  const filteredUsers = userManagement.filter(user => 
    user.name.toLowerCase().includes(userSearchText.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchText.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearchText.toLowerCase())
  );

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPlatformName.trim()) return;
    onUpdateBranding(customPlatformName);
    if (isUrdu) {
      alert(`کامیابی! عالمی ترتیبات اپ ڈیٹ ہو گئیں۔ پلیٹ فارم کا نام بدل کر "${customPlatformName}" ہو گیا ہے۔`);
    } else {
      alert(`Success! Global settings updated. Platform rebranded to "${customPlatformName}" successfully.`);
    }
  };

  const handleBulkIssueCertificates = () => {
    if (isUrdu) {
      alert('بڑی تعداد میں سرٹیفکیٹ جاری کرنے کا اسکرپٹ شروع کر دیا گیا ہے۔ تمام کامیاب طلباء کو ۱۴ تکمیل کے سرٹیفکیٹ جاری کر دیے گئے ہیں۔');
    } else {
      alert('Deploying automated bulk graduation sync script. Issued 14 completion certificates for Leo, Emma, and standard students who completed courses.');
    }
  };

  const revenueByTrack = [
    { 
      trackEn: 'Ages 3-5 Track', 
      trackUr: 'عمر ۳-۵ سال کا ٹریک', 
      earnings: 14200, 
      subscribers: 290 
    },
    { 
      trackEn: 'Ages 6-7 Track', 
      trackUr: 'عمر ۶-۷ سال کا ٹریک', 
      earnings: 9400, 
      subscribers: 160 
    },
    { 
      trackEn: 'Ages 8-10 Track', 
      trackUr: 'عمر ۸-۱۰ سال کا ٹریک', 
      earnings: 24900, 
      subscribers: 422 
    },
    { 
      trackEn: 'Ages 11-12 Track', 
      trackUr: 'عمر ۱۱-۱۲ سال کا ٹریک', 
      earnings: 11000, 
      subscribers: 156 
    },
  ];

  return (
    <div className={`p-6 bg-slate-50 min-h-screen text-slate-800 ${isUrdu ? 'font-urdu' : ''}`} dir={isUrdu ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto space-y-8 text-left">
        
        {/* Title area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm gap-4">
          <div className="text-left w-full">
            <span className="inline-block text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full uppercase tracking-wider">
              {isUrdu ? '🛡️ بانی اور پلیٹ فارم ایڈمنسٹریٹر ڈیسک' : '🛡️ Founder & Platform Administrator Desk'}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-2 font-display">
              {isUrdu ? 'ایڈمن پینل:' : 'Admin Panel:'} <span className="text-blue-600">{isUrdu ? 'کڈز لرن ہیڈ کوارٹر' : 'KidsLearn HQ'}</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium font-sans mt-1">
              {isUrdu 
                ? 'اعلیٰ سطح کے اہم اشاریوں (KPIs) کی نگرانی کریں، اساتذہ کے کورسز کا جائزہ لیں، برانڈنگ تبدیل کریں، اور معلومات حاصل کریں۔' 
                : 'Oversee high-level KPIs, moderate instructor course applications, change branding styles, and query users.'}
            </p>
          </div>

          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-center shrink-0">
            <span className="text-xs font-bold text-slate-600 px-3 py-2">
              {isUrdu ? 'سسٹم کی صورتحال: فعال 🟢' : 'System Status: Live 🟢'}
            </span>
          </div>
        </div>

        {/* Dynamic admin tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Vertical switches selector */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              {[
                { 
                  id: 'overview', 
                  labelEn: '📊 System Overview', 
                  labelUr: '📊 نظام کا جائزہ', 
                  descEn: 'SaaS KPIs & conversions', 
                  descUr: 'SaaS کارکردگی اور اشاریے' 
                },
                { 
                  id: 'users', 
                  labelEn: '👥 User Management', 
                  labelUr: '👥 صارفین کا انتظام', 
                  descEn: 'Students, parents, instructors', 
                  descUr: 'بچے، والدین، اساتذہ کا ڈیٹا' 
                },
                { 
                  id: 'approvals', 
                  labelEn: '📝 Course Approvals', 
                  labelUr: '📝 کورسز کی منظوری', 
                  descEn: 'Review submitted programs', 
                  descUr: 'نیا نصاب اور درخواستیں' 
                },
                { 
                  id: 'revenue', 
                  labelEn: '💰 Revenue Auditing', 
                  labelUr: '💰 آمدنی کا آڈٹ', 
                  descEn: 'Earnings & metrics', 
                  descUr: 'آمدنی اور فیس کا ریکارڈ' 
                },
                { 
                  id: 'settings', 
                  labelEn: '⚙️ Branding Settings', 
                  labelUr: '⚙️ برانڈنگ کی ترتیبات', 
                  descEn: 'Site name & templates', 
                  descUr: 'سائٹ کا نام اور ڈیزائن' 
                }
              ].map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`admin-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full p-4 rounded-2xl text-left block transition-all cursor-pointer ${
                      active 
                        ? 'bg-blue-600 text-white shadow' 
                        : 'hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <p className={`text-sm font-bold font-fun ${active ? 'text-white' : 'text-slate-800'} ${isUrdu ? 'text-right' : 'text-left'}`}>
                      {isUrdu ? tab.labelUr : tab.labelEn}
                    </p>
                    <p className={`text-[11px] mt-0.5 ${active ? 'text-blue-100' : 'text-slate-400'} ${isUrdu ? 'text-right' : 'text-left'}`}>
                      {isUrdu ? tab.descUr : tab.descEn}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active section container display */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: System Overview KPI metrics */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* KPI Boxes card grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-left">
                      <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                        {isUrdu ? 'کل فعال صارفین' : 'Total Active Users'}
                      </p>
                      <p className="text-3xl font-black text-slate-900 font-fun mt-1">
                        {isUrdu ? '۱،۴۸۰ رجسٹرڈ بچے' : '1,480 Subscribers'}
                      </p>
                      <span className="text-xs text-green-600 font-bold mt-1 inline-block">
                        {isUrdu ? '↗ اس ماہ ۱۲٪ اضافہ' : '↗ 12% growth this month'}
                      </span>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-left">
                      <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                        {isUrdu ? 'کل ماہانہ فیس آمدن' : 'Gross Monthly tuition'}
                      </p>
                      <p className="text-3xl font-black text-blue-600 font-fun mt-1">
                        $59,500 USD
                      </p>
                      <span className="text-xs text-green-600 font-bold mt-1 inline-block">
                        {isUrdu ? '↗ ۲۴٪ اضافہ ریکارڈ کیا گیا' : '↗ 24% relative variance'}
                      </span>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-left">
                      <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                        {isUrdu ? 'نصاب کیٹلاگ' : 'Course Modules catalog'}
                      </p>
                      <p className="text-3xl font-black text-slate-900 font-fun mt-1">
                        {courses.length} {isUrdu ? 'فعال کورسز' : 'Active Paths'}
                      </p>
                      <span className="text-xs text-slate-500 font-bold mt-1 inline-block">
                        {isUrdu ? '۲ زیر غور ماڈیولز' : '2 pending review'}
                      </span>
                    </div>
                  </div>

                  {/* Operational Controls shortcut */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-left space-y-4">
                    <h3 className="text-lg font-bold font-fun text-slate-900">
                      {isUrdu ? '🛠️ فوری ایڈمنسٹریٹر کارروائیاں' : '🛠️ Quick Administrative Actions'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        id="admin-bulk-issue-certs"
                        onClick={handleBulkIssueCertificates}
                        className="p-4 bg-blue-50 hover:bg-blue-101 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-2xl transition-colors text-left flex items-start gap-3 border border-blue-100 cursor-pointer"
                      >
                        <Award className="w-5 h-5 shrink-0" />
                        <div>
                          <p className="font-fun text-sm">{isUrdu ? 'کی تعداد میں سرٹیفکیٹ جاری کریں' : 'Bulk Issue Completion Certificates'}</p>
                          <p className="text-[11px] text-slate-500 font-medium mt-1">
                            {isUrdu 
                              ? 'طلباء کے نتائج کی توثیق کریں اور ان کے والٹ میں پرنٹ ایبل ڈپلومہ کورس بھیجیں۔' 
                              : 'Verify progress and deploy printable diplomas to child vaults.'}
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveTab('settings')}
                        className="p-4 bg-yellow-50 hover:bg-yellow-100 text-yellow-850 text-yellow-800 font-bold text-xs rounded-2xl transition-colors text-left flex items-start gap-3 border border-yellow-101 border-yellow-100 cursor-pointer"
                      >
                        <Settings className="w-5 h-5 shrink-0 text-yellow-600" />
                        <div>
                          <p className="font-fun text-sm text-yellow-950">{isUrdu ? 'لائیو پلیٹ فارم ری برانڈ کریں' : 'Rebrand Live Platform'}</p>
                          <p className="text-[11px] text-slate-500 font-medium mt-1">
                            {isUrdu 
                              ? 'سائٹ کا عنوان، تعلیمی نعرے، اور برانڈ کے رنگوں کی ترتیبات تبدیل کریں۔' 
                              : 'Instantly edit title, change color schemes, and save presets.'}
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: User management Table */}
              {activeTab === 'users' && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-xl font-bold font-fun text-slate-900">
                          {isUrdu ? '👥 سسٹم صارفین کا ڈیٹا بیس' : '👥 System Users Database'}
                        </h3>
                        <p className="text-xs text-slate-400 font-semibold mt-1">
                          {isUrdu ? 'کرداروں کا آڈٹ کریں، طلباء، والدین اور اساتذہ کے اکاؤنٹس معطل یا بحال کریں۔' : 'Search, audit roles, and suspend or restore accounts instantly.'}
                        </p>
                      </div>

                      <div className="relative w-full sm:w-64">
                        <input
                          type="text"
                          value={userSearchText}
                          onChange={(e) => setUserSearchText(e.target.value)}
                          placeholder={isUrdu ? 'تلاش کریں...' : 'Search database users...'}
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20"
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="overflow-hidden border border-slate-200 rounded-2xl">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold border-b border-slate-200">
                          <tr>
                            <th className="p-4 text-left">{isUrdu ? 'صارف کا نام' : 'Name'}</th>
                            <th className="p-4 text-left">{isUrdu ? 'ای میل ایڈریس' : 'Email Address'}</th>
                            <th className="p-4 text-left">{isUrdu ? 'اکیڈمی کا کردار' : 'Academy Role'}</th>
                            <th className="p-4 text-left">{isUrdu ? 'سرگرمی' : 'Activity Status'}</th>
                            <th className="p-4 text-right">{isUrdu ? 'حکم لاگو کریں' : 'Toggle Status'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                          {filteredUsers.map((user) => (
                            <tr key={user.id} id={`admin-user-row-${user.id}`} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 font-black text-slate-900">{user.name}</td>
                              <td className="p-4 text-slate-500 font-mono text-[11px]">{user.email}</td>
                              <td className="p-4 uppercase text-[10px] font-extrabold text-blue-600">
                                {isUrdu 
                                  ? (user.role === 'Student' ? 'طالب علم' : user.role === 'Parent' ? 'والدین' : user.role === 'Teacher' ? 'استاد' : 'ایڈمن') 
                                  : user.role}
                              </td>
                              <td className="p-4">
                                <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold ${
                                  user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {isUrdu 
                                    ? (user.status === 'Active' ? 'فعال' : 'معطل') 
                                    : user.status}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  id={`admin-btn-toggle-user-${user.id}`}
                                  onClick={() => onToggleUserStatus(user.id)}
                                  className={`px-3 py-1.5 font-bold rounded-lg border border-slate-200 text-[10px] cursor-pointer ${
                                    user.status === 'Active' ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-green-600 bg-green-50 hover:bg-green-100'
                                  }`}
                                >
                                  {user.status === 'Active' 
                                    ? (isUrdu ? '⚠️ معطل کریں' : '⚠️ Suspend') 
                                    : (isUrdu ? '✅ بحال کریں' : '✅ Active Account')}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: Course Approval application queue */}
              {activeTab === 'approvals' && (
                <motion.div
                  key="approvals"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-xl font-bold font-fun text-slate-900">
                        {isUrdu ? '📝 اساتذہ کے نصاب کی منظوری کی قطار' : '📝 Instructor Curriculum Approval Queue'}
                      </h3>
                      <p className="text-xs text-slate-400 font-semibold mt-1">
                        {isUrdu 
                          ? 'اساتذہ نئے تعلیمی کورس جائزے کے لیے جمع کراتے ہیں، جن کی منظوری پر کورس بچوں کو لائیو نظر آتا ہے۔' 
                          : 'Instructors submit new programs for peer review. Upon approval, the syllabus is dynamically merged live!'}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {courseApprovals.map((req) => (
                        <div key={req.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/50 text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="bg-yellow-400 text-slate-950 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider font-fun">
                                {req.ageGroup} {isUrdu ? 'عمر کے ٹرکس' : 'Tracks'}
                              </span>
                              <span className="text-xs text-slate-500 font-bold">
                                {isUrdu ? 'جمع کروایا گیا:' : 'Submitted:'} {req.dateSubmitted}
                              </span>
                            </div>

                            <h4 className="text-base font-extrabold text-slate-950 font-fun leading-tight">{req.title}</h4>
                            <p className="text-xs text-slate-500 font-semibold">
                              {isUrdu ? 'استاد کا نام:' : 'Teacher Lead:'} {req.instructorName}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            {req.status === 'Pending' ? (
                              <>
                                <button
                                  id={`admin-btn-approve-${req.id}`}
                                  onClick={() => onApproveCourse(req.id)}
                                  className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1 cursor-pointer font-fun"
                                >
                                  <CheckCircle className="w-4 h-4" /> {isUrdu ? 'منظور کریں' : 'Approve live'}
                                </button>
                                <button
                                  id={`admin-btn-reject-${req.id}`}
                                  onClick={() => onRejectCourse(req.id)}
                                  className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                                >
                                  <XCircle className="w-4 h-4" /> {isUrdu ? 'مسترد کریں' : 'Decline'}
                                </button>
                              </>
                            ) : (
                              <span className={`inline-flex px-3 py-1.5 rounded-xl border font-bold text-xs font-fun ${
                                req.status === 'Approved' 
                                  ? 'bg-green-100 text-green-700 border-green-200' 
                                  : 'bg-red-100 text-red-700 border-red-200'
                              }`}>
                                {req.status === 'Approved' 
                                  ? (isUrdu ? '✓ منظور شدہ اور تعینات' : '✓ Approved & Deployed') 
                                  : (isUrdu ? '✗ مسترد شدہ' : '✗ Rejected')}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: Revenue & SaaS audits */}
              {activeTab === 'revenue' && (
                <motion.div
                  key="revenue"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-xl font-bold font-fun text-slate-900 border-b border-slate-100 pb-3">
                      {isUrdu ? '💰 آمدنی اور مالیاتی اشاریے' : '💰 SaaS Subscriptions & Earnings Breakdown'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Breakdown lists */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 text-left">
                          {isUrdu ? 'کورس پٹریوں کے لحاظ سے آمدنی' : 'Revenue by Course Tracks'}
                        </h4>
                        <div className="space-y-2.5">
                          {revenueByTrack.map((item, i) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center text-xs font-semibold">
                              <span className="text-slate-800 font-fun font-bold text-sm">
                                {isUrdu ? item.trackUr : item.trackEn}
                              </span>
                              <div className="text-right">
                                <p className="text-slate-900 font-black text-sm">${item.earnings.toLocaleString()}</p>
                                <p className="text-[10px] text-slate-400">
                                  {item.subscribers} {isUrdu ? 'فعال بچے' : 'kids active'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Visual representations */}
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col justify-between text-left">
                        <div className="space-y-2">
                          <span className="text-[10px] font-extrabold uppercase text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded">
                            {isUrdu ? 'سالانہ پیمائش' : 'Annual metrics'}
                          </span>
                          <h4 className="font-extrabold text-lg text-slate-900 font-fun mt-2">
                            {isUrdu ? 'تخمینہ سالانہ آمدن: $720K ARR' : 'Projection: $720K ARR'}
                          </h4>
                          <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
                            {isUrdu 
                              ? 'سوشل ٹیم کی جانب سے مہمات کی کارکردگی اور آرگینک ٹریفک کے مطابق تخمینہ لگایا گیا ہے۔' 
                              : 'Calculated with constant organic conversions from SEO marketing actions handled by the social team.'}
                          </p>
                        </div>
                        
                        <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden flex relative mt-4">
                          <div className="bg-blue-600 h-full" style={{ width: '65%' }} />
                          <div className="bg-yellow-400 h-full" style={{ width: '25%' }} />
                          <div className="bg-emerald-500 h-full" style={{ width: '10%' }} />
                        </div>

                        <div className="flex gap-3 text-[10px] font-black uppercase text-slate-500 pt-3">
                          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-600 rounded-full" /> {isUrdu ? 'سبسکرپشنز (۶۵٪)' : 'Subs (65%)'}</span>
                          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-yellow-400 rounded-full" /> {isUrdu ? 'کورس سیلز (۲۵٪)' : 'Catalog Sales (25%)'}</span>
                          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" /> {isUrdu ? 'شراکت داری (۱۰٪)' : 'Corporate (10%)'}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 5: System Settings and Global Rebranding */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-xl font-bold font-fun text-slate-900">
                        {isUrdu ? '⚙️ ویب سائٹ کی ترتیبات اور برانڈنگ' : '⚙️ KidsLearn Site parameters and Rebranding'}
                      </h3>
                      <p className="text-xs text-slate-400 font-semibold mt-1">
                        {isUrdu 
                          ? 'بچوں کے ڈیش بورڈ پر پلیٹ فارم کا نام، ٹائٹل، اور ڈیزائن کا رنگ لائیو تبدیل کریں۔' 
                          : 'Instantly deploy custom themes or alter the system title across student dashboards live.'}
                      </p>
                    </div>

                    <form onSubmit={handleSaveBranding} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5 text-left">
                          <label className="text-xs font-extrabold text-slate-500">{isUrdu ? 'ویب سائٹ کا باضابطہ ٹائٹل' : 'Global Website Title Name'}</label>
                          <input
                            type="text"
                            value={customPlatformName}
                            onChange={(e) => setCustomPlatformName(e.target.value)}
                            placeholder="e.g. KidsLearn Platform"
                            required
                            className="w-full bg-slate-50 border border-slate-200 outline-none p-3 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>

                        <div className="space-y-1.5 text-left">
                          <label className="text-xs font-extrabold text-slate-500">{isUrdu ? 'عالمی رنگوں کی تھیم پیلیٹ' : 'Global Primary Color Theme Palette'}</label>
                          <select
                            value={brandingThemeColor}
                            onChange={(e) => setBrandingThemeColor(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 outline-none p-3 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20"
                          >
                            <option value="Royal Blue + Sunshine Yellow">{isUrdu ? 'روشن اور خوبصورت — شاہی نیلے + پیلا برانڈ رنگ' : 'Bright & Playful — Royal Blue + Sunshine Yellow (PRD Preferred)'}</option>
                            <option value="Emerald Green + Coral Pink">{isUrdu ? 'تخلیقی باغیچہ — سبز + گلابی رنگ' : 'Creative Garden — Emerald Green + Coral Pink'}</option>
                            <option value="Cosmic Slate">{isUrdu ? 'خلائی مہم جوئی — خلائی نیلا + نیین پیلا رنگ' : 'Cosmic Adventure — Space Purple + Neon Yellow'}</option>
                          </select>
                        </div>

                        <div className="space-y-1.5 text-left md:col-span-2">
                          <label className="text-xs font-extrabold text-slate-500">{isUrdu ? 'والدین کے لیے خودکار خوش آمدید ای میل کا خاکہ' : 'Automated Parent Welcome Email Template'}</label>
                          <select
                            value={dailyDigestTemplate}
                            onChange={(e) => setDailyDigestTemplate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 outline-none p-3 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20"
                          >
                            <option value="Playful Welcome Email">{isUrdu ? 'خاکہ آپشن ۱: والدین کے لیے متحرک اور کھیل کود کی معلومات' : 'Welcome Email Option 1: Animated & Bright for Parents'}</option>
                            <option value="Academic Standards">{isUrdu ? 'خاکہ آپشن ۲: تعلیمی کامیابیوں اور رپورٹ کارڈز کی توثیق' : 'Welcome Email Option 2: Focus on curriculum metrics and certifications'}</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end border-t border-slate-100 pt-4">
                        <button
                          type="submit"
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow font-fun flex items-center gap-1.5 cursor-pointer"
                        >
                          {isUrdu ? 'رنگ اور برانڈنگ لاگو کریں 🚀' : 'Deploy System Parameter Changes 🚀'}
                        </button>
                      </div>
                    </form>
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
