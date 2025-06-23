import { useEffect, useState } from "react";
import axios from "axios";
import url from "../../url";

const ManageCustomers = () => {
  const ownerToken = localStorage.getItem("ownerToken");
  const [customers, setCustomers] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null); // State to manage selected booking for popup
  const [showPopup, setShowPopup] = useState(false); // State to show/hide popup

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}owner/manage`, {
          headers: {
            Authorization: `Bearer ${ownerToken}`,
          },
        });
        setCustomers(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [ownerToken]);

  const handleRowClick = (customer) => {
    setSelectedBooking(customer);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Manage Customers
      </h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Property Title</th>
              <th className="py-3 px-6 text-left">Customer Name</th>
              <th className="py-3 px-6 text-left">Customer Email</th>
              <th className="py-3 px-6 text-right">Total Amount</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {customers.length > 0 ? (
              customers.map((customer, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50"
                  onClick={() => handleRowClick(customer)} // Trigger the popup on row click
                >
                  <td className="py-3 px-6 text-left">
                    {customer.propertyTitle}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {customer.customerName}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {customer.customerEmail}
                  </td>

                  <td className="py-3 px-6 text-right">
                    ${customer.totalAmount}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click event
                        handleRowClick(customer);
                      }}
                      className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Popup Modal with Blurred Background */}
      {showPopup && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurred backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-md"
            onClick={handleClosePopup}></div>

          {/* Modal content */}
          <div
            className="bg-white p-8 rounded-lg w-full max-w-2xl h-auto max-h-3/4 overflow-y-auto shadow-2xl relative z-10"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">
              Booking Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium mb-3">
                  Property Information
                </h3>
                <p className="mb-2">
                  <span className="font-semibold">Property Title:</span>{" "}
                  {selectedBooking.propertyTitle}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Total Amount:</span> $
                  {selectedBooking.totalAmount}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">
                  Customer Information
                </h3>
                <p className="mb-2">
                  <span className="font-semibold">Name:</span>{" "}
                  {selectedBooking.customerName}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Email:</span>{" "}
                  {selectedBooking.customerEmail}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Guest Details</h3>
              {selectedBooking.guests && selectedBooking.guests.length > 0 ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="divide-y divide-gray-200">
                    {selectedBooking.guests.map((guest, idx) => (
                      <li key={idx} className="py-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{guest.name}</span>
                          <span>Age: {guest.age}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No guests information available
                </p>
              )}
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={handleClosePopup}
                className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCustomers;
