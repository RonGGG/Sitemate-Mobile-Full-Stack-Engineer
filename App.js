import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, ActivityIndicator, TouchableOpacity, Image, ScrollView } from 'react-native';
import axios from 'axios';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const API_KEY = '183daca270264bad86fc5b72972fb82a';

  useEffect(() => {
    loadHistory();
  }, []);

  const saveHistory = async (searchQuery) => {
    try {
      const existingHistory = await AsyncStorage.getItem('searchHistory');
      const searchHistory = existingHistory ? JSON.parse(existingHistory) : [];
      if (!searchHistory.includes(searchQuery)) {
        searchHistory.unshift(searchQuery);
        await AsyncStorage.setItem('searchHistory', JSON.stringify(searchHistory));
      }
      setHistory(searchHistory);
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const existingHistory = await AsyncStorage.getItem('searchHistory');
      if (existingHistory) {
        setHistory(JSON.parse(existingHistory));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('searchHistory');
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const searchNews = async () => {
    if (!query) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`);
      setArticles(response.data.articles);
      saveHistory(query);
    } catch (error) {
      setError('Failed to fetch news articles. Please try again later.');
    }
    setLoading(false);
  };

  const handleHistorySearch = (searchQuery) => {
    setQuery(searchQuery);
    searchNews();
  };
  const clearQuery = () => {
    setQuery('');
    setArticles([]);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>News Search</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search for news..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={searchNews}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.clearButton} onPress={clearQuery}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={searchNews}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
        {loading && <ActivityIndicator size="large" color="#777" />}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {articles.length === 0 && !loading && !error && (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>No articles found. Try searching for something else.</Text>
          </View>
        )}
        <ScrollView style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Search History</Text>
          {history.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleHistorySearch(item)}>
              <Text style={styles.historyItem}>{item}</Text>
            </TouchableOpacity>
          ))}
          {history.length > 0 && (
            <TouchableOpacity style={styles.clearHistoryButton} onPress={clearHistory}>
              <Text style={styles.clearHistoryButtonText}>Clear History</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
        <FlatList
          data={articles}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => (
            <View style={styles.article}>
              <Text style={styles.articleTitle}>{item.title}</Text>
              {item.urlToImage && <Image source={{ uri: item.urlToImage }} style={styles.articleImage} />}
              <Text>{item.description}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  clearButton: {
    marginLeft: 10,
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  historyContainer: {

  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    fontSize: 16,
    color: '#007BFF',
    marginBottom: 5,
  },
  clearHistoryButton: {
    marginTop: 25,
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearHistoryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  article: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  articleImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
});