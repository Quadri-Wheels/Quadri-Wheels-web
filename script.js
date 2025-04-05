// Dark mode functionality
const darkModeToggle = document.getElementById('darkModeToggle');
const darkIcon = darkModeToggle ? darkModeToggle.querySelector('.dark-icon') : null;
const lightIcon = darkModeToggle ? darkModeToggle.querySelector('.light-icon') : null;

// Check for saved dark mode preference
const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'true') {
    document.body.classList.add('dark-mode');
    if (darkIcon && lightIcon) {
        darkIcon.style.display = 'none';
        lightIcon.style.display = 'block';
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Update icons with smooth transition
    if (darkIcon && lightIcon) {
        if (isDarkMode) {
            darkIcon.style.display = 'none';
            lightIcon.style.display = 'block';
        } else {
            darkIcon.style.display = 'block';
            lightIcon.style.display = 'none';
        }
    }
    
    // Save preference
    localStorage.setItem('darkMode', isDarkMode);
    
    // Update 3D car color if it exists
    if (material) {
        material.color.setHex(isDarkMode ? 0x00ff00 : 0xff0000);
    }
}

// Language switching functionality
const langToggle = document.getElementById('langToggle');
const langText = langToggle ? langToggle.querySelector('.lang-text') : null;
const langIcon = langToggle ? langToggle.querySelector('.fa-globe') : null;

// Check for saved language preference
const savedLanguage = localStorage.getItem('language');
if (savedLanguage === 'ar') {
    document.body.classList.add('ar');
    document.body.dir = 'rtl';
    document.documentElement.lang = 'ar';
    if (langText) {
        langText.textContent = 'English';
    }
    if (langIcon) {
        langIcon.classList.add('rtl');
    }
}

function toggleLanguage() {
    const isArabic = document.body.classList.toggle('ar');
    document.body.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
    
    // Update language icon
    if (langIcon) {
        langIcon.classList.toggle('rtl');
    }
    
    // Update all translatable elements
    document.querySelectorAll('[data-en]').forEach(element => {
        const translatedText = element.getAttribute(`data-${isArabic ? 'ar' : 'en'}`);
        if (translatedText) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                const placeholder = element.getAttribute(`data-${isArabic ? 'ar' : 'en'}-placeholder`);
                if (placeholder) {
                    element.placeholder = placeholder;
                }
            } else {
                element.textContent = translatedText;
            }
        }
    });
    
    // Save language preference
    localStorage.setItem('language', isArabic ? 'ar' : 'en');
}

// Add event listeners
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
}

if (langToggle) {
    langToggle.addEventListener('click', toggleLanguage);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Handle contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        // Here you would typically send the form data to a server
        // For now, we'll just show a success message
        alert(currentLang === 'en' 
            ? 'Thank you for your message! We will get back to you soon.'
            : 'شكراً لرسالتك! سنتواصل معك قريباً.');
        this.reset();
    });
}

// Add scroll-based animations
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
});

// Initialize sections with opacity 0 and slight offset
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// YouTube API Integration
const CHANNEL_ID = 'YOUR_CHANNEL_ID'; // Replace with your actual channel ID
const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key

// Three.js Animation
let scene, camera, renderer, car;
let material;

