import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';

const API_URL = 'http://192.168.119.229:5000/api/ev-route'; 

const LongDistEVRouteScreen = () => {
  const [distance, setDistance] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEVRoute = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backend Data:', data);

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const summary = route.summary;

        setDistance(summary.lengthInMeters / 1000); // km
        setTime(summary.travelTimeInSeconds / 60);  // mins
      } else {
        setError('No routes found');
      }
    } catch (err: any) {
      console.error('Error fetching route:', err.message);
      setError('Failed to fetch route data');
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEVRoute();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚗 EV Long Distance Route</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <View>
          <Text style={styles.result}>📏 Distance: {distance?.toFixed(2)} km</Text>
          <Text style={styles.result}>⏱️ Time: {time?.toFixed(1)} minutes</Text>
        </View>
      )}
    </View>
  );
};

export default LongDistEVRouteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f2f8ff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  result: {
    fontSize: 18,
    marginVertical: 6,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});
