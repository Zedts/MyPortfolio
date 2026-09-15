import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { clientEnv } from '@/lib/env/client';

export const hasFirebaseClientConfig = Boolean(clientEnv?.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

const firebaseConfig = {
    apiKey: clientEnv.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: clientEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: clientEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: clientEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: clientEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: clientEnv.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseClientApp =
    getApps().length > 0 ? getApp() : hasFirebaseClientConfig ? initializeApp(firebaseConfig) : null;

export const firebaseAuth = firebaseClientApp ? getAuth(firebaseClientApp) : null;
export { firebaseClientApp };
