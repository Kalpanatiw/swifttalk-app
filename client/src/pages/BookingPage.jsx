import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService, showService } from '../services/api';
import { SeatSelector } from '../components/SeatSelector';
import { PaymentForm } from '../components/PaymentForm';
import { useBooking } from '../hooks/useBooking';
import { Loader, ArrowLeft } from 'lucide-react';

export function BookingPage() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { addSeat, removeSeat, selectedSeats } = useBooking();
  const [show, setShow] = useState(null);
  const [seatLayout, setSeatLayout] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('seats');

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        const [showRes, seatsRes] = await Promise.all([
          showService.getShowById(showId),
          bookingService.getAvailableSeats(showId)
        ]);
        setShow(showRes.data);
        setSeatLayout(seatsRes.data.seatLayout);
      } catch (error) {
        console.error('Error fetching show:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShowData();
  }, [showId]);

  const handleSeatToggle = (seat) => {
    const isSelected = selectedSeats.some(s => s.seatId === seat.seatId);
    if (isSelected) {
      removeSeat(seat.seatId);
    } else {
      addSeat(seat);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const handlePaymentSubmit = async (cardDetails) => {
    if (selectedSeats.length === 0) {
      alert('Please select seats');
      return;
    }

    try {
      const bookingRes = await bookingService.createBooking({
        showId,
        seats: selectedSeats
      });

      if (bookingRes.data) {
        navigate(`/booking-confirmation/${bookingRes.data._id}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-purple-600 mb-6 hover:text-purple-800"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-3xl font-bold mb-2">
            {show?.movieId?.title}
          </h2>
          <p className="text-gray-600">
            {new Date(show?.showTime).toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6">Select Your Seats</h3>
              <SeatSelector 
                seatLayout={seatLayout}
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatToggle}
              />
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>
              
              <div className="mb-4 pb-4 border-b">
                {selectedSeats.length > 0 ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Selected Seats:</p>
                    <div className="bg-blue-50 p-2 rounded">
                      {selectedSeats.map(seat => (
                        <span key={seat.seatId} className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-2">
                          {seat.seatId}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No seats selected</p>
                )}
              </div>

              <div className="mb-4 pb-4 border-b">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Seats ({selectedSeats.length})</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Taxes</span>
                  <span>${(totalPrice * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="text-xl font-bold flex justify-between mb-6">
                <span>Total</span>
                <span>${(totalPrice * 1.1).toFixed(2)}</span>
              </div>

              {step === 'seats' && (
                <button
                  onClick={() => setStep('payment')}
                  disabled={selectedSeats.length === 0}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-md font-bold hover:shadow-lg transition disabled:opacity-50"
                >
                  Continue to Payment
                </button>
              )}
            </div>
          </div>
        </div>

        {step === 'payment' && (
          <div className="mt-6 max-w-6xl mx-auto">
            <div className="col-span-2">
              <PaymentForm 
                totalAmount={totalPrice * 1.1}
                onSubmit={handlePaymentSubmit}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
