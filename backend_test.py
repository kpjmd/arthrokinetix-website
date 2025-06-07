
import requests
import json
import sys
from datetime import datetime

class ArthrokinetixAPITester:
    def __init__(self, base_url="http://localhost:8001"):
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

    # Run tests for existing endpoints
    print("\n=== Testing Core API Endpoints ===")
    tester.test_root_endpoint()
    tester.test_algorithm_state()
    tester.test_get_articles()
    tester.test_get_articles_with_filter()
    tester.test_get_artworks()
    tester.test_create_article()
    tester.test_get_specific_article()
    tester.test_get_specific_artwork()
    
    # Run tests for new admin endpoints
    print("\n=== Testing Admin API Endpoints ===")
    tester.test_admin_authentication()
    tester.test_admin_infographics()
    tester.test_admin_artworks()

    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())