import React, {createContext, useState, useContext, useEffect} from 'react';
import {Alert, AlertButton} from 'react-native';
import Passage, {
  PassageUser,
  AllowedFallbackAuth,
  PassageError,
  PassageErrorCode,
} from '@passageidentity/passage-react-native';

interface PassageContextType {
  authState: AuthState;
  currentUser: PassageUser | null;
  userIdentifer: string | null;
  authFallbackId: string | null;
  login: (identifier: string) => Promise<void>;
  register: (identifier: string) => Promise<void>;
  activateOTP: (otp: string) => Promise<void>;
  resendOTP: () => Promise<void>;
  checkMagicLink: (magicLinkId: string | null) => Promise<void>;
  resendMagicLink: () => Promise<void>;
  addPasskey: () => Promise<void>;
  signOut: () => void;
}

export enum AuthState {
  Unauthenticated,
  AwaitingRegisterVerificationMagicLink,
  AwaitingLoginVerificationMagicLink,
  AwaitingRegisterVerificationOTP,
  AwaitingLoginVerificationOTP,
  Authenticated,
}

const PassageContext = createContext<PassageContextType | undefined>(undefined);

export const usePassage = () => {
  const context = useContext(PassageContext);
  if (!context) {
    throw new Error('usePassage must be used within an PassageProvider');
  }
  return context;
};

