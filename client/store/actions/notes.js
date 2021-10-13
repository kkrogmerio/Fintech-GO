import {
  insertNote,
  fetchNotes,
  deleteNote,
  updateNote,
} from "../../helpers/db";

export const ADD_NOTE = "ADD_NOTE";
export const SET_NOTES = "SET_NOTES";
export const UPDATE_NOTE = "UPDATE_NOTE";
export const DELETE_NOTE = "DELETE_NOTE";
export const addNote = (content, title) => {
  return async (dispatch) => {
    try {
      const dbResult = await insertNote(content, title);
      console.log(dbResult);
      dispatch({
        type: ADD_NOTE,
        noteData: {
          id: dbResult.insertId,

          title: title,
          content: content,
        },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

export const loadNotes = () => {
  return async (dispatch) => {
    try {
      const dbResult = await fetchNotes();
      console.log(dbResult);
      dispatch({ type: SET_NOTES, notes: dbResult.rows._array });
    } catch (err) {
      throw err;
    }
  };
};
export const refreshNote = (id, title, content) => {
  return async (dispatch) => {
    try {
      const dbResult = await updateNote(id, title, content);
      console.log(dbResult);
      dispatch({ type: UPDATE_NOTE, id: id, title: title, content: content });
    } catch (err) {
      throw err;
    }
  };
};
export const clearNote = (id) => {
  return async (dispatch) => {
    try {
      const dbResult = await deleteNote(id);
      console.log(dbResult);
      dispatch({ type: DELETE_NOTE, id: id });
    } catch (err) {
      throw err;
    }
  };
};
