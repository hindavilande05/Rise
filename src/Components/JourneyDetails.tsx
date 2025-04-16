import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  distance: number;
  travelTimeInSeconds: number;
}

const JourneyDetails: React.FC<Props> = ({ distance, travelTimeInSeconds }) => {
  const minutes = Math.round(travelTimeInSeconds / 60);
  return (
    <View style={{ padding: 16, backgroundColor: '#eee', borderRadius: 8 }}>
      <Text style={{ fontSize: 16 }}>Distance: {distance / 1000} km</Text>
      <Text style={{ fontSize: 16 }}>Estimated Time: {minutes} min</Text>
    </View>
  );
};

export default JourneyDetails;
