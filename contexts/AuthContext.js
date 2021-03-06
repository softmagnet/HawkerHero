import React, { useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase';

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    
    const [currentUser, setCurrentUser] = useState()
    const [currentUserData, setCurrentUserData] = useState({})
    const [loading, setLoading] = useState(true)

    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password)
    }

    function login(email, password) {
         return auth.signInWithEmailAndPassword(email, password)
    }

    function logout() {
        return auth.signOut()
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
            setCurrentUser(user)
            
            //if there's a current user, set up currentUser context
            if (user) {
                const data = await db.collection('users').doc(user.uid).get().then(res => res.data())
                setCurrentUserData(data) 
            }
            
            setLoading(false)
            
        })

        return unsubscribe
      }, [])

    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        currentUserData,
        setCurrentUserData
    }
    
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )

}