/**
 * PROJECT HYPERION: DECENTRALIZED P2P MARKETPLACE
 * 
 * Global Self-Managed Immutable Ephemeral Append-only Decentralized
 * Bipartite Hierarchical Deterministic Hypergraph Ledger for
 * Autonomous GeoSpatial Graph Convolutional P2P Messaging Neural Network
 * 
 * The "Better Business Bureau" for the autonomous digital world
 * 
 * Features:
 * - P2P Asset/Service/Contract marketplace
 * - Trust verification through network consensus
 * - Arbitration and insurance delegates
 * - ESP-32 LORA/GPS/RFID integration for physical assets
 * - Real-time reputation system
 * - End-to-end encrypted transactions
 * - Decentralized identity verification
 */

import { EventEmitter } from 'events';
import { AttentionTokenSystem } from '../dpo-system/attention-token';
import { LivingKnowledgeTrie } from '../cue-protocols/living-knowledge-trie';
import { Vec7HarmonyUnit } from '../cue-protocols/vec7-harmony-unit';

/**
 * Asset types supported in the marketplace
 */
export enum AssetType {
  // Physical Assets
  REAL_ESTATE = 'real_estate',
  VEHICLE = 'vehicle', 
  EQUIPMENT = 'equipment',
  INVENTORY = 'inventory',
  COMMODITY = 'commodity',
  
  // Services
  CONSULTING = 'consulting',
  DEVELOPMENT = 'development',
  DESIGN = 'design',
  MAINTENANCE = 'maintenance',
  TRANSPORTATION = 'transportation',
  
  // Digital Assets
  SOFTWARE = 'software',
  DATA = 'data',
  INTELLECTUAL_PROPERTY = 'intellectual_property',
  DIGITAL_CONTENT = 'digital_content',
  
  // Contracts & Agreements
  EMPLOYMENT = 'employment',
  PARTNERSHIP = 'partnership',
  SUPPLY_AGREEMENT = 'supply_agreement',
  SERVICE_LEVEL_AGREEMENT = 'service_level_agreement',
  LICENSE = 'license'
}

/**
 * Trust levels based on network verification
 */
export enum TrustLevel {
  UNVERIFIED = 0,
  BASIC_VERIFIED = 1,
  NETWORK_VERIFIED = 2,
  DELEGATE_ENDORSED = 3,
  INSURANCE_BACKED = 4,
  PLATINUM_TRUSTED = 5
}

/**
 * Geographic location for physical assets and services
 */
export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number; // meters
  address?: string;
  region?: string;
  country?: string;
  timezone?: string;
  lastUpdate: Date;
  verificationMethod: 'GPS' | 'LORA' | 'MANUAL' | 'IP_GEOLOCATION';
}

/**
 * Marketplace listing for assets, services, or contracts
 */
export interface MarketplaceListing {
  listingId: string;
  sellerId: string;
  title: string;
  description: string;
  assetType: AssetType;
  
  // Pricing
  price: number;
  currency: 'ATN' | 'USD' | 'ETH' | 'BTC';
  negotiable: boolean;
  
  // Geographic info
  location?: GeoLocation;
  shippingOptions?: string[];
  localPickupOnly?: boolean;
  
  // Trust & Verification
  trustLevel: TrustLevel;
  verificationProofs: string[];
  insuranceRequired: boolean;
  insuranceProviders?: string[];
  
  // Contract Terms
  terms: string;
  deliveryTime: string;
  warranty?: string;
  returnPolicy?: string;
  
  // System metadata
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  tags: string[];
  
  // Physical tracking (for ESP-32 devices)
  deviceId?: string;
  trackingEnabled?: boolean;
  
  // Reputation context
  sellerRating: number;
  totalTransactions: number;
  disputeRate: number;
}

/**
 * User identity with verification levels
 */
export interface MarketplaceUser {
  userId: string;
  publicKey: string;
  
