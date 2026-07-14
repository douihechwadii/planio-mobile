import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { useDrawer } from "@/contexts/AccountDrawerContext";
import { useAuth } from "@/lib/AuthContext";
import { router } from "expo-router";

export default function AccountDrawer() {
  const { open, closeDrawer } = useDrawer();
  const { logout } = useAuth();

  const style = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(open ? 0 : 300),
      },
    ],
  }));

  const handleLogout = async () => {
    try {
      closeDrawer();

      await logout();

      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
};

  if (!open) {
    return null;
  }

  return (
    <>
      <Pressable
        style={styles.overlay}
        onPress={closeDrawer}
      />

      <Animated.View style={[styles.drawer, style]}>
        <Text style={styles.name}>John Doe</Text>

        <Text>john@email.com</Text>

        <View style={{ height: 30 }} />

        <TouchableOpacity>
          <Text>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={handleLogout}
        >
          <Text style={{ color: "red", fontWeight: "600" }}>
            Logout
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000055",
  },

  drawer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: "white",
    padding: 24,
    elevation: 20,
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
});