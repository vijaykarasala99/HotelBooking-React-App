import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Bookings from "./Bookings";
import PaymentForm from "./PaymentForm";
import Pagination from "./Pagination";
function App() {
  return (
   

    <Router>
      <Routes>
        <Route path="/" element={<Bookings />} />
        <Route path="/PaymentForm" element={<PaymentForm />} />
        <Route path="/Pagination" element={<Pagination />} />
      </Routes>
    </Router>

  );
}

export default App;
