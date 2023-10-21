import React from 'react';
import { Pressable, Text, TextInput, View, Image,StyleSheet } from 'react-native';

import { usePassage } from '../context/PassageContext';

import Colors from '../constants/Colors';

const LoginScreen = () => {
    const { login, register } = usePassage();

    const [showLogin, setShowLogin] = React.useState(false);
    const [validEmail, setValidEmail] = React.useState(false);
    const [emailInput, setEmailInput] = React.useState('');

    const onChangeInput = (input: string) => {
        const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const inputIsValidEmail = emailRegex.test(input);
        setValidEmail(inputIsValidEmail);
        setEmailInput(input);
    };

    const onPressContinue = async () => {
        if (showLogin) {
            await login(emailInput);
        } else {
            await register(emailInput);
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../assets/logo.png')} style={styles.logo} />
                <Text style={styles.brand}>FOOD BIDS</Text>
            </View>
            <Text style={styles.title}>{showLogin ? 'Login' : 'Register'}</Text>
            <TextInput
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={onChangeInput}
                onFocus={() => showLogin && onPressContinue()}
                placeholder="example@email.com"
                returnKeyType="done"
                style={styles.input}
                textContentType="emailAddress"
                placeholderTextColor="lightgray"
            />
            <Pressable
                disabled={!validEmail}
                onPress={onPressContinue}
                style={[styles.primaryButton, { opacity: validEmail ? 1.0 : 0.3 }]}>
                <Text style={styles.primaryButtonText}>Continue</Text>
            </Pressable>
            <Pressable
                onPress={() => setShowLogin(!showLogin)}
                style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>
                    {showLogin
                        ? "Don't have an account? Register"
                        : 'Already have an account? Login'}
                </Text>
            </Pressable>
        </View>
    )
}
export default LoginScreen

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
