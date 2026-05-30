import { QuizQuestion } from '../types';

export interface DynamicQuiz {
  questions: QuizQuestion[];
}

const ASSESSMENT_DATABASE: Record<string, Record<string, QuizQuestion[]>> = {
  'Grade 8': {
    'Science': [
      { id: 'g8s1', question: 'What organelle is known as the powerhouse of the eukaryotic cell?', options: ['Nucleus', 'Mitochondria 🔋', 'Ribosome', 'Chloroplast'], correctAnswer: 1 },
      { id: 'g8s2', question: 'Which element represents the letter "O" on the Periodic Table?', options: ['Gold', 'Osmund', 'Oxygen 💨', 'Opal'], correctAnswer: 2 },
      { id: 'g8s3', question: 'What is the speed of light in a vacuum?', options: ['300,000 km/s ⚡', '150,000 km/s', '1,000 km/s', '3,000,000 km/s'], correctAnswer: 0 }
    ],
    'Mathematics': [
      { id: 'g8m1', question: 'Solve for x: x/3 + 4 = 7', options: ['x = 1', 'x = 3', 'x = 9 🔢', 'x = 12'], correctAnswer: 2 },
      { id: 'g8m2', question: 'What is the square root of 225?', options: ['12', '14', '15 ✨', '25'], correctAnswer: 2 }
    ],
    'Coding': [
      { id: 'g8c1', question: 'In Scratch coding, what block is used to loop an action indefinitely?', options: ['Repeat (10)', 'Forever ♾️', 'If-Then', 'When flag clicked'], correctAnswer: 1 },
      { id: 'g8c2', question: 'What is a variable?', options: ['A constant label', 'A container to hold values 🗃️', 'A loop controller', 'A syntax bug'], correctAnswer: 1 }
    ],
    'Phonics': [
      { id: 'g8p1', question: 'Which word contains a silent consonant?', options: ['Dinosaur', 'Gnaw 🦷', 'Target', 'Fossil'], correctAnswer: 1 }
    ]
  },
  'Grade 9': {
    'Science': [
      { id: 'g9s1', question: 'According to Newton\'s First Law, what describes an object\'s resistance to change in motion?', options: ['Gravity', 'Inertia 🌌', 'Friction', 'Velocity'], correctAnswer: 1 },
      { id: 'g9s2', question: 'What pH level is considered perfectly neutral?', options: ['pH = 0', 'pH = 5', 'pH = 7 💧', 'pH = 14'], correctAnswer: 2 }
    ],
    'Mathematics': [
      { id: 'g9m1', question: 'Solve the equation: 3x - 5 = 16', options: ['x = 5', 'x = 6', 'x = 7 🏁', 'x = 8'], correctAnswer: 2 },
      { id: 'g9m2', question: 'What is the sum of angles inside a standard triangle?', options: ['90°', '180° 📐', '270°', '360°'], correctAnswer: 1 }
    ],
    'Coding': [
      { id: 'g9c1', question: 'What index represents the very first element in JavaScript arrays?', options: ['index = 1', 'index = 0 💻', 'index = -1', 'index = null'], correctAnswer: 1 }
    ],
    'Phonics': [
      { id: 'g9p1', question: 'Select the synonym for the academic noun: "Elated"', options: ['Exhausted', 'Extremely Happy 😄', 'Confused', 'Enraged'], correctAnswer: 1 }
    ]
  },
  'Grade 10': {
    'Science': [
      { id: 'g10s1', question: 'What cellular process results in four non-identical daughter sperm or egg cells?', options: ['Mitosis', 'Meiosis 🧪', 'Apoptosis', 'Binary Fission'], correctAnswer: 1 },
      { id: 'g10s2', question: 'Which gas contributes the most to the greenhouse effect on Earth?', options: ['Argon', 'Nitrogen', 'Carbon Dioxide (CO2) 🌍', 'Helium'], correctAnswer: 2 }
    ],
    'Mathematics': [
      { id: 'g10m1', question: 'Find the hypotenuse length of a right-angled triangle with side lengths 6 and 8.', options: ['10 📐', '12', '14', '100'], correctAnswer: 0 },
      { id: 'g10m2', question: 'What is the log base 10 of 1000?', options: ['1', '2', '3 📊', '10'], correctAnswer: 2 }
    ],
    'Coding': [
      { id: 'g10c1', question: 'Which keyword is typically used in modern JS to define block-scoped immutable variables?', options: ['var', 'let', 'const 🔒', 'define'], correctAnswer: 2 }
    ],
    'Phonics': [
      { id: 'g10p1', question: 'What figure of speech compares two items using "like" or "as"?', options: ['Metaphor', 'Simile 🗺️', 'Hyperbole', 'Onomatopoeia'], correctAnswer: 1 }
    ]
  },
  'Grade 11': {
    'Science': [
      { id: 'g11s1', question: 'What is the chemical name of table salt?', options: ['Sodium Carbonate', 'Sodium Chloride (NaCl) 🧂', 'Potassium Nitrate', 'Calcium Sulfate'], correctAnswer: 1 }
    ],
    'Mathematics': [
      { id: 'g11m1', question: 'What is the amplitude of the trigonometric wave equation y = 3 sin(2x)?', options: ['Amplitude is 2', 'Amplitude is 3 🌊', 'Amplitude is 6', 'Amplitude is 1'], correctAnswer: 1 }
    ],
    'Coding': [
      { id: 'g11c1', question: 'In web databases, what does the acronym SQL represent?', options: ['Sample Query Logic', 'Structured Query Language 💾', 'Schema Quick Link', 'System Queue Listing'], correctAnswer: 1 }
    ],
    'Phonics': [
      { id: 'g11p1', question: 'What is the primary function of a thesis statement in research literature?', options: ['Provides jokes', 'Summarizes the central claim of the essay 📝', 'Defines vocabulary', 'Lists bibliography links'], correctAnswer: 1 }
    ]
  },
  'Grade 12': {
    'Science': [
      { id: 'g12s1', question: 'Who formulated the General Theory of Relativity in 1915?', options: ['Isaac Newton', 'Marie Curie', 'Albert Einstein 🌌', 'Max Planck'], correctAnswer: 2 }
    ],
    'Mathematics': [
      { id: 'g12m1', question: 'What is the derivative of f(x) = x^3 with respect to x?', options: ['3x', '3x^2 📈', 'x^2', '3'], correctAnswer: 1 }
    ],
    'Coding': [
      { id: 'g12c1', question: 'Which big-O time complexity represents the cost of executing binary searches on a pre-sorted list?', options: ['O(1)', 'O(n log n)', 'O(log n) ⚡', 'O(n^2)'], correctAnswer: 2 }
    ],
    'Phonics': [
      { id: 'g12p1', question: 'Identify the word with correct spelling structure:', options: ['Accommodate 📚', 'Acomodate', 'Accamodate', 'Accomadate'], correctAnswer: 0 }
    ]
  }
};

/**
 * Returns list of questions based on selected Grade and active Subject course.
 */
export function getGradeAppropriateAssessment(grade: string, courseTitle: string): DynamicQuiz {
  // Infer subject from course title
  let subject = 'Science';
  const titleLower = courseTitle.toLowerCase();
  
  if (titleLower.includes('math') || titleLower.includes('sound') || titleLower.includes('count') || titleLower.includes('phonics') || titleLower.includes('rhymes')) {
    subject = titleLower.includes('phonics') || titleLower.includes('sound') ? 'Phonics' : 'Mathematics';
  } else if (titleLower.includes('code') || titleLower.includes('programming') || titleLower.includes('computational') || titleLower.includes('botany') || titleLower.includes('plant')) {
    subject = titleLower.includes('botany') || titleLower.includes('plant') ? 'Science' : 'Coding';
  }

  const selectedGradeClean = ASSESSMENT_DATABASE[grade] ? grade : 'Grade 8';
  const questions = ASSESSMENT_DATABASE[selectedGradeClean][subject] || ASSESSMENT_DATABASE[selectedGradeClean]['Science'];

  return { questions };
}
