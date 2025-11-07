const bankSigneringApiUrl =
  process.env.BANKID_API_URL || 'http://banksign-test.azurewebsites.net/api';
const apiUser = process.env.BANKID_API_USER || 'testcompany';
const apiPassword = process.env.BANKID_API_KEY || 'cd12a89b-7643-4e22-ae5b-ed0ca67402ec';
const apiCompanyGuid = process.env.BANKID_API_COMPANY || '7e0a62e9-6153-4590-8854-e3fcf0e11699';


const basePayload = {
  apiUser,
  password: apiPassword,
  companyApiGuid: apiCompanyGuid,
};

/**
 * A generic fetch wrapper for the BankSignering API.
 * @param {string} endpoint - The API endpoint to call (e.g., 'sign', 'collectstatus').
 * @param {object} body - The request body.
 * @returns {Promise<object>} The `apiCallResponse` from the API.
 * @throws {Error} If the API call fails or authentication is unsuccessful.
 */
async function fetchBankSignering(endpoint, body) {
  const url = `${bankSigneringApiUrl}/${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // Check content type before parsing
    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`[BANKSIGNERING API] Non-JSON response from ${url}`);
      console.error(`[BANKSIGNERING API] Status: ${response.status}`);
      console.error(`[BANKSIGNERING API] Content-Type: ${contentType}`);
      throw new Error(`BankID API returned non-JSON response (status: ${response.status})`);
    }

    const responseData = await response.json();

    // Handle both response structures:
    // 1. Nested: {"authResponse":{"Success":true},"apiCallResponse":{"Success":true,"Response":{...}}}
    // 2. Flat: {"Success":true,"Response":{...}}
    
    let isSuccess = false;
    let errorMessage = `API call to ${endpoint} failed with status ${response.status}`;
    let responseToReturn = responseData;
    
    if (responseData?.authResponse && responseData?.apiCallResponse) {
      // Nested structure - check both levels
      isSuccess = response.ok && responseData.authResponse.Success && responseData.apiCallResponse.Success;
      errorMessage = responseData.apiCallResponse.StatusMessage || 
                    responseData.authResponse.ErrorMessage || 
                    errorMessage;
      responseToReturn = responseData.apiCallResponse;
    } else if (responseData?.Success !== undefined) {
      // Flat structure
      isSuccess = response.ok && responseData.Success;
      errorMessage = responseData.StatusMessage || responseData.ErrorMessage || errorMessage;
      responseToReturn = responseData;
    }

    if (!isSuccess) {
      throw new Error(errorMessage);
    }

    return responseToReturn;
  } catch (error) {
    console.error(`BankSignering API Error (${endpoint}):`, error.message);
    throw error;
  }
}

export const bankIdAPI = {
  /**
   * Initiates a sign transaction.
   * @param {{endUserIp: string, personalNumber: string, userVisibleData: string}} params
   * @returns {Promise<object>} The response from the 'sign' endpoint.
   */
  sign: async ({ endUserIp, personalNumber, userVisibleData }) => {
    const payload = {
      ...basePayload,
      endUserIp,
      personalNumber,
      userVisibleData,
    };
    return fetchBankSignering('sign', payload);
  },

  /**
   * Collects the status of an ongoing transaction.
   * @param {{orderRef: string}} params
   * @returns {Promise<object>} The response from the 'collectstatus' endpoint.
   */
  collectStatus: async ({ orderRef }) => {
    const payload = { ...basePayload, orderRef };
    return fetchBankSignering('collectstatus', payload);
  },

  /**
   * Collects the QR code for an ongoing transaction.
   * Handles an inconsistency in the test API where the response is not nested.
   * @param {{orderRef: string}} params
   * @returns {Promise<object>} A normalized response object.
   */
  collectQr: async ({ orderRef }) => {
    const payload = { ...basePayload, orderRef };
    const apiCallResponse = await fetchBankSignering('collectqr', payload);

    // The test API for collectqr returns a flat structure inside apiCallResponse,
    // unlike other endpoints. We normalize it here to match the documented structure.
    if (apiCallResponse && !apiCallResponse.Response && apiCallResponse.qrImage) {
      return {
        Success: apiCallResponse.Success,
        StatusMessage: apiCallResponse.StatusMessage || null,
        Response: {
          qrString: apiCallResponse.qrString,
          qrImage: apiCallResponse.qrImage,
        },
      };
    }

    // If the response is already in the correct format (as per docs), return it as is.
    return apiCallResponse;
  },
};
