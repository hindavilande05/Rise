import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import type {RootStackParamList} from '../types';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import {setSelectedStation} from '../Redux/chargingStationSlice';

const {width} = Dimensions.get('window');

type MapScreenRouteProp = RouteProp<RootStackParamList, 'MapViewScreen'>;
type NavProp = NativeStackNavigationProp<RootStackParamList, 'MapViewScreen'>;

const MapViewScreen = () => {
  const route = useRoute<MapScreenRouteProp>();
  const navigation = useNavigation<NavProp>();
  const dispatch = useDispatch();

  const {routeCoords, start, dest, chargingStations} = route.params;

  const mapViewRef = useRef<MapView>(null);

  const latitudes = [start.lat, dest.lat];
  const longitudes = [start.lon, dest.lon];

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLon = Math.min(...longitudes);
  const maxLon = Math.max(...longitudes);

  const initialRegion = {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLon + maxLon) / 2,
    latitudeDelta: Math.abs(maxLat - minLat) * 1.5,
    longitudeDelta: Math.abs(maxLon - minLon) * 1.5,
  };

  useEffect(() => {
    if (mapViewRef.current) {
      mapViewRef.current.animateToRegion(initialRegion, 1000);
    }
  }, [initialRegion]);

  useEffect(() => {
    if (!routeCoords || routeCoords.length === 0) {
      console.error('Route coordinates are empty!');
    }
  }, [routeCoords]);

  return (
    <View style={{flex: 1}}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        ref={mapViewRef}
        initialRegion={initialRegion}
        showsUserLocation={true}>
        {/* Start Marker */}
        <Marker
          coordinate={{latitude: start.lat, longitude: start.lon}}
          title="Start"
          pinColor="green"
        />

        {/* Destination Marker */}
        <Marker
          coordinate={{latitude: dest.lat, longitude: dest.lon}}
          title="Destination"
          pinColor="red"
        />

        {/* Route Polyline */}
        <Polyline
          coordinates={routeCoords}
          strokeColor="#0000FF"
          strokeWidth={4}
        />

        {/* Charging Stations */}
        {chargingStations?.map((station, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: station.position.lat,
              longitude: station.position.lon,
            }}
            title={station.poi?.name || 'EV Charging Station'}
            description={station.address?.freeformAddress}
            pinColor="#FFD700"
          />
        ))}
      </MapView>

      {/* Charging Stations Cards - Google Maps Style */}
      <View style={styles.cardContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} >
          {chargingStations?.map((station, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.stationName}>
                {station.poi?.name || 'EV Charging Station'}
              </Text>
              <Text style={styles.stationAddress}  numberOfLines={2}>
                {station.address?.freeformAddress || 'Unknown Address'}
              </Text>
              <Text style={styles.stationRating}>
                ⭐{' '}
                {((station.poi as any)?.rating || 4 + Math.random()).toFixed(1)}
              </Text>
              <Text style={styles.stationDetail}>
                🔌 Connectors:{' '}
                {station.chargingPark?.connectors?.length ?? 'Not Available'}
              </Text>

            

              <TouchableOpacity
                style={styles.viewMoreBtn}
                onPress={() => {
                  dispatch(setSelectedStation(station));
                  navigation.navigate('StationDetails');
                }}>
                <Text style={styles.viewMoreText}>View More</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Left Arrow Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={25} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 50,
    elevation: 5,
  },
  cardContainer: {
    position: 'absolute',
    bottom: 50,
    paddingHorizontal: 10,
  },
  card: {
    width: width * 0.8,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#222',
  },
  stationAddress: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  stationRating: {
    fontSize: 14,
    color: '#f1c40f',
    fontWeight: '600',
    marginBottom: 4,
  },
  stationDetail: {
    fontSize: 13,
    color: '#444',
    marginBottom: 2,
    paddingBottom: 9,
  },
  viewMoreBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#007bff',
    borderRadius: 6,
    bottom: 10,
    left: 10,
    position: 'absolute',
  },
  viewMoreText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default MapViewScreen;
