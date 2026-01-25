import React, { useState } from 'react';
import { useCreateContactMutation } from '../../features/contacts/contactsApi';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [createContact, { isLoading }] = useCreateContactMutation();
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createContact(form).unwrap();
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      alert(err?.data?.message || 'Failed to submit message');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-16 px-4">
      <h1 className="text-3xl font-bold uppercase text-center mb-8">Contact Us</h1>
      {submitted && (
        <div className="mb-6 bg-green-100 text-green-800 px-4 py-3">
          Your message has been sent. We will reach out soon.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone (optional)</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
            rows={6}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-3 uppercase font-bold tracking-widest hover:bg-gray-800 transition"
        >
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default Contact;
