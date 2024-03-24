import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import List from "./vehicle/list";
import AddOrEdit from "./vehicle/AddOrEdit";
import View from "./vehicle/view";
import Layout from "./components/layout";
import MapView from "./vehicle/MapView";
import Imp from "./tracking/import";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<List />} />
          <Route path="/vehicle/new-vehicle" element={<AddOrEdit />} />
          <Route path="/vehicle/details/:id" element={<View />} />
          <Route path="/vehicle/edit/:id" element={<AddOrEdit />} />
          <Route path="/vehicle/map/:id" element={<MapView />} />
          <Route path="/tracking/import/:id" element={<Imp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
