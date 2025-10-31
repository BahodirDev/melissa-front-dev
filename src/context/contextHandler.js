import { addData } from "../components/reducers/report";

// contextHandler.js
export const reportContextHandler = (dispatch, action, data) => {

  switch (action) {
    case "insert":
      dispatch(addData(data));
      break;

    case "update":
      // updateData(data)
      break;

    case "delete":
      // removeData(data)
      break;

    default:
      console.log("unknown action =>", action);
  }
};
