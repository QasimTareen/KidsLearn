import { Course, StudentProfile, PaymentInvoice, StudentRosterItem, CourseReport, UserManagementItem, CourseApprovalRequest, InstructorMessage } from './types';

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'child-1',
    name: 'Leo',
    avatar: '🦁',
    ageGroup: '3-5',
    grade: 'Preschool',
    stars: 120,
    streak: 5,
    completedHours: 4.5,
    badges: [
      {
        id: 'badge-1',
        title: 'Alphabet Master',
        description: 'Completed Phonics Level 1',
        icon: 'BookOpen',
        dateEarned: '2026-05-10',
        color: 'bg-indigo-100 text-indigo-700 border-indigo-200'
      },
      {
        id: 'badge-2',
        title: 'Star Counter',
        description: 'Earned 100 learning stars',
        icon: 'Star',
        dateEarned: '2026-05-18',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
      }
    ]
  },
  {
    id: 'child-2',
    name: 'Emma',
    avatar: '🦄',
    ageGroup: '8-10',
    grade: '4th Grade',
    stars: 480,
    streak: 12,
    completedHours: 32.0,
    badges: [
      {
        id: 'badge-3',
        title: 'Code Ninja',
        description: 'Coded a loop completely by myself',
        icon: 'Cpu',
        dateEarned: '2026-04-20',
        color: 'bg-green-100 text-green-700 border-green-200'
      },
      {
        id: 'badge-4',
        title: 'Speedy Reader',
        description: 'Read 5 comprehension stories',
        icon: 'Zap',
        dateEarned: '2026-05-02',
        color: 'bg-orange-100 text-orange-700 border-orange-200'
      },
      {
        id: 'badge-5',
        title: 'Space Cadet',
        description: 'Passed the Solar System Quiz with 100%',
        icon: 'Compass',
        dateEarned: '2026-05-22',
        color: 'bg-purple-100 text-purple-700 border-purple-200'
      }
    ]
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Phonics Adventures: Sounds & Storytelling',
    instructorName: 'Sarah Jenkins (Early Childhood)',
    ageGroup: '3-5',
    description: 'Learn the foundational sounds of letters through fun animations, interactive rhymes, and hand gestures. Perfect for young readers!',
    progress: 60,
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&auto=format&fit=crop&q=80',
    level: 'Beginner',
    lessons: [
      {
        id: 'c1-l1',
        title: 'Meet the Happy Letter A',
        duration: '5:20',
        videoUrl: 'https://www.youtube.com/embed/2_m97z_uM6Y', // letter A song / video placeholder
        completed: true,
        worksheetUrl: '/phonics_letter_a.pdf',
        quiz: {
          questions: [
            {
              id: 'q1',
              question: 'Which word starts with the sound "Ah" like A?',
              options: ['Apple 🍎', 'Banana 🍌', 'Car 🚗', 'Dog 🐶'],
              correctAnswer: 0
            },
            {
              id: 'q2',
              question: 'What shape is the big letter A?',
              options: ['Circle (Round) ⭕', 'Triangle (Pointy Top) 🔺', 'Square (Four Corners) 🟩'],
              correctAnswer: 1
            }
          ]
        }
      },
      {
        id: 'c1-l2',
        title: 'Bouncing Baby letter B',
        duration: '6:15',
        videoUrl: 'https://www.youtube.com/embed/jZ_Eby_gKLI',
        completed: true,
        worksheetUrl: '/phonics_letter_b.pdf',
        quiz: {
          questions: [
            {
              id: 'q3',
              question: 'Which cute animal starts with letter B?',
              options: ['Cat 🐱', 'Bear 🐻', 'Frog 🐸'],
              correctAnswer: 1
            }
          ]
        }
      },
      {
        id: 'c1-l3',
        title: 'Cool Cats and letter C',
        duration: '4:45',
        videoUrl: 'https://www.youtube.com/embed/-J7HcVLsSZ4',
        completed: false,
        worksheetUrl: '/phonics_letter_c.pdf',
        quiz: {
          questions: [
            {
              id: 'q4',
              question: 'What sound does letter C make in "Cat"?',
              options: ['Kuh-Kuh-Kuh 🐱', 'Muh-Muh-Muh 🐮', 'Sss-Sss-Sss 🐍'],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: 'c1-l4',
        title: 'Drifting Dinosaur D',
        duration: '7:10',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/mPhH6T75x_Y'
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Math Monsters: Counting & Creative Shapes',
    instructorName: 'Sarah Jenkins (Early Childhood)',
    ageGroup: '3-5',
    description: 'Befriend helpful math monsters while learning to count up to 20 and identifying common shapes inside your room.',
    progress: 25,
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&auto=format&fit=crop&q=80',
    level: 'Beginner',
    lessons: [
      {
        id: 'c2-l1',
        title: 'Counting 1 to 5 with Toby the Monster',
        duration: '4:30',
        videoUrl: 'https://www.youtube.com/embed/V_bU89_cQpM',
        completed: true,
        worksheetUrl: '/math_count_5.pdf',
        quiz: {
          questions: [
            {
              id: 'q5',
              question: 'How many fingers do you see on one single hand?',
              options: ['3', '4', '5🌟', '6'],
              correctAnswer: 2
            }
          ]
        }
      },
      {
        id: 'c2-l2',
        title: 'Circles, Circles Everywhere!',
        duration: '5:50',
        videoUrl: 'https://www.youtube.com/embed/K8vR_YV6m_c',
        completed: false,
        worksheetUrl: '/math_shapes.pdf',
        quiz: {
          questions: [
            {
              id: 'q6',
              question: 'Which of these is perfectly round like a circle?',
              options: ['A Pizza Box 📦', 'A Soccer Ball ⚽', 'A Pyramide 🔺'],
              correctAnswer: 1
            }
          ]
        }
      }
    ]
  },
  {
    id: 'course-3',
    title: 'Creative Coding: Code Your First Game!',
    instructorName: 'David Lee (Skill Development)',
    ageGroup: '8-10',
    description: 'Introduction to block-based coding. Build your very own custom maze game! Click coding blocks together just like puzzle pieces.',
    progress: 80,
    image: 'https://images.unsplash.com/photo-1515041219749-89347f83291a?w=400&auto=format&fit=crop&q=80',
    level: 'Average',
    lessons: [
      {
        id: 'c3-l1',
        title: 'Algorithms: Directions & Maze Solver',
        duration: '8:45',
        videoUrl: 'https://www.youtube.com/embed/nKIu9yen5mc',
        completed: true,
        worksheetUrl: '/coding_block_maze.pdf',
        quiz: {
          questions: [
            {
              id: 'q7',
              question: 'What is an "Algorithm" in computer coding?',
              options: ['A step-by-step set of commands to solve a puzzle 🧩', 'A mathematical calculator', 'A fancy type of monitor scream'],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: 'c3-l2',
        title: 'Variables: How Games Keep Score',
        duration: '9:15',
        videoUrl: 'https://www.youtube.com/embed/P6Ff8C6qCH0',
        completed: true,
        worksheetUrl: '/variables_lesson.pdf',
        quiz: {
          questions: [
            {
              id: 'q8',
              question: 'If you grab a shiny gold star that is worth 10 points, what stores this value?',
              options: ['A code loop', 'A variable box 📦', 'A sprite character'],
              correctAnswer: 1
            }
          ]
        }
      },
      {
        id: 'c3-l3',
        title: 'Loops: Making Actions Repeat Forever',
        duration: '10:30',
        videoUrl: 'https://www.youtube.com/embed/D_v-Mv-1kXk',
        completed: false,
        worksheetUrl: '/loops_blockly.pdf',
        quiz: {
          questions: [
            {
              id: 'q9',
              question: 'Which command helps you repeating a step 10 times without rewriting it?',
              options: ['If-Else statement', 'Repeat or Loop Block 🔁', 'Stop Button'],
              correctAnswer: 1
            }
          ]
        }
      }
    ]
  },
  {
    id: 'course-4',
    title: 'Intro to Space Science: Planets & Rocket Launch',
    instructorName: 'David Lee (Skill Development)',
    ageGroup: '8-10',
    description: 'Take a virtual rocket voyage through our solar system! Discover the extreme temperatures of Saturn and volcanic peaks of Mars.',
    progress: 100,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=80',
    level: 'Hard',
    lessons: [
      {
        id: 'c4-l1',
        title: 'Welcome to the solar system: Meet Sol',
        duration: '6:50',
        videoUrl: 'https://www.youtube.com/embed/w36yxLgwU9c',
        completed: true,
        quiz: {
          questions: [
            {
              id: 'q10',
              question: 'Which of the following bodies lies exactly in the center of our solar system?',
              options: ['The planet Earth 🌍', 'Our warm Star, the Sun ☀️', 'The glowing Moon 🌙'],
              correctAnswer: 1
            }
          ]
        }
      },
      {
        id: 'c4-l2',
        title: 'Gravity & Planetary Orbits',
        duration: '8:10',
        videoUrl: 'https://www.youtube.com/embed/YI6l_7q1Y8E',
        completed: true,
        quiz: {
          questions: [
            {
              id: 'q11',
              question: 'Which big physical force keeps planets orbiting around Sol?',
              options: ['Electrostatic repulsion', 'Frictional force of space dust', 'Gravitational pull ☄️'],
              correctAnswer: 2
            }
          ]
        }
      }
    ]
  },
  {
    id: 'course-5',
    title: 'Public Speaking Champions: Expressive Writing',
    instructorName: 'Eleanor Vance (Communication)',
    ageGroup: '11-12',
    description: 'Learn the techniques top speakers use to capture attention. Overcome stage fright, command your vocal range, and structure speeches that move.',
    progress: 0,
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&auto=format&fit=crop&q=80',
    level: 'Average',
    lessons: [
      {
        id: 'c5-l1',
        title: 'The Power of Your Voice: Intonation',
        duration: '11:40',
        videoUrl: 'https://www.youtube.com/embed/pSj7SAsy-N4',
        completed: false,
        quiz: {
          questions: [
            {
              id: 'q12',
              question: 'What is the standard effect of varying your vocal tone and pauses?',
              options: ['It confuses your listeners', 'It makes your message sound robotic', 'It keeps your audience highly engaged 🎤'],
              correctAnswer: 2
            }
          ]
        }
      }
    ]
  }
];

export const INITIAL_MESSAGES: InstructorMessage[] = [
  {
    id: 'msg-1',
    sender: 'Teacher',
    senderName: 'Sarah Jenkins',
    content: 'Hi Leo’s mom! Leo did an amazing job during today’s Phonics lesson. He pronounced all the "Ah" sounds perfectly. Keep up the reading practice!',
    timestamp: '2026-05-25 14:30'
  },
  {
    id: 'msg-2',
    sender: 'Parent',
    senderName: 'Emily (Leo’s Mom)',
    content: 'Thank you Sarah! He was so excited to tell me about the happy letter A 🍎 and Tobias the count monster! He asked if we can count apples at dinner.',
    timestamp: '2026-05-25 15:10'
  },
  {
    id: 'msg-3',
    sender: 'Teacher',
    senderName: 'David Lee',
    content: 'Hi! Emma completed her coding loop quiz with flying colors! She has a great logical mind. She should try adding nested loops in her Scratch project.',
    timestamp: '2026-05-26 09:12'
  }
];

export const PAYMENT_HISTORY: PaymentInvoice[] = [
  {
    id: 'inv-101',
    date: '2026-05-01',
    amount: 49.00,
    courseTitle: 'Phonics Adventures: Sounds & Storytelling',
    status: 'Paid'
  },
  {
    id: 'inv-102',
    date: '2026-05-15',
    amount: 59.00,
    courseTitle: 'Creative Coding: Code Your First Game!',
    status: 'Paid'
  },
  {
    id: 'inv-103',
    date: '2026-06-01',
    amount: 59.00,
    courseTitle: 'Monthly All-Course Subscription',
    status: 'Pending'
  }
];

export const STUDENT_ROSTER: StudentRosterItem[] = [
  {
    id: 'rost-1',
    name: 'Leo Jenkins',
    ageGroup: '3-5',
    parentName: 'Emily Jenkins',
    lessonsCompleted: 2,
    totalLessons: 4,
    avgQuizScore: 90
  },
  {
    id: 'rost-2',
    name: 'Emma Watson',
    ageGroup: '8-10',
    parentName: 'Robert Watson',
    lessonsCompleted: 2,
    totalLessons: 3,
    avgQuizScore: 100
  },
  {
    id: 'rost-3',
    name: 'Noah Smith',
    ageGroup: '6-7',
    parentName: 'William Smith',
    lessonsCompleted: 1,
    totalLessons: 4,
    avgQuizScore: 80
  },
  {
    id: 'rost-4',
    name: 'Sophia Davis',
    ageGroup: '11-12',
    parentName: 'Chloe Davis',
    lessonsCompleted: 0,
    totalLessons: 1,
    avgQuizScore: 0
  }
];

export const COURSE_REPORTS: CourseReport[] = [
  {
    id: 'course-1',
    title: 'Phonics Adventures',
    enrolledStudents: 145,
    avgQuizScore: 92,
    completionRate: 74
  },
  {
    id: 'course-2',
    title: 'Math Monsters',
    enrolledStudents: 112,
    avgQuizScore: 88,
    completionRate: 60
  },
  {
    id: 'course-3',
    title: 'Creative Coding',
    enrolledStudents: 189,
    avgQuizScore: 95,
    completionRate: 85
  },
  {
    id: 'course-4',
    title: 'Intro to Space Science',
    enrolledStudents: 98,
    avgQuizScore: 96,
    completionRate: 98
  }
];

export const MOCK_USERS_MANAGEMENT: UserManagementItem[] = [
  { id: 'usr-1', name: 'Emily Jenkins', email: 'emily@example.com', role: 'Parent', status: 'Active' },
  { id: 'usr-2', name: 'Robert Watson', email: 'robert@example.com', role: 'Parent', status: 'Active' },
  { id: 'usr-3', name: 'Sarah Jenkins', email: 'sarah.j@kidslearn.com', role: 'Instructor', status: 'Active' },
  { id: 'usr-4', name: 'David Lee', email: 'david.l@kidslearn.com', role: 'Instructor', status: 'Active' },
  { id: 'usr-5', name: 'Admin Master', email: 'admin@kidslearn.com', role: 'Admin', status: 'Active' },
  { id: 'usr-6', name: 'Naughty Luke', email: 'luke@example.com', role: 'Student', status: 'Suspended' }
];

export const COURSE_APPROVALS: CourseApprovalRequest[] = [
  { id: 'appr-1', title: 'Little Gardeners: Botany for Kids', instructorName: 'Sarah Jenkins', ageGroup: '3-5', status: 'Pending', dateSubmitted: '2026-05-24' },
  { id: 'appr-2', title: 'Scratch Coding Masters Level 2', instructorName: 'David Lee', ageGroup: '8-10', status: 'Approved', dateSubmitted: '2026-05-20' },
  { id: 'appr-3', title: 'World History Explorers', instructorName: 'Eleanor Vance', ageGroup: '11-12', status: 'Rejected', dateSubmitted: '2026-05-18' }
];
