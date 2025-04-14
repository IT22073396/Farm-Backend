const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const path = require('path');
const fs = require('fs');
const { validateProduct, Product } = require('../models/Product');
const multer = require('multer');

// Configure uploads directory
const uploadsDir = path.resolve(__dirname, '../uploads');
console.log(`Uploads will be saved to: ${uploadsDir}`);

// Ensure directory exists
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o777 });
    console.log('Successfully created uploads directory');
  } catch (err) {
    console.error('Failed to create uploads directory:', err);
    process.exit(1);
  }
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    const uniqueName = `${baseName}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  
  const fileExt = path.extname(file.originalname).toLowerCase();
  if (validMimeTypes.includes(file.mimetype) && validExtensions.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error(`Only image files are allowed (${validExtensions.join(', ')})`), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
}).single('image');

const handleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large (max 5MB)' });
      }
      if (err.message.includes('Only image files')) {
        return res.status(415).json({ error: err.message });
      }
      return res.status(400).json({ error: 'File upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    next();
  });
};

// CREATE PRODUCT
router.post('/', handleUpload, async (req, res) => {
  try {
    const { error } = validateProduct(req.body);
    if (error) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: error.details[0].message });
    }

    const product = new Product({
      ...req.body,
      imageUrl: `/uploads/${req.file.filename}` // Consistent forward slash
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ 
      error: 'Failed to create product',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// GET ALL PRODUCTS
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    
    // Ensure consistent URL format
    const productsWithUrls = products.map(product => ({
      ...product._doc,
      imageUrl: product.imageUrl.replace(/\\/g, '/') // Force forward slashes
    }));
    
    res.status(200).json(productsWithUrls);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET SINGLE PRODUCT
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Ensure consistent URL format
    const productWithUrl = {
      ...product._doc,
      imageUrl: product.imageUrl.replace(/\\/g, '/')
    };

    res.status(200).json(productWithUrl);
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// UPDATE PRODUCT
router.put('/:id', handleUpload, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const { error } = validateProduct(req.body);
    if (error) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: error.details[0].message });
    }

    const updateData = { ...req.body };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
      
      // Delete old image
      const oldProduct = await Product.findById(req.params.id);
      if (oldProduct?.imageUrl) {
        const oldPath = path.join(uploadsDir, path.basename(oldProduct.imageUrl));
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({
      ...updatedProduct._doc,
      imageUrl: updatedProduct.imageUrl.replace(/\\/g, '/')
    });
  } catch (err) {
    console.error('Update product error:', err);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE PRODUCT
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete associated image
    if (product.imageUrl) {
      const imagePath = path.join(uploadsDir, path.basename(product.imageUrl));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;