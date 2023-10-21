import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView
} from 'react-native';
import { usePassage } from '../context/PassageContext';

import Colors from '../constants/Colors';

const SettingsScreen = () => {
    const { signOut } = usePassage();
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Notification Settings Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notification</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Enable Notifications</Text>
                </TouchableOpacity>
                <View style={styles.divider}></View>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Change Notification Sound</Text>
                </TouchableOpacity>
                <View style={styles.divider}></View>
            </View>
            
            {/* Account Settings Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>
                <View style={styles.divider}></View>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.specialButton} onPress={signOut}>
                    <Text style={styles.specialButtonText}>Logout</Text>
                </TouchableOpacity>
            
            </View>
        </ScrollView>
    )
}
export default SettingsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "white",
    },
    divider: {
        height: 1,
        backgroundColor: 'lightgray',
        marginBottom: 12,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        color:Colors.mainAppColor
    },
    button: {
        padding: 16,
        borderRadius: 5,
        marginBottom: 12,
    },
    buttonText: {
        color: "black",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "left",
    },
    specialButton: {
        alignItems: 'center',
        backgroundColor: '#DB4437',
        borderRadius: 8,
        height: 44,
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    specialButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