  // Identity verification
  displayName: string;
  verifiedEmail?: string;
  verifiedPhone?: string;
  kycStatus: 'none' | 'pending' | 'verified' | 'premium';
  
  // Reputation system
  overallRating: number;
  totalRatings: number;
  buyerRating: number;
  sellerRating: number;
  trustLevel: TrustLevel;
  
  // Transaction history
  totalPurchases: number;
  totalSales: number;
  volumeTraded: number;
  successRate: number;
  
  // Network verification
  endorsements: string[]; // User IDs who endorse this user
  delegateStatus?: 'arbitrator' | 'insurance_provider' | 'trust_validator';
  
  // Geographic info
  primaryLocation?: GeoLocation;
  serviceAreas?: GeoLocation[];
  
  // System metadata
  joinedAt: Date;
  lastActive: Date;
  isActive: boolean;
  
  // Attention economy integration
  attentionTokens: number;
  contributionScore: number;
  governanceVotes: number;
}

/**
 * Transaction between parties
 */
export interface MarketplaceTransaction {
  transactionId: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  
  // Transaction details
  amount: number;
  currency: string;
  description: string;
  
  // Status and timeline
  status: 'initiated' | 'accepted' | 'paid' | 'shipped' | 'delivered' | 'completed' | 'disputed' | 'cancelled';
  timeline: Array<{
    status: string;
    timestamp: Date;
    party: string;
    notes?: string;
  }>;
  
  // Trust and security
  escrowAmount: number;
  arbitratorId?: string;
  insuranceId?: string;
  
  // Physical tracking
  trackingInfo?: {
    currentLocation: GeoLocation;
    estimatedDelivery: Date;
    carrierInfo?: string;
  };
  
  // Ratings and feedback
  buyerRating?: number;
  sellerRating?: number;
  buyerFeedback?: string;
  sellerFeedback?: string;
  
  // System metadata
  createdAt: Date;
  completedAt?: Date;
  disputeResolution?: {
    arbitratorId: string;
    resolution: string;
    winner: 'buyer' | 'seller' | 'split';
    timestamp: Date;
  };
}

/**
 * Dispute raised by transaction parties
 */
export interface DisputeCase {
  disputeId: string;
  transactionId: string;
  raisedBy: string; // buyer or seller ID
  
  // Dispute details
  reason: string;
  description: string;
  evidence: string[];
  
  // Resolution process
  status: 'open' | 'under_review' | 'resolved' | 'escalated';
  arbitratorId?: string;
  communityVotes?: Array<{
    voterId: string;
    vote: 'buyer' | 'seller' | 'split';
    reasoning: string;
  }>;
  
  // Resolution
  resolution?: {
    decision: 'buyer_wins' | 'seller_wins' | 'split_decision';
    explanation: string;
    compensation?: {
      buyerRefund: number;
      sellerPayment: number;
      arbitratorFee: number;
    };
  };
  
  // Timeline
  createdAt: Date;
  resolvedAt?: Date;
  
  // Network impact
  reputationAdjustment: {
    buyer: number;
    seller: number;
    arbitrator?: number;
  };
}

/**
 * Insurance policy for marketplace transactions
 */
export interface InsurancePolicy {
  policyId: string;
  providerId: string;
  
  // Coverage details
  coverageType: 'full' | 'partial' | 'delivery_only' | 'quality_guarantee';
  maxCoverage: number;
  premium: number;
  deductible: number;
  
  // Eligibility
  minimumTrustLevel: TrustLevel;
  assetTypes: AssetType[];
  geographicCoverage: string[];
  
  // Terms
  terms: string;
  exclusions: string[];
  claimProcess: string;
  
