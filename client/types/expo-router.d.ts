// This file helps TypeScript understand your routes
import 'expo-router';

declare module 'expo-router' {
  interface StaticRoutes {
    // Add all your routes here
    '/': undefined;
    '/landing': undefined;
    '/camera': undefined;
  }
}
