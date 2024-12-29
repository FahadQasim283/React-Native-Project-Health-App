// HomeScreen.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "./../redux/themeSlice";
import DashboardScreen from "./dashboardScreen";
import ProfileScreen from "./profileScreen";
import SearchScreen from "./searchScreen";


const Tab = createBottomTabNavigator();

const ThemeToggleButton = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <TouchableOpacity
      onPress={() => dispatch(toggleTheme())}
      style={{
        backgroundColor: isDarkMode ? "#333" : "#f0f0f0",
        padding: 10,
        borderRadius: 5,
        margin: 10,
      }}
    >
      <Text style={{ color: isDarkMode ? "white" : "black" }}>
        {isDarkMode ? "Light Mode" : "Dark Mode"}
      </Text>
    </TouchableOpacity>
  );
};

const HomeScreen = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const themeColors = isDarkMode
    ? { background: "#121212", text: "#ffffff" }
    : { background: "#ffffff", text: "#000000" };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ThemeToggleButton />
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: themeColors.background,
          },
          headerTintColor: themeColors.text,
          tabBarStyle: {
            backgroundColor: themeColors.background,
          },
          tabBarActiveTintColor: isDarkMode ? "#BB86FC" : "#007BFF",
          tabBarInactiveTintColor: isDarkMode ? "#888" : "#666",
        }}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
      </Tab.Navigator>
    </View>
  );
};

export default HomeScreen;
