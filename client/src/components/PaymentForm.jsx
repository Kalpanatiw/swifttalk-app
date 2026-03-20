import React from 'react';
import { CreditCard, Loader } from 'lucide-react';

export function PaymentForm({ totalAmount, onSubmit, isLoading }) {
  const [cardDetails, setCardDetails] = React.useState({
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(cardDetails);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <CreditCard className="w-6 h-6 text-purple-600 mr-2" />
        <h3 className="text-lg font-bold">Payment Details</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <input
            type="text"
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            value={cardDetails.cardNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry
            </label>
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              maxLength="5"
              value={cardDetails.expiry}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVC
            </label>
            <input
              type="text"
              name="cvc"
              placeholder="123"
              maxLength="3"
              value={cardDetails.cvc}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Total Amount</span>
            <span className="text-2xl font-bold text-purple-600">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-md font-bold hover:shadow-lg transition disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader className="w-5 h-5 animate-spin mr-2" />
              Processing...
            </div>
          ) : (
            `Pay $${totalAmount.toFixed(2)}`
          )}
        </button>
      </form>

      <p className="text-xs text-gray-500 text-center mt-4">
        Your payment information is secure and encrypted
      </p>
    </div>
  );
}
