// Quiz, Trivia & Locations Controller
// Static data — no MongoDB dependency required

const quizQuestions = [
  {
    id: 1,
    question: "Who led the famous Dandi March in 1930?",
    options: ["Jawaharlal Nehru", "Mahatma Gandhi", "Subhash Chandra Bose", "Sardar Patel"],
    correct: 1,
    difficulty: "easy",
    explanation: "Mahatma Gandhi led the Salt March (Dandi March) on March 12, 1930, to protest the British salt tax."
  },
  {
    id: 2,
    question: "Which freedom fighter gave the slogan 'Jai Hind'?",
    options: ["Bhagat Singh", "Chandrashekhar Azad", "Subhash Chandra Bose", "Lala Lajpat Rai"],
    correct: 2,
    difficulty: "easy",
    explanation: "Subhash Chandra Bose popularized the greeting 'Jai Hind' which became the battle cry of the Indian National Army."
  },
  {
    id: 3,
    question: "Who was the first woman to lead the Indian National Congress?",
    options: ["Sarojini Naidu", "Annie Besant", "Aruna Asaf Ali", "Kasturba Gandhi"],
    correct: 1,
    difficulty: "medium",
    explanation: "Annie Besant was the first woman president of the Indian National Congress in 1917."
  },
  {
    id: 4,
    question: "In which year did the Jallianwala Bagh massacre take place?",
    options: ["1917", "1919", "1921", "1930"],
    correct: 1,
    difficulty: "easy",
    explanation: "The Jallianwala Bagh massacre took place on April 13, 1919, in Amritsar, Punjab."
  },
  {
    id: 5,
    question: "Who threw a bomb in the Central Legislative Assembly in 1929?",
    options: ["Chandrashekhar Azad", "Bhagat Singh", "Udham Singh", "Ram Prasad Bismil"],
    correct: 1,
    difficulty: "medium",
    explanation: "Bhagat Singh and Batukeshwar Dutt threw bombs in the Central Legislative Assembly on April 8, 1929."
  },
  {
    id: 6,
    question: "Which leader is known as the 'Iron Man of India'?",
    options: ["Jawaharlal Nehru", "Bhagat Singh", "Sardar Vallabhbhai Patel", "B.R. Ambedkar"],
    correct: 2,
    difficulty: "easy",
    explanation: "Sardar Vallabhbhai Patel united 562 princely states into the Indian Union, earning him the title 'Iron Man of India'."
  },
  {
    id: 7,
    question: "Who founded the Indian National Army (INA)?",
    options: ["Mahatma Gandhi", "Subhash Chandra Bose", "Rash Behari Bose", "Mohan Singh"],
    correct: 2,
    difficulty: "medium",
    explanation: "While Mohan Singh initially formed the INA, Subhash Chandra Bose reorganized and led it to prominence."
  },
  {
    id: 8,
    question: "The Rani of Jhansi fought against which power?",
    options: ["Mughal Empire", "French East India Company", "British East India Company", "Portuguese"],
    correct: 2,
    difficulty: "easy",
    explanation: "Rani Lakshmibai of Jhansi fought against the British East India Company during the Indian Rebellion of 1857."
  },
  {
    id: 9,
    question: "Who wrote 'Hind Swaraj'?",
    options: ["Rabindranath Tagore", "B.R. Ambedkar", "Mahatma Gandhi", "Bal Gangadhar Tilak"],
    correct: 2,
    difficulty: "medium",
    explanation: "Mahatma Gandhi wrote 'Hind Swaraj' (Indian Home Rule) in 1909 while travelling from London to South Africa."
  },
  {
    id: 10,
    question: "Which movement did Gandhi launch in 1942?",
    options: ["Non-Cooperation", "Civil Disobedience", "Quit India", "Swadeshi"],
    correct: 2,
    difficulty: "easy",
    explanation: "The Quit India Movement was launched on August 8, 1942, demanding an end to British Rule in India."
  },
  {
    id: 11,
    question: "Who was known as 'Shaheed-e-Azam' (The Great Martyr)?",
    options: ["Udham Singh", "Bhagat Singh", "Ashfaqulla Khan", "Sukhdev"],
    correct: 1,
    difficulty: "medium",
    explanation: "Bhagat Singh is popularly known as Shaheed-e-Azam for his supreme sacrifice at the age of 23."
  },
  {
    id: 12,
    question: "Which leader gave the slogan 'Swaraj is my birthright'?",
    options: ["Mahatma Gandhi", "Gopal Krishna Gokhale", "Bal Gangadhar Tilak", "Dadabhai Naoroji"],
    correct: 2,
    difficulty: "easy",
    explanation: "Bal Gangadhar Tilak declared 'Swaraj is my birthright and I shall have it!' in 1916."
  },
  {
    id: 13,
    question: "Who avenged the Jallianwala Bagh massacre by assassinating General Dyer?",
    options: ["Bhagat Singh", "Udham Singh", "Chandrashekhar Azad", "Ram Prasad Bismil"],
    correct: 1,
    difficulty: "hard",
    explanation: "Udham Singh assassinated Michael O'Dwyer (who approved Dyer's actions) in London on March 13, 1940."
  },
  {
    id: 14,
    question: "Who was the first President of the Indian National Congress?",
    options: ["Dadabhai Naoroji", "W.C. Bonnerjee", "Allan Octavian Hume", "Surendranath Banerjee"],
    correct: 1,
    difficulty: "hard",
    explanation: "Womesh Chunder Bonnerjee (W.C. Bonnerjee) was the first president of the Indian National Congress in 1885."
  },
  {
    id: 15,
    question: "Which revolutionary is associated with the Kakori Train Robbery (1925)?",
    options: ["Bhagat Singh", "Ram Prasad Bismil", "Chandrashekhar Azad", "Khudiram Bose"],
    correct: 1,
    difficulty: "hard",
    explanation: "Ram Prasad Bismil masterminded the Kakori conspiracy to fund revolutionary activities."
  },
  {
    id: 16,
    question: "Who composed 'Vande Mataram'?",
    options: ["Rabindranath Tagore", "Bankim Chandra Chattopadhyay", "Muhammad Iqbal", "Sarojini Naidu"],
    correct: 1,
    difficulty: "medium",
    explanation: "Bankim Chandra Chattopadhyay composed 'Vande Mataram' as part of his novel Anandamath (1882)."
  },
  {
    id: 17,
    question: "The 'Doctrine of Lapse' led to which major revolt?",
    options: ["Sepoy Mutiny of 1857", "Quit India 1942", "Champaran Satyagraha", "Bardoli Satyagraha"],
    correct: 0,
    difficulty: "hard",
    explanation: "The Doctrine of Lapse by Lord Dalhousie annexed several princely states, which was a major cause of the 1857 revolt."
  },
  {
    id: 18,
    question: "Who was the youngest martyr of the Indian independence movement?",
    options: ["Bhagat Singh", "Khudiram Bose", "Sukhdev", "Rajguru"],
    correct: 1,
    difficulty: "hard",
    explanation: "Khudiram Bose was hanged at the age of 18 years and 8 months, making him one of the youngest revolutionaries."
  }
];

