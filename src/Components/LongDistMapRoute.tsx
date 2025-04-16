import React from 'react';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { View, Dimensions } from 'react-native';

interface MapProps {
  routeCoordinates: { latitude: number; longitude: number }[];
  chargingStations: { latitude: number; longitude: number }[];
}

const LongDistMapRoute: React.FC<MapProps> = ({ routeCoordinates, chargingStations }) => {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ width: '100%', height: Dimensions.get('window').height }}
        initialRegion={{
          latitude: routeCoordinates[0]?.latitude,
          longitude: routeCoordinates[0]?.longitude,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        }}
      >
        <Polyline
          coordinates={routeCoordinates}
          strokeWidth={4}
          strokeColor="blue"
        />
        {chargingStations.map((station, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: station.latitude,
              longitude: station.longitude,
            }}
            title="Charging Station"
            pinColor="green"
          />
        ))}
      </MapView>
    </View>
  );
};

export default LongDistMapRoute;
