import React, { useState } from "react";
import SidebarNav from "./SidebarNav";

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "success" | "error" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    // Basic validation
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all fields.");
      setStatus("idle");
      return;
    }

    try {
      // Save feedback to backend via API
      const res = await fetch("http://localhost:3000/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          date: new Date().toISOString()
        })
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        setError("Failed to send feedback. Please try again later.");
      }
    } catch (err) {
      setStatus("error");
      setError("Failed to send feedback. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100">
      <SidebarNav />
      <section className="py-24 px-4 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="max-w-2xl w-full mx-auto text-center glass-card rounded-3xl shadow-2xl p-8">
          <h1 className="text-5xl font-black text-amber-900 mb-6">Contact Us</h1>
          <p className="text-lg mb-4">
            Email: <a href="mailto:info@josenleather.com" className="text-amber-700 underline">info@josenleather.com</a>
          </p>
          <div className="flex justify-center gap-8 mt-8 mb-8">
            <a href="https://instagram.com/josenleather" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-pink-600 hover:text-pink-800 text-4xl">
              <svg width="36" height="36" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.056 1.97.24 2.43.41.59.22 1.01.48 1.45.92.44.44.7.86.92 1.45.17.46.354 1.26.41 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.41 2.43-.22.59-.48 1.01-.92 1.45-.44.44-.86.7-1.45.92-.46.17-1.26.354-2.43.41-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.43-.41-.59-.22-1.01-.48-1.45-.92-.44-.44-.7-.86-.92-1.45-.17-.46-.354-1.26-.41-2.43C2.212 15.634 2.2 15.25 2.2 12s.012-3.584.07-4.85c.056-1.17.24-1.97.41-2.43.22-.59.48-1.01.92-1.45.44-.44.86-.7 1.45-.92.46-.17 1.26-.354 2.43-.41C8.416 2.212 8.8 2.2 12 2.2zm0-2.2C8.736 0 8.332.012 7.052.07 5.77.128 4.87.312 4.13.54c-.8.25-1.48.58-2.16 1.26-.68.68-1.01 1.36-1.26 2.16C.312 4.87.128 5.77.07 7.052.012 8.332 0 8.736 0 12c0 3.264.012 3.668.07 4.948.058 1.282.242 2.182.47 2.922.25.8.58 1.48 1.26 2.16.68.68 1.36 1.01 2.16 1.26.74.228 1.64.412 2.922.47C8.332 23.988 8.736 24 12 24s3.668-.012 4.948-.07c1.282-.058 2.182-.242 2.922-.47.8-.25 1.48-.58 2.16-1.26.68-.68 1.01-1.36 1.26-2.16.228-.74.412-1.64.47-2.922.058-1.28.07-1.684.07-4.948s-.012-3.668-.07-4.948c-.058-1.282-.242-2.182-.47-2.922-.25-.8-.58-1.48-1.26-2.16-.68-.68-1.36-1.01-2.16-1.26-.74-.228-1.64-.412-2.922-.47C15.668.012 15.264 0 12 0z"/><path d="M12 5.838A6.162 6.162 0 1 0 12 18.162 6.162 6.162 0 1 0 12 5.838zm0 10.162A4 4 0 1 1 12 8a4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
            </a>
            <a href="https://facebook.com/josenleather" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-blue-700 hover:text-blue-900 text-4xl">
              <svg width="36" height="36" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24H12.82v-9.294H9.692V11.01h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.696h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
            </a>
            <a href="https://wa.me/254703300795" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-green-600 hover:text-green-800 text-4xl">
              <svg width="36" height="36" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374A9.86 9.86 0 0 1 2.1 11.513C2.073 6.706 6.067 2.675 10.88 2.675c2.636 0 5.104 1.027 6.963 2.887a9.825 9.825 0 0 1 2.893 6.943c.016 5.807-3.978 9.838-8.685 9.838m8.413-18.252A11.815 11.815 0 0 0 10.88 0C4.885 0 .021 4.877 0 10.875c0 1.918.504 3.786 1.463 5.428L.057 23.925a1.003 1.003 0 0 0 1.225 1.225l7.617-2.004a11.822 11.822 0 0 0 5.417 1.378h.005c6 0 10.864-4.877 10.885-10.875a10.86 10.86 0 0 0-3.184-7.938"/></svg>
            </a>
          </div>
          <form className="mt-10 text-left" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-amber-900 font-semibold mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-amber-300/30 bg-white/70 focus:ring-2 focus:ring-amber-400 text-lg"
                required
                autoComplete="name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-amber-900 font-semibold mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-amber-300/30 bg-white/70 focus:ring-2 focus:ring-amber-400 text-lg"
                required
                autoComplete="email"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-amber-900 font-semibold mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-amber-300/30 bg-white/70 focus:ring-2 focus:ring-amber-400 text-lg min-h-[120px]"
                required
              />
            </div>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            {status === "success" && <div className="text-green-600 mb-4">Thank you for your feedback!</div>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl border-2 border-white/20"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending..." : "Send Feedback"}
            </button>
          </form>
        </div>
      </section>
      <style>{`
        .glass-card {
          backdrop-filter: blur(25px);
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.15) 0%, 
            rgba(255, 255, 255, 0.05) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
