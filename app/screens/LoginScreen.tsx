import React from 'react';
import { Pressable, Text, TextInput, View, Image,StyleSheet } from 'react-native';

import { usePassage } from '../context/PassageContext';

import Colors from '../constants/Colors';

const LoginScreen = () => {
    const { userInfo, setUserInfo, login, register } = usePassage();


    const [showLogin, setShowLogin] = React.useState(false);
    const [validEmail, setValidEmail] = React.useState(false);
    const [emailInput, setEmailInput] = React.useState('');

    const onChangeInput = (input: string) => {
        const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const inputIsValidEmail = emailRegex.test(input);
        setValidEmail(inputIsValidEmail);
        setEmailInput(input);
    };

    async function createUserOnBackend(emailInput) {
        const response = await fetch('http://127.0.0.1:5000/create_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: emailInput,
                profile_picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
                username: "New User",
            }),
        });

        if (response.ok) {
            const responseData = await response.json(); // Parse the entire response
            const user_data = responseData.user_data;
            console.log("=================userData is=====================")
  
            console.log('User data stored on the backend.');

            setUserInfo({
                email: user_data.email,
                profile_picture: user_data.profile_picture,
                username: user_data.username,
                user_id: user_data._id,
            });
        } else {
            console.error('Failed to store user data on the backend.');
        }
    }

    async function getUserDataByEmail(emailInput) {
        try {
            const response = await fetch('http://127.0.0.1:5000/get_user_info?email=' + emailInput, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const userData = await response.json();
                console.log('User data retrieved from the backend:', userData);

                if (userData.user_data) {
                    const user_data = userData.user_data;
                    setUserInfo({
                        email: user_data.email,
                        profile_picture: user_data.profile_picture,
                        username: user_data.username,
                        user_id: user_data._id,
                    });
                    console.log('User data set in UserInfo:', user_data);
                } else {
                    console.error('User data not found in the response.');
                }
            } 
        } catch (error) {
            console.error('Error while fetching user data:', error);
        }
    }

    

    const onPressContinue = async () => {
        if (showLogin) {
            await login(emailInput);
            await getUserDataByEmail(emailInput)
        } else {
            await register(emailInput);
            await createUserOnBackend(emailInput);
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
