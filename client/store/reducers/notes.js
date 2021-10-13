import {
  ADD_NOTE,
  SET_NOTES,
  UPDATE_NOTE,
  DELETE_NOTE,
} from "../actions/notes";
import Note from "../../models/notes";

const initialState = {
  notes: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTES:
      return {
        notes: action.notes.map(
          (pl) => new Note(pl.id.toString(), pl.title, pl.content)
        ),
      };
    case ADD_NOTE:
      const newNote = new Note(
        action.noteData.id.toString(),
        action.noteData.title,
        action.noteData.content
      );
      return {
        notes: state.notes.concat(newNote),
      };
    case UPDATE_NOTE:
      const noteIndex = state.notes.findIndex((prod) => prod.id === action.id);
      const updatedNote = new Note(action.id, action.title, action.content);
      const updatedUserNotes = [...state.notes];
      updatedUserNotes[noteIndex] = updatedNote;
      return {
        notes: updatedUserNotes,
      };
    case DELETE_NOTE:
      return {
        notes: state.notes.filter((note) => note.id !== action.id),
      };
    default:
      return state;
  }
};
