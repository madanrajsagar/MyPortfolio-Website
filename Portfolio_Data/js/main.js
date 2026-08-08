/* ============================================================
   MADANRAJ YUVRAJ SAGAR — PORTFOLIO SCRIPTS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ==================== THEME MANAGEMENT ==================== */
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('portfolio-theme');

  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  }

  themeToggle?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });

  /* ==================== NAVBAR SCROLL ==================== */
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('navbar--scrolled');
    } else {
      navbar?.classList.remove('navbar--scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ==================== MOBILE MENU ==================== */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('navbar__hamburger--open');
    mobileMenu?.classList.toggle('mobile-menu--open');
    document.body.style.overflow = mobileMenu?.classList.contains('mobile-menu--open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('navbar__hamburger--open');
      mobileMenu?.classList.remove('mobile-menu--open');
      document.body.style.overflow = '';
    });
  });

  /* ==================== ACTIVE SECTION HIGHLIGHTING ==================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('navbar__link--active', link.getAttribute('href') === `#${id}`);
          });
          mobileLinks.forEach(link => {
            link.classList.toggle('mobile-menu__link--active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.15, rootMargin: '-80px 0px -40% 0px' }
  );

  sections.forEach(section => sectionObserver.observe(section));

  /* ==================== SCROLL REVEAL ==================== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==================== TYPEWRITER EFFECT ==================== */
  const typewriterEl = document.getElementById('typewriter-text');
  const roles = [
    'AI & ML Engineer',
    'Full Stack Developer',
    'Competitive Programmer',
    'Hackathon Winner',
    'Problem Solver'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeDelay = 100;

  function typewrite() {
    if (!typewriterEl) return;

    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentRole.length) {
        isDeleting = true;
        typeDelay = 2000; // Pause at full text
      } else {
        typeDelay = 80 + Math.random() * 40;
      }
    } else {
      typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeDelay = 400;
      } else {
        typeDelay = 40;
      }
    }

    setTimeout(typewrite, typeDelay);
  }

  typewrite();

  /* ==================== COUNTER ANIMATION ==================== */
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const isDecimal = target % 1 !== 0;
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = target * eased;

      el.textContent = (isDecimal ? current.toFixed(2) : Math.round(current)) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  /* ==================== PROJECT DATA ==================== */
  const projectsData = [
    {
      id: 'abhaya',
      title: 'Abhaya',
      tagline: 'Women Safety Application',
      description: 'A comprehensive women safety application designed to provide real-time protection and emergency assistance. Abhaya empowers users with instant SOS alerts, live location sharing, and a network of emergency contacts to ensure safety in critical situations.',
      features: [
        'One-tap SOS emergency alerts',
        'Real-time GPS location tracking',
        'Emergency contact management',
        'Safe route suggestions',
        'Community safety alerts',
        'Incident reporting system',
        'Voice-activated distress signals',
        'Offline emergency mode'
      ],
      tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Socket.io', 'Google Maps API'],
      challenges: 'Implementing reliable real-time location tracking with minimal battery drain was a core challenge. Ensuring sub-second SOS delivery while handling intermittent network conditions required a robust fallback system with SMS integration.',
      contribution: 'Led the full-stack development, architecting the real-time communication layer with Socket.io, building the RESTful API with Express.js, and developing the responsive React frontend. Implemented the location tracking module and emergency notification pipeline.',
      images: [],
      github: '#',
      demo: null
    },
    {
      id: 'travelnest',
      title: 'TravelNest',
      tagline: 'Travel & Accommodation Platform',
      description: 'A full-stack travel and accommodation platform that connects travelers with unique stays worldwide. TravelNest features an intuitive booking experience, rich property listings with photo galleries, user reviews, and seamless payment integration.',
      features: [
        'Property listing with rich media',
        'Advanced search with filters',
        'Interactive map-based browsing',
        'Secure booking & payments',
        'User reviews & ratings',
        'Host dashboard & analytics',
        'Image upload via Cloudinary',
        'Responsive mobile-first design'
      ],
      tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Cloudinary', 'Bootstrap'],
      challenges: 'Managing complex booking state across concurrent users while maintaining data consistency required implementing optimistic locking and transaction-based operations. Optimizing image delivery for varying network conditions was solved through Cloudinary transformations and lazy loading.',
      contribution: 'Designed and developed the complete application end-to-end — from database schema design and RESTful API architecture to the interactive React frontend. Implemented the cloud-based image pipeline, authentication system, and booking engine.',
      images: [
        'Projects/TravelNest/1.png',
        'Projects/TravelNest/2.png',
        'Projects/TravelNest/Screenshot 2026-08-05 024509.png',
        'Projects/TravelNest/Screenshot 2026-08-05 024528.png',
        'Projects/TravelNest/Screenshot 2026-08-05 024619.png',
        'Projects/TravelNest/Screenshot 2026-08-05 024648.png',
        'Projects/TravelNest/Screenshot 2026-08-05 024721.png',
        'Projects/TravelNest/Screenshot 2026-08-05 025127.png',
        'Projects/TravelNest/Screenshot 2026-08-05 025347.png'
      ],
      github: '#',
      demo: '#'
    },
    {
      id: 'govt-hostel',
      title: 'Government OBC Hostel Website',
      tagline: 'Institutional Management Platform',
      description: 'An official web platform for a Government OBC Hostel, streamlining student registration, room allocation, and administrative operations. The website digitizes hostel management with an intuitive interface for both students and administrators.',
      features: [
        'Student registration & profiles',
        'Room allocation management',
        'Digital notice board',
        'Complaint management system',
        'Fee tracking & receipts',
        'Admin dashboard & reports',
        'Announcement broadcasting',
        'Responsive design for all devices'
      ],
      tech: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express.js', 'MySQL'],
      challenges: 'Designing for government compliance standards while maintaining a modern, accessible UX required balancing strict requirements with user-friendliness. Implementing the room allocation algorithm to handle complex hostel rules and preferences was a significant engineering challenge.',
      contribution: 'Architected and built the complete full-stack solution, including the MySQL database schema, Node.js backend with Express.js, and the responsive frontend. Developed the admin panel, student portal, and room allocation system.',
      images: [],
      github: '#',
      demo: null
    },
    {
      id: 'msbte-navigator',
      title: 'MSBTE Navigator',
      tagline: 'Exam Preparation Platform',
      description: 'A comprehensive exam preparation platform for MSBTE (Maharashtra State Board of Technical Education) diploma students. MSBTE Navigator organizes previous year question papers, study materials, and resources in a structured, searchable format to streamline exam preparation.',
      features: [
        'Subject-wise question paper bank',
        'Organized study materials',
        'Semester-wise navigation',
        'Search & filter functionality',
        'Downloadable resources',
        'Mobile-responsive interface',
        'Branch-specific content',
        'Community contributions support'
      ],
      tech: ['React', 'Flask', 'Python', 'MongoDB', 'Bootstrap', 'REST API'],
      challenges: 'Organizing a massive dataset of question papers across multiple branches, semesters, and years required a carefully designed taxonomy and efficient search indexing. Building a scraping pipeline to systematically collect and categorize resources was a key technical achievement.',
      contribution: 'Designed the data architecture and built the Flask backend with RESTful APIs. Developed the React frontend with dynamic filtering and search capabilities. Created the data ingestion pipeline and managed the MongoDB document structure.',
      images: [
        'Projects/MSBTE Navigator/Picture1.png',
        'Projects/MSBTE Navigator/Picture2.png',
        'Projects/MSBTE Navigator/Picture3.png',
        'Projects/MSBTE Navigator/Picture4.png'
      ],
      github: '#',
      demo: null
    }
  ];

  /* ==================== ACHIEVEMENT DATA ==================== */
  const achievementsData = [
    {
      id: 'hackoutsav',
      title: 'HackoutSav',
      description: 'Participated in HackoutSav, an inter-college hackathon, building an innovative solution under time constraints. Demonstrated strong problem-solving and team collaboration skills.',
      images: [
        'achievements/hackoutsav/1.jpg',
        'achievements/hackoutsav/2.jpg',
        'achievements/hackoutsav/3.jpg',
        'achievements/hackoutsav/4.jpg',
        'achievements/hackoutsav/5.jpg'
      ]
    },
    {
      id: 'ai-prompt-battle',
      title: 'AI Prompt Battle Competition',
      description: 'Competed in the AI Prompt Battle, showcasing expertise in prompt engineering and AI tool utilization. Demonstrated advanced knowledge of LLM interaction patterns and creative problem-solving with AI.',
      images: [
        'achievements/AI Prompt Battle competition/1.jpg',
        'achievements/AI Prompt Battle competition/2.jpg',
        'achievements/AI Prompt Battle competition/3.jpg'
      ]
    },
    {
      id: 'techno-spirit',
      title: 'Techno-Spirit',
      description: 'Excelled at Techno-Spirit, a technical festival featuring competitive coding, project exhibitions, and innovation challenges. Showcased technical proficiency across multiple domains.',
      images: [
        'achievements/Techno-spirit/1.jpg',
        'achievements/Techno-spirit/2.jpg',
        'achievements/Techno-spirit/3.jpg'
      ]
    },
    {
      id: 'reimagine',
      title: 'Reimagine',
      description: 'Participated in Reimagine, an innovation-driven hackathon focused on reimagining solutions to real-world problems using cutting-edge technology. Delivered a creative and technically sound prototype.',
      images: [
        'achievements/Reimagine/1.jpg'
      ]
    },
    {
      id: 'college-topper',
      title: 'College Topper & Government Scholarship',
      description: 'Achieved Rank 1 for four consecutive semesters during Diploma in Computer Technology (95.09%). Awarded a Government Scholarship in recognition of outstanding academic excellence and consistent top performance.',
      images: [
        'achievements/CollegeTopper&GS/1.jpg',
        'achievements/CollegeTopper&GS/2.jpeg',
        'achievements/CollegeTopper&GS/3.jpg',
        'achievements/CollegeTopper&GS/4.jpeg'
      ]
    },
    {
      id: 'hacktoberfest',
      title: 'Hacktoberfest',
      description: 'Active contributor to Hacktoberfest, the global open-source celebration. Made meaningful contributions to open-source projects, demonstrating collaboration skills and commitment to the developer community.',
      images: [
        'achievements/Hacktoberfest/1.jpg',
        'achievements/Hacktoberfest/2.jpg',
        'achievements/Hacktoberfest/3.jpg',
        'achievements/Hacktoberfest/4.jpg'
      ]
    },
    {
      id: 'codedash',
      title: 'CodeDash',
      description: 'Participated in CodeDash, a competitive programming challenge testing algorithmic thinking, data structure knowledge, and coding speed under pressure.',
      images: [
        'achievements/CodeDash/1.jpg'
      ]
    },
    {
      id: 'national-paper',
      title: 'National-Level Paper Presentation',
      description: 'Presented a technical research paper at a National-Level Paper Presentation Competition. Demonstrated research ability, domain expertise, and effective communication of complex technical concepts to a jury panel.',
      images: [
        'achievements/National-Level Paper Presentation Competition/1.jpg',
        'achievements/National-Level Paper Presentation Competition/2.jpg',
        'achievements/National-Level Paper Presentation Competition/3.jpg'
      ]
    },
    {
      id: 'state-paper',
      title: 'State-Level Paper Presentation',
      description: 'Presented a technical research paper at a State-Level Paper Presentation Competition. Showcased in-depth understanding of the subject matter and received recognition for presentation quality and technical depth.',
      images: [
        'achievements/State-Level Paper Presentation Competition/1.jpg',
        'achievements/State-Level Paper Presentation Competition/2.jpg',
        'achievements/State-Level Paper Presentation Competition/3.jpg'
      ]
    }
  ];

  /* ==================== RENDER PROJECT CARDS ==================== */
  const projectsGrid = document.getElementById('projects-grid');

  if (projectsGrid) {
    const placeholderClasses = [
      'project-card__placeholder--1',
      'project-card__placeholder--2',
      'project-card__placeholder--3',
      'project-card__placeholder--4'
    ];

    projectsData.forEach((project, index) => {
      const card = document.createElement('div');
      card.className = 'project-card glass reveal';
      card.style.transitionDelay = `${index * 0.1}s`;

      const hasImages = project.images.length > 0;
      const imageSection = hasImages
        ? `<div class="project-card__image">
             <img src="${project.images[0]}" alt="${project.title}" loading="lazy">
           </div>`
        : `<div class="project-card__placeholder ${placeholderClasses[index]}">
             ${project.title.split(' ').map(w => w[0]).join('')}
           </div>`;

      card.innerHTML = `
        ${imageSection}
        <div class="project-card__body">
          <h3 class="project-card__title">${project.title}</h3>
          <p class="project-card__desc">${project.tagline}. ${project.description.substring(0, 120)}...</p>
          <div class="project-card__tech">
            ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
          <div class="project-card__actions">
            <span class="project-card__cta">
              View Details
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openProjectModal(project));
      projectsGrid.appendChild(card);
    });

    // Re-observe new reveal elements
    document.querySelectorAll('.project-card.reveal').forEach(el => revealObserver.observe(el));
  }

  /* ==================== RENDER ACHIEVEMENT CARDS ==================== */
  const achievementsGrid = document.getElementById('achievements-grid');

  if (achievementsGrid) {
    achievementsData.forEach((achievement, index) => {
      const card = document.createElement('div');
      card.className = 'achievement-card glass reveal';
      card.style.transitionDelay = `${index * 0.08}s`;

      card.innerHTML = `
        <div class="achievement-card__image">
          <img src="${achievement.images[0]}" alt="${achievement.title}" loading="lazy">
        </div>
        <div class="achievement-card__body">
          <h3 class="achievement-card__title">${achievement.title}</h3>
          <p class="achievement-card__desc">${achievement.description.substring(0, 100)}...</p>
          <span class="achievement-card__view">
            View Gallery
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      `;

      card.addEventListener('click', () => openAchievementModal(achievement));
      achievementsGrid.appendChild(card);
    });

    document.querySelectorAll('.achievement-card.reveal').forEach(el => revealObserver.observe(el));
  }

  /* ==================== MODAL SYSTEM ==================== */
  const modalOverlay = document.getElementById('modal-overlay');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');
  let currentCarousel = { index: 0, images: [], autoPlay: null };

  function openProjectModal(project) {
    if (!modalOverlay || !modalContent) return;

    const hasImages = project.images.length > 0;

    let carouselHTML = '';
    if (hasImages) {
      carouselHTML = `
        <div class="carousel" id="modal-carousel">
          <div class="carousel__track" id="carousel-track">
            ${project.images.map(img => `
              <div class="carousel__slide">
                <img src="${img}" alt="${project.title}" loading="lazy">
              </div>
            `).join('')}
          </div>
          ${project.images.length > 1 ? `
            <button class="carousel__btn carousel__btn--prev" id="carousel-prev" aria-label="Previous slide">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button class="carousel__btn carousel__btn--next" id="carousel-next" aria-label="Next slide">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          ` : ''}
          ${project.images.length > 1 ? `
            <div class="carousel__dots" id="carousel-dots">
              ${project.images.map((_, i) => `
                <button class="carousel__dot ${i === 0 ? 'carousel__dot--active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;
    }

    modalContent.innerHTML = `
      ${carouselHTML}
      <div class="modal__body">
        <h2 class="modal__title">${project.title}</h2>
        <p class="modal__description">${project.description}</p>

        <div class="modal__section">
          <h3 class="modal__section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Key Features
          </h3>
          <div class="modal__features">
            ${project.features.map(f => `
              <div class="modal__feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${f}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="modal__section">
          <h3 class="modal__section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            Tech Stack
          </h3>
          <div class="modal__tech-stack">
            ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </div>

        <div class="modal__section">
          <h3 class="modal__section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            Challenges
          </h3>
          <p class="modal__challenge">${project.challenges}</p>
        </div>

        <div class="modal__section">
          <h3 class="modal__section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            My Contribution
          </h3>
          <p class="modal__challenge">${project.contribution}</p>
        </div>

        <div class="modal__actions">
          <a href="${project.github}" class="btn btn--primary btn--sm" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
          ${project.demo ? `
            <a href="${project.demo}" class="btn btn--outline btn--sm" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
              Live Demo
            </a>
          ` : ''}
        </div>
      </div>
    `;

    showModal();
    if (hasImages && project.images.length > 1) {
      initCarousel(project.images);
    }
  }

  function openAchievementModal(achievement) {
    if (!modalOverlay || !modalContent) return;

    const carouselHTML = `
      <div class="carousel" id="modal-carousel">
        <div class="carousel__track" id="carousel-track">
          ${achievement.images.map(img => `
            <div class="carousel__slide">
              <img src="${img}" alt="${achievement.title}" loading="lazy">
            </div>
          `).join('')}
        </div>
        ${achievement.images.length > 1 ? `
          <button class="carousel__btn carousel__btn--prev" id="carousel-prev" aria-label="Previous slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button class="carousel__btn carousel__btn--next" id="carousel-next" aria-label="Next slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        ` : ''}
        ${achievement.images.length > 1 ? `
          <div class="carousel__dots" id="carousel-dots">
            ${achievement.images.map((_, i) => `
              <button class="carousel__dot ${i === 0 ? 'carousel__dot--active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;

    modalContent.innerHTML = `
      ${carouselHTML}
      <div class="modal__body">
        <h2 class="modal__title">${achievement.title}</h2>
        <p class="modal__description">${achievement.description}</p>
      </div>
    `;

    showModal();
    if (achievement.images.length > 1) {
      initCarousel(achievement.images);
    }
  }

  function showModal() {
    modalOverlay?.classList.add('modal-overlay--open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay?.classList.remove('modal-overlay--open');
    document.body.style.overflow = '';
    if (currentCarousel.autoPlay) {
      clearInterval(currentCarousel.autoPlay);
      currentCarousel.autoPlay = null;
    }
  }

  modalClose?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if (modalOverlay?.classList.contains('modal-overlay--open')) {
      if (e.key === 'ArrowLeft') navigateCarousel(-1);
      if (e.key === 'ArrowRight') navigateCarousel(1);
    }
  });

  /* ==================== CAROUSEL ==================== */
  function initCarousel(images) {
    currentCarousel = { index: 0, images, autoPlay: null };
    updateCarousel();

    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dots = document.getElementById('carousel-dots');

    prevBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateCarousel(-1);
    });
    nextBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateCarousel(1);
    });

    dots?.addEventListener('click', (e) => {
      const dot = e.target.closest('.carousel__dot');
      if (dot) {
        e.stopPropagation();
        currentCarousel.index = parseInt(dot.dataset.index);
        updateCarousel();
      }
    });

    // Auto-play
    const carousel = document.getElementById('modal-carousel');
    currentCarousel.autoPlay = setInterval(() => navigateCarousel(1), 4000);

    carousel?.addEventListener('mouseenter', () => {
      if (currentCarousel.autoPlay) clearInterval(currentCarousel.autoPlay);
    });
    carousel?.addEventListener('mouseleave', () => {
      currentCarousel.autoPlay = setInterval(() => navigateCarousel(1), 4000);
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel?.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        navigateCarousel(diff > 0 ? 1 : -1);
      }
    }, { passive: true });
  }

  function navigateCarousel(direction) {
    const total = currentCarousel.images.length;
    if (total <= 1) return;
    currentCarousel.index = (currentCarousel.index + direction + total) % total;
    updateCarousel();
  }

  function updateCarousel() {
    const track = document.getElementById('carousel-track');
    const dots = document.querySelectorAll('.carousel__dot');

    if (track) {
      track.style.transform = `translateX(-${currentCarousel.index * 100}%)`;
    }

    dots.forEach((dot, i) => {
      dot.classList.toggle('carousel__dot--active', i === currentCarousel.index);
    });
  }

  /* ==================== SMOOTH SCROLL LINKS ==================== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
