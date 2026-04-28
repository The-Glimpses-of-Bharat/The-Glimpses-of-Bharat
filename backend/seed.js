const mongoose = require("mongoose");
const dotenv = require("dotenv");
const https = require("https");
const User = require("./models/User");
const Fighter = require("./models/Fighter");

dotenv.config();

/**
 * Fetch image thumbnail from Wikipedia REST API (more reliable than query API)
 * @param {string} pageTitle - The Wikipedia page title (URL-friendly)
 * @returns {Promise<string>} - The thumbnail image URL or empty string
 */
function fetchWikipediaImage(pageTitle) {
  return new Promise((resolve) => {
    // Using the REST API which is more robust for thumbnails
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;

    https.get(apiUrl, {
      headers: { 
        "User-Agent": "GlimpsesOfBharat/2.0 (educational project; contact: admin@bharat.com)" 
      }
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          // The REST API returns a thumbnail object directly
          resolve(json.thumbnail?.source || json.originalimage?.source || "");
        } catch (e) {
          console.error(`Error parsing JSON for ${pageTitle}:`, e.message);
          resolve("");
        }
      });
    }).on("error", (e) => {
      console.error(`Network error for ${pageTitle}:`, e.message);
      resolve("");
    });
  });
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const fightersData = [
  {
    name: "Mahatma Gandhi",
    wikiTitle: "Mahatma_Gandhi",
    description: "Mohandas Karamchand Gandhi, known as the 'Father of the Nation', was the preeminent leader of the Indian independence movement. He pioneered 'Satyagraha'—resistance to tyranny through mass nonviolent civil disobedience.",
    birthYear: 1869,
    deathYear: 1948,
    contributions: "Led Dandi March, Quit India Movement, Non-Cooperation Movement. Advocated Ahimsa (non-violence) and Truth.",
    status: "approved"
  },
  {
    name: "Subhas Chandra Bose",
    wikiTitle: "Subhas_Chandra_Bose",
    description: "Known as 'Netaji', he was a fierce nationalist who founded the Indian National Army (INA) to secure independence from British rule through armed struggle.",
    birthYear: 1897,
    deathYear: 1945,
    contributions: "Formed the Azad Hind Fauj, gave the slogan 'Jai Hind', and sought international support for India's freedom.",
    status: "approved"
  },
  {
    name: "Bhagat Singh",
    wikiTitle: "Bhagat_Singh",
    description: "A charismatic Indian socialist revolutionary whose two acts of dramatic violence against the British and execution at age 23 made him a folk hero of the Indian independence movement.",
    birthYear: 1907,
    deathYear: 1931,
    contributions: "Member of HSRA, Central Legislative Assembly bombing (1929), Lahore Conspiracy Case.",
    status: "approved"
  },
  {
    name: "Rani Lakshmibai",
    wikiTitle: "Rani_Lakshmibai",
    description: "The Queen of Jhansi and a leading figure in the Indian Rebellion of 1857. She is an iconic symbol of resistance to British rule in India.",
    birthYear: 1828,
    deathYear: 1858,
    contributions: "Led her troops in the Siege of Jhansi and the battle for Gwalior. Fought valiantly against General Rose.",
    status: "approved"
  },
  {
    name: "Jawaharlal Nehru",
    wikiTitle: "Jawaharlal_Nehru",
    description: "The first Prime Minister of India and a central figure in Indian politics. A close associate of Gandhi, he was a leader of the socialist wing of the Indian National Congress.",
    birthYear: 1889,
    deathYear: 1964,
    contributions: "Author of 'The Discovery of India', led the non-aligned movement, and laid the foundations of modern India.",
    status: "approved"
  },
  {
    name: "Sardar Vallabhbhai Patel",
    wikiTitle: "Vallabhbhai_Patel",
    description: "The 'Iron Man of India', he was a statesman who played a leading role in the country's struggle for independence and guided its integration into a united, independent nation.",
    birthYear: 1875,
    deathYear: 1950,
    contributions: "Unified 562 princely states, led the Bardoli Satyagraha, served as the first Deputy PM and Home Minister.",
    status: "approved"
  },
  {
    name: "Bal Gangadhar Tilak",
    wikiTitle: "Bal_Gangadhar_Tilak",
    description: "The 'Father of the Indian Unrest', Tilak was the first leader of the Indian Independence Movement and a strong advocate for Swaraj (Self-Rule).",
    birthYear: 1856,
    deathYear: 1920,
    contributions: "Started the slogan 'Swaraj is my birthright and I shall have it', popularized Ganesh Chaturthi to unite people.",
    status: "approved"
  },
  {
    name: "Lala Lajpat Rai",
    wikiTitle: "Lala_Lajpat_Rai",
    description: "Known as 'Punjab Kesari', he was a prominent nationalist leader and a member of the Lal-Bal-Pal trio. He founded the Punjab National Bank.",
    birthYear: 1865,
    deathYear: 1928,
    contributions: "Led the protest against the Simon Commission, where he suffered fatal injuries from a police lathi charge.",
    status: "approved"
  },
  {
    name: "Chandrashekhar Azad",
    wikiTitle: "Chandra_Shekhar_Azad",
    description: "A revolutionary who reorganized the Hindustan Republican Association (HRA) into the HSRA. He vowed never to be caught alive by the British.",
    birthYear: 1906,
    deathYear: 1931,
    contributions: "Mentored Bhagat Singh, led the Kakori Train Robbery, and fought his last battle at Alfred Park.",
    status: "approved"
  },
  {
    name: "Sarojini Naidu",
    wikiTitle: "Sarojini_Naidu",
    description: "The 'Nightingale of India', she was a poet and political activist. She was the first Indian woman to be president of the Indian National Congress.",
    birthYear: 1879,
    deathYear: 1949,
    contributions: "Participated in the Salt Satyagraha, served as the first woman Governor of Uttar Pradesh.",
    status: "approved"
  },
  {
    name: "Dr. B.R. Ambedkar",
    wikiTitle: "B._R._Ambedkar",
    description: "Principal architect of the Constitution of India and a social reformer who inspired the Dalit Buddhist movement and campaigned against social discrimination.",
    birthYear: 1891,
    deathYear: 1956,
    contributions: "Chaired the Constitution Drafting Committee, fought for the rights of Dalits and women.",
    status: "approved"
  },
  {
    name: "Mangal Pandey",
    wikiTitle: "Mangal_Pandey",
    description: "A sepoy in the 34th Bengal Native Infantry who is widely seen as the spark that ignited the Indian Rebellion of 1857.",
    birthYear: 1827,
    deathYear: 1857,
    contributions: "Openly rebelled against the use of greased cartridges, leading to a nationwide uprising.",
    status: "approved"
  },
  {
    name: "Sukhdev Thapar",
    wikiTitle: "Sukhdev_Thapar",
    description: "A senior member of the HSRA and a close friend of Bhagat Singh. He was a master strategist and organizer.",
    birthYear: 1907,
    deathYear: 1931,
    contributions: "Executed alongside Bhagat Singh and Rajguru for his role in the Lahore Conspiracy Case.",
    status: "approved"
  },
  {
    name: "Shivaram Rajguru",
    wikiTitle: "Shivaram_Rajguru",
    description: "A revolutionary from Maharashtra who was an active member of the HSRA and a skilled marksman.",
    birthYear: 1908,
    deathYear: 1931,
    contributions: "Assassinated J.P. Saunders to avenge Lala Lajpat Rai's death. Hanged with Bhagat Singh and Sukhdev.",
    status: "approved"
  },
  {
    name: "Maulana Abul Kalam Azad",
    wikiTitle: "Abul_Kalam_Azad",
    description: "A senior leader of the Indian National Congress and the first Minister of Education in the Indian government.",
    birthYear: 1888,
    deathYear: 1958,
    contributions: "Staunch advocate of Hindu-Muslim unity, opposed Partition, and established the IITs and UGC.",
    status: "approved"
  },
  {
    name: "Khudiram Bose",
    wikiTitle: "Khudiram_Bose",
    description: "One of the youngest revolutionaries of the Indian independence movement, he was executed at the age of 18.",
    birthYear: 1889,
    deathYear: 1908,
    contributions: "Attempted to assassinate British Judge Douglas Kingsford in Muzaffarpur.",
    status: "approved"
  },
  {
    name: "Ram Prasad Bismil",
    wikiTitle: "Ram_Prasad_Bismil",
    description: "A revolutionary poet and leader of the HRA. He wrote the famous patriotic poem 'Sarfaroshi Ki Tamanna'.",
    birthYear: 1897,
    deathYear: 1927,
    contributions: "Lead the Kakori Train Robbery and was executed by the British in Gorakhpur Jail.",
    status: "approved"
  },
  {
    name: "Ashfaqulla Khan",
    wikiTitle: "Ashfaqulla_Khan",
    description: "A revolutionary freedom fighter and co-founder of the HSRA. He was the first Muslim to be hanged for a conspiracy against the British.",
    birthYear: 1900,
    deathYear: 1927,
    contributions: "Key figure in the Kakori Train Robbery, symbol of communal harmony in the freedom struggle.",
    status: "approved"
  },
  {
    name: "Udham Singh",
    wikiTitle: "Udham_Singh",
    description: "A revolutionary who assassinated Michael O'Dwyer in London to avenge the Jallianwala Bagh massacre.",
    birthYear: 1899,
    deathYear: 1940,
    contributions: "Dedicated his life to avenging the 1919 massacre, trial and execution in London became a national symbol.",
    status: "approved"
  },
  {
    name: "Birsa Munda",
    wikiTitle: "Birsa_Munda",
    description: "A tribal freedom fighter, religious leader, and folk hero who belonged to the Munda tribe. He led a tribal religious millenarian movement.",
    birthYear: 1875,
    deathYear: 1900,
    contributions: "Led the 'Ulgulan' (Great Tumult) rebellion against British land policies and missionaries.",
    status: "approved"
  },
  {
    name: "Aruna Asaf Ali",
    wikiTitle: "Aruna_Asaf_Ali",
    description: "Known as the 'Grand Old Lady' of the Independence Movement. She is famous for hoisting the Indian National flag at the Gowalia Tank maidan in Bombay.",
    birthYear: 1909,
    deathYear: 1996,
    contributions: "Hoisted the flag during the Quit India Movement (1942) when major leaders were arrested.",
    status: "approved"
  },
  {
    name: "Matangini Hazra",
    wikiTitle: "Matangini_Hazra",
    description: "A revolutionary who participated in the Indian independence movement until she was shot dead by the British Indian police.",
    birthYear: 1870,
    deathYear: 1942,
    contributions: "Led a procession of 6,000 supporters, mostly women, to take over the Tamluk police station. Kept hoisting the flag while being shot.",
    status: "approved"
  },
  {
    name: "Pritilata Waddedar",
    wikiTitle: "Pritilata_Waddedar",
    description: "A Bengali revolutionary nationalist who was influential in the Indian independence movement in Chittagong.",
    birthYear: 1911,
    deathYear: 1932,
    contributions: "Led a team of revolutionaries to attack the Pahartali European Club, which had a sign 'Dogs and Indians not allowed'.",
    status: "approved"
  },
  {
    name: "Senapati Bapat",
    wikiTitle: "Senapati_Bapat",
    description: "A figure in the Indian independence movement and a leader of the Mulshi Satyagraha.",
    birthYear: 1880,
    deathYear: 1967,
    contributions: "Acquired the title 'Senapati' for his leadership during the Satyagraha. He also hoisted the flag after independence.",
    status: "approved"
  },
  {
    name: "Potti Sreeramulu",
    wikiTitle: "Potti_Sreeramulu",
    description: "A revolutionary who died after fasting for 56 days in support of a separate state for Telugu-speaking people.",
    birthYear: 1901,
    deathYear: 1952,
    contributions: "Participated in the Salt Satyagraha and the Quit India Movement. His fast led to the creation of Andhra State.",
    status: "approved"
  },
  {
    name: "Tanguturi Prakasam",
    wikiTitle: "Tanguturi_Prakasam",
    description: "Known as 'Andhra Kesari', he was an Indian politician and freedom fighter, and the first chief minister of Andhra State.",
    birthYear: 1872,
    deathYear: 1957,
    contributions: "Famously bared his chest to British bullets during the Simon Commission protests in Madras.",
    status: "approved"
  },
  {
    name: "Alluri Sitarama Raju",
    wikiTitle: "Alluri_Sitarama_Raju",
    description: "A revolutionary who led the Rampa Rebellion of 1922, during which a band of tribal people and other sympathizers fought against the British Raj.",
    birthYear: 1897,
    deathYear: 1924,
    contributions: "Used guerrilla warfare techniques against the British in the Godavari district.",
    status: "approved"
  },
  {
    name: "V. O. Chidambaram Pillai",
    wikiTitle: "V._O._Chidambaram_Pillai",
    description: "Known as 'Kappalottiya Tamilan', he was a disciple of Bal Gangadhar Tilak and a pioneer of the Swadeshi movement in South India.",
    birthYear: 1872,
    deathYear: 1936,
    contributions: "Launched the first indigenous Indian shipping service between Tuticorin and Colombo to compete against British ships.",
    status: "approved"
  },
  {
    name: "Subramania Bharati",
    wikiTitle: "Subramania_Bharati",
    description: "A writer, poet, journalist, Indian independence activist, social reformer and polyglot. He was a pioneer of modern Tamil poetry.",
    birthYear: 1882,
    deathYear: 1921,
    contributions: "His patriotic songs and writings ignited the fire of freedom in South India.",
    status: "approved"
  },
  {
    name: "Tiruppur Kumaran",
    wikiTitle: "Tiruppur_Kumaran",
    description: "An Indian revolutionary who participated in the Indian independence movement. He founded the Desa Bandhu Youth Association.",
    birthYear: 1904,
    deathYear: 1932,
    contributions: "Died from injuries sustained during a police lathi charge while holding the flag of the Indian Nationalists, which was banned.",
    status: "approved"
  },
  {
    name: "Velu Nachiyar",
    wikiTitle: "Velu_Nachiyar",
    description: "The queen of Sivaganga estate from 1780 to 1790. She was the first Indian queen to wage war with the East India Company.",
    birthYear: 1730,
    deathYear: 1796,
    contributions: "Defeated the British with the help of Hyder Ali and her army. Credited with creating the first human bomb.",
    status: "approved"
  },
  {
    name: "Uyyalawada Narasimha Reddy",
    wikiTitle: "Uyyalawada_Narasimha_Reddy",
    description: "A polygar (feudal lord) who led a rebellion against the British East India Company in the Kurnool district of Andhra Pradesh.",
    birthYear: 1806,
    deathYear: 1847,
    contributions: "Attacked the British treasury and treasury officials in 1846, leading thousands in a revolt.",
    status: "approved"
  },
  {
    name: "Lakshmi Sahgal",
    wikiTitle: "Lakshmi_Sahgal",
    description: "A revolutionary of the Indian independence movement, an officer of the Indian National Army, and the Minister of Women's Affairs in the Azad Hind government.",
    birthYear: 1914,
    deathYear: 2012,
    contributions: "Led the Rani of Jhansi Regiment, one of the few all-female combat regiments of the Second World War.",
    status: "approved"
  },
  {
    name: "Begum Hazrat Mahal",
    wikiTitle: "Begum_Hazrat_Mahal",
    description: "The wife of Nawab Wajid Ali Shah of Awadh. She rebelled against the British East India Company during the Indian Rebellion of 1857.",
    birthYear: 1820,
    deathYear: 1879,
    contributions: "Took charge of the affairs in Lucknow after the Nawab was exiled, leading the rebellion in Awadh.",
    status: "approved"
  },
  {
    name: "Kittur Chennamma",
    wikiTitle: "Kittur_Chennamma",
    description: "The Rani of Kittur, a princely state in Karnataka. She led an armed rebellion against the British East India Company in 1824.",
    birthYear: 1778,
    deathYear: 1829,
    contributions: "Fought to maintain the independence of her kingdom against the Doctrine of Lapse.",
    status: "approved"
  },
  {
    name: "Tantia Tope",
    wikiTitle: "Tatya_Tope",
    description: "A general in the Indian Rebellion of 1857 and one of its notable leaders. He was a close associate of Nana Sahib.",
    birthYear: 1814,
    deathYear: 1859,
    contributions: "Fought several battles against the British, including at Kanpur and Gwalior, using guerrilla tactics.",
    status: "approved"
  },
  {
    name: "Gopal Krishna Gokhale",
    wikiTitle: "Gopal_Krishna_Gokhale",
    description: "A senior leader of the Indian National Congress and a social reformer who founded the Servants of India Society.",
    birthYear: 1866,
    deathYear: 1915,
    contributions: "Political mentor to Mahatma Gandhi and a voice for moderate nationalism and constitutional reform.",
    status: "approved"
  },
  {
    name: "Bipin Chandra Pal",
    wikiTitle: "Bipin_Chandra_Pal",
    description: "One of the main architects of the Swadeshi movement and a member of the Lal-Bal-Pal trio. He was a great orator and writer.",
    birthYear: 1858,
    deathYear: 1932,
    contributions: "Advocated for the use of Swadeshi goods and the boycott of British goods.",
    status: "approved"
  },
  {
    name: "Senapati Bapat", // Duplicate in my list above, let's replace with another
    wikiTitle: "Senapati_Bapat",
    description: "Pandurang Mahadev Bapat, popularly known as Senapati Bapat, was a figure in the Indian independence movement.",
    birthYear: 1880,
    deathYear: 1967,
    contributions: "Leader of the Mulshi Satyagraha and a master of both non-violent and revolutionary tactics.",
    status: "approved"
  },
  {
    name: "Vinayak Damodar Savarkar",
    wikiTitle: "Vinayak_Damodar_Savarkar",
    description: "A politician, activist, and writer who developed the Hindu nationalist ideology of Hindutva. He was a leading figure in the Hindu Mahasabha.",
    birthYear: 1883,
    deathYear: 1966,
    contributions: "Authored 'The Indian War of Independence', founded the Abhinav Bharat Society.",
    status: "approved"
  }
];

