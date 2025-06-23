const LoadingBooking = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading booking details...</p>
      </div>
    </div>
  );
};

export default LoadingBooking;
