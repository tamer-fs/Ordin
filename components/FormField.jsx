import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  keyboardType = "",
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(true);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="w-full h-14 px-4 bg-grey-100 rounded-xl items-center border-2 border-grey-300 focus:border-primary">
        <TextInput
          onChangeText={(e) => handleChangeText(e)}
          className="flex-1 w-full text-white font-pregular text-sm "
          value={value}
          placeholder={placeholder}
          placeholderTextColor={"#353842"}
          secureTextEntry={!showPassword}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
};

export default FormField;
