import { View, Text, SafeAreaView, ScrollView, Image } from "react-native";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { createUserWithEmailAndPassword } from "firebase/auth";
import firebase from "../../firebase";
import { ref, set } from "firebase/database";

const SingIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [errMessage, setErrMessage] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();
    if (form.email && form.password && form.name) {
      createUserWithEmailAndPassword(firebase.auth, form.email, form.password)
        .then((userCredential) => {
          const user = userCredential.user;
          set(ref(firebase.db, `/users/${user.uid}`), {
            name: form.name,
          });
          setForm({
            email: "",
            password: "",
            name: "",
          });
          router.push("/home");
        })
        .catch((error) => {
          console.log(error.message);
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
            Meld je aan bij Ordin
          </Text>

          <FormField
            title="Volledige naam"
            value={form.name}
            handleChangeText={(e) => setForm({ ...form, name: e })}
            otherStyles="mt-7"
          />
          <FormField
            title="Email Adress"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-4"
            keyboardType="email-address"
          />
          <FormField
            title="Wachtwoord"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-4"
          />
          <CustomButton
            title="Aanmelden"
            containerStyles={"mt-12"}
            handlePress={(e) => handleSignIn(e)}
          />
          <Text className="font-pregular text-white mt-4 text-center w-full">
            Heeft u al een account?{" "}
            <Link className="font-pbold text-primary" href={"/signup"}>
              Log in
            </Link>
          </Text>
          <Text>{errMessage}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SingIn;
