import { insertNews, fetchNews } from "../../helpers/db";

export const ADD_NEWS = "ADD_NEWS";
export const SET_NEWS = "SET_NEWS";

export const addNews = (title, company, url) => {
  return async (dispatch) => {
    try {
      const dbResult = await insertNews(title, company, url);
      console.log(dbResult);
      dispatch({
        type: ADD_NEWS,
        newsData: {
          id: dbResult.insertId,
          title: title,
          company: company,
          url: url,
        },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

export const loadNews = () => {
  return async (dispatch) => {
    try {
      const dbResult = await fetchNews();
      console.log(dbResult);
      dispatch({ type: SET_NEWS, newsList: dbResult.rows._array });
    } catch (err) {
      throw err;
    }
  };
};
