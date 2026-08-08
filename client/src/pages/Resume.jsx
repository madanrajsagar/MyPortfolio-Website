import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Download, Eye, FileText, Calendar, GraduationCap, Briefcase, Award, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';

const Resume = () => {
  // Query portfolio details from database
  const { data: settingsRes } = useQuery({ queryKey: ['settings'], queryFn: () => api.get('/settings') });
  const { data: experiencesRes } = useQuery({ queryKey: ['experiences'], queryFn: () => api.get('/experience') });
  const { data: educationsRes } = useQuery({ queryKey: ['educations'], queryFn: () => api.get('/education') });
  const { data: skillsRes } = useQuery({ queryKey: ['skills'], queryFn: () => api.get('/skills') });

  const settings = settingsRes?.data?.data || {};
  const experiences = experiencesRes?.data?.data || [];
  const educations = educationsRes?.data?.data || [];
  const skills = skillsRes?.data?.data || [];

  const handleDownload = async () => {
    try {
      await api.post('/analytics/event', {
        eventType: 'downloadResume',
        target: settings.resumeUrl || 'resume.pdf',
      });
      if (settings.resumeUrl) {
        window.open(settings.resumeUrl, '_blank');
      } else {
        alert('Resume document is currently updating. Ask the AI assistant for details!');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* Title & actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8 mb-10 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-indigo-400" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white">Online Curriculum Vitae</h1>
            <p className="text-xs text-gray-500 mt-0.5">Interactive resume showcasing certifications, leadership and tech stacks.</p>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-500/10 transition-colors clickable"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Document</span>
        </button>
      </div>

      {/* CV Sheet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: profile contact summary + Skills */}
        <div className="md:col-span-4 flex flex-col gap-6">
          
          {/* Identity details */}
          <div className="glass-card p-6 rounded-2xl border border-white/5">
            <h3 className="font-display font-bold text-white text-md">Madanraj</h3>
            <p className="text-xs text-indigo-400 mt-0.5">Full Stack & AI Engineer</p>
            <div className="w-full h-[1px] bg-white/5 my-4" />
            
            <div className="flex flex-col gap-2.5 text-xs text-gray-400">
              <div>
                <span className="font-bold text-white block uppercase text-[9px] text-gray-500 tracking-wider">Email</span>
                <span>{settings.socialLinks?.email || 'your_email@gmail.com'}</span>
              </div>
              <div>
                <span className="font-bold text-white block uppercase text-[9px] text-gray-500 tracking-wider">Education</span>
                <span>Walchand College B.Tech CSE</span>
              </div>
              <div>
                <span className="font-bold text-white block uppercase text-[9px] text-gray-500 tracking-wider">Location</span>
                <span>Sangli, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="glass-card p-6 rounded-2xl border border-white/5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Core Tech Skills</span>
            </h4>

            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span key={skill._id} className="text-[10px] bg-white/5 px-2.5 py-1 rounded-md text-gray-300 font-semibold border border-white/5">
                    {skill.name}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {['Java', 'Python', 'React', 'Node.js', 'Express', 'MongoDB', 'LangChain', 'Ollama'].map((t) => (
                  <span key={t} className="text-[10px] bg-white/5 px-2.5 py-1 rounded-md text-gray-300 font-semibold">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Timeline nodes (Exp, Edu) */}
        <div className="md:col-span-8 flex flex-col gap-10">
          
          {/* Work / Leadership timeline */}
          <div>
            <h3 className="text-md sm:text-lg font-display font-bold text-white flex items-center gap-2.5 mb-6">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <span>Experience & Leadership</span>
            </h3>

            <div className="relative border-l border-white/5 ml-3 pl-6 flex flex-col gap-8">
              {experiences.map((exp) => (
                <div key={exp._id} className="relative">
                  <div className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full bg-bgDark border border-indigo-500 flex items-center justify-center text-indigo-400 text-xs shadow" />
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500 font-semibold uppercase">
                      {new Date(exp.startDate).getFullYear()} - {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}
                    </span>
                    <h4 className="text-sm font-semibold text-white leading-tight">{exp.role}</h4>
                    <span className="text-xs text-gray-500 font-medium">{exp.company}</span>
                    
                    <ul className="list-disc pl-4 text-xs text-gray-400 mt-2 space-y-1 leading-relaxed">
                      {exp.description.map((desc, dIdx) => (
                        <li key={dIdx}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education timeline */}
          <div>
            <h3 className="text-md sm:text-lg font-display font-bold text-white flex items-center gap-2.5 mb-6">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <span>Education history</span>
            </h3>

            <div className="relative border-l border-white/5 ml-3 pl-6 flex flex-col gap-8">
              {educations.map((edu) => (
                <div key={edu._id} className="relative">
                  <div className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full bg-bgDark border border-indigo-500 flex items-center justify-center text-indigo-400 text-xs shadow" />
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500 font-semibold uppercase">
                      {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : ''}
                    </span>
                    <h4 className="text-sm font-semibold text-white leading-tight">{edu.degree}</h4>
                    <span className="text-xs text-gray-500 font-medium">{edu.institution}</span>
                    {edu.cgpa && <span className="text-xs text-indigo-400 font-bold mt-1">Score: {edu.cgpa} CGPA</span>}
                    {edu.marks && <span className="text-xs text-pink-400 font-bold mt-1">Score: {edu.marks}% Marks</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Resume;
