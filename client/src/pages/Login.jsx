import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 items-center justify-center font-sans">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-96 border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Welcome Back</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Login to continue coding</p>
        
        {error && <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input 
            type="text" 
            placeholder="Username" 
            required
            className="p-3 bg-gray-900 text-white rounded-lg outline-none border border-gray-700 focus:border-blue-500 transition-colors"
            value={username} 
            onChange={e => setUsername(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            required
            className="p-3 bg-gray-900 text-white rounded-lg outline-none border border-gray-700 focus:border-blue-500 transition-colors"
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-2 shadow-lg shadow-blue-600/30">
            Login
          </button>
        </form>
        
        <p className="text-gray-400 mt-6 text-center text-sm">
          Don't have an account? <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
