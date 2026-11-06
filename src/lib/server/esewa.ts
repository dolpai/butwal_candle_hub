import { createHmac } from 'node:crypto';
import { env } from '$env/dynamic/private';

const ESEWA_MERCHANT_ID = env.ESEWA_MERCHANT_ID;
const ESEWA_SECRET_KEY = env.ESEWA_SECRET_KEY;
const ESEWA_API_URL = env.ESEWA_API_URL;
const ESEWA_SUCCESS_URL = env.ESEWA_SUCCESS_URL;
const ESEWA_FAILURE_URL = env.ESEWA_FAILURE_URL;

/**
 * eSewa ePay Integration
 *
 * Official docs: https://esewa.com.np/epay
 *
 * Environment variables needed (set in .env):
 * - ESEWA_MERCHANT_ID: Your eSewa merchant ID
 * - ESEWA_SECRET_KEY: Your eSewa secret key for signature generation
 * - ESEWA_API_URL: eSewa API base URL
 *   - Test/Sandbox: https://rc-epay.esewa.com.np
 *   - Production: https://epay.esewa.com.np
 * - ESEWA_SUCCESS_URL: URL to redirect after payment
 * - ESEWA_FAILURE_URL: URL to redirect on payment failure
 */

function getEsewaConfig() {
  return {
    merchantCode: ESEWA_MERCHANT_ID,
    secretKey: ESEWA_SECRET_KEY,
    apiUrl: ESEWA_API_URL || 'https://rc-epay.esewa.com.np',
    successUrl: ESEWA_SUCCESS_URL,
    failureUrl: ESEWA_FAILURE_URL
  };
}

export function isEsewaConfigured(): boolean {
  const config = getEsewaConfig();
  return !!(config.merchantCode && config.secretKey && config.successUrl && config.failureUrl);
}

export function generateEsewaSignature(message: string, secretKey: string): string {
  return createHmac('sha256', secretKey).update(message).digest('base64');
}

export function buildEsewaPaymentParams(params: {
  amount: number;
  transactionUuid: string;
  productServiceCode: string;
}) {
  const config = getEsewaConfig();
  if (!config.merchantCode || !config.secretKey) {
    throw new Error('eSewa is not configured. See .env.example for setup instructions.');
  }

  const { amount, transactionUuid, productServiceCode } = params;

  // Build the signature message
  // Format: total_amount,transaction_uuid,product_code
  const signatureMessage = `${amount},${transactionUuid},${config.merchantCode}`;
  const signature = generateEsewaSignature(signatureMessage, config.secretKey);

  return {
    amount: amount.toString(),
    failure_url: config.failureUrl,
    product_delivery_charge: '0',
    product_service_charge: '0',
    product_code: config.merchantCode,
    signature,
    signed_field_names: 'total_amount,transaction_uuid,product_code',
    success_url: config.successUrl,
    tax_amount: '0',
    total_amount: amount.toString(),
    transaction_uuid: transactionUuid,
    api_url: config.apiUrl,
    product_service_code: productServiceCode
  };
}

export async function verifyEsewaPayment(params: {
  transactionUuid: string;
  amount: number;
  productCode: string;
  referenceId: string;
  signature: string;
  signedFieldNames: string;
}): Promise<{ verified: boolean; error?: string }> {
  const config = getEsewaConfig();

  if (!config.merchantCode || !config.secretKey || !config.apiUrl) {
    return {
      verified: false,
      error: 'eSewa is not configured. Payment verification skipped.'
    };
  }

  try {
    // Verify the signature locally
    const fields = params.signedFieldNames.split(',');
    const messageValues = fields.map((field) => {
      const fieldMap: Record<string, string> = {
        total_amount: params.amount.toString(),
        transaction_uuid: params.transactionUuid,
        product_code: params.productCode,
        reference_id: params.referenceId
      };
      return fieldMap[field] || '';
    });

    const signatureMessage = messageValues.join(',');
    const expectedSignature = generateEsewaSignature(signatureMessage, config.secretKey);

    if (expectedSignature !== params.signature) {
      return { verified: false, error: 'Signature verification failed' };
    }

    // Also verify with eSewa's status check API
    const statusUrl = `${config.apiUrl}/api/epay/transaction/status/`;
    const statusResponse = await fetch(statusUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_code: params.productCode,
        total_amount: params.amount.toString(),
        transaction_uuid: params.transactionUuid
      })
    });

    if (!statusResponse.ok) {
      return { verified: false, error: 'Failed to verify transaction status with eSewa' };
    }

    const statusData = await statusResponse.json();
    if (statusData.status !== 'COMPLETE') {
      return { verified: false, error: `Transaction not complete: ${statusData.status}` };
    }

    return { verified: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { verified: false, error: message };
  }
}
