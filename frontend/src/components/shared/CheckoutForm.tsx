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
  const [locating, setLocating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderReference, setOrderReference] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingPaymentUrl, setPendingPaymentUrl] = useState('');
  const [structuredAddress, setStructuredAddress] = useState<any>(null);
  const [paymentRequired, setPaymentRequired] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('Submitting order form...');

    // Remove success modal timeout logic for payment-required orders
    // (No success modal should be shown before payment)

    try {
      // Filter out items with invalid UUIDs (hardcoded IDs like "1", "2", etc.)
      const isValidUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      const validItems = cartItems.filter(item => isValidUUID(String(item.id)));

      if (validItems.length === 0) {
        setError('No valid items in cart. Please add products from the products page.');
        setLoading(false);
        return;
      }

      if (validItems.length < cartItems.length) {
        setError(`${cartItems.length - validItems.length} invalid items removed from cart. Proceeding with ${validItems.length} valid items.`);
      }

      console.log('Valid cart items:', validItems);
      validItems.forEach((item, index) => {
        console.log(`Item ${index}:`, {
          id: item.id,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        });
      });
      
      const cartTotal = validItems.reduce((sum, item) => {
        const itemTotal = (item.price || 0) * (item.quantity || 0);
        console.log(`Adding item total: ${itemTotal} (price: ${item.price}, qty: ${item.quantity})`);
        return sum + itemTotal;
      }, 0);
      
      console.log('Final cart total:', cartTotal);

      if (cartTotal <= 0) {
        setError('Cart total must be greater than zero. Please check that your cart items have valid prices.');
        setLoading(false);
        return;
      }

      // Only use cartTotal for order total
      const total = cartTotal;

      const orderPayload = {
        guestEmail: email,
        guestPhone: phone,
        guestAddress: address,
        items: validItems.map(item => ({
          productId: String(item.id),
          quantity: item.quantity,
          price: item.price,
        })),
        total
      };
      console.log('Order payload:', orderPayload);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res.text();
        console.error('Backend error response:', errorData);
        throw new Error(`Order failed: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      console.log('Order placed successfully:', data);

      // If payment is required before delivery, show payment modal
      if (data.paymentRequired) {
        setPaymentRequired(true);
        setLoading(false);
        setPendingPaymentUrl(data.paymentUrl || '');
        setShowPaymentModal(true);
        return;
      } else {
        setPaymentRequired(false);
      }

      // Tag user's device with their email for push notifications
      if (email) {
        (window as any).OneSignalDeferred = (window as any).OneSignalDeferred || [];
        (window as any).OneSignalDeferred.push(function(OneSignal: any) {
          OneSignal.sendTag("user_email", email);
        });
      }

      const orderRef = data.id || data.orderRef || 'ORDER';
      console.log('Setting order reference:', orderRef);
      setOrderReference(orderRef);
      console.log('Showing success modal...');
      setShowSuccessModal(true);
      setLoading(false);
    } catch (err: any) {
      console.error('Order submission failed:', err);
      setError('Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full mx-4 text-center animate-in zoom-in duration-300">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="text-2xl font-bold text-amber-700 mb-2">Payment Required</h3>
            <p className="text-gray-600 mb-4">
              To complete your order, please proceed to payment.
            </p>
            {pendingPaymentUrl ? (
              <div>
                <iframe
                  src={pendingPaymentUrl}
                  title="Payment"
                  width="260"
                  height="220"
                  style={{ display: 'block', margin: '0 auto 1rem auto', border: 'none', borderRadius: '12px' }}
                  allow="payment"
                />
                <button
                  onClick={() => window.open(pendingPaymentUrl, '_blank')}
                  className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                >
                  Open in new tab
                </button>
              </div>
            ) : (
              <button
                onClick={() => alert('Payment URL not available. Please contact support.')}
                className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                Contact Support
              </button>
            )}
            <button
              onClick={() => setShowPaymentModal(false)}
              className="mt-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center animate-in zoom-in duration-300">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-green-700 mb-2">Order Placed Successfully!</h3>
            <p className="text-gray-600 mb-4">
              Thank you for your order!<br/>
              Order Reference: <span className="font-bold text-green-800">#{orderReference}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              You will receive a confirmation email shortly with tracking details.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                if (orderReference) onOrderPlaced(orderReference);
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      
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
      <button
        type="button"
        className="mb-2 bg-blue-100 text-blue-800 px-3 py-1 rounded font-medium hover:bg-blue-200 transition"
        disabled={locating}
        onClick={async () => {
          setLocating(true);
          setError('');
          if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            setLocating(false);
            return;
          }
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              try {
                const { latitude, longitude } = pos.coords;
                // Use backend proxy for reverse geocoding to avoid CORS issues
                const url = `${import.meta.env.VITE_API_URL}/geocode/reverse?lat=${latitude}&lon=${longitude}`;
                const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
                const data = await res.json();
if (data && data.address) {
  setStructuredAddress(data.address);
  setAddress(
    [data.address.road, data.address.neighbourhood, data.address.suburb, data.address.village, data.address.town, data.address.city, data.address.state_district]
      .filter(Boolean)
      .join(', ')
  );
} else {
  setError('Could not determine address from location.');
}
              } catch (e) {
                setError('Failed to fetch address from location.');
              }
              setLocating(false);
            },
            (err) => {
              setError('Failed to get your location.');
              setLocating(false);
            }
          );
        }}
      >
        {locating ? 'Detecting location...' : 'Use my current location'}
      </button>
      {error && <div className="text-red-600">{error}</div>}
      <button
        type="submit"
        className="w-full bg-amber-600 text-white py-2 rounded font-bold hover:bg-amber-700 transition"
        disabled={loading}
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </form>
    </>
  );
};

export default CheckoutForm;
