import React from 'react';

export function SeatSelector({ seatLayout, selectedSeats, onSeatSelect }) {
  const isSeatSelected = (seatId) => {
    return selectedSeats.some(s => s.seatId === seatId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="text-center mb-6">
        <p className="text-gray-600 font-semibold">SCREEN THIS WAY</p>
        <div className="w-3/4 h-1 bg-gray-300 mx-auto mt-2 rounded"></div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {seatLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2 justify-center">
            <span className="w-6 text-center text-xs font-bold text-gray-500">
              {String.fromCharCode(65 + rowIndex)}
            </span>
            {row.map((seat, colIndex) => (
              <button
                key={seat.seatId}
                onClick={() => {
                  if (!seat.isBooked) {
                    onSeatSelect({
                      seatId: seat.seatId,
                      row: String.fromCharCode(65 + rowIndex),
                      col: colIndex + 1,
                      price: seat.price
                    });
                  }
                }}
                disabled={seat.isBooked}
                className={`
                  w-8 h-8 rounded text-xs font-bold transition
                  ${seat.isBooked 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : isSeatSelected(seat.seatId)
                    ? 'bg-purple-600 text-white'
                    : 'bg-blue-100 text-blue-900 hover:bg-purple-400'
                  }
                `}
              >
                {colIndex + 1}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-6 mt-8 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-600 rounded"></div>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
}
