import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import MyBidsScreen from "../screens/MyBidsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AuctionDetailScreen from "../screens/AuctionDetailScreen";
import SettingsScreen from "../screens/SettingsScreen";

// Tab Bottom
const Tabs = createBottomTabNavigator();

export function TabsGroup() {
    return (
        <Tabs.Navigator
            screenOptions={({ route, navigation }) => ({
                tabBarIcon: ({ color, focused, size }) => {
                    let iconName;
                    if (route.name === "Home") {
                        iconName = focused ? "flame" : "flame-outline";
                    } 
                    
                    if (route.name === "My Bids") {
                        iconName = focused ? "hammer-outline" : "hammer" ;
                    } 
                    
                    if (route.name === "Profile") {
                        iconName = focused
                            ? "person"
                            : "person-outline";
                    } 

                    if (route.name === "Settings") {
                        iconName = focused
                            ? "settings"
                            : "settings-outline";
                    } 
                    
                    return <Ionicons name={iconName} size={size} color={color} />;
                },

                tabBarActiveTintColor: "#24246D",
            })}
        >

            <Tabs.Screen name="Home" component={HomeScreen}/>
            <Tabs.Screen name="My Bids" component={MyBidsScreen} />
            <Tabs.Screen name="Profile" component={ProfileScreen} />
            <Tabs.Screen name="Settings" component={SettingsScreen} />
        </Tabs.Navigator>
    );
}