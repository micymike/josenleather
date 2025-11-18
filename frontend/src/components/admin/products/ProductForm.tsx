import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PRODUCT_TYPES = [
  'Bag',
  'Belt',
  'Shoes',
  'Sandal',
  'Briefcase',
  'Purse',
  'Other'
];

const CLASSES = [
  'Hakuna Matata',
  'Mfalme',
  'Malkia',
  'Safari',
  'Binti Mfalme',
  'Ventura',
  'Expeditioner'
];

const SUB_CLASSES = [
  'Handbag',
  'Wallet',
  'Belt',
  'Tote bag',
  'Sling Bag',
  'Briefcase',
  'Crossbody bag',
  "Lady's Bag",
  'Sandals',
  'Travel Document',
  'Shirt',
  'Travel Bag'
];

const MATERIALS = [
  'Canvas',
  'Leather',
  'Cotton'
];

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    images: [] as File[],
    productType: '',
    class: '',
    subClass: '',
    material: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch product data if editing
  useEffect(() => {
    if (isEditMode) {
      (async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('adminToken');
          const api_url = import.meta.env.VITE_API_URL;
          const res = await fetch(`${api_url}/products/${id}`, {

            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) throw new Error('Failed to fetch product');
          const product = await res.json();
          setFormData({
            name: product.name || '',
            description: product.description || '',
            price: String(product.price ?? ''),
            stock: String(product.stock ?? ''),
            images: [], // Images not loaded for edit, handled separately
            productType: product.category || '',
            class: product.class || '',
            subClass: product.subClass || '',
            material: product.material || '',
          });
        } catch (err) {
          setError('Error loading product');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [isEditMode, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }
      const { name, description, price, stock, images, productType, class: prodClass, subClass, material } = formData;
      
      // Validate required fields
      if (!name || !description || !price || !stock) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }
      
      const form = new FormData();
      form.append('name', name.trim());
      form.append('description', description.trim());
      form.append('price', price);
      form.append('stock', stock);
      form.append('productType', productType);
      form.append('class', prodClass);
      form.append('subClass', subClass);
      form.append('material', material);
      
      // Only append images if present
      if (images && images.length > 0) {
        images.forEach((file) => {
          form.append('images', file);
        });
      }
      if (isEditMode) {
        // Update product
        const api_url = import.meta.env.VITE_API_URL;
        const res = await fetch(`${api_url}/products/${id}`, {
          method: 'PATCH',
          headers: { 
            "Authorization": `Bearer ${token}`
            // Don't set Content-Type for FormData - browser sets it automatically
          },
          body: form,
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to update product: ${errorText}`);
        }
        setSuccess('Product updated successfully!');
        setTimeout(() => navigate('/admin/products'), 1200);
      } else {
        // Import createProduct dynamically to avoid circular import issues
        const { createProduct } = await import('../../../lib/api');
        await createProduct(form, token);
        setSuccess('Product added successfully!');
        setFormData({
          name: '',
          description: '',
          price: '',
          stock: '',
          images: [],
          productType: '',
          class: '',
          subClass: '',
          material: ''
        });
        setTimeout(() => window.location.reload(), 1200);
      }
    } catch (err: any) {
      console.error('Product save error:', err);
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, images: Array.from(e.target.files) });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{isEditMode ? "Edit Product" : "Add Product"}</h1>
      {/* Spinner removed from above form */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-center justify-center">
          <span className="text-green-600 font-medium">{success}</span>
        </div>
      )}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-32"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
              {/* USD price display removed */}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
            <select
              value={formData.productType}
              onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select Product Type</option>
              {PRODUCT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <select
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select Class</option>
              {CLASSES.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sub Class</label>
            <select
              value={formData.subClass}
              onChange={(e) => setFormData({ ...formData, subClass: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select Sub Class</option>
              {SUB_CLASSES.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
            <select
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select Material</option>
              {MATERIALS.map((mat) => (
                <option key={mat} value={mat}>{mat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  <span>Uploading...</span>
                </>
              ) : (
                "Save Product"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
