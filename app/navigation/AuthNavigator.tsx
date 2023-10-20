import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import LoginScreen from "../screens/LoginScreen";

// Tab Bottom
const OnboardingStack = createNativeStackNavigator();

export function TabsGroup() {
    return (
        <OnboardingStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
           
            <OnboardingStack.Screen name="LoginScreen" component={LoginScreen} />
        </OnboardingStack.Navigator>
    );
}