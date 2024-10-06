import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Vibration,
} from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import firebase from "../../firebase";
import { onValue, ref, set } from "firebase/database";
import Activity from "../../components/Activity";
import Popup from "../../components/Popup";
import FormField from "../../components/FormField";

const Home = () => {
  const [currentMonth, setCurrentMonth] = useState(10);
  const [currentDay, setCurrentDay] = useState(4);
  const [currentYear, setCurrentYear] = useState(2024);
  const [currentUser, setCurrentUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [today, setToday] = useState();
  const [selectedDates, setSelectedDates] = useState([]);
  const [addWindowOpen, setAddWindowOpen] = useState(false);

  const [markedDates, setMarkedDates] = useState({});

  const [deleteWindowOpen, setDeleteWindowOpen] = useState(false);
  const [toDeleteItem, setToDeleteItem] = useState({});

  const [activities, setActivities] = useState([]);
  const [upComingActivities, setUpComingActivities] = useState([]);
  const [selectingDates, setSelectingDates] = useState(true);

  const [addEndTimeH, setAddEndTimeH] = useState(12);
  const [addEndTimeM, setAddEndTimeM] = useState(30);
  const [addBeginTimeH, setAddBeginTimeH] = useState(12);
  const [addBeginTimeM, setAddBeginTimeM] = useState(30);
  const [addName, setAddName] = useState("");

  const months = [
    "Januari",
    "Februari",
    "Maart",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "December",
  ];

  const getUpcomingActivities = (act) => {
    const today = new Date();
    let upcoming = [];
    let activitiesList = [];
    act.forEach((item, index) => {
      const inputDate = new Date(`${item.year}-${item.month}-${item.day}`);
      if (inputDate > today) {
        activitiesList.push(item);
      }
    });

    activitiesList.forEach((item) => {
      upcoming.push(`${item.day}-${item.month}-${item.year}`);
    });

    setUpComingActivities(upcoming);
  };

  useEffect(() => {
    const today = new Date();

    // Day
    const dayOfMonth = today.toLocaleString("default", { day: "numeric" });
    setCurrentDay(dayOfMonth);

    // Month
    setCurrentMonth(today.getMonth() + 1);

    // Year
    setCurrentYear(today.getFullYear());

    setToday([dayOfMonth, today.getMonth() + 1, today.getFullYear()]);

    const user = firebase.auth.currentUser;

    if (user) {
      setCurrentUser(user);

      onValue(ref(firebase.db, `users/${user.uid}/name`), (snapshot) => {
        const data = snapshot.val();
        setUserName(data);
      });

      onValue(ref(firebase.db, `users/${user.uid}/activities`), (snapshot) => {
        let data = snapshot.val();
        if (data != null) {
          data = Object.values(data);
          setActivities(data);
          getUpcomingActivities(data);
        } else {
          setActivities([]);
          getUpcomingActivities([]);
        }
      });
    } else {
      router.push("/signin");
    }
  }, [currentUser]);

  const updateAcitivities = () => {
    onValue(
      ref(firebase.db, `users/${currentUser.uid}/activities`),
      (snapshot) => {
        let data = snapshot.val();
        if (data != null) {
          data = Object.values(data);
          setActivities(data);
          getUpcomingActivities(data);
        } else {
          setActivities([]);
          getUpcomingActivities([]);
        }
      }
    );
  };

  const handleMonthChange = (date) => {
    setCurrentMonth(date.month);
    setCurrentYear(date.year);
    if (currentDay == 31) {
      setCurrentDay(30);
    }
  };

  const handleDayPress = (date) => {
    setCurrentYear(date.year);
    setCurrentMonth(date.month);
    setCurrentDay(date.day);
  };

  const handleActivityRemove = (item) => {
    if (item.userId === currentUser.uid) {
      set(
        ref(firebase.db, `users/${currentUser.uid}/activities/${item.id}`),
        {}
      );
    }
  };

  const handleDayAdd = (date) => {
    let listCopy = selectedDates;
    let dateString = `${date.day}-${date.month}-${date.year}`;
    if (listCopy.includes(dateString)) {
      listCopy = listCopy.filter((value) => value != dateString);
    } else {
      listCopy.push(dateString);
    }
    if (listCopy.length <= 0) {
      handleDayPress(date);
      setSelectingDates(true);
    }
    setSelectedDates([...listCopy]);
  };

  const handleAddBtn = (name, start, end) => {
    if (selectedDates.length > 0) {
      selectedDates.forEach((date) => {
        let randomId = Math.round(Math.random() * 1000000);
        const dateList = date.split("-");
        set(
          ref(firebase.db, `users/${currentUser.uid}/activities/${randomId}`),
          {
            name: name,
            month: dateList[1],
            day: dateList[0],
            year: dateList[2],
            start: start,
            end: end,
            owner: userName,
            id: randomId,
            userId: currentUser.uid,
          }
        );
        setSelectingDates(true);
        setSelectedDates([]);
      });
    } else {
      let randomId = Math.round(Math.random() * 1000000);
      set(ref(firebase.db, `users/${currentUser.uid}/activities/${randomId}`), {
        name: name,
        month: currentMonth,
        day: currentDay,
        year: currentYear,
        start: start,
        end: end,
        owner: userName,
        id: randomId,
        userId: currentUser.uid,
      });
    }
    updateAcitivities();
  };

  const handleTimeChange = (end, hour, increment) => {
    if (end) {
      if (hour) {
        setAddEndTimeH((time) => time + increment);
        if (addEndTimeH + 1 >= 24) {
          setAddEndTimeH(0);
        }

        if (increment < 1) {
          if (addEndTimeH + increment < 0) {
            setAddEndTimeH(0);
          }
        }
      } else {
        setAddEndTimeM((time) => time + increment);
        if (addEndTimeM + increment == 60) {
          setAddEndTimeM(0);
        }
        if (increment < 1) {
          if (addEndTimeM + increment < 0) {
            setAddEndTimeM(0);
          }
        }
      }
    } else {
      if (hour) {
        setAddBeginTimeH((time) => time + increment);
        if (addBeginTimeH + 1 >= 24) {
          setAddBeginTimeH(0);
        }
        if (increment < 1) {
          if (addBeginTimeH + increment < 0) {
            setAddBeginTimeH(0);
          }
        }
      } else {
        setAddBeginTimeM((time) => time + increment);

        if (addBeginTimeM + increment == 60) {
          setAddBeginTimeM(0);
        }
        if (increment < 0) {
          if (addBeginTimeM + increment < 0) {
            setAddBeginTimeM(0);
          }
        }
      }
    }
  };

  return (
    <SafeAreaView
      className="bg-grey flex-1 px-5 pt-5"
      containerStyles={"items-center"}
    >
      <Popup visible={deleteWindowOpen}>
        <Text className={"font-pmedium text-white text-base text-center"}>
          {`Activiteit verwijderen?`}
        </Text>
        <View className={"w-full flex-row justify-between items-end mt-8"}>
          <CustomButton
            handlePress={() => {
              handleActivityRemove(toDeleteItem);
              setToDeleteItem({});
              setDeleteWindowOpen(false);
            }}
            title={"Ja"}
            containerStyles={"w-[48%] min-h-[30px]"}
          />
          <CustomButton
            handlePress={() => {
              setToDeleteItem({});
              setDeleteWindowOpen(false);
            }}
            title={"Nee"}
            containerStyles={"w-[48%] min-h-[30px] bg-red"}
          />
        </View>
      </Popup>

      <Popup visible={addWindowOpen}>
        <FormField
          title={"Naam Activiteit"}
          inputStyles={"bg-grey-400"}
          value={addName}
          handleChangeText={(e) => {
            setAddName(e);
          }}
        />
        <Text className="text-base text-gray-100 font-pmedium mt-4">
          Tijd Instellen
        </Text>
        <View className="flex-row justify-around items-center w-full bg-grey-400 p-2 rounded-lg mt-4">
          <View className="flex-row items-center gap-2">
            <View className="items-center">
              <TouchableOpacity
                onPress={() => handleTimeChange(false, true, 1)}
              >
                <Text className="text-primary text-2xl px-4">+</Text>
              </TouchableOpacity>
              <Text className="text-primary font-psemibold text-xl">
                {addBeginTimeH < 10 && "0"}
                {addBeginTimeH}
              </Text>
              <TouchableOpacity
                onPress={() => handleTimeChange(false, true, -1)}
              >
                <Text className="text-primary text-2xl px-4">-</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-primary font-psemibold text-xl">:</Text>
            <View className="items-center">
              <TouchableOpacity
                onPress={() => handleTimeChange(false, false, 5)}
              >
                <Text className="text-primary text-2xl px-4">+</Text>
              </TouchableOpacity>
              <Text className="text-primary font-psemibold text-xl">
                {addBeginTimeM < 10 && "0"}
                {addBeginTimeM}
              </Text>
              <TouchableOpacity
                onPress={() => handleTimeChange(false, false, -5)}
              >
                <Text className="text-primary text-2xl px-4">-</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-primary text-3xl font-pbold">-</Text>

          <View className="flex-row items-center gap-2">
            <View className="items-center">
              <TouchableOpacity onPress={() => handleTimeChange(true, true, 1)}>
                <Text className="text-primary text-2xl px-4">+</Text>
              </TouchableOpacity>
              <Text className="text-primary font-psemibold text-xl">
                {addEndTimeH < 10 && "0"}
                {addEndTimeH}
              </Text>
              <TouchableOpacity
                onPress={() => handleTimeChange(true, true, -1)}
              >
                <Text className="text-primary text-2xl px-4">-</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-primary font-psemibold text-xl">:</Text>

            <View className="items-center">
              <TouchableOpacity
                onPress={() => handleTimeChange(true, false, 5)}
              >
                <Text className="text-primary text-2xl px-4">+</Text>
              </TouchableOpacity>
              <Text className="text-primary font-psemibold text-xl">
                {addEndTimeM < 10 && "0"}
                {addEndTimeM}
              </Text>
              <TouchableOpacity
                onPress={() => handleTimeChange(true, false, -5)}
              >
                <Text className="text-primary text-2xl px-4">-</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="flex-row justify-between items-end mt-4">
          <CustomButton
            title={"maak activiteit"}
            containerStyles={"min-h-[30px] w-[47%] rounded-lg"}
            handlePress={() => {
              if (addName != "") {
                handleAddBtn(
                  addName,
                  `${addBeginTimeH}:${addBeginTimeM}`,
                  `${addEndTimeH}:${addEndTimeM}`
                );
                setAddBeginTimeH(12);
                setAddBeginTimeM(30);
                setAddEndTimeH(12);
                setAddEndTimeM(30);
                setAddName("");
                setAddWindowOpen(false);
              }
            }}
          />
          <CustomButton
            title={"annuleer"}
            containerStyles={"min-h-[30px] w-[47%] rounded-lg bg-red"}
            handlePress={() => {
              setAddBeginTimeH(12);
              setAddBeginTimeM(30);
              setAddEndTimeH(12);
              setAddEndTimeM(30);
              setAddName("");
              setAddWindowOpen(false);
            }}
          />
        </View>
      </Popup>

      <View className="rounded-xl w-full overflow-hidden bg-grey">
        <Calendar
          onMonthChange={handleMonthChange}
          className="bg-primary p-0"
          renderHeader={(date) => {
            return (
              <View className=" bg-primary h-12 items-center justify-center">
                <Text className="font-pmedium text-md text-white">
                  {`${months[currentMonth - 1]} ${currentYear}`}
                </Text>
              </View>
            );
          }}
          dayComponent={({ date, state }) => {
            return (
              <>
                <TouchableOpacity
                  onLongPress={() => {
                    if (state != "disabled") {
                      if (!selectingDates) {
                        setSelectedDates([]);
                        setSelectingDates(true);
                        handleDayPress(date);
                      } else {
                        handleDayAdd(date);
                        setSelectingDates(false);
                      }
                      Vibration.vibrate(100);
                    }
                  }}
                  onPress={() => {
                    if (state != "disabled") {
                      if (!selectingDates) {
                        handleDayAdd(date);
                      } else {
                        handleDayPress(date);
                      }
                    }
                  }}
                >
                  <View
                    className={`w-10 h-10 relative rounded-md
                    
                      ${
                        today &&
                        (date.day == today[0] &&
                        date.month == today[1] &&
                        date.year == today[2]
                          ? "border-2 border-white"
                          : "")
                      }

                    ${
                      selectingDates &&
                      (date.day == currentDay && date.month == currentMonth
                        ? "bg-primary"
                        : "bg-grey-300")
                    }
                    

                      
                    ${
                      !selectingDates &&
                      (selectedDates.includes(
                        `${date.day}-${date.month}-${date.year}`
                      )
                        ? "bg-red"
                        : "bg-grey-300")
                    } 

                    
                    
                    items-center justify-center`}
                  >
                    {upComingActivities.includes(
                      `${date.day}-${date.month}-${date.year}`
                    ) && (
                      <View
                        style={{
                          position: "absolute",
                          left: -4,
                          top: -4,
                          backgroundColor: "#F99055",
                          width: 10,
                          height: 10,
                          borderRadius: 10,
                        }}
                      ></View>
                    )}
                    <Text
                      style={{
                        color: state === "disabled" ? "black" : "white",
                      }}
                    >
                      {date.day}
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            );
          }}
          theme={{
            backgroundColor: "#1D1F24",
            calendarBackground: "#1D1F24",
            arrowColor: "#fff",
          }}
        />
      </View>
      <Text className="mt-5 font-pregular text-lg text-primary w-full text-center">
        Activiteiten
      </Text>
      <ScrollView className="mt-5">
        {activities
          .filter(
            (item) =>
              item.day == currentDay &&
              item.month == currentMonth &&
              item.year == currentYear
          )
          .map((item) => (
            <TouchableOpacity
              className="mb-4"
              onLongPress={() => {
                setDeleteWindowOpen(true);
                setToDeleteItem(item);
              }}
            >
              <Activity
                owner={item.owner}
                activity={item.name}
                start={item.start}
                end={item.end}
              />
            </TouchableOpacity>
          ))}
        <CustomButton
          title={"+"}
          containerStyles={
            "min-h-[30px] rounded-md items-center justify-center mt-2 mb-5"
          }
          handlePress={() => {
            setAddWindowOpen(true);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
