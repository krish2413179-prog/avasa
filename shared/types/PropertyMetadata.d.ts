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
    id: string;
    name: string;
    symbol: string;
    contractAddress: string;
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
    propertyType: 'residential' | 'commercial' | 'industrial' | 'hospitality' | 'mixed_use';
    subType: string;
    yearBuilt: number;
    totalSquareFeet: number;
    numberOfUnits?: number;
    ipfsMetadataHash: string;
    images: PropertyImage[];
    documents: PropertyDocument[];
    financials: PropertyFinancials;
    totalShares: number;
    pricePerShare: string;
    minimumInvestment: string;
    annualYieldRate: number;
    isActive: boolean;
    kycRequired: boolean;
    accreditedInvestorOnly: boolean;
    regulatoryCompliance: string[];
    currentOccupancy: number;
    lastRentCollection: string;
    nextYieldDistribution: string;
    marketComparables?: {
        averagePricePerSqFt: string;
        marketCapRate: number;
        marketAppreciation: number;
    };
}
export interface IPFSMetadata {
    name: string;
    description: string;
    image: string;
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
//# sourceMappingURL=PropertyMetadata.d.ts.map