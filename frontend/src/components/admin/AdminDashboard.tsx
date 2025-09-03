import { useState, useEffect } from 'react';
import { getAdmins, getProducts, getOrders, getBlogs } from '../../lib/api';

const AdminDashboard = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [stats, setStats] = useState([
    { title: 'Total Products', value: '0', icon: '📦', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
    { title: 'Pending Orders', value: '0', icon: '📋', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50' },
    { title: 'Total Revenue', value: '$0', icon: '💰', color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50' },
    { title: 'Blog Posts', value: '0', icon: '📝', color: 'from-amber-600 to-orange-600', bg: 'bg-amber-50' }
  ]);

  useEffect(() => {
    // Fetch dashboard stats from backend APIs
    const fetchStats = async () => {
      try {
        const products = await getProducts();
        // For orders, require admin token from localStorage
        let orders: any[] = [];
        const token = localStorage.getItem('adminToken');
        if (token) {
          orders = await getOrders(token);
        }
        const blogs = await getBlogs();
        setStats([
          { title: 'Total Products', value: products.length.toString(), icon: '📦', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
          { title: 'Pending Orders', value: orders.filter((o: any) => o.status === 'pending').length.toString(), icon: '📋', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50' },
          { title: 'Total Revenue', value: '$' + orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0).toLocaleString(), icon: '💰', color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50' },
          { title: 'Blog Posts', value: blogs.length.toString(), icon: '📝', color: 'from-amber-600 to-orange-600', bg: 'bg-amber-50' }
        ]);
      } catch (err) {
        // fallback to zeros
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-in slide-in-from-top duration-500">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className={`${stat.bg} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-in slide-in-from-bottom duration-500`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white text-xl shadow-lg`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">{stat.title}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg animate-in slide-in-from-left duration-500 delay-500">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📈</span>
              Recent Activity
            </h2>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-600 text-sm">System initialized successfully</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-600 text-sm">Admin panel ready for use</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg animate-in slide-in-from-right duration-500 delay-700">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🚀</span>
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowAddProduct(true)}
                className="p-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 text-sm font-medium"
              >
                Add Product
              </button>
              <button className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 text-sm font-medium">
                View Orders
              </button>
              <button className="p-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 text-sm font-medium">
                New Blog Post
              </button>
              <button className="p-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl hover:from-yellow-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 text-sm font-medium">
                Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
      
        {/* Add Product Form */}
        {showAddProduct && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 animate-in slide-in-from-top duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Add New Product</h3>
              <button 
                onClick={() => setShowAddProduct(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent h-32"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input 
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent" required>
                  <option value="">Select Category</option>
                  <option value="bags">Bags</option>
                  <option value="wallets">Wallets</option>
                  <option value="belts">Belts</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
              <div className="flex gap-4">
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 font-medium"
                >
                  Save Product
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
    </div>
  );
};

export default AdminDashboard;
