/* eslint-disable prettier/prettier */
// pages/orders.tsx
import { useEffect, useState } from 'react';
import { getOrders, getProductById } from '../services/api';
import styles from '../styles/Orders.module.css';

interface Order {
  _id: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  orderDate: string;
  totalAmount: number;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await getOrders(token);

        // Transform the response to match the Order interface
        const transformedOrders = await Promise.all(
          response.map(async (order: any) => {
            const items = await Promise.all(
              order.items.map(async (item: any) => {
                const product = await getProductById(item.productId);
                return {
                  productId: item.productId,
                  productName: product.name,
                  quantity: item.quantity,
                  price: product.price,
                };
              }),
            );

            return {
              _id: order._id,
              items,
              orderDate: new Date(order.createdAt).toISOString(),
              totalAmount: items.reduce(
                (sum: number, item: any) => sum + item.quantity * item.price,
                0,
              ),
            };
          }),
        );

        setOrders(transformedOrders);
        setError(null);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
        setError('Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <main className={`${styles.container} mx-auto p-4`}>
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {error ? (
        <p>{error}</p>
      ) : orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        <div className={`${styles.ordersList} flex flex-wrap justify-between`}>
          {orders.map((order) => (
            <div key={order._id} className={`${styles.orderCard} w-1/2 border p-4 rounded mb-4`}>
              <h2 className="text-xl font-bold">Order #{order._id}</h2>
              <p>
                Order Date: {new Date(order.orderDate).toLocaleDateString()}
              </p>
              <div className={`${styles.orderItem} border-t pt-2`}>
                {order.items.map((item) => (
                  <div key={item.productId} className="border-t pt-2">
                    <p>Product: {item.productName}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <h3 className="text-lg font-bold mt-2">Total Amount: ${order.totalAmount.toFixed(2)}</h3>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Orders;
