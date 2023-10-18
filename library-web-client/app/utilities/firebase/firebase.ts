import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCwMGzeAnjv8DIXIDt7pEc3zGwG4H00NAM",
  authDomain: "library-project-55fa5.firebaseapp.com",
  projectId: "library-project-55fa5",
  appId: "1:308317306257:web:7507cb8a68657d4a48ee30",
  measurementId: "G-X3WP4RPDNJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app);


/**
 * Google sign in popup
 * @returns Promise that resolves user credentials
 */
export function signInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

/**
 * Sign out user
 * @returns Promise that resolves when User is signed out
 */
export function signOut() {
  return auth.signOut();
}

/**
 * Callback on User auth state chagne
 * @returns Function to unsubscribe callback
 */
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}