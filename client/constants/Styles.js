import { Dimensions } from "react-native";
import Colors from "./Colors";
export const drawerStyle = {
  width: Dimensions.get("window").width * 0.7,
  borderTopRightRadius: 30,
  borderBottomRightRadius: 30,
  fontSize: 34,
  backgroundColor: Colors.navigationColor,
};
export const tabStyle = {
  backgroundColor: Colors.navigationColor,
};
export const profilePreviewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
};
export const horizontalLine = {
  marginVertical: 40,
  backgroundColor: "black",
  height: 2,
  flex: 1,
};
export const centered = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
};
export const imageProfileStyle = {
  width: 120,
  height: 120,
  borderRadius: 60,
  marginBottom: 15,
  backgroundColor: "#ccc",
  borderColor: Colors.primary,
  borderWidth: 1,
};
export const cardContainer = {
  width: "95%",
  height: "70%",
  maxWidth: 400,
  maxHeight: 600,
  padding: 20,
  backgroundColor: "#ADD8E6",
};
export const chartConfig = {

  backgroundGradientFrom: "#4682B4",
  backgroundGradientTo: "#87CEFA",
  borderRadius: 14,
  color: (opacity = 1) => `white`,
  labelColor: (opacity = 1) => `white`,

  propsForDots: { r: "6", strokeWidth: "2", stroke: "#191970" },
};
