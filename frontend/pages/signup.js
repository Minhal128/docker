import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function Signup() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:5000/api/auth/direct-add-user', data);
      toast.success('Account created successfully!');
      router.push('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating account');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Create your account</h2>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
          <div>
            <input
              {...register('username', { required: 'Username is required' })}
              type="text"
              className="signup-input"
              placeholder="Username"
            />
            {errors.username && <p style={{ color: '#ff003c', fontSize: '0.9rem', margin: '0.2rem 0' }}>{errors.username.message}</p>}
          </div>
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
              className="signup-input"
              placeholder="Email address"
            />
            {errors.email && <p style={{ color: '#ff003c', fontSize: '0.9rem', margin: '0.2rem 0' }}>{errors.email.message}</p>}
          </div>
          <div>
            <input
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              type="password"
              className="signup-input"
              placeholder="Password"
            />
            {errors.password && <p style={{ color: '#ff003c', fontSize: '0.9rem', margin: '0.2rem 0' }}>{errors.password.message}</p>}
          </div>
          <button type="submit" className="signup-btn">Sign up</button>
        </form>
        <div style={{ textAlign: 'center' }}>
          <Link href="/login" className="signup-link">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
} 