import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {RootStackParamList} from '../types';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import {RootState} from '../Redux/store';

// Amenity Component
interface AmenityProps {
  icon: string;
  label: string;
}

// Connection Component
interface ConnectionProps {
  type: string;
  power: string;
  price: string;
  taken: string;
}

// Define Interfaces
interface Checkin {
  id: string;
  user: string;
  date: string;
  profilePic: any; // Image source
  charger: string;
  chargeDone: string;
  comment: string;
  rating: number;
}

const checkins: Checkin[] = [
  {
    id: '1',
    user: 'Hindavi Lande',
    date: '5 days ago',
    profilePic: require('../../assets/img/profile1.jpg'),
    charger: 'J1772',
    chargeDone: '80%',
    comment:
      'Half the J1772 chargers ⚡ are not working & haven’t been working for months. The other half are slow.',
    rating: 2,
  },
  {
    id: '2',
    user: 'Raj Thakare',
    date: 'Sep 24',
    profilePic: require('../../assets/img/profile2.jpg'),
    charger: 'Tesla Model Y',
    chargeDone: '90%',
    comment: 'Fast charging! No issues so far.',
    rating: 5,
  },
  {
    id: '3',
    user: 'Gargi',
    date: 'Sep 22',
    profilePic: require('../../assets/img/profile1.jpg'),
    charger: 'J1772',
    chargeDone: '60%',
    comment:
      'They work fine, might be hard to find if you have never been here before.',
    rating: 3,
  },
  {
    id: '4',
    user: 'Avi',
    date: 'Sep 18',
    profilePic: require('../../assets/img/profile2.jpg'),
    charger: 'CHAdeMO',
    chargeDone: '95%',
    comment:
      'For some reason SkyE is charging slower than molasses today. Has charged much faster in the past.',
    rating: 2,
  },
];

const StationDetails: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const station = useSelector(
    (state: RootState) => state.chargingStation.selectedStation,
  );

  if (!station) {
    return (
      <View style={styles.container}>
        <Text>No station selected.</Text>
      </View>
    );
  }

  const {poi, address, chargingPark} = station;
  const connectors = chargingPark?.connectors || [];

  const handleGetDirections = (address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address,
    )}`;
    Linking.openURL(url);
  };

  const handleBooking = () => {
    navigation.navigate('BookingScreen');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 100}}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled>
        {/* Back Icon */}
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={15} color="#FFF" />
        </TouchableOpacity>

        <Image
          source={require('../../assets/img/ev-station2.jpeg')}
          style={styles.headerImage}
        />

        {/* Charging Station Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>
            {station.poi?.name || 'EV Charging Station'}
          </Text>
          <Text style={styles.subtitle}>
            {station.address?.freeformAddress || 'Unknown address'}
          </Text>
          <Text style={styles.openHours}>
            {station.openingHours?.text || 'Open 24 hours'}
          </Text>
          <TouchableOpacity style={styles.favIcon}>
            <Icon name="heart" size={22} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Amenities Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesRow}>
            <Amenity icon="toilet" label="Washroom" />
            <Amenity icon="chair" label="Sitting area" />
            <Amenity icon="wifi" label="FREE Wifi" />
            <Amenity icon="utensils" label="Food" />
          </View>
        </View>

        {/* Connections Available */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connections available</Text>
          <View style={styles.connectionsRow}>
            <Connection
              type="CCS"
              power="55 kW"
              price=" Rs 0.05/kW"
              taken="0/3"
            />
            <Connection
              type="CCS2"
              power="55 kW"
              price="Rs 0.05/kW"
              taken="2/5"
            />
            <Connection
              type="Mennekes"
              power="34 kW"
              price="Rs 0.02/kW"
              taken="6/6"
            />
          </View>
        </View> */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connectors</Text>
          <View style={styles.connectionsRow}>
            {connectors.length === 0 ? (
              <Text style={{fontStyle: 'italic'}}>
                No connectors available.
              </Text>
            ) : (
              connectors.map((connector, index) => (
                <View key={index} style={styles.connectionItem}>
                  <Icon name="plug" size={30} color="#4CAF50" />
                  <Text style={styles.connectionText}>
                    {connector.connectorType}
                  </Text>
                  <Text style={styles.connectionSubText}>
                    {connector.ratedPowerKW} kW
                  </Text>
                  <Text style={styles.connectionSubText}>
                    {connector.voltageV}V | {connector.currentA}A (
                    {connector.currentType})
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Reviews Section */}
        {/* Check-ins Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Check-ins</Text>
          <FlatList
            data={checkins}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View style={styles.checkinItem}>
                <Image source={item.profilePic} style={styles.profilePic} />
                <View style={styles.checkinTextContainer}>
                  <Text style={styles.checkinUser}>{item.user}</Text>
                  <Text style={styles.checkinDate}>{item.date}</Text>
                  <Text style={styles.checkinCharger}>
                    <Icon name="plug" size={14} color="#4CAF50" />{' '}
                    {item.charger} - {item.chargeDone}
                  </Text>
                  <Text style={styles.checkinComment}>{item.comment}</Text>
                  <Text style={styles.checkinRating}>
                    {'★'.repeat(item.rating)}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleBooking}
          style={[styles.button, styles.bookButton]}>
          <Icon
            name="calendar-alt"
            size={16}
            color="#FFF"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Book Slot</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            handleGetDirections('PB No. 10, Sai Nagar, badnera Road, Amravati')
          }
          style={[styles.button, styles.directionButton]}>
          <Icon
            name="directions"
            size={16}
            color="#FFF"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Get Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Amenity: React.FC<AmenityProps> = ({icon, label}) => (
  <View style={styles.amenityItem}>
    <Icon name={icon} size={24} color="#4CAF50" />
    <Text style={styles.amenityText}>{label}</Text>
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8F8F8'},
  backIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#808080',
    borderRadius: 25,
  },
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 15,
    backgroundColor: '#FFF',
    position: 'relative',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 15,
    color: '#777',
  },
  openHours: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 5,
  },
  favIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  section: {
    backgroundColor: '#FFF',
    padding: 15,
    marginVertical: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  amenitiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  amenityItem: {
    alignItems: 'center',
  },
  amenityText: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
  },

  connectionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 10,
  },
  connectionItem: {
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '30%',
    marginBottom: 10,
  },
  connectionText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  connectionSubText: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },

  connectorText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  checkinText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFF',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bookButton: {
    backgroundColor: '#FFA500',
  },
  directionButton: {
    backgroundColor: '#007BFF',
  },

  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  checkinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profilePic: {width: 40, height: 40, borderRadius: 20, marginRight: 10},
  checkinTextContainer: {flex: 1},
  checkinUser: {fontWeight: 'bold'},
  checkinDate: {color: '#777', fontSize: 12},
  checkinCharger: {color: '#4CAF50'},
  checkinComment: {color: '#555', marginTop: 5},
  checkinRating: {color: '#FFD700', marginTop: 5},
});

export default StationDetails;
