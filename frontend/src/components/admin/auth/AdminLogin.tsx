import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react';
import { login } from '../../../lib/api';

/* Add BankGothic Lt BT font */
const fontStyle = `
  @font-face {
    font-family: 'BankGothic Lt BT';
    src: local('BankGothic Lt BT'), url('/fonts/BankGothicLtBT.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
  }
`;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(formData.email, formData.password);
      if (data.access_token) {
        localStorage.setItem('adminToken', data.access_token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        navigate('/admin');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Inject font style */}
      <style>{fontStyle}</style>
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-900">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-orange-400/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-yellow-400/10 rounded-full blur-lg animate-pulse delay-500"></div>
        
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-800/10 to-orange-700/20"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col md:flex-row items-stretch">
        {/* Left: Enhanced Logo Section */}
        <div className="md:w-1/2 w-full flex items-center justify-center relative">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-md"></div>
            <div className="relative z-10 flex flex-col items-center p-8 text-center">
              {/* Decorative elements around logo */}
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-4 h-4 bg-amber-400 rounded-full animate-bounce delay-100"></div>
                <div className="absolute -top-4 -right-8 w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-300"></div>
                <div className="absolute -bottom-6 -left-6 w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-500"></div>
                
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                  <img
                    src="/login_admin.png"
                    alt="Admin Logo"
                    className="relative max-w-xs w-full h-auto object-contain drop-shadow-2xl transform group-hover:scale-105 transition-all duration-500"
                  />
                </div>
              </div>
              {/* Removed duplicate branding text next to logo */}
              <div className="mt-8 space-y-2">
                <div className="flex items-center justify-center gap-2 text-amber-200">
                  <Sparkles size={16} className="animate-pulse" />
                  <span className="text-sm font-medium">Premium Admin Experience</span>
                  <Sparkles size={16} className="animate-pulse delay-500" />
                </div>
              </div>
            </div>
        </div>

        {/* Right: Enhanced Login Form */}
        <div className="md:w-1/2 w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
          
          <div className="relative z-10 max-w-md w-full space-y-8">
            {/* Header with enhanced typography */}
            <div className="text-center space-y-4">
              <div className="relative">
                <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-200 to-yellow-200 mb-2 animate-in slide-in-from-top duration-700 delay-300">
                  Admin Portal
                </h2>
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 to-orange-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="relative">
                <p className="text-lg text-amber-200 font-medium animate-in slide-in-from-top duration-700 delay-400" style={{ fontFamily: "'BankGothic Lt BT', Arial, sans-serif", letterSpacing: '2px', textTransform: 'uppercase' }}>
                  JOSEN NAIROBI Management
                </p>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-in slide-in-from-bottom duration-700 delay-600"></div>
              </div>
            </div>

            {/* Enhanced Form Container */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/30 to-orange-400/30 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 animate-in slide-in-from-bottom duration-700 delay-500">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Enhanced Email Input */}
                    <div className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur"></div>
                      <div className="relative flex items-center">
                        <Mail 
                          size={20} 
                          className={`absolute left-4 z-10 transition-all duration-300 ${
                            focusedField === 'email' ? 'text-amber-400' : 'text-white/60'
                          }`} 
                        />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField('')}
                          className="w-full pl-12 pr-4 py-4 bg-white/15 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    {/* Enhanced Password Input */}
                    <div className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur"></div>
                      <div className="relative flex items-center">
                        <Lock 
                          size={20} 
                          className={`absolute left-4 z-10 transition-all duration-300 ${
                            focusedField === 'password' ? 'text-amber-400' : 'text-white/60'
                          }`} 
                        />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField('')}
                          className="w-full pl-12 pr-12 py-4 bg-white/15 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 text-white/60 hover:text-amber-400 focus:outline-none transition-all duration-300 transform hover:scale-110"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Error Display */}
                  {error && (
                    <div className="relative group">
                      <div className="absolute inset-0 bg-red-500/30 rounded-xl blur opacity-50"></div>
                      <div className="relative bg-red-500/20 border border-red-400/40 text-red-200 px-6 py-4 rounded-xl text-sm font-medium animate-in slide-in-from-top duration-300 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                          {error}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-700 to-amber-600 rounded-xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative py-4 px-6 font-bold text-white transition-all duration-300 transform group-hover:scale-105 group-disabled:scale-100">
                      {loading ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="relative">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          </div>
                          <span>Authenticating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>Sign into Portal</span>
                          <div className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      )}
                    </div>
                  </button>
                </form>
              </div>
            </div>

            {/* Enhanced Footer */}
            <div className="text-center animate-in fade-in duration-700 delay-1000">
              <p className="text-amber-200/70 text-sm font-medium">
                Secure • Authenticated • Professional
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
