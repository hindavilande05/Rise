import 'react-native-gesture-handler'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/Redux/store'; 

import Login from './src/Screens/Authentication/Login';
import Register from './src/Screens/Authentication/Register';
import Dashboard from './src/Screens/Dashboard';
import DirectionsScreen from './src/Screens/DirectionsScreen';
import StationDetails from './src/Screens/StationDetails';
import BookingConfirm from './src/Screens/BookingConfirm';
import ProfileScreen from './src/Screens/ProfileScreen';
import BookingReceipt from './src/Screens/BookingReceipt';
import HomeScreen from './src/Screens/HomeScreen';
import BookingScreen from './src/Screens/BookingScreen';
import RoutingTest from './src/Screens/RoutingTest';
import MapViewScreen from './src/Screens/MapViewScreen';
import MyBookings from './src/Screens/MyBookings';
import BookingDetails from './src/Screens/BookingDetails';
import EVRecommendationScreen from './src/Screens/EVRecommendationScreen';
import EVRecommendationScreen2 from './src/Screens/EVRecommendationScreen2';

function App() {
  const Stack = createNativeStackNavigator();

  return (
    
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="DirectionsScreen" component={DirectionsScreen} />
          <Stack.Screen name="StationDetails" component={StationDetails} />
          <Stack.Screen name="BookingScreen" component={BookingScreen} />
          <Stack.Screen name="BookingConfirm" component={BookingConfirm} />
          <Stack.Screen name="BookingReceipt" component={BookingReceipt} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="RoutingTest" component={RoutingTest} />
          <Stack.Screen name="MapViewScreen" component={MapViewScreen} />
          <Stack.Screen name="MyBookings" component={MyBookings} />
          <Stack.Screen name="BookingDetails" component={BookingDetails} />

          <Stack.Screen name="EVRecommendationScreen" component={EVRecommendationScreen} />
          <Stack.Screen name="EVRecommendationScreen2" component={EVRecommendationScreen2} />
       
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
