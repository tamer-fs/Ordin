import { StatusBar } from "expo-status-bar";
import { Text, View, Image, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import { images } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { onAuthStateChanged } from "firebase/auth";
import firebase from "../firebase";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(firebase.auth, (user) => {
      if (user) {
        setUser(user);
        router.push("/home");
      }
    });
  }, [user]);

  return (
    <SafeAreaView className="h-full bg-grey" style={{ display: "grid" }}>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full items-center justify-center min-h-[85vh] px-4">
          <Image
            source={images.logo}
            className="w-[150px] h-[100px]"
            resizeMode="contain"
          />
          <Image
            source={images.main}
            className="max-w-[380px] w-full h-[200px]"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white text-center font-psemibold">
              Alles geordend in één app met{" "}
              <Text className="text-primary">Ordin</Text>
            </Text>
            <Text className="text-sm text-white opacity-80 font-pregular mt-7 text-center">
              Zonder moeite afspraken delen met je vrienden en famillie. Zo
              wordt je nooit meer lastig gevallen!
            </Text>
          </View>
          <CustomButton
            title="Doorgaan met email adress"
            handlePress={() => {
              router.push("/signin");
            }}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#131417" style="light" />
    </SafeAreaView>
  );
}
