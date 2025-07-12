import React from 'react';
import { motion } from 'framer-motion';
import { FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';
import { SiBluesky } from 'react-icons/si';
import { Zap } from 'lucide-react';

const SocialMediaBar = ({ variant = 'hero', className = '' }) => {
  const socialLinks = [
    {
      name: 'X',
      icon: FaTwitter,
      url: 'https://x.com/arthrokinetix',
      color: '#000000',
      hoverColor: '#1DA1F2'
    },
    {
      name: 'Farcaster',
      icon: Zap, // Using Zap as placeholder for Farcaster
      url: 'https://warpcast.com/arthrokinetix',
      color: '#8B5CF6',
      hoverColor: '#7C3AED'
    },
    {
      name: 'Bluesky',
      icon: SiBluesky,
      url: 'https://bsky.app/profile/arthrokinetix.bsky.social',
      color: '#00A8E8',
      hoverColor: '#0086BA'
    },
    {
      name: 'Instagram',
      icon: FaInstagram,
      url: 'https://instagram.com/arthrokinetix',
      color: '#E4405F',
      hoverColor: '#C13584'
    },
    {
      name: 'GitHub',
      icon: FaGithub,
      url: 'https://github.com/arthrokinetix',
      color: '#333333',
      hoverColor: '#24292E'
    }
  ];

  if (variant === 'hero') {
    return (
      <motion.div 
        className={`flex items-center gap-4 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <span className="text-sm font-medium text-white/80">Follow us:</span>
        <div className="flex gap-3">
          {socialLinks.map((social, index) => {
            const IconComponent = social.icon;
            return (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                title={social.name}
              >
                <IconComponent 
                  className="w-5 h-5 text-white transition-all duration-300 group-hover:scale-110"
                  style={{ 
                    filter: 'brightness(1.2)',
                    transition: 'all 0.3s ease'
                  }}
                />
              </motion.a>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // Compact variant for other uses
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socialLinks.map((social) => {
        const IconComponent = social.icon;
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all duration-300 group"
            title={social.name}
          >
            <IconComponent 
              className="w-4 h-4 text-gray-700 transition-all duration-300 group-hover:scale-110"
              style={{ color: social.color }}
            />
          </a>
        );
      })}
    </div>
  );
};

export default SocialMediaBar;