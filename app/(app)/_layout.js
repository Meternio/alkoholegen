import { Slot, Redirect } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
  Appbar,
  BottomNavigation,
  Text,
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

function handleSearch() {
  console.log("Searching...");
}

function handleMore() {
  console.log("Shown more...");
}

const MusicRoute = () => <Text>Music</Text>;

const AlbumsRoute = () => <Text>Albums</Text>;

const RecentsRoute = () => <Text>Recents</Text>;

const NotificationsRoute = () => <Text>Notifications</Text>;

export default function HomeLayout() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "music",
      title: "Favorites",
      focusedIcon: "heart",
      unfocusedIcon: "heart-outline",
    },
    { key: "albums", title: "Albums", focusedIcon: "album" },
    { key: "recents", title: "Recents", focusedIcon: "history" },
    {
      key: "notifications",
      title: "Notifications",
      focusedIcon: "bell",
      unfocusedIcon: "bell-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    music: MusicRoute,
    albums: AlbumsRoute,
    recents: RecentsRoute,
    notifications: NotificationsRoute,
  });

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
    return <View style={styles.container}><Text style={styles.loading}>Loading...</Text></View>;
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
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
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
});
