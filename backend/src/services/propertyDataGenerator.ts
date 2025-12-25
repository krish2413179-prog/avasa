import { PropertyMetadata, PropertyImage, PropertyDocument, PropertyFinancials } from '../../../shared/types/PropertyMetadata';
import { ipfsService } from './ipfsService';

export class PropertyDataGenerator {
  
  /**
   * Generate realistic property data with professional descriptions and financials
   */
  static generateEnhancedPropertyData(): PropertyMetadata[] {
    return [
      {
        id: "1",
        name: "Manhattan Luxury Apartments",
        symbol: "MLA",
        contractAddress: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
        location: {
          address: "432 Park Avenue",
          city: "New York",
          state: "NY",
          zipCode: "10022",
          country: "USA",
          coordinates: { lat: 40.7614, lng: -73.9776 }
        },
        propertyType: "residential",
        subType: "luxury_apartments",
        yearBuilt: 2015,
        totalSquareFeet: 125000,
        numberOfUnits: 96,
        ipfsMetadataHash: "", // Will be populated after IPFS upload
        images: [
          {
            type: "exterior",
            title: "Building Exterior - Park Avenue View",
            ipfsHash: "QmExterior1Manhattan", // Mock hash - would be real in production
            description: "Stunning 96-story residential tower designed by Rafael Viñoly",
            uploadDate: new Date().toISOString()
          },
          {
            type: "interior",
            title: "Luxury Penthouse Living Room",
            ipfsHash: "QmInterior1Manhattan",
            description: "Spacious living area with floor-to-ceiling windows and Central Park views",
            uploadDate: new Date().toISOString()
          },
          {
            type: "amenity",
            title: "Private Dining Room",
            ipfsHash: "QmAmenity1Manhattan",
            description: "Exclusive resident dining room with chef services",
            uploadDate: new Date().toISOString()
          }
        ],
        documents: [
          {
            type: "investment_memorandum",
            title: "Manhattan Luxury Apartments - Investment Memorandum",
            ipfsHash: "QmDoc1Manhattan",
            uploadDate: new Date().toISOString(),
            fileSize: 2500000,
            mimeType: "application/pdf"
          },
          {
            type: "legal_agreement",
            title: "Property Purchase Agreement",
            ipfsHash: "QmLegal1Manhattan",
            uploadDate: new Date().toISOString(),
            fileSize: 850000,
            mimeType: "application/pdf"
          }
        ],
        financials: {
          currentValuation: "2500000000", // $2.5B
          lastAppraisalDate: "2024-11-15",
          monthlyRentRoll: "8750000", // $8.75M/month
          occupancyRate: 94.5,
          operatingExpenses: "2100000", // $2.1M/month
          netOperatingIncome: "6650000", // $6.65M/month
          capRate: 3.2,
          cashOnCashReturn: 4.2
        },
        totalShares: 25000000,
        pricePerShare: "0.1",
        minimumInvestment: "1.0",
        annualYieldRate: 4.2,
        isActive: true,
        kycRequired: true,
        accreditedInvestorOnly: true,
        regulatoryCompliance: ["SEC_REG_D", "NY_REAL_ESTATE_LAW"],
        currentOccupancy: 94.5,
        lastRentCollection: "2024-12-01",
        nextYieldDistribution: "2025-01-01",
        marketComparables: {
          averagePricePerSqFt: "2000",
          marketCapRate: 3.5,
          marketAppreciation: 5.2
        }
      },
      {
        id: "2",
        name: "Miami Beach Condos",
        symbol: "MBC",
        contractAddress: "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968",
        location: {
          address: "1500 Ocean Drive",
          city: "Miami Beach",
          state: "FL",
          zipCode: "33139",
          country: "USA",
          coordinates: { lat: 25.7907, lng: -80.1300 }
        },
        propertyType: "residential",
        subType: "beachfront_condos",
        yearBuilt: 2018,
        totalSquareFeet: 85000,
        numberOfUnits: 64,
        ipfsMetadataHash: "",
        images: [
          {
            type: "exterior",
            title: "Oceanfront Building Facade",
            ipfsHash: "QmExterior1Miami",
            description: "Modern glass tower with direct beach access",
            uploadDate: new Date().toISOString()
          },
          {
            type: "interior",
            title: "Ocean View Penthouse",
            ipfsHash: "QmInterior1Miami",
            description: "Panoramic ocean views with private terrace",
            uploadDate: new Date().toISOString()
          }
        ],
        documents: [
          {
            type: "investment_memorandum",
            title: "Miami Beach Condos - Investment Overview",
            ipfsHash: "QmDoc1Miami",
            uploadDate: new Date().toISOString(),
            fileSize: 1800000,
            mimeType: "application/pdf"
          }
        ],
        financials: {
          currentValuation: "1800000000",
          lastAppraisalDate: "2024-10-20",
          monthlyRentRoll: "7650000",
          occupancyRate: 89.2,
          operatingExpenses: "1530000",
          netOperatingIncome: "6120000",
          capRate: 4.1,
          cashOnCashReturn: 5.1
        },
        totalShares: 18000000,
        pricePerShare: "0.1",
        minimumInvestment: "0.5",
        annualYieldRate: 5.1,
        isActive: true,
        kycRequired: true,
        accreditedInvestorOnly: false,
        regulatoryCompliance: ["SEC_REG_D", "FL_CONDO_LAW"],
        currentOccupancy: 89.2,
        lastRentCollection: "2024-12-01",
        nextYieldDistribution: "2025-01-01",
        marketComparables: {
          averagePricePerSqFt: "1200",
          marketCapRate: 4.5,
          marketAppreciation: 8.1
        }
      },
      {
        id: "3",
        name: "Austin Tech Hub Office",
        symbol: "ATHO",
        contractAddress: "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883",
        location: {
          address: "500 W 2nd Street",
          city: "Austin",
          state: "TX",
          zipCode: "78701",
          country: "USA",
          coordinates: { lat: 30.2672, lng: -97.7431 }
        },
        propertyType: "commercial",
        subType: "office_building",
        yearBuilt: 2020,
        totalSquareFeet: 450000,
        numberOfUnits: 1,
        ipfsMetadataHash: "",
        images: [
          {
            type: "exterior",
            title: "Modern Office Tower",
            ipfsHash: "QmExterior1Austin",
            description: "LEED Platinum certified office building in downtown Austin",
            uploadDate: new Date().toISOString()
          },
          {
            type: "interior",
            title: "Tech Company Floor",
            ipfsHash: "QmInterior1Austin",
            description: "Open-plan office space with modern amenities",
            uploadDate: new Date().toISOString()
          }
        ],
        documents: [
          {
            type: "investment_memorandum",
            title: "Austin Tech Hub - Commercial Investment Analysis",
            ipfsHash: "QmDoc1Austin",
            uploadDate: new Date().toISOString(),
            fileSize: 3200000,
            mimeType: "application/pdf"
          }
        ],
        financials: {
          currentValuation: "4200000000",
          lastAppraisalDate: "2024-09-30",
          monthlyRentRoll: "23800000",
          occupancyRate: 96.8,
          operatingExpenses: "4760000",
          netOperatingIncome: "19040000",
          capRate: 5.4,
          cashOnCashReturn: 6.8
        },
        totalShares: 42000000,
        pricePerShare: "0.1",
        minimumInvestment: "2.0",
        annualYieldRate: 6.8,
        isActive: true,
        kycRequired: true,
        accreditedInvestorOnly: true,
        regulatoryCompliance: ["SEC_REG_D", "TX_COMMERCIAL_CODE"],
        currentOccupancy: 96.8,
        lastRentCollection: "2024-12-01",
        nextYieldDistribution: "2025-01-01",
        marketComparables: {
          averagePricePerSqFt: "850",
          marketCapRate: 5.8,
          marketAppreciation: 12.3
        }
      }
      // Add more properties as needed...
    ];
  }

