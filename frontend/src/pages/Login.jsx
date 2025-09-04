import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  // Google Login Handler
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      setLoading(true);
      setError('');
      
      const result = await googleLogin(response.access_token);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
      
      setLoading(false);
    },
    onError: () => {
      setError('Google login failed. Please try again.');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return setError('Please fill in all fields');
    }
    
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="container">
            <div className='row text-center mt-5'>
              <img src='top.png' alt='HD_logo' className='topLogo'/>
            </div>
            <div className='row'>
              <div className='auth-main col-6'>
                <form className="auth-form" onSubmit={handleSubmit}>
                  <h2>Login to Your Account</h2>
                  
                  {error && <div className="error-message">{error}</div>}
                  
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  
                  <button type="submit" className="btn" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
                  {/* Google Login Button */}
                  <div className="text-center mt-3">
                    <button type="button" onClick={handleGoogleLogin} className="btn btn-google" disabled={loading}>
                      <span className="google-icon">G</span>
                      Sign in with Google
                    </button>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-sm">Don't have an account?{' '}
                      <Link to="/register" className="text-link">Sign up</Link>
                    </span>
                  </div>
                </form>
              </div>
              <div className="col-6">
                <img src='right-column.png' alt='right-column'className='image'/>
              </div>
            </div>
        </div>
  );
};


export default Login;
