import { FaCode, FaShoppingCart, FaRocket, FaShieldAlt } from 'react-icons/fa';

export default function Services() {
  const services = [
    {
      icon: <FaCode className="text-3xl text-blue-500" />,
      title: 'Custom Web Development',
      description: 'Tailored websites built with modern frameworks like Next.js, React, and TypeScript.',
      features: ['Responsive Design', 'API Integration', 'Performance Optimization']
    },
    {
      icon: <FaShoppingCart className="text-3xl text-green-500" />,
      title: 'E-commerce Solutions',
      description: 'Scalable online stores with secure payment processing and inventory management.',
      features: ['Shopify/WooCommerce', 'Payment Gateways', 'Product Management']
    },
    {
      icon: <FaRocket className="text-3xl text-purple-500" />,
      title: 'Website Optimization',
      description: 'Speed up your site, improve SEO, and enhance user experience for better conversions.',
      features: ['Core Web Vitals', 'SEO Audit', 'Conversion Optimization']
    },
    {
      icon: <FaShieldAlt className="text-3xl text-orange-500" />,
      title: 'Maintenance & Support',
      description: 'Ongoing support, security updates, and performance monitoring for your website.',
      features: ['24/7 Monitoring', 'Security Patches', 'Regular Backups']
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive web solutions designed to help Melbourne businesses succeed online.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-500">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}