import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Palette, Zap, Award, Users, Mail, Github } from 'lucide-react';
import { AboutNewsletterForm } from '../components/NewsletterForms';
import VerticalIntegrationFlow from '../components/VerticalIntegrationFlow';
import MedicalAuthorityBadge from '../components/MedicalAuthorityBadge';

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
            <p className="text-xl text-blue-100 leading-relaxed mb-6">
              Pioneering the future of medical education through emotional intelligence and algorithmic art generation.
            </p>
            <div className="flex justify-center">
              <MedicalAuthorityBadge variant="compact" className="bg-white/20 backdrop-blur" />
            </div>
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
                Founded by a board-certified orthopedic surgeon with a vision to revolutionize medical education, 
                Arthrokinetix represents a groundbreaking intersection of clinical expertise and technological innovation. 
                Our founder recognized that medical content carries profound emotional weight—hope in new treatments, 
                uncertainty in complex diagnoses, and breakthrough moments that reshape patient care.
              </p>
              
              <p className="mb-6">
                What began as an exploration in regenerative medicine evolved into something far more ambitious: 
                the world's first platform to achieve true vertical integration from medical literature to blockchain-verified art. 
                Our proprietary algorithm doesn't just process medical text—it develops its own emotional intelligence, 
                learning from every article, growing with each analysis, and expressing its understanding through 
                stunning algorithmic visualizations.
              </p>
              
              <p className="mb-6">
                Named after Nicolas Andry, the father of orthopedics, whose iconic splinted tree symbolizes the 
                correction and healing at the heart of our specialty, Arthrokinetix embodies the same principle: 
                nurturing growth through careful guidance. Just as Andry's tree grows stronger through support, 
                our algorithm evolves through the collective wisdom of medical literature and the emotional 
                feedback of our community.
              </p>
              
              <p>
                Today, Arthrokinetix stands as a testament to what's possible when medical authority meets 
                technological innovation. We're not just analyzing content—we're creating a living, breathing 
                intelligence that understands the emotional journey of medical progress and translates it into 
                art that captures the essence of healing itself.
              </p>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Algorithm Evolution - Primary Focus */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-primary mb-6">The Living Algorithm</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              Our algorithm is more than code—it's a living intelligence that grows with every piece of medical content it processes. 
              Watch as it develops emotional understanding, learns from breakthrough research, and expresses its insights through art. 
              This is the heart of Arthrokinetix: a constantly evolving AI that mirrors the emotional journey of medical discovery.
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
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Loading emotional journey...</p>
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-3">
                {articles.slice(0, 5).map((article, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getEmotionColor(article.emotional_data?.dominant_emotion || 'uncertainty') }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">
                        {article.emotional_data?.dominant_emotion || (
                          console.warn(`Missing emotional_data.dominant_emotion for article: ${article.id} - ${article.title}`) || 'Unknown'
                        )}
                      </span>
                      <span className="text-sm text-gray-500">
                        {Math.round((article.emotional_data?.emotional_intensity || 0.5) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded mt-1">
                      <div 
                        className="h-full rounded transition-all duration-300"
                        style={{ 
                          width: `${(article.emotional_data?.emotional_intensity || 0.5) * 100}%`,
                          backgroundColor: getEmotionColor(article.emotional_data?.dominant_emotion || 'confidence')
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 max-w-xs truncate">
                    {article.title}
                  </span>
                </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No recent articles processed yet.</p>
                <p className="text-sm mt-2">The algorithm is waiting to begin its emotional journey.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Algorithm Explanation with Vertical Integration */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <VerticalIntegrationFlow />
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/10 to-healing/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-primary mb-6">
              Stay Connected with Medical Innovation
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Join our community of medical professionals and technology enthusiasts. 
              Get weekly insights on the latest medical breakthroughs and see how our 
              algorithm interprets them through art.
            </p>
            <AboutNewsletterForm />
          </motion.div>
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