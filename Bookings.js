import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import PaymentForm from './PaymentForm';
import './styles.css';


function Customer() {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    roomtype:"",
    checkinDate: "",
    checkoutDate: "",
    adults: "",
    children: "",
    extrabeds: false,
    totalPrice:'',
    gstPercentage:'',
    discountPercentage:'',
    nettotal:'', // Ensure nettotal field is initialized
    disclaimer: false,
  });
  const [checkboxError, setCheckboxError] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [priceDetails, setPriceDetails] = useState({
    basePricePerAdult: 800, // Define your base price for adults
    basePricePerChild: 500, // Define your base price for children
    gstPercentage: 0.18,
    discountPercentage: 0.1,
  });

  useEffect(() => {
    calculateTotalPrice();
  }, [formData, priceDetails]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (name === "checkinDate") {
      const checkinDate = new Date(value);
      const checkoutDate = new Date(checkinDate.getTime() + (24 * 60 * 60 * 1000)); // Add 24 hours
      setFormData({ ...formData, [name]: value, checkoutDate: checkoutDate.toISOString().split('T')[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const calculateTotalPrice = () => {
    const { basePricePerAdult, basePricePerChild, gstPercentage, discountPercentage } = priceDetails;
    const { adults, children } = formData;

    const adultsPrice = adults * basePricePerAdult;
    const childrenPrice = children * basePricePerChild;
    let totalPriceBeforeDiscount = adultsPrice + childrenPrice;

    totalPriceBeforeDiscount *= 1 - discountPercentage;

    const totalPriceAfterGST = totalPriceBeforeDiscount * (1 + gstPercentage);

    setTotalPrice(totalPriceAfterGST);
    
    // Calculate net total and update formData
    const netTotal = totalPriceAfterGST; // Assuming net total is same as total price
    setFormData(prevFormData => ({ ...prevFormData, nettotal: netTotal }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!formData.extrabeds) {
    //   setCheckboxError("Please select at least one addon (Closets or Extra beds)");
    //   return;
    // }

    const currentDate = new Date();
    const checkin = new Date(formData.checkinDate);
    const checkout = new Date(formData.checkoutDate);

    if (checkin > currentDate || checkout < currentDate) {
      setCheckboxError("Check-in and check-out dates should be present or greater than today's date");
      return;
    }

    if (!formData.checkinDate || !formData.checkoutDate) {
      setCheckboxError("Please enter both check-in and check-out dates");
      return;
    }

    if (checkout <= checkin) {
      setCheckboxError("Check-out date must be after check-in date");
      return;
    }

    try {
      await axios.post("http://localhost:8080/save", formData); // Send formData including nettotal
      setBookings([...bookings, formData]);
      setCheckboxError("");

      // Clear form data after successful submission
      setFormData({
        roomtype:"",
        checkinDate: "",
        checkoutDate: "",
        adults: "",
        children: "",
        extrabeds: false,
        totalPrice:'',
        gstPercentage:'',
        discountPercentage:'',
        nettotal:'', // Clear nettotal too
        disclaimer: false,
      });

      calculateTotalPrice(); // Recalculate total price after form reset

      alert(`Total Price: ₹${totalPrice.toFixed(2)} Net Total: ₹${totalPrice.toFixed(2)}`);

    } catch (error) {
      console.error("Error submitting booking:", error.message);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const updatedFormData = { ...formData, [name]: checked };
    setFormData(updatedFormData);
    calculateTotalPrice(updatedFormData);
    if (name === "extrabeds") {
      const updatedPriceDetails = {
        ...priceDetails,
        basePricePerAdult: checked ? 1000 : 800, // Adjust the base price per adult if extrabeds are selected
      };
      setPriceDetails(updatedPriceDetails);
    }
  };
  
  
  return (
   
    <div style={{ backgroundColor: "lightblue", height: "27.2cm",alignContent:'center' }}>
      <form onSubmit={handleSubmit} style={{ marginLeft: "17cm" }}>
      <h1>BOOK YOUR ROOMS</h1>
        <label htmlFor="roomtype">Room Type :</label>
        <select id="roomtype" name="roomtype" onChange={handleInputChange}>
          <option value="">SELECT ROOM TYPE</option>
          <option value="Premium Room">Premium Room</option>
          <option value="Luxury Suite">Luxury Suite</option>
          <option value="Deluxe Room">Deluxe Room</option>
          <option value="Family Room">Family Room</option>
        </select>

        <div>
          <label>Check-In Date:</label>
          <input type="date" name="checkinDate" value={formData.checkinDate} onChange={handleInputChange} min={new Date().toISOString().split('T')[0]} required />
        </div>
        <div>
          <label>Check-Out Date:</label>
          <input type="date" name="checkoutDate" value={formData.checkoutDate} onChange={handleInputChange} min={new Date().toISOString().split('T')[0]} required />
        </div>
        <div>
          <label>Adults:</label>
          <input type="number" name="adults" placeholder="Enter Adults" value={formData.adults} onChange={handleInputChange} max={2} />
          <div>Price per adult: ₹{priceDetails.basePricePerAdult.toFixed(2)}</div>
        </div>
        <div>
          <label>Children:</label>
          <input type="number" name="children" placeholder="Enter Children" value={formData.children} onChange={handleInputChange} max={2} />
          <div>Price per child: ₹{priceDetails.basePricePerChild.toFixed(2)}</div>
        </div>
        <div>
          <label>
            Addon's : <input type="checkbox" name="extrabeds" checked={formData.extrabeds} onChange={handleCheckboxChange} />Extra beds
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" name="disclaimer" checked={formData.disclaimer} onChange={handleInputChange} required />
            Disclaimer
          </label>
          {formData.disclaimer && (
            <div style={{ border: '1px solid black', padding: '5px', marginTop: '-1px' }}>
              <p>Your use of any information or materials on this website is entirely at your own risk,
                for which we shall not be liable. It shall be absolutely your own responsibility to ensure that any products,
                services or information available through this website meet your specific requirements.</p>
            </div>
          )}
        </div>
        {checkboxError && <div style={{ color: "red" }}>{checkboxError}</div>}
        <button type="submit">Pay Now</button>

        <Link to="/PaymentForm" style={{ textDecoration: 'none' }}>
          <button type="submit">Go To Booking History</button>
        </Link>
        <br></br>
        <Link to="/Pagination" style={{ textDecoration: 'none' }}>
          <button type="submit">Pagination</button>
        </Link>
        <br></br>

        <div style={{textAlign:'center'}}>Total Price: ₹{totalPrice.toFixed(2)}</div>
        <div style={{textAlign:'center'}}>GST: {priceDetails.gstPercentage * 100}%</div>
        <div style={{textAlign:'center'}}>Discount: {priceDetails.discountPercentage * 100}%</div>
        <div style={{textAlign:'center'}}>Net Total: ₹{totalPrice.toFixed(2)}</div>
      </form>
      <div>
      </div>
    </div>
  );
}

export default Customer;









