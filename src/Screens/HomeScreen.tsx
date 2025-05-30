import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Button,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import MapView, {Marker} from 'react-native-maps';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import PlanJourneyCard from '../Components/PlanJourneyCard';

const GO_MAPS_API_KEY = 'AlzaSyctPPvnwKRxmRIvqYVD_UuQMm7VUfLkfhL';
const routes = [
  {
    id: '1',
    start: 'Goa',
    end: 'Mumbai Central',
    distance: '577.00 kms',
    stops: '3 stops',
    startLocation: {latitude: 15.2993, longitude: 74.124},
    endLocation: {latitude: 18.9696, longitude: 72.8194},
  },
  {
    id: '2',
    start: 'Kolkata',
    end: 'Indore',
    distance: '1616.00 kms',
    stops: '5 stops',
    startLocation: {latitude: 22.5726, longitude: 88.3639},
    endLocation: {latitude: 22.7196, longitude: 75.8577},
  },
  {
    id: '3',
    start: 'Amravati',
    end: 'Paratwada Depot',
    distance: 'XX kms',
    stops: 'X stops',
    startLocation: {latitude: 20.9333, longitude: 77.75},
    endLocation: {latitude: 21.2667, longitude: 77.6333},
  },
];


const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [startLocation, setStartLocation] = useState<{
    name: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<{
    name: string;
    lat: number;
    lng: number;
  } | null>(null);

  const handleShowChargingStations = (route: any) => {
    navigation.navigate('StationDetails');
  };

  // const handleGetDirections = (route: any) => {
  //   navigation.navigate('DirectionsScreen', {
  //     startLocation: route.startLocation,
  //     endLocation: route.endLocation,
  //   });
  // };

  const handleGetDirections = (address: string) => {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address,
      )}`;
      Linking.openURL(url);
    };

  return (
 
    <View style={styles.bgImgContainer}>
    
      <ScrollView
        style={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.header}>Routes</Text>
          <PlanJourneyCard navigation={navigation} />
          <Text style={styles.subHeader}>My Routes</Text>
          <FlatList
            data={routes}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            renderItem={({item}) => (
              <View style={styles.routeCard}>
                <View style={styles.route1}>
                  <View style={styles.routeInfo}>
                    <Text style={styles.routeTitle}>
                      {item.start} to {item.end}
                    </Text>
                    <Text>
                      <Icon name="home" size={16} /> {item.start}
                    </Text>
                    <Text>
                      <Icon name="flag" size={16} /> {item.end}
                    </Text>
                    <Text>
                      <Icon name="road" size={16} /> {item.distance}
                    </Text>
                    <Text>
                      <Icon name="map-marker" size={16} /> {item.stops}
                    </Text>
                  </View>
                  <View style={styles.mapContainer}>
                    <MapView
                      style={styles.map}
                      initialRegion={{
                        latitude:
                          (item.startLocation.latitude +
                            item.endLocation.latitude) /
                          2,
                        longitude:
                          (item.startLocation.longitude +
                            item.endLocation.longitude) /
                          2,
                        latitudeDelta:
                          Math.abs(
                            item.startLocation.latitude -
                              item.endLocation.latitude,
                          ) * 2,
                        longitudeDelta:
                          Math.abs(
                            item.startLocation.longitude -
                              item.endLocation.longitude,
                          ) * 2,
                      }}
                      scrollEnabled={false}
                      zoomEnabled={false}
                      pitchEnabled={false}
                      rotateEnabled={false}>
                      <Marker
                        coordinate={item.startLocation}
                        title={item.start}
                      />
                      <Marker coordinate={item.endLocation} title={item.end} />
                    </MapView>
                    {/* <TouchableOpacity
                    style={styles.directionsButton}
                    onPress={() =>
                      navigation.navigate('DirectionsScreen', {
                        startLocation: item.startLocation,
                        endLocation: item.endLocation,
                      })
                    }>
                    <Text style={styles.directionsButtonText}>Get Directions</Text>
                  </TouchableOpacity> */}
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.chargingButton]}
                    onPress={() => handleShowChargingStations(item)}>
                    <Icon1 name="charging-station" size={16} color="#FFF" />
                    <Text style={styles.buttonText}>Charging Stations</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.directionButton]}
                    onPress={() => handleGetDirections(`${item.endLocation.latitude},${item.endLocation.longitude}`)}>
                    <Icon1 name="directions" size={16} color="#FFF" />
                    <Text style={styles.buttonText}>Get Directions</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
      </View>

  );
};

const styles = StyleSheet.create({

  bgImgContainer:{
    backgroundColor: '#e2fdf0'

  },
  
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    
  },
  searchBox: {
    backgroundColor: 'rgba(240, 235, 235, 0.87)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  searchLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchPinIcon: {
    marginRight: 8,
    color: '#ff5733',
  },
  h2: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: 'black',
  },
  searchIcon: {
    marginLeft: 10,
  },

  listView: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    
  },
  routeCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#FFF',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#deeee7',
  },

  route1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',

    marginBottom: 5,
  },
  routeInfo: {
    flex: 1,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  mapContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 9,
    borderRadius: 8,

    alignItems: 'center',
    justifyContent: 'center',
  },
  chargingButton: {
    backgroundColor: '#FFA500',
    marginRight: 2,
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  directionButton: {
    backgroundColor: '#059768',
    marginLeft: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    paddingHorizontal: 7,
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
