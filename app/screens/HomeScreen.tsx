import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

import { getAllProducts } from '../service/productService';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

const HomeScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  

  const handleBidNowPress = (item:any) => {
    navigation.navigate('AuctionDetail', {item:item}); 
  };

  const Item = ({ item }: any) => {
    const productImageSource = item.product_picture
      ? { uri: item.product_picture }
      : require('../assets/products/default_product.jpg');

    return (<View style={styles.productItem}>
      <TouchableOpacity onPress={() => handleBidNowPress(item)} style={{
        width: "95%", height: 200, overflow: "hidden", marginBottom: 15}}>
        <Image source={productImageSource} style={styles.productImage} />
      </TouchableOpacity>
      <View style={{ height: 40, overflow: "hidden" }}>
        <Text style={{ textAlign: "left", fontSize: 15, fontWeight: "bold", color: "#313737" }}>{item.product_name}</Text>
      </View>

      <View style={styles.priceAndButton}>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>${item.highest_bid !== 0 ? item.highest_bid : item.start_price}</Text>
        <TouchableOpacity onPress={() => handleBidNowPress(item)} style={{ backgroundColor: Colors.mainAppColor, padding: 8, borderRadius: 15 }}>
          <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>BID NOW</Text>
        </TouchableOpacity>
      </View>
    </View>)

  }

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
  

  return (
    <SafeAreaView style={{flex:1, backgroundColor:"white", paddingVertical:20}}>
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
    </SafeAreaView>
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
    width: "100%",
    height: 200,
    borderRadius:20
  },
  productItem: {
    padding: 10,
    flexDirection: "column",
    flexBasis: "50%", 
    alignItems:"center",
    height:310

  },
  priceAndButton: {
    flexDirection: "row",
    justifyContent:"space-between",
    alignItems:"center",
    width:"90%",
    marginVertical:5
  },
});

export default HomeScreen;
