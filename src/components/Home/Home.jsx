import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../../services/productService';
import { FiShoppingCart } from 'react-icons/fi';  // Icon tùy chọn cho sản phẩm
import './Home.module.css';  // Tạo file CSS module này

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Kiểm tra auth
    const token = localStorage.getItem('accessToken');
    const storedUserData = localStorage.getItem('userData');
    if (!token || !storedUserData) {
      navigate('/');
      return;
    }
    setUserData(JSON.parse(storedUserData));

    // Fetch sản phẩm
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getProducts();  // Có thể truyền params: { keyword: 'áo thun' }
      // Giả sử data.content là array sản phẩm (Spring pagination)
      setProducts(data.content || data);  // Điều chỉnh nếu response khác
    } catch (err) {
      setError(err.message);
      if (err.message.includes('hết hạn')) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Đang tải sản phẩm...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div className="home-container">
      <header className="header">
        <h1>Chào mừng đến với Trang Sản Phẩm, {userData?.fullName}!</h1>
        <button onClick={() => navigate('/')} className="logout-btn">Đăng xuất</button>
      </header>
      <div className="products-grid">
        {products.length === 0 ? (
          <p>Không có sản phẩm nào.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.images?.[0]?.image || 'https://via.placeholder.com/300x200?text=No+Image'} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="description">{product.description}</p>
                <p className="category">Danh mục: {product.categoryName}</p>
                <p className="price">Giá: {product.basePrice.toLocaleString('vi-VN')} VNĐ</p>
                <p className="stock">Tồn kho: {product.stock}</p>
                {product.isActive ? <span className="active">Hoạt động</span> : <span className="inactive">Không hoạt động</span>}
                <button className="add-to-cart">
                  <FiShoppingCart /> Thêm vào giỏ
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;