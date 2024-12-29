import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking
} from "react-native";
import { useSelector } from "react-redux";
import { DatabaseService } from "../services/firebaseConfig";

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const themeStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#121212" : "#f9f9f9",
      padding: 15,
    },
    searchInput: {
      backgroundColor: isDarkMode ? "#1E1E1E" : "#fff",
      color: isDarkMode ? "#E0E0E0" : "#333",
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      borderWidth: 1,
      borderColor: isDarkMode ? "#333" : "#ddd",
      marginBottom: 15,
    },
    articleItem: {
      backgroundColor: isDarkMode ? "#1E1E1E" : "#fff",
      padding: 15,
      marginBottom: 12,
      borderRadius: 10,
      shadowColor: isDarkMode ? "#000" : "#aaa",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    articleTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDarkMode ? "#BB86FC" : "#333",
    },
    articleTags: {
      color: isDarkMode ? "#E0E0E0" : "#666",
      marginTop: 5,
      fontSize: 14,
    },
    articleAuthor: {
      color: isDarkMode ? "#BB86FC" : "#4CAF50",
      marginTop: 8,
      fontSize: 14,
      fontStyle: "italic",
    },
    noResultsText: {
      textAlign: "center",
      marginTop: 50,
      color: isDarkMode ? "#E0E0E0" : "#999",
      fontSize: 16,
    },
    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const fetchedArticles = await DatabaseService.getArticles();
      setArticles(fetchedArticles);
      setFilteredArticles(fetchedArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(text.toLowerCase()) ||
        article.tags.some((tag) =>
          tag.toLowerCase().includes(text.toLowerCase())
        )
    );
    setFilteredArticles(filtered);
  };

  const renderArticleItem = ({ item }) => (
    <TouchableOpacity style={themeStyles.articleItem} onPress={
      () => {
        Linking.openURL(item.url);
      }
    }>
      <Text style={themeStyles.articleTitle}>{item.title}</Text>
      <Text style={themeStyles.articleTags}>Tags: {item.tags.join(", ")}</Text>
      <Text style={themeStyles.articleAuthor}>By: {item.author}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={themeStyles.loader}>
        <ActivityIndicator
          size="large"
          color={isDarkMode ? "#BB86FC" : "#4CAF50"}
        />
      </View>
    );
  }

  return (
    <View style={themeStyles.container}>
      <TextInput
        placeholder="Search articles..."
        placeholderTextColor={isDarkMode ? "#777" : "#aaa"}
        value={searchTerm}
        onChangeText={handleSearch}
        style={themeStyles.searchInput}
      />
      <FlatList
        data={filteredArticles}
        renderItem={renderArticleItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={themeStyles.noResultsText}>
            No articles found. Try different keywords.
          </Text>
        }
      />
    </View>
  );
};

export default SearchScreen;
