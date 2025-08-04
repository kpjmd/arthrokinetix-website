#!/usr/bin/env python3
"""
Test script to verify the validate algorithm state fix
"""

import requests
import json

def test_validate_endpoint():
    """Test the validate algorithm state endpoint"""
    
    print("🧪 Testing Algorithm State Validation Fix")
    print("=" * 50)
    
    # Test the problematic endpoint
    try:
        response = requests.get("http://localhost:8001/api/admin/validate-algorithm-state")
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ SUCCESS: Endpoint working correctly!")
            print(f"✅ Validation Status: {data.get('validation_status', 'N/A')}")
            print(f"✅ Dominant Match: {data.get('dominant_emotion_matches', 'N/A')}")
            print(f"✅ Average Difference: {data.get('average_difference', 'N/A')}")
            
            # Check if we have emotion differences data
            if 'emotion_differences' in data:
                print("✅ Emotion differences calculated successfully")
                for emotion, diff in data['emotion_differences'].items():
                    print(f"   {emotion}: current={diff['current']}, calculated={diff['calculated']}, diff={diff['difference']}")
            
            # Check recent articles sample
            if 'recent_articles_sample' in data:
                print("✅ Recent articles sample generated successfully")
                for article in data['recent_articles_sample']:
                    print(f"   {article['title']} - {article['dominant_emotion']}")
            
            return True
            
        elif response.status_code == 500:
            try:
                error_data = response.json()
                print(f"❌ 500 ERROR: {error_data.get('detail', 'Unknown error')}")
            except:
                print(f"❌ 500 ERROR: {response.text}")
            return False
            
        else:
            print(f"⚠️ Unexpected status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Make sure the server is running on localhost:8001")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    success = test_validate_endpoint()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 Fix verified! The validate algorithm state endpoint is working.")
        print("You can now use the 'Validate State' button in the admin dashboard.")
    else:
        print("❌ Fix needs more work. Check the server logs for details.")
        print("Make sure the server is running and try again.")