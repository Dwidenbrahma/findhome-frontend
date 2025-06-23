const PropertyStats = ({ property }) => {
  const stats = [
    { label: "Bedrooms", value: property.bedrooms, icon: "🛏️" },
    { label: "Bathrooms", value: property.bathrooms, icon: "🚿" },
    { label: "Guests", value: property.guests, icon: "👥" },
    { label: "Type", value: property.type, icon: "🏠" },
  ];

  return (
    <div className="bg-indigo-50 rounded-lg p-4 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-md shadow-sm flex items-center">
            <span className="text-2xl mr-3">{stat.icon}</span>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="font-semibold">{stat.value || "—"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PropertyStats;