export function PassageProvider({children}: {children: React.ReactNode}) {
  const passage = new Passage('37xhmt5d5pmX8pfh4N47DSwC');

  const [currentUser, setCurrentUser] = useState<PassageUser | null>(null);
  const [authState, setAuthState] = useState<AuthState>(
    AuthState.Unauthenticated,
  );
  const [authFallbackId, setAuthFallbackId] = useState<string | null>(null);
  const [userIdentifer, setUserIdentifier] = useState<string | null>(null);

  useEffect(() => {
    onAppStart();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setAuthState(AuthState.Authenticated);
    } else {
      setAuthState(AuthState.Unauthenticated);
      setUserIdentifier(null);
    }
  }, [currentUser]);

  const onAppStart = async () => {
    await checkAndRefreshToken();
    await checkForAuthenticatedUser();
  };

  const checkAndRefreshToken = async () => {
    const authToken = await passage.getAuthToken();
    if (authToken) {
      const authTokenIsValid = await passage.isAuthTokenValid(authToken);
      if (!authTokenIsValid) {
        try {
          await passage.refreshAuthToken();
        } catch (error) {
          // If error, refresh token is likely expired. User will be signed out.
        }
      }
    }
  };

  const checkForAuthenticatedUser = async () => {
    const user = await passage.getCurrentUser();
    setCurrentUser(user);
  };

  const login = async (identifier: string) => {
    try {
      await passage.loginWithPasskey();
      const user = await passage.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      if (
        error instanceof PassageError &&
        error.code === PassageErrorCode.UserCancelled
      ) {
        // User cancelled native passkey prompt, do nothing.
      } else {
        if (identifier.length) {
          await fallbackLogin(identifier);
        }
      }
    }
  };

  const fallbackLogin = async (identifier: string) => {
    try {
      const appInfo = await passage.getAppInfo();
      if (appInfo.authFallbackMethod === AllowedFallbackAuth.LoginCode) {
        const otpId = await passage.newLoginOneTimePasscode(identifier);
        setAuthFallbackId(otpId);
        setAuthState(AuthState.AwaitingLoginVerificationOTP);
      } else if (appInfo.authFallbackMethod === AllowedFallbackAuth.MagicLink) {
        const magicLinkId = await passage.newLoginMagicLink(identifier);
        setAuthFallbackId(magicLinkId);
        setAuthState(AuthState.AwaitingLoginVerificationMagicLink);
      }
      setUserIdentifier(identifier);
    } catch (error) {
      console.error(error);
    }
  };

  const register = async (identifier: string) => {
    try {
      await passage.registerWithPasskey(identifier);
      const user = await passage.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      if (
        error instanceof PassageError &&
        error.code === PassageErrorCode.UserCancelled
      ) {
        // User cancelled native passkey prompt, do nothing.
      } else {
        await fallbackRegister(identifier);
      }
    }
  };

  const fallbackRegister = async (identifier: string) => {
    try {
      const appInfo = await passage.getAppInfo();
      if (appInfo.authFallbackMethod === AllowedFallbackAuth.LoginCode) {
        const otpId = await passage.newRegisterOneTimePasscode(identifier);
        setAuthFallbackId(otpId);
        setAuthState(AuthState.AwaitingRegisterVerificationOTP);
      } else if (appInfo.authFallbackMethod === AllowedFallbackAuth.MagicLink) {
        const magicLinkId = await passage.newRegisterMagicLink(identifier);
        setAuthFallbackId(magicLinkId);
        setAuthState(AuthState.AwaitingRegisterVerificationMagicLink);
      }
      setUserIdentifier(identifier);
    } catch (error) {
      console.error(error);
    }
  };

  const activateOTP = async (otp: string) => {
    try {
      await passage.oneTimePasscodeActivate(otp, authFallbackId!);
      const user = await passage.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      presentAlert('Problem with passcode', 'Please try again');
    }
  };

  const resendOTP = async () => {
    const isNewUser = authState === AuthState.AwaitingRegisterVerificationOTP;
    try {
      const newOtpId = isNewUser
        ? await passage.newRegisterOneTimePasscode(userIdentifer!)
        : await passage.newLoginOneTimePasscode(userIdentifer!);
      setAuthFallbackId(newOtpId);
    } catch (error) {
      presentAlert('Problem resending passcode', 'Please try again');
    }
  };

  const checkMagicLink = async (magicLinkId: string | null) => {
    try {
      const authResult = await passage.getMagicLinkStatus(magicLinkId!);
      if (authResult !== null) {
        const user = await passage.getCurrentUser();
        setCurrentUser(user);
      }
    } catch (error) {
      // Magic link not activated yet, do nothing.
    }
  };

  const resendMagicLink = async () => {
    const isNewUser =
      authState === AuthState.AwaitingRegisterVerificationMagicLink;
    try {
      const newMagicLinkId = isNewUser
        ? await passage.newRegisterMagicLink(userIdentifer!)
        : await passage.newLoginMagicLink(userIdentifer!);
      setAuthFallbackId(newMagicLinkId);
      presentAlert('Success', 'Magic link resent');
    } catch (error) {
      presentAlert('Problem resending magic link', 'Please try again');
    }
  };

  /**
   * This example app does not include deep link handling.
   * If you set up deep linking for your app, you'll be able to extract the magic link from the url
   * and activate it like this.
   */
  const handleDeepMagicLink = async (magicLink: string) => {
    try {
      await passage.magicLinkActivate(magicLink);
      const user = await passage.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      presentAlert('Invalid magic link', 'Magic link is no longer active.');
    }
  };

  const addPasskey = async () => {
    try {
      await passage.addPasskey();
      // Get updated user to get new list of passkeys.
      const user = await passage.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      presentAlert('Problem adding passkey', 'Please try again.');
    }
  };

  const signOut = async () => {
    setCurrentUser(null);
    await passage.signOut();
  };

  const presentAlert = (title: string, message: string) => {
    const button: AlertButton = {text: 'Okay', style: 'cancel'};
    Alert.alert(title, message, [button]);
  };

  const value = {
    authState,
    currentUser,
    userIdentifer,
    authFallbackId,
    signOut,
    login,
    register,
    activateOTP,
    resendOTP,
    checkMagicLink,
    resendMagicLink,
    addPasskey,
  };

  return (
    <PassageContext.Provider value={value}>{children}</PassageContext.Provider>
  );
}
