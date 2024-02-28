import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Bookings from "./Bookings";
import PaymentForm from "./PaymentForm";
function App() {
  return (
   

    <Router>
      <Routes>
        <Route path="/" element={<Bookings />} />
        <Route path="/PaymentForm" element={<PaymentForm />} />
      </Routes>
    </Router>

  );
}

export default App;
