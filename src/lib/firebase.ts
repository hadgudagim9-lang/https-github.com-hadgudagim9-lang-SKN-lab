import { initializeApp, getApps } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Save user profile to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName: user.displayName || "Skin Lab Member",
      email: user.email || "",
      photoURL: user.photoURL || "",
      lastLoginAt: new Date().toISOString()
    }, { merge: true });

    return user;
  } catch (error: any) {
    console.error("Google sign in error:", error);
    throw error;
  }
}

export async function logoutUser() {
  return await signOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function saveSkinReportToFirestore(userId: string, reportData: any) {
  try {
    const docRef = await addDoc(collection(db, "reports"), {
      userId,
      reportData,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving report to Firestore:", error);
    throw error;
  }
}

export async function getUserSavedReports(userId: string) {
  try {
    const q = query(
      collection(db, "reports"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const reports: any[] = [];
    querySnapshot.forEach((doc) => {
      reports.push({ id: doc.id, ...doc.data() });
    });
    return reports;
  } catch (error) {
    console.error("Error fetching reports from Firestore:", error);
    return [];
  }
}

export async function saveChatMessageToFirestore(userId: string, sessionId: string, message: { role: 'user' | 'assistant'; text: string; model?: string }) {
  try {
    const chatDocRef = doc(db, "chats", `${userId}_${sessionId}`);
    const docSnap = await getDoc(chatDocRef);
    let messages = [];
    if (docSnap.exists()) {
      messages = docSnap.data().messages || [];
    }
    messages.push({
      ...message,
      timestamp: new Date().toISOString()
    });
    await setDoc(chatDocRef, {
      userId,
      sessionId,
      messages,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error("Error saving chat message to Firestore:", error);
  }
}
