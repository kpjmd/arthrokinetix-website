#!/usr/bin/env python3
"""
Production Data Analysis Script
Connects to production MongoDB Atlas to analyze article emotional data
"""

import os
import sys
from pymongo import MongoClient
from datetime import datetime
import json

# Production MongoDB connection string (DO NOT COMMIT TO REPO)
PRODUCTION_MONGODB_URI = "mongodb+srv://arthrokinetix-admin:l7XxgoD07VoZVb2c@cluster0.ae8nzzj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

def analyze_production_data():
    """Analyze articles and artworks in production database"""
    
    print("🔍 Connecting to Production MongoDB Atlas...")
    
    try:
        # Connect to production database
        client = MongoClient(PRODUCTION_MONGODB_URI)
        db = client['arthrokinetix']
        
        # Test connection
        client.admin.command('ping')
        print("✅ Successfully connected to production database")
        
        # Analyze articles
        print("\n📚 PRODUCTION ARTICLES ANALYSIS")
        print("=" * 50)
        
        articles = list(db.articles.find({}, {
            'title': 1, 
            'emotional_data': 1, 
            'subspecialty': 1,
            'published_date': 1,
            '_id': 0
        }))
        
        print(f"Total articles found: {len(articles)}")
        
        if articles:
            emotions_count = {}
            for i, article in enumerate(articles, 1):
                title = article.get('title', 'Unknown')[:50]
                emotional_data = article.get('emotional_data', {})
                dominant_emotion = emotional_data.get('dominant_emotion', 'None')
                subspecialty = article.get('subspecialty', 'Unknown')
                
                print(f"{i}. {title}...")
                print(f"   Subspecialty: {subspecialty}")
                print(f"   Dominant Emotion: {dominant_emotion}")
                print(f"   Emotional Data Keys: {list(emotional_data.keys())}")
                print()
                
                # Count emotions
                if dominant_emotion in emotions_count:
                    emotions_count[dominant_emotion] += 1
                else:
                    emotions_count[dominant_emotion] = 1
            
            print("📊 Emotion Distribution:")
            for emotion, count in emotions_count.items():
                print(f"   {emotion}: {count} articles")
        else:
            print("❌ No articles found in production database")
        
        # Analyze artworks
        print("\n🎨 PRODUCTION ARTWORKS ANALYSIS")
        print("=" * 50)
        
        artworks = list(db.artworks.find({}, {
            'title': 1,
            'dominant_emotion': 1,
            'article_id': 1,
            'subspecialty': 1,
            '_id': 0
        }))
        
        print(f"Total artworks found: {len(artworks)}")
        
        if artworks:
            artwork_emotions_count = {}
            for i, artwork in enumerate(artworks, 1):
                title = artwork.get('title', 'Unknown')[:50]
                dominant_emotion = artwork.get('dominant_emotion', 'None')
                subspecialty = artwork.get('subspecialty', 'Unknown')
                article_id = artwork.get('article_id', 'None')
                
                print(f"{i}. {title}...")
                print(f"   Article ID: {article_id}")
                print(f"   Subspecialty: {subspecialty}")
                print(f"   Dominant Emotion: {dominant_emotion}")
                print()
                
                # Count emotions
                if dominant_emotion in artwork_emotions_count:
                    artwork_emotions_count[dominant_emotion] += 1
                else:
                    artwork_emotions_count[dominant_emotion] = 1
            
            print("📊 Artwork Emotion Distribution:")
            for emotion, count in artwork_emotions_count.items():
                print(f"   {emotion}: {count} artworks")
        else:
            print("❌ No artworks found in production database")
        
        # Summary and recommendations
        print("\n🎯 SUMMARY & RECOMMENDATIONS")
        print("=" * 50)
        
        if not articles:
            print("❌ No articles in production - need to add test articles")
            return "add_test_articles"
        
        if len(set(emotions_count.keys())) == 1 and 'confidence' in emotions_count:
            print("❌ All articles show 'confidence' - need varied emotions")
            return "add_varied_emotions"
        
        if len(set(emotions_count.keys())) > 1:
            print("✅ Articles have varied emotions - frontend issue likely")
            return "frontend_issue"
        
        return "unknown_issue"
        
    except Exception as e:
        print(f"❌ Error connecting to production database: {e}")
        return "connection_error"
    
    finally:
        try:
            client.close()
        except:
            pass

