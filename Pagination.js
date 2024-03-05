import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Customer() {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Start from page 0
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 3; // Number of bookings per page
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchBookings(currentPage, pageSize)
      .then(data => {
        if (data) {
          setBookings(data.content);
          setTotalPages(data.totalPages);
          setError(null);
        } else {
          setError('No data received from server.');
        }
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
        setError('Failed to fetch data from server.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]); // Only fetch bookings when currentPage changes

  const fetchBookings = async (page, size) => {
    try {
      const response = await axios.get(`http://localhost:8080/users?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ backgroundColor: "lightblue", minHeight: "100vh", padding: "20px" }}>
      <h2 style={{ textAlign: 'center' }}>Your Booking History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
         {bookings.map(booking => (
  <div key={booking.id} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginBottom: '10px' }}>
    <h3>Booking ID: {booking.id}</h3>
    <p>Room Type: {booking.roomtype}</p>
    <p>Net Total: {booking.nettotal}</p>
  </div>
))}

        
          {/* Pagination controls */}
          <div style={{textAlign:'center'}}>
            {Array.from({ length: totalPages }, (_, i) => i).map(page => (
              <button key={page} onClick={() => handlePageChange(page)}>
                {page + 1} {/* Add 1 to page number to make it 1-based */}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Customer;
