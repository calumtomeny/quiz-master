import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import "typeface-roboto";
import { BrowserRouter } from "react-router-dom";
import App from "./app/layout/App";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BASE_API_URL;

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("apiKey");
  if (token) {
    config.headers.ApiKey = token;
  }
  return config;
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