def add_test_articles_to_production():
    """Add test articles with varied emotions to production database"""
    
    print("\n🚀 Adding test articles to production database...")
    
    try:
        client = MongoClient(PRODUCTION_MONGODB_URI)
        db = client['arthrokinetix']
        
        # Test articles with varied emotions
        test_articles = [
            {
                'id': 'confidence-test-2025',
                'title': 'Confidence Study: Evidence-Based ACL Protocols',
                'subspecialty': 'sportsMedicine',
                'published_date': datetime.now(),
                'emotional_data': {
                    'hope': 0.4, 'tension': 0.2, 'confidence': 0.9, 'uncertainty': 0.1,
                    'breakthrough': 0.3, 'healing': 0.5, 'dominant_emotion': 'confidence',
                    'evidence_strength': 0.9, 'technical_density': 0.7, 'subspecialty': 'sportsMedicine'
                },
                'evidence_strength': 0.9, 'read_time': 5,
                'content_type': 'text', 'content': 'Test article content for confidence emotion.'
            },
            {
                'id': 'breakthrough-test-2025',
                'title': 'Breakthrough Research: Revolutionary Joint Replacement',
                'subspecialty': 'jointReplacement',
                'published_date': datetime.now(),
                'emotional_data': {
                    'hope': 0.7, 'tension': 0.1, 'confidence': 0.6, 'uncertainty': 0.2,
                    'breakthrough': 0.95, 'healing': 0.4, 'dominant_emotion': 'breakthrough',
                    'evidence_strength': 0.8, 'technical_density': 0.8, 'subspecialty': 'jointReplacement'
                },
                'evidence_strength': 0.8, 'read_time': 7,
                'content_type': 'text', 'content': 'Test article content for breakthrough emotion.'
            },
            {
                'id': 'tension-test-2025',
                'title': 'Tension Analysis: Surgical Complications Review',
                'subspecialty': 'trauma',
                'published_date': datetime.now(),
                'emotional_data': {
                    'hope': 0.2, 'tension': 0.9, 'confidence': 0.4, 'uncertainty': 0.6,
                    'breakthrough': 0.1, 'healing': 0.3, 'dominant_emotion': 'tension',
                    'evidence_strength': 0.7, 'technical_density': 0.9, 'subspecialty': 'trauma'
                },
                'evidence_strength': 0.7, 'read_time': 9,
                'content_type': 'text', 'content': 'Test article content for tension emotion.'
            },
            {
                'id': 'healing-test-2025',
                'title': 'Healing Potential: Regenerative Medicine Advances',
                'subspecialty': 'sportsMedicine',
                'published_date': datetime.now(),
                'emotional_data': {
                    'hope': 0.8, 'tension': 0.2, 'confidence': 0.6, 'uncertainty': 0.3,
                    'breakthrough': 0.4, 'healing': 0.95, 'dominant_emotion': 'healing',
                    'evidence_strength': 0.8, 'technical_density': 0.6, 'subspecialty': 'sportsMedicine'
                },
                'evidence_strength': 0.8, 'read_time': 6,
                'content_type': 'text', 'content': 'Test article content for healing emotion.'
            }
        ]
        
        # Insert articles
        for article in test_articles:
            # Check if article already exists
            existing = db.articles.find_one({'id': article['id']})
            if existing:
                print(f"⚠️  Article {article['id']} already exists, skipping...")
                continue
            
            result = db.articles.insert_one(article)
            print(f"✅ Added article: {article['title']} -> {article['emotional_data']['dominant_emotion']}")
        
        print(f"\n✅ Test articles added successfully!")
        
        # Verify the articles were added
        total_articles = db.articles.count_documents({})
        print(f"📊 Total articles in production: {total_articles}")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ Error adding test articles: {e}")
        return False

if __name__ == "__main__":
    print("🔍 Arthrokinetix Production Data Analysis")
    print("=" * 50)
    
    # Analyze current production data
    result = analyze_production_data()
    
    if result == "add_test_articles" or result == "add_varied_emotions":
        print("\n" + "=" * 50)
        response = input("Would you like to add test articles with varied emotions to production? (y/N): ")
        
        if response.lower() in ['y', 'yes']:
            success = add_test_articles_to_production()
            if success:
                print("\n✅ Production database updated! Check your Vercel deployment now.")
            else:
                print("\n❌ Failed to update production database.")
        else:
            print("\n⚠️  Production database not modified.")
    
    elif result == "frontend_issue":
        print("\n✅ Database has varied emotions. The issue might be in the frontend.")
        print("Check if the frontend is properly fetching from the API or falling back to sample data.")
    
    print("\n🏁 Analysis complete!")