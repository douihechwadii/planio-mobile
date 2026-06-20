import { Tabs } from "expo-router";

export default function TabsLayout() {
  return <Tabs>
    <Tabs.Screen 
    name="index"
    options={{
        headerTitle: "Dashboard"
    }} />
    <Tabs.Screen 
    name="projects/index"
    options={{
        headerTitle: "Projects"
    }} />
    <Tabs.Screen 
    name="resources/index"
    options={{
        headerTitle: "Resources"
    }} />
    <Tabs.Screen 
    name="assignments/index"
    options={{
        headerTitle: "Assignments"
    }} />
  </Tabs>;
}
