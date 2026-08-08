import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Project from '../models/Project.js';

// Setup DNS overrides for MongoDB
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const projectsData = [
  {
    title: 'TravelNest',
    description: 'AI-Powered Vacation Rental Platform (Airbnb Clone)',
    longDescription: 'TravelNest is a production-ready full-stack vacation rental platform inspired by Airbnb, enabling users to discover, list, and manage rental properties through a secure and scalable web application. The platform implements complete authentication, interactive maps, image management, reviews, and booking-oriented workflows while following RESTful architecture and modern deployment practices.',
    techStack: [
      'React', 'Node.js', 'Express', 'MongoDB', 'Cloudinary', 
      'AWS EC2', 'AWS S3', 'JWT', 'Passport.js', 'MapTiler'
    ],
    features: [
      'JWT & Session-based Authentication',
      'Role-based Authorization',
      'Property Listing CRUD Operations',
      'Cloudinary Image Upload & Management',
      'Interactive Maps using MapTiler API',
      'Reviews & Ratings System',
      'Advanced Property Search',
      'Responsive UI',
      'Secure REST APIs',
      'AWS Deployment (S3 + EC2)'
    ],
    architecture: [
      'Designed RESTful backend APIs using Express.js following MVC architecture.',
      'Implemented secure user authentication using Passport.js, sessions, cookies, and authorization middleware.',
      'Integrated Cloudinary for optimized cloud image storage with Multer for multipart uploads.',
      'Used MongoDB Atlas with Mongoose ODM for schema design and efficient database relationships.',
      'Implemented geolocation and map visualization using MapTiler APIs.',
      'Deployed frontend on AWS S3 Static Website Hosting and backend on AWS EC2 using PM2 for process management.',
      'Followed modular project architecture with reusable middleware, centralized error handling, and environment-based configuration.'
    ],
    githubLink: 'https://github.com/madanrajsagar/TravelNest',
    liveDemo: 'http://travelnest-frontend.s3-website.eu-north-1.amazonaws.com/listings',
    heroImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800',
    featured: true,
    status: 'published',
    order: 1
  },
  {
    title: 'Abhaya',
    description: 'AI-Powered Women\'s Safety & Scam Detection Platform',
    longDescription: 'Abhaya is an AI-driven safety platform designed to protect users from modern digital fraud, deepfake attacks, scam calls, and suspicious communications. The system leverages multiple AI models to analyze text, audio, and video inputs for detecting fraudulent activities while providing safety recommendations and confidence scores.',
    techStack: [
      'React', 'FastAPI', 'Python', 'Generative AI', 
      'Machine Learning', 'Deep Learning', 'REST APIs'
    ],
    features: [
      'AI Scam Detection',
      'Deepfake Detection',
      'Voice Analysis',
      'Video Verification',
      'Text Scam Classification',
      'AI Safety Recommendations',
      'Confidence Score Generation',
      'Modern Responsive UI'
    ],
    architecture: [
      'Built an AI-enabled backend capable of processing multiple data modalities including text, audio, and video.',
      'Integrated Generative AI models for contextual scam analysis and recommendation generation.',
      'Developed scalable APIs using FastAPI.',
      'Implemented frontend using React for real-time interaction with AI services.',
      'Designed modular architecture allowing independent AI pipelines for different input formats.',
      'Focused on low-latency inference and user-friendly safety reporting.'
    ],
    githubLink: 'https://github.com/madanrajsagar/Abhaya',
    liveDemo: 'https://github.com/madanrajsagar/Abhaya',
    heroImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
    featured: true,
    status: 'published',
    order: 2
  },
  {
    title: 'MSBTE Navigator',
    description: 'AI-Powered Academic Assistant using Retrieval-Augmented Generation (RAG)',
    longDescription: 'MSBTE Navigator is an intelligent academic assistant developed to help diploma students instantly access syllabus information, previous question papers, curriculum details, and academic regulations. The system combines semantic search with Retrieval-Augmented Generation (RAG) to provide accurate, context-aware answers from institutional documents instead of relying solely on general-purpose LLM knowledge.',
    techStack: [
      'Python', 'Flask', 'LangChain', 'FAISS', 'HuggingFace Embeddings', 
      'Ollama', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'REST APIs'
    ],
    features: [
      'RAG-based Question Answering',
      'Semantic Search',
      'PDF Knowledge Base',
      'AI Chatbot',
      'Context-aware Responses',
      'Document Embeddings',
      'Conversation Memory',
      'Web-based Chat Interface'
    ],
    architecture: [
      'Built a Retrieval-Augmented Generation pipeline using LangChain.',
      'Generated semantic embeddings using HuggingFace Embedding Models.',
      'Stored and retrieved vector representations efficiently using FAISS Vector Database.',
      'Integrated Ollama for running local Large Language Models.',
      'Processed institutional PDF documents into searchable knowledge chunks.',
      'Developed backend using Flask with REST APIs.',
      'Used MySQL for application data storage and user management.',
      'Designed chatbot interface capable of answering curriculum-specific queries with higher accuracy than generic chatbots.'
    ],
    githubLink: 'https://github.com/madanrajsagar/MsbteNavigatorDiploy',
    liveDemo: 'https://github.com/madanrajsagar/MsbteNavigatorDiploy',
    heroImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    featured: true,
    status: 'published',
    order: 3
  }
];

const seedCleanProjects = async () => {
  try {
    await connectDB();
    
    console.log('Clearing all existing projects from database...');
    await Project.deleteMany({});
    console.log('Wiped projects collection successfully.');

    console.log('Inserting TravelNest, Abhaya, and MSBTE Navigator...');
    const result = await Project.create(projectsData);
    console.log(`Successfully seeded ${result.length} clean project documents!`);

    mongoose.connection.close();
  } catch (err) {
    console.error('Failed to seed clean projects:', err.message);
  }
};

seedCleanProjects();
