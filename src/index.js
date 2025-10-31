import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./components/store";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

axios.defaults.baseURL = process.env.REACT_APP_URL;
axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
 
const root = ReactDOM.createRoot(document.getElementById("root"));
const url = process.env.REACT_APP_SOCKET;
// const url = "http://165.22.52.228/";
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <App url={url} />
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>
);
