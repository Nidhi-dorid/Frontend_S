import React from 'react';
import { User, MapPin, Camera, Server, Clock, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "1. Citizen Registration & Login",
      description: "Users create an account and log in to the SCRS platform to start reporting municipal issues.",
      icon: <User className="text-white" size={24} />,
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "2. Drop a Pin on the Map",
      description: "Navigate to 'New Report' and drop a pin precisely where the pothole or issue is located.",
      icon: <MapPin className="text-white" size={24} />,
      color: "bg-brand-orange"
    },
    {
      id: 3,
      title: "3. Upload Image & Details",
      description: "Upload a clear photo of the issue and provide a short description. This helps authorities understand the severity.",
      icon: <Camera className="text-white" size={24} />,
      color: "bg-indigo-500"
    },
    {
      id: 4,
      title: "4. Report Submitted to Backend",
      description: "The data (including exact GPS coordinates) is securely saved in the database and authorities are notified.",
      icon: <Server className="text-white" size={24} />,
      color: "bg-gray-700"
    },
    {
      id: 5,
      title: "5. Authority Takes Action",
      description: "The municipal team reviews the report. They update the status to 'In Progress' when work begins.",
      icon: <Clock className="text-white" size={24} />,
      color: "bg-yellow-500"
    },
    {
      id: 6,
      title: "6. Issue Resolved",
      description: "Once fixed, the status is marked as 'Resolved'. Citizens can track this entire timeline live from their 'My Complaints' page.",
      icon: <CheckCircle className="text-white" size={24} />,
      color: "bg-green-500"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 h-full overflow-y-auto scrollbar-hide">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">How SCRS Works</h1>
        <p className="text-lg text-gray-500">
          A step-by-step roadmap of the Smart City Reporting System
        </p>
      </div>

      <div className="relative border-l-4 border-gray-200 ml-6 md:ml-12 space-y-12">
        {steps.map((step, index) => (
          <div key={step.id} className="relative pl-8 md:pl-12">
            {/* Timeline Icon */}
            <div className={`absolute -left-[26px] top-0 w-12 h-12 rounded-full border-4 border-white flex items-center justify-center shadow-md ${step.color}`}>
              {step.icon}
            </div>

            {/* Content Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-brand-navy rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Ready to make a difference?</h2>
        <p className="text-blue-100 mb-6">
          Start by submitting your first report today and help keep our city safe and clean.
        </p>
        <a 
          href="/new-report"
          className="inline-block bg-brand-orange text-white px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-lg"
        >
          Submit a Report
        </a>
      </div>
    </div>
  );
};

export default HowItWorks;
