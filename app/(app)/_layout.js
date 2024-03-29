import { Slot, Redirect, router } from "expo-router";
import { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Animated, ScrollView } from "react-native";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
  Appbar,
  Text,
  Icon,
  FAB,
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
    { key: "/profile", title: "Profile", focusedIcon: "album" },
  ]);
  const [width] = useState(new Animated.Value(1));

  function handleSearch() {
    console.log("Searching...");
  }

  function handleMore() {
    console.log("Shown more...");
  }

  function handleAdd() {
    console.log("Adding...");
  }

  function handleRouteChange(route) {
    if(currentRoute === route.key) return;

    width.setValue(0.5);
    setCurrentRoute(route.key)
  }

  const animateWidthChange = () => {
    Animated.timing(width, {
      toValue: 1,
      duration: 350,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (!currentRoute) return;

    animateWidthChange();
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
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <Slot />
      </ScrollView>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAdd}
      />
      <Appbar style={styles.bottomBar}>
        {routes.map((route, i) => (
          <Pressable
            key={i}
            style={styles.bottomBarItem}
            mode="text"
            background="transparent"
            onPress={() => handleRouteChange(route)}
          >
            <Animated.View
              style={{
                ...styles.bottomBarItemIconWrapper,
                width: currentRoute === route.key || (!currentRoute && i === 0) ? width.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }) : 40,
                backgroundColor: currentRoute === route.key || (!currentRoute && i === 0)
                  ? "rgba(101, 18, 12, 0.06)"
                  : "transparent"
              }}
            >
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
            </Animated.View>
            <Text>{route.title}</Text>
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
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    width: "100%",
  },
  scrollView: {
    padding: 20,
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
    minWidth: 60,
    gap: 5,
  },
  bottomBarItemIconWrapper: {
    padding: 5,
    borderRadius: 100,
    alignItems: "center",
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
  },
});
