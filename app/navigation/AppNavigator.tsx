import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useContext } from 'react';
import { AuthState, usePassage } from '../context/PassageContext';
import LoginScreen from '../screens/LoginScreen';
import MagicLinkScreen from '../screens/MagicLinkScreen';
import OneTimePasscodeScreen from '../screens/OneTimePasscodeScreen';
import { TabsGroup } from '../navigation/MainNavigator';

const Screen: React.FC = () => {
    const { authState } = usePassage();

    switch (authState) {
        case AuthState.Unauthenticated:
            return <LoginScreen />;
        case AuthState.AwaitingRegisterVerificationMagicLink:
        case AuthState.AwaitingLoginVerificationMagicLink:
            return <MagicLinkScreen />;
        case AuthState.AwaitingRegisterVerificationOTP:
        case AuthState.AwaitingLoginVerificationOTP:
            return <OneTimePasscodeScreen />;
        case AuthState.Authenticated:
            return <TabsGroup />;
        default:
            return <></>;
    }
};

const AppNav: React.FC = () => {
    return (
        <NavigationContainer>
            <Screen />
        </NavigationContainer>
    );
};

export default AppNav;
