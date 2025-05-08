import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/FontAwesome6';
import {
  useNavigation,
  NavigationProp,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import {RootStackParamList} from '../types';
import axios from 'axios';
import {BASE_URL} from '../../config';

type BookingDetailsRouteProp = RouteProp<RootStackParamList, 'BookingDetails'>;

const BookingDetails = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<BookingDetailsRouteProp>();
  const {bookingId} = route.params;
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/bookings/getBookingById/${bookingId}`,
        );

        setBooking(response.data);
        console.log('Booking details:', response.data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00875A" />
        <Text style={styles.loaderText}>Fetching Details...</Text>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.loaderText}>No booking found</Text>
      </View>
    );
  }

  const cancelBooking = async () => {
    try {
      await axios.put(`${BASE_URL}/api/bookings/cancelBooking/${bookingId}`);
      Alert.alert('Booking cancelled successfully');
      setBooking((prevBooking: any) => ({
        ...prevBooking,
        status: "cancelled",
      }));
    } catch (error) {
      console.error('Cancel error:', error);
      Alert.alert('Failed to cancel booking');
    }
  };

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
              source={require('../../assets/img/ev-station2.jpeg')}
              style={styles.stationImage}
            />
            <View style={styles.info}>
              <Text style={styles.stationTitle}>
                {booking?.stationId?.name || 'Station Name Not Available'}
              </Text>
              <Text style={styles.stationSubtitle}>
                {booking?.stationId?.address || 'NA'}
              </Text>
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
              <Text style={styles.carTitle}>{booking?.vehicleModel || 'Model N/A'}</Text>
              <Text style={styles.carType}>{booking?.vehicleType || 'Type N/A'}</Text>
            </View>
            <Image
              source={require('../../assets/img/car1.jpg')}
              style={styles.carImage}
            />
          </View>

          <View style={styles.borderLine} />
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{booking?.date || 'Date N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Slot time</Text>
              <Text style={styles.detailValue}>{booking.time}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Connection Type</Text>
              <Text style={styles.detailValue}>{booking.connectionType}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Battery</Text>
              <Text style={styles.detailValue}>{booking.estimatedKwh}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.detailValue}>Rs. 0.05/kW</Text>
            </View>
          </View>

          {/* <Text style={styles.chargeText}>
            You selected full charge for this booking.
          </Text> */}

          <Text style={styles.amountText}>
            Payable amount{' '}
            <Text style={styles.amountHighlight}>{booking.amount}</Text>
          </Text>
        </View>

        {/* Cancle Button */}
        {booking.status === 'cancelled' ? (
          <Text style={styles.chargeText}>
            Booking has been cancelled.
          </Text>
        ) : (
          <TouchableOpacity onPress={cancelBooking} style={styles.canclebtn}>
            <Text style={styles.cancleText}>Cancel Booking</Text>
          </TouchableOpacity>
        )}
        
      </View>
    </ImageBackground>
  );
};

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <View style={styles.detailRow}>
    <MaterialCommunityIcons name={icon} size={20} color="#444" />
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#00875A',
    fontWeight: 'bold',
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
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 16,
    elevation: 3,
  },
  card1: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerrow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 17,
  },
  distance: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    marginRight: 15,
    padding: 5,
    marginTop: 5,
  },
  stationSubtitle: {
    padding: 5,
    fontSize: 13,
    color: '#777',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'space-between',
    marginRight: 15,
  },
  ratingText: {
    fontSize: 13,
    marginLeft: -9,
    fontWeight: '600',
  },
  greyText: {
    marginLeft: -5,
    fontSize: 13,
    color: '#777',
  },
  directionButton: {
    backgroundColor: '#059768',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  directionText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  carInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontWeight: 'bold',
  },
  carType: {
    fontSize: 14,
    color: '#777',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },

  chargeText: {
    marginTop: 15,
    fontSize: 18,
    color: '#00875A',
    fontWeight: '600',
    textAlign: 'center',
  },
  amountText: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  amountHighlight: {
    color: '#00875A',
    fontWeight: 'bold',
  },
  canclebtn: {
    backgroundColor: '#00875A',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancleText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingDetails;
