// Products.tsx
/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Navbar from '../../components/Navbar';
import ProductList from '../../components/ProductList';
import { getProducts, getProductsByCategory } from '../../services/api';
import styles from '../../styles/Products.module.css'; // Import CSS module for styling

interface ProductsPageProps {
  products: {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    topOffer?: boolean;
    category: string;
  }[];
}

const Products: React.FC<ProductsPageProps> = ({ products: initialProducts }) => {
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchFilteredProducts = async () => {
        try {
          if (category) {
            const filteredProducts = await getProductsByCategory(category);
            setFilteredProducts(filteredProducts);
          } else {
            setFilteredProducts(initialProducts);
          }
        } catch (error) {
          console.error('Error fetching filtered products:', error);
        }
      };
      
    fetchFilteredProducts();
  }, [category]);

  return (
    <>
      <main className={`${styles.main} container mx-auto p-4`}>
        <h1 className={`${styles.title} text-2xl font-bold mb-4`}>All Products</h1>
        <div className={`${styles.filterContainer} flex justify-between items-center mb-4`}>
          <label htmlFor="category" className={`${styles.label} text-sm font-bold`}>Choose Category:</label>
          <select 
            id="category" 
            onChange={(e) => setCategory(e.target.value)} 
            value={category} 
            className={`${styles.select} border border-gray-300 rounded px-3 py-2`}
          >
            <option value="">All Categories</option>
            <option value="Standard Plastic Pallets">Standard Plastic Pallets</option>
            <option value="Heavy-Duty Plastic Pallets">Heavy-Duty Plastic Pallets</option>
            <option value="Hygienic Plastic Pallets">Hygienic Plastic Pallets</option>
            <option value="Nestable Plastic Pallets">Nestable Plastic Pallets</option>
          </select>
        </div>
        <ProductList products={filteredProducts} />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const products = await getProducts();
  return {
    props: {
      products,
    },
  };
};

export default Products;