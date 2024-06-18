// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// import { SearchBar } from 'react-native-elements';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { useState } from 'react';

// export default function App() {

//   const [search, setSearch] = useState('');

//   return (
//     <SafeAreaProvider style={styles.container}>
//       {/* <Text>Open up App.js to start working on your app!</Text> */}
//       <SearchBar

//         style={styles.searchBar}
//         placeholder='Type Here...'
//         onChangeText={(val)=>{
//           setSearch(val)
//         }}
//         value={search}
//       />
//       <StatusBar style="auto" />
//     </SafeAreaProvider>

//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//   },
//   searchBar: {
//     width: '100%',
//     height: 50
//   }
// });

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import axios from "axios";

export default function App() {

  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchNews = async () => {
    if (!query) return;
    
    setLoading(true);
    
    try {
      const response = await axios.get("https://newsapi.org/v2/everything?q=Apple&from=2024-06-18&sortBy=popularity&apiKey=$(API_KEY)", {
        params: {
          q: query,
          apiKey: "183daca270264bad86fc5b72972fb82a",
        },
      });
      setArticles(response.data.articles);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    // <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>News Search</Text>
        <TextInput
          style={styles.input}
          placeholder="Search for news..."
          value={query}
          onChangeText={setQuery}
        />
        <Button title="Search" onPress={searchNews} />
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        <FlatList
          data={articles}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => (
            <View style={styles.article}>
              <Text style={styles.articleTitle}>{item.title}</Text>
              <Text>{item.description}</Text>
            </View>
          )}
        />
      </SafeAreaView>
    // </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  article: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