function init3DAnimation() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true });
    
    const container = document.getElementById('threeDContainer');
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Create car model
    const carGeometry = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.BoxGeometry(4, 1.5, 2);
    material = new THREE.MeshBasicMaterial({ 
        color: document.body.classList.contains('dark-mode') ? 0x00ff00 : 0xff0000,
        wireframe: true 
    });
    const body = new THREE.Mesh(bodyGeometry, material);
    carGeometry.add(body);
    
    // Roof
    const roofGeometry = new THREE.BoxGeometry(2.5, 1, 2);
    const roof = new THREE.Mesh(roofGeometry, material);
    roof.position.y = 1.25;
    roof.position.x = -0.5;
    carGeometry.add(roof);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    const wheelMaterial = new THREE.MeshBasicMaterial({ 
        color: document.body.classList.contains('dark-mode') ? 0x00ff00 : 0xff0000,
        wireframe: true 
    });
    
    // Front wheels
    const frontLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontLeftWheel.rotation.z = Math.PI / 2;
    frontLeftWheel.position.set(1.5, -0.75, 1);
    carGeometry.add(frontLeftWheel);
    
    const frontRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontRightWheel.rotation.z = Math.PI / 2;
    frontRightWheel.position.set(1.5, -0.75, -1);
    carGeometry.add(frontRightWheel);
    
    // Rear wheels
    const rearLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    rearLeftWheel.rotation.z = Math.PI / 2;
    rearLeftWheel.position.set(-1.5, -0.75, 1);
    carGeometry.add(rearLeftWheel);
    
    const rearRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    rearRightWheel.rotation.z = Math.PI / 2;
    rearRightWheel.position.set(-1.5, -0.75, -1);
    carGeometry.add(rearRightWheel);
    
    car = carGeometry;
    scene.add(car);
    
    camera.position.z = 8;
    camera.position.y = 2;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        car.rotation.y += 0.005;
        car.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
        car.position.y = Math.sin(Date.now() * 0.002) * 0.2;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const container = document.getElementById('threeDContainer');
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}

// Loading Screen functionality
function updateLoadingProgress(progress) {
    const progressBar = document.querySelector('.progress-bar');
    const percentage = document.querySelector('.loading-percentage');
    const loadingMessage = document.querySelector('.loading-message');
    
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (percentage) percentage.textContent = `${Math.round(progress)}%`;
    
    // Update loading message based on progress
    if (loadingMessage) {
        const isArabic = document.body.classList.contains('ar');
        let message = '';
        if (progress < 30) {
            message = isArabic ? 'جاري تشغيل المحركات...' : 'Starting Engines...';
        } else if (progress < 60) {
            message = isArabic ? 'تجهيز المركبة...' : 'Preparing Vehicle...';
        } else if (progress < 90) {
            message = isArabic ? 'الاستعداد للانطلاق...' : 'Ready to Roll...';
        } else {
            message = isArabic ? 'انطلق!' : 'Let\'s Go!';
        }
        loadingMessage.textContent = message;
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = 'visible';
        }, 500);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Prevent scrolling during loading
    document.body.style.overflow = 'hidden';
    
    // Simulate loading progress with faster timing
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 30; // Increased increment
        if (progress > 100) progress = 100;
        updateLoadingProgress(progress);
        
        if (progress === 100) {
            clearInterval(loadingInterval);
            setTimeout(hideLoadingScreen, 200); // Reduced delay
        }
    }, 100); // Reduced interval

    // Load saved preferences
    const savedTheme = localStorage.getItem('theme');
    const savedLanguage = localStorage.getItem('language');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    if (savedLanguage === 'ar') {
        document.body.classList.add('ar');
        document.body.dir = 'rtl';
        document.documentElement.lang = 'ar';
    }
    
    // Initialize components
    init3DAnimation();
    
    // Set YouTube stats
    const subscriberCount = document.getElementById('subscriberCount');
    const videoCount = document.getElementById('videoCount');
    
    if (subscriberCount) subscriberCount.textContent = '268';
    if (videoCount) videoCount.textContent = '44';
    
    // Add scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });
});

