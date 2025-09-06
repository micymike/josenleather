import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

interface CheckoutFormProps {
  onOrderPlaced: (orderRef: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onOrderPlaced }) => {
  const { cartItems, clearCart } = useCart();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestEmail: email,
          guestPhone: phone,
          guestAddress: address,
          items: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }),
      });
      if (!res.ok) throw new Error('Order failed');
      const data = await res.json();
      clearCart();
      onOrderPlaced(data.id || data.orderRef || 'ORDER');
    } catch (err: any) {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl p-6 shadow">
      <h2 className="text-xl font-bold mb-2">Guest Checkout</h2>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="tel"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={address}
          onChange={e => setAddress(e.target.value)}
          required
        />
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <button
        type="submit"
        className="w-full bg-amber-600 text-white py-2 rounded font-bold hover:bg-amber-700 transition"
        disabled={loading}
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </form>
  );
};

export default CheckoutForm;