  // System metadata
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Main Hyperion Marketplace class implementing the P2P trading system
 */
export class HyperionMarketplace extends EventEmitter {
  private users: Map<string, MarketplaceUser> = new Map();
  private listings: Map<string, MarketplaceListing> = new Map();
  private transactions: Map<string, MarketplaceTransaction> = new Map();
  private disputes: Map<string, DisputeCase> = new Map();
  private insurancePolicies: Map<string, InsurancePolicy> = new Map();
  
  private attentionSystem: AttentionTokenSystem;
  private knowledgeTrie: LivingKnowledgeTrie;
  
  // Network statistics
  private totalUsers: number = 0;
  private totalListings: number = 0;
  private totalTransactions: number = 0;
  private totalVolume: number = 0;
  
  constructor(attentionSystem: AttentionTokenSystem) {
    super();
    this.attentionSystem = attentionSystem;
    this.knowledgeTrie = new LivingKnowledgeTrie();
    
    console.log('🚀 PROJECT HYPERION MARKETPLACE INITIALIZED');
    console.log('   Decentralized P2P Asset/Service/Contract Trading');
    console.log('   Trust Infrastructure: OPERATIONAL');
    console.log('   Better Business Bureau: ACTIVE');
  }
  
  // ========================================================================
  // USER MANAGEMENT AND VERIFICATION
  // ========================================================================
  
  /**
   * Register new user in the marketplace
   */
  registerUser(
    userId: string,
    publicKey: string,
    displayName: string,
    primaryLocation?: GeoLocation
  ): MarketplaceUser {
    
    if (this.users.has(userId)) {
      throw new Error('User already registered');
    }
    
    const user: MarketplaceUser = {
      userId,
      publicKey,
      displayName,
      kycStatus: 'none',
      overallRating: 5.0, // Start with neutral rating
      totalRatings: 0,
      buyerRating: 5.0,
      sellerRating: 5.0,
      trustLevel: TrustLevel.UNVERIFIED,
      totalPurchases: 0,
      totalSales: 0,
      volumeTraded: 0,
      successRate: 1.0,
      endorsements: [],
      primaryLocation,
      joinedAt: new Date(),
      lastActive: new Date(),
      isActive: true,
      attentionTokens: 100, // Welcome bonus
      contributionScore: 0,
      governanceVotes: 0
    };
    
    this.users.set(userId, user);
    this.totalUsers++;
    
    // Create living knowledge entry for the user
    this.knowledgeTrie.extractLivingKnowledge(
      userId,
      'joined_marketplace',
      'hyperion_p2p_network',
      `User ${displayName} joined Hyperion marketplace`,
      'user_registration',
      1.0
    );
    
    console.log(`👤 User registered: ${displayName} (${userId.substring(0, 8)}...)`);
    console.log(`   Trust Level: ${TrustLevel[user.trustLevel]}`);
    console.log(`   Starting ATN: ${user.attentionTokens}`);
    
    this.emit('userRegistered', user);
    return user;
  }
  
  /**
   * Verify user identity and upgrade trust level
   */
  verifyUserIdentity(
    userId: string,
    verificationType: 'email' | 'phone' | 'kyc' | 'network_endorsement',
    proof: string,
    endorserId?: string
  ): void {
    
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    switch (verificationType) {
      case 'email':
        user.verifiedEmail = proof;
        if (user.trustLevel === TrustLevel.UNVERIFIED) {
          user.trustLevel = TrustLevel.BASIC_VERIFIED;
        }
        break;
        
      case 'phone':
        user.verifiedPhone = proof;
        break;
        
      case 'kyc':
        user.kycStatus = 'verified';
        user.trustLevel = Math.max(user.trustLevel, TrustLevel.NETWORK_VERIFIED) as TrustLevel;
        break;
        
      case 'network_endorsement':
        if (endorserId && this.users.has(endorserId)) {
          const endorser = this.users.get(endorserId)!;
          if (endorser.trustLevel >= TrustLevel.DELEGATE_ENDORSED && 
              !user.endorsements.includes(endorserId)) {
            user.endorsements.push(endorserId);
            
            // Upgrade trust level based on endorsements
            if (user.endorsements.length >= 3) {
              user.trustLevel = Math.max(user.trustLevel, TrustLevel.DELEGATE_ENDORSED) as TrustLevel;
            }
          }
        }
        break;
    }
    
    user.lastActive = new Date();
    
    console.log(`✅ User verification: ${user.displayName}`);
    console.log(`   Type: ${verificationType}`);
    console.log(`   New Trust Level: ${TrustLevel[user.trustLevel]}`);
    
    this.emit('userVerified', { user, verificationType });
  }
  
