import { View, Text, ActivityIndicator } from 'react-native'

import { NavigationContainer } from "@react-navigation/native";

import { TabsGroup } from "../navigation/MainNavigator";
import { useContext } from 'react';


const AppNav = () => {




    return (
        <NavigationContainer>
            <TabsGroup/>
        </NavigationContainer>
    )
}
export default AppNav