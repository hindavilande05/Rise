export type RootStackParamList = {
    BookingScreen: undefined;
    // BookingConfirm: {
    //   car: string;
    //   date: string;
    //   slotTime: string;
    //   connectionType: string;
    //   battery: string;
    //   price: string;
    //   amount: string;
    // };
    BookingConfirm: undefined;
    BookingReceipt: undefined;
    HomeScreen: undefined;
    ProfileScreen: undefined;
    StationDetails: undefined;
    PlanTrip: undefined;
    PlanTripMapScreen: {
      routeCoordinates: any[];
      chargingStations: any[];
    };
    DirectionsScreen: {
      startLocation: any;
      endLocation: any;
    }
    SearchPlace: undefined;
    Login: undefined;
    Register: undefined;
    Dashboard: undefined;
    LongDistEVRoutes: undefined;
    RoutingTest: undefined;
    MapViewScreen: {
      routeCoords: { latitude: number; longitude: number }[];
      start: { lat: number; lon: number };
      dest: { lat: number; lon: number };
      chargingStations: ChargingStation[];  // Updated to include charging stations
    };
  };
  export type ChargingStation = {
    position: {
      lat: number;
      lon: number;
    };
    poi?: {
      name: string;
      openingHours?: {
        text: string; 
      };
    };
    address?: {
      freeformAddress: string;
    };
    chargingPark?: {
      connectors: {
        connectorType: string;
        ratedPowerKW: number;
        voltageV: number;
        currentA: number;
        currentType: string;
      }[];
    };
  };
  