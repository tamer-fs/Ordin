import { View, Text } from "react-native";
import React from "react";
import { useEffect } from "react";

const Popup = ({ visible = true, children, containerStyles }) => {
  useEffect(() => {
    console.log(visible);
  }, []);

  return (
    <View
      style={{
        display: `${visible ? "flex" : "none"}`,
      }}
      className={`absolute top-[25vh] z-10 left-[5vw] w-full h-full items-center `}
    >
      <View
        className={`w-[100%] height-[auto] bg-grey-300 border-2 border-grey-400 px-5 py-5 rounded-xl drop-shadow-2xl ${containerStyles}`}
      >
        {children}
      </View>
    </View>
  );
};

export default Popup;
