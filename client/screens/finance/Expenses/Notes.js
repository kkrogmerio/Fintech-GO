import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  Button,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../../components/UI/HeaderButton";
import Colors from "../../../constants/Colors";
import PlaceItem from "../../../components/UI/ListItem";
import * as notesActions from "../../../store/actions/notes";

const Notes = (props) => {
  const notes = useSelector((state) => state.notes.notes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(notesActions.loadNotes());
  }, [dispatch]);

  return (
    <FlatList
      data={notes}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <PlaceItem
          image={itemData.item.imageUri}
          title={itemData.item.title}
          content={itemData.item.content}
          onSelect={() => {
            props.navigation.navigate("NoteDetails", {
              noteId: itemData.item.id,
            });
          }}
        >
          <Button
            color={Colors.primary}
            title="Delete"
            onPress={() => {
              dispatch(notesActions.clearNote(itemData.item.id));
            }}
          />
        </PlaceItem>
      )}
    />
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: "All Notes",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add Note"
          iconName={Platform.OS === "android" ? "md-add" : "ios-add"}
          onPress={() => {
            navData.navigation.navigate("NoteDetails");
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({});

export default Notes;
