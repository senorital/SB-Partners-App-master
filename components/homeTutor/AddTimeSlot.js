import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  TextInput,
  BackHandler
} from "react-native";
import Toast from "react-native-toast-message";
import { Calendar } from "react-native-calendars";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../header/Header";
import Button from "../button/Button";
import { addTimeSlot } from "../../action/homeTutor/homeTutor";
import { useDispatch } from "react-redux";
import { COLORS, icons } from "../constants";

const durationOptions = [
  { key: "15", value: "15" },
  { key: "20", value: "20" },
  { key: "25", value: "25" },
  { key: "30", value: "30" },
  { key: "35", value: "35" },
  { key: "40", value: "40" },
  { key: "45", value: "45" },
  { key: "50", value: "50" },
  { key: "55", value: "55" },
  { key: "60", value: "60" },
  { key: "65", value: "65" },
  { key: "70", value: "70" },
  { key: "75", value: "75" },
  { key: "80", value: "80" },
];

const serviceTypeItems=[
  {key:'Private',value:'Private'},
  {key:'Group',value:'Group'}
]

const AddTimeSlot = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const today1 = new Date();

  const todayDateString = today1.toISOString().split("T")[0];

  const { id } = route.params;
  const [selectedDate, setSelectedDate] = useState(todayDateString);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [duration, setDuration] = useState("");
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serviceType,setServiceType]=useState('');
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);

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

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: "rgba(102, 42, 178, 1)",
      customTextStyle: {
        color: "orange",
      },
    },
  };

  const today = new Date();
  const nextSixDays = new Date();
  nextSixDays.setDate(today.getDate() + 2);

  const minDate = today.toISOString().split("T")[0];
  const maxDate = nextSixDays.toISOString().split("T")[0];

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleStartTimeChange = (event, selectedDate) => {
    const currentTime = selectedDate || startTime;
    setShowStartTimePicker(false);
    setStartTime(currentTime);
  };

  const handleEndTimeChange = (event, selectedDate) => {
    const currentTime = selectedDate || endTime;
    setShowEndTimePicker(false);
    setEndTime(currentTime);
  };

  const createTimeSlots = () => {
    if (!startTime || !endTime || !duration) {
      Toast.show({
        type: "error",
        text1: "Please select start time, end time, and duration.",
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }

    let start = new Date(startTime);
    const end = new Date(endTime);
    const slots = [];
    const durationInMinutes = parseInt(duration, 10);

    while (start < end) {
      const endSlot = new Date(start.getTime() + durationInMinutes * 60000);
      if (endSlot <= end) {
        slots.push({ start: new Date(start), end: endSlot });
      }
      start = endSlot;
    }

    setTimeSlots(slots);
  };

  const handleServiceTypeChange = (value) => {
    setServiceType(value);
    if (value === "Private") {
      setNumberOfPeople("1");
    } else {
      setNumberOfPeople("");
    }
  };

  const handleSubmit = async () => {
    try {
      createTimeSlots();
      if (selectedSlots.length === 0) {
        Toast.show({
          type: "error",
          text1: "Please select at least one time slot.",
          visibilityTime: 2000,
          autoHide: true,
        });
        return;
      }
      setLoading(true);

      // Format selected time slots data
      // const formattedTimeSlots = selectedSlots.map((index) => {
      //   const slot = timeSlots[index];
      //   console.log("slot", slot);
      //   const startTime = formatTime(slot.start);
      //   const endTime = formatTime(slot.end);
      //   return `${startTime}-${endTime}`;
      // });

      const formattedTimeSlots = selectedSlots.map((index) => {
        const slot = timeSlots[index];
        const startTime = formatTime(slot.start);
        const endTime = formatTime(slot.end);
        return {
          serviceType,
          noOfPeople: serviceType === "Private" ? 1 : numberOfPeople,
          time: `${startTime}-${endTime}`
        };
      });

      const body = {
        date: selectedDate,
        slotes: formattedTimeSlots,
        id,
      };

      // console.log(body)

      const res = await dispatch(addTimeSlot(body));
      console.log(res);

      if (res.success) {
        Toast.show({
          type: "success",
          text1: res.message,
          visibilityTime: 2000,
          autoHide: true,
        });
        navigation.goBack();
      }
    } catch (error) {
      // If an error occurs during the process, show an error message
      Toast.show({
        type: "error",
        text1: error.message || "Something went wrong.",
        visibilityTime: 2000,
        autoHide: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return "";
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  const theme = {
    calendarBackground: COLORS.white,
    textSectionTitleColor: COLORS.primary,
    selectedDayTextColor: "white",
    dayTextColor: "black",
    textDisabledColor: "gray",
    dotColor: "orange",
    arrowColor: "black",
    monthTextColor: "black",
    textDayFontWeight: "300",
    textMonthFontWeight: "bold",
    textDayHeaderFontWeight: "300",
    todayTextColor: "black",
    textDayFontSize: 16,
  };

  const handleSlotSelect = (index) => {
    setSelectedSlots((prevSelectedSlots) => {
      if (prevSelectedSlots.includes(index)) {
        return prevSelectedSlots.filter((slot) => slot !== index);
      } else {
        return [...prevSelectedSlots, index];
      }
    });
  };

 // Helper function to get the start of the current week (Monday)
 const getWeekStartDate = () => {
  const date = new Date();
  const day = date.getDay();
  const diff = (day >= 1 ? day - 1 : 6) * 24 * 60 * 60 * 1000;
  return new Date(date.getTime() - diff).toISOString().split("T")[0];
};

// Helper function to get dates of the current week (Monday to Sunday)
const getWeekDates = () => {
  const startOfWeek = new Date(getWeekStartDate());
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return {
      date: date.toISOString().split("T")[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    };
  });
};

const weekDates = getWeekDates();

const handleTabPress = (date) => {
  setSelectedDates((prevSelectedDates) => {
    if (prevSelectedDates.includes(date)) {
      // Remove date if it's already selected
      return prevSelectedDates.filter((d) => d !== date);
    } else {
      // Add date if it's not selected
      return [...prevSelectedDates, date];
    }
  });
};

  console.log(selectedSlots);
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <StatusBar backgroundColor={COLORS.primary} style="light" />
          <View style={{ paddingTop: 20 }}>
        <Header
          title={"Add Time Slot"}
          icon={icons.back}
        />
      </View>

      <ScrollView>
        <View style={{ width: "100%" }}>
          <Calendar
            theme={theme}
            markedDates={markedDates}
            onDayPress={handleDayPress}
            minDate={minDate}
            maxDate={maxDate}
          />
        </View>

     {/* <View style={styles.tabContainer}>
          {weekDates.map((day) => (
            <TouchableOpacity
              key={day.date}
              style={[
                styles.tab,
                selectedDates.includes(day.date) && styles.selectedTab
              ]}
              onPress={() => handleTabPress(day.date)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedDates.includes(day.date) && styles.selectedTabText
                ]}
              >
                {day.day}
              </Text>
            </TouchableOpacity>
          ))}
        </View> */}

        <View style={{ paddingHorizontal: 15 }}>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontFamily: "Poppins", fontSize: 14 }}>
              Service Type
            </Text>
            <SelectList
              setSelected={handleServiceTypeChange}
              data={serviceTypeItems}
              save="value"
              placeholder="Select Service Type"
              boxStyles={styles.dropdown}
              fontFamily="Poppins"
            />
          </View>

          {serviceType === "Group" && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontFamily: "Poppins", fontSize: 14 }}>
                Number of People
              </Text>
              <TextInput
                   style={styles.timePickerButton}
                value={numberOfPeople}
                onChangeText={setNumberOfPeople}
                placeholder="Enter number of people"
                keyboardType="numeric"
              />
            </View>
          )}
         
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontFamily: "Poppins", fontSize: 14 }}>
              Start Time
            </Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Text style={styles.timePickerText}>
                {startTime ? formatTime(startTime) : "Select Start Time"}
              </Text>
            </TouchableOpacity>
            {showStartTimePicker && (
              <DateTimePicker
                value={startTime || new Date()}
                mode="time"
                display="default"
                onChange={handleStartTimeChange}
              />
            )}
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontFamily: "Poppins", fontSize: 14 }}>
              End Time
            </Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Text style={styles.timePickerText}>
                {endTime ? formatTime(endTime) : "Select End Time"}
              </Text>
            </TouchableOpacity>
            {showEndTimePicker && (
              <DateTimePicker
                value={endTime || new Date()}
                mode="time"
                display="default"
                onChange={handleEndTimeChange}
              />
            )}
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontFamily: "Poppins", fontSize: 14 }}>
              Duration (minutes)
            </Text>
            <SelectList
              setSelected={setDuration}
              data={durationOptions}
              save="value"
              placeholder="Select Duration (minutes)"
              boxStyles={styles.dropdown}
              fontFamily="Poppins"
            />
          </View>
          

          {timeSlots.length > 0 && (
            <View style={styles.timeSlotList}>
              {timeSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeSlotItem,
                    selectedSlots.includes(index)
                      ? styles.selectedSlot
                      : styles.unselectedSlot,
                  ]}
                  onPress={() => handleSlotSelect(index)}
                >
                  <Text
                    style={
                      selectedSlots.includes(index)
                        ? styles.selectedSlotText
                        : styles.unselectedSlotText
                    }
                  >
                    {formatTime(slot.start)} - {formatTime(slot.end)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <Button
            title={
              loading ? (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  style={styles.indicator}
                />
              ) : (
                "Create Time Slots"
              )
            }
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddTimeSlot;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: COLORS.grey,
    borderRadius: 5,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.black,
    fontWeight: 'bold',
  },
  selectedTabText: {
    color: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    width: "100%",
    fontFamily: "Poppins",
  },
  timePickerButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  timePickerText: {
    color: "#333",
    fontSize: 16,
  },
  dropdown: {
    marginVertical: 5,
  },
  timeSlotList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  timeSlotItem: {
    width: "30%",
    marginVertical: 5,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  selectedSlot: {
    backgroundColor: "rgba(102, 42, 178, 1)",
  },
  unselectedSlot: {
    backgroundColor: "#fff",
    borderColor: "gray",
    borderWidth: 1,
  },
  selectedSlotText: {
    color: "white",
  },
  unselectedSlotText: {
    color: "black",
  },
  indicator: {
    position: "absolute",
    alignSelf: "center",
  },
});
