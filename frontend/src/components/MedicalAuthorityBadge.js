import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle, Stethoscope } from 'lucide-react';

const MedicalAuthorityBadge = ({ variant = 'hero', className = '' }) => {
  if (variant === 'hero') {
    return (
      <motion.div
        className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-healing to-secondary rounded-full flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              Founded by Board-Certified Orthopedic Surgeon
            </h3>
            <p className="text-sm text-blue-100">
              Bridging Clinical Excellence with Algorithmic Innovation
            </p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <CheckCircle className="w-4 h-4 text-healing" />
            <span className="text-xs text-white/90">Evidence-Based</span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Stethoscope className="w-4 h-4 text-healing" />
            <span className="text-xs text-white/90">Physician-Reviewed</span>
          </motion.div>
        </div>
        
        <div className="mt-4 text-xs text-blue-100/80">
          Specializing in Orthopedic Sports Medicine & Regenerative Medicine
        </div>
      </motion.div>
    );
  }

  // Compact variant
  return (
    <div className={`flex items-center justify-center gap-3 bg-primary/5 rounded-lg px-4 py-2 ${className}`}>
      <Award className="w-5 h-5 text-primary" />
      <div className="text-center">
        <p className="text-sm font-semibold text-primary">
          Evidence-Based Medical Platform
        </p>
      </div>
    </div>
  );
};

export default MedicalAuthorityBadge;