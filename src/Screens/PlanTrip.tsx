import React, {useState} from 'react';
import {View, Button, Alert} from 'react-native';
import LocationInput from '../Components/LocationInput';
import JourneyDetails from '../Components/JourneyDetails';
import {getAutocompleteSuggestions, getEVRoute} from '../Services/Tomtom';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types';

const PlanTrip = ({navigation}: any) => {
  const navigator = useNavigation<NavigationProp<RootStackParamList>>();

  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [startCoords, setStartCoords] = useState<any>(null);
  const [destCoords, setDestCoords] = useState<any>(null);
  const [startSuggestions, setStartSuggestions] = useState<any[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<any[]>([]);

  const [routeDetails, setRouteDetails] = useState<any>(null);
  const [chargingStations, setChargingStations] = useState<any[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);

  const handleSelectLocation = (item: any, type: 'start' | 'destination') => {
    const position = {
      lat: item.position.lat,
      lon: item.position.lon,
    };

    if (type === 'start') {
      setStart(item.address.freeformAddress);
      setStartCoords(position);
      setStartSuggestions([]);
    } else {
      setDestination(item.address.freeformAddress);
      setDestCoords(position);
      setDestSuggestions([]);
    }
  };

  const fetchSuggestions = async (
    text: string,
    type: 'start' | 'destination',
  ) => {
    if (text.length < 3) return;
    const results = await getAutocompleteSuggestions(text);
    console.log(`${type} suggestions:`, results);

    if (type === 'start') {
      setStartSuggestions(results);
    } else {
      setDestSuggestions(results);
    }
  };

  const handleSubmit = async () => {
    if (!startCoords || !destCoords) {
      Alert.alert('Please select both start and destination locations.');
      return;
    }
    if (startCoords && destCoords) {
      const data = await getEVRoute(startCoords, destCoords);
      console.log('EV Route Response:', JSON.stringify(data, null, 2));
      setRouteDetails(data);
      setChargingStations(data?.chargingStations || []);
      setRouteCoordinates(data?.route || []);
    }
  };

  return (
    <View style={{padding: 16}}>
      <LocationInput
        label="Start Location"
        value={start}
        onChangeText={text => {
          setStart(text);
          fetchSuggestions(text, 'start');
        }}
        suggestions={startSuggestions}
        onSelect={item => handleSelectLocation(item, 'start')}
      />

      <LocationInput
        label="Destination"
        value={destination}
        onChangeText={text => {
          setDestination(text);
          fetchSuggestions(text, 'destination');
        }}
        suggestions={destSuggestions}
        onSelect={item => handleSelectLocation(item, 'destination')}
      />

      <Button title="Get Route" onPress={handleSubmit} />
      {routeDetails && (
        <>
          <JourneyDetails
            distance={routeDetails.summary.lengthInMeters}
            travelTimeInSeconds={routeDetails.summary.travelTimeInSeconds}
          />
          <Button
            title="Open in Map"
            onPress={() =>
              navigation.navigate('PlanTripMapScreen', {
                routeCoordinates,
                chargingStations,
              })
            }
          />
        </>
      )}
    </View>
  );
};

export default PlanTrip;
