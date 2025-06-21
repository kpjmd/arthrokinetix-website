import os
import requests
from datetime import datetime
from typing import Optional, Dict, Any, List
import json

class Web3Auth:
    def __init__(self):
        self.alchemy_api_url = os.environ.get('ALCHEMY_API_URL')
        self.erc721_contract = os.environ.get('NFT_CONTRACT_ERC721')
        self.erc1155_contract = os.environ.get('NFT_CONTRACT_ERC1155')
        self.base_chain_id = os.environ.get('BASE_CHAIN_ID', '8453')
        
        if not self.alchemy_api_url:
            print("Warning: ALCHEMY_API_URL not found")
        if not self.erc721_contract:
            print("Warning: NFT_CONTRACT_ERC721 not found")
        if not self.erc1155_contract:
            print("Warning: NFT_CONTRACT_ERC1155 not found")

    async def verify_nft_ownership(self, wallet_address: str) -> Dict[str, Any]:
        """Verify if wallet owns any of our NFTs"""
        try:
            if not self.alchemy_api_url:
                return {"verified": False, "error": "Alchemy API not configured"}

            # Check ERC721 ownership
            erc721_owned = await self._check_erc721_ownership(wallet_address)
            
            # Check ERC1155 ownership  
            erc1155_owned = await self._check_erc1155_ownership(wallet_address)
            
            # Determine verification status
            verified = erc721_owned['balance'] > 0 or erc1155_owned['balance'] > 0
            
            return {
                "verified": verified,
                "wallet_address": wallet_address,
                "erc721_balance": erc721_owned['balance'],
                "erc1155_balance": erc1155_owned['balance'],
                "contracts_owned": self._get_owned_contracts(erc721_owned, erc1155_owned),
                "verification_timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            print(f"NFT verification error: {e}")
            return {
                "verified": False,
                "error": str(e),
                "wallet_address": wallet_address
            }

    async def _check_erc721_ownership(self, wallet_address: str) -> Dict[str, Any]:
        """Check ERC721 token ownership via Alchemy"""
        try:
            # Alchemy API request for ERC721 balance
            payload = {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "alchemy_getTokenBalances",
                "params": [
                    wallet_address,
                    [self.erc721_contract]
                ]
            }
            
            response = requests.post(
                self.alchemy_api_url,
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "result" in data and "tokenBalances" in data["result"]:
                    balances = data["result"]["tokenBalances"]
                    if balances and len(balances) > 0:
                        balance_hex = balances[0].get("tokenBalance", "0x0")
                        balance = int(balance_hex, 16)
                        return {"balance": balance, "contract": self.erc721_contract}
            
            return {"balance": 0, "contract": self.erc721_contract}
            
        except Exception as e:
            print(f"ERC721 check error: {e}")
            return {"balance": 0, "contract": self.erc721_contract, "error": str(e)}

    async def _check_erc1155_ownership(self, wallet_address: str) -> Dict[str, Any]:
        """Check ERC1155 token ownership via Alchemy"""
        try:
            # For ERC1155, we need to check specific token IDs
            # For demo purposes, we'll check token ID 1
            token_id = "1"
            
            payload = {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "alchemy_getTokenBalances",
                "params": [
                    wallet_address,
                    [self.erc1155_contract]
                ]
            }
            
            response = requests.post(
                self.alchemy_api_url,
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "result" in data and "tokenBalances" in data["result"]:
                    balances = data["result"]["tokenBalances"]
                    if balances and len(balances) > 0:
                        balance_hex = balances[0].get("tokenBalance", "0x0")
                        balance = int(balance_hex, 16)
                        return {"balance": balance, "contract": self.erc1155_contract, "token_id": token_id}
            
            return {"balance": 0, "contract": self.erc1155_contract, "token_id": token_id}
            
        except Exception as e:
            print(f"ERC1155 check error: {e}")
            return {"balance": 0, "contract": self.erc1155_contract, "error": str(e)}

    def _get_owned_contracts(self, erc721_data: Dict, erc1155_data: Dict) -> List[str]:
        """Get list of contracts that the wallet owns tokens from"""
        owned = []
        
        if erc721_data.get('balance', 0) > 0:
            owned.append(erc721_data['contract'])
            
        if erc1155_data.get('balance', 0) > 0:
            owned.append(erc1155_data['contract'])
            
        return owned

    def create_user_from_web3_data(self, wallet_address: str, nft_data: Dict[str, Any]) -> Dict[str, Any]:
        """Convert Web3 verification data to our user format"""
        return {
            "id": f"web3_{wallet_address.lower()}",
            "wallet_address": wallet_address.lower(),
            "nft_verified": nft_data.get("verified", False),
            "nft_contracts": nft_data.get("contracts_owned", []),
            "erc721_balance": nft_data.get("erc721_balance", 0),
            "erc1155_balance": nft_data.get("erc1155_balance", 0),
            "created_at": datetime.utcnow(),
            "last_active": datetime.utcnow(),
            "feedback_access": nft_data.get("verified", False),
            "access_type": "nft_verified" if nft_data.get("verified", False) else "web3_connected",
            "verification_data": nft_data,
            "preferences": {
                "algorithm_updates": True,
                "new_articles": True,
                "weekly_digest": True
            }
        }

# Initialize Web3 auth instance
web3_auth = Web3Auth()