// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// DOM Elements
const mainNav = document.getElementById('mainNav');
const mainHeading = document.getElementById('mainHeading');
const subHeading = document.getElementById('subHeading');
const projectsContainer = document.getElementById('projectsContainer');
const videosContainer = document.getElementById('videosContainer');

// Default site settings
const DEFAULT_SETTINGS = {
    mainHeading: 'Welcome to TCG.corp',
    subHeading: 'Innovative Solutions for Tomorrow',
    scrollAnimation: 'fade',
    nodeAnimation: 'pulse',
    menuItems: [
        { text: 'Home', link: 'index.html' },
        { text: 'Projects', link: '#projects' },
        { text: 'Videos', link: '#videos' }
    ]
};

// Load site settings
function loadSiteSettings() {
    try {
        // Get settings from localStorage or use defaults
        const settings = JSON.parse(localStorage.getItem('siteSettings')) || DEFAULT_SETTINGS;

        // Update headings
        mainHeading.textContent = settings.mainHeading;
        subHeading.textContent = settings.subHeading;

        // Update menu
        renderMenu(settings.menuItems);

        // Apply animations
        document.body.classList.add(`scroll-animation-${settings.scrollAnimation}`);
        document.body.classList.add(`node-animation-${settings.nodeAnimation}`);
    } catch (error) {
        console.error('Error loading site settings:', error);
        // Fallback to defaults if there's an error
        mainHeading.textContent = DEFAULT_SETTINGS.mainHeading;
        subHeading.textContent = DEFAULT_SETTINGS.subHeading;
        renderMenu(DEFAULT_SETTINGS.menuItems);
        document.body.classList.add(`scroll-animation-${DEFAULT_SETTINGS.scrollAnimation}`);
        document.body.classList.add(`node-animation-${DEFAULT_SETTINGS.nodeAnimation}`);
    }
}

// Render menu items
function renderMenu(items) {
    mainNav.innerHTML = items.map(item => `
        <a href="${item.link}">${item.text}</a>
    `).join('');
}

// Load projects
function loadProjects() {
    try {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        projectsContainer.innerHTML = projects.map(project => `
            <div class="project-card">
                <div class="project-image">
                    <img src="${project.image || 'placeholder.jpg'}" alt="${project.title}">
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    ${project.code ? `
                        <div class="code-snippet">
                            <span class="language">${project.codeLanguage}</span>
                            <pre>${project.code}</pre>
                        </div>
                    ` : ''}
                    ${project.link ? `
                        <a href="${project.link}" class="project-link" target="_blank">View Project</a>
                    ` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsContainer.innerHTML = '<p>No projects available.</p>';
    }
}

// Load videos
function loadVideos() {
    try {
        const videos = JSON.parse(localStorage.getItem('videos')) || [];
        videosContainer.innerHTML = videos.map(video => `
            <div class="video-card">
                <div class="video-thumbnail">
                    <img src="${video.thumbnail || 'placeholder.jpg'}" alt="${video.title}">
                    <div class="play-button">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="video-content">
                    <h3>${video.title}</h3>
                    <p>${video.description}</p>
                    <a href="${video.link}" class="video-link" target="_blank">Watch Video</a>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading videos:', error);
        videosContainer.innerHTML = '<p>No videos available.</p>';
    }
}

// Create node connections between projects
function createNodeConnections() {
    const projectGrid = document.querySelector('.projects-grid');
    if (!projectGrid) return;
    
    const cards = projectGrid.querySelectorAll('.project-card');
    if (cards.length < 2) return;
    
    // Remove existing connections
    const existingConnections = document.querySelectorAll('.node-connection');
    existingConnections.forEach(connection => connection.remove());
    
    // Create new connections
    for (let i = 0; i < cards.length - 1; i++) {
        const connection = document.createElement('div');
        connection.className = 'node-connection';
        
        const startPoint = {
            x: cards[i].offsetLeft + cards[i].offsetWidth / 2,
            y: cards[i].offsetTop + cards[i].offsetHeight
        };
        
        const endPoint = {
            x: cards[i + 1].offsetLeft + cards[i + 1].offsetWidth / 2,
            y: cards[i + 1].offsetTop
        };
        
        const length = Math.sqrt(
            Math.pow(endPoint.x - startPoint.x, 2) +
            Math.pow(endPoint.y - startPoint.y, 2)
        );
        
        const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
        
        connection.style.width = `${length}px`;
        connection.style.left = `${startPoint.x}px`;
        connection.style.top = `${startPoint.y}px`;
        connection.style.transform = `rotate(${angle}rad)`;
        
        projectGrid.appendChild(connection);
    }
}

// Animate elements on scroll
function initScrollAnimations() {
    // Animate project cards
    gsap.utils.toArray('.project-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top bottom-=100",
                toggleActions: "play none none reverse"
            },
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Animate video cards
    gsap.utils.toArray('.video-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top bottom-=100",
                toggleActions: "play none none reverse"
            },
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Animate headings
    gsap.utils.toArray('h2').forEach(heading => {
        gsap.from(heading, {
            scrollTrigger: {
                trigger: heading,
                start: "top bottom-=100",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });
}

// Intersection Observer for animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.project-card, .video-card').forEach(element => {
    observer.observe(element);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSiteSettings();
    loadProjects();
    loadVideos();
    createNodeConnections();
    initScrollAnimations();
    
    // Update node connections on window resize
    window.addEventListener('resize', () => {
        const connections = document.querySelectorAll('.node-connection');
        connections.forEach(connection => connection.remove());
        createNodeConnections();
    });
}); 