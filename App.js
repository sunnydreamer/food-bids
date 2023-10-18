
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"
import AppNav from './app/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNav/>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({

});
