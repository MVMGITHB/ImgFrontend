import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import ImageUploader from "./components/ImageUploader";
import ImageTable from "./components/ImageTable";

import { baseUrl } from "./helper/Helper";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function Home() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    fetch(baseUrl + "/getAllImage")
      .then((res) => res.json())
      .then((data) => setImages(data.images))
      .catch((err) => console.error("Error fetching images:", err));
  };

  return (
    <>
      <ImageUploader fetchImages={fetchImages} />
      <ImageTable images={images} fetchImages={fetchImages} />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
