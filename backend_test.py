import requests
import json
import sys
import os
from datetime import datetime

class ArthrokinetixAPITester:
    def __init__(self, base_url=None):
        # Get the backend URL from frontend .env file if not provided
        if not base_url:
            try:
                with open('/app/frontend/.env', 'r') as f:
                    for line in f:
                        if line.startswith('REACT_APP_BACKEND_URL='):
                            base_url = line.strip().split('=', 1)[1]
                            break
            except Exception as e:
                print(f"Error reading frontend .env file: {e}")
            
            # Fallback to default if not found
            if not base_url:
                base_url = 'http://localhost:8001'
        
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_article_id = None
        self.test_artwork_id = None
        self.test_email = f"test_{datetime.now().strftime('%Y%m%d%H%M%S')}@example.com"
        self.test_signature_id = None
        self.test_wallet_address = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"  # Test wallet address

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                return success, response.json() if response.content else {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root endpoint"""
        return self.run_test(
            "Root Endpoint",
            "GET",
            "",
            200
        )

    def test_algorithm_state(self):
        """Test the algorithm state endpoint"""
        return self.run_test(
            "Algorithm State",
            "GET",
            "api/algorithm-state",
            200
        )

    def test_get_articles(self):
        """Test getting all articles"""
        return self.run_test(
            "Get Articles",
            "GET",
            "api/articles",
            200
        )

    def test_create_article(self):
        """Test creating a new article"""
        # The endpoint expects form data, not JSON
        from requests import post
        
        url = f"{self.base_url}/api/articles"
        
        test_article_data = {
            "title": "Test Article: Advances in ACL Reconstruction",
            "subspecialty": "sportsMedicine",
            "content_type": "text",
            "content": """
            Recent advances in anterior cruciate ligament (ACL) reconstruction have shown promising results for improved patient outcomes. This study examines the efficacy of a novel surgical technique that incorporates a hybrid graft approach, combining autograft and synthetic reinforcement.

            Methods: 50 patients with complete ACL tears underwent the hybrid reconstruction technique. Patients were evaluated at 3, 6, and 12 months post-surgery using standardized knee function assessments, MRI evaluation, and patient-reported outcome measures.

            Results: At 12-month follow-up, 92% of patients demonstrated excellent knee stability with negative Lachman and pivot shift tests. Return to sport was achieved in 85% of cases within 9 months. Graft incorporation, as assessed by MRI, showed robust vascularization and minimal tunnel widening compared to traditional techniques.

            Conclusion: The hybrid ACL reconstruction technique demonstrates superior outcomes in terms of knee stability, recovery time, and patient satisfaction. Further long-term studies are warranted to assess the durability of these results.
            """,
            "evidence_strength": 0.85,
            "meta_description": "Exploring the latest advances in ACL reconstruction techniques and their impact on patient outcomes."
        }
        
        self.tests_run += 1
        print(f"\n🔍 Testing Create Article...")
        
        try:
            response = post(url, data=test_article_data)
            
            success = response.status_code == 200
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                response_data = response.json()
                
                if 'article' in response_data:
                    self.test_article_id = response_data['article']['id']
                    self.test_artwork_id = response_data['artwork']['id']
                    print(f"Created test article with ID: {self.test_article_id}")
                    print(f"Created test artwork with ID: {self.test_artwork_id}")
                    
                    # Verify emotional analysis was performed
                    if 'emotional_data' in response_data['article']:
                        emotional_data = response_data['article']['emotional_data']
                        print("\nEmotional Analysis Results:")
                        print(f"Dominant Emotion: {emotional_data.get('dominant_emotion', 'Not found')}")
                        print(f"Hope: {emotional_data.get('hope', 'Not found')}")
                        print(f"Confidence: {emotional_data.get('confidence', 'Not found')}")
                        print(f"Healing: {emotional_data.get('healing', 'Not found')}")
                        print(f"Breakthrough: {emotional_data.get('breakthrough', 'Not found')}")
                        print(f"Tension: {emotional_data.get('tension', 'Not found')}")
                        print(f"Uncertainty: {emotional_data.get('uncertainty', 'Not found')}")
                    
                    # Verify signature data was generated
                    if 'signature_data' in response_data['article']:
                        signature_data = response_data['article']['signature_data']
                        print("\nVisual Signature Data:")
                        print(f"Signature ID: {signature_data.get('id', 'Not found')}")
                        print(f"Rarity Score: {signature_data.get('rarity_score', 'Not found')}")
                    
                    # Verify artwork was generated
                    if 'artwork' in response_data:
                        artwork = response_data['artwork']
                        print("\nArtwork Generation:")
                        print(f"Artwork ID: {artwork.get('id', 'Not found')}")
                        print(f"Title: {artwork.get('title', 'Not found')}")
                        print(f"Dominant Emotion: {artwork.get('dominant_emotion', 'Not found')}")
                
                return success, response_data
            else:
                print(f"❌ Failed - Expected 200, got {response.status_code}")
                print(f"Response: {response.text}")
                return False, {}
                
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_get_specific_article(self):
        """Test getting a specific article by ID"""
        if not self.test_article_id:
            print("❌ Cannot test specific article - no test article created")
            return False, {}
            
        return self.run_test(
            "Get Specific Article",
            "GET",
            f"api/articles/{self.test_article_id}",
            200
        )

    def test_newsletter_subscribe(self):
        """Test newsletter subscription"""
        subscription_data = {
            "email": self.test_email
        }
        
        success, response = self.run_test(
            "Newsletter Subscribe",
            "POST",
            "api/newsletter/subscribe",
            200,
            data=subscription_data
        )
        
        if success:
            print(f"Successfully subscribed email: {self.test_email}")
            print(f"Subscription status: {response.get('status')}")
            
        return success, response
        
    def test_feedback_with_clerk_auth(self):
        """Test feedback submission with Clerk authentication"""
        if not self.test_article_id:
            print("❌ Cannot test feedback - no test article created")
            return False, {}
                
        feedback_data = {
            "article_id": self.test_article_id,
            "emotion": "hope",
            "user_email": self.test_email,
            "clerk_user_id": "user_2NNpCQXMJVdxpuXoHxLwExxxx", # Mock Clerk user ID
            "access_type": "email_verified"
        }
        
        return self.run_test(
            "Submit Feedback with Clerk Auth",
            "POST",
            "api/feedback",
            200,
            data=feedback_data
        )

    def test_feedback_with_web3_auth(self):
        """Test feedback submission with Web3 authentication"""
        if not self.test_article_id:
            print("❌ Cannot test feedback - no test article created")
            return False, {}
                
        feedback_data = {
            "article_id": self.test_article_id,
            "emotion": "confidence",
            "wallet_address": self.test_wallet_address,
            "access_type": "web3_verified"
        }
        
        return self.run_test(
            "Submit Feedback with Web3 Auth",
            "POST",
            "api/feedback",
            200,
            data=feedback_data
        )

    def test_web3_verify_nft(self):
        """Test Web3 NFT verification endpoint"""
        verification_data = {
            "address": self.test_wallet_address
        }
        
        success, response = self.run_test(
            "Web3 NFT Verification",
            "POST",
            "api/web3/verify-nft",
            200,
            data=verification_data
        )
        
        if success:
            print(f"NFT verification result: {response.get('verified', False)}")
            if 'erc721_balance' in response:
                print(f"ERC721 balance: {response.get('erc721_balance')}")
            if 'erc1155_balance' in response:
                print(f"ERC1155 balance: {response.get('erc1155_balance')}")
            
        return success, response

    def test_clerk_webhook(self):
        """Test Clerk webhook endpoint"""
        # This is a simplified test as we can't generate a real Clerk webhook signature
        webhook_data = {
            "type": "user.created",
            "data": {
                "id": "user_2NNpCQXMJVdxpuXoHxLwExxxx",
                "email_addresses": [
                    {"email_address": self.test_email}
                ],
                "first_name": "Test",
                "last_name": "User"
            }
        }
        
        return self.run_test(
            "Clerk Webhook",
            "POST",
            "api/webhooks/clerk",
            200,
            data=webhook_data
        )

    def test_user_profile(self):
        """Test user profile endpoint"""
        return self.run_test(
            "User Profile",
            "GET",
            "api/users/profile?clerk_user_id=user_2NNpCQXMJVdxpuXoHxLwExxxx",
            200
        )

    def test_web3_user_profile(self):
        """Test Web3 user profile endpoint"""
        return self.run_test(
            "Web3 User Profile",
            "GET",
            f"api/web3/user?address={self.test_wallet_address}",
            200
        )

def main():
    # Get the backend URL from frontend .env file
    import os
    
    # Read the REACT_APP_BACKEND_URL from the frontend .env file
    backend_url = None
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    backend_url = line.strip().split('=', 1)[1]
                    break
    except Exception as e:
        print(f"Error reading frontend .env file: {e}")
    
    # Fallback to default if not found
    if not backend_url:
        backend_url = 'http://localhost:8001'
    
    print(f"Testing Arthrokinetix API at: {backend_url}")
    tester = ArthrokinetixAPITester(backend_url)

    # Basic API health check
    print("\n=== Testing API Health ===")
    tester.test_root_endpoint()
    
    # Test algorithm state endpoint (critical for UI)
    print("\n=== Testing Algorithm State ===")
    algorithm_state_success, _ = tester.test_algorithm_state()
    
    # Test articles endpoint
    print("\n=== Testing Articles Endpoint ===")
    tester.test_get_articles()
    
    # Test creating an article (needed for feedback test)
    print("\n=== Testing Article Creation ===")
    article_success, _ = tester.test_create_article()
    
    # Test dual authentication system
    print("\n=== Testing Dual Authentication System ===")
    
    # Test Clerk authentication
    print("\n--- Testing Clerk Email Authentication ---")
    clerk_webhook_success, _ = tester.test_clerk_webhook()
    if not clerk_webhook_success:
        print("⚠️ Clerk webhook endpoint not implemented or not working")
    
    user_profile_success, _ = tester.test_user_profile()
    if not user_profile_success:
        print("⚠️ User profile endpoint not implemented or not working")
    
    # Test Web3 authentication
    print("\n--- Testing Web3 NFT Authentication ---")
    web3_verify_success, _ = tester.test_web3_verify_nft()
    if not web3_verify_success:
        print("⚠️ Web3 NFT verification endpoint not implemented or not working")
    
    web3_user_success, _ = tester.test_web3_user_profile()
    if not web3_user_success:
        print("⚠️ Web3 user profile endpoint not implemented or not working")
    
    # Test feedback submission with both auth methods
    if article_success:
        print("\n=== Testing Dual Feedback System ===")
        
        # Test email auth feedback
        print("\n--- Testing Email Auth Feedback ---")
        email_feedback_success, _ = tester.test_feedback_with_clerk_auth()
        
        # Test Web3 auth feedback
        print("\n--- Testing Web3 Auth Feedback ---")
        web3_feedback_success, _ = tester.test_feedback_with_web3_auth()
        
        if not email_feedback_success and not web3_feedback_success:
            print("⚠️ CRITICAL ISSUE: Both feedback authentication methods are failing")
        elif not email_feedback_success:
            print("⚠️ Email authentication feedback is not working")
        elif not web3_feedback_success:
            print("⚠️ Web3 authentication feedback is not working")
    
    # Test newsletter subscription (part of email verification flow)
    print("\n=== Testing Newsletter Subscription ===")
    tester.test_newsletter_subscribe()
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    # Return specific information about critical issues
    if not algorithm_state_success:
        print("\n⚠️ CRITICAL ISSUE: Algorithm state is not working properly.")
        print("This will affect the AlgorithmMoodIndicator display.")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())