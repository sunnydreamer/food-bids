
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"
import AppNav from './app/navigation/AppNavigator';
import { AuthContext, AuthProvider } from "./app/context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <AppNav/>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({

});
