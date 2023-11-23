import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { useFonts } from "expo-font";
import { addUsernameToStore } from "../reducers/user";
import { useDispatch } from "react-redux";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const handleUsername = () => {
    if (username.length === 0 || !username.trim()) {
      setErrMsg("Write a nickname, please ! I beg you !");
      return;
    }
    dispatch(addUsernameToStore(username));
    setUsername("");
    navigation.navigate("TabNavigator", { screen: "Map" });
  };
  const [fontsLoaded] = useFonts({
    Pacifico: require("../assets/Pacifico-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset={320}
      behavior={"padding"}
    >
      <Pressable onPress={Keyboard.dismiss}>
        <Image
          source={require("../assets/home-image.png")}
          resizeMode="cover"
          style={{ width: "100%", height: "67%" }}
        />
        <View style={styles.inner}>
          <Text style={styles.text}>Welcome to Locate Me</Text>
          <TextInput
            style={styles.input}
            placeholder="Nickname"
            onChangeText={(value) => setUsername(value)}
            value={username}
          />
          <Text style={styles.errMsg}>{errMsg}</Text>

          <TouchableOpacity onPress={() => handleUsername()}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Go to Map</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  text: { fontSize: 30, textAlign: "center", fontFamily: "Pacifico" },
  input: {
    marginTop: 10,
    marginBottom: 30,
    borderBottomColor: "purple",
    borderBottomWidth: 2,
    width: 320,
    marginLeft: 25,
  },
  errMsg: {
    marginLeft: 50,
    paddingBottom: 10,
  },
  button: {
    marginBottom: 50,
    marginLeft: 13,
    borderRadius: 15,
    width: 350,
    alignItems: "center",
    backgroundColor: "purple",
  },
  buttonText: {
    textAlign: "center",
    padding: 10,
    color: "white",
  },
});
