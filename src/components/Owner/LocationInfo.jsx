const LocationInfo = ({ property }) => (
  <div className="bg-gray-50 rounded-lg p-6 mb-8 shadow-sm">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      Location Details
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <p className="text-sm text-gray-500">Address</p>
        <p className="font-medium">{property.location || "—"}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">City</p>
        <p className="font-medium">{property.city || "—"}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">State/Country</p>
        <p className="font-medium">{`${property.state || "—"}, ${
          property.country || "—"
        }`}</p>
      </div>
    </div>
    {/* Placeholder for a map - in real implementation you'd use Google Maps or similar */}
    <div className="mt-4 rounded-md bg-gray-200 h-48 flex items-center justify-center text-gray-500">
      Map preview would appear here
    </div>
  </div>
);

export default LocationInfo;
