"use client";

import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import Hero from '@/components/hero';
import Skills from '@/components/skills';
import Projects from '@/components/projects';
import Experience from '@/components/experience';
import Contact from '@/components/contact';
import Footer from '@/components/footer';
import ThreeBackground from '@/components/three-background';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

// Define section type for better type safety
type SectionType = 'home' | 'skills' | 'experience' | 'projects' | 'contact';

export default function Home() {
  const [currentSection, setCurrentSection] = useState<SectionType>('home');
  const [showScrollButton, setShowScrollButton] = useState<boolean>(true);
  
  // Function to determine next section based on current
  const getNextSection = (current: SectionType): SectionType | null => {
    const sections: SectionType[] = ['home', 'skills', 'experience', 'projects', 'contact'];
    const currentIndex = sections.indexOf(current);
    return sections[currentIndex + 1] || null;
  };
  
  // Scroll to section function
  const scrollToSection = (sectionId: SectionType): void => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Update current section based on scroll position
  useEffect(() => {
    const handleScroll = (): void => {
      const sections: SectionType[] = ['home', 'skills', 'experience', 'projects', 'contact'];
      
      let lastSectionReached = false;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (!element) continue;
        
        const rect = element.getBoundingClientRect();
        const topInView = rect.top <= window.innerHeight / 3;
        const bottomInView = rect.bottom > window.innerHeight / 3;
        
        if (topInView && bottomInView) {
          setCurrentSection(section);
          
          // Check if we are at the last section (contact)
          if (section === 'contact') {
            lastSectionReached = true;
          }
          break; // Add break to prevent multiple sections being detected
        }
      }
      
      setShowScrollButton(!lastSectionReached);
    };
    
    // Call handleScroll once on component mount to set initial state
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Navigation arrow component with proper type annotations
  const NavigationArrow = ({ sectionId }: { sectionId: SectionType }): JSX.Element | null => {
    const nextSection = getNextSection(sectionId);
    
    if (!nextSection || !showScrollButton) return null;
    
    return (
      <motion.div 
        className="fixed bottom-6 right-6 cursor-pointer z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        onClick={() => scrollToSection(nextSection)}
        aria-label={`Scroll to ${nextSection} section`}
      >
        <div className="flex flex-col items-center">
          <div className="rounded-full p-2 bg-background/80 backdrop-blur-sm border border-border hover:bg-primary/10 transition-colors">
            <ChevronDown className="h-5 w-5" />
          </div>
        </div>
      </motion.div>
    );
  };
  
  return (
    <main className="relative min-h-screen">
      <ThreeBackground />
      <div className="relative z-10">
        <Navbar />
        
        <section id="home" className="min-h-[80vh] flex items-center relative px-4 sm:px-10">
          <Hero />
        </section>
        
        <section id="skills" className="py-16 min-h-[80vh] flex items-center relative px-4 sm:px-10">
          <Skills />
        </section>
        
        <section id="experience" className="py-16 bg-background/50 backdrop-blur-sm min-h-[80vh] flex items-center relative px-4 sm:px-10">
          <Experience />
        </section>
        
        <section id="projects" className="py-16 min-h-[80vh] flex items-center relative px-4 sm:px-10">
          <Projects />
        </section>
        
        <section id="contact" className="py-16 bg-background/50 backdrop-blur-sm min-h-[80vh] flex items-center relative px-4 sm:px-10">
          <Contact />
        </section>
        
        <Footer />
      </div>
      <NavigationArrow sectionId={currentSection} />
    </main>
  );
}