import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import PaymentForm from './PaymentForm';

function Customer() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getall'); // Update the URL with your actual API endpoint
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <>
      <div style={{ backgroundColor: "light", minHeight: "100vh", padding: "20px"}}>
        <div style={{ maxWidth: "800px", margin: "5 auto" }}>
          <h2 style={{ backgroundColor: "lightblue",textAlign:'center'}}>Your Booking History</h2>
          {bookings.map(booking => (
            <div key={booking.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '10px' }}>
                  <label>Booking Id:</label>
                  <span>{booking.id}</span>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label>Room Type:</label>
                  <span>{booking.roomtype}</span>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label>Check-In Date:</label>
                  <span>{booking.checkinDate}</span>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label>Check-Out Date:</label>
                  <span>{booking.checkoutDate}</span>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label>Adults:</label>
                  <span>{booking.adults}</span>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label>Children:</label>
                  <span>{booking.children}</span>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label>Extra Beds:</label>
                  <span>{booking.extrabeds ? 'Yes' : 'No'}</span>
                </div>
               
               
                {/* 
                <div style={{ marginBottom: '10px' }}>
                  <label>Total Price:</label>
                  <span>{booking.totalprice}</span>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label>GST:</label>
                  <span>{booking.gst}</span>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label>Discount:</label>
                  <span>{booking.discount}</span>
                </div>
                */}


                <div style={{ marginBottom: '10px' }}>
                  <label>Net Total:</label>
                  <span>{booking.nettotal}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Customer;
