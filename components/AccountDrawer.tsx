import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import {
  Avatar,
  Divider,
  List,
  Text
} from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { useDrawer } from "@/contexts/AccountDrawerContext";
import { useAlerts } from "@/hooks/useDashboard";
import { useAuth } from "@/lib/AuthContext";
import { theme } from "@/theme/theme";
import { router } from "expo-router";
import React from "react";
import { AlertBanners } from "./dashboard/AlertBanners";

export default function AccountDrawer() {
  const { open, closeDrawer } = useDrawer();
  const { logout} = useAuth();

  const currentYear = String(new Date().getFullYear());
  const [year] = React.useState(currentYear);

  const { data: alerts } = useAlerts(year);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(open ? 0 : 300) }],
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

  if (!open) return null;

  const name = "Hiba Bohri";
  const email = "hiba@test.com";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <Pressable style={styles.overlay} onPress={closeDrawer} />

      <Animated.View
        style={[
          styles.drawer,
          { backgroundColor: theme.colors.background },
          style,
        ]}
      >
        {/* Profile header */}
        <View style={styles.profileRow}>
          <Avatar.Text
            size={48}
            label={initials}
            style={{ backgroundColor: theme.colors.primary }}
            labelStyle={{ color: theme.colors.onPrimary }}
          />
          <View style={styles.profileText}>
            <Text variant="titleMedium" numberOfLines={1} style={{color: theme.colors.onPrimaryContainer}}>
              {name}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
              numberOfLines={1}
            >
              {email}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Alerts */}
        {alerts && alerts.length > 0 && (
          <ScrollView
            style={styles.alertsScroll}
            showsVerticalScrollIndicator={false}
          >
            <AlertBanners alerts={alerts} />
          </ScrollView>
        )}

        <View style={styles.spacer} />

        <Divider style={styles.divider} />

        {/* Actions */}

        <List.Item
          title="Logout"
          titleStyle={{ color: theme.colors.error }}
          left={(props) => (
            <List.Icon
              {...props}
              icon="logout"
              color={theme.colors.error}
            />
          )}
          onPress={handleLogout}
          style={styles.listItem}
        />
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    //backgroundColor: "#00000055",
  },

  drawer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 300,
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 24,
    elevation: 20,
    color: theme.colors.background
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  profileText: {
    flex: 1,
  },

  divider: {
    marginVertical: 16,
    backgroundColor: theme.colors.onPrimaryContainer,
    height: 1
  },

  alertsScroll: {
    flexGrow: 0,
  },

  spacer: {
    flex: 1,
  },

  listItem: {
    paddingHorizontal: 0,
  },
});