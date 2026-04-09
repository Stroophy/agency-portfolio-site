import { FaServer, FaCode, FaCloud, FaDatabase, FaMobileAlt, FaShieldAlt, FaHardHat } from 'react-icons/fa';

const services = [
  {
    title: 'Construction Tech Solutions',
    description: 'Industry-specific software for construction management, workforce tracking, procurement, and compliance.',
    icon: <FaHardHat className="text-3xl text-blue-500" />,
    price: '$15,000 - $50,000+',
    features: ['Flutter Mobile Apps', 'Supabase Backend', 'GPS Geofencing', 'BOM Weather Sync', 'Australian Compliance']
  },
  {
    title: 'Web Development',
    description: 'Custom websites and web applications built with modern frameworks and best practices.',
    icon: <FaServer className="text-3xl text-purple-500" />,
    price: '$2,000 - $10,000+',
    features: ['Next.js/React', 'TypeScript', 'Tailwind CSS', 'Responsive Design', 'SEO Optimization']
  },
  {
    title: 'Digital Infrastructure',
    description: 'Complete backend systems, APIs, databases, and cloud architecture for scalable business applications.',
    icon: <FaCloud className="text-3xl text-green-500" />,
    price: '$5,000 - $25,000+',
    features: ['Cloud Migration', 'API Development', 'Database Design', 'System Architecture', 'Scalability Planning']
  },
  {
    title: 'Cloud Solutions',
    description: 'AWS, Azure, and Google Cloud infrastructure setup, optimization, and management.',
    icon: <FaCloud className="text-3xl text-green-500" />,
    price: '$1,000 - $10,000+',
    features: ['AWS Setup', 'Cloud Optimization', 'Cost Management', 'Security Configuration', 'Monitoring']
  },
  {
    title: 'Database Management',
    description: 'PostgreSQL, MongoDB, and Supabase database design, optimization, and maintenance.',
    icon: <FaDatabase className="text-3xl text-orange-500" />,
    price: '$1,500 - $8,000+',
    features: ['Database Design', 'Performance Tuning', 'Backup Solutions', 'Data Migration', 'Security']
  },
  {
    title: 'Mobile Applications',
    description: 'Cross-platform mobile apps for iOS and Android using React Native and Flutter.',
    icon: <FaMobileAlt className="text-3xl text-red-500" />,
    price: '$5,000 - $20,000+',
    features: ['React Native', 'Flutter', 'App Store Deployment', 'Push Notifications', 'Offline Support']
  },
  {
    title: 'Security & Compliance',
    description: 'Security audits, compliance checks, and implementation of best security practices.',
    icon: <FaShieldAlt className="text-3xl text-indigo-500" />,
    price: '$1,000 - $5,000+',
    features: ['Security Audits', 'GDPR Compliance', 'Penetration Testing', 'SSL/TLS Setup', 'Monitoring']
  }
];

export default function Services() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive digital solutions for Melbourne businesses. From websites to complete digital infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="mb-4">
                <span className="text-lg font-bold text-blue-600">{service.price}</span>
                <span className="text-gray-500 text-sm ml-2">starting from</span>
              </div>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <a 
                  href="/services" 
                  className="inline-block w-full text-center px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Need a custom solution? We tailor our services to your specific business needs.
          </p>
          <a 
            href="/contact" 
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get a Custom Quote
          </a>
        </div>
      </div>
    </section>
  );
}