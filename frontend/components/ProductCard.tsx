import Link from 'next/link';
import styles from '../styles/ProductCard.module.css';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    topOffer?: boolean;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className={styles.productCard}>
      <Link href={`/products/${product._id}`}>
        <div>
          <img src={`/images/${product._id}.jpg`} alt={product.name} className={styles.productImage} />
          <h2 className={styles.productName}>{product.name}</h2>
          <p className={styles.price}>${product.price}</p>
          {product.discount && (
            <p className={styles.discount}>{product.discount}% off</p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
