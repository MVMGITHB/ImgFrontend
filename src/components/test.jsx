import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'

dotenv.config()

const app = express();
const PORT = process.env.PORT ||3000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Define Image schema
const imageSchema = new mongoose.Schema({
  filename: String,
  path: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const Image = mongoose.model('Image', imageSchema);

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'));
  }
};

const upload = multer({ storage, fileFilter });

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/uploads', express.static('uploads'));

// Image upload route
app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imagePath = `/uploads/${req.file.filename}`;

  // Save to database
  try {
    const newImage = new Image({
      filename: req.file.filename,
      path: imagePath,
    });
    await newImage.save();

    res.json({
      message: 'Image uploaded and saved to database successfully',
      data: newImage,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save image to database' });
  }
});

app.get("/getAllImage",async(req,res)=>{
    try {
        
      const images = await Image.find({});

      res.status(200).json({images})
    } catch (error) {
        res.status(500).json({
          message:"Internal server error",
          error
        })
    }
})


// delete image
app.delete('/api/delete-image/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find image by ID
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete file from filesystem
    const filePath = path.join(process.cwd(), 'uploads', image.filename);
    fs.unlink(filePath, async (err) => {
      if (err && err.code !== 'ENOENT') {
        return res.status(500).json({ error: 'Error deleting file from folder' });
      }

      // Remove from MongoDB
      await Image.findByIdAndDelete(id);

      res.json({ message: 'Image deleted successfully from database and folder' });
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
