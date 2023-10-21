
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"
import AppNav from './app/navigation/AppNavigator';

import {
  PassageProvider,
} from './app/context/PassageContext.tsx';

export default function App() {
  return (
    <SafeAreaProvider>
      <PassageProvider>
        <AppNav />
      </PassageProvider>
    </SafeAreaProvider>

  );
}

const styles = StyleSheet.create({

});
