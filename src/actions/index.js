const changeCurrentPage = pageName => {
  return {
    type: "CHANGE_CURRENT_PAGE",
    payload: pageName
  };
};

export { changeCurrentPage };
