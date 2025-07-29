import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth } from "../services/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const tokenResult = await getIdTokenResult(firebaseUser);
        firebaseUser.token = tokenResult.token; // optional
        firebaseUser.claims = tokenResult.claims; // 👈 this includes email etc.
      }
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};
