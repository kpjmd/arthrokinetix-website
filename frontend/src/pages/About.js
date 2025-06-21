import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Palette, Zap, Award, Users, Mail, Github } from 'lucide-react';
import { AboutNewsletterForm } from '../components/NewsletterForms';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const About = () => {
  const [algorithmState, setAlgorithmState] = useState(null);
  const [articles, setArticles] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealTimeData();
  }, []);

  const fetchRealTimeData = async () => {
    try {
      const [stateRes, articlesRes, artworksRes] = await Promise.all([
        fetch(`${API_BASE}/api/algorithm-state`),
        fetch(`${API_BASE}/api/articles`),
        fetch(`${API_BASE}/api/artworks`)
      ]);
      
      const stateData = await stateRes.json();
      const articlesData = await articlesRes.json();
      const artworksData = await artworksRes.json();
      
      setAlgorithmState(stateData);
      setArticles(articlesData.articles || []);
      setArtworks(artworksData.artworks || []);
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      // Set fallback data
      setAlgorithmState({
        emotional_state: { dominant_emotion: 'confidence', emotional_intensity: 0.6 },
        articles_processed: 0
      });
      setArticles([]);
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6">About Arthrokinetix</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Where medical content meets emotional intelligence and algorithmic art. 
              We're pioneering the intersection of evidence-based medical education and computational creativity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-primary mb-6">The Arthrokinetix Story</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-6">
                Arthrokinetix was born from a revolutionary idea: what if we could understand the emotional 
                undertones hidden within medical content? What if algorithms could feel the hope, confidence, 
                uncertainty, and breakthroughs embedded in medical education materials?
              </p>
              
              <p className="mb-6">
                Our proprietary algorithm doesn't just analyze text—it experiences it. Through advanced 
                natural language processing and emotional intelligence, we've created a system that develops 
                its own emotional state based on the medical content it processes. This emotional journey is then 
                transformed into stunning visual art through our unique "Andry Tree" visualization system.
              </p>
              
              <p>
                Named after the pioneering orthopedic surgeon Nicolas Andry, whose splinted tree symbol 
                represents healing and correction, our platform bridges the gap between analytical precision 
                and emotional understanding in medical education. We've evolved from a research-focused platform 
                to a comprehensive medical content hub that serves as both an educational resource and a digital art gallery.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Algorithm Explanation */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-primary mb-6">How the Algorithm Works</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our Arthrokinetix algorithm represents a breakthrough in computational emotional intelligence, 
              designed specifically for medical content analysis and artistic transformation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: "Content Analysis",
                description: "Deep analysis of medical terminology, statistical data, clinical citations, and evidence quality indicators across multiple content formats.",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Emotional Detection", 
                description: "Identification of emotional markers: hope, confidence, uncertainty, tension, breakthrough, and healing potential in medical content.",
                color: "from-red-500 to-red-600"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Signature Generation",
                description: "Creation of unique visual signatures with concentric rings, geometric overlays, and floating particles representing emotional complexity.",
                color: "from-yellow-500 to-yellow-600"
              },
              {
                icon: <Palette className="w-8 h-8" />,
                title: "Art Creation",
                description: "Transformation into Andry Tree visualizations with subspecialty-specific styling, emotional gradients, and healing animations.",
                color: "from-green-500 to-green-600"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo with Real Data */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-primary mb-6">Algorithm Evolution</h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-8">
              Watch how the algorithm's emotional state evolves based on the medical content it processes. 
              Each article influences its understanding and emotional development, creating a living, learning system.
            </p>
          </motion.div>

          {/* Demo Visualization with Real Data */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-8 mb-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-primary mb-6">Current Algorithm State</h3>
              
              {/* Real algorithm mood indicator */}
              <div className="flex justify-center mb-8">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-32 h-32 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                  style={{
                    backgroundColor: algorithmState?.visual_representation?.color || '#3498db'
                  }}
                >
                  {algorithmState?.visual_representation?.shape === 'square' ? '■' : 
                   algorithmState?.visual_representation?.shape === 'star' ? '★' : 
                   algorithmState?.visual_representation?.shape === 'triangle' ? '▲' : '●'}
                </motion.div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Dominant Emotion</p>
                  <p className="text-lg font-semibold text-secondary capitalize">
                    {loading ? 'Loading...' : algorithmState?.emotional_state?.dominant_emotion || 'Confidence'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Content Processed</p>
                  <p className="text-lg font-semibold text-primary">
                    {loading ? 'Loading...' : (algorithmState?.articles_processed || articles.length || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Artworks Generated</p>
                  <p className="text-lg font-semibold text-healing">
                    {loading ? 'Loading...' : artworks.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Emotional Timeline */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-primary mb-4">Recent Emotional Journey</h4>
            <div className="space-y-3">
              {[
                { emotion: 'breakthrough', intensity: 0.9, article: 'Revolutionary ACL Repair Technique' },
                { emotion: 'confidence', intensity: 0.8, article: 'Long-term Hip Replacement Outcomes' },
                { emotion: 'healing', intensity: 0.85, article: 'Regenerative Medicine in Sports Injuries' },
                { emotion: 'uncertainty', intensity: 0.6, article: 'Complications in Spinal Fusion' }
              ].map((entry, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getEmotionColor(entry.emotion) }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">{entry.emotion}</span>
                      <span className="text-sm text-gray-500">{Math.round(entry.intensity * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded mt-1">
                      <div 
                        className="h-full rounded transition-all duration-300"
                        style={{ 
                          width: `${entry.intensity * 100}%`,
                          backgroundColor: getEmotionColor(entry.emotion)
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 max-w-xs truncate">{entry.article}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-primary mb-6">Our Vision</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-6">
                We believe that medical education is not just about data and statistics—it's about human stories, 
                hope, healing, and the emotional journey of medical discovery. By making these hidden emotions 
                visible through art, we create a more complete understanding of medical content and its impact.
              </p>
              
              <p className="mb-6">
                Arthrokinetix serves as both a trusted platform for medical education and an innovative digital art gallery. 
                Every piece of content processed by our algorithm contributes to its emotional growth, creating 
                a living, evolving intelligence that reflects the collective emotional journey of 
                medical progress and patient care.
              </p>
              
              <p>
                Our ultimate goal is to bridge the gap between analytical rigor and emotional intelligence 
                in medical education, creating a new paradigm for understanding and visualizing 
                medical content. Through community feedback and interaction, users become part of 
                this evolutionary process, helping shape the algorithm's emotional understanding.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-primary mb-6">Platform Features</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="w-8 h-8" />,
                title: "Evidence-Based Content",
                description: "Rigorous curation and evaluation of medical content quality and evidence strength across all subspecialties."
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Emotional Intelligence",
                description: "Unique emotional analysis revealing the human stories and emotional journeys behind medical education content."
              },
              {
                icon: <Palette className="w-8 h-8" />,
                title: "Algorithmic Art",
                description: "Beautiful visualizations that transform medical content into meaningful artistic expressions and digital galleries."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Community Feedback",
                description: "User emotions and interactions influence the algorithm's evolution and artistic development over time."
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Multi-Format Support",
                description: "Support for HTML, PDF, and text content formats with real-time processing and art generation capabilities."
              },
              {
                icon: <Brain className="w-8 h-8" />,
                title: "Subspecialty Focus",
                description: "Specialized analysis for all nine orthopedic and sports medicine subspecialty areas with tailored emotional understanding."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-primary mb-6">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "How does the emotional analysis work?",
                answer: "Our algorithm uses advanced natural language processing to identify emotional markers in medical content. It analyzes word choice, sentence structure, clinical outcomes, and contextual clues to determine the emotional undertones of medical education materials."
              },
              {
                question: "What makes the artworks unique?",
                answer: "Each artwork is generated based on the specific emotional profile of its source content. The Andry Tree visualization incorporates the content's evidence strength, subspecialty characteristics, and emotional intensity to create one-of-a-kind digital art pieces."
              },
              {
                question: "How does user feedback influence the algorithm?",
                answer: "When users provide emotional feedback on articles, it slightly adjusts the algorithm's emotional understanding. Over time, these micro-adjustments help the system better align with human emotional perception of medical content."
              },
              {
                question: "Are the artworks available as NFTs?",
                answer: "Selected high-rarity artworks are available for minting as NFTs. These blockchain-verified pieces provide premium access to platform features and represent unique moments in the algorithm's emotional evolution."
              },
              {
                question: "What subspecialties are covered?",
                answer: "We focus on orthopedic surgery and sports medicine, covering all nine recognized subspecialties: sports medicine, joint replacement, trauma, spine, hand & upper extremity, foot & ankle, shoulder & elbow, pediatrics, and oncology."
              },
              {
                question: "What content formats are supported?",
                answer: "Our platform supports multiple content formats including HTML files (which render directly with full styling), PDF documents (stored for future algorithm parsing), and traditional text input. This flexibility allows for rich, varied medical content presentation."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-primary mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-700">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-xl text-blue-100 mb-8">
              Have questions about Arthrokinetix or want to collaborate on medical content and algorithmic art? We'd love to hear from you.
            </p>
            
            <div className="flex justify-center gap-6">
              <a
                href="mailto:hello@arthrokinetix.com"
                className="inline-flex items-center px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Us
              </a>
              
              <a
                href="https://github.com/kpjmd/arthrokinetix-website"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-colors duration-200"
              >
                <Github className="w-5 h-5 mr-2" />
                View Source
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const getEmotionColor = (emotion) => {
  const colors = {
    hope: '#27ae60',
    tension: '#e74c3c',
    confidence: '#3498db',
    uncertainty: '#95a5a6',
    breakthrough: '#f39c12',
    healing: '#16a085'
  };
  return colors[emotion] || '#3498db';
};

export default About;