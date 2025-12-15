import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

 // Path to your service account key JSON file
const serviceAccountPath = path.join(__dirname, '../josenleather-firebase-adminsdk-fbsvc-5d6c711192.json');

// Check if service account file exists
if (!fs.existsSync(serviceAccountPath)) {
  console.warn('Firebase service account key file not found at:', serviceAccountPath);
  // Don't throw error in development, just warn
}

let serviceAccount;
try {
  serviceAccount = require(serviceAccountPath);
} catch (error) {
  console.warn('Could not load Firebase service account key:', error.message);
}

// Initialize Firebase Admin if not already initialized and service account is available
if (!admin.apps.length && serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'),
    }),
  });
}

export const sendNotification = async (
  tokens: string | string[],
  title: string,
  body: string,
  data: Record<string, string> = {}
) => {
  try {
    // Check if Firebase Admin is initialized
    if (!admin.apps.length) {
      console.warn('Firebase Admin not initialized, skipping notification');
      return { success: false, error: 'Firebase Admin not initialized' };
    }

    // Ensure tokens is an array
    const tokenArray = Array.isArray(tokens) ? tokens : [tokens];
    
    // Filter out any invalid tokens
    const validTokens = tokenArray.filter(token => typeof token === 'string' && token.trim().length > 0);
    
    if (validTokens.length === 0) {
      console.warn('No valid FCM tokens provided');
      return { success: false, error: 'No valid FCM tokens provided' };
    }

    let successCount = 0;
    let failureCount = 0;
    const failedTokens: string[] = [];

    for (const token of validTokens) {
      try {
        await admin.messaging().send({
          token,
          notification: { title, body },
          data: { ...data, click_action: 'FLUTTER_NOTIFICATION_CLICK' },
        });
        successCount++;
      } catch (error) {
        console.error('Failed to send notification to token:', token, error);
        failedTokens.push(token);
        failureCount++;
      }
    }

    return {
      success: failedTokens.length === 0,
      successCount,
      failureCount,
      failedTokens,
    };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, error: error.message };
  }
};

export const sendToTopic = async (topic: string, title: string, body: string, data?: Record<string, string>) => {
  try {
    const message = {
      notification: { title, body },
      topic,
      data: data || {},
    };

    const response = await admin.messaging().send(message);
    return { success: true, messageId: response };
  } catch (error) {
    console.error('Error sending topic message:', error);
    return { success: false, error: error.message };
  }
};
