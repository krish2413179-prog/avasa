import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { PropertyMetadata } from '../../../shared/types/PropertyMetadata';

export interface InvestmentCertificateData {
  investorAddress: string;
  investorName?: string;
  propertyName: string;
  sharesAmount: string;
  investmentAmount: string;
  transactionHash: string;
  investmentDate: string;
  certificateId: string;
}

export interface SharePurchaseAgreementData {
  investorAddress: string;
  investorName?: string;
  property: PropertyMetadata;
  sharesAmount: string;
  investmentAmount: string;
  pricePerShare: string;
  transactionHash: string;
  agreementDate: string;
  kycVerified: boolean;
  accreditedInvestor: boolean;
}

export class DocumentGenerationService {
  
  /**
   * Generate Investment Certificate PDF
   */
  static async generateInvestmentCertificate(
    data: InvestmentCertificateData
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Header
        doc.fontSize(24)
           .font('Helvetica-Bold')
           .text('PROPCHAIN AI', { align: 'center' })
           .fontSize(18)
           .text('DIGITAL REAL ESTATE INVESTMENT CERTIFICATE', { align: 'center' })
           .moveDown(2);

        // Certificate border
        doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
           .stroke();

        // Certificate content
        doc.fontSize(14)
           .font('Helvetica')
           .text('This certifies that:', { align: 'center' })
           .moveDown(1);

        doc.fontSize(16)
           .font('Helvetica-Bold')
           .text(data.investorName || `Wallet: ${data.investorAddress}`, { align: 'center' })
           .moveDown(1);

        doc.fontSize(14)
           .font('Helvetica')
           .text('is the registered owner of', { align: 'center' })
           .moveDown(1);

        doc.fontSize(18)
           .font('Helvetica-Bold')
           .text(`${data.sharesAmount} SHARES`, { align: 'center' })
           .moveDown(1);

        doc.fontSize(14)
           .font('Helvetica')
           .text(`in the tokenized real estate property:`, { align: 'center' })
           .moveDown(1);

        doc.fontSize(16)
           .font('Helvetica-Bold')
           .text(data.propertyName, { align: 'center' })
           .moveDown(2);

        // Investment details
        doc.fontSize(12)
           .font('Helvetica')
           .text('INVESTMENT DETAILS', { underline: true })
           .moveDown(0.5);

        const details = [
          `Investment Amount: ${data.investmentAmount} ETH`,
          `Shares Acquired: ${data.sharesAmount}`,
          `Investment Date: ${data.investmentDate}`,
          `Transaction Hash: ${data.transactionHash}`,
          `Certificate ID: ${data.certificateId}`
        ];

        details.forEach(detail => {
          doc.text(detail).moveDown(0.3);
        });

        // Legal disclaimer
        doc.moveDown(2)
           .fontSize(10)
           .font('Helvetica')
           .text('LEGAL DISCLAIMER', { underline: true })
           .moveDown(0.5)
           .text('This certificate represents a digital ownership stake in a tokenized real estate asset. ' +
                 'The underlying property is managed by PropChain AI and its authorized partners. ' +
                 'This investment is subject to market risks and regulatory compliance requirements. ' +
                 'The blockchain transaction hash serves as immutable proof of ownership.', 
                 { align: 'justify' })
           .moveDown(1);

        // Signature section
        doc.text('Digitally Signed by PropChain AI Platform', { align: 'right' })
           .text(`Generated on: ${new Date().toISOString()}`, { align: 'right' });

        // QR Code placeholder (would integrate actual QR code library in production)
        doc.rect(450, 650, 100, 100)
           .stroke()
           .fontSize(8)
           .text('QR Code\nVerification', 465, 690, { align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate Share Purchase Agreement PDF
   */
  static async generateSharePurchaseAgreement(
    data: SharePurchaseAgreementData
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Header
        doc.fontSize(20)
           .font('Helvetica-Bold')
           .text('SHARE PURCHASE AGREEMENT', { align: 'center' })
           .moveDown(1);

        doc.fontSize(16)
           .text(data.property.name, { align: 'center' })
           .moveDown(2);

        // Agreement content
        doc.fontSize(12)
           .font('Helvetica')
           .text('PARTIES', { underline: true })
           .moveDown(0.5);

        doc.text('Purchaser:', { continued: true })
           .font('Helvetica-Bold')
           .text(` ${data.investorName || data.investorAddress}`)
           .font('Helvetica')
           .text('Property Issuer:', { continued: true })
           .font('Helvetica-Bold')
           .text(' PropChain AI Platform')
           .moveDown(1);

        // Property details
        doc.font('Helvetica')
           .text('PROPERTY DETAILS', { underline: true })
           .moveDown(0.5);

        const propertyDetails = [
          `Property Name: ${data.property.name}`,
          `Location: ${data.property.location.address}, ${data.property.location.city}, ${data.property.location.state}`,
          `Property Type: ${data.property.propertyType}`,
          `Year Built: ${data.property.yearBuilt}`,
          `Total Square Feet: ${data.property.totalSquareFeet.toLocaleString()}`,
          `Current Valuation: $${(parseInt(data.property.financials.currentValuation) / 1000000).toFixed(1)}M`,
          `Annual Yield Rate: ${data.property.annualYieldRate}%`
        ];

        propertyDetails.forEach(detail => {
          doc.text(detail).moveDown(0.3);
        });

        // Purchase terms
        doc.moveDown(1)
           .text('PURCHASE TERMS', { underline: true })
           .moveDown(0.5);

        const purchaseTerms = [
          `Shares Purchased: ${data.sharesAmount}`,
          `Price Per Share: ${data.pricePerShare} ETH`,
          `Total Investment: ${data.investmentAmount} ETH`,
          `Purchase Date: ${data.agreementDate}`,
          `Blockchain Transaction: ${data.transactionHash}`
        ];

        purchaseTerms.forEach(term => {
          doc.text(term).moveDown(0.3);
        });

        // Compliance section
        doc.moveDown(1)
           .text('COMPLIANCE VERIFICATION', { underline: true })
           .moveDown(0.5);

        doc.text(`KYC Verified: ${data.kycVerified ? 'Yes' : 'No'}`)
           .text(`Accredited Investor: ${data.accreditedInvestor ? 'Yes' : 'No'}`)
           .moveDown(1);

        // Terms and conditions
        doc.text('TERMS AND CONDITIONS', { underline: true })
           .moveDown(0.5);

        const terms = [
          '1. The Purchaser acknowledges that this investment represents fractional ownership in a tokenized real estate asset.',
          '2. Yield distributions are subject to property performance and market conditions.',
          '3. The Purchaser has the right to transfer shares subject to platform terms and regulatory compliance.',
          '4. This agreement is governed by the laws of the jurisdiction where the property is located.',
          '5. Disputes shall be resolved through binding arbitration.',
          '6. The blockchain transaction hash serves as immutable proof of this agreement.'
        ];

        terms.forEach(term => {
          doc.text(term, { align: 'justify' }).moveDown(0.5);
        });

        // Risk disclosure
        doc.moveDown(1)
           .text('RISK DISCLOSURE', { underline: true })
           .moveDown(0.5)
           .text('Real estate investments involve significant risks including but not limited to: ' +
                 'market volatility, liquidity constraints, regulatory changes, property damage, ' +
                 'tenant defaults, and economic downturns. Past performance does not guarantee future results. ' +
                 'The Purchaser should carefully consider their financial situation and risk tolerance.',
                 { align: 'justify' })
           .moveDown(2);

        // Signatures
        doc.text('DIGITAL SIGNATURES', { underline: true })
           .moveDown(1);

        doc.text('Purchaser (Blockchain Address):')
           .font('Helvetica-Bold')
           .text(data.investorAddress)
           .font('Helvetica')
           .moveDown(0.5);

        doc.text('PropChain AI Platform:')
           .font('Helvetica-Bold')
           .text('Digitally signed via smart contract execution')
           .font('Helvetica')
           .moveDown(1);

        doc.text(`Agreement executed on: ${data.agreementDate}`)
           .text(`Blockchain network: Base Sepolia Testnet`)
           .text(`Smart contract: ${data.property.contractAddress}`);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate Property Investment Memorandum PDF
   */
  static async generateInvestmentMemorandum(
    property: PropertyMetadata
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Cover page
        doc.fontSize(24)
           .font('Helvetica-Bold')
           .text('INVESTMENT MEMORANDUM', { align: 'center' })
           .moveDown(2);

        doc.fontSize(20)
           .text(property.name, { align: 'center' })
           .moveDown(1);

        doc.fontSize(14)
           .font('Helvetica')
           .text(`${property.location.city}, ${property.location.state}`, { align: 'center' })
           .moveDown(3);

        // Executive summary
        doc.fontSize(16)
           .font('Helvetica-Bold')
           .text('EXECUTIVE SUMMARY')
           .moveDown(1);

        doc.fontSize(12)
           .font('Helvetica')
           .text(`${property.name} represents a premier ${property.propertyType} investment opportunity ` +
                 `located in ${property.location.city}, ${property.location.state}. This ${property.yearBuilt}-built ` +
                 `property offers investors exposure to a high-quality real estate asset with strong fundamentals ` +
                 `and attractive risk-adjusted returns of ${property.annualYieldRate}% annually.`,
                 { align: 'justify' })
           .moveDown(2);

        // Property overview
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('PROPERTY OVERVIEW')
           .moveDown(1);

        const overview = [
          `Address: ${property.location.address}`,
          `Property Type: ${property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}`,
          `Year Built: ${property.yearBuilt}`,
          `Total Square Feet: ${property.totalSquareFeet.toLocaleString()}`,
          `Number of Units: ${property.numberOfUnits || 'N/A'}`,
          `Current Occupancy: ${property.currentOccupancy}%`
        ];

        doc.fontSize(12)
           .font('Helvetica');
        
        overview.forEach(item => {
          doc.text(item).moveDown(0.3);
        });

        doc.moveDown(1);

        // Financial highlights
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('FINANCIAL HIGHLIGHTS')
           .moveDown(1);

        const financials = [
          `Current Valuation: $${(parseInt(property.financials.currentValuation) / 1000000).toFixed(1)}M`,
          `Monthly Rent Roll: $${(parseInt(property.financials.monthlyRentRoll) / 1000000).toFixed(2)}M`,
          `Net Operating Income: $${(parseInt(property.financials.netOperatingIncome) / 1000000).toFixed(2)}M/month`,
          `Cap Rate: ${property.financials.capRate}%`,
          `Cash-on-Cash Return: ${property.financials.cashOnCashReturn}%`,
          `Annual Yield: ${property.annualYieldRate}%`
        ];

        doc.fontSize(12)
           .font('Helvetica');
        
        financials.forEach(item => {
          doc.text(item).moveDown(0.3);
        });

        doc.addPage();

        // Investment terms
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('INVESTMENT TERMS')
           .moveDown(1);

        const terms = [
          `Total Shares Available: ${property.totalShares.toLocaleString()}`,
          `Price Per Share: ${property.pricePerShare} ETH`,
          `Minimum Investment: ${property.minimumInvestment} ETH`,
          `Target Annual Distribution: ${property.annualYieldRate}%`,
          `KYC Required: ${property.kycRequired ? 'Yes' : 'No'}`,
          `Accredited Investor Only: ${property.accreditedInvestorOnly ? 'Yes' : 'No'}`
        ];

        doc.fontSize(12)
           .font('Helvetica');
        
        terms.forEach(item => {
          doc.text(item).moveDown(0.3);
        });

        doc.moveDown(2);

        // Market analysis
        if (property.marketComparables) {
          doc.fontSize(14)
             .font('Helvetica-Bold')
             .text('MARKET ANALYSIS')
             .moveDown(1);

          doc.fontSize(12)
             .font('Helvetica')
             .text(`The ${property.location.city} market continues to demonstrate strong fundamentals:`)
             .moveDown(0.5);

          const marketData = [
            `Average Price per Sq Ft: $${property.marketComparables.averagePricePerSqFt}`,
            `Market Cap Rate: ${property.marketComparables.marketCapRate}%`,
            `Annual Appreciation: ${property.marketComparables.marketAppreciation}%`
          ];

          marketData.forEach(item => {
            doc.text(`• ${item}`).moveDown(0.3);
          });
        }

        doc.moveDown(2);

        // Risk factors
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('RISK FACTORS')
           .moveDown(1);

        const risks = [
          'Real estate market volatility and cyclical downturns',
          'Interest rate sensitivity affecting property values',
          'Occupancy rate fluctuations and tenant defaults',
          'Regulatory changes affecting real estate investments',
          'Liquidity constraints in tokenized real estate markets',
          'Technology risks associated with blockchain platforms',
          'Concentration risk in single property investment'
        ];

        doc.fontSize(12)
           .font('Helvetica');
        
        risks.forEach(risk => {
          doc.text(`• ${risk}`, { align: 'justify' }).moveDown(0.3);
        });

        doc.moveDown(2);

        // Compliance
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('REGULATORY COMPLIANCE')
           .moveDown(1);

        doc.fontSize(12)
           .font('Helvetica')
           .text(`This investment complies with: ${property.regulatoryCompliance.join(', ')}`)
           .moveDown(2);

        // Disclaimer
        doc.fontSize(10)
           .font('Helvetica-Bold')
           .text('IMPORTANT DISCLAIMER', { align: 'center' })
           .moveDown(0.5);

        doc.font('Helvetica')
           .text('This document is for informational purposes only and does not constitute an offer to sell or ' +
                 'solicitation of an offer to buy securities. Any investment decision should be made based on ' +
                 'careful consideration of the risks involved and consultation with qualified financial advisors. ' +
                 'Past performance does not guarantee future results.',
                 { align: 'justify' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Save PDF to file system
   */
  static async savePDFToFile(pdfBuffer: Buffer, filename: string): Promise<string> {
    const documentsDir = path.join(process.cwd(), 'generated-documents');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(documentsDir)) {
      fs.mkdirSync(documentsDir, { recursive: true });
    }

    const filePath = path.join(documentsDir, filename);
    fs.writeFileSync(filePath, pdfBuffer);
    
    return filePath;
  }

  /**
   * Generate complete investment package (certificate + agreement + memorandum)
   */
  static async generateInvestmentPackage(
    investmentData: SharePurchaseAgreementData
  ): Promise<{
    certificate: Buffer;
    agreement: Buffer;
    memorandum: Buffer;
  }> {
    const certificateData: InvestmentCertificateData = {
      investorAddress: investmentData.investorAddress,
      investorName: investmentData.investorName,
      propertyName: investmentData.property.name,
      sharesAmount: investmentData.sharesAmount,
      investmentAmount: investmentData.investmentAmount,
      transactionHash: investmentData.transactionHash,
      investmentDate: investmentData.agreementDate,
      certificateId: `CERT-${Date.now()}-${investmentData.investorAddress.slice(-6)}`
    };

    const [certificate, agreement, memorandum] = await Promise.all([
      this.generateInvestmentCertificate(certificateData),
      this.generateSharePurchaseAgreement(investmentData),
      this.generateInvestmentMemorandum(investmentData.property)
    ]);

    return {
      certificate,
      agreement,
      memorandum
    };
  }
}

export const documentGenerationService = DocumentGenerationService;