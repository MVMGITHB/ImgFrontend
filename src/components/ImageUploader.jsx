import React, { useState } from "react";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "../helper/Helper";
import { useNavigate } from "react-router-dom";

const ImageUploader = ({ fetchImages }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file");

    const formData = new FormData();
    formData.append("image", selectedFile);

    const token = localStorage.getItem("token");

    console.log("Token:", token); // Debugging line
    if (!token) {
      toast.error("You must be logged in to upload images");
      return;
    }

    try {
      const res = await axios.post(baseUrl + "/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const fullUrl = `${baseUrl}${res.data.data.path}`;
      setUploadedUrl(fullUrl);
      fetchImages();
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed!");
    }
  };

  const handleCopy = () => {
    if (uploadedUrl) {
      navigator.clipboard.writeText(uploadedUrl);
      toast.success("Image url copy successfully");
    }
  };

  return (
    <div className="uploader-container">
      {/* <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h2 className="uploader-title">Upload Image</h2>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div> */}
      <div>
        <h2 className="uploader-title">Upload Image </h2>

        <label className="file-input-label">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="file-input"
          />
          Choose File
        </label>

        <button className="upload-btn" onClick={handleUpload}>
          Upload
        </button>

        <div className="image-container-preview">
          {preview && (
            <div className="preview-box">
              <h4>Preview:</h4>
              <img src={preview} alt="preview" className="preview-image" />
            </div>
          )}

          {uploadedUrl && (
            <div className="url-box">
              <h4>Uploaded File URL:</h4>
              <input
                type="text"
                value={uploadedUrl}
                readOnly
                className="url-input"
              />
              <button className="copy-btn" onClick={handleCopy}>
                Copy URL
              </button>
            </div>
          )}
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default ImageUploader;
