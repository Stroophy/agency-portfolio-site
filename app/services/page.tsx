import { FaServer, FaDatabase, FaCloud, FaShieldAlt, FaCode, FaMobileAlt } from 'react-icons/fa';

export default function ServicesPage() {
  const services = [
    {
      title: "Digital Infrastructure Solutions",
      description: "Complete backend systems, APIs, databases, and cloud architecture for scalable business applications.",
      icon: <FaServer className="text-4xl text-blue-600" />,
      features: ["Cloud Migration", "API Development", "Database Design", "System Architecture"]
    },
    {
      title: "Web Development",
      description: "Custom websites and web applications built with modern frameworks and best practices.",
      icon: <FaCode className="text-4xl text-purple-600" />,
      features: ["Next.js/React", "TypeScript", "Tailwind CSS", "Responsive Design"]
    },
    {
      title: "Cloud Solutions",
      description: "AWS, Azure, and Google Cloud infrastructure setup, optimization, and management.",
      icon: <FaCloud className="text-4xl text-green-600" />,
      features: ["AWS Setup", "Cloud Optimization", "Cost Management", "Security"]
    },
    {
      title: "Database Management",
      description: "PostgreSQL, MongoDB, and Supabase database design, optimization, and maintenance.",
      icon: <FaDatabase className="text-4xl text-orange-600" />,
      features: ["Database Design", "Performance Tuning", "Backup Solutions", "Data Migration"]
    },
    {
      title: "Mobile Applications",
      description: "Cross-platform mobile apps for iOS and Android using React Native and Flutter.",
      icon: <FaMobileAlt className="text-4xl text-red-600" />,
      features: ["React Native", "Flutter", "App Store Deployment", "Push Notifications"]
    },
    {
      title: "Security & Compliance",
      description: "Security audits, compliance checks, and implementation of best security practices.",
      icon: <FaShieldAlt className="text-4xl text-indigo-600" />,
      features: ["Security Audits", "GDPR Compliance", "Penetration Testing", "SSL/TLS Setup"]
    }
  ];

  const digitalInfrastructureSolutions = [
    {
      name: "Business Process Automation",
      description: "Automate repetitive tasks and workflows to increase efficiency and reduce errors.",
      useCases: ["CRM Integration", "Workflow Automation", "Data Processing Pipelines"]
    },
    {
      name: "API-First Architecture",
      description: "Build scalable, maintainable systems with clean API boundaries and microservices.",
      useCases: ["Internal Tools", "Partner Integrations", "Mobile Backends"]
    },
    {
      name: "Data Analytics Platforms",
      description: "Collect, process, and visualize business data for actionable insights.",
      useCases: ["Business Intelligence", "Real-time Dashboards", "Predictive Analytics"]
    },
    {
      name: "E-commerce Infrastructure",
      description: "Complete online store setup with payment processing, inventory, and order management.",
      useCases: ["Online Stores", "Subscription Services", "Digital Products"]
    },
    {
      name: "Internal Communication Tools",
      description: "Custom Slack/Discord bots, notification systems, and team collaboration platforms.",
      useCases: ["Team Coordination", "Alert Systems", "Project Management"]
    },
    {
      name: "IoT & Real-time Systems",
      description: "Connect physical devices to digital systems with real-time data processing.",
      useCases: ["Smart Offices", "Industrial Monitoring", "Environmental Sensors"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Services</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Comprehensive digital solutions for Melbourne businesses. From websites to complete digital infrastructure.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We provide end-to-end digital solutions tailored to your business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Digital Infrastructure Solutions */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Digital Infrastructure Solutions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Beyond websites - we build the digital backbone that powers modern businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {digitalInfrastructureSolutions.map((solution, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{solution.name}</h3>
                <p className="text-gray-600 mb-4">{solution.description}</p>
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Common Use Cases:</h4>
                  <ul className="space-y-1">
                    {solution.useCases.map((useCase, idx) => (
                      <li key={idx} className="text-gray-700 text-sm">
                        • {useCase}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-700 mb-6">
              Need a custom digital infrastructure solution? Let's discuss your specific requirements.
            </p>
            <a 
              href="/contact" 
              className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Schedule a Consultation
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Digital Presence?</h2>
          <p className="text-xl mb-8 opacity-90">
            From simple websites to complex digital infrastructure - we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </a>
            <a 
              href="tel:+61300000000" 
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Call: (03) 0000 0000
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}