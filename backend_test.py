
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

    def test_get_articles_with_filter(self):
        """Test getting articles with subspecialty filter"""
        return self.run_test(
            "Get Articles with Filter",
            "GET",
            "api/articles?subspecialty=sportsMedicine",
            200
        )

    def test_get_artworks(self):
        """Test getting all artworks"""
        return self.run_test(
            "Get Artworks",
            "GET",
            "api/artworks",
            200
        )

    def test_create_article(self):
        """Test creating a new article"""
        test_article = {
            "title": "Test Article: Advances in ACL Reconstruction",
            "content": """
            Recent advances in anterior cruciate ligament (ACL) reconstruction have shown promising results for improved patient outcomes. This study examines the efficacy of a novel surgical technique that incorporates a hybrid graft approach, combining autograft and synthetic reinforcement.

            Methods: 50 patients with complete ACL tears underwent the hybrid reconstruction technique. Patients were evaluated at 3, 6, and 12 months post-surgery using standardized knee function assessments, MRI evaluation, and patient-reported outcome measures.

            Results: At 12-month follow-up, 92% of patients demonstrated excellent knee stability with negative Lachman and pivot shift tests. Return to sport was achieved in 85% of cases within 9 months. Graft incorporation, as assessed by MRI, showed robust vascularization and minimal tunnel widening compared to traditional techniques.

            Conclusion: The hybrid ACL reconstruction technique demonstrates superior outcomes in terms of knee stability, recovery time, and patient satisfaction. Further long-term studies are warranted to assess the durability of these results.
            """,
            "subspecialty": "sportsMedicine"
        }
        
        success, response = self.run_test(
            "Create Article",
            "POST",
            "api/articles",
            200,
            data=test_article
        )
        
        if success and 'article' in response:
            self.test_article_id = response['article']['id']
            self.test_artwork_id = response['artwork']['id']
            print(f"Created test article with ID: {self.test_article_id}")
            print(f"Created test artwork with ID: {self.test_artwork_id}")
            
            # Verify emotional analysis was performed
            if 'emotional_data' in response['article']:
                emotional_data = response['article']['emotional_data']
                print("\nEmotional Analysis Results:")
                print(f"Dominant Emotion: {emotional_data.get('dominant_emotion', 'Not found')}")
                print(f"Hope: {emotional_data.get('hope', 'Not found')}")
                print(f"Confidence: {emotional_data.get('confidence', 'Not found')}")
                print(f"Healing: {emotional_data.get('healing', 'Not found')}")
                print(f"Breakthrough: {emotional_data.get('breakthrough', 'Not found')}")
                print(f"Tension: {emotional_data.get('tension', 'Not found')}")
                print(f"Uncertainty: {emotional_data.get('uncertainty', 'Not found')}")
            
            # Verify signature data was generated
            if 'signature_data' in response['article']:
                signature_data = response['article']['signature_data']
                print("\nVisual Signature Data:")
                print(f"Signature ID: {signature_data.get('id', 'Not found')}")
                print(f"Rarity Score: {signature_data.get('rarity_score', 'Not found')}")
            
            # Verify artwork was generated
            if 'artwork' in response:
                artwork = response['artwork']
                print("\nArtwork Generation:")
                print(f"Artwork ID: {artwork.get('id', 'Not found')}")
                print(f"Title: {artwork.get('title', 'Not found')}")
                print(f"Dominant Emotion: {artwork.get('dominant_emotion', 'Not found')}")
        
        return success, response

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

    def test_get_specific_artwork(self):
        """Test getting a specific artwork by ID"""
        if not self.test_artwork_id:
            print("❌ Cannot test specific artwork - no test artwork created")
            return False, {}
            
        return self.run_test(
            "Get Specific Artwork",
            "GET",
            f"api/artworks/{self.test_artwork_id}",
            200
        )
        
    def test_admin_authentication(self):
        """Test admin authentication endpoint"""
        # Test with correct password
        success_valid, response_valid = self.run_test(
            "Admin Authentication (Valid Password)",
            "POST",
            "api/admin/authenticate",
            200,
            data={"password": "arthrokinetix_admin_2024"}
        )
        
        # Test with incorrect password
        success_invalid, _ = self.run_test(
            "Admin Authentication (Invalid Password)",
            "POST",
            "api/admin/authenticate",
            401,
            data={"password": "wrong_password"}
        )
        
        return success_valid and success_invalid, response_valid
        
    def test_admin_infographics(self):
        """Test admin infographics endpoint"""
        test_infographic = {
            "title": "Test Infographic: ACL Reconstruction Techniques",
            "htmlContent": "<div class='infographic'><h1>ACL Reconstruction</h1><p>This is a test infographic</p></div>",
            "linkedArticleId": self.test_article_id if self.test_article_id else ""
        }
        
        return self.run_test(
            "Admin Infographics",
            "POST",
            "api/admin/infographics",
            200,
            data=test_infographic
        )
        
    def test_admin_artworks(self):
        """Test admin artworks endpoint"""
        # Note: This endpoint expects a file upload which is difficult to test with requests
        # For now, we'll just test the endpoint response without a file
        return self.run_test(
            "Admin Artworks",
            "POST",
            "api/admin/artworks",
            200
        )
        
    # Priority 5 Feature Tests
    
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
        
    def test_newsletter_status(self):
        """Test newsletter subscription status"""
        return self.run_test(
            "Newsletter Status Check",
            "GET",
            f"api/newsletter/status/{self.test_email}",
            200
        )
        
    def test_submit_feedback(self):
        """Test feedback submission"""
        if not self.test_article_id:
            print("❌ Cannot test feedback - no test article created")
            return False, {}
            
        feedback_data = {
            "article_id": self.test_article_id,
            "emotion": "hope",
            "user_email": self.test_email
        }
        
        return self.run_test(
            "Submit Feedback",
            "POST",
            "api/feedback",
            200,
            data=feedback_data
        )
        
    def test_available_signatures(self):
        """Test available signatures endpoint"""
        success, response = self.run_test(
            "Available Signatures",
            "GET",
            "api/signatures/available",
            200
        )
        
        # Store a signature ID for collection test if available
        if success and 'signatures' in response and len(response['signatures']) > 0:
            self.test_signature_id = response['signatures'][0]['id']
            print(f"Found signature ID for testing: {self.test_signature_id}")
            
        return success, response
        
    def test_signature_collection(self):
        """Test signature collection for a user"""
        return self.run_test(
            "User Signature Collection",
            "GET",
            f"api/signatures/collection/{self.test_email}",
            200
        )
        
    def test_algorithm_evolution(self):
        """Test algorithm evolution endpoint"""
        return self.run_test(
            "Algorithm Evolution",
            "GET",
            "api/algorithm/evolution",
            200,
            params={"range": "7d"}
        )
        
    def test_enhanced_search(self):
        """Test enhanced search functionality"""
        return self.run_test(
            "Enhanced Search",
            "GET",
            "api/search",
            200,
            params={"q": "test", "type": "all"}
        )
        
    def test_search_suggestions(self):
        """Test search suggestions endpoint"""
        return self.run_test(
            "Search Suggestions",
            "GET",
            "api/search/suggestions",
            200
        )

    def test_recalculate_algorithm_state(self):
        """Test the recalculate algorithm state endpoint"""
        return self.run_test(
            "Recalculate Algorithm State",
            "POST",
            "api/admin/recalculate-algorithm-state",
            200
        )

    def test_algorithm_state_details(self):
        """Test the algorithm state endpoint and verify the articles_processed count"""
        success, response = self.run_test(
            "Algorithm State Details",
            "GET",
            "api/algorithm-state",
            200
        )
        
        if success:
            # Check if the response contains the expected fields
            if "_id" in response and response["_id"] != "fallback_state":
                print("✅ Algorithm state is not using fallback state")
            else:
                print("❌ Algorithm state is using fallback state")
                success = False
                
            # Check if articles_processed is present and has the expected value
            if "articles_processed" in response:
                articles_count = response["articles_processed"]
                print(f"Articles processed count: {articles_count}")
                
                # Verify that articles_processed is 6 as expected
                if articles_count == 6:
                    print("✅ Articles processed count is correct (6)")
                else:
                    print(f"❌ Articles processed count is incorrect. Expected: 6, Got: {articles_count}")
                    success = False
            else:
                print("❌ articles_processed field not found in response")
                success = False
                
            # Check if emotional_state is present
            if "emotional_state" in response:
                dominant_emotion = response["emotional_state"].get("dominant_emotion")
                print(f"Dominant emotion: {dominant_emotion}")
            else:
                print("❌ emotional_state field not found in response")
                success = False
        
        return success, response

    def test_articles_count(self):
        """Test the articles endpoint and verify the count"""
        success, response = self.run_test(
            "Articles Count",
            "GET",
            "api/articles",
            200
        )
        
        if success and "articles" in response:
            articles_count = len(response["articles"])
            print(f"Number of articles: {articles_count}")
            
            # Verify that there are 6 articles as expected
            if articles_count == 6:
                print("✅ Articles count is correct (6)")
            else:
                print(f"❌ Articles count is incorrect. Expected: 6, Got: {articles_count}")
                success = False
        else:
            print("❌ articles field not found in response")
            success = False
        
        return success, response

