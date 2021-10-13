import React from "react";
import { useSelector } from "react-redux";
import { StyleSheet, Text, View, Image } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import {
  centered,
  imageProfileStyle,
  cardContainer,
} from "../../constants/Styles";
import HeaderButton from "../../components/UI/HeaderButton";
import { LinearGradient } from "expo-linear-gradient";
import Card from "../../components/UI/Card";
export default function Profile() {
  const profile = useSelector((state) => state.deepProfile);
  const currency = useSelector((state) => state.currency);
  return (
    <LinearGradient colors={["#F0FFFF", "#6495ED"]} style={centered}>
      <Card style={cardContainer}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <Image
            style={imageProfileStyle}
            source={{ uri: profile.profilePic }}
          />
          <Text style={{ fontSize: 30, fontFamily: "open-sans" }}>
            {profile.userName}
          </Text>
          <View
            style={{
              flex: 1,
              width: "95%",
              alignItems: "center",
              marginTop: 20,
              height: "55%",
              backgroundColor: "#87CEFA",
              borderRadius: 40,
              opacity: 0.7,
              paddingVertical: 30,
            }}
          >
            <View style={styles.boxStyle}>
              <Text style={styles.boxTextStyle}>Salary:</Text>
              <Text style={styles.boxTextStyle}>
                {(profile.salary / currency.rate).toFixed(0)}
                {currency.currency}
              </Text>
            </View>
            <View style={styles.boxStyle}>
              <Text style={styles.boxTextStyle}>Birthday:</Text>
              <Text style={styles.boxTextStyle}>{profile.birthday}</Text>
            </View>
            <View style={styles.boxStyle}>
              <Text style={styles.boxTextStyle}>Email:</Text>
              <Text style={styles.boxTextStyle}>{profile.email}</Text>
            </View>
          </View>
        </View>
        <View style={(centered, styles.deepProfileContainer)}></View>
      </Card>
    </LinearGradient>
  );
}
export const screenOptions = (navData) => {
  return {
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add"
          iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
          onPress={() => {
            navData.navigation.navigate("UpdateProfile");
          }}
        />
      </HeaderButtons>
    ),

    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};
const styles = StyleSheet.create({
  cardContainer: {
    width: "95%",
    height: "70%",
    maxWidth: 400,
    maxHeight: 600,
    padding: 20,
    backgroundColor: "#ADD8E6",
  },
  boxTextStyle: {
    fontSize: 15,
    color: "white",
    fontFamily: "open-sans-bold",
  },
  boxStyle: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#1E90FF",
    width: "95%",
    maxHeight: 50,
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginVertical: 10,
    borderRadius: 30,
  },
});
