import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";


const productData = [
  {
    id: '1',
    name: 'Product 1',
    image: require('../assets/products/apple.jpg'),

  },
  {
    id: '2',
    name: 'Product 2',
    image: require('../assets/products/cramberry.jpg'),

  },

];

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredProducts = productData.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View>
      {/* Search bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for products"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
        <Ionicons color="black" name="search" type="AntDesign" size={20} />
      </View>

      {/* Product listings */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={{ flex: 1, padding: 16 }}>
            <View style={{ backgroundColor: '#f0f0f0', padding: 16, borderRadius: 8 }}>
              <Image source={item.image} style={styles.productImage} />
              <Text>{item.name}</Text>
              <TouchableOpacity>
                <Text style={{ color: 'blue' }}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    margin: 16,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
});

export default HomeScreen;
