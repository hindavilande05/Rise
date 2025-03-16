import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './HomeScreen';
import BookingScreen from './BookingScreen';
import ProfileScreen from './ProfileScreen';
import MapScreen from './MapComponent/MapScreen';

const Tab = createBottomTabNavigator();

const Dashboard = () => {
    return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;

                        switch (route.name) {
                            case 'Home':
                                iconName = 'home-outline';
                                break;
                            case 'Routes':
                                iconName = 'map-outline';
                                break;
                            case 'Booking':
                                iconName = 'calendar-outline';
                                break;
                            case 'Profile':
                                iconName = 'person-outline';
                                break;
                            default:
                                iconName = 'ellipse-outline';
                                break;
                        }

                        return <Icon name={iconName} size={size} color={color} />;
                    },headerShown: false,
                })}>
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Routes" component={MapScreen} />
                <Tab.Screen name="Booking" component={BookingScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
        
    );
};

export default Dashboard;