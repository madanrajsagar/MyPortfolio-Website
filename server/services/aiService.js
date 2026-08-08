import Groq from 'groq-sdk';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Achievement from '../models/Achievement.js';
import Setting from '../models/Setting.js';

// Setup Groq API client
const hasGroqKey = process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key';
let groq = null;
if (hasGroqKey) {
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
} else {
  console.warn('GROQ_API_KEY missing. AI Chatbot running in MOCK mode.');
}

/**
 * Fetch all details from Database and compile a comprehensive profile text.
 */
export const getSystemContext = async () => {
  try {
    const [projects, skills, experiences, educations, achievements, settings] = await Promise.all([
      Project.find({}),
      Skill.find({}),
      Experience.find({}),
      Education.find({}),
      Achievement.find({}),
      Setting.findOne({}),
    ]);

    const socialLinks = settings?.socialLinks || {};

    let context = `
You are the personal AI Assistant for Madanraj. Your job is to answer questions from recruiters and visitors about Madanraj's profile, career, qualifications, and engineering projects.
You should be highly professional, polite, impressive, and direct. Keep your answers brief (under 150 words) unless detailed technical specifications are asked.

Here is the verified data about Madanraj:
Name: Madanraj
Roles: AI & ML Engineer, Full Stack MERN Developer, Competitive Programmer, Hackathon Winner, Public Speaker, GDG Leader.
Career Goals: Target Top Tech Firms (Google, Amazon) and build state-of-the-art AI-MERN products.
Social Profiles:
- GitHub: ${socialLinks.github || 'https://github.com'}
- LinkedIn: ${socialLinks.linkedin || 'https://linkedin.com'}
- LeetCode: ${socialLinks.leetcode || 'https://leetcode.com'}
- CodeChef: ${socialLinks.codechef || 'https://codechef.com'}
- GeeksforGeeks: ${socialLinks.gfg || 'https://geeksforgeeks.org'}
- Email: ${socialLinks.email || 'your_email@gmail.com'}
`;

    // Add Skills
    if (skills.length > 0) {
      context += `\nTechnical Skills:\n`;
      skills.forEach(s => {
        context += `- ${s.name} (${s.category}): Proficiency ${s.proficiency}%, Experience ${s.experienceYears} yrs. Used in projects: ${s.projectsUsedIn.join(', ') || 'N/A'}\n`;
      });
    } else {
      context += `\nTechnical Skills (Default): React, Node, Express, MongoDB, Python, Java, JavaScript, TypeScript, Machine Learning, LLMs, LangChain, Ollama, Tailwind CSS, AWS, Docker.\n`;
    }

    // Add Projects
    if (projects.length > 0) {
      context += `\nEngineering Projects:\n`;
      projects.forEach(p => {
        context += `- Name: ${p.title}\n  Summary: ${p.description}\n  Tech Stack: ${p.techStack.join(', ')}\n  Key Features: ${p.features.join(', ')}\n  Challenges: ${p.challenges || 'N/A'}\n  Learnings: ${p.learnings || 'N/A'}\n  Links: GitHub: ${p.githubLink || 'N/A'}, Live Demo: ${p.liveDemo || 'N/A'}\n`;
      });
    } else {
      context += `\nNotable Projects (Default):
- TravelNest: A premium MERN stack travel booking and exploration site.
- MSBTE Navigator: Study resource platform for MSBTE diploma students.
- Village Knowledge Chatbot: Localized AI query system for rural empowerment.\n`;
    }

    // Add Experiences
    if (experiences.length > 0) {
      context += `\nExperience & Leadership:\n`;
      experiences.forEach(e => {
        const end = e.isCurrent ? 'Present' : e.endDate?.toDateString();
        context += `- ${e.role} at ${e.company} (${e.startDate?.toDateString()} - ${end}) [Type: ${e.type}]. Roles: ${e.description.join('; ')}. Tech used: ${e.techStack.join(', ') || 'None'}\n`;
      });
    } else {
      context += `\nExperience & Leadership (Default):
- Assistant Secretary & Web Lead at Google Developer Groups (GDG) Walchand College chapter. Lead team, host events, anchoring, public speaking.
- Active volunteer in state-level hackathons and technical clubs.\n`;
    }

    // Add Achievements
    if (achievements.length > 0) {
      context += `\nKey Achievements & Milestones:\n`;
      achievements.forEach(a => {
        context += `- ${a.title}: ${a.description} (${a.category}, Event: ${a.eventDetails || 'N/A'})\n`;
      });
    } else {
      context += `\nKey Achievements (Default):
- College Rank 1 in B.Tech Walchand College of Engineering.
- Winner of State-Level AI Prompt Battle.
- Winner of State-Level Technical Competitions.
- National-Level Mini Hackathon Winner, 1st Runner-Up in National Hackathon.
- LeetCode rating 1400+, solved 350+ DSA problems.\n`;
    }

    // Add Education
    if (educations.length > 0) {
      context += `\nEducation:\n`;
      educations.forEach(edu => {
        const end = edu.endDate ? edu.endDate.getFullYear() : 'Present';
        context += `- ${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution} (Graduation: ${end}). Score: ${edu.cgpa ? edu.cgpa + ' CGPA' : edu.marks + '% Marks'}\n`;
      });
    } else {
      context += `\nEducation (Default):
- Diploma in Computer Engineering from Government Polytechnic Sakoli.
- B.Tech in Computer Science and Engineering from Walchand College of Engineering.\n`;
    }

    if (settings?.aiAssistantPrompt) {
      context += `\nSpecific Instructions: ${settings.aiAssistantPrompt}\n`;
    }

    return context;
  } catch (error) {
    console.error('Error generating AI context:', error.message);
    return 'Default: Madanraj is a Full-Stack MERN and AI & ML Engineer with achievements in hackathons and leadership.';
  }
};

