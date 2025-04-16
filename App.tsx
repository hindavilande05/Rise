import Login from './src/Screens/Authentication/Login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Register from './src/Screens/Authentication/Register';
import Dashboard from './src/Screens/Dashboard';
import DirectionsScreen from './src/Screens/DirectionsScreen';
import StationDetails from './src/Screens/StationDetails';
import BookingConfirm from './src/Screens/BookingConfirm';
import ProfileScreen from './src/Screens/ProfileScreen';
import BookingReceipt from './src/Screens/BookingReceipt';
import HomeScreen from './src/Screens/HomeScreen';
import BookingScreen from './src/Screens/BookingScreen';
import PlanTrip from './src/Screens/PlanTrip';
import EVRoutePlanner from './src/Screens/EVRoutePlanner';
import LongDistEVRoutes from './src/Screens/MapComponent/LongDistEVRoutes';
import RoutingTest from './src/Screens/RoutingTest';
import MapViewScreen from './src/Screens/MapViewScreen';
import SearchPlace from './src/Screens/MapComponent/SearchPlace';



function App(){

  const Stack = createNativeStackNavigator();

  return(
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>  
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="DirectionsScreen" component={DirectionsScreen} />
        <Stack.Screen name="StationDetails" component={StationDetails} />
        <Stack.Screen name="BookingScreen" component={BookingScreen} />
        <Stack.Screen name="BookingConfirm" component={BookingConfirm} />
        <Stack.Screen name='BookingReceipt' component={BookingReceipt} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="PlanTrip" component={PlanTrip} />
        <Stack.Screen name="EVRoutePlanner" component={EVRoutePlanner} />
        <Stack.Screen name="LongDistEVRoutes" component={LongDistEVRoutes} />
        <Stack.Screen name="RoutingTest" component={RoutingTest}  />
        <Stack.Screen name="MapViewScreen" component={MapViewScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;