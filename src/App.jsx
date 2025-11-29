import React from 'react';
import Layout from './components/Layout';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SlotBooking from './pages/SlotBooking';
import MyVisits from './pages/MyVisits';
import AdminDashboard from './pages/AdminDashboard';
import AdminHeatmap from './pages/AdminHeatmap';
import AdminGuardTeams from './pages/AdminGuardTeams';
import AdminLaneControl from './pages/AdminLaneControl';
import GuardDashboard from './pages/GuardDashboard';

import Landing from './pages/Landing';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/slot-booking" element={<SlotBooking />} />
          <Route path="/dashboard/my-visits" element={<MyVisits />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/heatmap" element={<AdminHeatmap />} />
          <Route path="/admin/guard" element={<AdminGuardTeams />} />
          <Route path="/admin/lane" element={<AdminLaneControl />} />
          <Route path="/guard/dashboard" element={<GuardDashboard />} />


          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="/dashboard.html" element={<Navigate to="/dashboard" replace />} />
          <Route path="/bookslot.html" element={<Navigate to="/dashboard/slot-booking" replace />} />
          <Route path="/bookingslot.html" element={<Navigate to="/dashboard/slot-booking" replace />} />
          <Route path="/myvisit.html" element={<Navigate to="/dashboard/my-visits" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