/**
 * Handle AI query using Gemini or Mock Response logic.
 */
export const queryAIChatbot = async (userMessage, chatHistory = []) => {
  const context = await getSystemContext();

  if (hasGroqKey && groq) {
    try {
      const messages = [
        { role: 'system', content: context },
        ...chatHistory.map(ch => ({
          role: ch.sender === 'user' ? 'user' : 'assistant',
          content: ch.text
        })),
        { role: 'user', content: userMessage }
      ];

      const chatCompletion = await groq.chat.completions.create({
        messages,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.5,
        max_tokens: 1024,
      });

      return chatCompletion.choices[0].message.content.trim();
    } catch (error) {
      console.error('Groq API call failed, falling back to mock response:', error.message);
    }
  }

  // Smart Mock fallback based on regex keyword matches
  const text = userMessage.toLowerCase();
  
  if (text.includes('who') || text.includes('madanraj') || text.includes('about')) {
    return "Madanraj is a passionate AI & ML Engineer, Full Stack MERN Developer, Competitive Programmer, and Public Speaker. He completed his Diploma at Government Polytechnic Sakoli and is pursuing B.Tech at Walchand College of Engineering. He aims to work at top tech companies like Google or Amazon.";
  }
  if (text.includes('project') || text.includes('travelnest') || text.includes('navigator') || text.includes('chatbot')) {
    return "Madanraj has developed several impact-driven projects, including:\n1. **TravelNest**: A premium travel accommodation MERN stack platform.\n2. **MSBTE Navigator**: A resources and navigation app for diploma students.\n3. **Village Knowledge Chatbot**: An AI-powered local information assistant for rural development.\nHe frequently utilizes React, Express, MongoDB, Node, Python, and Large Language Models.";
  }
  if (text.includes('skill') || text.includes('react') || text.includes('technology') || text.includes('know')) {
    return "Madanraj's core skills are divided into:\n- **Programming**: Java, Python, JavaScript, TypeScript\n- **Frontend**: React, Tailwind CSS, HTML/CSS, Bootstrap\n- **Backend & Database**: Node.js, Express.js, MongoDB, MySQL, Oracle SQL\n- **AI & ML**: Large Language Models, LangChain, Ollama, Prompt Engineering\n- **DevOps**: AWS, Docker, Git/GitHub, Linux.";
  }
  if (text.includes('achievement') || text.includes('win') || text.includes('hackathon') || text.includes('leetcode')) {
    return "Madanraj's key achievements include:\n- **College Rank 1** at Walchand College of Engineering.\n- **Winner** of State-Level AI Prompt Battle.\n- **Winner** of National-Level Mini Hackathon and 1st Runner-Up in National Hackathon.\n- **LeetCode Rating 1400+** with 350+ DSA problems solved.\n- **GDG Leadership** as Assistant Secretary & Web Lead.";
  }
  if (text.includes('contact') || text.includes('hire') || text.includes('email') || text.includes('resume')) {
    return "You can hire Madanraj or get in touch through the Contact Form on this site. You can also email him directly or connect on LinkedIn and GitHub. Don't forget to view or download his Resume from the Resume tab!";
  }
  if (text.includes('gdg') || text.includes('leader') || text.includes('experience')) {
    return "Madanraj served as the Assistant Secretary and Web Team Lead for Google Developer Groups (GDG) Walchand College chapter. In this leadership role, he conducted workshops, managed event websites, hosted public speaking engagements, and coordinated high-impact technical events.";
  }

  return "Thank you for asking! Madanraj is a skilled Full Stack MERN & AI/ML Engineer with a B.Tech from Walchand College. He is highly proficient in building modern web apps, integrating LLMs, and solving complex DSA challenges. How can I help you find more details about his projects, skills, or achievements?";
};
