import { combineReducers } from "redux";

const changePageReducer = (currentPage = "home", action) => {
  if (action.type === "CHANGE_CURRENT_PAGE") {
    return action.payload;
  }
  return currentPage;
};

export const reducer = combineReducers({ currentPage: changePageReducer });
