import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { updateDocumentSeo } from '../utils/seoUtils';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface ContactPageProps {
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onShowToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback & Suggestions');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    updateDocumentSeo({
      title: 'Contact Us – WriteGenius Studio Support',
      description: 'Get in touch with the WriteGenius Studio team for feedback, bug reports, feature requests, or partnership inquiries.',
      canonicalPath: '/contact',
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      onShowToast('Please complete all required fields.', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      onShowToast('Thank you! Your inquiry has been sent.', 'success');
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6">
      <Breadcrumbs items={[{ label: 'Contact Support' }]} />

      <div className="space-y-2 border-b border-[#263653] pb-6">
        <h1 className="text-3xl font-extrabold text-[#F8FAFF] tracking-tight">
          Contact WriteGenius Studio
        </h1>
        <p className="text-sm text-[#AAB8D0] leading-relaxed">
          Have an idea for a new utility? Spotted an edge-case bug? We read every submission and respond within 24–48 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Support Info Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] space-y-3 shadow-xl">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#AAB8D0]">
              Support Inquiries
            </h3>
            <div className="flex items-center gap-2 text-xs text-[#F8FAFF]">
              <Mail className="w-4 h-4 text-[#4776FF]" />
              <span>support@writegenius.tools</span>
            </div>
            <p className="text-[11px] text-[#AAB8D0] leading-relaxed">
              For security disclosures, tool suggestions, and technical inquiries.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] space-y-2 shadow-xl">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#AAB8D0]">
              Response Time
            </h3>
            <p className="text-xs text-[#AAB8D0]">
              Monday through Friday, 9:00 AM – 6:00 PM EST. Average turnaround: 12 hours.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          {submitted ? (
            <div className="p-8 rounded-2xl bg-[#0D1424] border border-[#263653] text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-full bg-emerald-950/50 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-[#F8FAFF]">
                Message Received!
              </h2>
              <p className="text-xs text-[#AAB8D0] max-w-md mx-auto leading-relaxed">
                Thank you, {name}. Our team has received your message and will follow up at {email} shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="px-4 py-2 text-xs font-semibold text-[#4776FF] hover:underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-[#0D1424] border border-[#263653] space-y-4 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F8FAFF]">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full p-3 text-xs rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF] placeholder-[#AAB8D0]/50 focus:outline-none focus:ring-2 focus:ring-[#4776FF]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F8FAFF]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full p-3 text-xs rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF] placeholder-[#AAB8D0]/50 focus:outline-none focus:ring-2 focus:ring-[#4776FF]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F8FAFF]">Topic</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF] focus:outline-none focus:ring-2 focus:ring-[#4776FF]"
                >
                  <option value="Feedback & Suggestions" className="bg-[#0D1424] text-[#F8FAFF]">Feedback & Suggestions</option>
                  <option value="Bug Report" className="bg-[#0D1424] text-[#F8FAFF]">Bug Report</option>
                  <option value="Feature Request" className="bg-[#0D1424] text-[#F8FAFF]">Feature Request</option>
                  <option value="Enterprise / API Inquiries" className="bg-[#0D1424] text-[#F8FAFF]">Enterprise / API Inquiries</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F8FAFF]">Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  className="w-full p-3 text-xs rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF] placeholder-[#AAB8D0]/50 focus:outline-none focus:ring-2 focus:ring-[#4776FF]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 text-white font-semibold text-xs shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
