import React, { createContext, useState, useEffect, useReducer } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface AuthUser {
  userName: string
  email: string
}

export interface UserContextType {
  user: AuthUser | null
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>
  login: ({ email, password }) => void
  isLoading: boolean
  userToken: any
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>
}

interface UserContextProviderType {
  children: React.ReactNode
}

export const AuthContext = createContext({} as UserContextType)

export const AuthProvider = ({ children }: UserContextProviderType) => {
  const [isLoading, setIsLoading] = useState(false)
  const [userToken, setUserToken] = useState('hh')
  const [user, setUser] = useState<AuthUser | null>(null)

  // LOG IN FUNCTION
  const login = async ({ email, password }: any) => {
    const userData = {
      email,
      password
    }
    // console.log(userData)

    try {
      AsyncStorage.setItem('userToken', 'gaga')

      setUser(user)
      setIsLoading(false)
    } catch (error) {
      console.error('Login failed: ', error)
    }
  }

  // REGISTER FUNCTION - SAVE TOKEN IN LOCAL STORAGE
  // const register = async ({ email, password }: any) => {

  //   const userData = {
  //     email: email,
  //     password: password,
  //   };
  //   // console.log(userData)

  //   try {
  //     const data = await LogIn(userData)

  //     if (data) {
  //       // Check for valid token and user data
  //       const token = data.token;
  //       const user = data.user;

  //       AsyncStorage.setItem('userToken', token);
  //       // setUserToken(token);
  //       setUser(user);
  //       setIsLoading(false);
  //     }

  //   } catch (error) {
  //     console.error('Login failed: ', error);
  //   }
  // };

  // // LOG OUT FUNCTION
  // const logout = () => {
  //   setIsLoading(true);
  //   setUser(null)
  //   setUserToken(null);
  //   AsyncStorage.removeItem(
  //     'userToken'
  //   );
  //   setIsLoading(false);
  // }

  // // CHECK IF IS LOGGED IN
  // const isLoggedIn = async () => {
  //   try {
  //     setIsLoading(true)
  //     let userToken = await AsyncStorage.getItem('userToken')
  //     console.log("storage userToken is")
  //     console.log(userToken)
  //     setUserToken(userToken)
  //     setIsLoading(false)

  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  return <AuthContext.Provider value={{ user, setUser, login, isLoading, userToken, setUserToken }}>{children}</AuthContext.Provider>
}
