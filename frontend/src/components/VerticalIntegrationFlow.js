import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Palette, Link2 } from 'lucide-react';

const VerticalIntegrationFlow = ({ className = '' }) => {
  const steps = [
    {
      icon: BookOpen,
      title: 'Medical Literature',
      description: 'Evidence-based content from peer-reviewed sources',
      color: 'from-primary to-secondary',
      iconColor: 'text-white'
    },
    {
      icon: Brain,
      title: 'Emotional Analysis',
      description: 'AI-powered detection of emotional undertones',
      color: 'from-secondary to-healing',
      iconColor: 'text-white'
    },
    {
      icon: Palette,
      title: 'Art Generation',
      description: 'Unique algorithmic artwork creation',
      color: 'from-healing to-innovation',
      iconColor: 'text-white'
    },
    {
      icon: Link2,
      title: 'Blockchain',
      description: 'Permanent digital provenance and ownership',
      color: 'from-innovation to-accent',
      iconColor: 'text-white'
    }
  ];

  return (
    <div className={`py-12 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h3 className="text-2xl font-bold text-primary mb-4">
          Revolutionary Vertical Integration
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          The first platform to seamlessly connect medical education with emotional AI 
          and algorithmic art, creating a complete ecosystem from knowledge to creation.
        </p>
      </motion.div>

      <div className="relative max-w-4xl mx-auto">
        {/* Connection Lines */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-healing to-accent transform -translate-y-1/2 hidden md:block" />
        
        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-24 h-24 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                >
                  <IconComponent className={`w-12 h-12 ${step.iconColor}`} />
                </motion.div>
                
                <h4 className="font-semibold text-lg text-primary mb-2">
                  {step.title}
                </h4>
                
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
                
                {/* Arrow (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 -right-4 text-4xl text-gray-400">
                    →
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="text-center mt-12"
      >
        <p className="text-sm text-gray-500 italic">
          Founded by a Board-Certified Orthopedic Surgeon pioneering the intersection 
          of medical education and computational creativity
        </p>
      </motion.div>
    </div>
  );
};

export default VerticalIntegrationFlow;