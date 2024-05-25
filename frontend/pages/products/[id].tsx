/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { getProductById, addReview, addToCart, addToFavorites, getProductsByCategory, generateProductLink } from '../../services/api';

interface ProductProps {
  product: {
    _id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    originalPrice?: number;
    discount?: number;
    availability: boolean;
    specifications: { [key: string]: string };
    customizableOptions: { label: string; options: string[] }[];
    reviews: {
      user: string;
      rating: number;
      comment: string;
      createdAt: Date;
    }[];
    category: string;
  };
  relatedProducts: {
    _id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    originalPrice?: number;
    discount?: number;
    availability: boolean;
    specifications: { [key: string]: string };
    customizableOptions: { label: string; options: string[] }[];
    reviews: {
      user: string;
      rating: number;
      comment: string;
      createdAt: Date;
    }[];
  }[];
}

const Product: React.FC<ProductProps> = ({ product, relatedProducts }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [purchaseOption, setPurchaseOption] = useState<string>('buy');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [customizations, setCustomizations] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [favoritesMessage, setFavoritesMessage] = useState<string | null>(null);
  const [favoritesErrorMessage, setFavoritesErrorMessage] = useState<string | null>(null);
  const [productLink, setProductLink] = useState<string>('');

  useEffect(() => {
    const fetchProductLink = async () => {
      try {
        const link = await generateProductLink(product._id);
        setProductLink(link);
      } catch (error) {
        console.error('Error fetching product link:', error);
      }
    };

    fetchProductLink();
  }, [product._id]);

  const handleRatingSubmit = async () => {
    try {
      setErrorMessage(null); // Clear previous error
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token not found');
      }

      await addReview(product._id, rating, comment, token);
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.message === 'Token not found') {
        setErrorMessage('You need to login or signup to do that action.');
        setIsModalOpen(true);
      }
    }
  };

  const handleAddToCart = async () => {
    try {
      setErrorMessage(null); // Clear previous error
      setSuccessMessage(null); // Clear previous success message
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token not found');
      }

      const cartItem = {
        productId: product._id,
        quantity,
        purchaseOption,
        startDate: purchaseOption === 'rent' ? new Date(startDate) : undefined,
        endDate: purchaseOption === 'rent' ? new Date(endDate) : undefined,
        customization: customizations,
      };

      await addToCart(cartItem, token);
      setSuccessMessage('Added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.message === 'Token not found') {
        setErrorMessage('You need to login or signup to do that action.');
        setIsModalOpen(true);
      }
    }
  };

  const handleAddToFavorites = async (productId: string) => {
    try {
      setErrorMessage(null);
      setFavoritesMessage(null); // Clear previous success message
      setFavoritesErrorMessage(null); // Clear previous favorites error message
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token not found');
      }

      await addToFavorites(productId, token);
      setFavoritesMessage('Added to favorites successfully');
    } catch (error) {
      console.error('Error adding to favorites:', error);
      if (error.message === 'Token not found') {
        setErrorMessage('You need to login or signup to do that action.');
        setIsModalOpen(true);
      } else if (error.response && error.response.data && error.response.data.message) {
        // If the error response from the server contains a message, set it as the error message
        if (error.response.data.message === "Product is already added to favorites.") {
          setFavoritesErrorMessage("Already added in the favorites."); // Set the favorites error message
        } else {
          setErrorMessage(error.response.data.message);
          setIsModalOpen(true);
        }
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrorMessage(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(productLink).then(() => {
      alert('Product link copied to clipboard');
    });
  };

  return (
    <main className="flex flex-col items-center p-6 font-sans">
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <p>{errorMessage}</p>
            <button onClick={closeModal} className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-700">
              Close
            </button>
          </div>
        </div>
      )}
      <div className="text-center w-full max-w-4xl mb-8">
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
      </div>
      <div className="flex flex-col lg:flex-row justify-between w-full max-w-4xl mb-8">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full lg:w-1/2 mb-8 lg:mb-0">
          <img
            src={`/images/${product._id}.jpg`}
            alt={product.name}
            className="w-full h-auto max-w-md mx-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="w-full lg:w-1/2 lg:pl-6">
          <p className="text-3xl text-orange-500 mb-4">${product.price}</p>
          {product.discount && (
            <p className="text-xl text-red-500 mb-4">{product.discount}% off</p>
          )}
          <p className="text-xl mb-4">{product.description}</p>
          <div className="bg-gray-100 p-4 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Specifications</h2>
            <ul>
              {product.specifications && typeof product.specifications === 'object' ? (
                Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key} className="py-2 border-b border-gray-300">{key}: {value}</li>
                ))
              ) : (
                <li>No specifications available</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-between w-full max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full lg:w-1/2 mb-8 lg:mb-0">
          <h2 className="text-2xl font-semibold mb-4">Add to Cart</h2>
          <label className="block mb-4">
            Quantity:
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              className="mt-2 p-2 w-full border rounded-lg"
            />
          </label>
          <label className="block mb-4">
            Purchase Option:
            <select
              value={purchaseOption}
              onChange={(e) => setPurchaseOption(e.target.value)}
              className="mt-2 p-2 w-full border rounded-lg"
            >
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>
          </label>
          {purchaseOption === 'rent' && (
            <>
              <label className="block mb-4">
                Start Date:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-2 p-2 w-full border rounded-lg"
                />
              </label>
              <label className="block mb-4">
                End Date:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-2 p-2 w-full border rounded-lg"
                />
              </label>
            </>
          )}
          {product.customizableOptions && product.customizableOptions.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Customizations</h3>
              {product.customizableOptions.map((option) => (
                <label key={option.label} className="block mb-2">
                  {option.label}:
                  <select
                    onChange={(e) =>
                      setCustomizations((prev) => ({
                        ...prev,
                        [option.label]: e.target.value,
                      }))
                    }
                    className="mt-2 p-2 w-full border rounded-lg"
                  >
                    {option.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          )}
          <button 
            onClick={handleAddToCart} 
            className={`px-4 py-2 rounded ${product.availability ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}`} 
            disabled={!product.availability}
          >
            {product.availability ? 'Add to Cart' : 'Unavailable'}
          </button>
          {successMessage && <p className="text-green-500 mt-4 font-semibold">{successMessage}</p>}
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 w-full lg:w-1/2">
          <button
            onClick={() => handleAddToFavorites(product._id)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 w-full mb-4"
          >
            Add to Favorites
          </button>
          {favoritesMessage && <p className="text-green-500 font-semibold mb-4">{favoritesMessage}</p>}
          {favoritesErrorMessage && <p className="text-red-500 font-semibold mb-4">{favoritesErrorMessage}</p>}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
            {product.reviews.map((review, index) => (
              <div key={index} className="mb-6 pb-4 border-b border-gray-300">
                <p className="font-semibold">{review.user}: {Array.from({ length: review.rating }).map((_, i) => '⭐')} ({review.rating}/5)</p>
                <p>{review.comment}</p>
                <p className="text-gray-500 text-sm">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">Add a Review</h2>
              <input
                type="number"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                min="1"
                max="5"
                className="mb-4 p-2 w-full border rounded-lg"
              />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review here..."
                className="mb-4 p-2 w-full border rounded-lg"
              ></textarea>
              <button onClick={handleRatingSubmit} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center w-full max-w-4xl mb-8">
        <h2 className="text-2xl font-bold mb-4">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <Link key={relatedProduct._id} href={`/products/${relatedProduct._id}`}>
              <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center transition-transform transform hover:scale-105 cursor-pointer">
                <img
                  src={`/images/${relatedProduct._id}.jpg`}
                  alt={relatedProduct.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">{relatedProduct.name}</h3>
                <p className="text-gray-500 mb-2">{relatedProduct.description}</p>
                <p className="text-orange-500 text-xl">${relatedProduct.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="text-center w-full max-w-4xl mb-8">
        <h2 className="text-2xl font-bold mb-4">Share this Product</h2>
        <div className="bg-white p-4 rounded-lg shadow-lg flex items-center justify-center">
          <input
            type="text"
            value={productLink}
            readOnly
            className="p-2 border rounded-lg w-full max-w-md"
          />
          <button
            onClick={copyToClipboard}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 ml-4"
          >
            Copy Link
          </button>
        </div>
      </div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const product = await getProductById(id as string);
  const relatedProducts = await getProductsByCategory(product.category);
  return {
    props: {
      product,
      relatedProducts,
    },
  };
};

export default Product;
