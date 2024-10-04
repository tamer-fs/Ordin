import { View, Text, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";

const NoWifi = () => {
  return (
    <SafeAreaView className="w-full h-full bg-grey flex-1 items-center justify-center">
      <Image
        resizeMode="contain"
        source={images.noconnection}
        className="w-[380px] h-[300px]"
      />
      <Text className="text-white font-pregular text-xl mt-10">
        No internet connection found...
      </Text>
      <Text className="text-white font-pregular text-xl">
        Please connect to the internet.
      </Text>
    </SafeAreaView>
  );
};

export default NoWifi;
