import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Heart, Shield, FileText, ExternalLink, Zap, Palette, Cloud } from 'lucide-react';
import { FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';
import { SiBluesky } from 'react-icons/si';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'X',
      icon: FaTwitter,
      url: 'https://x.com/arthrokinetix',
      color: '#000000'
    },
    {
      name: 'Farcaster',
      icon: Zap, // Using Zap as placeholder for Farcaster
      url: 'https://warpcast.com/arthrokinetix',
      color: '#8B5CF6'
    },
    {
      name: 'Bluesky',
      icon: SiBluesky,
      url: 'https://bsky.app/profile/arthrokinetix.bsky.social',
      color: '#00A8E8'
    },
    {
      name: 'Instagram',
      icon: FaInstagram,
      url: 'https://instagram.com/arthrokinetix',
      color: '#E4405F'
    },
    {
      name: 'GitHub',
      icon: FaGithub,
      url: 'https://github.com/arthrokinetix',
      color: '#333333'
    }
  ];

  const platformLinks = [
    { name: 'Medical Articles', path: '/articles' },
    { name: 'Art Gallery', path: '/gallery' },
    { name: 'About Platform', path: '/about' },
    { name: 'Admin Portal', path: '/admin' }
  ];

  const legalLinks = [
    { 
      name: 'Privacy Policy', 
      path: '/privacy',
      icon: Shield,
      description: 'How we protect your data'
    },
    { 
      name: 'Terms of Service', 
      path: '/terms',
      icon: FileText,
      description: 'Platform usage terms'
    }
  ];

  const contactInfo = {
    label: 'Contact & Support',
    email: 'arthrokinetix@arthrokinetix.com',
    description: 'Platform help, questions, and support'
  };

  return (
    <footer className="bg-gradient-to-br from-primary-dark via-primary to-secondary text-white mt-16">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">A</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Arthrokinetix</h3>
                    <p className="text-xs text-blue-100">Medical × Art × AI</p>
                  </div>
                </div>
                
                <p className="text-blue-100 mb-6 leading-relaxed">
                  Founded by Board-Certified Orthopedic Surgeon. Where evidence-based medical 
                  expertise meets algorithmic art generation, transforming clinical knowledge 
                  into meaningful digital artworks through emotional AI analysis.
                </p>
                
                {/* Social Links */}
                <div className="flex gap-4">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <motion.a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="w-10 h-10 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                        title={social.name}
                      >
                        <IconComponent className="w-5 h-5" />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Platform Links */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h4 className="font-semibold text-lg mb-6 flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Platform
                </h4>
                <ul className="space-y-3">
                  {platformLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-blue-100 hover:text-white transition-colors duration-200 flex items-center group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Legal & Compliance */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h4 className="font-semibold text-lg mb-6 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Legal & Compliance
                </h4>
                <div className="space-y-4">
                  {legalLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <div key={link.name}>
                        <Link
                          to={link.path}
                          className="text-blue-100 hover:text-white transition-colors duration-200 flex items-center group"
                        >
                          <IconComponent className="w-4 h-4 mr-3 flex-shrink-0" />
                          <div>
                            <div className="font-medium group-hover:translate-x-1 transition-transform duration-200">
                              {link.name}
                            </div>
                            <div className="text-xs text-blue-200 opacity-75">
                              {link.description}
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>

                {/* Medical Disclaimer */}
                <div className="mt-6 p-4 bg-red-900/20 rounded-lg border border-red-400/30">
                  <div className="flex items-start">
                    <Heart className="w-4 h-4 text-red-300 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-red-100">
                      <p className="font-medium mb-1">Medical Disclaimer</p>
                      <p>Content is for educational purposes only. Always consult healthcare professionals for medical decisions.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h4 className="font-semibold text-lg mb-6 flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact & Support
                </h4>
                <div>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-blue-100 hover:text-white transition-colors duration-200 group block"
                  >
                    <div className="font-medium text-sm group-hover:translate-x-1 transition-transform duration-200 mb-2">
                      {contactInfo.description}
                    </div>
                    <div className="text-xs font-mono bg-white/10 px-3 py-2 rounded inline-block">
                      {contactInfo.email}
                    </div>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Technology Stack & Credits */}
        <div className="border-t border-blue-400/30 py-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <div className="mb-4">
              <h5 className="text-sm font-medium text-blue-100 mb-2">Powered by Advanced Technology</h5>
              <div className="flex justify-center items-center gap-4 text-xs text-blue-200 flex-wrap">
                <span className="flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  Claude AI
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Base L2
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  Clerk.dev
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Cloud className="w-3 h-3 mr-1" />
                  Cloudinary
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Palette className="w-3 h-3 mr-1" />
                  Manifold
                </span>
              </div>
            </div>

            {/* NFT Contract Information */}
            <div className="bg-white/5 backdrop-blur rounded-lg p-4 mb-4 max-w-4xl mx-auto">
              <h5 className="text-sm font-medium text-blue-100 mb-3">NFT Smart Contracts</h5>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
                <div className="bg-white/5 rounded p-3">
                  <div className="font-medium text-purple-200 mb-2">ERC721 (Unique)</div>
                  <code className="text-purple-100 break-all text-xs block w-full">0xb976c398291fb99d507551d1a01b5bfcc7823d51</code>
                </div>
                <div className="bg-white/5 rounded p-3">
                  <div className="font-medium text-pink-200 mb-2">ERC1155 (Edition)</div>
                  <code className="text-pink-100 break-all text-xs block w-full">0xc6ac80da15ede865e11c0858354cf553ab9d0a37</code>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-blue-400/30 py-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-blue-100"
          >
            <p className="text-sm">
              &copy; {currentYear} Arthrokinetix. All rights reserved.
            </p>
            <p className="text-xs mt-2 opacity-75">
              Founded by Board-Certified Orthopedic Surgeon • 
              Evidence-based medical expertise meets algorithmic art • 
              Built with ❤️ for the medical and art communities
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;