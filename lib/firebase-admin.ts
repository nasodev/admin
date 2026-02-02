// admin/lib/firebase-admin.ts
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

let app: App;
let adminAuth: Auth;

function getFirebaseAdmin() {
  if (getApps().length === 0) {
    // 환경변수에서 서비스 계정 정보 가져오기
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    app = initializeApp({
      credential: cert(serviceAccount as Parameters<typeof cert>[0]),
    });
  } else {
    app = getApps()[0];
  }

  adminAuth = getAuth(app);
  return { app, adminAuth };
}

export { getFirebaseAdmin };
