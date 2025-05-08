import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import {TOMTOM_API_KEY} from '../../config';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RoutingTest = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [startQuery, setStartQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');
  const [startLocation, setStartLocation] = useState<any>(null);
  const [destLocation, setDestLocation] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [type, setType] = useState<'start' | 'dest' | null>(null);
  const [info, setInfo] = useState<{distance: string; time: string} | null>(
    null,
  );
  const [routeCoords, setRouteCoords] = useState<any[]>([]);
  const [chargingStations, setChargingStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // loading state

  const handleAutocomplete = async (query: string, mode: 'start' | 'dest') => {
    setType(mode);
    if (query.length < 3) return;
    const url = `https://api.tomtom.com/search/2/search/${query}.json?key=${TOMTOM_API_KEY}&limit=5&countrySet=IN`;
    const res = await axios.get(url);
    setSuggestions(res.data.results);
  };

  const selectLocation = (location: any) => {
    const {position, address} = location;
    if (type === 'start') {
      setStartLocation(position);
      setStartQuery(address.freeformAddress);
    } else {
      setDestLocation(position);
      setDestQuery(address.freeformAddress);
    }
    setSuggestions([]);
    setType(null);
  };

  const formatTime = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
  };

  const fetchChargingStations = async (coords: any[]) => {
    const radiusMeters = 1000; // 2 km radius
    let stations: any[] = [];

    // Divide the route into 10 parts
    const parts = divideRouteIntoParts(coords, 10);

    await Promise.all(
      parts.map(async part => {
        const midpoint = part[Math.floor(part.length / 2)]; // Midpoint of the current part
        const url = `https://api.tomtom.com/search/2/poiSearch/charging%20station.json?lat=${midpoint.latitude}&lon=${midpoint.longitude}&radius=${radiusMeters}&key=${TOMTOM_API_KEY}`;
        try {
          const res = await axios.get(url);
          stations.push(...res.data.results);
        } catch (err) {
          if (err instanceof Error) {
            console.error('Station fetch failed at:', midpoint, err.message);
          }
        }
      }),
    );

    // Remove duplicates by position
    const uniqueStations = stations.filter(
      (station, index, self) =>
        index ===
        self.findIndex(
          s =>
            s.position.lat === station.position.lat &&
            s.position.lon === station.position.lon,
        ),
    );

    return uniqueStations.slice(0, 10);
  };

  // Helper function to divide the route into 5 parts
  const divideRouteIntoParts = (coords: any[], parts: number) => {
    const partSize = Math.floor(coords.length / parts);
    const routeParts = [];
    for (let i = 0; i < parts; i++) {
      const start = i * partSize;
      const end = i === parts - 1 ? coords.length : (i + 1) * partSize;
      routeParts.push(coords.slice(start, end));
    }
    return routeParts;
  };

  const getRouteInfo = async () => {
    if (!startLocation || !destLocation) {
      Alert.alert('Please select both start and destination.');
      return;
    }

    setLoading(true);
    setInfo(null);
    setRouteCoords([]);
    setChargingStations([]);

    try {
      const url = `https://api.tomtom.com/routing/1/calculateRoute/${startLocation.lat},${startLocation.lon}:${destLocation.lat},${destLocation.lon}/json?key=${TOMTOM_API_KEY}&traffic=false`;
      const res = await axios.get(url);
      const summary = res.data.routes[0].summary;

      const distanceKm = (summary.lengthInMeters / 1000).toFixed(2);
      const travelTimeMin = Math.round(summary.travelTimeInSeconds / 60);
      const formattedTime = formatTime(travelTimeMin);

      setInfo({distance: `${distanceKm} km`, time: formattedTime});

      const points = res.data.routes[0].legs[0].points;
      const coords = points.map((pt: any) => ({
        latitude: pt.latitude,
        longitude: pt.longitude,
      }));

      setRouteCoords(coords);

      const stations = await fetchChargingStations(coords);
      setChargingStations(stations);
    } catch (err) {
      Alert.alert('Error fetching route or stations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMap = () => {
    if (
      !routeCoords.length ||
      !startLocation ||
      !destLocation ||
      !chargingStations.length
    ) {
      Alert.alert('Please click "Get Info" first and wait for data to load.');
      return;
    }

    console.log('Navigating to MapViewScreen with:', {
      routeCoords,
      start: startLocation,
      dest: destLocation,
      chargingStations,
    });

    navigation.navigate('MapViewScreen', {
      routeCoords,
      start: startLocation,
      dest: destLocation,
      chargingStations,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon1 name="arrow-back-ios" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Plan your journey</Text>
      </View>

      <View style={styles.locationRow}>
        <Icon name="circle" size={10} color="#0fa4e9" />
        <TextInput
          style={styles.input}
          value={startQuery}
          placeholder="Start Location"
          onChangeText={text => {
            setStartQuery(text);
            handleAutocomplete(text, 'start');
          }}
        />
      </View>
      

      <View style={styles.locationRow}>
      <Icon name="circle" size={10} color="#f53f5f" />
      <TextInput
        style={styles.input}
        value={destQuery}
        placeholder="Destination"
        onChangeText={text => {
          setDestQuery(text);
          handleAutocomplete(text, 'dest');
        }}
      />

      </View>

      

      <FlatList
        data={suggestions}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => selectLocation(item)}
            style={styles.suggestion}>
            <Text>{item.address.freeformAddress}</Text>
          </TouchableOpacity>
        )}
      />

      {loading && (
        <ActivityIndicator
          size="large"
          color="#2196F3"
          style={{marginVertical: 10}}
        />
      )}

      <View style={styles.buttonRow}>
        <Button
          color="#0ea4e8"
          title="Get Info"
          onPress={getRouteInfo}
          disabled={loading}
        />
        <Button
          title="View Map"
          onPress={handleViewMap}
          disabled={loading || !chargingStations.length}
        />
      </View>

      {info && (
        <View style={styles.infoBox}>
          <Text>🛣 Distance: {info.distance}</Text>
          <Text>⏱ Time: {info.time}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: 15, flex: 1},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    paddingVertical: 12,
    marginLeft: 10,
    width: '90%',
    borderRadius: 8,
  },
  suggestion: {
    padding: 8,
    backgroundColor: '#f2f2f2',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  infoBox: {
    backgroundColor: '#e1f5fe',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
});

export default RoutingTest;
