import React, { useEffect } from "react";
import { WebView } from "react-native-webview";
import { useDispatch } from "react-redux";
import { StyleSheet, Text, View } from "react-native";
import * as newsActions from "../../store/actions/news";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
export default function NewsWebView(props) {
  console.log(props.route);

  const { url, title, company, addNews } = props.route.params;

  const dispatch = useDispatch();
  useEffect(() => {



    console.log(
      "url= ",
      url,
      "\n",
      "addNews= ",
      addNews,
      "title= ",
      title,
      "company= ",
      company
    );

    if (addNews == true) dispatch(newsActions.addNews(title, company, url));
  }, [dispatch]);

  return <WebView source={{ uri: url }} />;
}
export const screenOptions = (navData) => {
  return {
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
const styles = StyleSheet.create({});
