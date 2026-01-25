document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Grid containers
    const ongoingProjectsGrid = document.getElementById('ongoing-projects');
    const completedProjectsGrid = document.getElementById('completed-projects');
    const sideProjectsGrid = document.getElementById('side-projects');
    const ongoingResearchGrid = document.getElementById('ongoing-research');
    const completedResearchGrid = document.getElementById('completed-research');
    const blogGrid = document.querySelector('.blog-grid');
    const skillsGrid = document.querySelector('.skills-grid');
    const timelineContainer = document.querySelector('.timeline-track');
    // Other elements
    const modal = document.getElementById('project-modal');
    const modalClose = document.querySelector('.modal-close');
    const mouseGlow = document.getElementById('mouse-glow');

    // --- PORTFOLIO DATA ---
    const data = {
        projects: {
            ongoing: [
                { name: 'Chronos OS', description: 'Currently developing a time-aware operating system using Rust. Implemented kernel and memory read/write functionality. Developed RTL8139 network driver and mouse driver enabling drag-and-drop window interaction. Built a basic window manager.', image: 'images/image2.jpg', tech: 'Rust' }
            ],
            completed: [
                { name: 'NIDAR', description: 'Design and simulation of a two-drone autonomous system for precision agriculture, focusing on coordinated flight patterns and data collection for crop monitoring.', image: 'images/image1.jpg', tech: 'Solidworks' },
                { name: 'Digital Electronics Helper', description: 'Helps with Karnaugh Maps and BJT configurations.', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&q=80&w=1080', tech: 'HTML5,CSS3,JS' },
                { name: 'Ahjin Code Conclave Website Blueprint', description: 'Helped propose a structure for the AhjinCC website.', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&q=80&w=1080', tech: 'HTML5,CSS3,JS' },
                { name: 'Syntech', description: 'An adaptive programming learning platform.', image: 'images/image3.jpg', tech: 'HTML5,CSS3,JS' },
                { name: 'Terminal Based Portfolio', description: 'A portfolio with a command-line interface and functioning commands.', image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&q=80&w=1080', tech: 'HTML5,CSS3,JS' },
                { name: 'Groqity Groq', description: 'A multi-modal AI assistant.', image: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?ixlib=rb-4.0.3&q=80&w=1080', tech: 'HTML5,CSS3,JS,Python' },
                { name: 'Paint Clone', description: 'A clone of the classic Paint application.', image: 'images/image4.jpg', tech: 'Python' },
                { name: 'Yt-mon', description: 'Creates Pokémon-like cards for YouTubers.', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&q=80&w=1080', tech: 'React,Next.js,JS,TypeScript,CSS3' },
                { name: 'Online Chess Website', description: 'A chess website featuring online matchmaking.', image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?ixlib=rb-4.0.3&q=80&w=1080', tech: 'HTML5,CSS3,JS' },
                { name: 'Autonomous Multi-UAV System with Ground Control Station', description: 'Designed and implemented software for autonomous operation of a two-drone system. Developed ground control functionality for telemetry monitoring and mission execution. Implemented communication between UAVs and control systems. Tested and debugged system behavior using Software-in-the-Loop (SITL) simulation. Implemented the software successfully using a Raspberry Pi and Pixhawk Cube Orange+ on both drones.', image: 'images/image5.jpg', tech: 'Python,SITL,Gazebo,ROS' },
                { name: 'Machine Learning Algorithm for Identifying Plant Diseases', description: 'Trained a model to identify common diseases in crops on 87k+ datasets. Achieved more than 95% accuracy on disease detection.', image: 'images/image6.jpg', tech: 'Python,ML' },
                { name: 'DC-DC Boost Converter Design', description: 'Designed and prototyped a DC-DC boost converter for embedded power applications. Performed component selection, circuit assembly, and output testing.', image: 'images/image7.jpg', tech: 'LTspice,Electronics' }
            ],
            side: [
                { name: 'Obstacle Avoiding Bot', description: 'An autonomous robot built with an Arduino Uno and ultrasonic sensors to intelligently navigate its environment.', image: 'images/image11.jpg', tech: 'Arduino' },
                { name: 'Line Follower Bot', description: 'A classic robotics project using an Arduino and IR sensors to detect and follow a path.', image: 'images/image12.jpg', tech: 'Arduino' },
                { name: 'Boost Converter Design', description: 'Circuit design and simulation for research work on power electronics.', image: 'images/image13.jpg', tech: 'LTspice' },
                { name: 'April Fools Prank Website', description: 'A fun little side project to prank friends.', image: 'images/image8.jpg', tech: 'HTML5,CSS3,JS' },
                { name: 'Mood Based Websites', description: 'A series of websites recommending food, songs, and movies based on mood.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&q=80&w=1080', tech: 'HTML5,CSS3,JS' },
                { name: 'Asteroid Shooting Game', description: 'A retro-style arcade game where players control a spaceship to destroy asteroids.', image: 'images/image9.jpg', tech: 'HTML5,CSS3,JS' },
                { name: 'Lie Detection Game', description: 'A simple, hardcoded game for fun.', image: 'images/image10.jpg', tech: 'HTML5,CSS3,JS' }
            ]
        },
        research: {
            ongoing: [ { title: 'Regenerative Power Systems', abstract: 'Using dynamos to feed energy spent by a machine back into its power source for longer operational runs.' } ],
            completed: [
                { title: 'Supercapacitors vs. Batteries', abstract: 'Can supercapacitors replace batteries for autonomous systems? An analysis of power density, energy density, and lifecycle.' },
                { title: 'Trim, Thrust Required, and Power Required Analysis of a Cropped Delta Wing UAV Using MATLAB', abstract: 'Performed aerodynamic and power analysis for a cropped delta wing UAV using MATLAB, including trim calculations, thrust and power requirements for various flight conditions.' }
            ]
        },
        blog: [
            { title: 'Building a K-Map Solver: A Deep Dive into Digital Logic with JS', date: 'Sep 15, 2025', excerpt: 'How I translated the principles of Karnaugh maps into a functional web-based tool for digital logic simplification...', link: 'blogs/blog4.html' },
            { title: 'Supercapacitors vs. Batteries: My Findings for Autonomous Robots', date: 'Aug 28, 2025', excerpt: 'A summary of my research comparing the practical application of supercapacitors and traditional batteries in robotics.', link: 'blogs/blog5.html' },
            { title: 'From Blinking an LED to Building a Bot: An Arduino Journey', date: 'Jul 10, 2025', excerpt: 'Chronicling the learning curve and key takeaways from building my first autonomous robots with the Arduino platform.', link: 'blogs/blog6.html' },
            { title: 'Chronos OS: Phase 1 Development Report - A Time-Aware, Visually-Semantic Operating System', date: 'Jan 19, 2026', excerpt: 'This report details the initial development phase of Chronos, an experimental operating system built from scratch in Rust...', link: 'docs/chronos.pdf' },
            { title: 'Chronos OS: Phase 2 Report - The Nervous System: Interrupts, Input, and Concurrency', date: 'Jan 19, 2026', excerpt: 'This report details Phase 2 of the Chronos Operating System development. The primary objective was to transition the kernel from a passive loop to a reactive system capable of handling asynchronous hardware events...', link: 'docs/chronos-1.pdf' },
            { title: 'Chronos OS: Phase 3 Report - Visual Output: Framebuffers, Text Rendering, and Safety', date: 'Jan 19, 2026', excerpt: 'Phase 3 of the Chronos OS development focused on transforming the kernel’s output capabilities. Moving beyond simple color bars, we implemented a full bitmap text rendering engine to display alphanumeric data...', link: 'docs/chronos-2.pdf' },
            { title: 'Chronos OS: Phase 4 Report - Dynamic Memory Management: The Heap', date: 'Jan 19, 2026', excerpt: 'Phase 4 of the Chronos OS project addresses the limitations of static memory allocation. To support complex OS features such as dynamic task lists, window buffers, and string manipulation, the kernel requires a Heap...', link: 'docs/chronos-3.pdf' },
            { title: 'Chronos OS: Phase 5 Report - The Time-Aware Cooperative Scheduler', date: 'Jan 19, 2026', excerpt: 'Phase 5 marks the transition of Chronos from a kernel loop to a managed operating system. We implemented a Cooperative Scheduler capable of managing a dynamic list of tasks...', link: 'docs/chronos-4.pdf' },
            { title: 'Chronos OS: Phase 6 Report - The Interactive Shell and Command Processing', date: 'Jan 19, 2026', excerpt: 'Phase 6 represents a pivotal shift in the user experience of Chronos OS. Previously, the system was a passive observer of hardware states. In this phase, we implemented a full-duplex Command Line Interface (CLI)...', link: 'docs/chronos-5.pdf' },
            { title: 'Chronos OS: Phase 7 Report - Data Persistence: The Ramdisk Filesystem', date: 'Jan 19, 2026', excerpt: 'Phase 7 of Chronos OS addresses the requirement for data persistence. To transition toward a daily-usable system, the OS must be able to retrieve data from non-volatile storage...', link: 'docs/chronos-6.pdf' },
            { title: 'Chronos OS: Phase 8 Report - Hardware Isolation: GDT, TSS, and Ring 3 Transition', date: 'Jan 20, 2026', excerpt: 'Phase 8 represents the transition from a monolithic kernel model to a secure, multi-level architecture. To protect the kernel from user-space errors, x86 64 privilege level isolation was implemented...', link: 'docs/chronos-7.pdf' },
            { title: 'Chronos OS: Phase 9 Report - Virtual Memory Management and Page Table Manipulation', date: 'Jan 20, 2026', excerpt: 'Following the successful transition to Ring 3 (User Mode) in Phase 8, Chronos OS encountered the x86 64 Memory Protection unit. User Mode code is forbidden from accessing pages marked as "Supervisor Only."...', link: 'docs/chronos-8.pdf' },
            { title: 'Chronos OS: Phase 10 Report - System Calls: Bridging User and Kernel Space', date: 'Jan 20, 2026', excerpt: 'With memory protection (Phase 9) fully active, user-space applications are isolated in a sandbox, unable to access hardware or kernel memory directly...', link: 'docs/chronos-9.pdf' },
            { title: 'Chronos OS: Phases 11 & 12 Report - Hardware Enumeration and Network Driver Implementation', date: 'Jan 20, 2026', excerpt: 'To transform Chronos into a daily-usable operating system, network connectivity is required. Phases 11 and 12 focused on discovering hardware via the PCI bus and implementing a device driver for the Realtek RTL8139 Fast Ethernet controller...', link: 'docs/chronos-10.pdf' },
            { title: 'Chronos OS: Phases 13 & 14 Detailed Report - Implementation of the TCP/IP Protocol Stack (ARP, IPv4, DHCP)', date: 'Jan 20, 2026', excerpt: 'Following the initialization of the RTL8139 network controller, Chronos OS required a software abstraction layer to interpret raw binary signals...', link: 'docs/chronos-11.pdf' },
            { title: 'Chronos OS: Phase 15 & 16 Detailed Report - Bidirectional IP Networking and Secure User Mode Application Execution', date: 'Jan 20, 2026', excerpt: 'This report covers the implementation of bidirectional IP networking and secure user mode application execution in Chronos OS...', link: 'docs/chronos-13.pdf' },
            { title: 'Chronos OS: Phase 17 Report - The PS/2 Mouse Driver and Non-Destructive Rendering', date: 'Jan 21, 2026', excerpt: 'Phase 17 focuses on the implementation of a pointing device to facilitate a Graphical User Interface (GUI)...', link: 'docs/chronos-14.pdf' },
            { title: 'Chronos OS: Phases 18 & 19 Report - The Compositor, Double Buffering, and Window Management', date: 'Jan 21, 2026', excerpt: 'Following the implementation of the PS/2 Mouse Driver, Chronos OS faced significant rendering artifacts and concurrency limitations...', link: 'docs/chronos-15.pdf' },
            { title: 'Chronos OS: Phases 20 & 21 Report - Window Interaction, Collision Detection, and CMOS RTC', date: 'Jan 21, 2026', excerpt: 'With the graphical compositor established, the next stage of development focused on transforming the passive display into an interactive environment...', link: 'docs/chronos-16.pdf' },
            { title: 'Chronos OS: Phase 22 Report - Multi-Tasking GUI and Window Decoration', date: 'Jan 21, 2026', excerpt: 'Phase 22 transformed the graphical interface from a single-context display into a multiwindow desktop environment...', link: 'docs/chronos-17.pdf' },
            { title: 'Chronos OS: Phases 23 & 24 Report - Writable Virtual Filesystem and System Monitoring', date: 'Jan 22, 2026', excerpt: 'Phases 23 and 24 focused on transforming Chronos from a static runtime into a dynamic environment...', link: 'docs/chronos-18.pdf' },
            { title: 'Chronos OS: Phases 25-28 Report - Persistent Storage, Filesystems, and Disk-Based Execution', date: 'Jan 23, 2026', excerpt: 'Following the implementation of the system monitor, development shifted towards achieving data persistence...', link: 'docs/chronos-19.pdf' },
            { title: 'Chronos OS: Phases 29-32 Report - Multitasking Architecture, Window Management, and System Integration', date: 'Jan 25, 2026', excerpt: 'The primary objective was to transition from a single-threaded kernel to a concurrent, data-aware...', link: 'docs/chronos-20.pdf' },

            { title: 'Designing an Autonomous Multi-UAV System', date: 'Dec 15, 2025', excerpt: 'Exploring the challenges and solutions in building a ground control station for two autonomous drones, including telemetry, communication, and SITL testing.', link: 'blogs/blog1.html' },
            { title: 'Machine Learning for Crop Disease Detection', date: 'Nov 10, 2025', excerpt: 'How I trained a model on 87k+ images to achieve 95% accuracy in identifying plant diseases, using Python and ML libraries.', link: 'blogs/blog2.html' },
            { title: 'Prototyping a DC-DC Boost Converter', date: 'Oct 5, 2025', excerpt: 'From simulation in LTspice to physical prototyping: the process of designing and testing a boost converter for embedded applications.', link: 'blogs/blog3.html' }
        ],
        skills: [
            { name: 'Web Development (JS, React, Next.js)', level: 95 },
            { name: 'Circuit Design & Simulation', level: 90 },
            { name: 'Embedded Systems (Arduino/C, Raspberry Pi)', level: 85 },
            { name: 'Python & Machine Learning', level: 80 },
            { name: 'CAD & Mechanical Design (Solidworks)', level: 75 },
            { name: 'Version Control (Git)', level: 90 },
            { name: 'UAV & Robotics (SITL, Gazebo, ROS)', level: 85 },
            { name: 'Electronics (Power Electronics, Analog Design)', level: 80 },
            { name: 'Networking & Communication', level: 75 },
            { name: 'MATLAB & Simulink', level: 70 },
            { name: 'MathWorks', level: 70 }
        ],
        timeline: [
            { year: '2022', event: 'Class 10th Boards', institution: 'Asian International School', link: 'https://www.aisedu.org/' },
            { year: '2022', event: 'Video-Editing for Freewd', institution: 'YouTube Channel', link: 'https://www.youtube.com/@Freewdd' },
            { year: '2024', event: 'Class 12th Boards', institution: 'Haryana Vidya Mandir', link: 'https://hariyanavidyamandir.org/' },
            { year: '2024', event: 'Self-Taught Web Development & Arduino' },
            { year: '2024', event: 'Started B.E. in Electrical Engineering', institution: 'Jadavpur University', link: 'https://jadavpuruniversity.in/' },
            { year: '2025', event: 'Foundation in Data Science', institution: 'IIT Madras (Online)', link: 'https://www.iitm.ac.in/' },
            { year: '2025', event: 'Hackathon Ambassador for HackHazards’ 2025', institution: 'Namespace community', link: 'https://hackhazards.namespacecomm.in/' },
            { year: '2025', event: 'Def Space Intern', institution: 'BSERC', link: 'https://bserc.org/' }
        ]
    };

    const techIconMap = {
        'HTML5': '<i class="devicon-html5-plain colored" title="HTML5"></i>',
        'CSS3': '<i class="devicon-css3-plain colored" title="CSS3"></i>',
        'JS': '<i class="devicon-javascript-plain colored" title="JavaScript"></i>',
        'TypeScript': '<i class="devicon-typescript-plain colored" title="TypeScript"></i>',
        'React': '<i class="devicon-react-original colored" title="React"></i>',
        'Next.js': '<i class="devicon-nextjs-original-wordmark colored" title="Next.js"></i>',
        'Python': '<i class="devicon-python-plain colored" title="Python"></i>',
        'Arduino': '<i class="devicon-arduino-plain colored" title="Arduino"></i>',
        'Solidworks': '<img src="https://cdn.worldvectorlogo.com/logos/solidworks.svg" class="inline-tech-svg" alt="SolidWorks" title="SolidWorks">',
        'LTspice': '<img src="https://cdn.simpleicons.org/ltspice/900028" class="inline-tech-svg ltspice-icon" alt="LTspice" title="LTspice">',
        'Rust': '<i class="devicon-rust-plain colored" title="Rust"></i>',
        'SITL': '<i class="devicon-linux-plain colored" title="SITL"></i>',
        'Gazebo': '<i class="devicon-linux-plain colored" title="Gazebo"></i>',
        'ROS': '<i class="devicon-linux-plain colored" title="ROS"></i>',
        'ML': '<i class="devicon-python-plain colored" title="Machine Learning"></i>',
        'Electronics': '<i class="devicon-arduino-plain colored" title="Electronics"></i>'
    };

    function renderProjects(category, gridElement) {
        gridElement.innerHTML = '';
        data.projects[category].forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            const techs = project.tech.split(',').map(t => t.trim());
            const techFooterHTML = `<div class="tech-footer">${techs.map(tech => techIconMap[tech] || '').join('')}</div>`;

            card.innerHTML = `<img src="${project.image}" alt="${project.name}"><div class="card-content"><h3>${project.name}</h3><p>${project.description.substring(0, 100)}...</p></div>${techFooterHTML}`;
            card.addEventListener('click', () => openModal(project));
            gridElement.appendChild(card);
        });
    }

    function renderResearch(category, gridElement) { gridElement.innerHTML = ''; data.research[category].forEach(item => { const card = document.createElement('div'); card.className = 'research-card'; card.innerHTML = `<h3>${item.title}</h3><p>${item.abstract}</p>`; gridElement.appendChild(card); }); }
    function renderBlog() { blogGrid.innerHTML = ''; data.blog.forEach(post => { const card = document.createElement('div'); card.className = 'blog-card'; card.innerHTML = `<span class="blog-date">${post.date}</span><h3>${post.title}</h3><p>${post.excerpt}</p><a href="${post.link}" target="_blank">Read Full Post</a>`; blogGrid.appendChild(card); }); }
    function renderSkills() { skillsGrid.innerHTML = ''; data.skills.forEach(skill => { const item = document.createElement('div'); item.className = 'skill-item'; item.innerHTML = `<p>${skill.name}</p><div class="skill-bar"><div class="skill-fill" data-level="${skill.level}"></div></div>`; skillsGrid.appendChild(item); }); }
    function renderTimeline() { timelineContainer.innerHTML = ''; data.timeline.forEach(event => { const item = document.createElement('div'); item.className = 'timeline-item'; let institutionLink = event.institution ? (event.link ? `<a href="${event.link}" target="_blank">${event.institution}</a>` : event.institution) : ''; item.innerHTML = `<div class="timeline-content"><strong>${event.year}</strong><p>${event.event}</p><p>${institutionLink}</p></div>`; timelineContainer.appendChild(item); }); }
    
    function openModal(project) {
        document.getElementById('modal-title').textContent = project.name;
        document.getElementById('modal-image').src = project.image;
        document.getElementById('modal-description').textContent = project.description;
        document.getElementById('modal-link').href = 'https://github.com/Acerider75';
        modal.style.display = 'flex';
        gsap.fromTo('.modal-content', { opacity: 0, scale: 0.9, y: -20 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' });
    }

    modalClose.addEventListener('click', () => { gsap.to('.modal-content', { opacity: 0, scale: 0.9, y: -20, duration: 0.4, ease: 'power3.in', onComplete: () => { modal.style.display = 'none'; } }); });

    function initAnimations() {
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        heroTl.from('.hero-content h1', { opacity: 0, y: 20, duration: 0.8 }).from('.hero-content p', { opacity: 0, y: 20, duration: 0.6 }, "-=0.5").from('.signal-wave', { opacity: 0, y: 20, duration: 0.6 }, "-=0.4").from('.cta-button', { opacity: 0, y: 20, duration: 0.5, stagger: 0.2 }, "-=0.4");
        gsap.utils.toArray('.project-card, .research-card, .blog-card').forEach(card => { gsap.to(card, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' } }); });
        gsap.to('.tech-grid i, .tech-svg-icon', { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '#tech-stack', start: 'top 80%', toggleActions: 'play none none none' } });
        gsap.utils.toArray('.skill-item').forEach(item => { gsap.to(item, { opacity: 1, y: 0, duration: 0.6, scrollTrigger: { trigger: item, start: 'top 90%', onEnter: () => { gsap.to(item.querySelector('.skill-fill'), { width: `${item.querySelector('.skill-fill').dataset.level}%`, duration: 1.5, ease: 'power2.out' }); }, once: true } }); });
        gsap.utils.toArray('.timeline-item').forEach(item => { gsap.to(item, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' } }); });
    }

    function initGlowEffect() { document.addEventListener('mousemove', e => { document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`); document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`); }); document.body.addEventListener('mouseenter', () => { gsap.to(mouseGlow, { opacity: 1, duration: 0.4 }); }); document.body.addEventListener('mouseleave', () => { gsap.to(mouseGlow, { opacity: 0, duration: 0.4 }); }); }

    // --- INITIALIZE PAGE ---
    renderProjects('ongoing', ongoingProjectsGrid);
    renderProjects('completed', completedProjectsGrid);
    renderProjects('side', sideProjectsGrid);
    renderResearch('ongoing', ongoingResearchGrid);
    renderResearch('completed', completedResearchGrid);
    renderBlog();
    renderSkills();
    renderTimeline();
    initAnimations();
    initGlowEffect();

    document.querySelector('#hero .cta-button').addEventListener('click', e => { e.preventDefault(); document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' }); });
});
