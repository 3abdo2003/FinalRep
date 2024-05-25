/* eslint-disable prettier/prettier */
import ProductCard from './ProductCard';
import styles from '../styles/ProductList.module.css'; // Import CSS module for styling

interface ProductListProps {
  products: {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    topOffer?: boolean;
  }[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div className={styles.productList}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
