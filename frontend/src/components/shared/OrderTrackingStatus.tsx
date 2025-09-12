import React from "react";

export type OrderStatus = "Received" | "Processing" | "Shipped" | "Delivered";

interface OrderTrackingStatusProps {
  status?: OrderStatus;
}

const STATUS_STEPS: OrderStatus[] = [
  "Received",
  "Processing",
  "Shipped",
  "Delivered",
];

const OrderTrackingStatus: React.FC<OrderTrackingStatusProps> = ({
  status = "Received",
}) => {
  const currentStep = STATUS_STEPS.indexOf(status);

  return (
    <div className="flex flex-col items-center mt-6">
      <h4 className="text-lg font-bold mb-2 text-amber-900">Order Tracking</h4>
      <div className="flex gap-6 items-center">
        {STATUS_STEPS.map((step, idx) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                idx <= currentStep
                  ? "bg-amber-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {idx + 1}
            </div>
            <span
              className={`mt-2 text-xs font-medium ${
                idx <= currentStep
                  ? "text-amber-900"
                  : "text-gray-400"
              }`}
            >
              {step}
            </span>
            {idx < STATUS_STEPS.length - 1 && (
              <div
                className={`w-12 h-1 mt-4 ${
                  idx < currentStep
                    ? "bg-amber-600"
                    : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="mt-4 text-amber-800 text-sm">
        Your order is <span className="font-bold">{status}</span>.
      </p>
    </div>
  );
};

export default OrderTrackingStatus;
