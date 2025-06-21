import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Heart, Database, Eye, Lock, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <SEOHead 
        title="Privacy Policy - Arthrokinetix"
        description="Learn how Arthrokinetix protects your privacy and handles your personal information on our medical content and algorithmic art platform."
        keywords="privacy policy, data protection, medical content privacy, healthcare blog privacy, NFT privacy, user data"
        url="/privacy"
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
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-primary mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your privacy is fundamental to us. Learn how we protect and handle your information 
              on our medical content and algorithmic art platform.
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
                <strong>Effective Date:</strong> This policy is effective immediately and applies to all users of the Arthrokinetix platform.
              </p>
            </div>

            <div className="px-8 py-8 prose prose-lg max-w-none">
              
              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <Database className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Information We Collect</h2>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Account Information</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Email Authentication:</strong> When you sign up via Clerk.dev, we collect your email address for account creation, authentication, and platform communication.</li>
                    <li><strong>Web3 Authentication:</strong> When you connect your wallet, we store your wallet address to verify NFT ownership and provide premium features.</li>
                    <li><strong>User Preferences:</strong> Your communication preferences, feedback settings, and platform customization choices.</li>
                    <li><strong>Profile Information:</strong> Optional display name and preferences you choose to share.</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Platform Usage Data</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Emotional Feedback:</strong> Your responses to medical articles that help evolve our proprietary algorithm's emotional understanding.</li>
                    <li><strong>Content Interaction:</strong> Articles viewed, artworks explored, sharing activity, and time spent on different content types.</li>
                    <li><strong>Algorithm Influence:</strong> How your feedback affects the algorithm's emotional state and art generation parameters.</li>
                    <li><strong>Analytics Data:</strong> Anonymized usage patterns to improve platform functionality and user experience.</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">Healthcare Blog Specific Data</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Medical Content Preferences:</strong> Subspecialties you're interested in (sports medicine, joint replacement, etc.)</li>
                    <li><strong>Professional Background:</strong> Optional information about your medical or healthcare background for content personalization</li>
                    <li><strong>Content Engagement:</strong> Which medical topics and evidence levels you engage with most</li>
                    <li><strong>Educational Use:</strong> How you use our content for educational or professional development purposes</li>
                  </ul>
                </div>
              </section>

              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <Heart className="w-6 h-6 text-red-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">How We Use Your Information</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Core Platform Functions</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li><strong>Algorithm Evolution:</strong> Your emotional feedback directly influences our proprietary medical-to-art algorithm's development and emotional intelligence.</li>
                      <li><strong>Content Personalization:</strong> Tailored medical content and artwork recommendations based on your interests and engagement patterns.</li>
                      <li><strong>NFT Verification:</strong> Confirming ownership of Arthrokinetix NFTs to provide premium features and exclusive access.</li>
                      <li><strong>Platform Security:</strong> Protecting your account and detecting fraudulent activity.</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Communication & Growth</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li><strong>Educational Content:</strong> Newsletter updates with curated medical content and platform developments.</li>
                      <li><strong>Algorithm Reports:</strong> Insights into how your feedback has influenced the algorithm's evolution.</li>
                      <li><strong>Platform Announcements:</strong> Important updates about new features, medical content, and NFT releases.</li>
                      <li><strong>Community Building:</strong> Connecting users with shared interests in medical education and digital art.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <Eye className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Third-Party Services & Integration</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Authentication & User Management</h3>
                    <p className="text-gray-700 text-sm mb-2"><strong>Clerk.dev:</strong> Secure email authentication, user session management, and account security.</p>
                    <p className="text-xs text-gray-500">Data shared: Email address, authentication status, user preferences</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Data Storage & Processing</h3>
                    <p className="text-gray-700 text-sm mb-2"><strong>MongoDB Atlas:</strong> Secure, encrypted cloud storage for all platform data including articles, artworks, and user feedback.</p>
                    <p className="text-xs text-gray-500">Data shared: All platform content and user interaction data (encrypted and secured)</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">AI & Content Analysis</h3>
                    <p className="text-gray-700 text-sm mb-2"><strong>Anthropic Claude:</strong> AI-powered emotional analysis of medical content to generate algorithmic art parameters.</p>
                    <p className="text-xs text-gray-500">Data shared: Medical article content only (no personal user data)</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Blockchain & NFT Services</h3>
                    <p className="text-gray-700 text-sm mb-2"><strong>Alchemy & Base L2:</strong> Blockchain data for NFT verification and minting capabilities.</p>
                    <p className="text-gray-700 text-sm mb-2"><strong>Manifold.xyz:</strong> NFT minting platform for artwork tokenization.</p>
                    <p className="text-xs text-gray-500">Data shared: Wallet addresses for NFT ownership verification only</p>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <Lock className="w-6 h-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Data Security & Protection</h2>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Security Measures</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Encryption:</strong> All data is encrypted in transit (TLS/SSL) and at rest using industry-standard encryption protocols.</li>
                    <li><strong>Access Controls:</strong> Strict access controls ensure only authorized personnel can access user data, and only for legitimate platform operations.</li>
                    <li><strong>Secure Infrastructure:</strong> Cloud-based infrastructure with regular security updates and monitoring for threats.</li>
                    <li><strong>Data Minimization:</strong> We collect only the data necessary for platform functionality and delete unnecessary data regularly.</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Blockchain Security</h3>
                  <p className="text-gray-700 mb-3">Your wallet address and NFT ownership verification are processed securely through established blockchain networks. We never store private keys or have access to your wallet contents.</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Wallet addresses are used only for NFT ownership verification</li>
                    <li>• No private keys or sensitive wallet data are stored</li>
                    <li>• All blockchain interactions use secure, audited protocols</li>
                  </ul>
                </div>
              </section>

              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <Mail className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Your Privacy Rights</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Data Access & Control</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li><strong>Access:</strong> Request copies of all personal data we have about you</li>
                      <li><strong>Correction:</strong> Update or correct any inaccurate information</li>
                      <li><strong>Deletion:</strong> Request removal of your data (subject to legal and technical requirements)</li>
                      <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Communication Control</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li><strong>Unsubscribe:</strong> Opt-out of marketing communications at any time</li>
                      <li><strong>Notification Preferences:</strong> Control which types of platform notifications you receive</li>
                      <li><strong>Feedback Participation:</strong> Choose whether to participate in algorithm feedback systems</li>
                      <li><strong>Data Use Consent:</strong> Withdraw consent for non-essential data processing</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Healthcare Content Disclaimer</h2>
                <div className="bg-red-50 border-l-4 border-red-400 p-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Heart className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Important Medical Disclaimer</h3>
                      <div className="mt-2 text-sm text-red-700 space-y-2">
                        <p><strong>Educational Purpose Only:</strong> All medical content on Arthrokinetix is for educational and informational purposes only. It does not constitute medical advice, diagnosis, or treatment recommendations.</p>
                        <p><strong>Professional Consultation Required:</strong> Always consult qualified healthcare professionals for medical decisions. Do not rely solely on platform content for clinical practice or patient care.</p>
                        <p><strong>No Doctor-Patient Relationship:</strong> Use of this platform does not create a doctor-patient relationship or any professional medical relationship.</p>
                        <p><strong>Content Accuracy:</strong> While we strive for accuracy, medical knowledge evolves rapidly. Always verify information with current medical literature and professional guidelines.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">For privacy-related questions, data requests, or concerns about our data handling practices:</p>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Privacy Officer:</strong> <a href="mailto:privacy@arthrokinetix.com" className="text-blue-600 hover:text-blue-800">privacy@arthrokinetix.com</a></p>
                    <p><strong>General Support:</strong> <a href="mailto:support@arthrokinetix.com" className="text-blue-600 hover:text-blue-800">support@arthrokinetix.com</a></p>
                    <p><strong>Data Protection:</strong> <a href="mailto:legal@arthrokinetix.com" className="text-blue-600 hover:text-blue-800">legal@arthrokinetix.com</a></p>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    We aim to respond to all privacy-related inquiries within 30 days.
                  </p>
                </div>
              </section>

              <footer className="text-sm text-gray-600 mt-12 pt-8 border-t">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="font-medium text-blue-900 mb-2">Policy Updates</p>
                  <p className="text-blue-800">We may update this privacy policy to reflect changes in our practices or legal requirements. We'll notify users of significant changes via email or platform notifications.</p>
                  <p className="mt-2"><strong>Current Version:</strong> 2.0 • <strong>Last Modified:</strong> {new Date().toLocaleDateString()}</p>
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

export default PrivacyPolicy;