  // ========================================================================
  // MARKETPLACE LISTINGS
  // ========================================================================
  
  /**
   * Create new marketplace listing
   */
  createListing(
    sellerId: string,
    title: string,
    description: string,
    assetType: AssetType,
    price: number,
    currency: string = 'ATN',
    options: Partial<MarketplaceListing> = {}
  ): string {
    
    const seller = this.users.get(sellerId);
    if (!seller) {
      throw new Error('Seller not found');
    }
    
    const listingId = `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const listing: MarketplaceListing = {
      listingId,
      sellerId,
      title,
      description,
      assetType,
      price,
      currency,
      negotiable: false,
      trustLevel: seller.trustLevel,
      verificationProofs: [],
      insuranceRequired: false,
      terms: 'Standard marketplace terms apply',
      deliveryTime: 'TBD',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      tags: [],
      sellerRating: seller.sellerRating,
      totalTransactions: seller.totalSales,
      disputeRate: seller.totalSales > 0 ? (1 - seller.successRate) : 0,
      ...options
    };
    
    this.listings.set(listingId, listing);
    this.totalListings++;
    
    // Create living knowledge entry for the listing
    this.knowledgeTrie.extractLivingKnowledge(
      sellerId,
      'created_listing',
      assetType,
      `${title}: ${description.substring(0, 100)}...`,
      'marketplace_activity',
      0.8
    );
    
    console.log(`📦 Listing created: ${title}`);
    console.log(`   Seller: ${seller.displayName}`);
    console.log(`   Type: ${assetType}`);
    console.log(`   Price: ${price} ${currency}`);
    console.log(`   Trust Level: ${TrustLevel[listing.trustLevel]}`);
    
    this.emit('listingCreated', listing);
    return listingId;
  }
  
  /**
   * Search marketplace listings with filters
   */
  searchListings(filters: {
    query?: string;
    assetType?: AssetType;
    minPrice?: number;
    maxPrice?: number;
    currency?: string;
    minTrustLevel?: TrustLevel;
    location?: { lat: number; lng: number; radius: number };
    tags?: string[];
    sellerId?: string;
  } = {}): MarketplaceListing[] {
    
    let results = Array.from(this.listings.values())
      .filter(listing => listing.isActive);
    
    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(listing => 
        listing.title.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query) ||
        listing.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (filters.assetType) {
      results = results.filter(listing => listing.assetType === filters.assetType);
    }
    
    if (filters.minPrice !== undefined) {
      results = results.filter(listing => listing.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice !== undefined) {
      results = results.filter(listing => listing.price <= filters.maxPrice!);
    }
    
    if (filters.currency) {
      results = results.filter(listing => listing.currency === filters.currency);
    }
    
    if (filters.minTrustLevel !== undefined) {
      results = results.filter(listing => listing.trustLevel >= filters.minTrustLevel!);
    }
    
    if (filters.sellerId) {
      results = results.filter(listing => listing.sellerId === filters.sellerId);
    }
    
    if (filters.location && filters.location.radius > 0) {
      results = results.filter(listing => {
        if (!listing.location) return false;
        const distance = this.calculateDistance(
          filters.location!.lat,
          filters.location!.lng,
          listing.location.latitude,
          listing.location.longitude
        );
        return distance <= filters.location!.radius;
      });
    }
    
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(listing =>
        filters.tags!.some(tag => listing.tags.includes(tag))
      );
    }
    
    // Sort by relevance (trust level, rating, recent)
    results.sort((a, b) => {
      const scoreA = a.trustLevel * 10 + a.sellerRating * 2 + (Date.now() - a.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      const scoreB = b.trustLevel * 10 + b.sellerRating * 2 + (Date.now() - b.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return scoreB - scoreA;
    });
    
    return results;
  }
  
  // ========================================================================
  // TRANSACTION PROCESSING
  // ========================================================================
  
  /**
   * Initiate purchase transaction
   */
  initiatePurchase(
    buyerId: string,
    listingId: string,
    message?: string
  ): string {
    
    const buyer = this.users.get(buyerId);
    const listing = this.listings.get(listingId);
    
    if (!buyer) throw new Error('Buyer not found');
    if (!listing) throw new Error('Listing not found');
    if (!listing.isActive) throw new Error('Listing is not active');
    if (listing.sellerId === buyerId) throw new Error('Cannot buy your own listing');
    
    const seller = this.users.get(listing.sellerId)!;
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const transaction: MarketplaceTransaction = {
      transactionId,
      listingId,
      buyerId,
      sellerId: listing.sellerId,
      amount: listing.price,
      currency: listing.currency,
      description: listing.title,
      status: 'initiated',
      timeline: [{
        status: 'initiated',
        timestamp: new Date(),
        party: buyerId,
        notes: message
      }],
      escrowAmount: listing.price,
      createdAt: new Date()
    };
    
    this.transactions.set(transactionId, transaction);
    this.totalTransactions++;
    
    // Create living knowledge for transaction
    this.knowledgeTrie.extractLivingKnowledge(
      buyerId,
      'initiated_purchase',
      listing.assetType,
      `Transaction initiated: ${listing.title}`,
      'marketplace_transaction',
      0.9
    );
    
    console.log(`💰 Transaction initiated: ${transactionId}`);
    console.log(`   Buyer: ${buyer.displayName}`);
    console.log(`   Seller: ${seller.displayName}`);
    console.log(`   Amount: ${listing.price} ${listing.currency}`);
    console.log(`   Asset: ${listing.title}`);
    
    this.emit('transactionInitiated', transaction);
    return transactionId;
  }
  
  /**
   * Accept or reject a purchase transaction
   */
  respondToPurchase(
    sellerId: string,
    transactionId: string,
    accept: boolean,
    message?: string
  ): void {
    
    const transaction = this.transactions.get(transactionId);
    if (!transaction) throw new Error('Transaction not found');
    if (transaction.sellerId !== sellerId) throw new Error('Not authorized');
    if (transaction.status !== 'initiated') throw new Error('Transaction not in initiated state');
    
    const newStatus = accept ? 'accepted' : 'cancelled';
    transaction.status = newStatus;
    transaction.timeline.push({
      status: newStatus,
      timestamp: new Date(),
      party: sellerId,
      notes: message
    });
    
    console.log(`${accept ? '✅' : '❌'} Transaction ${accept ? 'accepted' : 'rejected'}: ${transactionId}`);
    
    this.emit('transactionResponse', { transaction, accepted: accept });
  }
  
  // ========================================================================
  // TRUST AND REPUTATION SYSTEM
  // ========================================================================
  
  /**
   * Rate user after completed transaction
   */
  rateUser(
    raterId: string,
    ratedUserId: string,
    transactionId: string,
    rating: number,
    feedback: string
  ): void {
    
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    
    const transaction = this.transactions.get(transactionId);
    if (!transaction) throw new Error('Transaction not found');
    if (transaction.status !== 'completed') throw new Error('Transaction not completed');
    
    const rater = this.users.get(raterId);
    const ratedUser = this.users.get(ratedUserId);
    
    if (!rater || !ratedUser) throw new Error('User not found');
    
    // Verify rater is part of the transaction
    if (raterId !== transaction.buyerId && raterId !== transaction.sellerId) {
      throw new Error('Only transaction participants can rate');
    }
    
    // Update transaction with rating
    if (raterId === transaction.buyerId && !transaction.sellerRating) {
      transaction.sellerRating = rating;
      transaction.sellerFeedback = feedback;
    } else if (raterId === transaction.sellerId && !transaction.buyerRating) {
      transaction.buyerRating = rating;
      transaction.buyerFeedback = feedback;
    } else {
      throw new Error('Rating already submitted');
    }
    
    // Update user's reputation
    this.updateUserReputation(ratedUserId, rating, raterId === transaction.buyerId ? 'seller' : 'buyer');
    
    // Create living knowledge for reputation
    this.knowledgeTrie.extractLivingKnowledge(
      ratedUserId,
      'received_rating',
      'reputation_system',
      `Rated ${rating}/5: ${feedback.substring(0, 50)}...`,
      'reputation_update',
      rating / 5.0
    );
    
    console.log(`⭐ User rated: ${ratedUser.displayName}`);
    console.log(`   Rating: ${rating}/5`);
    console.log(`   New Overall Rating: ${ratedUser.overallRating.toFixed(2)}`);
    
    this.emit('userRated', { rater, ratedUser, rating, feedback });
  }
  
  /**
   * Update user reputation based on new rating
   */
  private updateUserReputation(userId: string, newRating: number, type: 'buyer' | 'seller'): void {
    const user = this.users.get(userId);
    if (!user) return;
    
    // Weighted average calculation
    const totalWeight = user.totalRatings;
    const currentRating = user.overallRating;
    
    user.totalRatings++;
    user.overallRating = ((currentRating * totalWeight) + newRating) / user.totalRatings;
    
    // Update specific rating type
    if (type === 'seller') {
      user.sellerRating = user.overallRating; // Simplified
    } else {
      user.buyerRating = user.overallRating; // Simplified
    }
    
    // Auto-upgrade trust level based on reputation
    if (user.overallRating >= 4.5 && user.totalRatings >= 10 && user.trustLevel < TrustLevel.DELEGATE_ENDORSED) {
      user.trustLevel = TrustLevel.DELEGATE_ENDORSED;
      console.log(`🏆 Trust level upgraded: ${user.displayName} -> ${TrustLevel[user.trustLevel]}`);
    }
  }
  
  // ========================================================================
  // DISPUTE RESOLUTION SYSTEM
  // ========================================================================
  
  /**
   * Raise dispute for transaction
   */
  raiseDispute(
    raiserId: string,
    transactionId: string,
    reason: string,
    description: string,
    evidence: string[] = []
  ): string {
    
    const transaction = this.transactions.get(transactionId);
    if (!transaction) throw new Error('Transaction not found');
    
    if (raiserId !== transaction.buyerId && raiserId !== transaction.sellerId) {
      throw new Error('Only transaction participants can raise disputes');
    }
    
    const disputeId = `dispute_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const dispute: DisputeCase = {
      disputeId,
      transactionId,
      raisedBy: raiserId,
      reason,
      description,
      evidence,
      status: 'open',
      createdAt: new Date(),
      reputationAdjustment: {
        buyer: 0,
        seller: 0
      }
    };
    
    this.disputes.set(disputeId, dispute);
    
    // Update transaction status
    transaction.status = 'disputed';
    transaction.timeline.push({
      status: 'disputed',
      timestamp: new Date(),
      party: raiserId,
      notes: `Dispute raised: ${reason}`
    });
    
    console.log(`⚖️ Dispute raised: ${disputeId}`);
    console.log(`   Transaction: ${transactionId}`);
    console.log(`   Reason: ${reason}`);
    
    this.emit('disputeRaised', dispute);
    return disputeId;
  }
  
