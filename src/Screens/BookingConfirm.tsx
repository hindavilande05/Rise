import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon1 from "react-native-vector-icons/FontAwesome6";
import { useNavigation, NavigationProp, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types"; 
import axios from "axios";
import { BASE_URL } from "../../config";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";

type BookingConfirmRouteProp = RouteProp<RootStackParamList, "BookingConfirm">;


const BookingConfirm = () => {
  const route = useRoute<BookingConfirmRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { bookingDetails } = route.params;
  const [loading, setLoading] = useState(false);
  // Get station data from Redux
  const stationData = useSelector((state: RootState) => state.chargingStation.selectedStation);
  

  console.log("Booking Details:", bookingDetails);

  const postBooking = async () => {
      setLoading(true);
      try {
       
        if (!stationData) {
          console.error('No station data available in Redux');
          return;
        }
        let stationId: string | undefined;
        const existingStationResponse = await axios.get(`${BASE_URL}/api/stations`, {
          params: {
            name: stationData.poi?.name,
            latitude: stationData.position.lat,
            longitude: stationData.position.lon,
          },
        });
    
        if (existingStationResponse.data && existingStationResponse.data.station) {
          // Station already exists
          console.log('Station already exists:',  existingStationResponse.data.stations[0]);
          stationId = existingStationResponse.data.stations[0]._id;
        } else {
         
          const stationResponse = await axios.post(`${BASE_URL}/api/stations`, {
            name: stationData.poi?.name,
            location: {
              latitude: stationData.position.lat,
              longitude: stationData.position.lon,
            },
            address: stationData.address?.freeformAddress,
            connectorTypes: stationData.chargingPark?.connectors.map((connector) => connector.connectorType),
            ratedPowerKW: stationData.chargingPark?.connectors.reduce((max, connector) => Math.max(max, connector.ratedPowerKW), 0),
            pricePerKwh: 12.5,
          });
    
          if (stationResponse.data) {
            console.log('Station posted successfully:', stationResponse.data);
            stationId = stationResponse.data._id;
          } else {
            console.error('Failed to post station:', stationResponse.data);
            return;
          }
        }
    
        if (!stationId) {
          console.error('Station ID is undefined');
          return;
        }
       
        const bookingResponse = await axios.post(`${BASE_URL}/api/bookings`, {
          ...bookingDetails,
          stationId, 
        });
    
        if (bookingResponse.status === 201 && bookingResponse.data.booking) {
          console.log('Booking posted successfully:', bookingResponse.data.booking);
          return bookingResponse.data.booking;
        } else {
          console.error('Failed to post booking:', bookingResponse.data);
        }
      } catch (error) {
        if(axios.isAxiosError(error)) {
          console.error('Axios error:', error.response?.data || error.message);
        } else {
          console.error('Unexpected error:', error);
        }
      }
      finally {
        setLoading(false);
      }
    };

  const handlePayment = async () => {
    const response = await postBooking();
    if (response) {
      console.log('Booking completed successfully:', response);
      console.log('Navigating to Booking Receipt...');
      navigation.navigate('BookingReceipt');
    }

  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00875A" />
        <Text style={styles.loaderText}>Booking is processing...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
          source={require('../../assets/img/bg.jpg')}
          style={styles.bgImgContainer}>
          
    <View style={styles.container}>

      <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Icon name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                
              </View>
      {/* Charging Station Info */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Image
            source={require("../../assets/img/ev-station2.jpeg")} 
            style={styles.stationImage}
          />
          <View style={styles.info}>
            <Text style={styles.stationTitle}>{stationData?.poi?.name || "Station Name Not Available"}</Text>
            <Text style={styles.stationSubtitle}>{stationData?.address?.freeformAddress || "NA"}</Text>
            <View style={styles.ratingRow}>
              <Icon name="star" size={16} color="gold" />
              <Text style={styles.ratingText}>4.7</Text>
              <Icon1 name="charging-station" size={16} color="green" />
              <Text style={styles.greyText}>8 Charging Points</Text>
            </View>
            <View style={styles.innerrow}>
            <Text style={styles.distance}>4.5 km</Text>
            <TouchableOpacity style={styles.directionButton}>
            <Text style={styles.directionText}>Get Direction</Text>
          </TouchableOpacity>
          </View>
          </View>
          
        </View>
        
      </View>

      {/* Car & Booking Details */}
      <View style={styles.card1}>
        <View style={styles.carInfo}>
          
          <View>
            <Text style={styles.carTitle}>{bookingDetails.vehicleModel}</Text>
            <Text style={styles.carType}>{bookingDetails.vehicleType}</Text>
          </View>
          <Image
            source={require("../../assets/img/car1.jpg")} 
            style={styles.carImage}
          />
        </View>
        
        <View style={styles.borderLine}/>
        <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{bookingDetails.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Slot time</Text>
              <Text style={styles.detailValue}>{bookingDetails.time}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Connection Type</Text>
              <Text style={styles.detailValue}>{bookingDetails.connectionType}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Battery</Text>
              <Text style={styles.detailValue}>{bookingDetails.estimatedKwh}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.detailValue}>Rs. 0.05/kW</Text>
            </View>
          </View>

        {/* <Text style={styles.chargeText}>
          You selected full charge for this booking.
        </Text> */}

        <Text style={styles.amountText}>Payable amount <Text style={styles.amountHighlight}>{bookingDetails.amount}</Text></Text>
      </View>

      {/* Confirm & Pay Button */}
      <TouchableOpacity onPress={() => handlePayment()} style={styles.confirmButton}>
        <Text style={styles.confirmText}>Confirm & Reserve</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
};

const DetailRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.detailRow}>
    <MaterialCommunityIcons name={icon} size={20} color="#444" />
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: Add a semi-transparent background
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: "#00875A",
    fontWeight: "bold",
  },
  bgImgContainer: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
   
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    
    marginBottom: 16,
    elevation: 3,
  },
  card1: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  innerrow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 17,
  },
  distance: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "bold"
    
  },
  stationImage: {
    width: 110,
    height: 168,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
   
  },
  stationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 15,
    padding: 5,
    marginTop: 5,
  },
  stationSubtitle: {
    padding: 5,
    fontSize: 13,
    color: "#777",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    justifyContent: 'space-between',
    marginRight: 15,
  },
  ratingText: {
    fontSize: 13,
    marginLeft: -9,
    fontWeight: "600",
  },
  greyText: {
    marginLeft: -5,
    fontSize: 13,
    color: "#777",
  },
  directionButton: {
    backgroundColor: "#059768",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  directionText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  carInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  carImage: {
    width: 91,
    height: 45,
    borderRadius: 8,
    marginRight: 12,
  },
  carTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  carType: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  borderLine: {
    borderBottomColor: '#777',
    borderBottomWidth: 1,
    marginVertical: 12,
  },
  details: {
    marginTop: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
  },

  chargeText: {
    marginTop: 15,
    fontSize: 18,
    color: "#059768",
    fontWeight: "600",
    textAlign: "center",
  },
  amountText: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  amountHighlight: {
    color: "#059768",
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#059768",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookingConfirm;
