import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Twitter, Linkedin, Github, Heart, Shield, FileText, ExternalLink, Zap, Palette } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/arthrokinetix',
      color: '#1DA1F2'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com/company/arthrokinetix',
      color: '#0077B5'
    },
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/arthrokinetix',
      color: '#333'
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

  const contactInfo = [
    { 
      label: 'General Support', 
      email: 'support@arthrokinetix.com',
      description: 'Platform help and questions'
    },
    { 
      label: 'Privacy & Legal', 
      email: 'legal@arthrokinetix.com',
      description: 'Privacy and legal matters'
    },
    { 
      label: 'Medical Content', 
      email: 'content@arthrokinetix.com',
      description: 'Content questions and feedback'
    },
    { 
      label: 'NFT & Technical', 
      email: 'tech@arthrokinetix.com',
      description: 'Technical and NFT support'
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-primary-dark via-primary to-secondary text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
                  Where evidence-based medical content meets algorithmic art generation. 
                  Transforming medical knowledge into beautiful, meaningful digital artworks 
                  through emotional AI analysis.
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
                <div className="space-y-4">
                  {contactInfo.map((contact) => (
                    <div key={contact.label}>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-blue-100 hover:text-white transition-colors duration-200 group block"
                      >
                        <div className="font-medium text-sm group-hover:translate-x-1 transition-transform duration-200">
                          {contact.label}
                        </div>
                        <div className="text-xs text-blue-200 opacity-75 mb-1">
                          {contact.description}
                        </div>
                        <div className="text-xs font-mono bg-white/10 px-2 py-1 rounded inline-block">
                          {contact.email}
                        </div>
                      </a>
                    </div>
                  ))}
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
              <div className="flex justify-center items-center gap-4 text-xs text-blue-200">
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
                  <Palette className="w-3 h-3 mr-1" />
                  Manifold
                </span>
              </div>
            </div>

            {/* NFT Contract Information */}
            <div className="bg-white/5 backdrop-blur rounded-lg p-4 mb-4 max-w-2xl mx-auto">
              <h5 className="text-sm font-medium text-blue-100 mb-2">NFT Smart Contracts</h5>
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                <div className="bg-white/5 rounded p-2">
                  <div className="font-medium text-purple-200">ERC721 (Unique)</div>
                  <code className="text-purple-100 break-all">0xb976c398291fb99d507551d1a01b5bfcc7823d51</code>
                </div>
                <div className="bg-white/5 rounded p-2">
                  <div className="font-medium text-pink-200">ERC1155 (Edition)</div>
                  <code className="text-pink-100 break-all">0xc6ac80da15ede865e11c0858354cf553ab9d0a37</code>
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
              Transforming medical knowledge into algorithmic art • 
              Evidence-based content meets creative technology • 
              Built with ❤️ for the medical and art communities
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;