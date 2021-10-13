import React, { useEffect } from "react";
import {

  StyleSheet,
  Platform,
  FlatList,
  Button,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";

import Colors from "../../../constants/Colors";
import PlaceItem from "../../../components/UI/ListItem";
import * as newsActions from "../../../store/actions/news";

const News = (props) => {
  const news = useSelector((state) => state.news.newsList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(newsActions.loadNews());
  }, [dispatch]);

  return (
    <FlatList
      data={news}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <PlaceItem
          newsTitle={itemData.item.title}
          newsCompany={itemData.item.company}
          //   uri={itemData.item.uri}
        
          onSelect={() => {
            props.navigation.navigate("SignedNewsWebView", {
              url: itemData.item.url,
              title: itemData.item.title,
              company: itemData.item.company,
              addNews: false,
            });
          }}
        >
        
          <Button
            color={Colors.primary}
            title="Delete"
            onPress={() => {
              dispatch(newsActions.deleteNews(itemData.item.id));
            }}
          />
        </PlaceItem>
      )}
    />
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: "All News",
  };
};

const styles = StyleSheet.create({});

export default News;
