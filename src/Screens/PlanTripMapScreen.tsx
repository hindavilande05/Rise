import React from 'react';
import { View } from 'react-native';
import MapViewRoute from '../Components/LongDistMapRoute';

const MapScreen = ({ route }: any) => {
  const { routeCoordinates, chargingStations } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <MapViewRoute
        routeCoordinates={routeCoordinates}
        chargingStations={chargingStations}
      />
    </View>
  );
};

export default MapScreen;
