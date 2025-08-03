#!/usr/bin/env python3
"""
Simple test to validate algorithm state fixes
Run this after starting the server to ensure the fixes work correctly
"""

import requests
import json

BASE_URL = "http://localhost:8001"

def test_algorithm_state_endpoints():
    """Test the algorithm state endpoints"""
    
    print("🧪 Testing Algorithm State Fixes")
    print("=" * 50)
    
    # Test 1: Get current algorithm state
    print("\n1. Testing current algorithm state endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/algorithm-state")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Current dominant emotion: {data['emotional_state']['dominant_emotion']}")
            print(f"✅ Articles processed: {data.get('articles_processed', 'N/A')}")
        else:
            print(f"❌ Error getting algorithm state: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 2: Validate algorithm state (admin endpoint - requires auth)
    print("\n2. Testing algorithm state validation...")
    try:
        response = requests.get(f"{BASE_URL}/api/admin/validate-algorithm-state")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Validation status: {data['validation_status']}")
            print(f"✅ Dominant emotion matches: {data.get('dominant_emotion_matches', 'N/A')}")
            print(f"✅ Average difference: {data.get('average_difference', 'N/A')}")
            print(f"✅ Recommendation: {data.get('recommendation', 'N/A')}")
        else:
            print(f"⚠️ Validation endpoint error: {response.status_code} (may need admin auth)")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 3: Recalculate algorithm state (admin endpoint)
    print("\n3. Testing algorithm state recalculation...")
    try:
        response = requests.post(f"{BASE_URL}/api/admin/recalculate-algorithm-state")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Recalculation success: {data['success']}")
            print(f"✅ Articles analyzed: {data.get('articles_analyzed', 'N/A')}")
            print(f"✅ New dominant emotion: {data.get('new_dominant_emotion', 'N/A')}")
            print(f"✅ State changed: {data.get('state_changed', 'N/A')}")
        else:
            print(f"⚠️ Recalculation endpoint error: {response.status_code} (may need admin auth)")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 Test Summary:")
    print("- If you see ✅ symbols, the endpoints are working")
    print("- Admin endpoints may show ⚠️ due to authentication requirements")
    print("- Run the recalculation endpoint to fix any algorithm state inaccuracies")
    print("\n📝 Next Steps:")
    print("1. Use admin dashboard to run recalculate-algorithm-state")
    print("2. Compare before/after using validate-algorithm-state")
    print("3. Verify the algorithm state now reflects article emotions accurately")

if __name__ == "__main__":
    test_algorithm_state_endpoints()