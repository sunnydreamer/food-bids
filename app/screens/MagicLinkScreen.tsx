import React from 'react';
import { Pressable, Text, View,StyleSheet } from 'react-native';

import { usePassage, AuthState } from '../context/PassageContext';

import Colors from '../constants/Colors';

const MagicLinkScreen = () => {
    const {
        authState,
        checkMagicLink,
        resendMagicLink,
        userIdentifer,
        authFallbackId,
    } = usePassage();

    const isNewUser =
        authState === AuthState.AwaitingRegisterVerificationMagicLink;

    const onPressResend = async () => {
        await resendMagicLink();
    };

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            checkMagicLink(authFallbackId);
        }, 2000);
        return () => {
            clearInterval(intervalId);
        };
    }, [authFallbackId]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{`Check email to ${isNewUser ? 'Register' : 'Login'
                }`}</Text>
            <Text style={styles.body}>
                {`A one-time link has been sent to\n${userIdentifer}\nYou will be logged in here once you click that link.`}
            </Text>
            <Pressable onPress={onPressResend} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Resend link</Text>
            </Pressable>
        </View>
    )
}
export default MagicLinkScreen

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        backgroundColor: Colors.mainAppColor,
        flex: 1,
        padding: 22,
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: '800',
        marginVertical: 18,
        textAlign: 'center',
    },
    body: {
        color: 'white',
        fontSize: 14,
        marginTop: 10,
        marginBottom: 30,
        textAlign: 'center',
    },
    primaryButton: {
        alignItems: 'center',
        backgroundColor: '#F6914D',
        borderRadius: 8,
        height: 44,
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    primaryButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    secondaryButton: {
        alignItems: 'center',
        height: 44,
        justifyContent: 'center',
        marginTop: 12,
    },
    secondaryButtonText: {
        color: 'white',
        fontWeight: '600',
        opacity: 0.8,
    },
});
