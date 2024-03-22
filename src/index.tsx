import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import VehicleList from "./vehicle/VehicleList";
import AddOrEdit from "./vehicle/AddOrEdit";
import ViewVehicle from "./vehicle/ViewVehicle";
import Layout from "./components/layout";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<VehicleList />} />
            <Route path="/vehicle/new-vehicle" element={<AddOrEdit />} />
            <Route path="/vehicle/details/:id" element={<ViewVehicle />} />
            <Route path="/vehicle/edit/:id" element={<AddOrEdit />} />
          </Route>
        </Routes>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();