import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Button } from "react-native";
import Colors from "../constants/Colors";
import { usePassage } from '../context/PassageContext';
import { SafeAreaView } from "react-native-safe-area-context";

const AuctionDetailScreen = ({ route }) => {

  const { userInfo } = usePassage();
  // console.log("userInfo is")
  // console.log(userInfo)
  const { item } = route.params;

  const [itemInfo,setItemInfo] = useState(item)

  const productImageSource = itemInfo.product_picture
    ? { uri: itemInfo.product_picture }
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

  // bid  flow

  const [isModalVisible, setModalVisible] = useState(false);
  const [bidAmount, setBidAmount] = useState(""); // State to store the bid amount

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleBidConfirm = () => {
    // Handle the bid confirmation here
    console.log("Bid confirmed:", bidAmount);

    // Create the bid data to send to the server
    const bidData = {
      user_info: {
        user_id: userInfo.user_id, 
        user_name: userInfo.username, 
        user_image: userInfo.profile_picture 
      },
      bid_amount: bidAmount, 
      product_id: itemInfo._id 
    };

    // Make a POST request to the /add_bid endpoint
    fetch('http://127.0.0.1:5000/add_bid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bidData)
    })
      .then(response => response.json())
      .then(data => {
        setItemInfo(itemInfo => ({
          ...itemInfo, bids_history: data.bids_history
        }));
      })
      .catch(error => {
        console.error('Error:', error);
      });
    setBidAmount(""); 
    toggleModal(); 
  };

  // useEffect(() => {
  //   console.log("=============================ItemInfo================================")
  //   console.log(itemInfo)
  // }, [itemInfo])

  return (
    <View>
    <ScrollView>
      <View style={styles.container}>
        {/* Image */}
        <View style={{flexDirection:"row", width:"100%", alignItems:"center", paddingVertical:10}}>
            <Image source={{ uri: itemInfo.seller_picture }} style={styles.sellerImage} />
            <Text style={{ fontSize: 15, marginLeft: 10 }}>{itemInfo.seller_name}</Text>
        </View>
        <View style={{height:250, width:"100%", backgroundColor:"red", borderRadius:15, overflow:"hidden", marginVertical:10}}>
          <Image source={productImageSource} style={styles.productImage} />
        </View>
        
        {/* Product Name */}
          <Text style={styles.productName}>{itemInfo.product_name}</Text>

        {/* Description */}
          <Text style={styles.description}>{itemInfo.description}</Text>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Quantity</Text>
                <Text style={styles.infoValue}>{itemInfo.quantity}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Unit Price</Text>
                <Text style={styles.infoValue}>${(itemInfo.start_price / itemInfo.quantity).toFixed(2)} / {itemInfo.unit} </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Auction End</Text>
                <Text style={styles.infoValue}>{formatDateTime(itemInfo.end_time)}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Start Price</Text>
                <Text style={styles.infoValue}>${itemInfo.start_price}</Text>
            </View>
          </View>
        </View>
        {/* Highest Bids Section */}
        <View style={styles.highestBidsSection}>
          <Text style={styles.highestBidsHeader}>Highest Bids</Text>
            {!itemInfo || !itemInfo.bids_history || itemInfo.bids_history.length === 0 ? (
            <Text style={styles.noBidsText}>Be the first one to bid!</Text>
          ) : (
                itemInfo.bids_history.map((bid, index) => (
              <View key={index} style={styles.highestBidItem}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image source={{ uri: bid.user_image }} style={[styles.userImage, index === 0 ? { width: 50, height: 50 } : null]} />
                  <Text style={[styles.userName, index === 0 ? { fontSize: 18 } : null]}>{bid.user_name}</Text>
                </View>
                <View style={styles.bidDetails}>
                  <Text style={[styles.highestBidValue, index === 0 ? { fontSize: 20, color: '#FF4949', fontWeight: "bold" } : null]}>${bid.price}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
     
      
    </ScrollView>
      {/* Fixed Button */}
      <View>
        <View style={{}}>
        </View>
          <TouchableOpacity
          style={styles.fixedButton}
          onPress={toggleModal}
        >
          <Text style={styles.fixedButtonText}>PLACE A BID</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for bid input */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            {/* Big Title */}
            <Text style={styles.modalTitle}>Confirm Bid</Text>

            {/* Subtitle */}
            <Text style={styles.modalSubtitle}>Enter your bid amount below:</Text>

            <TextInput
              style={styles.inputField}
              placeholder="Enter bid amount"
              value={bidAmount}
              onChangeText={(text) => setBidAmount(text)}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleBidConfirm} style={styles.button}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleModal} style={[styles.button, {backgroundColor:"white",borderColor:"black",borderWidth:1}]}>
                <Text style={[styles.buttonText,{color:"black", fontWeight:"normal"}]}>Cancel</Text>
              </TouchableOpacity>
           
            </View>
          </View>
        </View>
      </Modal>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    backgroundColor:"white",
    paddingBottom:100,
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
    padding:20,
    backgroundColor:"#f2f2f2",
    borderRadius:20
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
  },
  highestBidsSection: {
    marginVertical: 10,
    width:"100%"
  },
  highestBidsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    width:"100%",
    marginVertical:15
  },
  highestBidItem: {
    flexDirection: 'row',
    alignItems:"center",
    justifyContent:"space-between",
    margin: 5,
  },
  highestBidLabel: {
    fontWeight: 'bold',
  },
  highestBidValue: {
    marginLeft: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  bidDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    marginLeft: 10,
  },
  noBidsText:{
    fontSize:15,
    marginVertical:15
  },
  fixedButton: {
    backgroundColor: Colors.mainAppColor, 
    padding: 15,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  fixedButtonText: {
    color: "white", 
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",   
  },
  modalCard: {
    width: 300,
    backgroundColor: "white",
    padding: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 400,
    flexDirection:"column",
    justifyContent:"center",

  },
  modalTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginVertical:10
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
  },
  button:{
    backgroundColor:"#FF4949",
    marginVertical:5,
    padding:10,
    borderRadius:15
  },
  buttonText:{
    textAlign:"center",
    color:"white",
    fontWeight:"bold"
  }
});

export default AuctionDetailScreen;
