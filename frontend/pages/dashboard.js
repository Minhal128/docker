import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import React from 'react';

const themeStyles = {
  background: 'linear-gradient(135deg, #1a1a1a 80%, #ff003c 100%)',
  minHeight: '100vh',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Segoe UI, Arial, sans-serif',
};

const checkboxPattern = {
  display: 'flex',
  gap: '1rem',
  margin: '2rem 0',
};

const customCheckbox = {
  width: '24px',
  height: '24px',
  accentColor: '#ff003c',
  background: '#222',
  border: '2px solid #ff003c',
  borderRadius: '6px',
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        toast.error('Error fetching profile');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="checkbox-group">
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" className="custom-checkbox" />
              <span style={{ marginLeft: '0.5rem' }}>Payload .exe</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" className="custom-checkbox" />
              <span style={{ marginLeft: '0.5rem' }}>Payload .dll</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" className="custom-checkbox" />
              <span style={{ marginLeft: '0.5rem' }}>Payload .bin</span>
            </label>
          </div>
          <div style={{ marginTop: '2rem' }}>
            <div className="dashboard-btn" style={{ opacity: 0.5, pointerEvents: 'none' }}>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="checkbox-group">
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" className="custom-checkbox" />
            <span style={{ marginLeft: '0.5rem' }}>Payload .exe</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" className="custom-checkbox" />
            <span style={{ marginLeft: '0.5rem' }}>Payload .dll</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" className="custom-checkbox" />
            <span style={{ marginLeft: '0.5rem' }}>Payload .bin</span>
          </label>
        </div>
        <div style={{ width: '100%' }}>
          <div style={{ margin: '2rem 0' }}>
            <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '1.2rem', marginBottom: '1rem' }}>User Profile</h3>
            <div style={{ background: '#18181b', borderRadius: '10px', padding: '1.2rem 1rem', color: '#f4f4f5' }}>
              <div style={{ marginBottom: '0.7rem' }}><b>Username:</b> {user.username}</div>
              <div style={{ marginBottom: '0.7rem' }}><b>Email:</b> {user.email}</div>
              <div><b>Status:</b> <span style={{ color: user.isActive ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{user.isActive ? 'Active' : 'Inactive'}</span></div>
            </div>
          </div>
        </div>
        <button className="dashboard-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
} 