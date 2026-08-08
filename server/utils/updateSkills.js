import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Skill from '../models/Skill.js';

// Setup custom DNS resolution (Google/Cloudflare fallback) to bypass ECONNREFUSED issues on local machines
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const newSkills = [
  // Programming Languages
  { name: 'Java', category: 'Programming Languages', emoji: '☕', icon: 'Code', proficiency: 88, experienceYears: 3, order: 1 },
  { name: 'Python', category: 'Programming Languages', emoji: '🐍', icon: 'Code', proficiency: 90, experienceYears: 3, order: 2 },
  { name: 'JavaScript (ES6+)', category: 'Programming Languages', emoji: 'JS', icon: 'Code', proficiency: 92, experienceYears: 3, order: 3 },
  { name: 'SQL', category: 'Programming Languages', emoji: '🗄️', icon: 'Code', proficiency: 85, experienceYears: 3, order: 4 },
  { name: 'HTML5', category: 'Programming Languages', emoji: '🌐', icon: 'Code', proficiency: 95, experienceYears: 4, order: 5 },
  { name: 'CSS3', category: 'Programming Languages', emoji: '🎨', icon: 'Code', proficiency: 92, experienceYears: 4, order: 6 },

  // Frontend Development
  { name: 'React.js', category: 'Frontend Development', emoji: '⚛️', icon: 'Layout', proficiency: 92, experienceYears: 3, order: 7 },
  { name: 'Tailwind CSS', category: 'Frontend Development', emoji: '🎨', icon: 'Layout', proficiency: 95, experienceYears: 2, order: 8 },
  { name: 'Bootstrap', category: 'Frontend Development', emoji: '🅱️', icon: 'Layout', proficiency: 85, experienceYears: 2.5, order: 9 },
  { name: 'Responsive Web Design', category: 'Frontend Development', emoji: '📱', icon: 'Layout', proficiency: 90, experienceYears: 3, order: 10 },
  { name: 'EJS (Embedded JavaScript Templates)', category: 'Frontend Development', emoji: '📑', icon: 'Layout', proficiency: 80, experienceYears: 2, order: 11 },

  // Backend Development
  { name: 'Node.js', category: 'Backend Development', emoji: '🟢', icon: 'Server', proficiency: 88, experienceYears: 2.5, order: 12 },
  { name: 'Express.js', category: 'Backend Development', emoji: 'Ex', icon: 'Server', proficiency: 90, experienceYears: 2.5, order: 13 },
  { name: 'Flask', category: 'Backend Development', emoji: '🌶️', icon: 'Server', proficiency: 80, experienceYears: 1.5, order: 14 },
  { name: 'REST API Development', category: 'Backend Development', emoji: '🔗', icon: 'Server', proficiency: 92, experienceYears: 2.5, order: 15 },
  { name: 'Authentication & Authorization', category: 'Backend Development', emoji: '🔐', icon: 'Server', proficiency: 90, experienceYears: 2.5, order: 16 },
  { name: 'Socket.IO', category: 'Backend Development', emoji: '🔌', icon: 'Server', proficiency: 82, experienceYears: 1.5, order: 17 },

  // Database Technologies
  { name: 'MongoDB', category: 'Database Technologies', emoji: '🍃', icon: 'Database', proficiency: 88, experienceYears: 2.5, order: 18 },
  { name: 'MySQL', category: 'Database Technologies', emoji: '🐬', icon: 'Database', proficiency: 85, experienceYears: 3, order: 19 },
  { name: 'Oracle SQL', category: 'Database Technologies', emoji: '🔴', icon: 'Database', proficiency: 75, experienceYears: 2, order: 20 },
  { name: 'MongoDB Atlas', category: 'Database Technologies', emoji: '☁️', icon: 'Database', proficiency: 88, experienceYears: 2, order: 21 },
  { name: 'Mongoose ORM', category: 'Database Technologies', emoji: '📦', icon: 'Database', proficiency: 90, experienceYears: 2.5, order: 22 },

  // Artificial Intelligence & Machine Learning
  { name: 'Machine Learning Fundamentals', category: 'Artificial Intelligence & Machine Learning', emoji: '🤖', icon: 'Brain', proficiency: 80, experienceYears: 2, order: 23 },
  { name: 'Large Language Models (LLMs)', category: 'Artificial Intelligence & Machine Learning', emoji: '🧠', icon: 'Brain', proficiency: 85, experienceYears: 1.5, order: 24 },
  { name: 'Retrieval-Augmented Generation (RAG)', category: 'Artificial Intelligence & Machine Learning', emoji: '📚', icon: 'Brain', proficiency: 82, experienceYears: 1.5, order: 25 },
  { name: 'LangChain', category: 'Artificial Intelligence & Machine Learning', emoji: '🦜', icon: 'Brain', proficiency: 85, experienceYears: 1.5, order: 26 },
  { name: 'FAISS Vector Database', category: 'Artificial Intelligence & Machine Learning', emoji: '🗂️', icon: 'Brain', proficiency: 78, experienceYears: 1, order: 27 },
  { name: 'Hugging Face Embeddings', category: 'Artificial Intelligence & Machine Learning', emoji: '🤗', icon: 'Brain', proficiency: 80, experienceYears: 1, order: 28 },
  { name: 'Semantic Search', category: 'Artificial Intelligence & Machine Learning', emoji: '🔍', icon: 'Brain', proficiency: 85, experienceYears: 1.5, order: 29 },
  { name: 'AI Chatbot Development', category: 'Artificial Intelligence & Machine Learning', emoji: '💬', icon: 'Brain', proficiency: 88, experienceYears: 2, order: 30 },
  { name: 'Prompt Engineering', category: 'Artificial Intelligence & Machine Learning', emoji: '💡', icon: 'Brain', proficiency: 92, experienceYears: 2, order: 31 },
  { name: 'Gemini API Integration', category: 'Artificial Intelligence & Machine Learning', emoji: '♊', icon: 'Brain', proficiency: 90, experienceYears: 2, order: 32 },
  { name: 'Ollama (Local LLMs)', category: 'Artificial Intelligence & Machine Learning', emoji: '🧠', icon: 'Brain', proficiency: 88, experienceYears: 1.5, order: 33 },
  { name: 'Mistral Models', category: 'Artificial Intelligence & Machine Learning', emoji: '🌪️', icon: 'Brain', proficiency: 80, experienceYears: 1, order: 34 },

  // DevOps & Cloud
  { name: 'Docker', category: 'DevOps & Cloud', emoji: '🐳', icon: 'Cloud', proficiency: 75, experienceYears: 1, order: 35 },
  { name: 'AWS EC2', category: 'DevOps & Cloud', emoji: '☁️', icon: 'Cloud', proficiency: 78, experienceYears: 1.5, order: 36 },
  { name: 'Vercel', category: 'DevOps & Cloud', emoji: '▲', icon: 'Cloud', proficiency: 88, experienceYears: 2, order: 37 },
  { name: 'Render', category: 'DevOps & Cloud', emoji: '☁️', icon: 'Cloud', proficiency: 82, experienceYears: 1.5, order: 38 },
  { name: 'Cloudinary', category: 'DevOps & Cloud', emoji: '☁️', icon: 'Cloud', proficiency: 85, experienceYears: 2, order: 39 },

  // Tools & Platforms
  { name: 'Git', category: 'Tools & Platforms', emoji: '🐙', icon: 'Wrench', proficiency: 85, experienceYears: 3, order: 40 },
  { name: 'GitHub', category: 'Tools & Platforms', emoji: '🐙', icon: 'Wrench', proficiency: 88, experienceYears: 3, order: 41 },
  { name: 'VS Code', category: 'Tools & Platforms', emoji: '💻', icon: 'Wrench', proficiency: 95, experienceYears: 4, order: 42 },
  { name: 'Postman', category: 'Tools & Platforms', emoji: '📮', icon: 'Wrench', proficiency: 90, experienceYears: 2.5, order: 43 },
  { name: 'npm', category: 'Tools & Platforms', emoji: '📦', icon: 'Wrench', proficiency: 88, experienceYears: 3, order: 44 },
  { name: 'MapTiler', category: 'Tools & Platforms', emoji: '🗺️', icon: 'Wrench', proficiency: 75, experienceYears: 1, order: 45 },
  { name: 'Razorpay Integration', category: 'Tools & Platforms', emoji: '💳', icon: 'Wrench', proficiency: 80, experienceYears: 1, order: 46 },

  // Data Visualization
  { name: 'Power BI', category: 'Data Visualization', emoji: '📊', icon: 'BookOpen', proficiency: 78, experienceYears: 1.5, order: 47 },
  { name: 'Tableau', category: 'Data Visualization', emoji: '📊', icon: 'BookOpen', proficiency: 80, experienceYears: 1.5, order: 48 }
];

const updateSkills = async () => {
  try {
    await connectDB();

    console.log('Clearing existing skills from database...');
    const deleteRes = await Skill.deleteMany({});
    console.log(`Deleted ${deleteRes.deletedCount} skills.`);

    // Drop unique index if it exists
    try {
      await Skill.collection.dropIndex('name_1');
      console.log('Dropped name_1 index successfully.');
    } catch (indexErr) {
      console.log('Index name_1 did not exist or was already dropped.');
    }

    console.log('Inserting new skills list...');
    const insertedSkills = await Skill.insertMany(
      newSkills.map(s => ({
        ...s,
        status: 'published',
        experienceYears: s.experienceYears || 2,
        level: s.proficiency >= 90 ? 'Expert' : s.proficiency >= 80 ? 'Advanced' : 'Intermediate'
      }))
    );
    console.log(`Successfully seeded ${insertedSkills.length} new skills!`);

    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to update skills in database:', error);
    process.exit(1);
  }
};

updateSkills();
