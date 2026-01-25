import React from 'react';
import { useGetContactsQuery } from '../../features/contacts/contactsApi';

const ContactList = () => {
  const { data: contacts, isLoading } = useGetContactsQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Contact Queries</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Message</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contacts.map((c) => (
              <tr key={c.id}>
                <td className="px-6 py-4 text-sm font-medium">{c.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{c.email}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{c.phone || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{c.subject}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{c.message}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(c.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No messages.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactList;
