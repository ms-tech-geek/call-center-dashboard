import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { useCallStore } from '../store/useCallStore';

export const DialPad: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDialing, setIsDialing] = useState(false);
  const [error, setError] = useState('');
  const addCall = useCallStore((state) => state.addCall);

  const formatPhoneNumber = (number: string): string => {
    // Remove all non-digit characters
    const cleaned = number.replace(/\D/g, '');
    // Add +91 prefix if not present and it's a 10-digit Indian number
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    // If number already has country code (12 digits starting with 91)
    else if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `+${cleaned}`;
    }
    return cleaned;
  };

  const validatePhoneNumber = (number: string): boolean => {
    const formatted = formatPhoneNumber(number);
    // Check if it's a valid E.164 format for Indian numbers (+91 followed by 10 digits)
    return /^\+91\d{10}$/.test(formatted);
  };

  const initiateCall = async () => {
    if (!phoneNumber || isDialing) return;

    const formattedNumber = formatPhoneNumber(phoneNumber);
    
    if (!validatePhoneNumber(formattedNumber)) {
      setError('Please enter a valid Indian phone number (10 digits)');
      return;
    }

    try {
      setIsDialing(true);
      setError('');
      
      const response = await fetch('http://localhost:3000/call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formattedNumber
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initiate call');
      }

      const data = await response.json();
      
      if (data.sid) {
        addCall({
          id: data.sid,
          status: 'ongoing',
          phoneNumber: formattedNumber,
          duration: 0,
          startTime: new Date(),
        });
      }
    } catch (error) {
      console.error('Error initiating call:', error);
      setError(error instanceof Error ? error.message : 'Failed to initiate call');
    } finally {
      setIsDialing(false);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits, spaces, dashes, parentheses, and plus
    const cleaned = value.replace(/[^\d\s\-()+"]/g, '');
    setPhoneNumber(cleaned);
    setError('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="space-y-4">
        <div>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="Enter phone number (e.g., 9876543210)"
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Enter a 10-digit Indian phone number
          </p>
        </div>
        
        <button
          onClick={initiateCall}
          disabled={isDialing || !phoneNumber}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-white ${
            isDialing || !phoneNumber
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          <Phone size={20} />
          <span>{isDialing ? 'Dialing...' : 'Call'}</span>
        </button>
      </div>
    </div>
  );
};