import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

import { getAllProducts } from '../service/productService';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const Item = ({ item }: any) => (
    <View style={{backgroundColor:"pink" ,flex:1, padding:5, margin:2,flexDirection:"column"}}>
      <Text >product_name:{item.product_name}</Text>
      <View style={{flexDirection:"row"}}>
        <Text >product_name:{item.end_price}</Text>
        <Text >Buy Button</Text>
      </View> 
    </View>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("products are");
    console.log(products);
  }, [products]);


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
          data={products}
          numColumns={2}
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={item => item._id}
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
