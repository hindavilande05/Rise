import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL} from '../../config';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import Icon from 'react-native-vector-icons/Ionicons';

type Booking = {
  _id: string;
  date: string;
  time: string;
  status: string;
  stationId: {
    name: string;
    address: string;
  };
};

const MyBookings: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [selectedTab, setSelectedTab] = useState<'ongoing' | 'history'>(
    'ongoing',
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const handleViewDetail = (_id: string) => {
    navigation.navigate('BookingDetails', {bookingId: _id});
  };

  useEffect(() => {
    fetchBookings(selectedTab === 'ongoing' ? 'upcoming' : 'history');
  }, [selectedTab]);

  // const fetchBookings = async () => {
  //   try {
  //     setLoading(true);

  //     const token = await AsyncStorage.getItem("authToken");

  //     console.log('Token:', token);
  //     const response = await axios.get(`${BASE_URL}/api/bookings/`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     console.log('Bookings response:', response.data);
  //     setBookings(response.data);
  //   } catch (error) {
  //     console.error('Error fetching bookings:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchBookings = async (status: 'upcoming' | 'history') => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');

      const queryStatus =
        status === 'upcoming' ? 'upcoming' : 'cancelled,completed';

      const response = await axios.get(
        `${BASE_URL}/api/bookings?status=${queryStatus}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (_id: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.put(
        `${BASE_URL}/api/bookings/cancelBooking/${_id}`,
        {},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      fetchBookings('upcoming');
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const renderBookingItem = ({item}: {item: Booking}) => (
    <View style={styles.bookingCard}>
      <Image
        source={require('../../assets/img/ev-station2.jpeg')}
        style={styles.bookingImage}
      />
      <View style={styles.bookingInfo}>
        <Text style={styles.dateTimeText}>{`${item.date} - ${item.time}`}</Text>
        <Text style={styles.stationName}>{item.stationId.name}</Text>
        <Text style={styles.location}>{item.stationId.address}</Text>

        {selectedTab === 'history' && (
          <Text style={styles.statusText}>
            Status:{' '}
            <Text style={{fontWeight: 'bold', textTransform: 'capitalize'}}>
              {item.status}
            </Text>
          </Text>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleViewDetail(item._id)}>
            <Text style={styles.viewButtonText}>View Detail</Text>
          </TouchableOpacity>

          {selectedTab === 'ongoing' && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancel(item._id)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.backbtn}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.header}> My Bookings</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'ongoing' && styles.activeTab]}
          onPress={() => setSelectedTab('ongoing')}>
          <Text
            style={[
              styles.tabText,
              selectedTab === 'ongoing' && styles.activeTabText,
            ]}>
            Ongoing booking
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'history' && styles.activeTab]}
          onPress={() => setSelectedTab('history')}>
          <Text
            style={[
              styles.tabText,
              selectedTab === 'history' && styles.activeTabText,
            ]}>
            Booking history
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00A86B" />
      ) : bookings.length === 0 ? (
        <View style={styles.noBookingsContainer}>
          <Text style={styles.noBookingsText}>No bookings found.</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={item => item._id}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default MyBookings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3fcee',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backbtn: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 10,
  },
  
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 15,
    
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e3fcee',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#00A86B',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#00A86B',
    fontWeight: 'bold',
  },

  listContent: {
    paddingBottom: 20,
  },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#FFF',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#deeee7',
  },
  bookingImage: {
    width: 100,
    height: 140,
  },
  bookingInfo: {
    flex: 1,
    padding: 10,
  },
  dateTimeText: {
    color: '#00A86B',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  stationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  location: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 'auto',
  },
  viewButton: {
    backgroundColor: '#00A86B',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginRight: 10,
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  noBookingsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noBookingsText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  statusText: {
    marginTop: 6,
    fontSize: 13,
    color: '#555',
  },
});
