import { create } from 'ipfs-http-client';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { PropertyMetadata, IPFSMetadata, PropertyImage, PropertyDocument } from '../../../shared/types/PropertyMetadata';

export class IPFSService {
  private pinataApiKey: string;
  private pinataSecretKey: string;
  private pinataJWT: string;

  constructor() {
    this.pinataApiKey = process.env.PINATA_API_KEY || '';
    this.pinataSecretKey = process.env.PINATA_SECRET_KEY || '';
    this.pinataJWT = process.env.PINATA_JWT || '';
  }

  /**
   * Upload JSON metadata to IPFS via Pinata
   */
  async uploadJSON(data: any, name: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', JSON.stringify(data, null, 2), {
        filename: `${name}.json`,
        contentType: 'application/json'
      });

      const metadata = JSON.stringify({
        name: `${name} - PropChain AI Metadata`,
        keyvalues: {
          type: 'property_metadata',
          platform: 'propchain_ai'
        }
      });
      formData.append('pinataMetadata', metadata);

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.pinataJWT}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Pinata upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.IpfsHash;
    } catch (error) {
      console.error('IPFS JSON upload error:', error);
      throw error;
    }
  }

  /**
   * Upload file (image/PDF) to IPFS via Pinata
   */
  async uploadFile(fileBuffer: Buffer, filename: string, contentType: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename,
        contentType
      });

      const metadata = JSON.stringify({
        name: `${filename} - PropChain AI Asset`,
        keyvalues: {
          type: 'property_asset',
          platform: 'propchain_ai'
        }
      });
      formData.append('pinataMetadata', metadata);

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.pinataJWT}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Pinata file upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.IpfsHash;
    } catch (error) {
      console.error('IPFS file upload error:', error);
      throw error;
    }
  }

  /**
   * Generate and upload complete property metadata to IPFS
   */
  async uploadPropertyMetadata(property: PropertyMetadata): Promise<string> {
    // Create NFT-standard metadata
    const ipfsMetadata: IPFSMetadata = {
      name: property.name,
      description: `Tokenized real estate investment in ${property.name}, located in ${property.location.city}, ${property.location.state}. This property offers ${property.annualYieldRate}% annual yield through rental income distribution.`,
      image: property.images.find(img => img.type === 'exterior')?.ipfsHash || '',
      external_url: `https://propchain.ai/property/${property.id}`,
      attributes: [
        { trait_type: 'Property Type', value: property.propertyType },
        { trait_type: 'Location', value: `${property.location.city}, ${property.location.state}` },
        { trait_type: 'Year Built', value: property.yearBuilt },
        { trait_type: 'Square Feet', value: property.totalSquareFeet },
        { trait_type: 'Annual Yield', value: `${property.annualYieldRate}%` },
        { trait_type: 'Cap Rate', value: `${property.financials.capRate}%` },
        { trait_type: 'Occupancy Rate', value: `${property.currentOccupancy}%` },
        { trait_type: 'Total Shares', value: property.totalShares },
        { trait_type: 'Price Per Share', value: `${property.pricePerShare} ETH` }
      ],
      properties: {
        location: property.location,
        financials: property.financials,
        specifications: {
          propertyType: property.propertyType,
          yearBuilt: property.yearBuilt,
          totalSquareFeet: property.totalSquareFeet,
          numberOfUnits: property.numberOfUnits
        }
      }
    };

    // Upload to IPFS
    const ipfsHash = await this.uploadJSON(ipfsMetadata, `property-${property.id}-metadata`);
    return ipfsHash;
  }

  /**
   * Retrieve metadata from IPFS
   */
  async getMetadata(ipfsHash: string): Promise<any> {
    try {
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch IPFS data: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('IPFS retrieval error:', error);
      throw error;
    }
  }

  /**
   * Generate IPFS URL for a hash
   */
  getIPFSUrl(hash: string): string {
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  }

  /**
   * Pin existing IPFS hash to ensure persistence
   */
  async pinHash(ipfsHash: string, name: string): Promise<void> {
    try {
      const data = {
        hashToPin: ipfsHash,
        pinataMetadata: {
          name: `${name} - PropChain AI Pinned`,
          keyvalues: {
            type: 'pinned_content',
            platform: 'propchain_ai'
          }
        }
      };

      const response = await fetch('https://api.pinata.cloud/pinning/pinByHash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.pinataJWT}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Pinata pin failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('IPFS pin error:', error);
      throw error;
    }
  }
}

export const ipfsService = new IPFSService();