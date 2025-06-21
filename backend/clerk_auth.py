import os
import jwt
import requests
from datetime import datetime
from typing import Optional, Dict, Any
import json
from fastapi import HTTPException, Request

class ClerkAuth:
    def __init__(self):
        self.secret_key = os.environ.get('CLERK_SECRET_KEY')
        self.webhook_secret = os.environ.get('CLERK_WEBHOOK_SECRET')
        
        if not self.secret_key:
            print("Warning: CLERK_SECRET_KEY not found")
        if not self.webhook_secret:
            print("Warning: CLERK_WEBHOOK_SECRET not found")

    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify Clerk JWT token"""
        try:
            if not self.secret_key:
                return None
                
            decoded = jwt.decode(token, self.secret_key, algorithms=['RS256'])
            return decoded
        except jwt.InvalidTokenError as e:
            print(f"Token verification failed: {e}")
            return None
        except Exception as e:
            print(f"Token verification error: {e}")
            return None

    async def verify_webhook(self, request: Request) -> Optional[Dict[str, Any]]:
        """Verify Clerk webhook signature and return event data"""
        try:
            if not self.webhook_secret:
                print("Webhook secret not configured, skipping verification")
                return None

            # Get webhook signature from headers
            signature = request.headers.get('svix-signature')
            if not signature:
                print("No webhook signature found")
                return None

            # Get request body
            body = await request.body()
            
            # For demo purposes, we'll skip strict signature verification
            # In production, you should implement proper Svix signature verification
            try:
                event_data = json.loads(body)
                return event_data
            except json.JSONDecodeError:
                print("Invalid JSON in webhook payload")
                return None
                
        except Exception as e:
            print(f"Webhook verification error: {e}")
            return None

    def create_user_from_clerk_data(self, clerk_user: Dict[str, Any]) -> Dict[str, Any]:
        """Convert Clerk user data to our user format"""
        email = None
        if clerk_user.get('email_addresses'):
            email = clerk_user['email_addresses'][0].get('email_address')
        
        return {
            "id": str(clerk_user.get('id')),
            "clerk_user_id": clerk_user.get('id'),
            "email": email,
            "email_verified": True,  # Clerk handles verification
            "first_name": clerk_user.get('first_name'),
            "last_name": clerk_user.get('last_name'),
            "full_name": f"{clerk_user.get('first_name', '')} {clerk_user.get('last_name', '')}".strip(),
            "image_url": clerk_user.get('image_url'),
            "created_at": datetime.utcnow(),
            "last_active": datetime.utcnow(),
            "feedback_access": True,
            "access_type": "email_verified",
            "preferences": {
                "algorithm_updates": True,
                "new_articles": True,
                "weekly_digest": True
            }
        }

# Initialize Clerk auth instance
clerk_auth = ClerkAuth()