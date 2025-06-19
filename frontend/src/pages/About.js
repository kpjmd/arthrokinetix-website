import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Palette, Zap, Award, Users, Mail, Github } from 'lucide-react';

const About = () => {
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
              Where medical research meets emotional intelligence and algorithmic art. 
              We're pioneering the intersection of evidence-based medicine and computational creativity.
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
                undertones hidden within medical research? What if algorithms could feel the hope, confidence, 
                uncertainty, and breakthroughs embedded in scientific literature?
              </p>
              
              <p className="mb-6">
                Our proprietary algorithm doesn't just analyze text—it experiences it. Through advanced 
                natural language processing and emotional intelligence, we've created a system that develops 
                its own emotional state based on the research it processes. This emotional journey is then 
                transformed into stunning visual art through our unique "Andry Tree" visualization system.
              </p>
              
              <p>
                Named after the pioneering orthopedic surgeon Nicolas Andry, whose splinted tree symbol 
                represents healing and correction, our platform bridges the gap between analytical precision 
                and emotional understanding in medical education.
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
              designed specifically for medical literature analysis.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: "Content Analysis",
                description: "Deep analysis of medical terminology, statistical data, research citations, and evidence quality indicators.",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Emotional Detection", 
                description: "Identification of emotional markers: hope, confidence, uncertainty, tension, breakthrough, and healing potential.",
                color: "from-red-500 to-red-600"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Signature Generation",
                description: "Creation of unique visual signatures with concentric rings, geometric overlays, and floating particles.",
                color: "from-yellow-500 to-yellow-600"
              },
              {
                icon: <Palette className="w-8 h-8" />,
                title: "Art Creation",
                description: "Transformation into Andry Tree visualizations with subspecialty-specific styling and healing animations.",
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

      {/* Interactive Demo */}
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
              Watch how the algorithm's emotional state evolves based on the medical literature it processes. 
              Each article influences its understanding and emotional development.
            </p>
          </motion.div>

          {/* Demo Visualization */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-8 mb-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-primary mb-6">Current Algorithm State</h3>
              
              {/* Simulated algorithm mood indicator */}
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
                >
                  ■
                </motion.div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Dominant Emotion</p>
                  <p className="text-lg font-semibold text-secondary">Confidence</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Articles Processed</p>
                  <p className="text-lg font-semibold text-primary">1,247</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Artworks Generated</p>
                  <p className="text-lg font-semibold text-healing">1,247</p>
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

      {/* Team Section */}
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
                We believe that medicine is not just about data and statistics—it's about human stories, 
                hope, healing, and the emotional journey of discovery. By making these hidden emotions 
                visible through art, we create a more complete understanding of medical research.
              </p>
              
              <p className="mb-6">
                Every article processed by our algorithm contributes to its emotional growth, creating 
                a living, evolving intelligence that reflects the collective emotional journey of 
                medical progress. Through community feedback and interaction, users become part of 
                this evolutionary process.
              </p>
              
              <p>
                Our ultimate goal is to bridge the gap between analytical rigor and emotional intelligence 
                in medical education, creating a new paradigm for understanding and visualizing 
                scientific progress.
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
                title: "Evidence-Based Analysis",
                description: "Rigorous evaluation of research quality and evidence strength in every article."
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Emotional Intelligence",
                description: "Unique emotional analysis revealing the human stories behind medical research."
              },
              {
                icon: <Palette className="w-8 h-8" />,
                title: "Algorithmic Art",
                description: "Beautiful visualizations that transform data into meaningful artistic expressions."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Community Feedback",
                description: "User emotions influence the algorithm's evolution and artistic development."
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Real-Time Processing",
                description: "Instant analysis and art generation for new medical research content."
              },
              {
                icon: <Brain className="w-8 h-8" />,
                title: "Subspecialty Focus",
                description: "Specialized analysis for different orthopedic and sports medicine fields."
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
                answer: "Our algorithm uses advanced natural language processing to identify emotional markers in medical literature. It analyzes word choice, sentence structure, and contextual clues to determine the emotional undertones of research articles."
              },
              {
                question: "What makes the artworks unique?",
                answer: "Each artwork is generated based on the specific emotional profile of its source article. The Andry Tree visualization incorporates the research's evidence strength, subspecialty characteristics, and emotional intensity to create one-of-a-kind digital art."
              },
              {
                question: "How does user feedback influence the algorithm?",
                answer: "When users provide emotional feedback on articles, it slightly adjusts the algorithm's emotional understanding. Over time, these micro-adjustments help the system better align with human emotional perception of medical research."
              },
              {
                question: "Are the artworks available as NFTs?",
                answer: "Selected high-rarity artworks are available for minting as NFTs. These blockchain-verified pieces provide premium access to platform features and represent unique moments in the algorithm's emotional evolution."
              },
              {
                question: "What subspecialties are covered?",
                answer: "We focus on orthopedic surgery and sports medicine, covering all nine recognized subspecialties: sports medicine, joint replacement, trauma, spine, hand & upper extremity, foot & ankle, shoulder & elbow, pediatrics, and oncology."
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
              Have questions about Arthrokinetix or want to collaborate? We'd love to hear from you.
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