const triviaFacts = [
  {
    id: 1,
    fact: "Mahatma Gandhi was nominated for the Nobel Peace Prize five times but never received it.",
    category: "Gandhi",
    icon: "🕊️"
  },
  {
    id: 2,
    fact: "The Indian flag was first hoisted on August 7, 1906, at Parsee Bagan Square in Calcutta.",
    category: "Flag",
    icon: "🇮🇳"
  },
  {
    id: 3,
    fact: "Subhash Chandra Bose escaped British surveillance by disguising himself as a Pathan and fleeing to Germany in 1941.",
    category: "Bose",
    icon: "🎭"
  },
  {
    id: 4,
    fact: "Bhagat Singh reportedly read over 300 books during his time in prison before his execution at age 23.",
    category: "Bhagat Singh",
    icon: "📚"
  },
  {
    id: 5,
    fact: "The Jallianwala Bagh still bears bullet marks on its walls — over 1,650 rounds were fired in just 10 minutes.",
    category: "History",
    icon: "🏛️"
  },
  {
    id: 6,
    fact: "India's first war of independence in 1857 started with a rumor about cartridges greased with animal fat.",
    category: "1857 Revolt",
    icon: "⚔️"
  },
  {
    id: 7,
    fact: "Rani Lakshmibai tied her son to her back and fought on horseback during the battle of Jhansi.",
    category: "Rani Lakshmibai",
    icon: "🐴"
  },
  {
    id: 8,
    fact: "The Salt March covered 240 miles over 24 days from Sabarmati Ashram to Dandi on the Gujarat coast.",
    category: "Salt March",
    icon: "🧂"
  },
  {
    id: 9,
    fact: "Sardar Patel unified 562 princely states into the Indian Union — a feat unparalleled in world history.",
    category: "Patel",
    icon: "🏗️"
  },
  {
    id: 10,
    fact: "Rabindranath Tagore returned his knighthood in 1919 as a protest against the Jallianwala Bagh massacre.",
    category: "Tagore",
    icon: "✍️"
  },
  {
    id: 11,
    fact: "The Indian National Congress was founded in 1885 by a retired British civil servant, Allan Octavian Hume.",
    category: "INC",
    icon: "🏛️"
  },
  {
    id: 12,
    fact: "Chandrashekhar Azad vowed never to be captured alive and shot himself to keep his pledge at Alfred Park, Allahabad.",
    category: "Azad",
    icon: "🔥"
  }
];

