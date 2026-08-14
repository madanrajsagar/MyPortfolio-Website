import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Github, Linkedin, Code2, Download, ExternalLink, MessageSquare } from 'lucide-react';
import api from '../../services/api.js';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(15, 'Message must be at least 15 characters'),
});

const Contact = ({ settings = {} }) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data) => {
    setError('');
    try {
      const res = await api.post('/messages', data);
      if (res.data?.success) {
        setSuccess(true);
        reset();
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError('Submission failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please check your connection.');
    }
  };

  const socialLinks = settings.socialLinks || {};
  const contactDetails = settings.contactDetails || {};

  const contactCards = [
    {
      icon: Mail,
      label: 'Email',
      value: contactDetails.email || socialLinks.email || 'madanrajsagar83@gmail.com',
      href: `mailto:${contactDetails.email || socialLinks.email || 'madanrajsagar83@gmail.com'}`,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/15',
      hoverBorder: 'hover:border-indigo-500/35',
      hint: 'Best for professional inquiries',
    },
    {
      icon: Phone,
      label: 'Phone / WhatsApp',
      value: contactDetails.phone || '+91 (available on request)',
      href: contactDetails.phone ? `tel:${contactDetails.phone}` : null,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/15',
      hoverBorder: 'hover:border-emerald-500/35',
      hint: 'Available during business hours (IST)',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: '@MadanrajS',
      href: socialLinks.github || 'https://github.com',
      color: 'text-white',
      bg: 'bg-white/5',
      border: 'border-white/10',
      hoverBorder: 'hover:border-white/25',
      hint: 'View my code and projects',
      external: true,
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: '/in/madanraj-s',
      href: socialLinks.linkedin || 'https://linkedin.com',
      color: 'text-blue-400',
      bg: 'bg-blue-500/5',
      border: 'border-blue-500/15',
      hoverBorder: 'hover:border-blue-500/35',
      hint: 'Professional networking',
      external: true,
    },
    {
      icon: Code2,
      label: 'LeetCode',
      value: '@madanraj',
      href: 'https://leetcode.com',
      color: 'text-amber-400',
      bg: 'bg-amber-500/5',
      border: 'border-amber-500/15',
      hoverBorder: 'hover:border-amber-500/35',
      hint: '350+ problems solved · Rating 1400+',
      external: true,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: contactDetails.address || 'Walchand College, Sangli, Maharashtra',
      href: 'https://maps.google.com/?q=Walchand+College+of+Engineering+Sangli',
      color: 'text-rose-400',
      bg: 'bg-rose-500/5',
      border: 'border-rose-500/15',
      hoverBorder: 'hover:border-rose-500/35',
      hint: 'India — open to remote & relocation',
      external: true,
    },
  ];

  const getMapUrl = (input) => {
    if (!input) {
      return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3818.172314647311!2d74.59918231535787!3d16.867375988390776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc1230d4b537d99%3A0xe5eb6c4334351a0!2sWalchand%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin";
    }
    if (input.includes('src="')) {
      const match = input.match(/src="([^"]+)"/);
      return match ? match[1] : input;
    }
    return input;
  };

  const mapSrc = getMapUrl(contactDetails.googleMapIframe);

  return (
    <section id="contact" className="py-24 bg-[#030307] relative overflow-hidden">
      <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] aurora-blur-1 pointer-events-none rounded-full opacity-50" />
      <div className="absolute top-[10%] right-[-5%] w-[250px] h-[250px] aurora-blur-2 pointer-events-none rounded-full opacity-30" />

      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Get In Touch</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Contact <span className="gradient-text text-glow">Me</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full mt-4" />
          <p className="mt-4 text-gray-500 text-sm max-w-lg">
            Open to internships, full-time roles, freelance projects, hackathon collaborations, and technical discussions. Reach out anytime!
          </p>
        </div>

        {/* Contact cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-14">
          {contactCards.map((card, idx) => (
            <motion.a
              key={idx}
              href={card.href || '#'}
              target={card.external ? '_blank' : undefined}
              rel={card.external ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: idx * 0.06 }}
              whileHover={{ y: -5 }}
              data-cursor={card.external ? "VISIT" : "CLICK"}
              className={`coding-profile-card p-4 rounded-2xl glass-card border ${card.border} ${card.hoverBorder} flex flex-col gap-3 group cursor-pointer transition-all duration-300`}
            >
              <div className={`w-10 h-10 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div>
                <div className={`text-[9px] font-bold uppercase tracking-wider ${card.color} mb-0.5`}>{card.label}</div>
                <div className="text-xs font-semibold text-white leading-tight truncate">{card.value}</div>
              </div>
              <div className="text-[9px] text-gray-600 leading-tight">{card.hint}</div>
            </motion.a>
          ))}
        </div>

        {/* Resume Download CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 p-6 rounded-2xl glass-card border border-indigo-500/15 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-indigo-500/5 to-violet-500/5"
        >
          <div>
            <h3 className="font-display font-bold text-white text-base">Download My Resume</h3>
            <p className="text-xs text-gray-400 mt-1">Latest version with projects, education (CGPA 9.36), skills, and achievements.</p>
          </div>
          <button
            onClick={() => {
              if (settings.resumeUrl) {
                window.open(settings.resumeUrl, '_blank');
              } else {
                alert('Please contact me directly for the latest resume!');
              }
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-500/20 whitespace-nowrap clickable"
          >
            <Download className="w-4 h-4" />
            Download CV
          </button>
        </motion.div>

        {/* Contact form + map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl mx-auto items-start">

          {/* Left: Info + Map */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-7 rounded-3xl glass-card border border-white/5 flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 blur-xl rounded-full" />
              <div>
                <h3 className="font-display font-bold text-lg text-white">Let's build something great.</h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  Have an exciting project, internship opportunity, hackathon team, or just want to connect with a fellow developer? Drop me a message — I typically reply within 24 hours.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <a href={`mailto:${contactDetails.email || 'madanrajsagar83@gmail.com'}`} className="flex items-center gap-4 group">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/15 rounded-xl text-indigo-400 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-all">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Email</span>
                    <span className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors break-all">
                      {contactDetails.email || 'madanrajsagar83@gmail.com'}
                    </span>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-rose-500/10 border border-rose-500/15 rounded-xl text-rose-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Location</span>
                    <span className="text-xs sm:text-sm text-gray-300">
                      {contactDetails.address || 'Walchand College, Sangli, MH, India'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="w-full aspect-[2/1] rounded-xl overflow-hidden border border-white/10 opacity-75 hover:opacity-90 transition-opacity">
                <iframe
                  title="Location Map"
                  src={mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-7 rounded-3xl glass-card border border-white/5 flex flex-col gap-5 relative"
            >
              <div className="mb-1">
                <h3 className="font-display font-bold text-white text-base">Send a Message</h3>
                <p className="text-xs text-gray-500 mt-0.5">I'll respond to your email within 24 hours.</p>
              </div>

              <AnimatePresence mode="wait">
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Message delivered! I'll respond to your email shortly.</span>
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="John Doe"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                  {errors.name && <span className="text-[10px] text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="john@example.com"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                  {errors.email && <span className="text-[10px] text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email.message}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  {...register('subject')}
                  placeholder="Internship inquiry / Project collaboration / Hackathon team"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
                {errors.subject && <span className="text-[10px] text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.subject.message}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Message</label>
                <textarea
                  rows="5"
                  {...register('message')}
                  placeholder="Hi Madanraj, we're looking for a full stack engineer / AI developer for our upcoming project..."
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 resize-none transition-colors"
                />
                {errors.message && <span className="text-[10px] text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.message.message}</span>}
              </div>

              <button
                type="submit"
                data-cursor="CLICK"
                disabled={isSubmitting}
                className="w-full mt-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-500/15 group clickable"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
