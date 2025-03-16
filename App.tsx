import Login from './Screens/Authentication/Login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Register from './Screens/Authentication/Register';
import Dashboard from './Screens/Dashboard';
import DirectionsScreen from './Screens/DirectionsScreen';
import StationDetails from './Screens/StationDetails';



function App(){

  const Stack = createNativeStackNavigator();

  return(
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="DirectionsScreen" component={DirectionsScreen} />
        <Stack.Screen name="StationDetails" component={StationDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;