def test_search_suggestions(self):
    """Test search suggestions endpoint"""
    return self.run_test(
        "Search Suggestions",
        "GET",
        "api/search/suggestions",
        200
    )

def test_collect_signature(self):
    """Test collecting a signature"""
    if not self.test_signature_id or not self.test_email:
        print("❌ Cannot test signature collection - missing signature ID or email")
        return False, {}
        
    collection_data = {
        "signature_id": self.test_signature_id,
        "user_email": self.test_email
    }
    
    return self.run_test(
        "Collect Signature",
        "POST",
        "api/signatures/collect",
        200,
        data=collection_data
    )

def test_recalculate_algorithm_state(self):
    """Test the recalculate algorithm state endpoint"""
    return self.run_test(
        "Recalculate Algorithm State",
        "POST",
        "api/admin/recalculate-algorithm-state",
        200
    )

def test_algorithm_state_details(self):
    """Test the algorithm state endpoint and verify the articles_processed count"""
    success, response = self.run_test(
        "Algorithm State Details",
        "GET",
        "api/algorithm-state",
        200
    )
    
    if success:
        # Check if the response contains the expected fields
        if "_id" in response and response["_id"] != "fallback_state":
            print("✅ Algorithm state is not using fallback state")
        else:
            print("❌ Algorithm state is using fallback state")
            success = False
            
        # Check if articles_processed is present and has the expected value
        if "articles_processed" in response:
            articles_count = response["articles_processed"]
            print(f"Articles processed count: {articles_count}")
            
            # Verify that articles_processed is 6 as expected
            if articles_count == 6:
                print("✅ Articles processed count is correct (6)")
            else:
                print(f"❌ Articles processed count is incorrect. Expected: 6, Got: {articles_count}")
                success = False
        else:
            print("❌ articles_processed field not found in response")
            success = False
            
        # Check if emotional_state is present
        if "emotional_state" in response:
            dominant_emotion = response["emotional_state"].get("dominant_emotion")
            print(f"Dominant emotion: {dominant_emotion}")
        else:
            print("❌ emotional_state field not found in response")
            success = False
    
    return success, response

def test_articles_count(self):
    """Test the articles endpoint and verify the count"""
    success, response = self.run_test(
        "Articles Count",
        "GET",
        "api/articles",
        200
    )
    
    if success and "articles" in response:
        articles_count = len(response["articles"])
        print(f"Number of articles: {articles_count}")
        
        # Verify that there are 6 articles as expected
        if articles_count == 6:
            print("✅ Articles count is correct (6)")
        else:
            print(f"❌ Articles count is incorrect. Expected: 6, Got: {articles_count}")
            success = False
    else:
        print("❌ articles field not found in response")
        success = False
    
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
    
    # Test feedback submission with Clerk authentication
    if article_success:
        print("\n=== Testing Feedback with Clerk Authentication ===")
        tester.test_feedback_with_clerk_auth()
    
    # Test newsletter subscription (part of email verification flow)
    print("\n=== Testing Newsletter Subscription ===")
    tester.test_newsletter_subscribe()
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    # Return specific information about the algorithm state issue
    if not algorithm_state_success:
        print("\n⚠️ CRITICAL ISSUE: Algorithm state is not working properly.")
        print("This will affect the AlgorithmMoodIndicator display.")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())