  /**
   * Generate professional investment memorandum content
   */
  static generateInvestmentMemorandum(property: PropertyMetadata): string {
    return `
# INVESTMENT MEMORANDUM
## ${property.name}

### EXECUTIVE SUMMARY
${property.name} represents a premier ${property.propertyType} investment opportunity located in ${property.location.city}, ${property.location.state}. This ${property.yearBuilt}-built property offers investors exposure to a high-quality real estate asset with strong fundamentals and attractive risk-adjusted returns.

### PROPERTY OVERVIEW
- **Address**: ${property.location.address}, ${property.location.city}, ${property.location.state} ${property.location.zipCode}
- **Property Type**: ${property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
- **Year Built**: ${property.yearBuilt}
- **Total Square Feet**: ${property.totalSquareFeet.toLocaleString()} sq ft
- **Number of Units**: ${property.numberOfUnits || 'N/A'}

### FINANCIAL HIGHLIGHTS
- **Current Valuation**: $${(parseInt(property.financials.currentValuation) / 1000000).toFixed(1)}M
- **Monthly Rent Roll**: $${(parseInt(property.financials.monthlyRentRoll) / 1000000).toFixed(2)}M
- **Net Operating Income**: $${(parseInt(property.financials.netOperatingIncome) / 1000000).toFixed(2)}M/month
- **Cap Rate**: ${property.financials.capRate}%
- **Current Occupancy**: ${property.currentOccupancy}%
- **Annual Yield**: ${property.annualYieldRate}%

### INVESTMENT TERMS
- **Total Shares Available**: ${property.totalShares.toLocaleString()}
- **Price Per Share**: ${property.pricePerShare} ETH
- **Minimum Investment**: ${property.minimumInvestment} ETH
- **Target Annual Distribution**: ${property.annualYieldRate}%

### MARKET ANALYSIS
The ${property.location.city} market continues to demonstrate strong fundamentals with:
- Average price per sq ft: $${property.marketComparables?.averagePricePerSqFt}
- Market cap rate: ${property.marketComparables?.marketCapRate}%
- Annual appreciation: ${property.marketComparables?.marketAppreciation}%

### RISK FACTORS
- Real estate market volatility
- Interest rate sensitivity
- Occupancy rate fluctuations
- Regulatory changes
- Liquidity constraints

### COMPLIANCE
This investment complies with: ${property.regulatoryCompliance.join(', ')}

**This document is for informational purposes only and does not constitute an offer to sell or solicitation of an offer to buy securities.**
    `.trim();
  }

  /**
   * Upload all property data to IPFS
   */
  static async uploadPropertyToIPFS(property: PropertyMetadata): Promise<PropertyMetadata> {
    try {
      // Generate and upload investment memorandum
      const memorandum = this.generateInvestmentMemorandum(property);
      const memorandumHash = await ipfsService.uploadJSON(
        { content: memorandum, type: 'investment_memorandum' },
        `${property.id}-memorandum`
      );

      // Update document with real IPFS hash
      const updatedDocuments = property.documents.map(doc => {
        if (doc.type === 'investment_memorandum') {
          return { ...doc, ipfsHash: memorandumHash };
        }
        return doc;
      });

      // Upload main property metadata
      const updatedProperty = { ...property, documents: updatedDocuments };
      const metadataHash = await ipfsService.uploadPropertyMetadata(updatedProperty);

      return {
        ...updatedProperty,
        ipfsMetadataHash: metadataHash
      };
    } catch (error) {
      console.error('Error uploading property to IPFS:', error);
      throw error;
    }
  }
}

export const propertyDataGenerator = PropertyDataGenerator;