const fighterLocations = [
  {
    id: 1,
    name: "Mahatma Gandhi",
    lat: 21.7679,
    lng: 72.1519,
    place: "Porbandar, Gujarat",
    born: 1869,
    died: 1948,
    significance: "Birthplace of Mahatma Gandhi, father of the nation",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg",
    type: "birthplace"
  },
  {
    id: 2,
    name: "Subhash Chandra Bose",
    lat: 20.4625,
    lng: 85.8830,
    place: "Cuttack, Odisha",
    born: 1897,
    died: 1945,
    significance: "Birthplace of Netaji, founder of Indian National Army",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/44/Subhas_Chandra_Bose_NRB.jpg",
    type: "birthplace"
  },
  {
    id: 3,
    name: "Bhagat Singh",
    lat: 30.9943,
    lng: 72.3338,
    place: "Banga, Punjab (now Pakistan)",
    born: 1907,
    died: 1931,
    significance: "Birthplace of the legendary revolutionary martyr",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/90/Bhagat_Singh_1929.jpg",
    type: "birthplace"
  },
  {
    id: 4,
    name: "Rani Lakshmibai",
    lat: 25.4358,
    lng: 78.5685,
    place: "Jhansi, Uttar Pradesh",
    born: 1828,
    died: 1858,
    significance: "Fort of Jhansi — the site of Rani Lakshmibai's legendary resistance",
    type: "event"
  },
  {
    id: 5,
    name: "Jallianwala Bagh",
    lat: 31.6209,
    lng: 74.8800,
    place: "Amritsar, Punjab",
    born: null,
    died: null,
    significance: "Site of the 1919 massacre where General Dyer opened fire on unarmed civilians",
    type: "event"
  },
  {
    id: 6,
    name: "Sardar Vallabhbhai Patel",
    lat: 22.2940,
    lng: 73.1942,
    place: "Nadiad, Gujarat",
    born: 1875,
    died: 1950,
    significance: "Birthplace of the Iron Man of India, unifier of princely states",
    type: "birthplace"
  },
  {
    id: 7,
    name: "Dandi March Endpoint",
    lat: 20.9190,
    lng: 72.7838,
    place: "Dandi, Gujarat",
    born: null,
    died: null,
    significance: "Where Gandhi broke the salt law on April 6, 1930, sparking nationwide civil disobedience",
    type: "event"
  },
  {
    id: 8,
    name: "Chandrashekhar Azad",
    lat: 25.4484,
    lng: 81.8381,
    place: "Alfred Park, Allahabad",
    born: 1906,
    died: 1931,
    significance: "The park where Azad made his last stand, refusing to be captured alive",
    type: "event"
  },
  {
    id: 9,
    name: "Bal Gangadhar Tilak",
    lat: 17.6805,
    lng: 73.5178,
    place: "Ratnagiri, Maharashtra",
    born: 1856,
    died: 1920,
    significance: "Birthplace of the 'Father of Indian Unrest' who proclaimed Swaraj as birthright",
    type: "birthplace"
  },
  {
    id: 10,
    name: "Kakori Train Robbery",
    lat: 26.8700,
    lng: 80.8600,
    place: "Kakori, Uttar Pradesh",
    born: null,
    died: null,
    significance: "Site of the 1925 train robbery by revolutionaries to fund the independence movement",
    type: "event"
  },
  {
    id: 11,
    name: "B.R. Ambedkar",
    lat: 18.5965,
    lng: 73.7560,
    place: "Mhow (now Dr. Ambedkar Nagar), Madhya Pradesh",
    born: 1891,
    died: 1956,
    significance: "Birthplace of the architect of the Indian Constitution and champion of social justice",
    type: "birthplace"
  },
  {
    id: 12,
    name: "Sabarmati Ashram",
    lat: 23.0607,
    lng: 72.5801,
    place: "Ahmedabad, Gujarat",
    born: null,
    died: null,
    significance: "Gandhi's residence and the starting point of the historic Dandi March",
    type: "event"
  }
];

// Shuffle utility
function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// GET /api/quiz/questions — returns 10 random quiz questions
exports.getQuiz = (req, res) => {
  try {
    const count = Math.min(parseInt(req.query.count) || 10, quizQuestions.length);
    const shuffled = shuffleArray(quizQuestions).slice(0, count);
    res.json({
      success: true,
      count: shuffled.length,
      questions: shuffled
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/quiz/trivia — returns random trivia facts
exports.getTrivia = (req, res) => {
  try {
    const count = Math.min(parseInt(req.query.count) || 5, triviaFacts.length);
    const shuffled = shuffleArray(triviaFacts).slice(0, count);
    res.json({
      success: true,
      count: shuffled.length,
      facts: shuffled
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/quiz/locations — returns all fighter locations
exports.getLocations = (req, res) => {
  try {
    const typeFilter = req.query.type; // 'birthplace' or 'event'
    let results = fighterLocations;
    if (typeFilter) {
      results = fighterLocations.filter(loc => loc.type === typeFilter);
    }
    res.json({
      success: true,
      count: results.length,
      locations: results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
