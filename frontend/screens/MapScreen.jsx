import {
  StyleSheet,
  Dimensions,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useSelector, useDispatch } from "react-redux";
import { addCity } from "../reducers/user";

export default function MapScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [currentPosition, setCurrentPosition] = useState(null);
  const [tempLocation, setTempLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlace, setNewPlace] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          setCurrentPosition(location.coords);
        });
      }
    })();
  }, []);

  const markedPlaces = user.places.map((place, i) => {
    return (
      <Marker
        title={place.city}
        key={i}
        coordinate={{ latitude: place.latitude, longitude: place.longitude }}
      />
    );
  });

  const handleLongPress = (e) => {
    setModalVisible(true);
    setTempLocation(e.nativeEvent.coordinate);
  };

  const addPlaceToStore = () => {
    dispatch(
      addCity({
        city: newPlace,
        latitude: tempLocation.latitude,
        longitude: tempLocation.longitude,
      })
    );
    setModalVisible(false);
    setNewPlace("");
  };

  const handleClose = () => {
    setModalVisible(false);
    setNewPlace("");
  };

  return (
    <>
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="New place"
              style={styles.input}
              onChangeText={(value) => setNewPlace(value)}
              value={newPlace}
            />
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => addPlaceToStore()}
            >
              <Text style={styles.textButton}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => handleClose()}
            >
              <Text style={styles.textButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <MapView
        mapType="hybrid"
        style={styles.map}
        onLongPress={(e) => handleLongPress(e)}
      >
        {currentPosition && (
          <Marker
            title="My Location"
            pinColor="#fecb2d"
            coordinate={currentPosition}
          />
        )}
        {markedPlaces}
      </MapView>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: 150,
    borderBottomColor: "purple",
    borderBottomWidth: 1,
    fontSize: 16,
  },
  button: {
    width: 150,
    alignItems: "center",
    marginTop: 20,
    paddingTop: 8,
    backgroundColor: "purple",
    borderRadius: 10,
  },
  textButton: {
    color: "#ffffff",
    height: 24,
    fontWeight: "600",
    fontSize: 15,
  },
});
