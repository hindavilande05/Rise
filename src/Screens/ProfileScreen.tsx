import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert, Button } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Profile: undefined;
  Login: undefined;
  HomeScreen: undefined;
  BookingScreen: undefined;
};

const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          Alert.alert("Error", "No authentication token found. Please log in again.");
          navigation.navigate("Login");
          return;
        }

        const response = await axios.get("http://192.168.6.229:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` } 
        });

        setUserName(response.data?.name || "No Name");
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      Alert.alert("Logged Out", "You have been logged out successfully.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Logout Failed", "An error occurred while logging out.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00875A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>Hello, {userName}</Text>
      <View style={styles.logoutButton}>
        <Button title="Logout" onPress={handleLogout} color="#D9534F" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F8F8",
    padding: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#D9534F",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileScreen;
