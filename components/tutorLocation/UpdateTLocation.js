import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  BackHandler
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker, Circle } from "react-native-maps";
import Toast from "react-native-toast-message";

import { GOOGLE_MAPS_APIKEY } from "../../apiKey/index";
import Header from "../header/Header";
import { Formik } from "formik";

import Button from "../button/Button";
import { addTutorLocation, updateHTServiceArea } from "../../action/homeTutor/homeTutor";

import { useDispatch } from "react-redux";
import { COLORS } from "../constants";


  

const distances = [
    { id: 1, label: "1 km", value: 1000 },
    { id: 2, label: "3 km", value: 3000 },
    { id: 3, label: "5 km", value: 5000 },
    { id: 4, label: "10 km", value: 10000 },
  ];
  
  const UpdateTLocation = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { id, longitude, latitude, locationName, radius1 } = route.params || {};
    const defaultLocation = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  
    const [location, setLocation] = useState(defaultLocation);
    const [radius, setRadius] = useState(radius1);
    const [name, setName] = useState(locationName || "");
    useEffect(() => {
      if (longitude && latitude) {
        setLocation({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    }, [longitude, latitude]);
  
    const handleSelectDistance = (value) => {
      setRadius(value);
    };

    useEffect(() => {
        if (locationName) {

          setName(locationName);
          console.log("LocationNAme :" + name)

        }
      }, [locationName]);
  
    const handleLocationSelect = (data, details) => {
      const { lat, lng } = details.geometry.location;
      setLocation({
        latitude: parseFloat(lat.toFixed(7)),
        longitude: parseFloat(lng.toFixed(7)),
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      setName(details.formatted_address);
    };
  
    const renderStepTwo = ({
      handleChange,
      handleBlur,
      handleSubmit,
      values,
      errors,
      touched,
      isSubmitting,
    }) => (
      <View style={styles.stepContainer}>
        <View style={styles.autocompleteContainer}>
          <Text style={styles.label}>Service area</Text>
          
          <GooglePlacesAutocomplete
            placeholder="Search by location"
            onPress={handleLocationSelect}
            query={{
              key: GOOGLE_MAPS_APIKEY,
              language: "en",
            }}
            fetchDetails={true}
            textInputProps={{
              style: {
                borderColor: "#000",
                borderWidth: 1,
                height: 40,
                borderRadius: 5,
                paddingHorizontal: 10,
                width: "100%",
              },
              value: name, // Controlled component value
              onChangeText: (text) => setName(text), // Update state on text change
            }}
            styles={{
              container: { flex: 0 },
              listView: { zIndex: 1000 },
            }}
          />
        </View>
     {location && (
          <View>
            <MapView style={styles.map} region={location}>
              <Marker coordinate={location} />
              <Circle
                center={location}
                radius={radius}
                fillColor="rgba(135,206,250,0.5)"
                strokeColor="rgba(135,206,250,1)"
              />
            </MapView>
          </View>
        )}
  
        <FlatList
          data={distances}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.distanceButton,
                item.value === radius
                  ? styles.selectedDistanceButton
                  : styles.unselectedDistanceButton,
              ]}
              onPress={() => handleSelectDistance(item.value)}
            >
              <Text
                style={[
                  styles.distanceButtonText,
                  item.value === radius
                    ? styles.selectedDistanceButtonText
                    : styles.unselectedDistanceButtonText,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.distanceList}
        />
        <Button
          title={
            isSubmitting ? (
              <ActivityIndicator
                size="small"
                color="#ffffff"
                style={styles.indicator}
              />
            ) : (
              "Submit"
            )
          }
          onPress={handleSubmit}
        />
      </View>
    );
  
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.container}
      >
        <StatusBar backgroundColor={COLORS.primary} style="light" />
        <View style={{ paddingTop: 15 }}>
          <Header title={"Update Service Area Location"} icon={require("../../assets/back.png")} />
        </View>
  
        <Formik
          initialValues={{}}
          onSubmit={(values, { setSubmitting }) => {
            if (!name) {
              Toast.show({
                type: "error",
                text1: "Service area is required",
                visibilityTime: 2000,
                autoHide: true,
              });
              setSubmitting(false);
              return;
            }
  
            if (!radius) {
              Toast.show({
                type: "error",
                text1: "Distance is required",
                visibilityTime: 2000,
                autoHide: true,
              });
              setSubmitting(false);
              return;
            }
  
            const locationData = {
              id: id,
              latitude: String(location.latitude),
              longitude: String(location.longitude),
              locationName: name,
              radius: String(radius),
              unit: "km",
            };

            console.log("LocationData locationName: " + locationData.locationName)
            console.log("LocationData radius: " + locationData.radius)
            console.log("LocationData latitude: " + locationData.latitude)
            console.log("LocationData longitude: " + locationData.longitude)

            dispatch(updateHTServiceArea(locationData,id))
              .then((res) => {
                console.log(res)
                Toast.show({
                  type: "success",
                  text1: res.message,
                  visibilityTime: 2000,
                  autoHide: true,
                });
  
                setSubmitting(false);
                // navigation.goBack();
              })
              .catch((error) => {
                Toast.show({
                  type: "error",
                  text1: "An error occurred. Please try again.",
                  visibilityTime: 2000,
                  autoHide: true,
                });
                setSubmitting(false);
              });
          }}
        >
          {(formikProps) => renderStepTwo(formikProps)}
        </Formik>
      </KeyboardAvoidingView>
    );
  };


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  stepContainer: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins",
    fontWeight: "600",
  },

  autocompleteContainer: {
    zIndex: 1,
    width: "100%",
    marginVertical: 10,
  },
  map: {
    width: "100%",
    height: 300,
    marginVertical: 20,
  },
  distanceButton: {
    padding: 10,
    height: 40,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  selectedDistanceButton: {
    backgroundColor: "rgba(102, 42, 178, 1)",
    borderColor: "rgba(102, 42, 178, 1)",
  },
  unselectedDistanceButton: {
    backgroundColor: "#fff",
    borderColor: "lightgray",
  },
  distanceButtonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Poppins",
  },
  selectedDistanceButtonText: {
    color: "#fff",
  },
  unselectedDistanceButtonText: {
    color: "#000",
  },
  distanceList: {
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  indicator: {
    position: "absolute",
    alignSelf: "center",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UpdateTLocation;
