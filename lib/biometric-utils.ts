// lib/biometric-utils.ts
// Comprehensive biometric utilities for fingerprint enrollment and authentication

interface FingerprintData {
  templateType: string
  credentialId: string
  algorithm: string
  quality: number
  captureDate: string
  deviceId: string
  publicKey: {
    id: string
    rawId: string
    type: string
    response: {
      attestationObject: string
      clientDataJSON: string
    }
  }
  attestation: string
}

interface EnrollmentResult {
  success: boolean
  credentialId?: string
  fingerprintData?: FingerprintData
  error?: string
}

interface AuthenticationResult {
  success: boolean
  error?: string
}

interface BiometricDeviceInfo {
  supported: boolean
  platformAuthenticator: boolean
  deviceType?: string
}

/**
 * Check if WebAuthn is supported in the current browser
 */
export const isWebAuthnSupported = (): boolean => {
  return !!(window.PublicKeyCredential && navigator.credentials)
}

/**
 * Check if platform authenticator (Windows Hello, Touch ID) is available
 */
export const isPlatformAuthenticatorAvailable = async (): Promise<boolean> => {
  if (!isWebAuthnSupported()) return false
  
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  } catch (error) {
    console.error('Error checking platform authenticator:', error)
    return false
  }
}

/**
 * Enroll fingerprint using WebAuthn
 */
export const enrollFingerprint = async (
  userId: string,
  userName: string,
  userDisplayName: string
): Promise<EnrollmentResult> => {
  try {
    // Check support
    if (!await isPlatformAuthenticatorAvailable()) {
      return {
        success: false,
        error: 'Platform authenticator (fingerprint scanner/Windows Hello) is not available on this device'
      }
    }

    // Generate challenge (should come from server in production)
    const challenge = new Uint8Array(32)
    window.crypto.getRandomValues(challenge)

    // User ID as bytes
    const userIdBytes = new TextEncoder().encode(userId)

    // WebAuthn registration options
    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge: challenge,
      rp: {
        name: "School Management System",
        id: window.location.hostname
      },
      user: {
        id: userIdBytes,
        name: userName,
        displayName: userDisplayName
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },   // ES256
        { type: "public-key", alg: -257 }  // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
        requireResidentKey: false
      },
      timeout: 60000,
      attestation: "direct"
    }

    // Create credential
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions
    }) as PublicKeyCredential | null

    if (!credential) {
      return { success: false, error: 'Failed to create credential' }
    }

    // Extract credential data
    const response = credential.response as AuthenticatorAttestationResponse
    const fingerprintData: FingerprintData = {
      templateType: "webauthn",
      credentialId: credential.id,
      algorithm: "WebAuthn",
      quality: 95,
      captureDate: new Date().toISOString(),
      deviceId: "platform-authenticator",
      publicKey: {
        id: credential.id,
        rawId: arrayBufferToBase64(credential.rawId),
        type: credential.type,
        response: {
          attestationObject: arrayBufferToBase64(response.attestationObject),
          clientDataJSON: arrayBufferToBase64(response.clientDataJSON)
        }
      },
      attestation: "direct"
    }

    return {
      success: true,
      credentialId: credential.id,
      fingerprintData
    }
  } catch (error: any) {
    console.error('Fingerprint enrollment error:', error)
    
    let errorMessage = 'Failed to enroll fingerprint'
    if (error.name === 'NotAllowedError') {
      errorMessage = 'Enrollment was cancelled or not allowed by user'
    } else if (error.name === 'NotSupportedError') {
      errorMessage = 'Biometric authentication is not supported on this device'
    } else if (error.name === 'InvalidStateError') {
      errorMessage = 'A credential already exists for this user'
    }

    return { success: false, error: errorMessage }
  }
}

/**
 * Authenticate using enrolled fingerprint
 */
export const authenticateFingerprint = async (
  credentialId: string,
  rawIdBase64: string
): Promise<AuthenticationResult> => {
  try {
    if (!isWebAuthnSupported()) {
      return { success: false, error: 'WebAuthn is not supported' }
    }

    // Generate challenge
    const challenge = new Uint8Array(32)
    window.crypto.getRandomValues(challenge)

    // Convert base64 credential ID to ArrayBuffer
    const rawId = base64ToArrayBuffer(rawIdBase64)

    // WebAuthn authentication options
    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge: challenge,
      allowCredentials: [{
        id: rawId,
        type: 'public-key',
        transports: ['internal']
      }],
      timeout: 60000,
      userVerification: "required"
    }

    // Get assertion
    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions
    })

    if (!assertion) {
      return { success: false, error: 'Authentication failed' }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Fingerprint authentication error:', error)
    
    let errorMessage = 'Authentication failed'
    if (error.name === 'NotAllowedError') {
      errorMessage = 'Authentication was cancelled or not allowed'
    }

    return { success: false, error: errorMessage }
  }
}

/**
 * Convert ArrayBuffer to Base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

/**
 * Convert Base64 to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

/**
 * Get biometric device information
 */
export const getBiometricDeviceInfo = async (): Promise<BiometricDeviceInfo> => {
  const supported = isWebAuthnSupported()
  const platformAuthenticator = await isPlatformAuthenticatorAvailable()
  
  // Detect device type
  let deviceType = 'unknown'
  if (navigator.userAgent.includes('Windows')) {
    deviceType = 'Windows Hello'
  } else if (navigator.userAgent.includes('Mac')) {
    deviceType = 'Touch ID'
  } else if (navigator.userAgent.includes('Android')) {
    deviceType = 'Android Biometric'
  }

  return { supported, platformAuthenticator, deviceType }
}

/**
 * Format fingerprint data for storage
 */
export const formatFingerprintForStorage = (fingerprintData: FingerprintData): FingerprintData & { storedAt: string } => {
  return {
    ...fingerprintData,
    storedAt: new Date().toISOString()
  }
}

/**
 * Verify fingerprint data integrity
 */
export const verifyFingerprintData = (fingerprintData: any): boolean => {
  if (!fingerprintData) return false
  
  // Check required fields
  const requiredFields = ['templateType', 'credentialId', 'captureDate']
  return requiredFields.every(field => field in fingerprintData)
}

/**
 * For Windows Hello specific integration
 */
export const windowsHelloEnroll = async (userName: string): Promise<EnrollmentResult> => {
  try {
    // Check if Windows Hello is available
    const isAvailable = await isPlatformAuthenticatorAvailable()
    
    if (!isAvailable) {
      throw new Error('Windows Hello is not available on this device')
    }

    // Use the standard WebAuthn enrollment
    return await enrollFingerprint(
      `user-${Date.now()}`,
      userName,
      userName
    )
  } catch (error) {
    console.error('Windows Hello enrollment error:', error)
    throw error
  }
}

// Export all functions as default object
export default {
  isWebAuthnSupported,
  isPlatformAuthenticatorAvailable,
  enrollFingerprint,
  authenticateFingerprint,
  getBiometricDeviceInfo,
  formatFingerprintForStorage,
  verifyFingerprintData,
  windowsHelloEnroll
}