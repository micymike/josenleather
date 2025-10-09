import React, { useEffect, useState } from "react";

type Feedback = {
  name?: string;
  email?: string;
  message?: string;
  [key: string]: any;
};

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/feedback")
      .then((res) => res.json())
      .then((data) => {
        setFeedbacks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading feedback...</div>;
  if (!feedbacks.length) return <div>No feedback available.</div>;

  return (
    <div>
      <h2>Feedback</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Email</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Message</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((fb, idx) => (
            <tr key={idx}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{fb.name || "-"}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{fb.email || "-"}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{fb.message || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackList;
