import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Product {
  id: string | number;
  name: string;
  price: number;
  imageUrls: string[];
  description: string;
  category: string;
  rating?: number;
}

const PRODUCTS_CACHE_KEY = "products_cache";
const PRODUCTS_CACHE_TTL = 60 * 60 * 1000; // 1 hour

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Check cache first
        const cache = localStorage.getItem(PRODUCTS_CACHE_KEY);
        if (cache) {
          const { data, timestamp } = JSON.parse(cache);
          if (Array.isArray(data) && Date.now() - timestamp < PRODUCTS_CACHE_TTL) {
            setProducts(data);
            setLoading(false);
            return;
          }
        }

        // Fetch from Supabase
        const { data, error } = await supabase
          .from('product')
          .select('*');
        
        if (error) throw error;
        
        const products = data?.map(product => ({
          ...product,
          rating: product.rating || 4.5
        })) || [];
        
        setProducts(products);
        
        // Cache the data
        localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify({ 
          data: products, 
          timestamp: Date.now() 
        }));
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const refreshProducts = async () => {
    localStorage.removeItem(PRODUCTS_CACHE_KEY);
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('product')
        .select('*');
      
      if (error) throw error;
      
      const products = data?.map(product => ({
        ...product,
        rating: product.rating || 4.5
      })) || [];
      
      setProducts(products);
      localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify({ 
        data: products, 
        timestamp: Date.now() 
      }));
    } catch (err) {
      setError('Failed to refresh products');
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refreshProducts };
};