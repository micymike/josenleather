import React from "react";
import FeedbackList from "./FeedbackList";

const FeedbackPage: React.FC = () => (
  <div className="max-w-4xl mx-auto p-8">
    <h1 className="text-3xl font-bold mb-6 text-amber-900">User Feedback</h1>
    <FeedbackList />
  </div>
);

export default FeedbackPage;
