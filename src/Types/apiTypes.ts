export interface EVRouteResponse {
    routes: {
      summary: {
        lengthInMeters: number;
        travelTimeInSeconds: number;
      };
      legs: {
        points: { latitude: number; longitude: number }[];
      }[];
      chargingParkings: {
        position: { latitude: number; longitude: number };
      }[];
    }[];
  }
  