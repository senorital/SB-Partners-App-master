import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import Header from "../header/Header";
import Input from "../input/Input";
import Button from "../button/Button";

import { useNavigation } from "@react-navigation/native";
import { COLORS, icons } from "../constants";
import { addBankDetails } from "../../action/auth/auth";

const BankVerification = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.auth.user);

  const [inputs, setInputs] = useState({
    name: user.instructor.name || "",
    bankName: "",
    IFSCCode: "",
    accountNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
    setErrors((prevState) => ({ ...prevState, [input]: "" }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const validate = async (event) => {
    event.preventDefault();

    try {
      let isValid = true;
      const fields = ["bankName", "name", "IFSCCode","accountNumber"];

      // Check if any field is empty, except for 'name' if it's already populated from the user state
      fields.forEach((field) => {
        if (!inputs[field] && field !== "name") {
          handleError(`Please Enter ${field.replace(/_/g, " ")}`, field);
          isValid = false;
        }
      });

    

      // If any validation fails, return
      if (!isValid) return;

      setLoading1(true);

      // Create JSON object
      const formData = {
        name: inputs.name,
        bankName: inputs.bankName,
        IFSCCode: inputs.IFSCCode,
        accountNumber: inputs.accountNumber,
        isVerify: true, // Adding the isVerify field with a value of true
      };

      console.log("formData:", JSON.stringify(formData)); // Ensure this shows the correct data

      const res = await dispatch(addBankDetails(formData));
      console.log("Response:", res); // Log the response to ensure it's correctly awaited and handled

      if (res.success) {
        // Clear any previous errors
        setErrors({});
        // Show success message using Toast.show
        Toast.show({
          type: "success",
          text1: res.message,
          visibilityTime: 2000,
          autoHide: true,
        });
        navigation.goBack();

      } else {
        // Handle case where submission was not successful
        // Show error message using Toast.show
        Toast.show({
          type: "error",
          text1: res.message || "An error occurred. Please try again.",
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      // Show error message using Toast.show
      const msg = error.response?.data?.message || "An error occurred. Please try again.";
      Toast.show({
        type: "error",
        text1: msg,
        visibilityTime: 2000,
        autoHide: true,
      });
    } finally {
      setLoading1(false);
    }
  };

  useEffect(() => {
    const handleBackPress = () => {
      if (navigation.isFocused()) {
        // Check if the current screen is focused
        navigation.goBack(); // Go back if the current screen is focused
        return true; // Prevent default behavior (exiting the app)
      }
      return false; // If not focused, allow default behavior (exit the app)
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <View style={{ paddingTop: 20 }}>
        <Header title={"Bank Verification Details"} icon={icons.back} />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}>
          <View style={{ flex: 1 }}>
            <View style={{ marginTop: 10 }}>
              <Input
                value={inputs.bankName}
                // editable={false}
                onChangeText={(text) => handleOnchange(text, "bankName")}
                onFocus={() => handleError(null, "bankName")}
                label="Bank Name"
                placeholder="Enter Bank Name"
                error={errors.bankName}
                isRequired={true}
              />
              <Input
                value={inputs.name}
                editable={false}
                onFocus={() => handleError(null, "name")}
                label="Name"
                placeholder="Enter Name"
                error={errors.name}
                isRequired={true}
              />
              <Input
                value={inputs.IFSCCode}
                onChangeText={(text) => handleOnchange(text, "IFSCCode")}
                onFocus={() => handleError(null, "IFSCCode")}
                label="IFSC Code"
                placeholder="Enter IFSC Code"
                error={errors.IFSCCode}
                keyboardType="numeric"
                isRequired={true}
              />
            <Input
                value={inputs.accountNumber}
                onChangeText={(text) => handleOnchange(text, "accountNumber")}
                onFocus={() => handleError(null, "accountNumber")}
                label="Account Number"
                placeholder="Enter Account Number"
                error={errors.accountNumber}
                keyboardType="numeric"
                isRequired={true}
              />
            </View>
          </View>
          <Button
            title={
              loading1 ? (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  style={styles.indicator}
                />
              ) : (
                "Save"
              )
            }
            onPress={validate}
          />
        </ScrollView>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontFamily: "Poppins",
    fontSize: 16,
  },
  label: {
    // marginVertical: 5,
    fontSize: 14,
    fontFamily: "Poppins",
  },
  errorText: {
    marginTop: 7,
    color: "red",
    fontSize: 12,
    fontFamily: "Poppins",
  },
  inputContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    fontFamily: "Poppins",
    height: 45,
    borderColor: "gray",
  },
  languageList: {
    flexDirection: "row", // Display items horizontally
    flexWrap: "wrap", // Wrap items to next row when needed
  },
  languageItem: {
    margin: 5, // Add some margin between items
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  cameraContainer: {
    width: wp(40),
    height: hp(20),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    // marginTop: 10,
    backgroundColor: "#fff",
  },
  cameraImage: {
    width: 30,
    height: 30,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  cameraText: {
    fontSize: hp(2),
    fontFamily: "Poppins",
    textAlign: "center",
  },
  indicator: {
    position: "absolute",
    alignSelf: "center",
  },
  pdfContainer: {
    // flex: 1,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  pdfIcon: {
    width: 40,
    height: 40,
  },
  pdfText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Poppins",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BankVerification;
