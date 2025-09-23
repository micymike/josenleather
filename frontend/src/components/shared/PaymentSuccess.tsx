import React, { useEffect, useState } from "react";

interface PaymentSuccessProps {}

const PaymentSuccess: React.FC<PaymentSuccessProps> = () => {
  const [orderReference, setOrderReference] = useState<string | null>(null);

  useEffect(() => {
    // Try to get orderRef from query params
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("orderRef") || params.get("id") || params.get("order_id");
    setOrderReference(ref);
    // Optionally, fetch more order details from backend here if needed
  }, []);

  return (
    <div>
      {orderReference && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center animate-in zoom-in duration-300">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-green-700 mb-2">Order Placed Successfully!</h3>
            <p className="text-gray-600 mb-4">
              Thank you for your payment and order!<br />
              Order Reference: <span className="font-bold text-green-800">#{orderReference}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              You will receive a confirmation email shortly with tracking details.
            </p>
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
      {!orderReference && (
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white rounded-xl p-8 shadow text-center">
            <h3 className="text-xl font-bold text-red-700 mb-2">Order Reference Not Found</h3>
            <p className="text-gray-600 mb-4">
              We could not find your order reference. Please check your payment provider or contact support.
            </p>
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
