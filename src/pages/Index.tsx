
import { motion } from "framer-motion";
import { Brain, BookOpen, ChartBar, UserCheck, BrainCircuit, BookText, ArrowRight } from "lucide-react";
import { useState } from "react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const services = [
  {
    icon: <ChartBar className="h-8 w-8" />,
    title: "Predictive Analytics",
    description: "Harness the power of AI to forecast trends and make data-driven decisions"
  },
  {
    icon: <UserCheck className="h-8 w-8" />,
    title: "Personalized Recommendations",
    description: "Get tailored insights based on your unique needs and preferences"
  },
  {
    icon: <BrainCircuit className="h-8 w-8" />,
    title: "AI-powered Insights",
    description: "Unlock deeper understanding through advanced artificial intelligence"
  },
  {
    icon: <BookText className="h-8 w-8" />,
    title: "Vedic Knowledge Consultations",
    description: "Access ancient wisdom through modern technology"
  }
];

const testimonials = [
  {
    quote: "Vedic AI has transformed how we approach decision-making in our organization.",
    author: "Sarah Johnson",
    position: "CEO, TechVision Inc"
  },
  {
    quote: "The perfect blend of ancient wisdom and modern technology. Absolutely revolutionary!",
    author: "Dr. Michael Chen",
    position: "Research Director, Future Labs"
  },
  {
    quote: "Their predictive analytics have given us invaluable insights for our strategic planning.",
    author: "Raj Patel",
    position: "Strategy Head, Global Solutions"
  }
];

const Index = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 -z-10" />
        <motion.div
          initial="initial"
          animate="animate"
          className="container max-w-4xl text-center space-y-8"
        >
          <motion.div {...fadeIn} className="space-y-4">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
              Welcome to the Future of Wisdom
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Harness the Power of AI with Ancient Wisdom
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Combining the best of modern technology and timeless knowledge to empower your decisions.
            </p>
          </motion.div>
          
          <motion.div {...fadeIn} className="flex justify-center gap-4">
            <button 
              onClick={() => document.getElementById('services')?.scrollIntoView()}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setChatOpen(true)}
              className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg font-medium hover:bg-white/90 transition-all"
            >
              Try Demo
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-4 bg-white">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container max-w-4xl text-center space-y-12"
        >
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-secondary/10 text-secondary rounded-full">
              Our Vision
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Where Technology Meets Tradition
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center p-6 rounded-2xl bg-muted space-y-4 flex-1"
            >
              <Brain className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold">Modern AI</h3>
              <p className="text-muted-foreground">Cutting-edge artificial intelligence algorithms</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center p-6 rounded-2xl bg-muted space-y-4 flex-1"
            >
              <BookOpen className="h-12 w-12 text-accent" />
              <h3 className="text-xl font-semibold">Ancient Wisdom</h3>
              <p className="text-muted-foreground">Timeless Vedic knowledge and principles</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-muted/50">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container max-w-6xl space-y-12"
        >
          <div className="text-center space-y-4">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-accent/10 text-accent rounded-full">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Comprehensive Solutions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-4"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container max-w-4xl space-y-12"
        >
          <div className="text-center space-y-4">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-2xl bg-muted space-y-4"
              >
                <p className="text-lg italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-secondary text-secondary-foreground">
        <div className="container max-w-6xl space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Vedic AI</h3>
              <p className="text-secondary-foreground/80">
                Ancient wisdom meets modern technology
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">About</a>
              <a href="#" className="hover:text-primary transition-colors">Services</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-secondary-foreground/20 pt-8 text-center text-secondary-foreground/60">
            <p>&copy; {new Date().getFullYear()} Vedic AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chat Widget (Placeholder) */}
      {chatOpen && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold">Vedic AI Chat</h3>
            <button 
              onClick={() => setChatOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 p-4 bg-gray-50">
            <p className="text-center text-gray-500 mt-4">
              Chat functionality coming soon...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
