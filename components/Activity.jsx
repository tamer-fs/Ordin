import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";

const Activity = ({
  activity = "Naar de stad",
  owner = "Tamer",
  start = "17:30",
  end = "18:20",
}) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    let startList = start.split(":");
    let endList = end.split(":");
    if (parseInt(startList[1]) < 10) {
      const startA = startList[0];
      const startB = `0${startList[1]}`;
      setStartTime(`${startA}:${startB}`);
    } else {
      setStartTime(start);
    }
    if (parseInt(endList[1]) < 10) {
      const endA = endList[0];
      const endB = `0${endList[1]}`;
      setEndTime(`${endA}:${endB}`);
    } else {
      setEndTime(end);
    }
  }, []);

  return (
    <View className="w-full h-20 bg-grey-100 border-2 border-grey-300 rounded-lg flex-row justify-between items-center px-4">
      <Text className="absolute top-1 left-1 text-[10px] text-white">
        {owner}
      </Text>
      <Text className="text-white text-base font-pregular max-w-[60%]">
        {activity}
      </Text>
      <Text className="opacity-50 text-white text-base font-pregular">
        {startTime} - {endTime}
      </Text>
    </View>
  );
};

export default Activity;
