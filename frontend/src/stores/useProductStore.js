import { create } from 'zustand';
import toast from 'react-hot-toast';
import axios from '../lib/axios';

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  recommendations: [],
  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post('/products', productData);
      console.log('Product data', res.data);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.error || 'Something went wrong');
      set({ loading: false });
    }
  },
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('/products');
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch products', loading: false });
      toast.error(error?.response?.data?.error || 'Failed to fetch products');
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch products', loading: false });
      toast.error(error.response?.data?.error || 'Failed to fetch products');
    }
  },
  getRecommendations: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('/products/recommendations');
      set({ recommendations: response.data.products });
    } catch (error) {
      set({ error: 'Failed to fetch recommandations' });
      toast.error(
        error.response?.data?.error || 'Failed to fetch recommandations'
      );
    } finally {
      set({ loading: false });
    }
  },
  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.delete(`/products/${productId}`);
      set((prevState) => ({
        products: prevState.products.filter(
          (product) => product._id !== productId
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || 'Failed to delete product');
    }
  },
  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${productId}`);
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.product?.isFeatured }
            : product
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.error || 'Failed to update product');
    }
  },
}));
