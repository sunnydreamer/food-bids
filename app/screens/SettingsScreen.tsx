import React from 'react';
import { Text, View, Pressable,StyleSheet } from 'react-native';
import { usePassage } from '../context/PassageContext';

import Colors from '../constants/Colors';

const SettingsScreen = () => {
    const { signOut } = usePassage();
    return (
        <View style={styles.container}>
            <Pressable onPress={signOut} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Sign out</Text>
            </Pressable>
        </View>
    )
}
export default SettingsScreen

const styles = StyleSheet.create({

    container: {
        alignItems: 'stretch',
        backgroundColor: Colors.mainAppColor,
        flex: 1,
        padding: 22,
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
