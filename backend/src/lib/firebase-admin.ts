import * as admin from 'firebase-admin';

// Load service account from environment variable
let serviceAccount: any = undefined;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error) {
    console.warn('Could not parse FIREBASE_SERVICE_ACCOUNT env variable:', error.message);
  }
} else {
  console.warn('FIREBASE_SERVICE_ACCOUNT env variable not set');
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
