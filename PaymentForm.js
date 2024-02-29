import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import './Popup.css'; 

function Customer() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    roomtype: "",
    checkinDate: "",
    checkoutDate: "",
    adults: "",
    children: "",
    extrabeds: false,
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:8080/getall');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleUpdateButtonClick = (booking) => {
    setSelectedBooking(booking);
    setUpdateFormData({
      roomtype: booking.roomtype,
      checkinDate: booking.checkinDate,
      checkoutDate: booking.checkoutDate,
      adults: booking.adults,
      children: booking.children,
      extrabeds: booking.extrabeds,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateFormData(prevFormData => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/update/${selectedBooking.id}`, updateFormData);
      // Refresh the bookings list after update
      fetchBookings();
      alert(`Booking updated successfully!`);
      setSelectedBooking(null); // Close the popup
    } catch (error) {
      console.error("Error updating booking:", error.message);
    }
  };

  return (
    <div style={{ backgroundColor: "lightblue", minHeight: "100vh", padding: "20px" }}>
      <h2 style={{ textAlign: 'center' }}>Your Booking History</h2>
      {bookings.map(booking => (
        <div key={booking.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <div>
            <label>Booking Id:</label>
            <span>{booking.id}</span>
          </div>
          <div>
            <label>Room Type:</label>
            <span>{booking.roomtype}</span>
          </div>
          <div>
            <label>Check-In Date:</label>
            <span>{booking.checkinDate}</span>
          </div>
          <div>
            <label>Check-Out Date:</label>
            <span>{booking.checkoutDate}</span>
          </div>
          <div>
            <label>Adults:</label>
            <span>{booking.adults}</span>
          </div>
          <div>
            <label>Children:</label>
            <span>{booking.children}</span>
          </div>
          <div>
            <label>Extra Beds:</label>
            <span>{booking.extrabeds ? 'Yes' : 'No'}</span>
          </div>
          <button onClick={() => handleUpdateButtonClick(booking)}>Update</button>
        </div>
      ))}



{/* Popup form for updating booking */}
{selectedBooking && (
  <div className="popup-overlay">
    <div className="popup-content">
      <span className="popup-close" onClick={() => setSelectedBooking(null)}>&times;</span>
      <form onSubmit={handleSubmit}>
        <h2>Update Booking</h2>
        <label htmlFor="roomtype">Room Type:</label>
        <input type="text" name="roomtype" value={updateFormData.roomtype} onChange={handleInputChange} />
        <label htmlFor="checkinDate">Check-In Date:</label>
        <input type="date" name="checkinDate" value={updateFormData.checkinDate} onChange={handleInputChange} />
        <label htmlFor="checkoutDate">Check-Out Date:</label>
        <input type="date" name="checkoutDate" value={updateFormData.checkoutDate} onChange={handleInputChange} />
        <label htmlFor="adults">Adults:</label>
        <input type="number" name="adults" value={updateFormData.adults} onChange={handleInputChange} />
        <label htmlFor="children">Children:</label>
        <input type="number" name="children" value={updateFormData.children} onChange={handleInputChange} />
        <label>
          <input type="checkbox" name="extrabeds" checked={updateFormData.extrabeds} onChange={handleInputChange} />
          Extra Beds
        </label>
        <button type="submit">Update</button>
      </form>
    </div>
  </div>
)}
 </div>
  );
}

export default Customer;
