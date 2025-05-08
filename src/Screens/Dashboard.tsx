import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './HomeScreen';
import BookingScreen from './BookingScreen';
import ProfileScreen from './ProfileScreen';
import SearchPlace from './MapComponent/SearchPlace';
import EVRecommendationScreen from './EVRecommendationScreen';
import { useRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const Dashboard = () => {
  const route = useRoute<{ key: string; name: string; params: { screen?: string } }>();
  const initialTab = route.params?.screen || 'Home'; // fallback

  return (
    <Tab.Navigator
      initialRouteName={initialTab}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'ChargeSpots':
              iconName = 'battery-charging-outline';
              break;
            case 'Recommend EV':
              iconName = 'car';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
              break;
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="ChargeSpots" component={SearchPlace} />
      <Tab.Screen name="Recommend EV" component={EVRecommendationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default Dashboard;