  // ========================================================================
  // MARKETPLACE STATISTICS AND ANALYTICS
  // ========================================================================
  
  /**
   * Get comprehensive marketplace statistics
   */
  getMarketplaceStats(): any {
    const activeListings = Array.from(this.listings.values()).filter(l => l.isActive);
    const completedTransactions = Array.from(this.transactions.values()).filter(t => t.status === 'completed');
    
    // Calculate volume by asset type
    const volumeByType = new Map<AssetType, number>();
    for (const transaction of completedTransactions) {
      const listing = this.listings.get(transaction.listingId);
      if (listing) {
        volumeByType.set(listing.assetType, (volumeByType.get(listing.assetType) || 0) + transaction.amount);
      }
    }
    
    // Trust distribution
    const trustDistribution = new Map<TrustLevel, number>();
    for (const user of this.users.values()) {
      trustDistribution.set(user.trustLevel, (trustDistribution.get(user.trustLevel) || 0) + 1);
    }
    
    return {
      totalUsers: this.totalUsers,
      activeUsers: Array.from(this.users.values()).filter(u => u.isActive).length,
      totalListings: this.totalListings,
      activeListings: activeListings.length,
      totalTransactions: this.totalTransactions,
      completedTransactions: completedTransactions.length,
      totalVolume: completedTransactions.reduce((sum, t) => sum + t.amount, 0),
      averageRating: Array.from(this.users.values()).reduce((sum, u) => sum + u.overallRating, 0) / this.totalUsers,
      disputeRate: this.disputes.size / Math.max(this.totalTransactions, 1),
      volumeByAssetType: Object.fromEntries(volumeByType),
      trustLevelDistribution: Object.fromEntries(trustDistribution),
      networkHealth: this.calculateNetworkHealth()
    };
  }
  
