import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  EmailAuthProvider, 
  linkWithCredential, 
  fetchSignInMethodsForEmail, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';

// Mock config or dynamic imports can be routed nicely.
// Here we write production-ready SDK helpers as requested.

export interface TeacherDetails {
  fullName: string;
  email: string;
  specialty: string;
}

/**
 * Handles account-provider locking.
 * Before letting users register or sign in with an alternative provider,
 * checks if an auth record has already taken this email.
 * If yes, handles blocking to reject unlinked alternatives.
 */
export async function enforceSingleProviderLock(email: string, expectedProvider: string): Promise<void> {
  const auth = getAuth();
  try {
    const providers = await fetchSignInMethodsForEmail(auth, email);
    if (providers.length > 0) {
      // Check if the expected option is already verified
      const providerMapped = providers.map(p => {
        if (p === 'google.com') return 'Google';
        if (p === 'password') return 'Email/Password';
        return p;
      });

      if (!providerMapped.includes(expectedProvider)) {
        throw new Error(
          `IDENTITY_LOCKED: This email (${email}) is already bound to a verified identity using ${providerMapped.join(' or ')}. To protect your student archives, please sign in with your original credentials.`
        );
      }
    }
  } catch (err: any) {
    if (err.message?.includes('IDENTITY_LOCKED')) {
      throw err;
    }
    // Continue if fetchSignInMethodsForEmail fails due to project configuration or support
    console.warn("fetchSignInMethodsForEmail warning:", err);
  }
}

/**
 * Interactive Google Authentication Pipeline
 * Intercepts callback, ensures provider correlation, and detects teacher profile status
 */
export async function signInWithGoogleAndValidate(isTeacherFlow: boolean = false) {
  const auth = getAuth();
  const db = getFirestore();
  const provider = new GoogleAuthProvider();

  // Prefer popup for sandboxed iframe compatibility
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  if (!user.email) {
    throw new Error("No email returned from Google authentication provider.");
  }

  // Enforce single provider lock checks
  await enforceSingleProviderLock(user.email, 'Google');

  if (isTeacherFlow) {
    // Check if Teacher Document already exists
    const teacherDocRef = doc(db, 'teachers', user.uid);
    const docSnap = await getDoc(teacherDocRef);

    if (!docSnap.exists()) {
      // Missing profile details! Trigger mandatory fallback form flow state in UI
      return {
        step: 'COMPLETION_REQUIRED',
        user: {
          uid: user.uid,
          name: user.displayName || '',
          email: user.email,
        }
      };
    } else {
      const teacherData = docSnap.data();
      return {
        step: 'AUTHENTICATED',
        role: 'Teacher',
        isApproved: teacherData.isApproved,
        profile: teacherData
      };
    }
  } else {
    // Student or Parent flow setup
    const userDocRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      // Register new student node
      const newProfile = {
        uid: user.uid,
        name: user.displayName || 'Learner',
        email: user.email,
        role: 'Student',
        grade: 'Grade 8',
        stars: 0,
        streak: 1,
        provider: 'Google',
        createdAt: serverTimestamp()
      };
      await setDoc(userDocRef, newProfile);
      return { step: 'AUTHENTICATED', role: 'Student', profile: newProfile };
    } else {
      return { step: 'AUTHENTICATED', role: userSnap.data().role, profile: userSnap.data() };
    }
  }
}

/**
 * Teacher registration details pipeline fallback submission
 */
export async function completeTeacherRegistration(
  uid: string, 
  details: TeacherDetails, 
  providerType: 'Google' | 'Email/Password'
) {
  const db = getFirestore();
  const teacherDocRef = doc(db, 'teachers', uid);

  const newTeacherProfile = {
    uid: uid,
    name: details.fullName,
    email: details.email,
    specialty: details.specialty,
    isApproved: false, // Default is false, requires founder/admin toggle
    provider: providerType,
    createdAt: serverTimestamp()
  };

  await setDoc(teacherDocRef, newTeacherProfile);

  return {
    success: true,
    isApproved: false,
    profile: newTeacherProfile
  };
}
