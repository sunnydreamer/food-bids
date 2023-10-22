import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import Colors from "../constants/Colors";
import { usePassage } from '../context/PassageContext';
import ImagePicker from 'react-native-image-picker';


const ProfileScreen = () => {
  const { userInfo } = usePassage();

  const handleEditProfilePicture = () => {
    console.log("edit profile picture")
  };

  useEffect(()=>{
    console.log("userInfo is")
    console.log(userInfo)
  },[])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{
        flexDirection: "column",
        alignItems: "center",
      }}>
        <TouchableOpacity onPress={handleEditProfilePicture}>
          <Image
            source={{ uri: userInfo.profile_picture }}
            style={styles.profilePicture}
          />
        </TouchableOpacity>
       
        <Text style={{ alignSelf: "center", fontSize: 18, fontWeight: "bold", margin: 15 }}>{userInfo.username}</Text>
      </View>

       <Text style={{ fontSize: 16, color: "black", textAlign: "center" }}>
          Current Credits: $565
        </Text>

      <View style={styles.section}>
        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center",paddingVertical:15}}>
          <Text style={styles.sectionTitle}>Order Tracking</Text>
          <Text style={{fontSize: 12}}>View All</Text>
        </View>
        
        <View style={styles.orderContainer}>
          <View style={{flexDirection:"row", alignItems:"center"}}>
            <Image source={require('../assets/products/apple.jpg')} style={styles.productImage} />
            <View>
              <Text style={{fontSize:16, fontWeight:"bold"}}>Apple</Text>
              <Text>Sunny Farm | 100kg</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>CONFIRM</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 }}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
        </View>
      </View>

       

      <View style={{width:"100%", height:250}}>
        <Image source={require('../assets/card.png')} style={{width:"100%", height:250}} />
      </View>
      
      <View style={styles.section}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical:12 }}>
          <Text style={styles.sectionTitle}>Help Center</Text>
        </View>
      </View>

    </ScrollView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  profileContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 16,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 60,
  },
  currentPosition: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  section: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor:Colors.mainAppColor,
    padding: 16,
    borderRadius: 5,
    marginBottom: 12,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 12,
    justifyContent:"space-between"
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius:15
  },
  confirmButton: {
    backgroundColor: Colors.mainAppColor,
    padding: 12,
    borderRadius:15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 12,
  },
});

export default ProfileScreen;
