import { Slot, Redirect, router } from "expo-router";
import { useState, useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
  Appbar,
  Text,
  Button,
  Icon,
} from "react-native-paper";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#65120c",
    secondary: "#041a20",
  },
};

export default function HomeLayout() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [routes] = useState([
    {
      key: "/",
      title: "Home",
      focusedIcon: "heart",
      unfocusedIcon: "heart-outline",
    },
    { key: "/settings", title: "Listen", focusedIcon: "album" },
  ]);

  function handleSearch() {
    console.log("Searching...");
  }

  function handleMore() {
    console.log("Shown more...");
  }

  useEffect(() => {
    if (!currentRoute) return;

    router.push(currentRoute);
  }, [currentRoute]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
        setLoading(false);
      });
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  if (!loggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <PaperProvider theme={theme}>
      <Appbar.Header>
        <Appbar.Content title="Alkoholegen" />
        <Appbar.Action icon="magnify" onPress={handleSearch} />
        <Appbar.Action icon="dots-vertical" onPress={handleMore} />
      </Appbar.Header>
      <Slot />
      <Appbar style={styles.bottomBar}>
        {routes.map((route, i) => (
          <Pressable
            key={i}
            style={styles.bottomBarItem}
            mode="text"
            background="transparent"
            onPress={() => setCurrentRoute(route.key)}
          >
            <View style={{...styles.bottomBarItemIconWrapper, backgroundColor: (currentRoute === route.key) || (!currentRoute && i === 0) ? "rgba(101, 18, 12, 0.06)" : "transparent"}}>
              <Icon
                source={
                  currentRoute === route.key || (!currentRoute && i === 0)
                    ? route.focusedIcon
                    : route.unfocusedIcon
                    ? route.unfocusedIcon
                    : route.focusedIcon
                }
                size={20}
              />
            </View>
            <Text>Press me</Text>
          </Pressable>
        ))}
      </Appbar>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    fontSize: 16,
  },
  bottomBar: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    height: 80,
  },
  bottomBarItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  bottomBarItemIconWrapper: {
    padding: 5,
    borderRadius: 100,
    width: "100%",
    minWidth: 60,
    alignItems: "center",
  },
});
