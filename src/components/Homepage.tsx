import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Star, ArrowRight, Smile, Play, Shield, Compass, ChevronRight, Award } from 'lucide-react';
import { Course, AgeGroup } from '../types';
import { useLanguage } from '../LanguageContext';

interface HomepageProps {
  courses: Course[];
  onStartLearning: (courseId?: string) => void;
  onNavigateToView: (view: string) => void;
}

export default function Homepage({ courses, onStartLearning, onNavigateToView }: HomepageProps) {
  const [selectedAge, setSelectedAge] = useState<AgeGroup | 'all'>('all');
  const { t, language } = useLanguage();

  const ageLabels: { value: AgeGroup | 'all'; label: string; desc: string; emoji: string }[] = [
    { value: 'all', label: t('age.all'), desc: t('age.desc.all'), emoji: '🌟' },
    { value: '3-5', label: t('age.early'), desc: t('age.desc.early'), emoji: '🐥' },
    { value: '6-7', label: t('age.starters'), desc: t('age.desc.starters'), emoji: '🦊' },
    { value: '8-10', label: t('age.builders'), desc: t('age.desc.builders'), emoji: '🚀' },
    { value: '11-12', label: t('age.champions'), desc: t('age.desc.champions'), emoji: '🏆' },
  ];

  const filteredCourses = selectedAge === 'all' 
    ? courses 
    : courses.filter(c => c.ageGroup === selectedAge);

  const testimonials = [
    {
      name: 'Jennifer S.',
      role: language === 'ur' ? "لیام کی والدہ (عمر ۴ سال)" : "Liam's Mom (Age 4)",
      text: language === 'ur' ? "لیو بالکل 'فونکس ایڈونچرز' کورس کو پسند کرتا ہے۔ حروف خوبصورت اور ہنستے کھیلتے کرداروں کی صورت میں زندگی میں آتے ہیں۔ سیکھنا بالکل کسی کھیل کی طرح لگتا ہے لیکن یہ انتہائی تعمیری ہے!" : "Leo absolute adores the Phonics Adventures course. The letters come to life as adorable happy creatures. Learning feels just like screen time but is actually constructive!",
      avatar: '👩‍⚕️',
      rating: 5,
    },
    {
      name: 'Marcus K.',
      role: language === 'ur' ? "صوفیہ کے والد (عمر ۹ سال)" : "Sophia’s Dad (Age 9)",
      text: language === 'ur' ? "کریٹیو کوڈنگ میں صوفیہ کی پیش رفت نے اسے ایک نئی قوت دی ہے۔ اس نے اپنا پہلا انٹرایکٹو بلاک پر مبنی بھول بھلیوں کا پروجیکٹ تیار کیا اور خود کو کسی راکٹ سائنسدان کی طرح محسوس کیا۔" : "Emma’s progress in Creative Coding gave Sophia the boost she needed. She designed her first interactive block-based maze and felt like a rocket scientist.",
      avatar: '👨‍💻',
      rating: 5,
    },
    {
      name: 'Dr. Helen Carter',
      role: language === 'ur' ? "تعلیمی ماہرِ نفسیات" : "Educational Psychologist",
      text: language === 'ur' ? "کڈز لرن ان چند آن لائن پلیٹ فارمز میں سے ایک ہے جو بچوں کی کمپیوٹر کے ساتھ سیکھنے کی سرگرمیوں کو بالکل صحیح طریقے سے سمجھتا ہے۔ چھوٹے بچوں کے لیے انتہائی پرکشش اور بڑے بچوں کے لیے بہترین ترتیب شدہ۔" : "KidsLearn is one of the very few online platforms that gets child computer interaction right. Highly visual for young ones, and beautifully structured for older kids.",
      avatar: '👩‍🏫',
      rating: 5,
    }
  ];

  return (
    <div className={`overflow-x-hidden min-h-screen text-slate-800 ${language === 'ur' ? 'font-urdu' : ''}`}>
      {/* Hero Section with Bright Yellow + Blue Playful Layout */}
      <section className="relative px-6 py-16 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 md:py-28 text-white rounded-b-[40px] shadow-lg overflow-hidden">
        {/* Floating background shapes */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-yellow-400 opacity-20 rounded-full animate-float" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-300 opacity-20 rounded-lg rotate-12 animate-float-delayed" />
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-pink-400 opacity-20 rounded-full animate-float" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            
            {/* Left Column: Tagline & Active Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-400 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-full shadow-md font-fun">
                <Smile className="w-4 h-4 text-blue-800 animate-spin shrink-0" />
                {t('home.badge')}
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white font-fun">
                {t('home.heroTitle1')}<span className="text-yellow-300 underline decoration-yellow-300 underline-offset-4">{t('home.heroTitle2')}</span>
              </h1>
              
              <p className="text-lg text-blue-50 opacity-95 max-w-xl font-medium leading-relaxed">
                {t('home.heroDesc')}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button 
                  id="hero-cta-get-started"
                  onClick={() => onNavigateToView('student')}
                  className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-extrabold text-lg rounded-full shadow-lg transform active:scale-95 transition-all duration-150 inline-flex items-center gap-2 font-fun"
                >
                  {t('home.ctaStart')}
                  <ArrowRight className={`w-5 h-5 text-slate-900 ${language === 'ur' ? 'rotate-180' : ''}`} />
                </button>
                <button 
                  id="hero-cta-parent"
                  onClick={() => onNavigateToView('parent')}
                  className="px-6 py-4 bg-white/20 hover:bg-white/30 text-white font-bold text-lg rounded-full border border-white/30 transform active:scale-95 transition-all duration-150 font-fun"
                >
                  {t('home.ctaParent')}
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10">
                <div className="flex -space-x-3">
                  {['🦁', '🦊', '🐨', '🐼'].map((emoji, i) => (
                    <div key={i} className="flex items-center justify-center w-9 h-9 bg-white text-base rounded-full shadow-md border-2 border-blue-500">
                      {emoji}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-1 text-yellow-300">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-sm text-blue-100 font-semibold">{t('home.trustText')}</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Cartoon-style visual device illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center"
            >
              <div className="relative w-full max-w-md p-2 bg-yellow-300 rounded-[32px] shadow-2xl rotate-2">
                <div className="bg-slate-950 rounded-[24px] overflow-hidden aspect-video relative group border-[8px] border-slate-900">
                  {/* Styled play video mockup */}
                  <img 
                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80" 
                    alt="Kids learning online" 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex flex-col justify-end p-6 text-left">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-2">Age 3-5 Course</span>
                    <h3 className="text-white text-lg font-bold font-fun leading-tight">Phonics with Sarah Jenkins</h3>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={() => onStartLearning('course-1')}
                      className="w-16 h-16 bg-yellow-400 hover:bg-yellow-300 text-slate-900 flex items-center justify-center rounded-full shadow-2xl border-4 border-white animate-bounce pointer-events-auto"
                    >
                      <Play className="w-8 h-8 fill-current translate-x-0.5 text-slate-950" />
                    </button>
                  </div>
                </div>

                {/* Overlapping badge */}
                <div className="absolute -bottom-6 -left-6 bg-white py-3 px-4 rounded-2xl flex items-center gap-3 shadow-xl border border-slate-100 -rotate-6">
                  <div className="bg-yellow-100 text-yellow-600 p-2 rounded-xl">
                    <Award className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-500 font-semibold">
                      {language === 'ur' ? "مصدقہ نصاب" : "Certified Core"}
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {language === 'ur' ? "سائنس و ریاضی نصاب" : "STEM Curriculum"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Course Highlights by Age Group (interactive) */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-fun">
            {language === 'ur' ? "عمر کے لحاظ سے " : "Adventure Lands "}<span className="text-blue-600">{language === 'ur' ? "اسباق کے میدان" : "by Age Group"}</span>
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto font-medium">
            {language === 'ur' 
              ? "ہر عمر کے بچوں کے لیے مخصوص تعلیمی راستے دریافت کریں۔ گنتی، سائنس، کوڈنگ یا ابتدائی فونکس اور زبان سیکھیں۔" 
              : "Filter our learning pathways tailored for every cognitive milestone. Learn counting, science, complex public speaking, or foundational phonics."}
          </p>

          {/* Tab Navigation bar with high fidelity */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            {ageLabels.map((tab) => {
              const active = selectedAge === tab.value;
              return (
                <button
                  key={tab.value}
                  id={`age-tab-${tab.value}`}
                  onClick={() => setSelectedAge(tab.value)}
                  className={`px-5 py-3 rounded-2xl font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    active 
                      ? 'bg-blue-600 text-white shadow-lg scale-105' 
                      : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-xl">{tab.emoji}</span>
                  <div className="text-left">
                    <p className="text-xs font-semibold leading-none opacity-80">{tab.desc}</p>
                    <p className="text-sm font-bold font-fun leading-tight">{tab.label}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Course Card Grid results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <motion.div
              layout
              key={course.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl transition-all flex flex-col group justify-between"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-yellow-400 text-slate-900 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider font-fun shadow">
                    👧 {language === 'ur' ? "عمر" : "Ages"} {course.ageGroup}
                  </div>
                  <div className={`absolute top-4 right-4 font-black text-xs px-2.5 py-1 rounded-full shadow border font-fun ${
                    course.level === 'Beginner' ? 'bg-emerald-55 bg-emerald-50 border-emerald-200 text-emerald-700' :
                    course.level === 'Average' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                    'bg-rose-50 border-rose-200 text-rose-700'
                  }`}>
                    {t(course.level)}
                  </div>
                </div>

                <div className="p-6 text-left space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span>
                      {course.lessons.length} {language === 'ur' ? "بنیادی مہم جوئی اسباق" : "Core Adventure Lessons"}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-extrabold text-slate-900 leading-snug hover:text-blue-600 transition-colors font-fun">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {course.description}
                  </p>

                  <p className="text-xs text-slate-500 font-semibold pt-1">
                    👨‍🏫 {course.instructorName}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-50 mt-2">
                <button
                  id={`course-cta-${course.id}`}
                  onClick={() => onStartLearning(course.id)}
                  className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold rounded-2xl transition-colors flex items-center justify-center gap-2 group/btn font-fun"
                >
                  {t('nav.enter')}
                  <ChevronRight className={`w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform ${language === 'ur' ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-yellow-50 py-16 px-6 relative rounded-[40px] shadow-inner mb-16">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-fun">
              {language === 'ur' ? "تعلیمی مہم کے " : "How Adventures "}<span className="text-blue-600">{language === 'ur' ? "آسان مراحل" : "Unfold"}</span>
            </h2>
            <p className="text-slate-600 max-w-md mx-auto font-medium">
              {language === 'ur' 
                ? "ہم منظم ڈیجیٹل تعلیم کو تین آسان مراحل میں انتہائی آسان اور دلچسپ بناتے ہیں۔" 
                : "We make structured digital learning streamlined and fully interactive in three straightforward steps."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 font-sans">
            {[
              {
                step: '1',
                title: language === 'ur' ? "عمر اور کورس کا انتخاب کریں" : 'Choose Age & Course',
                desc: language === 'ur' 
                  ? 'اپنے بچے کے لیے موزوں ویڈیو کورسز کی وسیع رینج میں سے انتخاب کریں۔' 
                  : 'Select from our wide array of video courses created exactly for your child’s milestone.',
                emoji: '🏆',
                color: 'bg-blue-100 text-blue-600'
              },
              {
                step: '2',
                title: language === 'ur' ? "کھیل کھیل میں سیکھیں" : 'Learn by Playing',
                desc: language === 'ur' 
                  ? 'دلچسپ اور رنگین ویڈیوز دیکھیں، ورک شیٹ ڈاؤن لوڈ کریں اور کوئز حل کریں۔' 
                  : 'Watch entertaining visual lessons, download worksheets, and complete gamified quizzes.',
                emoji: '🎮',
                color: 'bg-yellow-100 text-yellow-600'
              },
              {
                step: '3',
                title: language === 'ur' ? "بیجز اور ستارے جیتیں" : 'Earn Badges & Stars',
                desc: language === 'ur' 
                  ? 'دلچسپ کارٹون بیجز اور کورس مکمل ہونے پر تعلیمی اسناد حاصل کریں۔' 
                  : 'Unlock collectible monster tags and printable completion certificates while driving active curiosity.',
                emoji: '🥇',
                color: 'bg-emerald-100 text-emerald-600'
              }
            ].map((step, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl relative border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-blue-600 text-white font-extrabold flex items-center justify-center rounded-full text-lg shadow-md font-fun">
                  {step.step}
                </div>
                
                <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center text-3xl shadow-sm mt-2`}>
                  {step.emoji}
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-fun">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-fun">
            {language === 'ur' ? "والدین کی پسند، " : "Trusted by "}<span className="text-yellow-500">{language === 'ur' ? "ہر جگہ کا اعتماد" : "Parents Everywhere"}</span>
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto font-medium">
            {language === 'ur' 
              ? "پڑھیے کہ دوسرے والدین اور تعلیم کے ماہرین ہمارے تعلیمی طریقے کے بارے میں کیا رائے رکھتے ہیں۔" 
              : "Read what other mothers, fathers, and certified instructional specialists say about the KidsLearn methodology."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-left flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex gap-1 text-yellow-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 italic text-sm leading-relaxed">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6 mt-6 border-t border-slate-50">
                <span className="text-3xl">{t.avatar}</span>
                <div>
                  <h4 className="font-extrabold text-slate-900 leading-none">{t.name}</h4>
                  <p className="text-xs text-slate-500 font-bold mt-1">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bright Footer CTA Banner */}
      <section className="px-6 py-12 md:py-20 max-w-7xl mx-auto">
        <div className="bg-yellow-400 rounded-[40px] px-8 py-12 text-center md:p-16 relative overflow-hidden shadow-xl grid md:grid-cols-3 gap-8 items-center text-slate-900">
          <div className="md:col-span-2 text-left space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-fun tracking-tight">
              {language === 'ur' ? "کیا آپ بچوں کا شوق بیدار کرنے کے لیے تیار ہیں؟" : "Ready to Spark Genuine Curiosity?"}
            </h2>
            <p className="text-base text-slate-800 font-medium max-w-xl font-sans">
              {language === 'ur' 
                ? "اپنے بچوں کو عملی پڑھائی، کمپیوٹر کوڈنگ اور سائنسی سوچ سے آراستہ کریں۔ اب تمام ڈیش بورڈز تک مفت رسائی حاصل کریں۔" 
                : "Equip your children with practical reading, block coding, and scientific logic. Get unlimited demo access to all dashboards right now."}
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <button
              onClick={() => onNavigateToView('student')}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg rounded-full shadow-lg transform active:scale-95 transition-all text-center font-fun"
            >
              {language === 'ur' ? "مفت سیکھنا شروع کریں" : "Sign Up Free (Demo)"}
            </button>
          </div>
        </div>
      </section>

      {/* Footer section with Socials & details */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 rounded-t-[40px] border-t-4 border-yellow-400 font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-black text-2xl font-fun">
              <span className="text-yellow-400">🎓</span> KidsLearn
            </div>
            <p className="text-sm">
              {language === 'ur' 
                ? "بچوں کے سیکھنے کی بہترین گیمیفائیڈ کائنات جہاں کہانیوں، مہم جوئی اور سائنسی علم کے ذریعے مستقبل کے ستارے جنم لیتے ہیں۔" 
                : "The premier gamified learning destination where exploration, storytelling, and science unite to build confident young stars."}
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 font-fun uppercase tracking-wider text-sm">
              {language === 'ur' ? "عمر کے راستے" : "Age Tracks"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => { setSelectedAge('3-5'); window.scrollTo({top: 500, behavior: 'smooth'}); }} className="hover:text-yellow-400 text-left transition-colors font-fun font-bold text-xs">{language === 'ur' ? "🐥 چھوٹے بچے (عمر ۳-۵)" : "🐥 Early Littles (Ages 3-5)"}</button></li>
              <li><button onClick={() => { setSelectedAge('6-7'); window.scrollTo({top: 500, behavior: 'smooth'}); }} className="hover:text-yellow-400 text-left transition-colors font-fun font-bold text-xs">{language === 'ur' ? "🦊 شروعات کرنے والے (عمر ۶-۷)" : "🦊 Fun Starters (Ages 6-7)"}</button></li>
              <li><button onClick={() => { setSelectedAge('8-10'); window.scrollTo({top: 500, behavior: 'smooth'}); }} className="hover:text-yellow-400 text-left transition-colors font-fun font-bold text-xs">{language === 'ur' ? "🚀 ہنر مند بچے (عمر ۸-۱۰)" : "🚀 Skill Builders (Ages 8-10)"}</button></li>
              <li><button onClick={() => { setSelectedAge('11-12'); window.scrollTo({top: 500, behavior: 'smooth'}); }} className="hover:text-yellow-400 text-left transition-colors font-fun font-bold text-xs">{language === 'ur' ? "🏆 چیمپئنز (عمر ۱۱-۱۲)" : "🏆 Young Champions (Ages 11-12)"}</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 font-fun uppercase tracking-wider text-sm">
              {language === 'ur' ? "ڈیش بورڈز" : "Dashboards"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => onNavigateToView('student')} className="hover:text-yellow-400 text-left transition-colors">{language === 'ur' ? "👦 شاگرد ڈیش بورڈ" : "👦 Student Dashboard"}</button></li>
              <li><button onClick={() => onNavigateToView('parent')} className="hover:text-yellow-400 text-left transition-colors">{language === 'ur' ? "👩 والدین پورٹل" : "👩 Parent Dashboard"}</button></li>
              <li><button onClick={() => onNavigateToView('instructor')} className="hover:text-yellow-400 text-left transition-colors">{language === 'ur' ? "👨‍🏫 اساتذہ ورک سپیس" : "👨‍🏫 Teacher Workspace"}</button></li>
              <li><button onClick={() => onNavigateToView('admin')} className="hover:text-yellow-400 text-left transition-colors">{language === 'ur' ? "🛡️ فاؤنڈر پینل" : "🛡️ Founder Panel"}</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 font-fun uppercase tracking-wider text-sm">
              {language === 'ur' ? "ہمارا مشن" : "Our Mission"}
            </h4>
            <p className="text-sm">
              {language === 'ur' 
                ? "والدین اور بہترین اساتذہ کی ماہر ٹیم کے ساتھ تعلیمی معیار اور بچوں کے روشن مستقبل کو یقینی بنانے کا عزم۔" 
                : "Supporting the 8-member elite build team: from our Curriculum Designer to the Student Success Manager. Quality education in a trusted ecosystem."}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-center text-xs md:flex md:justify-between md:text-left">
          <p>
            {language === 'ur' 
              ? "© ۲۰۲۶ کڈز لرن۔ محبت کے ساتھ ڈیزائن کیا گیا۔ جملہ حقوق محفوظ ہیں۔" 
              : "© 2026 KidsLearn Inc. Crafted with Care. All Rights Reserved."}
          </p>
          <div className="flex justify-center gap-4 mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer">{language === 'ur' ? "پرائیویسی پالیسی" : "Privacy Policy"}</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">{language === 'ur' ? "استعمال شرائط" : "Terms of Use"}</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">{language === 'ur' ? "مدد اور رہنمائی" : "Support"}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
