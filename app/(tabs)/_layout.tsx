import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from "expo-router";


export default function TabsLayout() {
  return <Tabs screenOptions={{
    headerTitleAlign: "center"
  }}>
    <Tabs.Screen 
    name="index"
    options={{
        headerTitle: "Dashboard",
        tabBarLabel: "Dashboard",
        tabBarIcon: () => (
            <MaterialIcons name='grid-view' size={24}/>
        )
    }} />
    <Tabs.Screen 
    name="projects/index"
    options={{
        headerTitle: "Projects",
        tabBarLabel: "Projects",
        tabBarIcon: () => (
            <MaterialIcons name='folder' size={24}/>
        )
    }} />
    <Tabs.Screen 
    name="resources/index"
    options={{
        headerTitle: "Resources",
        tabBarLabel: "Resources",
        tabBarIcon: () => (
            <MaterialIcons name='people' size={24}/>
        )
    }} />
    <Tabs.Screen 
    name="assignments/index"
    options={{
        headerTitle: "Assignments",
        tabBarLabel: "Assignments",
        tabBarIcon: () => (
            <MaterialIcons name='swap-horiz' size={24}/>
        )
    }} />
  </Tabs>;
}
