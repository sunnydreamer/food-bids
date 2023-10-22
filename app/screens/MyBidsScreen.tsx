import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { usePassage } from '../context/PassageContext';
import Colors from '../constants/Colors';

const MyBidsScreen = () => {

  const { userInfo } = usePassage();

  const [selectedTab, setSelectedTab] = useState('Ongoing'); // Define selectedTab in component state
  const [userBids, setUserBids] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserBids = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:5000/get_user_bids?user_id=${userInfo.user_id}`);
          const data = await response.json();

          if (data.user_bids) {
            setUserBids(data.user_bids);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchUserBids();
    }, []),
  );

  useEffect(()=>{
    console.log("===============userBids===================")
    console.log(userBids)
  }, [userBids])

  return (
    <View style={{backgroundColor:"white", flex:1}}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, width: "100%" }}>
        <TouchableOpacity onPress={() => setSelectedTab('Ongoing')} style={[styles.tabBtnLeft, selectedTab === 'Ongoing' ? styles.selectedTab : {}]}>
          <Text style={selectedTab === 'Ongoing' ? styles.selectedTabText : {}}>Ongoing</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('Closed')} style={[styles.tabBtnRight, selectedTab === 'Closed' ? styles.selectedTab : {} ]}>
          <Text style={selectedTab === 'Closed' ? styles.selectedTabText : {}}>Closed</Text>
        </TouchableOpacity>
      </View>
      {selectedTab === 'Ongoing' && (
        <View style={{paddingHorizontal:20}}>
          {userBids.map((bid, index) => (
            <View style={styles.orderContainer} key={index}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={{ uri: bid.product_picture }} style={styles.productImage} />
                <View>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>{bid.product_name}</Text>
                  <Text>{bid.seller_name} | {bid.quantity}{bid.unit}</Text>
                </View>
              </View>
             
            </View>
          ))}

        </View>
      )}
      {selectedTab === 'Closed' && (
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.orderContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={require('../assets/products/apple.jpg')} style={styles.productImage} />
              <View>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Apple</Text>
                <Text>Sunny Farm | 100kg</Text>
              </View>
            </View>
            <Text style={styles.successText}>Success</Text>
          </View>
          <View style={styles.orderContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={require('../assets/products/oranges.jpg')} style={styles.productImage} />
              <View>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Orange</Text>
                <Text>Sunny Farm | 100kg</Text>
              </View>
            </View>
            <Text style={styles.successText}>Success</Text>
          </View>
          <View style={styles.orderContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={require('../assets/products/potato.jpg')} style={styles.productImage} />
              <View>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Potato</Text>
                <Text>Sunny Farm | 100kg</Text>
              </View>
            </View>
            <Text style={styles.failText}>Credit Returned</Text>
   
          </View>
          <View style={styles.orderContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={require('../assets/products/cramberry.jpg')} style={styles.productImage} />
              <View>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Cranberry</Text>
                <Text>Sunny Farm | 100kg</Text>
              </View>
            </View>
            <Text style={styles.successText}>Success</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    backgroundColor: "white",
    paddingBottom: 100,
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 15
  },
  tabBtnLeft:{
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    padding:8,
    borderColor:Colors.mainAppColor,
    borderWidth:1,
    width:80,
    flexDirection: "row",
    justifyContent: "center"
  },
  tabBtnRight: {
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    padding: 8,
    borderColor: Colors.mainAppColor,
    borderWidth: 1,
    width:80,
    flexDirection:"row",
    justifyContent:"center"
  },
  selectedTab: { 
    backgroundColor: '#287C68',
  },
  selectedTabText: {
    color: "white"
  },
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 12,
    justifyContent: "space-between"
  },
  confirmButton: {
    backgroundColor: Colors.mainAppColor,
    paddingHorizontal: 15,
    paddingVertical:10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 15,
  },
  failText:{
    color:"red"
  },
  successText:{
    color:"green"
  }
  
});

export default MyBidsScreen;
