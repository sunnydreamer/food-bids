import React from 'react';
import { Pressable, Text, TextInput, View, Image,StyleSheet } from 'react-native';

import Colors from '../constants/Colors';
import { usePassage, AuthState } from '../context/PassageContext';


const OneTimePasscodeScreen = () => {
    const { activateOTP, resendOTP, authState, userIdentifer } = usePassage();

    const [otpInput, setOtpInput] = React.useState('');
    const [isOtpValid, setIsOtpValid] = React.useState(false);

    const isNewUser = authState === AuthState.AwaitingRegisterVerificationOTP;

    const onChangeInput = (input: string) => {
        const inputIsValidOTP = input.length > 5;
        setIsOtpValid(inputIsValidOTP);
        setOtpInput(input);
    };

    const onPressContinue = async () => {
        await activateOTP(otpInput);
    };

    const onPressResend = async () => {
        await resendOTP();
    };
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../assets/logo.png')} style={styles.logo} />
                <Text style={styles.brand}>FOOD BIDS</Text>
            </View>
            <Text style={styles.title}>Enter code</Text>
            <Text style={styles.body}>
                {`A one-time code has been sent to\n${userIdentifer}\nEnter the code here to ${isNewUser ? 'register' : 'login'
                    }.`}
            </Text>
            <TextInput
                autoCapitalize="none"
                autoComplete="one-time-code"
                autoCorrect={false}
                keyboardType="number-pad"
                onChangeText={onChangeInput}
                placeholder="Your code"
                returnKeyType="done"
                style={styles.input}
                textContentType="oneTimeCode"
                placeholderTextColor="lightgray"
            />
            <Pressable
                disabled={!isOtpValid}
                onPress={onPressContinue}
                style={[styles.primaryButton, { opacity: isOtpValid ? 1.0 : 0.3 }]}>
                <Text style={styles.primaryButtonText}>Continue</Text>
            </Pressable>
            <Pressable onPress={onPressResend} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Resend code</Text>
            </Pressable>
        </View>
    )
}
export default OneTimePasscodeScreen

const styles = StyleSheet.create({

    brand: {
        color: 'white',
        fontSize: 60,
        fontWeight: 'bold',
    },
    container: {
        alignItems: 'stretch',
        backgroundColor: Colors.mainAppColor,
        flex: 1,
        padding: 22,
    },
    header: {
        paddingTop: 100,
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 100,
        marginBottom: 10,
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: '800',
        marginVertical: 18,
        textAlign: 'center',
    },
    subtitle: {
        color: 'black',
        fontSize: 16,
        fontWeight: '500',
        marginVertical: 12,
        textAlign: 'center',
    },
    body: {
        color: 'white',
        fontSize: 14,
        marginTop: 10,
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        borderColor: 'white',
        borderRadius: 9,
        borderWidth: 1,
        marginBottom: 12,
        padding: 10,
        color: 'white',
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
