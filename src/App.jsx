import { useState,useEffect } from 'react'
import './App.css'
import ImageUploader from './components/ImageUploader'
import ImageTable from './components/ImageTable'
import { baseUrl } from './helper/Helper'

function App() {
  const [count, setCount] = useState(0)


    const [images, setImages] = useState([]);
  
    useEffect(() => {
      fetchImages();
    }, []);
  
    const fetchImages = () => {
      fetch( baseUrl+'/getAllImage')
        .then((res) => res.json())
        .then((data) => setImages(data.images))
        .catch((err) => console.error('Error fetching images:', err));
    };


  return (
    <>
     <ImageUploader fetchImages={fetchImages}/>
     <ImageTable images={images} fetchImages={fetchImages}/>
    </>

    
  )
}

export default App
