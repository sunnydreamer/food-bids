import React from "react";
import { Text, View, Image, StyleSheet } from "react-native";

const AuctionDetailScreen = ({ route }) => {
  const { item } = route.params;

  const productImageSource = item.product_picture
    ? { uri: item.product_picture }
    : require('../assets/products/default_product.jpg');

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);

    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

    return `${month}/${day} ${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${amPm}`;
  };

  return (
    <View style={styles.container}>
      {/* Image */}
      <View style={{flexDirection:"row", width:"100%", alignItems:"center", paddingVertical:10}}>
        <Image source={{ uri: item.seller_picture }} style={styles.sellerImage} />
        <Text style={{fontSize:15, marginLeft:10}}>{item.seller_name}</Text>
      </View>
      <View style={{height:250, width:"100%", backgroundColor:"red", borderRadius:15, overflow:"hidden", marginVertical:10}}>
        <Image source={productImageSource} style={styles.productImage} />
      </View>
      

      {/* Product Name */}
      <Text style={styles.productName}>{item.product_name}</Text>

      {/* Description */}
      <Text style={styles.description}>{item.description}</Text>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Quantity</Text>
            <Text style={styles.infoValue}>{item.quantity}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Unit Price</Text>
            <Text style={styles.infoValue}>${(item.start_price / item.quantity).toFixed(2)} / {item.unit} </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Auction End</Text>
            <Text style={styles.infoValue}>{formatDateTime(item.end_time)}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Start Price</Text>
            <Text style={styles.infoValue}>{item.start_price}</Text>
          </View>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    backgroundColor:"white"
  },
  productImage: {
    width: "100%", 
    height: 250, 
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#313737",
    marginBottom: 8,
    width:"100%"
  },
  description: {
    fontSize: 16,
    color: "#333",
    width: "100%",
  },
  sellerImage:{
    width: 30,
    height: 30, 
    borderRadius:50
  },
  infoSection: {
    marginTop: 20,
    flexDirection:"column",
    width:"100%",
    padding:20
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: "#313737",
  },
  infoValue: {
    fontSize: 18,
    color: "#333",
    fontWeight:"bold"
    
  },
  infoContainer:{
    flex:1,
    margin:5,
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center"
  }
});

export default AuctionDetailScreen;
