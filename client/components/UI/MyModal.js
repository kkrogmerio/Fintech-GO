import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Dimensions,
  TextInput,
} from "react-native";

export default function MyModal(props) {
  return (
    <Modal
      visible={props.visible}
      transparent={true}
      onDismiss={props.onDismiss}
      style={{
        margin: 0,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.modalContainer}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Please enter the code received via email to verify your account
        </Text>
        <View style={styles.textContainer}>
          <TextInput
            style={styles.input}
            placeholder="Verification code"
            id="verifCode"
            label="Verification code"
            keyboardType="default"
            required
            minLength={5}
            autoCapitalize="none"
            errorText="Please enter a valid verification code."
            onChangeText={props.onChangeText}
          />
        </View>
        <View style={styles.confirmButton}>
          <Button
            title="Confirm verification code "
            onPress={props.onPressButton}
          />
        </View>
        <View style={{ position: "absolute", top: 0, right: 0 }}>
          <Button
            style={{ opacity: 0.93 }}
            title="Close pop-up"
            onPress={props.onPressButtonClose}
          />
        </View>
      </View>
    </Modal>
  );
}

export const stylesModal = StyleSheet.create({
  textContainer: {
    marginVertical: Dimensions.get("window").height / 37,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#E0FFFF",
    padding: 15,
    marginVertical: Dimensions.get("window").height / 6,
    marginHorizontal: Dimensions.get("window").width / 96,

    alignItems: "center",
    justifyContent: "center",
  },
  confirmButton: {
    padding: 7,
    textAlign: "center",
    // alignItems:"center",
    backgroundColor: "#00BFFF",
    borderRadius: 10,
  },
  input: {
    alignSelf: "center",
    height: 40,
    width: 150,
    borderWidth: 1,
    backgroundColor: "white",
  },
});
