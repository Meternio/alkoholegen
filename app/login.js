import React, { useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
} from "react-native";
import { Button, TextInput, Snackbar } from "react-native-paper";
import logo from "../assets/icon.png";
import { auth } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

export default function LoginScreen() {
  const [mode, setMode] = useState("login"); // ["login", "signup", "forgot"]
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(1));
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const changeMode = (mode) => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // After the fade out is done, set the mode
      setMode(mode);

      // Then fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (mode === "login") {
      handleLogin();
    } else if (mode === "signup") {
      handleSignUp();
    } else if (mode === "forgot") {
      handleForgotPassword();
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, username, password);
    } catch (error) {
      setNotification(error.message + " Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, username, password);
    } catch (error) {
      setNotification(error.message + " Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, username, password);
    } catch (error) {
      setNotification(error.message + " Invalid email");
    } finally {
      setLoading(false);
    }
  };

  const onDismissSnackBar = () => setNotification(null);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          style={styles.scrollView}
        >
          <Image source={logo} style={styles.image} resizeMode="contain" />
          <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
            <Text style={styles.title}>
              {
                {
                  login: "Login",
                  signup: "Sign Up",
                  forgot: "Forgot Password",
                }[mode]
              }
            </Text>
            <View style={styles.inputView}>
              <TextInput
                label="Email"
                value={username}
                onChangeText={setUsername}
                onSubmitEditing={handleLogin}
                mode="outlined"
                style={styles.input}
              />
              {mode !== "forgot" && (
                <TextInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  onSubmitEditing={handleLogin}
                  mode="outlined"
                  secureTextEntry
                  style={styles.input}
                />
              )}
            </View>

            <View style={styles.buttonView}>
              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                icon={
                  {
                    login: "login",
                    signup: "account-plus-outline",
                    forgot: "lock-alert-outline",
                  }[mode]
                }
              >
                {
                  {
                    login: "Login",
                    signup: "Sign Up",
                    forgot: "Reset Password",
                  }[mode]
                }
              </Button>
            </View>

            <View style={styles.otherOptionsView}>
              {mode !== "signup" ? (
                <Text style={styles.footerText}>
                  Don't Have Account?
                  <Pressable onPress={() => changeMode("signup")}>
                    <Text style={styles.signup}> Sign Up</Text>
                  </Pressable>
                </Text>
              ) : (
                <Text style={styles.footerText}>
                  Already Have Account?
                  <Pressable onPress={() => changeMode("login")}>
                    <Text style={styles.signup}> Login</Text>
                  </Pressable>
                </Text>
              )}
              {mode !== "forgot" ? (
                <Pressable onPress={() => changeMode("forgot")}>
                  <Text style={styles.forgetText}>Forgot Password?</Text>
                </Pressable>
              ) : (
                <Pressable onPress={() => changeMode("login")}>
                  <Text style={styles.forgetText}>Back to Login</Text>
                </Pressable>
              )}
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
      <Snackbar
        visible={notification}
        onDismiss={onDismissSnackBar}
        style={styles.snackbar}
      >
        {notification}
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    width: "100%",
    maxWidth: 600,
    margin: "auto",
  },
  scrollView: {
    padding: 20,
  },
  image: {
    height: 280,
    width: 280,
    borderRadius: 7,
    margin: "auto",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    paddingVertical: 40,
    color: "#65120c",
  },
  inputView: {
    gap: 15,
    width: "100%",
    marginBottom: 5,
  },
  input: {
    marginTop: -8,
  },
  forgetText: {
    color: "#65120c",
  },
  buttonView: {
    width: "100%",
    marginTop: 10,
  },
  footerText: {
    textAlign: "center",
  },
  signup: {
    color: "#65120c",
  },
  otherOptionsView: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
    width: "100%",
    marginTop: 10,
  },
  snackbar: {
    backgroundColor: "#65120c",
    textAlign: "center",
    maxWidth: "600px",
    margin: "auto",
    width: "calc(100% - 40px)",
    bottom: 20,
  },
});
