// revenueCatApi.js
import axios from 'axios';

const REVENUECAT_API_BASE_URL = "https://api.revenuecat.com/v1";

export async function getOrCreateSubscriber(apiKey, appUserId) {
  const url = `${REVENUECAT_API_BASE_URL}/subscribers/${appUserId}`;
  
  const headers = {
    accept: 'application/json',
    // 'X-Platform': 'ios', // This header seems to be specific to iOS, adapt if needed
    authorization: `Bearer ${apiKey}`,
  };

  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}
