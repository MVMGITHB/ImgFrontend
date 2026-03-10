import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { baseUrl } from "../helper/Helper";

const ImageTable = ({ images, fetchImages }) => {
  //   const [images, setImages] = useState([]);

  //   useEffect(() => {
  //     fetchImages();
  //   }, []);

  //   const fetchImages = () => {
  //     fetch('http://localhost:5010/getAllImage')
  //       .then((res) => res.json())
  //       .then((data) => setImages(data.images))
  //       .catch((err) => console.error('Error fetching images:', err));
  //   };

  const handleCopy = (url) => {
    navigator.clipboard
      .writeText(url)
      .then(() => alert("URL copied!"))
      .catch(() => alert("Failed to copy URL."));
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?",
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to delete images");
      return;
    }

    try {
      await axios.delete(`${baseUrl}/api/delete-image/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchImages(); // Refresh the image list
      toast.success("Image deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete image.");
    }
  };

  return (
    <div className="image-table-container">
      <h2>Uploaded Images</h2>
      <table className="image-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Copy URL</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {images.map((img) => {
            const fullUrl = `${baseUrl}${img.path}`;
            return (
              <tr key={img._id}>
                <td>
                  {img.filename.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                    <img
                      src={fullUrl}
                      alt={img.filename}
                      className="preview-image1"
                    />
                  ) : (
                    <a href={fullUrl} target="_blank" rel="noopener noreferrer">
                      {img.filename}
                    </a>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleCopy(fullUrl)}
                    className="copy-button"
                  >
                    Copy URL
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(img._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ImageTable;
