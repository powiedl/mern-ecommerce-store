import cloudinary from '../lib/cloudinary.js';
import { redis } from '../lib/redis.js';
import Product from '../models/product.model.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get('featured_products');
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }
    featuredProducts = await Product.find({ isFeatured: true }).lean(); // .lean() returns a plain javascript object instead of a mongodb document
    if (!featuredProducts)
      return res.status(404).json({ message: 'No featured products found' });
    // store in redis for future quick access

    await redis.set('featured_products', JSON.stringify(featuredProducts));
    res.json({ featuredProducts });
  } catch (error) {
    console.log('Error in getFeaturedProducts controller', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: 'products',
      });
    }
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : '',
      category,
    });
    res.status(201).json(product);
  } catch (error) {
    console.log('Error in createProduct controller', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.image) {
      const publicId = product.image.split('/').pop().split('.')[0]; // this will get the id of the image (it is the "base" filename of product.image)
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log(`deleted image 'products/${publicId}' from cloudinary`);
      } catch (error) {
        console.log(
          `Error in delete image 'products/${publicId}' from cloudinary in deleteProduct controller: ${error.message}`
        );
        throw error;
      }
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product deleted successfully' });
    }
  } catch (error) {
    console.log('Error in deleteProduct controller:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);
    res.json({ products });
  } catch (error) {
    console.log('Error in getRecommendedProducts controller:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    if (!products)
      return res
        .status(404)
        .json({ message: 'No products in this category found' });
    return res.json({ products: products.slice(0, 10) }); // return the first ten products
  } catch (error) {
    console.log('Error in getProductsByCategory controller:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();
    await updateFeaturedProductsCache();

    res.json({ product: updatedProduct });
  } catch (error) {
    console.log('Error in toggleFeaturedProduct controller:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set('featured_products', JSON.stringify(featuredProducts));
  } catch (error) {
    console.log('Error in updateFeaturedProductsCache:', error.message);
    throw error;
  }
}
