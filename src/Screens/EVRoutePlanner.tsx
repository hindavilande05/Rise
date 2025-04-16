import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import axios from 'axios';

import  {TOMTOM_API_KEY} from '../../config';

type Location = {
  id: string;
  label: string;
  position: {
    lat: number;
    lon: number;
  };
};

const EVRoutePlanner: React.FC = () => {
  const [startQuery, setStartQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [startSuggestions, setStartSuggestions] = useState<Location[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Location[]>([]);
  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<Location | null>(null);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [routeTime, setRouteTime] = useState<number | null>(null);

  const fetchSuggestions = async (query: string, isStart: boolean) => {
    try {
      const response = await axios.get(
        `https://api.tomtom.com/search/2/search/${query}.json`,
        {
          params: {
            key: TOMTOM_API_KEY,
            limit: 5,
          },
        }
      );
      const results = response.data.results.map((item: any) => ({
        id: item.id,
        label: item.address.freeformAddress,
        position: item.position,
      }));

      if (isStart) {
        setStartSuggestions(results);
      } else {
        setDestinationSuggestions(results);
      }
    } catch (error) {
      console.error('Autocomplete error:', error);
    }
  };

//   const fetchEVRoute = async () => {
//     if (!startLocation || !destinationLocation) return;

//     try {
//       const response = await axios.get(
//         `https://api.tomtom.com/routing/2/calculateLongDistanceEVRoute/${startLocation.position.lat},${startLocation.position.lon}:${destinationLocation.position.lat},${destinationLocation.position.lon}/json`,
//         {
//           params: {
//             key: TOMTOM_API_KEY,
//             vehicleEngineType: 'electric',
//             constantSpeedConsumptionInkWhPerHundredkm: '50,169,100,156,130,153,100,140,70,135,20,128',
//             currentChargeInkWh: 43,
//             maxChargeInkWh: 85,
//             minChargeAtDestinationInkWh: 10,
//             minChargeAtChargingStopsInkWh: 10,
//             chargingModes: 'fastAC,slowAC,fastDC',
//           },
//         }
//       );

//       const route = response.data.routes[0].summary;
//       setRouteDistance(route.lengthInMeters);
//       setRouteTime(route.travelTimeInSeconds);
//     } catch (error) {
//       console.error('EV Routing error:', error);
//     }
//   };

const fetchEVRoute = async () => {
    if (!startLocation || !destinationLocation) {
      console.warn("Start and destination must be selected.");
      return;
    }
  
    try {
      const start = `${startLocation.position.lat},${startLocation.position.lon}`;
      const end = `${destinationLocation.position.lat},${destinationLocation.position.lon}`;
  
      const url = `https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/${start}:${end}/json?` +
        `key=${TOMTOM_API_KEY}` +
        `&vehicleEngineType=electric` +
        `&constantSpeedConsumptionInkWhPerHundredkm=${encodeURIComponent('32,10.87:77,18.01')}` +
        `&currentChargeInkWh=20` +
        `&maxChargeInkWh=40` +
        `&minChargeAtDestinationInkWh=4` +
        `&criticalMinChargeAtDestinationInkWh=2` +
        `&minChargeAtChargingStopsInkWh=4`;
  
      const response = await axios.get(url);
      const route = response.data.routes[0].summary;
      setRouteDistance(route.lengthInMeters);
      setRouteTime(route.travelTimeInSeconds);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('EV Routing error:', error.response?.data || error.message);
      } else {
        console.error('Unknown error:', error);
      }
    }
  };
  
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>EV Route Planner</Text>

      {/* Start Location */}
      <TextInput
        style={styles.input}
        placeholder="Start location"
        value={startQuery}
        onChangeText={(text) => {
          setStartQuery(text);
          fetchSuggestions(text, true);
        }}
      />
      {startSuggestions.length > 0 && (
        <FlatList
          data={startSuggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setStartLocation(item);
                setStartQuery(item.label);
                setStartSuggestions([]);
              }}
            >
              <Text style={styles.suggestion}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Destination Location */}
      <TextInput
        style={styles.input}
        placeholder="Destination location"
        value={destinationQuery}
        onChangeText={(text) => {
          setDestinationQuery(text);
          fetchSuggestions(text, false);
        }}
      />
      {destinationSuggestions.length > 0 && (
        <FlatList
          data={destinationSuggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setDestinationLocation(item);
                setDestinationQuery(item.label);
                setDestinationSuggestions([]);
              }}
            >
              <Text style={styles.suggestion}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={fetchEVRoute}>
        <Text style={styles.buttonText}>Get EV Route</Text>
      </TouchableOpacity>

      {routeDistance && routeTime && (
        <View style={styles.result}>
          <Text style={styles.resultText}>
            Distance: {(routeDistance / 1000).toFixed(2)} km
          </Text>
          <Text style={styles.resultText}>
            Time: {(routeTime / 3600).toFixed(2)} hrs
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default EVRoutePlanner;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  suggestion: {
    padding: 10,
    backgroundColor: '#eee',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  result: {
    marginTop: 20,
    backgroundColor: '#f6f6f6',
    padding: 16,
    borderRadius: 8,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 8,
  },
});
