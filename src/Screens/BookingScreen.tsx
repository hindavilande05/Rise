import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ImageBackground,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import Slider from '@react-native-community/slider';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store'; 
import axios from 'axios';
import { BASE_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface SelectedOptions {
  vehicleType: string;
  vehicleModel: string;
  connectionType: string;
  date: string;
  time: string;
  amount: string;
}

interface BookingDetails {
  userId: string;
  vehicleType: string;
  vehicleModel: string;
  connectionType: string;
  date: string;
  time: string;
  amount: number;
  estimatedKwh: string;
}

const vehicleTypes = ['2 Wheeler', '4 Wheeler', 'Heavy Vehicle'];
const connectionTypes = ['Type 1', 'Type 2', 'CCS', 'CHAdeMO'];
const vehicleModels = [
  {name: 'Mercedes Benz EQS'},
  {name: 'Audi Q8 e-tron'},
  {name: 'Hyundai Ioniq 5'},
  {name: 'BMW i7'},
  {name: 'BYD Atto 3'},
  {name: 'TATA Nexon EV'},
  {name: 'Tesla Model X'},
];


const BookingScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    
  // Get station data from Redux
  const stationData = useSelector((state: RootState) => state.chargingStation.selectedStation);
  
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    vehicleType: '',
    vehicleModel: '',
    connectionType: '',
    date: '',
    time: '',
    amount: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [isFullCharge, setIsFullCharge] = useState(false);
  const [loading, setLoading] = useState(false);
  const pricePerKwh = 10;

  const handleSelect = (key: keyof SelectedOptions, value: string) => {
    setSelectedOptions({...selectedOptions, [key]: value});
    setModalVisible(false);
  };

  const openModal = (type: string) => {
    setModalType(type);
    setModalVisible(true);
  };

  const getModalData = () => {
    switch (modalType) {
      case 'vehicleType':
        return vehicleTypes;
      case 'vehicleModel':
        return vehicleModels;
      case 'connectionType':
        return connectionTypes;
      default:
        return [];
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'vehicleType':
        return 'Vehicle Type';
      case 'vehicleModel':
        return 'Vehicle Model';
      case 'connectionType':
        return 'Connection Type';
      default:
        return '';
    }
  };

  const handleFullChargeToggle = () => {
    setIsFullCharge(!isFullCharge);
    if (!isFullCharge) {
      setSelectedAmount(5000);
    } else {
      setSelectedAmount(0);
    }
  };

  const calculateCharge = (amount: number) => {
    return (amount / pricePerKwh).toFixed(2);
  };


  const fetchUserId = async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "No authentication token found. Please log in again.");
        return null;
      }

      const response = await axios.get(`${BASE_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data?._id || null; 
    } catch (error) {
      console.error("Error fetching user ID:", error);
      Alert.alert("Error", "Failed to fetch user ID.");
      return null;
    }
  };


  // const postBooking = async (bookingDetails: BookingDetails): Promise<any> => {
  //   setLoading(true);
  //   try {
     
  //     if (!stationData) {
  //       console.error('No station data available in Redux');
  //       return;
  //     }
  //     let stationId: string | undefined;
  //     const existingStationResponse = await axios.get(`${BASE_URL}/api/stations`, {
  //       params: {
  //         name: stationData.poi?.name,
  //         latitude: stationData.position.lat,
  //         longitude: stationData.position.lon,
  //       },
  //     });
  
      
  
  //     if (existingStationResponse.data && existingStationResponse.data.station) {
  //       // Station already exists
  //       console.log('Station already exists:',  existingStationResponse.data.stations[0]);
  //       stationId = existingStationResponse.data.stations[0]._id;
  //     } else {
       
  //       const stationResponse = await axios.post(`${BASE_URL}/api/stations`, {
  //         name: stationData.poi?.name,
  //         location: {
  //           latitude: stationData.position.lat,
  //           longitude: stationData.position.lon,
  //         },
  //         address: stationData.address?.freeformAddress,
  //         connectorTypes: stationData.chargingPark?.connectors.map((connector) => connector.connectorType),
  //         ratedPowerKW: stationData.chargingPark?.connectors.reduce((max, connector) => Math.max(max, connector.ratedPowerKW), 0),
  //         pricePerKwh: 12.5,
  //       });
  
  //       if (stationResponse.data) {
  //         console.log('Station posted successfully:', stationResponse.data);
  //         stationId = stationResponse.data._id;
  //       } else {
  //         console.error('Failed to post station:', stationResponse.data);
  //         return;
  //       }
  //     }
  
  //     if (!stationId) {
  //       console.error('Station ID is undefined');
  //       return;
  //     }
     
  //     const bookingResponse = await axios.post(`${BASE_URL}/api/bookings`, {
  //       ...bookingDetails,
  //       stationId, 
  //     });
  
  //     if (bookingResponse.status === 201 && bookingResponse.data.booking) {
  //       console.log('Booking posted successfully:', bookingResponse.data.booking);
  //       return bookingResponse.data.booking;
  //     } else {
  //       console.error('Failed to post booking:', bookingResponse.data);
  //     }
  //   } catch (error) {
  //     if(axios.isAxiosError(error)) {
  //       console.error('Axios error:', error.response?.data || error.message);
  //     } else {
  //       console.error('Unexpected error:', error);
  //     }
  //   }
  //   finally {
  //     setLoading(false);
  //   }
  // };

  
  const handleBooking = async () => {
    try{
      setLoading(true);

      const userId = await fetchUserId();
      if (!userId) {
        console.error("User ID not found");
        return;
      }

    const bookingDetails = {
      userId,
      vehicleType: selectedOptions.vehicleType,
      vehicleModel: selectedOptions.vehicleModel,
      connectionType: selectedOptions.connectionType,
      date: selectedOptions.date,
      time: selectedOptions.time,
      amount: selectedAmount,
      estimatedKwh: calculateCharge(selectedAmount),
    };

    navigation.navigate('BookingConfirm', { bookingDetails });
  
    //const response = await postBooking(bookingDetails);
    // if (response) {
    //   console.log('Booking completed successfully:', response);
    //   navigation.navigate('BookingConfirm'); 
    // }

  }catch (error) {
    console.error('Error in handleBooking:', error);
    Alert.alert("Error", "Failed to complete booking.");
  } finally{
    setLoading(false);
  }
  };

  return (
    <ImageBackground
      source={require('../../assets/img/bg.jpg')}
      style={styles.bgImgContainer}>
        <ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Book Slot</Text>
        </View>

        {/* Selection List */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => openModal('vehicleType')}>
          <Text style={styles.optionLabel}>Vehicle type</Text>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>
              {selectedOptions.vehicleType || 'Choose your vehicle type'}
            </Text>
            <Icon name="chevron-right" size={24} color="#888" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => openModal('vehicleModel')}>
          <Text style={styles.optionLabel}>Vehicle model</Text>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>
              {selectedOptions.vehicleModel || 'Choose your vehicle model'}
            </Text>
            <Icon name="chevron-right" size={24} color="#888" />
          </View>
        </TouchableOpacity>

        {/** Connection Type Selection */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => openModal('connectionType')}>
          <Text style={styles.optionLabel}>Connection Type</Text>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>
              {selectedOptions.connectionType || 'Choose connection type'}
            </Text>
            <Icon name="chevron-right" size={24} color="#888" />
          </View>
        </TouchableOpacity>

        {/** Date Picker */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => setShowDatePicker(true)}>
          <Text style={styles.optionLabel}>Date</Text>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>
              {selectedOptions.date || 'Choose date'}
            </Text>
            <Icon name="chevron-right" size={24} color="#888" />
          </View>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="calendar"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                handleSelect('date', selectedDate.toDateString());
              }
            }}
          />
        )}

        {/** Time Picker */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => setShowTimePicker(true)}>
          <Text style={styles.optionLabel}>Time</Text>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>
              {selectedOptions.time || 'Choose time'}
            </Text>
            <Icon name="chevron-right" size={24} color="#888" />
          </View>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            display="clock"
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) {
                handleSelect('time', selectedTime.toLocaleTimeString());
              }
            }}
          />
        )}

        {/* Slider Section */}

        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Select Amount (₹)</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={2000}
            step={100}
            value={selectedAmount}
            onSlidingComplete={(value: number) => {
              setSelectedAmount(value);
              setIsFullCharge(false); 
            }}
            minimumTrackTintColor="#0a7d00"
            maximumTrackTintColor="#ddd"
            thumbTintColor="#0a7d00"
          />
          <Text style={styles.amountText}>
            Selected Amount: ₹{selectedAmount}
          </Text>
          <Text style={styles.chargeText}>
            You will get approximately {calculateCharge(selectedAmount)} kWh
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity onPress={() => handleBooking()} style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        {/* Modal for Selection */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{getModalTitle()}</Text>
              <FlatList
                data={getModalData()}
                keyExtractor={(
                  item:
                    | {
                        name: string;
                      }
                    | string,
                ) => (typeof item === 'string' ? item : item.name)}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() =>
                      handleSelect(
                        modalType as keyof SelectedOptions,
                        typeof item === 'string' ? item : item.name,
                      )
                    }>
                    <Text style={styles.modalItemText}>
                      {typeof item === 'string' ? item : item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  bgImgContainer: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  option: {
    backgroundColor: '#f7f7f7',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  optionText: {
    fontSize: 14,
    color: '#888',
  },
  sliderContainer: {
    backgroundColor: '#f7f7f7',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  chargeText: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },

  button: {
    backgroundColor: '#059768',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  vehicleImage: {
    width: 50,
    height: 20,
    marginRight: 10,
  },
  modalItemText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: 'red',
  },
});
