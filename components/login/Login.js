import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  BackHandler,

} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import PhoneInput from "react-native-phone-number-input";
import { useDispatch } from "react-redux";
import Input from "../input/Input";
import { login, loginEmail } from "../../action/auth/auth";
import * as Location from 'expo-location';
import { setLocationAddress, clearLocationAddress } from "../../action/locationActions/locationActions";
import DenyLocation from "./DenyLocation";
import { COLORS } from "../constants";
import Button from "../button/Button";
import { useFocusEffect } from "@react-navigation/native";

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [location, setLocation] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [region, setRegion] = useState("");
  const [inputs, setInputs] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [showEmail, setShowEmail] = useState(false);

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const getLocation = async () => {
    setLoading(true);
    setErrorMsg(null);
    dispatch(clearLocationAddress());

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log("Permission status:", status);
      if (status !== 'granted') {
        setErrorMsg("Permission to access location was denied.");
        setLoading(false);
        navigation.navigate('DenyLocation');
        return;
      }
  
  
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      console.log("Location services enabled:", isLocationEnabled);

      if (!isLocationEnabled) {
        setErrorMsg("Permission to access location was denied or location services are disabled");
        setLoading(false);
        navigation.navigate('DenyLocation');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      console.log("Location:", location);
      setLocation(location);

      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log("Geocode:", geocode);
      dispatch(setLocationAddress(geocode[0]));

      setRegion(geocode[0].isoCountryCode);
    } catch (error) {
      console.log("Error:", error.message);

      if (error.message === "Location request failed due to unsatisfied device settings") {
        setErrorMsg("Location request failed due to unsatisfied device settings");
        navigation.navigate(DenyLocation);
      } else {
        setErrorMsg("Error fetching location");
        // navigation.navigate(DenyLocation);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (region === "US") {
      setShowEmail(true);
    } else if (region === "IN") {
      setShowEmail(false);
    }
  }, [region]);

  const handleSubmit = async () => {
    let isValid = true;

    if (!mobileNumber) {
      setMobileNumberError("Please enter your mobile number");
      isValid = false;
    } else if (mobileNumber.length !== 10) {
      setMobileNumberError("Mobile number should have 10 digits");
      isValid = false;
    } else {
      setMobileNumberError("");
    }

    if (isValid && !loading) {
      setLoading(true);
      const formData = { phoneNumber: mobileNumber };

      try {
        const res = await dispatch(login(formData));
        console.log("res", res);
        if (res && res.success) {
          navigation.navigate("Otp", { mobileNumber: mobileNumber, region: region });
        } else if (res && res.success === false && res.message === "NOTPRESENT!") {
          navigation.navigate("Register", { phoneNumber: mobileNumber, region: region });
        } else if (res && res.error && res.error.data && res.error.data.message) {
          handleError(res.error.data.message, "mobileNumber");
        } else {
          console.error(res);
          handleError("Unknown error occurred", "mobileNumber");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const message = error.response.message || "NOTPRESENT!";
          navigation.navigate("Register", { phoneNumber: mobileNumber, region: region });
          handleError(message, "mobileNumber");
        } else {
          console.error("Error occurred while submitting mobile number:", error);
          handleError("Error occurred while submitting mobile number", "mobileNumber");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEmailSubmit = async () => {
    let isValid = true;

    if (!inputs.email) {
      handleError("Please input email", "email");
      isValid = false;
    } else {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(inputs.email)) {
        handleError("Please enter a valid email", "email");
        isValid = false;
      }
    }

    if (isValid && !loading) {
      setLoading(true);
      const formData = { email: inputs.email };

      try {
        const res = await dispatch(loginEmail(formData));
        if (res && res.success) {
          navigation.navigate("Otp", { email: inputs.email, region: region });
        } else if (res && res.success === false && res.message === "NOTPRESENT!") {
          navigation.navigate("Register", { email: inputs.email, region: region });
          handleError(res.message, "email");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const message = error.response.message || "NOTPRESENT!";
          navigation.navigate("Register", { email: inputs.email, region: region });
          handleError(message, "email");
        } else {
          console.error("Error occurred while submitting email:", error);
          handleError("Error occurred while submitting email", "email");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" style="dark"/>
      <ScrollView contentContainerStyle={{ flexGrow: 1, marginHorizontal: 20, paddingTop: 50 }}>
        <View style={{ flex: 1 }}>
          <View>
            <Text style={{ fontSize: hp(4), fontFamily: "Poppins_Medium" }}>
              Welcome back.
            </Text>
            <Text style={{ fontSize: hp(2.2), fontFamily: "Poppins", color: "gray" }}>
              Log in to your account
            </Text>
          </View>
          <View>
            {region === "IN" && (
              <>
                <Text style={styles.label}>Mobile Number</Text>
                <PhoneInput
                  defaultCode="IN"
                  layout="first"
                  containerStyle={styles.phoneInputContainer}
                  textContainerStyle={styles.phoneTextContainer}
                  keyboardType="number-pad"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                />
                {mobileNumberError ? (
                  <Text style={{ color: "red" }}>{mobileNumberError}</Text>
                ) : null}
              </>
            )}
            {region === "US" && (
              <>
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  onChangeText={(text) => handleOnchange(text, "email")}
                  onFocus={() => handleError(null, "email")}
                  error={errors.email}
                  containerStyle={styles.inputContainer}
                />
              </>
            )}
            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 5 }}>
              <Text style={{ fontFamily: "Poppins", fontWeight: "400", fontSize: 12 }}>
                You will receive an SMS verification that may apply on the next step.
              </Text>
            </View>
          </View>
        </View>
        <View style={{marginBottom:12}}>
          {region === "IN" && (
           
            <Button
            title={
              loading ? (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  style={styles.indicator}
                />
              ) : (
                "Continue"
              )
            }
            onPress={handleSubmit}
            disabled={loading}
          />
          )}
          {region === "US" && (
             <Button
             title={
               loading ? (
                 <ActivityIndicator
                   size="small"
                   color="#ffffff"
                   style={styles.indicator}
                 />
               ) : (
                 "Continue"
               )
             }
             onPress={handleEmailSubmit}
             disabled={loading}
           />
         
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    width: wp(85),
  },
  phoneInputContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    width: wp(85),
  },
  phoneTextContainer: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 0,
    height: 45,
  },
  label: {
    marginBottom: 10,
    fontFamily: "Poppins",
    fontSize: 14,
    color: COLORS.black,
  },
 
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "Poppins_Medium",
  },
});

export default Login;
