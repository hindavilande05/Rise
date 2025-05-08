export type RootStackParamList = {
    BookingScreen: undefined;
  
    BookingConfirm: {
      bookingDetails: BookingDetails;
    }
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
    Dashboard: {
      screen?: 'Home' | 'ChargeSpots' | 'Recommend EV' | 'Profile';
      params?: object;
    };
    LongDistEVRoutes: undefined;
    RoutingTest: undefined;
    MapViewScreen: {
      routeCoords: { latitude: number; longitude: number }[];
      start: { lat: number; lon: number };
      dest: { lat: number; lon: number };
      chargingStations: ChargingStation[];  // Updated to include charging stations
    };

    MyBookings: undefined;
    BookingDetails: { bookingId: string };
    EVRecommendationScreen: undefined;
    EVRecommendationScreen2: {
      selectedBudget: string | null;
      selectedRange: string | null;
      selectedChargeTime: string | null;
      recommendations: EVRecommendation[];
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

  
export type BookingDetails = {
  userId: string;
  vehicleType: string;
  vehicleModel: string;
  connectionType: string;
  date: string;
  time: string;
  amount: number;
  estimatedKwh: string;
};
  

export interface EVRecommendation {
  Model: string;
  Brand: string;
  PriceINR: number;
  Range_Km: number;
  ChargingTime: number;
  Distance: number;
}
