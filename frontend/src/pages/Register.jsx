import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import '../App.css';


const Register = () => {
  const [step, setStep] = useState(1); // 1: registration, 2: OTP verification
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, verifyOtp, resendOtp, googleLogin } = useAuth();
  const navigate = useNavigate();

  // Google Sign Up Handler
  const handleGoogleSignUp = useGoogleLogin({
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
      setError('Google sign up failed. Please try again.');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!name || !email || !password || !confirmPassword) {
        return setError('Please fill in all fields');
      }
      
      if (password !== confirmPassword) {
        return setError('Passwords do not match');
      }
      
      if (password.length < 6) {
        return setError('Password must be at least 6 characters');
      }
      
      setLoading(true);
      setError('');
      
      const result = await register(name, email, password);
      
      if (result.success) {
        setSuccess('OTP sent to your email. Please check your inbox.');
        setStep(2);
      } else {
        setError(result.message);
      }
    } else {
      if (!otp) {
        return setError('Please enter the OTP');
      }
      
      setLoading(true);
      setError('');
      
      const result = await verifyOtp(email, otp);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    }
    
    setLoading(false);
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    
    const result = await resendOtp(email);
    
    if (result.success) {
      setSuccess('OTP resent to your email.');
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
        <h2>{step === 1 ? 'Create Your Account' : 'Verify Your Email'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {step === 1 ? (
          <>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            
            <button type="submit" className="btn" disabled={loading}>{loading ? 'Creating Account...' : 'SignUp'}</button>
            {/* Google Sign Up Button */}
                <div className="text-center mt-2">
                  <button type="button" onClick={handleGoogleSignUp} className="btn btn-google" disabled={loading}>
                    <span className="google-icon">G</span>
                    Sign up with Google
                  </button>
                </div>
            <div className="text-center mt-2">
              <span className="text-sm">Already have an account?{' '}
                <Link to="/login" className="text-link">
                  Sign In
                </Link>
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the 6-digit code sent to your email" required />
            </div>
            
            <button type="submit" className="btn" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
            
            <div className="text-center mt-2">
              <span className="text-sm">Didn't receive the code?{' '}
                <button type="button" onClick={handleResendOtp} className="text-link" disabled={loading}>Resend OTP</button>
              </span>
            </div>
          </>
        )}
      </form>
          </div>
          <div className="col-6">
            <img src='right-column.png' alt='right-column'className='image'/>
        </div>
        </div>
    </div>
  );
};

export default Register;