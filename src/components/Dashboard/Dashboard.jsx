import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ fullName: '', role: '' });
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedUserData = localStorage.getItem('userData');
    
    if (!storedAccessToken || !storedUserData) {
      navigate('/'); // Redirect nếu chưa login
      return;
    }
    
    setAccessToken(storedAccessToken);
    setUserData(JSON.parse(storedUserData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  if (!userData.fullName) return <div>Đang tải...</div>;

  return (
    <div style={{ padding: '20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Dashboard - Chào mừng!</h2>
      <p><strong>Tên:</strong> {userData.fullName}</p>
      <p><strong>Quyền:</strong> {userData.role}</p>
      <p><strong>Access Token:</strong> {accessToken.substring(0, 20)}... (ẩn phần còn lại để bảo mật)</p>
      <button 
        onClick={handleLogout} 
        style={{ 
          padding: '10px 20px', 
          background: '#dc3545', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default Dashboard;