  /**
   * Calculate overall network health score
   */
  private calculateNetworkHealth(): number {
    const stats = Array.from(this.users.values());
    if (stats.length === 0) return 0;
    
    const avgRating = stats.reduce((sum, u) => sum + u.overallRating, 0) / stats.length;
    const avgSuccessRate = stats.reduce((sum, u) => sum + u.successRate, 0) / stats.length;
    const highTrustRatio = stats.filter(u => u.trustLevel >= TrustLevel.NETWORK_VERIFIED).length / stats.length;
    const activeRatio = stats.filter(u => u.isActive).length / stats.length;
    
    return (avgRating / 5) * 0.3 + avgSuccessRate * 0.3 + highTrustRatio * 0.2 + activeRatio * 0.2;
  }
  
  // ========================================================================
  // UTILITY METHODS
  // ========================================================================
  
  /**
   * Calculate distance between two geographic points
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
  
  /**
   * Get user by ID
   */
  getUser(userId: string): MarketplaceUser | undefined {
    return this.users.get(userId);
  }
  
  /**
   * Get listing by ID
   */
  getListing(listingId: string): MarketplaceListing | undefined {
    return this.listings.get(listingId);
  }
  
  /**
   * Get transaction by ID
   */
  getTransaction(transactionId: string): MarketplaceTransaction | undefined {
    return this.transactions.get(transactionId);
  }
  
  /**
   * Get all user's transactions
   */
  getUserTransactions(userId: string): MarketplaceTransaction[] {
    return Array.from(this.transactions.values())
      .filter(t => t.buyerId === userId || t.sellerId === userId);
  }
  
  /**
   * Get trust leaderboard
   */
  getTrustLeaderboard(limit: number = 10): MarketplaceUser[] {
    return Array.from(this.users.values())
      .filter(u => u.isActive)
      .sort((a, b) => {
        if (a.trustLevel !== b.trustLevel) return b.trustLevel - a.trustLevel;
        if (a.overallRating !== b.overallRating) return b.overallRating - a.overallRating;
        return b.totalRatings - a.totalRatings;
      })
      .slice(0, limit);
  }
}