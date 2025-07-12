#!/usr/bin/env python3
"""
Script to fix missing signature_data for articles.
Run this after deploying the updated server.py
"""

import requests
import json
import sys

# Configure your backend URL
BACKEND_URL = "http://localhost:8001"  # Change to production URL when ready

def check_signatures():
    """Check which articles are missing signatures"""
    print("🔍 Checking for articles missing signatures...")
    
    try:
        response = requests.get(f"{BACKEND_URL}/api/admin/check-signatures")
        response.raise_for_status()
        data = response.json()
        
        print(f"\n📊 Signature Status:")
        print(f"   Total articles: {data['total_articles']}")
        print(f"   With signatures: {data['with_signatures']}")
        print(f"   Missing signatures: {data['missing_signatures']}")
        
        if data['missing_articles']:
            print(f"\n📋 Articles missing signatures:")
            for article in data['missing_articles']:
                print(f"   - {article['title']} (ID: {article['id']})")
                print(f"     Has images: {article.get('has_images', False)}")
                print(f"     Has emotional data: {article.get('has_emotional_data', False)}")
        
        return data['missing_articles']
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error checking signatures: {e}")
        return []

def fix_specific_article(article_id):
    """Fix signature for a specific article"""
    print(f"\n🔧 Fixing signature for article ID: {article_id}")
    
    try:
        response = requests.post(f"{BACKEND_URL}/api/admin/articles/{article_id}/fix-signature")
        response.raise_for_status()
        data = response.json()
        
        if data['status'] == 'fixed':
            print(f"✅ Successfully fixed signature!")
            print(f"   Signature ID: {data['signature_data']['id']}")
        elif data['status'] == 'already_exists':
            print(f"ℹ️  Article already has signature")
            print(f"   Signature ID: {data['signature_id']}")
        
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fixing article: {e}")
        if hasattr(e.response, 'json'):
            print(f"   Details: {e.response.json()}")
        return False

def fix_all_missing():
    """Fix all articles missing signatures"""
    print("\n🔧 Fixing ALL articles missing signatures...")
    
    try:
        response = requests.post(f"{BACKEND_URL}/api/admin/fix-signatures")
        response.raise_for_status()
        data = response.json()
        
        print(f"\n✅ Batch fix complete!")
        print(f"   Total missing: {data['total_missing']}")
        print(f"   Fixed: {data['fixed']}")
        print(f"   Failed: {data['failed']}")
        
        if data['results']:
            print(f"\n📋 Detailed results:")
            for result in data['results']:
                status_icon = "✅" if result['status'] == 'fixed' else "❌"
                print(f"   {status_icon} {result['title']} - {result['status']}")
                if result.get('signature_id'):
                    print(f"      Signature ID: {result['signature_id']}")
                if result.get('reason'):
                    print(f"      Reason: {result['reason']}")
                if result.get('error'):
                    print(f"      Error: {result['error']}")
        
        return data
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error in batch fix: {e}")
        if hasattr(e.response, 'json'):
            print(f"   Details: {e.response.json()}")
        return None

def main():
    """Main function"""
    print("🎯 Arthrokinetix Signature Fix Tool")
    print("=" * 50)
    
    # Check current status
    missing_articles = check_signatures()
    
    if not missing_articles:
        print("\n✅ All articles have signatures!")
        return
    
    # Look for biceps article specifically
    biceps_article = None
    for article in missing_articles:
        if 'biceps' in article['title'].lower():
            biceps_article = article
            break
    
    if biceps_article:
        print(f"\n🎯 Found Biceps article: {biceps_article['title']}")
        print("Do you want to fix just this article? (y/n): ", end="")
        
        if input().lower() == 'y':
            fix_specific_article(biceps_article['id'])
            return
    
    # Ask to fix all
    print(f"\n⚠️  Found {len(missing_articles)} articles missing signatures")
    print("Do you want to fix ALL missing signatures? (y/n): ", end="")
    
    if input().lower() == 'y':
        fix_all_missing()
    else:
        print("Cancelled.")

if __name__ == "__main__":
    # Allow passing backend URL as argument
    if len(sys.argv) > 1:
        BACKEND_URL = sys.argv[1]
        print(f"Using backend URL: {BACKEND_URL}")
    
    main()