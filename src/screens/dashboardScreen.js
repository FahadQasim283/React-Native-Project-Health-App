import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Linking
} from "react-native";
import { useSelector } from "react-redux";
import { DatabaseService, auth } from "../services/firebaseConfig";
import axios from "axios";

const DashboardScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [healthNews, setHealthNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const themeStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#121212" : "#f9f9f9",
      padding: 20,
    },
    card: {
      backgroundColor: isDarkMode ? "#1E1E1E" : "#ffffff",
      borderRadius: 12,
      padding: 20,
      marginBottom: 15,
      shadowColor: isDarkMode ? "#000" : "#aaa",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 5,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: isDarkMode ? "#BB86FC" : "#333",
      marginBottom: 10,
    },
    cardText: {
      fontSize: 16,
      color: isDarkMode ? "#E0E0E0" : "#555",
      marginBottom: 5,
    },
    newsItem: {
      flexDirection: "row",
      marginBottom: 10,
    },
    newsThumbnail: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 10,
    },
    newsText: {
      flex: 1,
    },
    newsTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: isDarkMode ? "#BB86FC" : "#333",
    },
    newsDescription: {
      fontSize: 14,
      color: isDarkMode ? "#E0E0E0" : "#555",
      marginTop: 5,
    },
    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  useEffect(() => {
    fetchUserData();
    fetchHealthNews();
  }, []);

  const fetchUserData = async () => {
    try {
      const users = await DatabaseService.getUsers();
      const userArray = Object.values(users);
      const currentUser = userArray.find(
        (user) => user.id === auth.currentUser?.uid
      );
      setUserData(currentUser);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoadingUserData(false);
    }
  };

  const fetchHealthNews = async () => {
    try {
      const response = await axios.get("https://newsapi.org/v2/top-headlines", {
        params: {
          category: "health",
          country: "us",
          apiKey: "b86322363c124ab7a591171179c1897f",
        },
      });
      setHealthNews(response.data.articles);
    } catch (error) {
      console.error("Error fetching health news:", error);
    } finally {
      setLoadingNews(false);
    }
  };

  return (
    <ScrollView style={themeStyles.container}>
      {loadingUserData ? (
        <View style={themeStyles.loader}>
          <ActivityIndicator
            size="large"
            color={isDarkMode ? "#BB86FC" : "#4CAF50"}
          />
        </View>
      ) : (
        <View style={themeStyles.card}>
          {userData ? (
            <>
              <Text style={themeStyles.cardText}>
                <Text style={{ fontWeight: "bold" }}>Name:</Text>{" "}
                {userData.name || "Not set"}
              </Text>
              <Text style={themeStyles.cardText}>
                <Text style={{ fontWeight: "bold" }}>Goals:</Text>{" "}
                {userData.goals?.join(", ") || "No goals set"}
              </Text>
            </>
          ) : (
            <Text style={themeStyles.cardText}>No user data available.</Text>
          )}
        </View>
      )}

      {/* Health News Section */}
      <View style={themeStyles.card}>
        <Text style={themeStyles.cardTitle}>Latest Health News</Text>
        {loadingNews ? (
          <ActivityIndicator
            size="large"
            color={isDarkMode ? "#BB86FC" : "#4CAF50"}
          />
        ) : healthNews.length > 0 ? (
          healthNews.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={themeStyles.newsItem}
              onPress={() => Linking.openURL(item.url)}
            >
              <Image
                source={{
                  uri: item.urlToImage || "https://via.placeholder.com/150",
                }}
                style={themeStyles.newsThumbnail}
              />
              <View style={themeStyles.newsText}>
                <Text style={themeStyles.newsTitle}>{item.title}</Text>
                <Text style={themeStyles.newsDescription} numberOfLines={2}>
                  {item.description || "No description available."}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={themeStyles.cardText}>
            No health news available at the moment.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;
