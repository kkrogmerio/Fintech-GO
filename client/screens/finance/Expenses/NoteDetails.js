import React, { useState, useEffect} from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import HeaderButton from "../../../components/UI/HeaderButton";
import * as notesActions from "../../../store/actions/notes";
import Input from "../../../components/UI/Input";
import Colors from "../../../constants/Colors";
import { Header } from "react-navigation-stack";

const NoteDetails = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const noteId = props.route.params ? props.route.params.noteId : null;
  const editedNote = useSelector((state) =>
    state.notes.notes.find((note) => note.id === noteId)
  );
  const [title, setTitle] = useState(editedNote ? editedNote.title : "");
  const [content, setContent] = useState(editedNote ? editedNote.content : "");
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const submitHandler = async () => {
    if (title === "" || content === "") {
      console.log(title, content);
      Alert.alert("Wrong input!", "Please check the errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (editedNote) {
        await dispatch(notesActions.refreshNote(noteId, title, content));
      } else {
        await dispatch(notesActions.addNote(content, title));
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Save"
            iconName={
              Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
            }
            onPress={submitHandler}
          />
        </HeaderButtons>
      ),
    });
  }, [submitHandler]);

  const inputChangeHandler =useCallback((inputIdentifier, inputValue, inputValidity) => {

    if (inputIdentifier === "title" && inputValidity) {
      setTitle(inputValue);

    } else if (inputIdentifier === "content" && inputValidity) {
      setContent(inputValue);

    }
  },[]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="title"
            label="Title"
            errorText="Please enter a title!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={title}
            initiallyValid={!!title}
            required
          />
          <Input
            id="content"
            label="Text"
            errorText="Please enter a text message!"
            keyboardType="default"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={content}
            initiallyValid={!!content}
            required
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const screenOptions = (navData) => {

  const routeParams = navData.route.params ? navData.route.params : {};
  return {
    headerTitle: routeParams.noteId ? "Edit Note" : "Add Note",
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NoteDetails;
