import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import UploadTrackScreen from "./screens/UploadTrackScreen";
import TrackScreen from "./screens/TrackScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import UploadPostScreen from "./screens/UploadPostScreen";

export type RootStackParamList = {
  Main: undefined;
  Track: { trackId: string };
  UserProfile: { userId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Unauthorized users - home, login, register
// Authorized users - home, settings, upload track, upload post
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Login" component={LoginScreen} />
      <Tab.Screen name="Register" component={RegisterScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="UploadTrack" component={UploadTrackScreen} />
      <Tab.Screen name="UploadPost" component={UploadPostScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Track" component={TrackScreen} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}