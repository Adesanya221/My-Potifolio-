
import { useState, useEffect } from "react";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { AboutSidebar } from "@/components/AboutSidebar";
import { NewsWidget } from "@/components/NewsWidget";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // About me content
  const aboutContent = "I specialize in building modern web applications using React, TypeScript, and other cutting-edge technologies.";
  const tools = ["React", "TypeScript", "Node.js", "Tailwind CSS"];

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="bento-grid">
        {/* Welcome Card */}
        <div className="bento-card col-span-2">
          <h2 className="text-sm text-gray-400 mb-2">welcome</h2>
          <h1 className="text-4xl font-bold mb-4">
            Hi, I'm <span className="text-blue-400">Your Name</span>
          </h1>
          <p className="text-gray-300 text-lg">
            A software developer with a passion for creating beautiful and functional web experiences
          </p>
        </div>

        {/* About Card */}
        <div className="bento-card row-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">About me</h2>
            <AboutSidebar 
              title="About me"
              content={aboutContent}
              tools={tools}
            />
          </div>
          <p className="text-gray-300 text-lg">
            Click the info icon to learn more about me and my skills.
          </p>
        </div>

        {/* Time Card */}
        <div className="bento-card">
          <h2 className="text-lg text-gray-400 mb-4">Current Time</h2>
          <p className="text-3xl font-bold font-mono">
            {time.toLocaleTimeString()}
          </p>
          <Separator className="my-4 bg-gray-700" />
          <NewsWidget />
        </div>

        {/* Contact Card */}
        <div className="bento-card">
          <h2 className="text-2xl font-bold mb-6">Let's Connect</h2>
          <div className="flex space-x-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
               className="p-3 rounded-full hover:bg-gray-800 transition-colors">
              <Github className="w-8 h-8" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
               className="p-3 rounded-full hover:bg-gray-800 transition-colors">
              <Linkedin className="w-8 h-8" />
            </a>
            <a href="mailto:your@email.com"
               className="p-3 rounded-full hover:bg-gray-800 transition-colors">
              <Mail className="w-8 h-8" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
               className="p-3 rounded-full hover:bg-gray-800 transition-colors">
              <Twitter className="w-8 h-8" />
            </a>
          </div>
        </div>

        {/* Projects Card */}
        <div className="bento-card col-span-2">
          <h2 className="text-2xl font-bold mb-6">Featured Projects</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-card-hover rounded-lg">
              <h3 className="text-xl font-bold mb-3">Project 1</h3>
              <p className="text-gray-300">Description of your amazing project</p>
            </div>
            <div className="p-6 bg-card-hover rounded-lg">
              <h3 className="text-xl font-bold mb-3">Project 2</h3>
              <p className="text-gray-300">Description of another cool project</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
