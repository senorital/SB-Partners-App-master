// {showName && (
//     <Input
//       onChangeText={(text) => handleOnchange(text, "name")}
//       onFocus={() => handleError(null, "name")}
//       label="Name"
//       placeholder="Name"
//       error={errors.name}
//     />
//   )}
  
//   {showEmail && (
//     <View style={{ marginTop: 0 }}>
//       <Input
//         onChangeText={(text) => handleOnchange(text, "email")}
//         onFocus={() => handleError(null, "email")}
//         label="Email"
//         placeholder="Email"
//         error={errors.email}
//       />
//     </View>
//   )}

import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import PhoneInput from "react-native-phone-number-input"; // Ensure this library is installed
import { useDispatch } from "react-redux";
import Button from "../button/Button";
import Input from "../input/Input";
import { register, registerEmail } from "../../action/auth/auth";

const Register = ({ navigation,route}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [location, setLocation] = useState(null);
  const { phoneNumber , email , region} = route.params;
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [address, setAddress] = useState(null);
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [showEmail, setShowEmail] = useState(false);
  

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const handleSubmit = async () => {
    let isValid = true;
  
    if (region === "IN") {
      // if (!mobileNumber) {
      //   setMobileNumberError("Please enter your mobile number");
      //   isValid = false;
      // } else if (mobileNumber.length !== 10) {
      //   setMobileNumberError("Mobile number should have 10 digits");
      //   isValid = false;
      // } else {
      //   setMobileNumberError("");
      // }
    }
  
    if (!inputs.name.trim()) {
      handleError("Please enter your name", "name");
      isValid = false;
    } else {
      handleError(null, "name");
    }
  
    if (!inputs.email.trim()) {
      handleError("Please enter your email", "email");
      isValid = false;
    } else {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(inputs.email)) {
        handleError("Please enter a valid email", "email");
        isValid = false;
      } else {
        handleError(null, "email");
      }
    }
  
    if (isValid && !loading) {
      setLoading(true);
      const formData = {
        name: inputs.name.trim(),
        email: inputs.email.trim(),
        phoneNumber: phoneNumber, // Assuming phoneNumber is already validated
      };

  
      try {
        const res = await dispatch(register(formData));
        if (res && res.success) {
          navigation.navigate("Otp", { mobileNumber: phoneNumber, region : region });
        }  else {
          setErrors((prevState) => ({
            ...prevState,
            mobileNumber: res.error || "Unknown error occurred",
          }));
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const message = error.response.message;
          handleError(message);
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
    console.log("Submit Register");
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
  
    // if (!inputs.email.trim()) {
    //   handleError("Please input email", "email");
    //   isValid = false;
    // } else {
    //   const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    //   if (!emailPattern.test(inputs.email)) {
    //     handleError("Please enter a valid email", "email");
    //     isValid = false;
    //   } else {
    //     handleError(null, "email");
    //   }
    // }
  
    if (isValid && !loading) {
      setLoading(true);
      const formData = {
        email: email,
        name : inputs.name.trim(),
        phoneNumber : mobileNumber.trim()
      };
  
      try {
        const res = await dispatch(registerEmail(formData));
        if (res && res.success) {
          navigation.navigate("Otp", { email: email ,region : region});
        } else if (res && res.success === false && res.message === "NOTPRESENT!") {
          navigation.navigate("Register", { email: email });
          handleError(res.message, "email");
        }
      } catch (error) {
        console.error("Error occurred while registering user:", error);
        setErrors((prevState) => ({
          ...prevState,
          email: "Error occurred while registering user",
        }));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          marginHorizontal: 20,
          paddingTop: 50,
        }}
      >
        <View style={{ flex: 1 }}>
          <View>
            <Text
              style={{
                fontSize: hp(4),
                fontFamily: "Poppins_Medium",
              }}
            >
              Welcome
            </Text>
            <Text
              style={{
                fontSize: hp(2.2),
                fontFamily: "Poppins",
                color: "gray",
                fontWeight: "400",
              }}
            >
              Register your account
            </Text>
          </View>
          <View style={{ marginVertical: 20 }}>
              {region === "IN" && (
                <>
                  <Input
                onChangeText={(text) => handleOnchange(text, "name")}
                onFocus={() => handleError(null, "name")}
                label="Name"
                placeholder="Name"
                error={errors.name}
                  />
                  <Input
                    onChangeText={(text) => handleOnchange(text, "email")}
                    onFocus={() => handleError(null, "email")}
                    label="Email"
                    placeholder="Email"
                    error={errors.email}
                  />
                
                  
                </>
                
              )}
            {region === "US" && (
              <>
                 <Input
              onChangeText={(text) => handleOnchange(text, "name")}
              onFocus={() => handleError(null, "name")}
              label="Name"
              placeholder="Name"
              error={errors.name}
                />
                  <Text style={styles.label}>Mobile Number</Text>
                <PhoneInput
                  defaultCode="US"
                  layout="first"
                  containerStyle={styles.inputContainer}
                  textContainerStyle={{
                    paddingVertical: 0,
                    backgroundColor: "#fff",
                    color: "gray",
                  }}
                  keyboardType="number-pad"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                />
                {mobileNumberError ? (
                  <Text style={{ color: "red" }}>{mobileNumberError}</Text>
                ) : null}
              </>
              
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                // marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins",
                  fontWeight: "400",
                  fontSize: 12,
                }}
              >
                You will receive an SMS verification that may apply on the next
                step.
              </Text>
            </View>
          </View>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Button
            title={
              loading ? (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  style={styles.indicator}
                />
              ) : "Register"
            }
            onPress={region === 'IN' ? handleSubmit : handleEmailSubmit }
            disabled={loading}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: hp(2),
    fontFamily: "Poppins",
  },
  codeTextStyle: {
    color: "gray",
    fontSize: hp(2),
  },
  inputContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#aaa",
    fontFamily: "Poppins",
    height: 48,
    alignItems: "center",
    paddingHorizontal: 10,
    width: wp(88),
  },
  indicator: {
    position: "absolute",
    alignSelf: "center",
  },
});

export default Register;