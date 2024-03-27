import { useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { Button, TextInput, Snackbar, Text } from "react-native-paper";
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
      router.replace('/');
    } catch (error) {
      setNotification(error.message + " Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, username, password);
      router.replace('/');
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
    <View style={styles.containerWrapper}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          style={styles.scrollView}
        >
          <Image source={logo} style={styles.image} resizeMode="contain" />
          <Animated.View
            style={{ ...styles.animationContainer, opacity: fadeAnim }}
          >
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
                labelStyle={styles.button}
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
                <View style={styles.footerText}>
                  <Text style={styles.button}>Don't Have Account?</Text>
                  <Button
                    labelStyle={styles.button}
                    mode="text"
                    onPress={() => changeMode("signup")}
                  >
                    Sign Up
                  </Button>
                </View>
              ) : (
                <View style={styles.footerText}>
                  <Text style={styles.button}>Already Have Account?</Text>
                  <Button
                    labelStyle={styles.button}
                    mode="text"
                    onPress={() => changeMode("login")}
                  >
                    Login
                  </Button>
                </View>
              )}
              {mode !== "forgot" ? (
                <Button
                  labelStyle={styles.button}
                  onPress={() => changeMode("forgot")}
                >
                  Forgot Password?
                </Button>
              ) : (
                <Button
                  labelStyle={styles.button}
                  onPress={() => changeMode("login")}
                >
                  Back to Login
                </Button>
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
    </View>
  );
}

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    width: "100%",
  },
  scrollViewContainer: {
    alignSelf: "center",
    flexGrow: 1,
    justifyContent: "center",
    width: "100%",
  },
  scrollView: {
    padding: 20,
    width: "100%",
    maxWidth: 600,
  },
  image: {
    height: 280,
    width: 280,
    borderRadius: 7,
    alignSelf: "center",
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
  button: {
    fontSize: 16,
    lineHeight: 20,
  },
  buttonView: {
    width: "100%",
    marginTop: 10,
  },
  footerText: {
    textAlign: "center",
    fontSize: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    gap: 5,
  },
  otherOptionsView: {
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
    fontSize: 16,
    marginBottom: -5,
  },
  snackbar: {
    backgroundColor: "#65120c",
    textAlign: "center",
    maxWidth: "600px",
    marginHorizontal: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
});
