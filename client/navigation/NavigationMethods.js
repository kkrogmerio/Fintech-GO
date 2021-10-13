import React from "react";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Alert, TouchableNativeFeedback } from "react-native";
export const ImgPicker = (props) => {
  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.CAMERA);
    if (result.status !== "granted") {
      Alert.alert(
        "Insufficient permissions!",
        "You need to grant camera permissions to use this app.",
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  };

  const newProfilePic = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      console.log("Not permission");
      return;
    }
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [9, 9],
      quality: 0.5,
    });
    Alert.alert(
      "Update profile picture!",
      "Are you sure you want to update your profile picture?",
      [
        {
          text: "Okay",
          onPress: () => {
            props.onImageTaken(image);
          },
        },
        { text: "Cancel", onPress: () => {} },
      ]
    );
  };
  return (
    <TouchableNativeFeedback
      onPress={() => {
        newProfilePic();
      }}
    >
      <Ionicons
        name={Platform.OS === "android" ? "md-add-circle" : "ios-add-circle"}
        size={43}
        color="green"
        style={{ position: "absolute", right: 80, top: 10 }}
      />
    </TouchableNativeFeedback>
  );
};

