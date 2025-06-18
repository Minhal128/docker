import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Sign in to your account</h2>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
          <div>
            <input
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              className="login-input"
              placeholder="Email address"
            />
            {errors.email && <p style={{ color: '#ff003c', fontSize: '0.9rem', margin: '0.2rem 0' }}>{errors.email.message}</p>}
          </div>
          <div>
            <input
              {...register('password', { required: 'Password is required' })}
              type="password"
              className="login-input"
              placeholder="Password"
            />
            {errors.password && <p style={{ color: '#ff003c', fontSize: '0.9rem', margin: '0.2rem 0' }}>{errors.password.message}</p>}
          </div>
          <button type="submit" className="login-btn">Sign in</button>
        </form>
        <div style={{ textAlign: 'center' }}>
          <Link href="/signup" className="login-link">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
} 