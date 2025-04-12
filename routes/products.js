const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const path = require('path');
const fs = require('fs');
const { validateProduct, Product } = require('../models/Product');
const multer = require('multer');

// 1. Configure uploads directory with absolute path
const uploadsDir = path.resolve(__dirname, '../../uploads');
console.log(`Uploads will be saved to: ${uploadsDir}`);

// 2. Ensure directory exists with proper permissions
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o777 });
    console.log('Successfully created uploads directory');
  } catch (err) {
    console.error('Failed to create uploads directory:', err);
    process.exit(1);
  }
}

// 3. Enhanced Multer configuration with debugging
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const ext = path.extname(originalName).toLowerCase();
    const baseName = path.basename(originalName, ext);
    const uniqueName = `${baseName}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

// 4. Comprehensive file validation
const fileFilter = (req, file, cb) => {
  const validMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  
  const fileExt = path.extname(file.originalname).toLowerCase();
  const isMimeValid = validMimeTypes.includes(file.mimetype);
  const isExtValid = validExtensions.includes(fileExt);

  console.log(`Validating file: ${file.originalname}`);
  console.log(`MIME type: ${file.mimetype}, Extension: ${fileExt}`);

  if (isMimeValid && isExtValid) {
    console.log('File accepted');
    cb(null, true);
  } else {
    console.log('File rejected - invalid type');
    cb(new Error(
      `Only image files are allowed (${validExtensions.join(', ')})`
    ), false);
  }
};

// 5. Configure Multer with error handling
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  },
  fileFilter: fileFilter
}).single('image'); // Explicitly use single() with field name

// 6. Custom middleware to handle upload errors
const handleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      
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
    // Validate product data
    const { error } = validateProduct(req.body);
    if (error) {
      // Clean up uploaded file if validation fails
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: error.details[0].message });
    }

    const product = new Product({
      name: req.body.name,
      productId: req.body.productId,
      quantity: req.body.quantity,
      price: req.body.price,
      description: req.body.description,
      imageUrl: `/uploads/${req.file.filename}`
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);

  } catch (err) {
    console.error('Product creation error:', err);
    
    // Clean up file if error occurs
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
    res.status(200).json(products);
  } catch (err) {
    console.error('Get products error:', err);
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

    res.status(200).json(product);
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

    // Handle image update
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

    res.status(200).json(updatedProduct);
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