import { useDrawer } from '@/contexts/AccountDrawerContext';
import { theme } from '@/theme/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from "expo-router";
import { TouchableOpacity } from 'react-native';



export default function TabsLayout() {
    const { openDrawer } = useDrawer();
    return <Tabs screenOptions={{
    headerTitleAlign: "center",
    tabBarStyle: {
        backgroundColor: theme.colors.secondary,
        height: 60,
    },

    tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600'
    },

    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.background,

    headerStyle: {
        backgroundColor: theme.colors.secondary
    },

    headerTintColor: theme.colors.background,

    headerRight: () => (
        <TouchableOpacity onPress={openDrawer
         } style={{ marginRight: 15 }}>
            <MaterialIcons name="account-circle" size={30} color="white"/>
        </TouchableOpacity>
    )
  }}>
    <Tabs.Screen 
    name="index"
    options={{
        headerTitle: "Dashboard",
        tabBarLabel: "Dashboard",
        tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='grid-view' size={size} color={color}/>
        )
    }} />
    <Tabs.Screen 
    name="projects/index"
    options={{
        headerTitle: "Projects",
        tabBarLabel: "Projects",
        tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='folder' size={size} color={color}/>
        )
    }} />

    <Tabs.Screen name="projects/[id]" options={{ href: null, title: "Projects Details"}} />

    <Tabs.Screen 
    name="resources/index"
    options={{
        headerTitle: "Resources",
        tabBarLabel: "Resources",
        tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='people' size={size} color={color}/>
        )
    }} />

    <Tabs.Screen name='resources/[id]' options={{ href: null, title: "Resource Details" }} />

    <Tabs.Screen 
    name="assignments/index"
    options={{
        headerTitle: "Assignments",
        tabBarLabel: "Assignments",
        tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='swap-horiz' size={size} color={color}/>
        )
    }} />
  </Tabs>;
}
