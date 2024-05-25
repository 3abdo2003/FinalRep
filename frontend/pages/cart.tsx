/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import {
  getCartItems,
  placeOrder,
  getProductById,
  deleteCartItem,
  applyCoupon,
  updateCartItemQuantity,
} from '../services/api';

import styles from '../styles/Cart.module.css'; // Importing CSS module

type Product = {
  _id: string;
  name: string;
  price: number;
};

type CartItem = {
  _id: string;
  productId: string;
  product?: Product;
  quantity: number;
  purchaseOption?: 'rent';
  startDate?: Date;
  endDate?: Date;
  customization?: Record<string, unknown>;
};

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [couponCode, setCouponCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const getToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token not found');
    }
    return token;
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setIsLoading(true);
        const token = getToken();
        const response = await getCartItems(token);
        const items = response.items;

        const products = await Promise.all(items.map(item => getProductById(item.productId)));
        items.forEach((item, index) => {
          item.product = products[index];
        });

        setCartItems(items);
        calculateTotalPrice(items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setCartItems([]);
        setError('Error fetching cart items. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const calculateTotalPrice = (items: CartItem[]) => {
    const total = items.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
    setTotalPrice(total);
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token not found');
      }

      await placeOrder(cartItems, token);
      setCartItems([]);
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order.');
    }
  };

  const handleDeleteItem = async (productId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token not found');
      }

      await deleteCartItem(productId, token);
      const updatedCartItems = cartItems.filter((item) => item.productId !== productId);
      setCartItems(updatedCartItems);
      calculateTotalPrice(updatedCartItems);
      alert('Item deleted from the cart successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item from the cart.');
    }
  };

  const handleQuantityChange = async (item: CartItem, quantity: number) => {
    if (quantity < 1) return;
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token not found');
      }

      await updateCartItemQuantity(item.productId, quantity, token);
      const updatedCartItems = cartItems.map((cartItem) =>
        cartItem.productId === item.productId ? { ...cartItem, quantity } : cartItem
      );
      setCartItems(updatedCartItems);
      calculateTotalPrice(updatedCartItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleApplyCoupon = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token not found');
      }

      const discount = await applyCoupon(couponCode, token);
      const discountedTotal = totalPrice - discount;
      setTotalPrice(discountedTotal > 0 ? discountedTotal : 0);
      alert('Coupon applied successfully!');
    } catch (error) {
      console.error('Error applying coupon:', error);
      setError('Coupon is not valid anymore');
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <main className={styles.container}>
      <h1 className="text-3xl font-bold mb-6">Cart</h1>
      {error && <div className={styles.errorMessage}>{error}</div>}
      {cartItems && cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {cartItems.map((item) => (
            <div key={item._id} className={styles.cartItem}>
              <div className={styles.productBox}>
                {item.product && (
                  <img
                    src={`/images/${item.product._id}.jpg`}
                    alt={item.product.name}
                    className={styles.cartItemImage}
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold">{item.product.name}</h2>
                  <p>Quantity: <input type="number" value={item.quantity} onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))} className="border rounded px-2 py-1 w-16 ml-2" /></p>
                  <p>Price: ${item.product.price}</p>
                  {item.purchaseOption === 'rent' && (
                    <p>Rental Period: {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}</p>
                  )}
                  {item.customization && (
                    <p>
                      Customization:{' '}
                      {Object.entries(item.customization).map(([key, value]) => (
                        <span key={key} className="block">{key}: {value}</span>
                      ))}
                    </p>
                  )}
                  <button onClick={() => handleDeleteItem(item.productId)} className="bg-red-500 text-white px-4 py-2 rounded mt-4">Delete</button>
                </div>
              </div>
            </div>
          ))}
          <div className={styles.cartItem}>
            <h3 className="text-2xl font-bold">Total Price: ${totalPrice}</h3>
            <input type="text" placeholder="Enter coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="border rounded px-2 py-1 mt-2 w-64" />
            <button onClick={handleApplyCoupon} className="bg-green-500 text-white px-4 py-2 rounded mt-2 ml-2">Apply Coupon</button>
          </div>
          <button onClick={handlePlaceOrder} className={styles.placeOrderButton}>Place Order</button>
          </div>
      )}
    </main>
  );
};

export default Cart;
