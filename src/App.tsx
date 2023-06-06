import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "./App.css";
import Form from "./components/Form";
import Table from "./components/Table";




function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Table />} />
      <Route
          path="/form"
          element={
            <Form
              initialValues={{
                id: 0,
                Title: "",
                Body: "",
                Author: "",
                Views: 0,
                CreatedAt: 0,
              }}
              onClose={() => {}}
              onSubmit={() => {}}
              onDelete={() => {}}
            />
          }
        />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
