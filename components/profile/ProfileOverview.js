  import React, { useEffect, useState } from "react";
  import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
    Linking,
    BackHandler,
    ActivityIndicator
  } from "react-native";
  import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
  import LinearGradient from "expo-linear-gradient";
  import { useDispatch } from "react-redux";
  import Toast from "react-native-toast-message";
  import { Avatar } from "react-native-elements";
  import { Ionicons } from "@expo/vector-icons";
  import Header from "../header/Header";
  import { getInstructor } from "../../action/auth/auth";
  import Border from "../border/BorderRadius";
  import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { COLORS, icons } from "../constants";
import { FONTS } from "../constants/theme";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useFocusEffect } from '@react-navigation/native';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

  const ProfileOverview = ({ navigation }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [dob, setDob]  = useState(null);

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await dispatch(getInstructor());
        console.log('Instructor data:', res.data.instructor.dateOfBirth); 
        setDob(res.data.instructor.dateOfBirth);
        setUser(res.data.instructor);
      } catch (error) {
        console.error("Error fetching data:", error);
        const msg = error.response?.data?.message;
        Toast.show({
          type: "error",
          text1: msg || "An error occurred. Please try again.",
          visibilityTime: 2000,
          autoHide: true,
        });
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
   

      fetchData();
    }, [dispatch]);

    console.log('Instructor data dob:', dob); 
    useFocusEffect(
      React.useCallback(() => {
        fetchData();
      }, [])
    );

    useEffect(() => {
      const handleBackPress = () => {
        if (navigation.isFocused()) {
          navigation.goBack();
          return true;
        }
        return false;
      };

      BackHandler.addEventListener("hardwareBackPress", handleBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    }, [navigation]);

    const handlePress = (url) => {
      Linking.openURL(url);
    };

    const imageUrl = user?.imagePath
      ? { uri: user.imagePath }
      : require("../../assets/dAvatar.jpg");

    if (loading) {
      return (
        <View style={{ marginTop: 100, paddingHorizontal: 20 }}>       
        <View style={{ alignItems:'center'}}>
          <ShimmerPlaceholder
            style={{ borderRadius: 10, height: 95, width: wp(83) }}
          />
        </View>
        <View style={{ marginVertical: 20 }}>
          <View
            style={{justifyContent:'center',alignItems:'center' }}
          >
            <ShimmerPlaceholder
              style={{ borderRadius: 10, height: 350, width: wp(83) }}
            />
            <ShimmerPlaceholder
              style={{
                marginVertical:30,
                borderRadius: 10,
                height: 150,
                width: wp(83),
                marginLeft: 10,
              }}
            />
          </View>
         
        </View>
      </View>
      );
    }

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={COLORS.primary} style="light" />
        <View style={{ paddingTop: 20 }}>
          <Header title={"My Profile"} icon={icons.back} />
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1 }}>
          <View style={{}}>
            <View style={styles.profileContainer}>
              <Avatar rounded source={imageUrl} size={75} />
              <View style={styles.profileTextContainer}>
              <View style={styles.row}>

                <Text style={styles.profileName}>
                  {user && <>{user?.name}</>}
                </Text>
                <MaterialIcons name="edit" size={20} color="#fff" style={styles.iconRight} onPress={() => navigation.navigate("EditProfile")} />

                </View>
                <Text style={styles.profileEmail}>
                  {user && <>{user?.email}</>}
                </Text>
              </View>
            </View>      
            <Border color={COLORS.primary}  />
            </View>
            <View style={{ paddingHorizontal: 20,marginVertical:20,marginTop:40 }}>
              <View style={styles.textcontainer}>
                {user?.email && (
                  <View>
                   <View style={styles.row}>
                   <Text style={styles.headingText}>Email Address</Text>
                   </View>
                    <Text style={styles.text}>{user.email}</Text>
                  </View>
                )}
                {user?.phoneNumber && (
                  <View style={{ marginTop: 5 }}>
                    <View style={styles.row}>
                      <Text style={styles.headingText}>Mobile Number</Text>
   
                    </View>
                    <Text style={styles.text}>+91 {user.phoneNumber}</Text>
                  </View>
                )}
         {user?.location && user.location.trim() !== '' && user.location !== 'undefined' && user.location !== 'null' && (
  <View style={{ marginTop: 5 }}>
    <View style={styles.row}>
      <Text style={styles.headingText}>Location</Text>
    </View>
    <Text style={styles.text}>{user.location}</Text>
  </View>
)}
                {user?.dateOfBirth && (
                  <View style={{ marginTop: 5 }}>
                    <View style={styles.row}>
                      <Text style={styles.headingText}>Date Of Birth</Text>
                    </View>
                    <Text style={styles.text}>{dob}</Text>
                  </View>
                )}
                {(user?.linkedIn ||
                  user?.instagram ||
                  user?.twitter_x ||
                  user?.facebook) && (
                  <View style={{ marginTop: 5 }}>
                    <Text style={styles.headingText}>Social Media</Text>
                    <View style={styles.iconContainer}>
                      {user?.linkedIn && (
                        <TouchableOpacity onPress={() => handlePress(user.linkedIn)}>
                          <Ionicons
                            name="logo-linkedin"
                            size={24}
                            color="#0e76a8"
                            style={styles.icon}
                          />
                        </TouchableOpacity>
                      )}
                      {user?.instagram && (
                        <TouchableOpacity onPress={() => handlePress(user.instagram)}>
                          <Ionicons
                            name="logo-instagram"
                            size={24}
                            color="#bc2a8d"
                            style={styles.icon}
                          />
                        </TouchableOpacity>
                      )}
                      {user?.twitter_x && (
                        <TouchableOpacity onPress={() => handlePress(user.twitter_x)}>
                          <Ionicons
                            name="logo-twitter"
                            size={24}
                            color="#1da1f2"
                            style={styles.icon}
                          />
                        </TouchableOpacity>
                      )}
                      {user?.facebook && (
                        <TouchableOpacity onPress={() => handlePress(user.facebook)}>
                          <Ionicons
                            name="logo-facebook"
                            size={24}
                            color="#3b5998"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}

                </View>
                {user?.bio && (
                  <View style={[styles.textcontainer,{marginTop:15}]}>
                  <View style={styles.row}>
                    <Text style={styles.headingText}>About me</Text>
                    </View>    
                    <Text style={[styles.text, { textAlign: "justify" }]}>
                      {user.bio}
                    </Text>
                  </View>
                )}
                {Array.isArray(user?.languages) && user?.languages?.length > 0 && (
                <View style={[styles.textcontainer,{marginTop:15}]}>
                    <Text style={styles.headingText}>Languages</Text>
                    <Text style={styles.text}>
                      {user.languages.join(", ")}
                    </Text>
                  </View>
                )}
              </View>
            </View>
        </ScrollView>
      </View>
    );
  };

  const styles = StyleSheet.create({
    textcontainer:{
      padding: 12,
      backgroundColor:'#FFF',
      borderRadius:12
    },
    container: {
      flex: 1,
      backgroundColor:COLORS.background
      },
    profileContainer: {
      marginHorizontal: 20,
      padding: 12,
      borderRadius: 12,
      backgroundColor: COLORS.primary,
      flexDirection: 'row',
    },
    profileTextContainer: {
      flex: 1, // Ensure the container takes up available space
       marginLeft: 20, 
      marginTop:10
       },
    profileName: {
     ...FONTS.h3,
      color: '#fff',
    },
    profileEmail: {
     ...FONTS.h5,
     flex:1,
     marginTop:-10,
      color: COLORS.white,
    },
    headingText: {
      fontFamily: "Poppins_Medium",
      fontSize: 14,
      marginTop:5,
      justifyContent:'center'
    },
    text: {
      fontFamily: "Poppins",
      fontSize: 12,
      marginVertical:10
    },
    iconContainer: {
      marginTop: 5,
      flexDirection: "row",
      alignItems: "center",
    },
    icon: {
      marginRight: 30,
    },
    iconRight: {
      marginRight: 10,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    row: {
      justifyContent: "space-between",
      flexDirection: "row",
      flex: 1, // Ensure text takes available space pushing the icon
    },

    // profileTextContainer: {
    //   marginLeft: 20,
    // },
    // iconLeft: {
    //   marginRight: 10,
    // },
  });
  

  export default ProfileOverview;
