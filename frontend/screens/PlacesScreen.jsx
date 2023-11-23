import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
import { addCity, removeCity } from "../reducers/user";

export default function PlacesScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [city, setCity] = useState("");
  const [errMsg, setErrMsg] = useState("");

  console.log(city);
  console.log(user.places);

  const handleAddCity = () => {
    if (city.length === 0 || !city.trim()) {
      setErrMsg("Please enter a valid city");
      return;
    }
    fetch(`https://api-adresse.data.gouv.fr/search/?q=${city}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.features.length === 0) {
          setErrMsg("Enter a valid city");
          return;
        }
        const apiData = data.features[0].geometry;
        const cityObj = {
          city: city,
          latitude: apiData.coordinates[1],
          longitude: apiData.coordinates[0],
        };
        dispatch(addCity(cityObj));
        setCity("");
      });
  };

  const handleDeleteCity = (name) => {
    dispatch(removeCity(name));
  };

  const places = user.places.map((place, i) => {
    return (
      <View key={i} style={styles.preview_data}>
        <View style={styles.item}>
          <Text>{place.city}</Text>
          <Text>
            LAT:{Number(place.latitude).toFixed(3)} LON:
            {Number(place.longitude).toFixed(3)}
          </Text>
        </View>
        <FontAwesome
          style={styles.corbeille}
          name="trash-o"
          size={30}
          color="purple"
          onPress={() => handleDeleteCity(place.city)}
        />
      </View>
    );
  });

  return (
    <SafeAreaView onPress={Keyboard.dismiss} style={styles.container}>
      <Text style={{ fontFamily: "Pacifico", fontSize: 25, marginTop: 50 }}>
        {user.nickname}'s Places
      </Text>
      <View style={styles.add_box}>
        <TextInput
          style={styles.input}
          placeholder="New City"
          onChangeText={(value) => setCity(value)}
          value={city}
        ></TextInput>
        <TouchableOpacity style={styles.button} onPress={() => handleAddCity()}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <Text>{errMsg}</Text>

      <ScrollView contentContainerStyle>{places}</ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "f1f2f1",
    alignItems: "center",
    justifyContent: "center",
  },
  add_box: {
    backgroundColor: "white",
    borderRadius: 20,
    width: 200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 300,
    paddingHorizontal: 20,
    margin: 30,
  },
  preview_data: {
    backgroundColor: "white",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 10,
    padding: 20,
    gap: 70,
  },
  input: {
    marginTop: 30,
    marginBottom: 30,
    borderBottomColor: "purple",
    borderBottomWidth: 2,
    width: 150,
  },
  button: {
    borderRadius: 15,
    width: 70,
    alignItems: "center",
    backgroundColor: "purple",
  },
  buttonText: {
    textAlign: "center",
    padding: 10,
    color: "white",
  },
});
