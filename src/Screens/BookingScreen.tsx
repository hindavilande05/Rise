import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Image,
  Platform,
  ImageSourcePropType,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface SelectedOptions {
  vehicleType: string;
  vehicleModel: string;
  connectionType: string;
  date: string;
  time: string;
  amount: string;
}

const vehicleTypes = ['2 Wheeler', '4 Wheeler', 'Heavy Vehicle'];
const connectionTypes = ['Type 1', 'Type 2', 'CCS', 'CHAdeMO'];
const vehicleModels = [
  {name: 'Mercedes Benz EQS', image: require('../../assets/img/car1.jpg')},
  {name: 'Audi Q8 e-tron', image: require('../../assets/img/car1.jpg')},
  {name: 'Hyundai Ioniq 5', image: require('../../assets/img/car1.jpg')},
  {name: 'BMW i7', image: require('../../assets/img/car1.jpg')},
  {name: 'BYD Atto 3', image: require('../../assets/img/car1.jpg')},
  {name: 'TATA Nexon EV', image: require('../../assets/img/car1.jpg')},
  {name: 'Tesla Model X', image: require('../../assets/img/car1.jpg')},
];

const BookingScreen = () => {
  const navigation = useNavigation();
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


  function handleNext(selectedOptions: SelectedOptions): void {
    navigation.navigate('BookingConfirm', {selectedOptions});
  }

  return (
    <ImageBackground
      source={require('../../assets/img/bg.jpg')}
      style={styles.bgImgContainer}>
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

        {/* Continue Button */}
        <TouchableOpacity onPress={() => handleNext(selectedOptions) } style={styles.button}>
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
                        image: ImageSourcePropType | undefined;
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
                    {typeof item !== 'string' && (
                      <Image source={item.image} style={styles.vehicleImage} />
                    )}
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
  button: {
    backgroundColor: '#0a7d00',
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
