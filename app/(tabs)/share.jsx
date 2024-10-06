import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { useState, useEffect } from "react";
import firebase from "../../firebase";
import { onValue, ref, set } from "firebase/database";
import { signOut } from "firebase/auth";
import { router } from "expo-router";

const Share = () => {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = firebase.auth.currentUser;
    if (user) {
      setCurrentUser(user);
      onValue(ref(firebase.db, `users/${user.uid}/name`), (snapshot) => {
        setUserName(snapshot.val());
      });
    } else {
      router.push("/");
    }
  }, []);

  const handleNameChange = () => {
    if (name != "") {
      set(ref(firebase.db, `users/${currentUser.uid}/name`), `${name}`);
      setName("");
    }
  };

  const handleLogOut = () => {
    signOut(firebase.auth)
      .then(() => {
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const XSep = () => {
    return (
      <View className="w-full min-h-[2px] rounded-full bg-grey-400 my-6"></View>
    );
  };

  return (
    <SafeAreaView className="bg-grey flex-1 px-5 py-5">
      <ScrollView>
        <Text className="text-primary font-psemibold text-xl mb-4">
          Mijn Account
        </Text>
        <View className="bg-grey-200 w-full min-h-[10px] rounded-lg p-4">
          <FormField
            placeholder={userName}
            title={"naam wijzigen"}
            otherStyles={"mb-2"}
            value={name}
            handleChangeText={(e) => setName(e)}
          />
          <CustomButton
            title={"wijzig"}
            containerStyles={"min-h-[30px] text-sm"}
            handlePress={() => {
              handleNameChange();
            }}
          />
          <XSep />
          <Text className="text-base text-gray-100 font-pmedium mb-3">
            Uitloggen
          </Text>
          <CustomButton
            handlePress={() => {
              handleLogOut();
            }}
            title={"uitloggen"}
            containerStyles={"min-h-[30px] text-sm bg-red"}
          />
        </View>

        <Text className="text-primary font-psemibold text-xl mb-4 mt-4">
          Deel Jouw Activiteiten
        </Text>
        <View className="bg-grey-200 w-full min-h-[10px] rounded-lg p-4">
          <FormField title={"Uw eigen wachtwoord"} otherStyles={"mb-2"} />
          <FormField
            title={"Email adress van ontvanger"}
            otherStyles={"mb-2"}
          />
          <Text className="text-white font-pregular text-xs my-2">
            Uw ontvanger moet eerst uw deelverzoek accepteren. Pas daarna kan uw
            ontvanger uw activiteiten zien.
          </Text>
          <Text className="text-red font-pregular text-xs">
            Pas op, stuur dit niet naar de verkeerde persoon, het verzoekkan
            niet worden ingetrokken.
          </Text>
          <CustomButton
            title={"verstuur verzoek"}
            containerStyles={"min-h-[30px] text-sm mt-4"}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Share;
