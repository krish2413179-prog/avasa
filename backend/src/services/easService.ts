import { ethers } from 'ethers';

// EAS Contract ABI (simplified for key functions)
const EAS_ABI = [
  {
    "inputs": [
      {
        "components": [
          { "internalType": "bytes32", "name": "schema", "type": "bytes32" },
          { "components": [
              { "internalType": "address", "name": "recipient", "type": "address" },
              { "internalType": "uint64", "name": "expirationTime", "type": "uint64" },
              { "internalType": "bool", "name": "revocable", "type": "bool" },
              { "internalType": "bytes32", "name": "refUID", "type": "bytes32" },
              { "internalType": "bytes", "name": "data", "type": "bytes" },
              { "internalType": "uint256", "name": "value", "type": "uint256" }
            ], "internalType": "struct AttestationRequestData", "name": "data", "type": "tuple" }
        ], "internalType": "struct AttestationRequest", "name": "request", "type": "tuple"
      }
    ],
    "name": "attest",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bytes32", "name": "uid", "type": "bytes32" }],
    "name": "getAttestation",
    "outputs": [
      {
        "components": [
          { "internalType": "bytes32", "name": "uid", "type": "bytes32" },
          { "internalType": "bytes32", "name": "schema", "type": "bytes32" },
          { "internalType": "uint64", "name": "time", "type": "uint64" },
          { "internalType": "uint64", "name": "expirationTime", "type": "uint64" },
          { "internalType": "uint64", "name": "revocationTime", "type": "uint64" },
          { "internalType": "bytes32", "name": "refUID", "type": "bytes32" },
          { "internalType": "address", "name": "recipient", "type": "address" },
          { "internalType": "address", "name": "attester", "type": "address" },
          { "internalType": "bool", "name": "revocable", "type": "bool" },
          { "internalType": "bytes", "name": "data", "type": "bytes" }
        ],
        "internalType": "struct Attestation",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Schema Registry ABI (simplified)
const SCHEMA_REGISTRY_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "schema", "type": "string" },
      { "internalType": "address", "name": "resolver", "type": "address" },
      { "internalType": "bool", "name": "revocable", "type": "bool" }
    ],
    "name": "register",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Base Sepolia EAS Contract Addresses
const EAS_ADDRESSES = {
  EAS_CONTRACT: "0x4200000000000000000000000000000000000021", // Base Sepolia EAS
  SCHEMA_REGISTRY: "0x4200000000000000000000000000000000000020" // Base Sepolia Schema Registry
};

export interface AttestationData {
  uid: string;
  schema: string;
  recipient: string;
  attester: string;
  time: number;
  expirationTime: number;
  revocationTime: number;
  data: string;
  revocable: boolean;
}

export interface KYCAttestationData {
  isVerified: boolean;
  verificationLevel: 'basic' | 'enhanced' | 'accredited';
  verificationDate: number;
  jurisdiction: string;
  verifierName: string;
}

export interface AccreditedInvestorData {
  isAccredited: boolean;
  accreditationType: 'income' | 'net_worth' | 'professional';
  verificationDate: number;
  expirationDate: number;
  verifierLicense: string;
}

export class EASService {
  private provider: ethers.providers.Provider;
  private easContract: ethers.Contract;
  private schemaRegistry: ethers.Contract;
  private signer?: ethers.Signer;

  // Pre-defined schema UIDs for PropChain AI
  public readonly SCHEMAS = {
    KYC_VERIFICATION: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", // Mock UID
    ACCREDITED_INVESTOR: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890", // Mock UID
    PROPERTY_INVESTMENT: "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456", // Mock UID
    COMPLIANCE_CHECK: "0xcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab" // Mock UID
  };

  constructor(rpcUrl: string, privateKey?: string) {
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    
    if (privateKey) {
      this.signer = new ethers.Wallet(privateKey, this.provider);
      this.easContract = new ethers.Contract(EAS_ADDRESSES.EAS_CONTRACT, EAS_ABI, this.signer);
      this.schemaRegistry = new ethers.Contract(EAS_ADDRESSES.SCHEMA_REGISTRY, SCHEMA_REGISTRY_ABI, this.signer);
    } else {
      this.easContract = new ethers.Contract(EAS_ADDRESSES.EAS_CONTRACT, EAS_ABI, this.provider);
      this.schemaRegistry = new ethers.Contract(EAS_ADDRESSES.SCHEMA_REGISTRY, SCHEMA_REGISTRY_ABI, this.provider);
    }
  }

  /**
   * Create KYC verification attestation
   */
  async createKYCAttestation(
    recipient: string,
    kycData: KYCAttestationData
  ): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer required for creating attestations');
    }

    try {
      // Encode KYC data
      const encodedData = ethers.utils.defaultAbiCoder.encode(
        ['bool', 'string', 'uint256', 'string', 'string'],
        [
          kycData.isVerified,
          kycData.verificationLevel,
          kycData.verificationDate,
          kycData.jurisdiction,
          kycData.verifierName
        ]
      );

      const attestationRequest = {
        schema: this.SCHEMAS.KYC_VERIFICATION,
        data: {
          recipient: recipient,
          expirationTime: 0, // No expiration
          revocable: true,
          refUID: ethers.constants.HashZero,
          data: encodedData,
          value: 0
        }
      };

      const tx = await this.easContract.attest(attestationRequest);
      const receipt = await tx.wait();
      
      // Extract attestation UID from logs
      const attestationUID = receipt.logs[0].topics[1]; // Simplified - would need proper event parsing
      
      return attestationUID;
    } catch (error) {
      console.error('Error creating KYC attestation:', error);
      throw error;
    }
  }

  /**
   * Create accredited investor attestation
   */
  async createAccreditedInvestorAttestation(
    recipient: string,
    investorData: AccreditedInvestorData
  ): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer required for creating attestations');
    }

    try {
      const encodedData = ethers.utils.defaultAbiCoder.encode(
        ['bool', 'string', 'uint256', 'uint256', 'string'],
        [
          investorData.isAccredited,
          investorData.accreditationType,
          investorData.verificationDate,
          investorData.expirationDate,
          investorData.verifierLicense
        ]
      );

      const attestationRequest = {
        schema: this.SCHEMAS.ACCREDITED_INVESTOR,
        data: {
          recipient: recipient,
          expirationTime: investorData.expirationDate,
          revocable: true,
          refUID: ethers.constants.HashZero,
          data: encodedData,
          value: 0
        }
      };

      const tx = await this.easContract.attest(attestationRequest);
      const receipt = await tx.wait();
      
      const attestationUID = receipt.logs[0].topics[1];
      return attestationUID;
    } catch (error) {
      console.error('Error creating accredited investor attestation:', error);
      throw error;
    }
  }

  /**
   * Verify user's KYC status
   */
  async verifyKYCStatus(userAddress: string): Promise<{
    isVerified: boolean;
    verificationLevel?: string;
    attestationUID?: string;
    expirationTime?: number;
  }> {
    try {
      // In a real implementation, you would query for attestations by recipient
      // For now, we'll simulate the verification
      
      // Mock verification - in production, query actual attestations
      const mockVerification = {
        isVerified: true,
        verificationLevel: 'enhanced',
        attestationUID: '0x1234567890abcdef',
        expirationTime: 0
      };

      return mockVerification;
    } catch (error) {
      console.error('Error verifying KYC status:', error);
      return { isVerified: false };
    }
  }

  /**
   * Verify accredited investor status
   */
  async verifyAccreditedStatus(userAddress: string): Promise<{
    isAccredited: boolean;
    accreditationType?: string;
    attestationUID?: string;
    expirationTime?: number;
  }> {
    try {
      // Mock verification - in production, query actual attestations
      const mockAccreditation = {
        isAccredited: true,
        accreditationType: 'net_worth',
        attestationUID: '0xabcdef1234567890',
        expirationTime: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) // 1 year from now
      };

      return mockAccreditation;
    } catch (error) {
      console.error('Error verifying accredited status:', error);
      return { isAccredited: false };
    }
  }

  /**
   * Get attestation by UID
   */
  async getAttestation(uid: string): Promise<AttestationData | null> {
    try {
      const attestation = await this.easContract.getAttestation(uid);
      
      return {
        uid: attestation.uid,
        schema: attestation.schema,
        recipient: attestation.recipient,
        attester: attestation.attester,
        time: Number(attestation.time),
        expirationTime: Number(attestation.expirationTime),
        revocationTime: Number(attestation.revocationTime),
        data: attestation.data,
        revocable: attestation.revocable
      };
    } catch (error) {
      console.error('Error getting attestation:', error);
      return null;
    }
  }

  /**
   * Check if user meets investment requirements
   */
  async checkInvestmentEligibility(
    userAddress: string,
    propertyRequirements: {
      kycRequired: boolean;
      accreditedInvestorOnly: boolean;
      minimumInvestment: string;
    }
  ): Promise<{
    eligible: boolean;
    reasons: string[];
    kycStatus?: any;
    accreditedStatus?: any;
  }> {
    const reasons: string[] = [];
    let eligible = true;

    try {
      // Check KYC requirement
      let kycStatus;
      if (propertyRequirements.kycRequired) {
        kycStatus = await this.verifyKYCStatus(userAddress);
        if (!kycStatus.isVerified) {
          eligible = false;
          reasons.push('KYC verification required');
        }
      }

      // Check accredited investor requirement
      let accreditedStatus;
      if (propertyRequirements.accreditedInvestorOnly) {
        accreditedStatus = await this.verifyAccreditedStatus(userAddress);
        if (!accreditedStatus.isAccredited) {
          eligible = false;
          reasons.push('Accredited investor status required');
        }
      }

      return {
        eligible,
        reasons,
        kycStatus,
        accreditedStatus
      };
    } catch (error) {
      console.error('Error checking investment eligibility:', error);
      return {
        eligible: false,
        reasons: ['Error verifying eligibility']
      };
    }
  }

  /**
   * Create property investment attestation (for compliance tracking)
   */
  async createInvestmentAttestation(
    investor: string,
    propertyAddress: string,
    investmentAmount: string,
    sharesReceived: string
  ): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer required for creating attestations');
    }

    try {
      const encodedData = ethers.utils.defaultAbiCoder.encode(
        ['address', 'uint256', 'uint256', 'uint256'],
        [
          propertyAddress,
          ethers.utils.parseEther(investmentAmount),
          ethers.utils.parseEther(sharesReceived),
          Math.floor(Date.now() / 1000)
        ]
      );

      const attestationRequest = {
        schema: this.SCHEMAS.PROPERTY_INVESTMENT,
        data: {
          recipient: investor,
          expirationTime: 0,
          revocable: false, // Investment records should be permanent
          refUID: ethers.constants.HashZero,
          data: encodedData,
          value: 0
        }
      };

      const tx = await this.easContract.attest(attestationRequest);
      const receipt = await tx.wait();
      
      const attestationUID = receipt.logs[0].topics[1];
      return attestationUID;
    } catch (error) {
      console.error('Error creating investment attestation:', error);
      throw error;
    }
  }
}

export const easService = new EASService(
  process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
  process.env.PRIVATE_KEY
);