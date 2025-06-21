import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, Gavel, Shield, Zap, Palette, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <SEOHead 
        title="Terms of Service - Arthrokinetix"
        description="Terms of Service for Arthrokinetix platform covering medical content usage, NFT rights, and platform responsibilities."
        keywords="terms of service, medical content terms, NFT terms, healthcare blog terms, user agreement"
        url="/terms"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Gavel className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-primary mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These terms govern your use of Arthrokinetix, including our medical content platform 
              and algorithmic art generation services.
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-b">
              <p className="text-sm text-gray-600">
                <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Effective Date:</strong> By using Arthrokinetix, you agree to these terms and our Privacy Policy.
              </p>
            </div>

            <div className="px-8 py-8 prose prose-lg max-w-none">
              
              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <Heart className="w-6 h-6 text-red-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Platform Purpose & Mission</h2>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    Arthrokinetix is a dual-purpose platform that bridges the gap between evidence-based medical education 
                    and algorithmic art generation. Our mission is to transform medical knowledge into beautiful, 
                    meaningful digital artworks while providing valuable educational content to healthcare professionals and students.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Medical Content Platform</h4>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Evidence-based orthopedic content</li>
                        <li>• 9 medical subspecialty areas</li>
                        <li>• Educational resources and insights</li>
                        <li>• Professional development support</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Algorithmic Art Engine</h4>
                      <ul className="space-y-1 text-gray-700">
                        <li>• AI-powered emotional analysis</li>
                        <li>• Unique visual art generation</li>
                        <li>• NFT minting capabilities</li>
                        <li>• Community-influenced algorithm</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <FileText className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">User Responsibilities</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-red-50 border-l-4 border-red-400 p-6">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-red-900 mb-3">Medical Content Usage</h3>
                        <ul className="space-y-2 text-red-800 text-sm">
                          <li><strong>Educational Purpose Only:</strong> All content is for educational purposes and does not constitute medical advice, diagnosis, or treatment recommendations.</li>
                          <li><strong>Professional Consultation Required:</strong> Always consult qualified healthcare professionals for medical decisions and patient care.</li>
                          <li><strong>No Clinical Reliance:</strong> Do not rely solely on platform content for clinical practice, patient treatment, or medical decision-making.</li>
                          <li><strong>Currency of Information:</strong> Medical knowledge evolves rapidly; always verify information with current medical literature and professional guidelines.</li>
                          <li><strong>Scope Limitations:</strong> Content focuses on orthopedic subspecialties and may not cover all medical conditions or treatments.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">Emotional Feedback & Algorithm Participation</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li><strong>Honest Feedback:</strong> Provide genuine, constructive emotional responses to medical content that reflect your true reactions.</li>
                      <li><strong>Algorithm Influence:</strong> Understand that your feedback directly influences our AI algorithm's emotional development and art generation parameters.</li>
                      <li><strong>Community Impact:</strong> Your participation helps shape the platform experience for all users through algorithm evolution.</li>
                      <li><strong>No Malicious Use:</strong> Do not provide misleading, false, or malicious feedback intended to manipulate the algorithm or harm the platform.</li>
                      <li><strong>Feedback Weighting:</strong> Different user types (subscribers, NFT holders, demo users) have different levels of algorithm influence.</li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-3">Account & Platform Conduct</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li><strong>Account Security:</strong> Maintain the security of your account credentials and notify us immediately of any unauthorized access.</li>
                      <li><strong>Accurate Information:</strong> Provide accurate information during registration and account setup.</li>
                      <li><strong>Appropriate Use:</strong> Use the platform in accordance with its intended educational and artistic purposes.</li>
                      <li><strong>Community Standards:</strong> Respect other users and maintain professional standards in all platform interactions.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <Zap className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">NFT Rights & Digital Ownership</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">Generated Artworks & Algorithm Rights</h3>
                    <div className="space-y-3 text-gray-700">
                      <p><strong>Algorithmic Generation:</strong> All artworks are generated by our proprietary Arthrokinetix algorithm, which analyzes medical content for emotional undertones and creates unique visual representations.</p>
                      <p><strong>Unique Interpretations:</strong> Each artwork represents a unique algorithmic interpretation of medical research data, emotional analysis, and community feedback influence.</p>
                      <p><strong>Generation Process:</strong> The algorithm processes medical content through emotional analysis, applies community feedback influences, and generates visual art using our proprietary Andry Tree methodology.</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">NFT Ownership & Rights</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-blue-800 mb-2">What You Own (NFT Holder)</h4>
                        <ul className="space-y-1 text-gray-700 text-sm">
                          <li>• Ownership of the specific digital artwork instance</li>
                          <li>• Right to display the artwork privately and publicly</li>
                          <li>• Right to sell, trade, or transfer the NFT</li>
                          <li>• Access to premium platform features</li>
                          <li>• Enhanced algorithm influence weighting</li>
                          <li>• Exclusive community access and benefits</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800 mb-2">What Arthrokinetix Retains</h4>
                        <ul className="space-y-1 text-gray-700 text-sm">
                          <li>• Intellectual property rights to the algorithm</li>
                          <li>• Rights to the generation process and methodology</li>
                          <li>• Platform operation and development rights</li>
                          <li>• Right to display artworks for platform promotion</li>
                          <li>• Algorithm improvement and evolution rights</li>
                          <li>• Educational use of generated art concepts</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">Smart Contract Details</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium text-purple-800 mb-2">ERC721 (Unique Pieces)</h4>
                        <ul className="space-y-1 text-gray-700">
                          <li>• Contract: <code className="text-xs bg-gray-200 px-1 rounded">0xb976...3d51</code></li>
                          <li>• One-of-a-kind artworks (rarity > 80%)</li>
                          <li>• Exclusive ownership rights</li>
                          <li>• Maximum algorithm influence weighting</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-purple-800 mb-2">ERC1155 (Edition Pieces)</h4>
                        <ul className="space-y-1 text-gray-700">
                          <li>• Contract: <code className="text-xs bg-gray-200 px-1 rounded">0xc6ac...0a37</code></li>
                          <li>• Limited edition artworks (rarity ≤ 80%)</li>
                          <li>• Multiple copies available</li>
                          <li>• Standard algorithm influence weighting</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-4">
                      <strong>Network:</strong> All NFTs are minted on Base L2 for low-cost transactions. 
                      <strong>Platform:</strong> Minting handled through Manifold.xyz integration.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-3">Commercial Use & Licensing</h3>
                    <p className="text-gray-700 mb-3">While NFT ownership grants you significant rights to your specific artwork, commercial use beyond personal display may require additional licensing:</p>
                    <ul className="space-y-2 text-gray-700">
                      <li><strong>Personal Use:</strong> Full rights for personal display, social sharing, and non-commercial use</li>
                      <li><strong>Commercial Use:</strong> Contact us for licensing agreements for commercial applications, merchandise, or business use</li>
                      <li><strong>Derivative Works:</strong> Creating derivative works based on the artwork requires separate licensing</li>
                      <li><strong>Algorithm Reproduction:</strong> The underlying algorithm and generation process cannot be reproduced or reverse-engineered</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <Shield className="w-6 h-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Platform Access & User Tiers</h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Basic Access</h3>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• View articles and artworks</li>
                      <li>• Browse platform content</li>
                      <li>• Limited algorithm interaction</li>
                      <li>• Public content access</li>
                    </ul>
                  </div>
                  
                  <div className="border border-blue-300 bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-3">Verified Access (Email)</h3>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Full feedback submission rights</li>
                      <li>• Standard algorithm influence</li>
                      <li>• Newsletter and updates</li>
                      <li>• Enhanced content features</li>
                      <li>• Community participation</li>
                    </ul>
                  </div>
                  
                  <div className="border border-purple-300 bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-3">Premium Access (NFT)</h3>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Maximum algorithm influence</li>
                      <li>• Exclusive content access</li>
                      <li>• Priority feature access</li>
                      <li>• Community governance rights</li>
                      <li>• Special recognition badges</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Prohibited Activities</h2>
                </div>
                
                <div className="bg-red-50 rounded-lg p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-red-900 mb-2">Technical Violations</h3>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• Attempting to reverse-engineer our proprietary algorithms or generation processes</li>
                        <li>• Automated scraping, bulk downloading, or systematic content extraction</li>
                        <li>• Circumventing access controls, security measures, or user authentication systems</li>
                        <li>• Interfering with platform operation, server infrastructure, or other users' access</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-red-900 mb-2">Content & Usage Violations</h3>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• Providing false information during verification processes or account creation</li>
                        <li>• Using the platform to provide commercial medical advice or patient consultation</li>
                        <li>• Submitting malicious or misleading feedback intended to manipulate the algorithm</li>
                        <li>• Misrepresenting your professional qualifications or medical credentials</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-red-900 mb-2">Commercial & Legal Violations</h3>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• Unauthorized commercial use of generated artworks beyond NFT ownership rights</li>
                        <li>• Claiming ownership of the underlying algorithm or generation methodology</li>
                        <li>• Violating intellectual property rights or platform terms in artwork usage</li>
                        <li>• Engaging in activities that could harm the platform's reputation or user trust</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <Palette className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Limitation of Liability</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Platform Services</h3>
                    <p className="text-gray-700 mb-3">
                      Arthrokinetix provides content and services "as is" without warranties of any kind. We strive for accuracy and reliability but cannot guarantee:
                    </p>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Uninterrupted or error-free platform operation</li>
                      <li>• Complete accuracy of all medical content or references</li>
                      <li>• Specific outcomes from algorithm-generated artworks</li>
                      <li>• Continuous availability of all platform features</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-6">
                    <h3 className="font-semibold text-red-900 mb-3">Medical & Professional Disclaimer</h3>
                    <p className="text-red-800 text-sm">
                      <strong>Arthrokinetix is not liable for medical decisions based on platform content or investment decisions related to NFT purchases.</strong> 
                      Users assume full responsibility for their use of the platform, including any professional, educational, or financial decisions influenced by platform content.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-3">NFT & Blockchain Considerations</h3>
                    <ul className="space-y-1 text-blue-800 text-sm">
                      <li>• NFT values are speculative and may fluctuate or become worthless</li>
                      <li>• Blockchain transactions are irreversible and subject to network fees</li>
                      <li>• Smart contract functionality depends on external blockchain infrastructure</li>
                      <li>• We are not responsible for wallet security or private key management</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact & Legal Information</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Platform Support</h3>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li><strong>General Support:</strong> <a href="mailto:support@arthrokinetix.com" className="text-blue-600 hover:text-blue-800">support@arthrokinetix.com</a></li>
                        <li><strong>Technical Issues:</strong> <a href="mailto:tech@arthrokinetix.com" className="text-blue-600 hover:text-blue-800">tech@arthrokinetix.com</a></li>
                        <li><strong>Content Questions:</strong> <a href="mailto:content@arthrokinetix.com" className="text-blue-600 hover:text-blue-800">content@arthrokinetix.com</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Legal & Compliance</h3>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li><strong>Legal Matters:</strong> <a href="mailto:legal@arthrokinetix.com" className="text-blue-600 hover:text-blue-800">legal@arthrokinetix.com</a></li>
                        <li><strong>Privacy Questions:</strong> <a href="mailto:privacy@arthrokinetix.com" className="text-blue-600 hover:text-blue-800">privacy@arthrokinetix.com</a></li>
                        <li><strong>NFT & IP Issues:</strong> <a href="mailto:nft@arthrokinetix.com" className="text-blue-600 hover:text-blue-800">nft@arthrokinetix.com</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <footer className="text-sm text-gray-600 mt-12 pt-8 border-t">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="font-medium text-blue-900 mb-2">Terms Updates & Modifications</p>
                  <p className="text-blue-800 mb-2">
                    We may update these terms to reflect changes in our platform, legal requirements, or industry standards. 
                    We'll notify users of significant changes via email or platform notifications at least 30 days before implementation.
                  </p>
                  <p className="text-blue-800">
                    <strong>Continued Use:</strong> Your continued use of the platform after terms updates constitutes acceptance of the new terms.
                  </p>
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p><strong>Current Version:</strong> 2.0 • <strong>Last Modified:</strong> {new Date().toLocaleDateString()}</p>
                    <p><strong>Governing Law:</strong> These terms are governed by the laws of [Jurisdiction] and any disputes will be resolved through binding arbitration.</p>
                  </div>
                </div>
              </footer>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-12">
            <Link 
              to="/"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Arthrokinetix
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;