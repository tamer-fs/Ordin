import { View, Text, SafeAreaView, ScrollView, Image } from "react-native";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { signInWithEmailAndPassword } from "firebase/auth";
import firebase from "../../firebase";
import { ref, set } from "firebase/database";

const SignUp = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errMessage, setErrMessage] = useState("");

  const handleLogIn = (e) => {
    e.preventDefault();
    if (form.email && form.password) {
      signInWithEmailAndPassword(firebase.auth, form.email, form.password)
        .then((user) => {
          setForm({ email: "", password: "" });
          router.push("/home");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <SafeAreaView className="bg-grey h-full">
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[150px] h-[50px]"
          />
          <Text className="text-2xl text-white font-psemibold mt-10">
            Inloggen
          </Text>

          <FormField
            title="Email Adress"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-8"
            keyboardType="email-address"
          />
          <FormField
            title="Wachtwoord"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-4"
          />
          <CustomButton
            title="Inloggen"
            containerStyles={"mt-12"}
            handlePress={(e) => handleLogIn(e)}
          />
          <Text className="font-pregular text-white mt-4 text-center w-full">
            Heeft nog geen account?{" "}
            <Link className="font-pbold text-primary" href={"/signin"}>
              Meld je aan
            </Link>
          </Text>
          <Text>{errMessage}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
