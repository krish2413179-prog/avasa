// Enhanced Property Metadata Types for Production-Grade RWA Platform

export interface PropertyDocument {
  type: 'investment_memorandum' | 'legal_agreement' | 'property_report' | 'financial_statement';
  title: string;
  ipfsHash: string;
  uploadDate: string;
  fileSize: number;
  mimeType: string;
}

export interface PropertyImage {
  type: 'exterior' | 'interior' | 'amenity' | 'neighborhood' | 'floorplan';
  title: string;
  ipfsHash: string;
  description: string;
  uploadDate: string;
}

export interface PropertyFinancials {
  currentValuation: string;
  lastAppraisalDate: string;
  monthlyRentRoll: string;
  occupancyRate: number;
  operatingExpenses: string;
  netOperatingIncome: string;
  capRate: number;
  cashOnCashReturn: number;
}

export interface PropertyMetadata {
  // Basic Info
  id: string;
  name: string;
  symbol: string;
  contractAddress: string;
  
  // Location & Property Details
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Property Specifications
  propertyType: 'residential' | 'commercial' | 'industrial' | 'hospitality' | 'mixed_use';
  subType: string; // e.g., "luxury_apartments", "office_building", "warehouse"
  yearBuilt: number;
  totalSquareFeet: number;
  numberOfUnits?: number;
  
  // IPFS Metadata
  ipfsMetadataHash: string; // Main metadata JSON on IPFS
  images: PropertyImage[];
  documents: PropertyDocument[];
  
  // Financial Data
  financials: PropertyFinancials;
  
  // Investment Terms
  totalShares: number;
  pricePerShare: string; // in ETH
  minimumInvestment: string;
  annualYieldRate: number;
  
  // Status & Compliance
  isActive: boolean;
  kycRequired: boolean;
  accreditedInvestorOnly: boolean;
  regulatoryCompliance: string[];
  
  // Real-time Data
  currentOccupancy: number;
  lastRentCollection: string;
  nextYieldDistribution: string;
  
  // Market Data
  marketComparables?: {
    averagePricePerSqFt: string;
    marketCapRate: number;
    marketAppreciation: number;
  };
}

export interface IPFSMetadata {
  name: string;
  description: string;
  image: string; // Main property image IPFS hash
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties: {
    location: PropertyMetadata['location'];
    financials: PropertyFinancials;
    specifications: {
      propertyType: string;
      yearBuilt: number;
      totalSquareFeet: number;
      numberOfUnits?: number;
    };
  };
}