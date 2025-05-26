import { useState, useEffect, useRef } from "react";
import { AppRegistry, View, StyleSheet, Text } from "react-native";
import { name as appName } from "./app.json";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "./screens/Onboarding/Onboarding";
import Login from "./screens/auth/Login/Login";
import { CheckToken } from "./utils/api/Api";
import Home from "./Page/Home/Home";
import LoadingSpinner from "./components/common/Loader";
import Service_Details from "./Page/Service_Details/Service_Details";
import Booking from "./screens/Booking/Booking";
import BookingSuccess from "./screens/Booking/BookingSuccess";
import FormCall from "./screens/GetCall/FormCall";
import Profile from "./screens/Profile_Dashboard/Profile";
import OrderPage from "./screens/Profile_Dashboard/OrderPage";
import DService from "./components/Services/DService";
import RegisterUser from "./screens/auth/Register/RegisterUser";
import Careers from "./Page/careers/Careers";
import PasswordChange from "./Page/PasswordChange/PasswordChange";
import * as Sentry from "@sentry/react-native";
import ErrorBoundary from "./ErrorBoundary";
import ChatbotWidget from "./ChatbotWidget";

const Stack = createNativeStackNavigator();
Sentry.init({
  dsn: "https://f29c39fb64cd55aa32ae090d610a945d@o4508873810771970.ingest.us.sentry.io/4508878224752640",
  enableInExpoDevelopment: true, // If using Expo
  debug: __DEV__,
  environment: __DEV__ ? "development" : "production",
  tracesSampleRate: 1.0,
  enableAutoSessionTracking: true,
  enableNative: true,
});

const App = () => {
  const [loading, setLoading] = useState(false);
  const navigationRef = useRef();
  const [initialRouteName, setInitialRouteName] = useState("Onboard");
  const [currentRoute, setCurrentRoute] = useState(null);

  const WhatIsInitial = async () => {
    setLoading(true);
    try {
      const data = await CheckToken();
      if (data?.success) {
        setInitialRouteName("home");
      } else {
        setInitialRouteName("Onboard");
      }
    } catch (error) {
      Sentry.captureException(error);
      setInitialRouteName("Onboard");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    Sentry.captureMessage("Expo Go Test Message");
    Sentry.captureException(new Error("Expo Go Test Error"));
  }, []);

  useEffect(() => {
    WhatIsInitial();
  }, []);

  useEffect(() => {
    if (navigationRef.current) {
      const currentRouteName = navigationRef.current.getCurrentRoute()?.name;
      console.log("currentRouteVia use", currentRouteName);
      setCurrentRoute(currentRouteName);

    } else {
      console.log("navigationRef.current is null");
    }
  }, [navigationRef.current]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <LoadingSpinner />
        <Text style={styles.loaderText}>Loading, please wait...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={() => {
        const currentRouteName = navigationRef.current.getCurrentRoute()?.name;
        console.log("currentRouteName", currentRouteName);
        setCurrentRoute(currentRouteName);
      }}
    >
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen
          name="Onboard"
          options={{ headerShown: false }}
          component={OnboardingScreen}
        />
        <Stack.Screen
          name="login"
          options={{ headerShown: false }}
          component={Login}
        />
        <Stack.Screen
          name="Careers"
          options={{ headerShown: false }}
          component={Careers}
        />
        <Stack.Screen
          name="home"
          options={{ headerShown: false }}
          component={Home}
        />
        <Stack.Screen
          name="service_details"
          options={{ headerShown: false }}
          component={Service_Details}
        />
        <Stack.Screen
          name="Booking"
          options={{ headerShown: false }}
          component={Booking}
        />
        <Stack.Screen
          name="Booking-Successful"
          options={{ headerShown: false }}
          component={BookingSuccess}
        />
        <Stack.Screen
          name="get-a-call"
          options={{ headerShown: false }}
          component={FormCall}
        />
        <Stack.Screen
          name="Profile"
          options={{ headerShown: false }}
          component={Profile}
        />
        <Stack.Screen
          name="order"
          options={{ headerShown: false }}
          component={OrderPage}
        />
        <Stack.Screen
          name="register"
          options={{ headerShown: false }}
          component={RegisterUser}
        />
        <Stack.Screen
          name="resetpassword"
          options={{ headerShown: false }}
          component={PasswordChange}
        />
        <Stack.Screen
          name="Services"
          options={{ headerShown: false }}
          component={DService}
        />
      </Stack.Navigator>
      {currentRoute === "home" && <ChatbotWidget />}
    </NavigationContainer>
  );
};

const RootApp = () => (
  <ErrorBoundary>
    <App />

  </ErrorBoundary>
);

const WrappedApp = Sentry.wrap(RootApp);

AppRegistry.registerComponent(appName, () => WrappedApp);

export default WrappedApp;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: "#0d6efd",
    fontWeight: "500",
  },
});
