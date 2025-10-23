import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.usernameOrEmail || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin');
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData);

      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      localStorage.setItem('userData', JSON.stringify({ fullName: result.fullName, role: result.role }));

      setSuccess('Đăng nhập thành công! Chào mừng ' + result.fullName);

      // Kiểm tra role và redirect
      setTimeout(() => {
        if (result.role === 'ROLE_USER') {
          navigate('/home');
        } else if (result.role === 'ROLE_ADMIN') {
          navigate('/dashboard');
        } else {
          setError('Role không hợp lệ');
        }
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Đăng nhập</h2>

        <div className={styles.inputGroup}>
          <label htmlFor="usernameOrEmail">Tên đăng nhập hoặc Email</label>
          <div className={styles.inputWrapper}>
            <FiUser className={styles.icon} />
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              className={styles.input}
              placeholder="admin"
              disabled={loading}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Mật khẩu</label>
          <div className={styles.inputWrapper}>
            <FiLock className={styles.icon} />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="Password1!"
              disabled={loading}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? <div className={styles.spinner}></div> : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;