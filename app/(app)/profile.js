import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export default function Settings() {
  const handleLogout = async () => {
    await signOut(auth);
  }
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button icon="camera" mode="contained" onPress={handleLogout}>
        logout
      </Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