// Add this to your existing styles.css file
const style = document.createElement('style');
style.textContent = `
    .theme-toggle {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: transparent;
        border: 2px solid currentColor;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .theme-toggle:hover {
        transform: scale(1.1);
    }

    .theme-toggle i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.2rem;
        transition: all 0.3s ease;
    }

    .dark-icon {
        display: block;
    }

    .light-icon {
        display: none;
    }

    .lang-toggle {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border-radius: 20px;
        background: transparent;
        border: 2px solid currentColor;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .lang-toggle:hover {
        transform: scale(1.05);
    }

    .lang-toggle .fa-globe {
        transition: transform 0.3s ease;
    }

    .lang-toggle .fa-globe.rtl {
        transform: scaleX(-1);
    }

    .lang-text {
        font-weight: 500;
    }

    body.dark-mode .theme-toggle,
    body.dark-mode .lang-toggle {
        border-color: var(--text-color-dark);
        color: var(--text-color-dark);
    }

    /* Developer Credit Styles */
    .developer-credit {
        margin-top: 10px;
        text-align: center;
        font-size: 0.9rem;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }

    .developer-credit:hover {
        opacity: 1;
    }

    .developer-link {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: inherit;
        text-decoration: none;
        padding: 4px 8px;
        border-radius: 15px;
        transition: all 0.3s ease;
    }

    .developer-link:hover {
        background: rgba(255, 0, 0, 0.1);
        transform: translateY(-2px);
    }

    .developer-link i {
        color: #ff0000;
        font-size: 1.1rem;
    }

    body.dark-mode .developer-link:hover {
        background: rgba(255, 0, 0, 0.2);
    }

    .loading-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    }

    .loading-screen.fade-out {
        opacity: 0;
    }

    .loading-content {
        text-align: center;
        color: #fff;
        max-width: 400px;
        width: 90%;
    }

    .loading-logo-container {
        position: relative;
        margin-bottom: 40px;
    }

    .loading-logo {
        width: 150px;
        height: 150px;
        margin: 0 auto 20px;
        border-radius: 50%;
        overflow: hidden;
        border: 3px solid #ff0000;
        animation: glow 1s ease-in-out infinite;
        position: relative;
        z-index: 2;
    }

    .loading-logo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .loading-progress {
        width: 80%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        margin: 0 auto;
        overflow: hidden;
    }

    .progress-bar {
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, #ff0000, #ff3333);
        transition: width 0.5s ease;
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
    }

    .loading-animation {
        position: relative;
        height: 60px;
        margin: 30px 0;
        overflow: hidden;
    }

    .road {
        position: absolute;
        bottom: 20px;
        left: 0;
        width: 100%;
        height: 2px;
        background: rgba(255, 255, 255, 0.2);
    }

    .line {
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, #fff, transparent);
        animation: roadMove 0.75s linear infinite;
    }

    .loading-car {
        position: absolute;
        left: 50%;
        bottom: 25px;
        transform: translateX(-50%);
        font-size: 2rem;
        color: #ff0000;
        text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
        animation: carBounce 0.4s ease-in-out infinite;
    }

    .loading-text {
        font-size: 1.2rem;
        font-weight: 500;
    }

    .loading-message {
        display: block;
        margin-bottom: 10px;
        min-height: 1.5em;
        transition: all 0.3s ease;
    }

    .loading-percentage {
        font-size: 1rem;
        opacity: 0.8;
    }

    @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.5); }
        50% { box-shadow: 0 0 40px rgba(255, 0, 0, 0.8); }
    }

    @keyframes roadMove {
        0% { left: -100%; }
        100% { left: 100%; }
    }

    @keyframes carBounce {
        0%, 100% { transform: translateX(-50%) translateY(0); }
        50% { transform: translateX(-50%) translateY(-5px); }
    }

    body.dark-mode .loading-screen {
        background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
    }

    .ar .loading-car {
        transform: translateX(-50%) scaleX(-1);
    }

    .ar .loading-car.bounce {
        animation: carBounceRTL 0.6s ease-in-out infinite;
    }

    @keyframes carBounceRTL {
        0%, 100% { transform: translateX(-50%) scaleX(-1) translateY(0); }
        50% { transform: translateX(-50%) scaleX(-1) translateY(-5px); }
    }
`;
document.head.appendChild(style); 