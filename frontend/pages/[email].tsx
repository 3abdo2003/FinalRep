// pages/profile/[email].tsx

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  addAddress,
  editAddressByIndex,
  deleteAddressByIndex,
  addCreditCard,
  editCreditCardByIndex,
  deleteCreditCardByIndex,
  editUserReviewByIndex,
} from '@/services/api'; // Adjust the import path based on your project structure

interface Review {
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  _id: string;
}

interface CreditCard {
  cardNumber: string;
  cardholderName: string;
  expirationDate: string;
  cvv: string;
}

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company: string;
  addresses: string[];
  password: string;
  Token: string;
  reviews: Review[];
  creditCards: CreditCard[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ProfileProps {
  user: UserProfile;
}

const ProfilePage: React.FC<ProfileProps> = ({ user }) => {
  const [updateData, setUpdateData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    company: user.company,
    addresses: user.addresses.join(', '),
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [newAddress, setNewAddress] = useState('');
  const [editAddressData, setEditAddressData] = useState({
    index: 0,
    newAddress: '',
  });
  const [deleteAddressIndex, setDeleteAddressIndex] = useState(0);
  const [creditCardData, setCreditCardData] = useState({
    cardNumber: '',
    cardholderName: '',
    expirationDate: '',
    cvv: '',
  });
  const [editCreditCardData, setEditCreditCardData] = useState({
    index: 0,
    cardNumber: '',
    cardholderName: '',
    expirationDate: '',
    cvv: '',
  });
  const [deleteCreditCardIndex, setDeleteCreditCardIndex] = useState(0);
  const [editReviewData, setEditReviewData] = useState({
    index: 0,
    rating: 0,
    comment: '',
  });
  const router = useRouter();
  const { email } = router.query;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddress(e.target.value);
  };

  const handleEditAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditAddressData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDeleteAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setDeleteAddressIndex(Number(e.target.value));
  };

  const handleCreditCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreditCardData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditCreditCardChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setEditCreditCardData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDeleteCreditCardChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setDeleteCreditCardIndex(Number(e.target.value));
  };

  const handleEditReviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditReviewData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form with data:', updateData);
    try {
      const response = await updateUserProfile(email as string, {
        ...updateData,
        addresses: updateData.addresses
          .split(',')
          .map((address) => address.trim()),
      });
      console.log('Update response:', response);
      if (response && response.addresses) {
        setUpdateData({
          firstName: response.firstName,
          lastName: response.lastName,
          phoneNumber: response.phoneNumber,
          company: response.company,
          addresses: response.addresses.join(', '),
        });
        router.reload();
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting password change with data:', passwordData);
    try {
      const response = await updateUserPassword(email as string, passwordData);
      console.log('Password update response:', response);
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (error) {
      console.error('Error updating password:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding new address:', newAddress);
    try {
      const response = await addAddress(email as string, newAddress);
      console.log('Address add response:', response);
      setNewAddress('');
      router.reload(); // Refresh the page to reflect the new address
    } catch (error) {
      console.error('Error adding address:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  const handleEditAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Editing address:', editAddressData);
    try {
      const response = await editAddressByIndex(
        email as string,
        editAddressData.index,
        editAddressData.newAddress,
      );
      console.log('Address edit response:', response);
      setEditAddressData({ index: 0, newAddress: '' });
      router.reload(); // Refresh the page to reflect the edited address
    } catch (error) {
      console.error('Error editing address:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  const handleDeleteAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Deleting address at index:', deleteAddressIndex);
    try {
      const response = await deleteAddressByIndex(
        email as string,
        deleteAddressIndex,
      );
      console.log('Address delete response:', response);
      setDeleteAddressIndex(0);
      router.reload(); // Refresh the page to reflect the deleted address
    } catch (error) {
      console.error('Error deleting address:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  const handleCreditCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding credit card with data:', creditCardData);
    try {
      const response = await addCreditCard(email as string, creditCardData);
      console.log('Credit card add response:', response);
      setCreditCardData({
        cardNumber: '',
        cardholderName: '',
        expirationDate: '',
        cvv: '',
      });
      router.reload(); // Refresh the page to reflect the new credit card
    } catch (error) {
      console.error('Error adding credit card:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  const handleEditCreditCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Editing credit card with data:', editCreditCardData);
    try {
      const response = await editCreditCardByIndex(
        email as string,
        editCreditCardData,
      );
      console.log('Credit card edit response:', response);
      setEditCreditCardData({
        index: 0,
        cardNumber: '',
        cardholderName: '',
        expirationDate: '',
        cvv: '',
      });
      router.reload(); // Refresh the page to reflect the edited credit card
    } catch (error) {
      console.error('Error editing credit card:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  const handleDeleteCreditCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Deleting credit card at index:', deleteCreditCardIndex);
    try {
      const response = await deleteCreditCardByIndex(
        email as string,
        deleteCreditCardIndex,
      );
      console.log('Credit card delete response:', response);
      setDeleteCreditCardIndex(0);
      router.reload(); // Refresh the page to reflect the deleted credit card
    } catch (error) {
      console.error('Error deleting credit card:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  const handleEditReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Editing review with data:', editReviewData);
    try {
      const response = await editUserReviewByIndex(
        email as string,
        editReviewData,
      );
      console.log('Review edit response:', response);
      setEditReviewData({ index: 0, rating: 0, comment: '' });
      router.reload(); // Refresh the page to reflect the edited review
    } catch (error) {
      console.error('Error editing review:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333' }}>
        Profile of {user.firstName} {user.lastName}
      </h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phoneNumber}</p>
      <p>Company: {user.company}</p>
      <h2>Addresses:</h2>
      <ul>
        {user.addresses.map((address, index) => (
          <li key={index}>
            {index}: {address}
          </li>
        ))}
      </ul>
      <h2>Credit Cards:</h2>
      <ul>
        {user.creditCards.map((card, index) => (
          <li key={index}>
            {index}:<p>Cardholder Name: {card.cardholderName}</p>
            <p>Card Number: {card.cardNumber}</p>
            <p>Expiration Date: {card.expirationDate}</p>
          </li>
        ))}
      </ul>
      <h2>Reviews:</h2>
      <ul>
        {user.reviews.map((review, index) => (
          <li key={review._id}>
            {index}:<p>Product ID: {review.productId}</p>
            <p>Rating: {review.rating}</p>
            <p>Comment: {review.comment}</p>
            <p>Created At: {new Date(review.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>

      <h2>Update Profile</h2>
      <form onSubmit={handleFormSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={updateData.firstName}
              onChange={handleInputChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={updateData.lastName}
              onChange={handleInputChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Phone Number:
            <input
              type="text"
              name="phoneNumber"
              value={updateData.phoneNumber}
              onChange={handleInputChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Company:
            <input
              type="text"
              name="company"
              value={updateData.company}
              onChange={handleInputChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Addresses:
            <input
              type="text"
              name="addresses"
              value={updateData.addresses}
              onChange={handleInputChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Update Profile
          </button>
        </div>
      </form>

      <h2>Add Address</h2>
      <form onSubmit={handleAddressSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            New Address:
            <input
              type="text"
              name="newAddress"
              value={newAddress}
              onChange={handleAddressChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#28A745',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Add Address
          </button>
        </div>
      </form>

      <h2>Edit Address</h2>
      <form onSubmit={handleEditAddressSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Address Index:
            <input
              type="number"
              name="index"
              value={editAddressData.index}
              onChange={handleEditAddressChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            New Address:
            <input
              type="text"
              name="newAddress"
              value={editAddressData.newAddress}
              onChange={handleEditAddressChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#FFC107',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Edit Address
          </button>
        </div>
      </form>

      <h2>Delete Address</h2>
      <form
        onSubmit={handleDeleteAddressSubmit}
        style={{ marginBottom: '20px' }}
      >
        <div style={{ marginBottom: '10px' }}>
          <label>
            Address Index:
            <input
              type="number"
              value={deleteAddressIndex}
              onChange={handleDeleteAddressChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#DC3545',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Delete Address
          </button>
        </div>
      </form>

      <h2>Add Credit Card</h2>
      <form onSubmit={handleCreditCardSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Card Number:
            <input
              type="text"
              name="cardNumber"
              value={creditCardData.cardNumber}
              onChange={handleCreditCardChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Cardholder Name:
            <input
              type="text"
              name="cardholderName"
              value={creditCardData.cardholderName}
              onChange={handleCreditCardChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Expiration Date:
            <input
              type="text"
              name="expirationDate"
              value={creditCardData.expirationDate}
              onChange={handleCreditCardChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            CVV:
            <input
              type="text"
              name="cvv"
              value={creditCardData.cvv}
              onChange={handleCreditCardChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#17A2B8',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Add Credit Card
          </button>
        </div>
      </form>

      <h2>Edit Credit Card</h2>
      <form
        onSubmit={handleEditCreditCardSubmit}
        style={{ marginBottom: '20px' }}
      >
        <div style={{ marginBottom: '10px' }}>
          <label>
            Credit Card Index:
            <input
              type="number"
              name="index"
              value={editCreditCardData.index}
              onChange={handleEditCreditCardChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Card Number:
            <input
              type="text"
              name="cardNumber"
              value={editCreditCardData.cardNumber}
              onChange={handleEditCreditCardChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Cardholder Name:
            <input
              type="text"
              name="cardholderName"
              value={editCreditCardData.cardholderName}
              onChange={handleEditCreditCardChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Expiration Date:
            <input
              type="text"
              name="expirationDate"
              value={editCreditCardData.expirationDate}
              onChange={handleEditCreditCardChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            CVV:
            <input
              type="text"
              name="cvv"
              value={editCreditCardData.cvv}
              onChange={handleEditCreditCardChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#FFC107',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Edit Credit Card
          </button>
        </div>
      </form>

      <h2>Delete Credit Card</h2>
      <form
        onSubmit={handleDeleteCreditCardSubmit}
        style={{ marginBottom: '20px' }}
      >
        <div style={{ marginBottom: '10px' }}>
          <label>
            Credit Card Index:
            <input
              type="number"
              value={deleteCreditCardIndex}
              onChange={handleDeleteCreditCardChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#DC3545',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Delete Credit Card
          </button>
        </div>
      </form>

      <h2>Edit Review</h2>
      <form onSubmit={handleEditReviewSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Review Index:
            <input
              type="number"
              name="index"
              value={editReviewData.index}
              onChange={handleEditReviewChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Rating:
            <input
              type="number"
              name="rating"
              value={editReviewData.rating}
              onChange={handleEditReviewChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Comment:
            <input
              type="text"
              name="comment"
              value={editReviewData.comment}
              onChange={handleEditReviewChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#FFC107',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Edit Review
          </button>
        </div>
      </form>

      <h2>Update Password</h2>
      <form onSubmit={handlePasswordSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Old Password:
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            New Password:
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#17A2B8',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { email } = context.params as { email: string };

  try {
    const user = await getUserProfile(email);
    return {
      props: {
        user,
      },
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return {
      notFound: true,
    };
  }
};

export default ProfilePage;
