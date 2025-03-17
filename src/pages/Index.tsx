import { useState, useEffect, useRef } from "react";
import { Github, Linkedin, Mail, Twitter, Clock, DollarSign, Menu, X, MapPin, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { AboutSidebar } from "@/components/AboutSidebar";
import { NewsWidget } from "@/components/NewsWidget";
import { Separator } from "@/components/ui/separator";
import { saveContactMessage } from '@/firebase/services';

const Index = () => {
  const [time, setTime] = useState(new Date());
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Welcome animation state
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomePhase, setWelcomePhase] = useState(0);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Add this state at the top of your component
  const [bgImageLoaded, setBgImageLoaded] = useState(false);

  // Add this state to your component
  const [isDownloading, setIsDownloading] = useState(false);

  // Add this to your component's state
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const skillsCarouselRef = useRef<HTMLDivElement>(null);

  // Add this to your component
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ loading: false, success: null, error: null });

  // Simulate loading progress
  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, []);
    
    return () => clearInterval(loadingInterval);
  }, []);

  // Update the welcome animation sequence
  useEffect(() => {
    // Phase 0: Initial delay
    const phase0 = setTimeout(() => {
      setWelcomePhase(1); // Show "Welcome"
    }, 500);
    
    // Phase 1: Show "Welcome"
    const phase1 = setTimeout(() => {
      setWelcomePhase(2); // Show "to my world"
    }, 1500);
    
    // Phase 2: Show full message and start loading
    const phase2 = setTimeout(() => {
      setWelcomePhase(3); // Start loading animation
    }, 3000);
    
    // Phase 3: Show enter button when loading is complete
    const phase3 = setTimeout(() => {
      setShowEnterButton(true); // Show enter button
    }, 6000);
    
    return () => {
      clearTimeout(phase0);
      clearTimeout(phase1);
      clearTimeout(phase2);
      clearTimeout(phase3);
    };
  }, []);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch exchange rate
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        setLoading(true);
        // Using a free API for exchange rates
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        // NGN to USD rate (inverted to get USD to NGN)
        const usdToNgn = data.rates.NGN;
        setExchangeRate(usdToNgn);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
        setExchangeRate(1500); // Fallback value if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRate();
    // Refresh exchange rate every hour
    const rateTimer = setInterval(fetchExchangeRate, 3600000);
    return () => clearInterval(rateTimer);
  }, []);

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "resume", "portfolio", "contact"];
      const scrollPosition = window.scrollY + 100; // Offset for better detection

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop && 
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth"
      });
    }
  };

  // About me content
  const aboutContent = "I specialize in building modern web applications using React, TypeScript, and other cutting-edge technologies.";
  const tools = ["React", "TypeScript", "Node.js", "Tailwind CSS"];

  // Format time with seconds
  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  // Format date
  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Close mobile menu when a section is selected
  const handleMobileNavigation = (sectionId: string) => {
    scrollToSection(sectionId);
    setMobileMenuOpen(false);
  };

  // Function to handle entering the site
  const enterSite = () => {
    // Add a quick fade-out animation
    document.querySelector('.welcome-screen')?.classList.add('fade-out');
    
    // Then hide the welcome screen
    setTimeout(() => {
      setShowWelcome(false);
    }, 500);
  };

  // Add this function inside your component
  const handleBgImageLoad = () => {
    setBgImageLoaded(true);
  };

  // Update the handleDownload function
  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsDownloading(true);
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isIOS || isSafari) {
      e.preventDefault();
      window.open('/assets/profile/cv.pdf', '_blank');
    }
    
    // Reset the downloading state after a short delay
    setTimeout(() => {
      setIsDownloading(false);
    }, 1500);
  };

  // Add this function to your component
  const handleDownloadError = () => {
    alert("Sorry, there was an issue downloading the CV. Please try again later or contact me directly.");
  };

  // Add this projects array to your component
  const projects = [
    {
      id: 1,
      title: "CITIZEN APP ",
      description: "A webapplication that gives live updates of the current situation in the country.",
      image: "/assets/projects/project-1.jpg",
      url: "https://citizenapp-1acc6.web.app", // Replace with your actual project URL
      technologies: ["React", "Node.js"]
    },
    {
      id: 2,
      title: "Social Media Dashboard",
      description: "Analytics and management for social accounts",
      image: "/assets/projects/project-2.jpg",
      url: "https://github.com/Adesanya221/project2", // Replace with your actual project URL
      technologies: ["React", "Chart.js"]
    },
    {
      id: 3,
      title: "Task Management App",
      description: "Organize and track your daily tasks",
      image: "/assets/projects/project-3.jpg",
      url: "https://github.com/Adesanya221/project3", // Replace with your actual project URL
      technologies: ["React", "Firebase"]
    },
    {
      id: 4,
      title: "Weather Forecast App",
      description: "Real-time weather updates and forecasts",
      image: "/assets/projects/project-4.jpg",
      url: "https://github.com/Adesanya221/project4", // Replace with your actual project URL
      technologies: ["JavaScript", "Weather API"]
    },
    {
      id: 5,
      title: "Recipe Finder",
      description: "Discover and save your favorite recipes",
      image: "/assets/projects/project-5.jpg",
      url: "https://github.com/Adesanya221/project5", // Replace with your actual project URL
      technologies: ["React", "Food API"]
    },
    {
      id: 6,
      title: "Portfolio Website",
      description: "Showcase your work with this template",
      image: "/assets/projects/project-6.jpg",
      url: "https://github.com/Adesanya221/portfolio", // Replace with your actual project URL
      technologies: ["React", "TypeScript"]
    }
  ];

  // Update your skillsData array with the correct icon paths
  const skillsData = [
    {
      name: "React",
      level: 85,
      color: "#61DAFB",
      icon: "/assets/logos/react-logo.svg",
      description: "Building modern, responsive user interfaces with React and its ecosystem",
      experience: "3+ years",
      projects: 12
    },
    {
      name: "TypeScript",
      level: 90,
      color: "#3178C6",
      icon: "/assets/logos/typescript-logo.svg",
      description: "Developing type-safe applications with enhanced developer experience",
      experience: "2+ years",
      projects: 8
    },
    {
      name: "Node.js",
      level: 75,
      color: "#339933",
      icon: "/assets/logos/nodejs-logo.svg",
      description: "Creating server-side applications and RESTful APIs",
      experience: "2+ years",
      projects: 6
    },
    {
      name: "Tailwind CSS",
      level: 80,
      color: "#06B6D4",
      icon: "/assets/logos/tailwind-logo.svg",
      description: "Crafting beautiful, responsive designs with utility-first CSS",
      experience: "1+ year",
      projects: 10
    },
    {
      name: "JavaScript",
      level: 88,
      color: "#F7DF1E",
      icon: "/assets/logos/javascript-logo.svg",
      description: "Building interactive web applications with vanilla JavaScript",
      experience: "4+ years",
      projects: 15
    },
    {
      name: "HTML/CSS",
      level: 92,
      color: "#E34F26",
      icon: "/assets/logos/html-logo.svg",
      description: "Creating semantic, accessible, and responsive layouts",
      experience: "4+ years",
      projects: 20
    }
  ];

  // Add these functions to your component
  const nextSkill = () => {
    setActiveSkillIndex((prev) => (prev + 1) % skillsData.length);
  };

  const prevSkill = () => {
    setActiveSkillIndex((prev) => (prev - 1 + skillsData.length) % skillsData.length);
  };

  // Add this effect for auto-rotation (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      nextSkill();
    }, 5000); // Change skill every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Add these helper functions to your component
  const generateChartPath = (points: number, level: number) => {
    let path = `M 0,${60 - (level * 0.6)}`;
    
    for (let i = 1; i < points; i++) {
      // Create a slightly random path that trends upward
      const x = (i / (points - 1)) * 300;
      const randomFactor = Math.sin(i * 0.5) * 15;
      const y = 60 - ((level - 20 + (i / points) * 20 + randomFactor) * 0.6);
      path += ` L ${x},${y}`;
    }
    
    return path;
  };

  const generateAreaPath = (points: number, level: number) => {
    // Start with the line path
    let path = generateChartPath(points, level);
    
    // Add the bottom part to close the shape
    path += ` L 300,60 L 0,60 Z`;
    
    return path;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: null, error: null });
    
    try {
      const result = await saveContactMessage(formData);
      
      if (result.success) {
        setFormStatus({ loading: false, success: "Message sent successfully!", error: null });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setFormStatus({ loading: false, success: null, error: "Failed to send message. Please try again." });
      }
    } catch (error) {
      setFormStatus({ loading: false, success: null, error: "An unexpected error occurred." });
    }
  };

  if (showWelcome) {
    return (
      <div className="welcome-screen">
        {/* Particle Background */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="particle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 2}px`,
                height: `${Math.random() * 10 + 2}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`
              }}
            />
          ))}
        </div>
        
        <div className="welcome-content">
          <div className={`welcome-text ${welcomePhase >= 1 ? 'active' : ''}`}>
            Welcome
          </div>
          <div className={`welcome-subtext ${welcomePhase >= 2 ? 'active' : ''}`}>
            to my world
          </div>
          
          {/* Loading Animation */}
          <div className={`loading-container ${welcomePhase >= 3 ? 'active' : ''}`}>
            <div className="loading-text">Loading portfolio...</div>
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className="loading-percentage">{Math.round(loadingProgress)}%</div>
            
            {/* Loading Icons */}
            <div className="loading-icons">
              <div className="loading-icon html">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.08 0L4.632 5.11H19.343L19.099 7.694H4.388L3.94 12.803H18.651L18.162 17.391L12.005 19.01L5.848 17.391L6.215 13.85H1.106L0 22.01L12.005 24L24 22.01L20.154 0H5.08Z" fill="#E44D26"/>
                </svg>
              </div>
              <div className="loading-icon css">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.192 0L3.734 5.11H19.877L19.619 7.694H3.476L3.018 12.803H19.161L18.642 17.391L11.999 19.01L5.356 17.391L5.739 13.85H0.63L0 22.01L11.999 24L24 22.01L20.154 0H4.192Z" fill="#1572B6"/>
                </svg>
              </div>
              <div className="loading-icon js">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0H24V24H0V0Z" fill="#F7DF1E"/>
                  <path d="M6.421 20.177L8.337 19.018C8.743 19.744 9.113 20.354 9.977 20.354C10.804 20.354 11.322 20.015 11.322 18.82V11.089H13.692V18.858C13.692 21.323 12.223 22.442 10.058 22.442C8.115 22.442 6.977 21.474 6.421 20.177Z" fill="black"/>
                  <path d="M14.912 19.906L16.828 18.82C17.382 19.744 18.097 20.392 19.209 20.392C20.147 20.392 20.775 19.906 20.775 19.259C20.775 18.482 20.147 18.183 19.061 17.685L18.468 17.422C16.791 16.673 15.688 15.738 15.688 13.829C15.688 12.072 16.976 10.747 19.098 10.747C20.664 10.747 21.787 11.282 22.601 12.709L20.775 13.868C20.332 13.05 19.87 12.748 19.098 12.748C18.319 12.748 17.845 13.235 17.845 13.868C17.845 14.644 18.319 14.944 19.32 15.404L19.913 15.664C21.861 16.561 22.964 17.459 22.964 19.409C22.964 21.512 21.342 22.442 19.246 22.442C17.197 22.442 15.725 21.587 14.912 19.906Z" fill="black"/>
                </svg>
              </div>
              <div className="loading-icon react">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 13.992C13.0979 13.992 13.992 13.0979 13.992 12C13.992 10.9021 13.0979 10.008 12 10.008C10.9021 10.008 10.008 10.9021 10.008 12C10.008 13.0979 10.9021 13.992 12 13.992Z" fill="#61DAFB"/>
                  <path d="M12 16.992C18.075 16.992 23.004 14.742 23.004 12C23.004 9.258 18.075 7.008 12 7.008C5.925 7.008 0.996 9.258 0.996 12C0.996 14.742 5.925 16.992 12 16.992Z" stroke="#61DAFB" strokeWidth="1.5"/>
                  <path d="M8.634 14.496C11.67 19.586 15.459 22.496 17.496 21.258C19.533 20.02 18.87 15.359 15.834 10.27C12.798 5.18 9.009 2.27 6.972 3.508C4.935 4.746 5.598 9.407 8.634 14.496Z" stroke="#61DAFB" strokeWidth="1.5"/>
                  <path d="M8.634 9.504C5.598 14.593 4.935 19.254 6.972 20.492C9.009 21.73 12.798 18.82 15.834 13.73C18.87 8.641 19.533 3.98 17.496 2.742C15.459 1.504 11.67 4.414 8.634 9.504Z" stroke="#61DAFB" strokeWidth="1.5"/>
                </svg>
              </div>
            </div>
          </div>
          
          {showEnterButton && (
            <button 
              onClick={enterSite}
              className="enter-button"
              aria-label="Enter site"
            >
              <span>Enter Portfolio</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="enter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#121212] text-white main-content ${bgImageLoaded ? 'loaded' : ''}`}>
      {/* Navigation Menu */}
      <nav className="fixed top-0 left-0 w-full bg-[#1a1a1a] z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold text-blue-400">ADESANYA IGNATIUS</div>
          
          {/* Dynamic Clock and Exchange Rate */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="font-mono">{formattedTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="font-mono">
                {loading ? 'Loading...' : `₦${exchangeRate?.toLocaleString()}`}
              </span>
            </div>
          </div>
          
          <ul className="hidden md:flex space-x-8">
            {[
              { id: "home", label: "Home" },
              { id: "about", label: "About" },
              { id: "resume", label: "Resume" },
              { id: "portfolio", label: "Portfolio" },
              { id: "contact", label: "Contact" }
            ].map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => scrollToSection(item.id)}
                  className={`nav-item relative py-2 px-1 transition-all duration-300 ${
                    activeSection === item.id ? "text-blue-400 active" : "text-white hover:text-blue-300"
                  }`}
                >
                  {item.label}
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 transform transition-transform duration-300 ${
                      activeSection === item.id ? "scale-x-100" : "scale-x-0 hover:scale-x-100"
                    } origin-left`}
                  ></span>
                  <span className="nav-glow absolute inset-0 bg-blue-400/0 rounded-md filter blur-md transition-opacity duration-300 pointer-events-none"></span>
                </button>
              </li>
            ))}
          </ul>
          
          <button 
            className="md:hidden p-2 rounded-md hover:bg-[#252525] transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-blue-400" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu with Animation */}
      <div 
        className={`md:hidden fixed top-[calc(4rem+36px)] left-0 w-full bg-[#1a1a1a] z-40 transform transition-all duration-500 ease-in-out ${
          mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <ul className="flex flex-col p-4">
          {[
            { id: "home", label: "Home" },
            { id: "about", label: "About" },
            { id: "resume", label: "Resume" },
            { id: "portfolio", label: "Portfolio" },
            { id: "contact", label: "Contact" }
          ].map((item, index) => (
            <li 
              key={item.id} 
              className="py-2 transform transition-all duration-300"
              style={{ 
                opacity: mobileMenuOpen ? 1 : 0,
                transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                transitionDelay: `${index * 75}ms`
              }}
            >
              <button 
                onClick={() => handleMobileNavigation(item.id)}
                className={`mobile-nav-item relative w-full text-left px-4 py-3 transition-all duration-300 ${
                  activeSection === item.id ? "text-blue-400 bg-[#252525]" : "text-white"
                } rounded-md hover:bg-[#252525]/50`}
              >
                <span className="relative z-10 flex items-center">
                  {getNavIcon(item.id)}
                  <span className="ml-3">{item.label}</span>
                </span>
                <span 
                  className={`absolute left-0 top-0 h-full bg-blue-500/10 rounded-md transition-all duration-300 ${
                    activeSection === item.id ? "w-full" : "w-0"
                  }`}
                ></span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Clock and Exchange Rate (visible only on mobile) */}
      <div className="md:hidden fixed top-16 left-0 w-full bg-[#252525] z-40 px-6 py-3 flex justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="font-mono text-sm">{formattedTime}</span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-400" />
          <span className="font-mono text-sm">
            {loading ? 'Loading...' : `₦${exchangeRate?.toLocaleString()}`}
          </span>
        </div>
      </div>

      {/* Hero Section with Background Image */}
      <section id="home" className="min-h-screen relative flex items-center pt-24 md:pt-16 px-6 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] to-[#1e293b] z-0"></div>
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <img 
            src="/assets/background/background1.jpg" 
            alt="Background" 
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${bgImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={handleBgImageLoad}
            onError={() => console.log("Background image failed to load")}
          />
        </div>
        
        {/* Content (on top of background) */}
        <div className="max-w-6xl mx-auto w-full relative z-20">
          <h2 className="text-sm md:text-base text-gray-300 mb-2 animate-fadeIn">Hello,</h2>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slideInFromLeft">
            I'm <span className="text-blue-400">ADESANYA IGNATIUS.</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-8 animate-slideInFromRight">
            Software Developer
          </p>
          
          {/* Dynamic Date Display */}
          <div className="bg-[#252525]/80 backdrop-blur-sm inline-block px-4 py-2 rounded-lg mb-8 animate-fadeIn animation-delay-300">
            <p className="text-gray-300">{formattedDate}</p>
          </div>
          
          <div className="animate-fadeIn animation-delay-500">
            <a href="#about" 
               onClick={(e) => {
                 e.preventDefault();
                 scrollToSection("about");
               }}
               className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition-colors inline-flex items-center group">
              More About Me
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Live Exchange Rate Card */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#252525] p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <DollarSign className="w-6 h-6 mr-2 text-green-400" />
              Live Exchange Rate
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1a1a1a] p-4 rounded-lg">
                <p className="text-gray-400 mb-1">USD to NGN</p>
                <p className="text-3xl font-bold font-mono">
                  {loading ? 'Loading...' : `₦${exchangeRate?.toLocaleString()}`}
                </p>
                <p className="text-xs text-gray-500 mt-2">Last updated: {time.toLocaleTimeString()}</p>
              </div>
              
              <div className="bg-[#1a1a1a] p-4 rounded-lg">
                <p className="text-gray-400 mb-1">NGN to USD</p>
                <p className="text-3xl font-bold font-mono">
                  {loading ? 'Loading...' : `$${(1/exchangeRate!).toFixed(6)}`}
                </p>
                <p className="text-xs text-gray-500 mt-2">Per Naira</p>
              </div>
              
              <div className="bg-[#1a1a1a] p-4 rounded-lg">
                <p className="text-gray-400 mb-1">Current Time</p>
                <p className="text-3xl font-bold font-mono">{formattedTime}</p>
                <p className="text-xs text-gray-500 mt-2">{formattedDate}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 mt-4">
              * Exchange rates are updated hourly. Rates shown are for informational purposes only.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-sm md:text-base text-gray-400 mb-2">About</h2>
            <h1 className="text-3xl md:text-4xl font-bold">Just a little introduction...</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="md:col-span-1">
              <div className="relative">
                <img 
                  src="/assets/profile/main.jpg" 
                  alt="ADESANYA IGNATIUS" 
                  className="w-full h-auto rounded-xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-blue-500 text-white px-6 py-2 rounded-lg">
                  Software Developer
                </div>
              </div>
            </div>
            
            <div className="md:col-span-1 space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Profile</h3>
                <ul className="space-y-2">
                  <li><strong>Fullname:</strong> ADESANYA OLUWAFISAYOMI IGNATIUS</li>
                  <li><strong>Job:</strong> Software Developer</li>
                  <li><strong>Email:</strong> Adesanyafisayo112@email.com</li>
                </ul>
              </div>
              
              {/* Skills Carousel */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Skills</h3>
                
                <div className="skills-carousel-container relative">
                  {/* Navigation Arrows */}
                  <button 
                    onClick={prevSkill}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#252525] p-2 rounded-full hover:bg-blue-500 transition-colors"
                    aria-label="Previous skill"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <button 
                    onClick={nextSkill}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#252525] p-2 rounded-full hover:bg-blue-500 transition-colors"
                    aria-label="Next skill"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  {/* Skills Carousel */}
                  <div 
                    ref={skillsCarouselRef}
                    className="skills-carousel overflow-hidden rounded-xl bg-[#1E1E1E] p-6"
                  >
                    <div 
                      className="skills-track flex transition-transform duration-500 ease-out"
                      style={{ transform: `translateX(-${activeSkillIndex * 100}%)` }}
                    >
                      {skillsData.map((skill, index) => (
                        <div key={index} className="skill-card w-full flex-shrink-0 flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div 
                                className="w-12 h-12 rounded-full flex items-center justify-center mr-3"
                                style={{ backgroundColor: `${skill.color}20` }}
                              >
                                <img 
                                  src={skill.icon} 
                                  alt={`${skill.name} logo`} 
                                  className="w-8 h-8 object-contain" 
                                  onError={(e) => {
                                    // Fallback if image fails to load
                                    e.currentTarget.src = "/placeholder.svg";
                                  }}
                                />
                              </div>
                              <h4 className="text-xl font-bold">{skill.name}</h4>
                            </div>
                            <div className="text-2xl font-bold" style={{ color: skill.color }}>{skill.level}%</div>
                          </div>
                          
                          {/* Skill Graph */}
                          <div className="skill-graph mb-4">
                            <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                              <div 
                                className="h-2 rounded-full transition-all duration-1000 ease-out"
                                style={{ 
                                  width: `${skill.level}%`, 
                                  backgroundColor: skill.color,
                                  '--skill-level': `${skill.level}%`
                                } as React.CSSProperties}
                              ></div>
                            </div>
                            
                            {/* Skill Metrics */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="bg-[#252525] p-3 rounded-lg">
                                <div className="text-gray-400 text-sm">Experience</div>
                                <div className="text-lg font-medium">{skill.experience}</div>
                              </div>
                              <div className="bg-[#252525] p-3 rounded-lg">
                                <div className="text-gray-400 text-sm">Projects</div>
                                <div className="text-lg font-medium">{skill.projects}</div>
                              </div>
                            </div>
                            
                            <p className="text-gray-300">{skill.description}</p>
                          </div>
                          
                          {/* Skill Timeline (resembles crypto chart) */}
                          <div className="skill-timeline mt-auto h-16 relative">
                            <svg className="w-full h-full" viewBox="0 0 300 60">
                              <defs>
                                <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor={skill.color} stopOpacity="0.5" />
                                  <stop offset="100%" stopColor={skill.color} stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              
                              {/* Generate a random-looking chart path */}
                              <path 
                                d={generateChartPath(60, skill.level)}
                                fill="none"
                                stroke={skill.color}
                                strokeWidth="2"
                              />
                              
                              {/* Area under the chart */}
                              <path 
                                d={generateAreaPath(60, skill.level)}
                                fill={`url(#gradient-${index})`}
                              />
                            </svg>
                            
                            {/* Time indicators */}
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>1y ago</span>
                              <span>6m ago</span>
                              <span>Now</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Skill Indicators */}
                  <div className="flex justify-center mt-4 space-x-2">
                    {skillsData.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveSkillIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === activeSkillIndex 
                            ? 'bg-blue-500 w-6' 
                            : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                        aria-label={`Go to skill ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex space-x-4">
                <a href="#contact" 
                   onClick={(e) => {
                     e.preventDefault();
                     scrollToSection("contact");
                   }}
                   className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition-colors">
                  Hire Me
                </a>
                <a 
                  href="/assets/profile/cv.pdf" 
                  download="ADESANYA_IGNATIUS_CV.pdf"
                  onClick={handleDownload}
                  className={`border border-white hover:bg-white hover:text-black px-6 py-3 rounded-md transition-colors flex items-center relative download-btn ${isDownloading ? 'downloading' : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {isDownloading ? (
                    <>
                      Downloading...
                      <div className="download-spinner ml-2"></div>
                    </>
                  ) : (
                    <>
                      Download CV
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </>
                  )}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-sm md:text-base text-gray-400 mb-2">Portfolio</h2>
            <h1 className="text-3xl md:text-4xl font-bold">Check Out Some of My Projects.</h1>
            <p className="text-gray-300 mt-4">Take a peek at a few of my projects and see the magic happen!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="project-card group">
                <a 
                  href={project.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block h-full"
                  aria-label={`View ${project.title} project`}
                >
                  <div className="relative h-full overflow-hidden rounded-xl">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="project-image w-full h-full object-cover"
                    />
                    <div className="project-overlay absolute inset-0 flex flex-col justify-end p-6">
                      <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                      <p className="text-gray-300 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">{tech}</span>
                        ))}
                      </div>
                      <div className="view-project flex items-center text-blue-400">
                        <span>View Project</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-sm md:text-base text-gray-400 mb-2">Contact</h2>
            <h1 className="text-3xl md:text-4xl font-bold">I'd Love To Hear From You.</h1>
            <p className="text-gray-300 mt-4">Let's connect! Feel free to reach out with any inquiries.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-[#252525] p-8 rounded-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-[#333] border-0 rounded-md p-3 text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#333] border-0 rounded-md p-3 text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Your Email"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full bg-[#333] border-0 rounded-md p-3 text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Subject"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                  <textarea 
                    id="message" 
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full bg-[#333] border-0 rounded-md p-3 text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Message"
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={formStatus.loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition-colors w-full"
                >
                  {formStatus.loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
            
            <div className="space-y-8">
              <div className="bg-[#252525] p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Where to find me</h3>
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-5 h-5 text-blue-400 mr-2" />
                  <p>Lagos, Nigeria</p>
                </div>
              </div>
              
              <div className="bg-[#252525] p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Email Me At</h3>
                <div className="flex items-center text-gray-300">
                  <Mail className="w-5 h-5 text-blue-400 mr-2" />
                  <p>adesanyafisayo112@email.com</p>
                </div>
              </div>
              
              <div className="bg-[#252525] p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Call Me At</h3>
                <div className="flex items-center text-gray-300">
                  <Phone className="w-5 h-5 text-blue-400 mr-2" />
                  <p>Mobile: (+234) 8138784682</p>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <a href="https://github.com/Adesanya221" target="_blank" rel="noopener noreferrer" 
                  className="p-4 bg-[#252525] rounded-full hover:bg-blue-500 transition-colors">
                  <Github className="w-6 h-6" />
                </a>
                <a href="https://www.linkedin.com/in/oluwafisayomi-adesanya-09452922b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer"
                  className="p-4 bg-[#252525] rounded-full hover:bg-blue-500 transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="mailto:adesanyafisayo112@email.com"
                  className="p-4 bg-[#252525] rounded-full hover:bg-blue-500 transition-colors">
                  <Mail className="w-6 h-6" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                  className="p-4 bg-[#252525] rounded-full hover:bg-blue-500 transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-6 px-6 text-center text-gray-400">
        <p>© Copyright {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

// Helper function to get icons for navigation items
const getNavIcon = (id: string) => {
  switch (id) {
    case 'home':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>;
    case 'about':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>;
    case 'resume':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>;
    case 'portfolio':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>;
    case 'contact':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>;
    default:
      return null;
  }
};

export default Index;
