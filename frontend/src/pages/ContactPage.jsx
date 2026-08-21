import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { contactAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const ContactPage = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'How fast is FoodieXpress delivery?',
      a: 'We average 30 to 35 minutes for most deliveries! Every meal is prepared fresh in our kitchen and dispatched immediately with our nearest delivery hero.'
    },
    {
      q: 'What payment methods are supported?',
      a: 'We support Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), and major Credit & Debit Cards.'
    },
    {
      q: 'Is there a minimum order requirement?',
      a: 'There is no minimum order value! Plus, you get FREE delivery on all orders above ₹499.'
    },
    {
      q: 'Do you cater for corporate and party orders?',
      a: 'Yes, we accept large bulk party and corporate lunch/dinner orders. Contact our team using the form on this page or call our hotline directly.'
    }
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showToast('Please fill in all contact fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await contactAPI.sendMessage(formData);
      if (res.data.success) {
        showToast(res.data.message || 'Message sent successfully!', 'success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit message', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
          We're Here For You
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Get in Touch with FoodieXpress
        </h1>
        <p className="text-sm text-slate-500">
          Have questions about your order, feedback, or corporate inquiries? Drop us a note!
        </p>
      </div>

      {/* Main Grid: Info + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
              Direct Contact Details
            </h3>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Kitchen & Headquarters</h4>
                  <p className="mt-0.5 text-slate-500">124 Culinary Boulevard, Gourmet Square, Bengaluru - 560001</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Phone & WhatsApp Support</h4>
                  <p className="mt-0.5 text-slate-500">+91 98765 43210 / +91 91234 56789</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Email Assistance</h4>
                  <p className="mt-0.5 text-slate-500">support@foodiexpress.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Operating Hours</h4>
                  <p className="mt-0.5 text-slate-500">Monday to Sunday: 10:00 AM – 11:30 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick CSE Note Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
              <Sparkles className="w-4 h-4" /> CSE Student Project
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              FoodieXpress is developed as a complete full-stack MERN application demonstrating production MongoDB schema design, JWT authentication, and REST API standards.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Send Us a Message</h3>
              <p className="text-xs text-slate-500">We usually respond within 15 minutes during kitchen hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Alex Johnson"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@gmail.com"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Order Inquiry / Catering Request"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Your Message *
                </label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we assist you today?"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase">
            <HelpCircle className="w-4 h-4" /> Got Questions?
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-100 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-orange-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs text-slate-500 leading-relaxed bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
