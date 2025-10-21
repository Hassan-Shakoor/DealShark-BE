import { useParams } from 'react-router-dom';

const BusinessProfile = () => {
  const { businessId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-6 sm:p-8">
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🏢</div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Business Profile - ID: {businessId}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 px-4">
              Business profile page with deals and contact information coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;