const seed = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // 1. Create Admin User
    const adminExists = await User.findOne({ email: "admin@bharat.com" });
    if (!adminExists) {
      await User.create({
        name: "Super Admin",
        email: "admin@bharat.com",
        password: "password123",
        role: "admin"
      });
      console.log("Admin user created: admin@bharat.com / password123");
    } else {
      console.log("Admin user already exists.");
    }

    // 2. Fetch images from Wikipedia REST API and create fighters
    console.log("\nFetching images from Wikipedia REST API for 40 fighters...");
    const sampleFighters = [];

    // Process in batches or one by one with delay to respect API
    for (let i = 0; i < fightersData.length; i++) {
      const fighter = fightersData[i];
      const { wikiTitle, ...fighterFields } = fighter;
      
      process.stdout.write(`[${i + 1}/40] Fetching ${fighter.name}... `);
      
      const image = await fetchWikipediaImage(wikiTitle);
      sampleFighters.push({ ...fighterFields, image });
      
      if (image) {
        console.log("✓ Found image");
      } else {
        console.log("✗ No image found");
      }
      
      // Small delay to be nice to Wikipedia
      await delay(200);
    }

    console.log("\nCleaning existing fighters...");
    await Fighter.deleteMany({});
    
    console.log("Inserting new fighter data...");
    await Fighter.insertMany(sampleFighters);
    
    console.log(`\nSuccessfully added ${sampleFighters.length} freedom fighters to the database.`);
    console.log("All image URLs are now dynamically fetched from Wikipedia REST API to ensure visibility.");

    console.log("\nSeeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\nSeeding error:", error);
    process.exit(1);
  }
};

seed();
