import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
        <Stack.Screen options={{ title: "Opps! Not Found" }} />
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Text>404 Not Found</Text>
        </View>
    </>
  );
}
