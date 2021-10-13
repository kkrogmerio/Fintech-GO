import { ADD_NEWS, SET_NEWS } from "../actions/news";
import News from "../../models/news";

const initialState = {
  newsList: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_NEWS:
      return {
        newsList: action.newsList.map(
          (pl) => new News(pl.id.toString(), pl.title, pl.company, pl.url)
        ),
      };
    case ADD_NEWS:
      const newNote = new News(
        action.newsData.id.toString(),
        action.newsData.title,
        action.newsData.company,
        action.newsData.dateTime,
        action.newsData.url
      );
      return {
        newsList: state.newsList.concat(newNote),
      };
    default:
      return state;
  }
};
