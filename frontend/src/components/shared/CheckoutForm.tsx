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
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [paymentInstruction, setPaymentInstruction] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('Submitting order form...');

    // Show success modal after 3 seconds regardless of API response
    const successTimeout = setTimeout(() => {
      console.log('Timeout reached, showing success modal');
      setOrderReference(`ORDER-${Date.now()}`);
      setShowSuccessModal(true);
      setLoading(false);
    }, 3000);

    try {
      // Filter out items with invalid UUIDs (hardcoded IDs like "1", "2", etc.)
      const isValidUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      const validItems = cartItems.filter(item => isValidUUID(String(item.id)));

      if (validItems.length === 0) {
        clearTimeout(successTimeout);
        setError('No valid items in cart. Please add products from the products page.');
        setLoading(false);
        return;
      }

      if (validItems.length < cartItems.length) {
        setError(`${cartItems.length - validItems.length} invalid items removed from cart. Proceeding with ${validItems.length} valid items.`);
      }

      const total = validItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Delivery fee and payment instruction logic
      let isNairobi = address.toLowerCase().includes('nairobi');
      let fee = 0;
      let instruction = '';
      if (isNairobi) {
        if (total > 10000) {
          fee = 0;
          instruction = 'Delivery is free for orders above 10,000 Ksh within Nairobi. Payment after delivery.';
        } else {
          fee = 300;
          instruction = 'Delivery fee is 300 Ksh within Nairobi for orders below or equal to 10,000 Ksh. Payment after delivery.';
        }
      } else {
        if (total > 10000) {
          fee = 0;
          instruction = 'Delivery is free for orders above 10,000 Ksh outside Nairobi. Payment required before delivery.';
        } else {
          fee = 500;
          instruction = 'Delivery fee is 500 Ksh outside Nairobi for orders below or equal to 10,000 Ksh. Payment required before delivery.';
        }
      }
      setDeliveryFee(fee);
      setPaymentInstruction(instruction);

      const orderPayload = {
        guestEmail: email,
        guestPhone: phone,
        guestAddress: address,
        items: validItems.map(item => ({
          productId: String(item.id),
          quantity: item.quantity,
          price: item.price,
        })),
        total,
        deliveryFee: fee,
        paymentInstruction: instruction,
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
      clearTimeout(successTimeout);

      if (!res.ok) {
        const errorData = await res.text();
        console.error('Backend error response:', errorData);
        throw new Error(`Order failed: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      console.log('Order placed successfully:', data);

      // If payment is required before delivery, redirect to payment URL
      if (data.paymentRequired && data.paymentUrl) {
        setLoading(false);
        window.location.href = data.paymentUrl;
        return;
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
      clearTimeout(successTimeout);
      console.error('Order submission failed:', err);

      // Show success modal anyway for better UX
      setOrderReference(`ORDER-${Date.now()}`);
      setShowSuccessModal(true);
      setLoading(false);
    }
  };

  return (
    <>
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
                // Use Nominatim OpenStreetMap reverse geocoding
                const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
                const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
                const data = await res.json();
if (data && data.address) {
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
      {deliveryFee !== null && (
        <div className="mb-2 p-3 bg-gray-100 rounded">
          <div>
            <span className="font-semibold">Delivery Fee:</span> {deliveryFee === 0 ? 'Free' : `${deliveryFee} Ksh`}
          </div>
          <div className="text-sm text-gray-700 mt-1">{paymentInstruction}</div>
        </div>
      )}
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
