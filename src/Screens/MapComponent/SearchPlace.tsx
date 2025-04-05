import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';


const TOMTOM_API_KEY = 'UkAy5vXjPlyFW09VQYsnbG1PJvnMxN5B';

interface Location {
  latitude: number;
  longitude: number;
}

interface SearchResult {
  id: string;
  name: string;
  position: {
    lat: number;
    lon: number;
  };
}

interface ChargingStation {
  id: string;
  name: string;
  address: string;
  position: {
    lat: number;
    lon: number;
  };
}

const SearchPlace: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [chargingStations, setChargingStations] = useState<ChargingStation[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (!query || query.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchSearchSuggestions(query);
    }, 500);
  }, [query]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Location access was denied');
          setLoading(false);
          return;
        }
      } catch (error) {
        Alert.alert('Error', 'Permission error');
        setLoading(false);
        return;
      }
    }

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const currentLoc = { latitude, longitude };
        setSelectedLocation(currentLoc);
        fetchChargingStations(latitude, longitude);
        setLoading(false);
      },
      error => {
        Alert.alert('Location Error', error.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchSearchSuggestions = async (text: string) => {
    try {
      const res = await axios.get(
        `https://api.tomtom.com/search/2/search/${text}.json`,
        {
          params: {
            key: TOMTOM_API_KEY,
            typeahead: true,
            limit: 5,
          },
        }
      );

      const suggestions = res.data.results.map((item: any) => ({
        id: item.id,
        name: item.address?.freeformAddress || 'Unnamed',
        position: item.position,
      }));

      setSearchResults(suggestions);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    }
  };

  const fetchChargingStations = async (lat: number, lon: number) => {
    try {
      const res = await axios.get(
        `https://api.tomtom.com/search/2/poiSearch/charging%20station.json`,
        {
          params: {
            key: TOMTOM_API_KEY,
            lat,
            lon,
            radius: 200000,
            limit: 100,
          },
        }
      );

      const stations = res.data.results.map((station: any) => ({
        id: station.id,
        name: station.poi.name,
        address: station.address?.freeformAddress || 'Unknown',
        position: station.position,
      }));

      setChargingStations(stations);
    } catch (err) {
      console.error('Charging station error:', err);
      setChargingStations([]);
    }
  };

  const handleSelectLocation = (place: SearchResult) => {
    const newLoc = {
      latitude: place.position.lat,
      longitude: place.position.lon,
    };
    setSelectedLocation(newLoc);
    setQuery(place.name);
    setSearchResults([]);
    setIsTyping(false);
    fetchChargingStations(place.position.lat, place.position.lon);

    mapRef.current?.animateToRegion({
      latitude: newLoc.latitude,
      longitude: newLoc.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Fetching current location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBox}
          placeholder="Search location"
          value={query}
          onChangeText={text => {
            setQuery(text);
            setIsTyping(true);
          }}
          onFocus={() => setIsTyping(true)}
        />
      </View>

      {isTyping && searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.resultItem} onPress={() => handleSelectLocation(item)}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={styles.resultsList}
        />
      )}

      {selectedLocation && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker coordinate={selectedLocation} title="Your location" />

          {chargingStations.map(station => (
            <Marker
            key={station.id}
            coordinate={{
              latitude: station.position.lat,
              longitude: station.position.lon,
            }}
            title={station.name}
            description={station.address}
            image={require('../../../assets/img/ev_marker.png')}
            onPress={() => {
              Alert.alert(station.name, station.address, [{ text: 'OK' }]);
            }}
          />
          
          ))}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 2,
  },
  searchBox: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  resultsList: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    maxHeight: 200,
    backgroundColor: 'white',
    zIndex: 2,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
  },
});

export default SearchPlace;
