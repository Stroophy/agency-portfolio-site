import { ArrowRight, CheckCircle, Code, Globe, Rocket, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const services = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Custom Web Development",
      description: "Tailored solutions built with modern frameworks like Next.js, React, and TypeScript.",
      features: ["Responsive Design", "API Integration", "Performance Optimization"]
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "E-commerce Solutions",
      description: "Scalable online stores with secure payment processing and inventory management.",
      features: ["Shopify/WordPress", "Payment Gateways", "Product Management"]
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Website Optimization",
      description: "Speed up your site, improve SEO, and enhance user experience.",
      features: ["Core Web Vitals", "SEO Audit", "Conversion Optimization"]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Maintenance & Support",
      description: "Ongoing support, security updates, and performance monitoring.",
      features: ["24/7 Monitoring", "Security Patches", "Regular Backups"]
    }
  ];

  const projects = [
    {
      title: "Melbourne Restaurant Platform",
      description: "Full-stack ordering system with real-time updates",
      tech: ["Next.js", "Supabase", "Stripe"],
      category: "E-commerce"
    },
    {
      title: "Construction Management Dashboard",
      description: "Project tracking and client portal for construction firms",
      tech: ["React", "Node.js", "MongoDB"],
      category: "SaaS"
    },
    {
      title: "Real Estate Portal",
      description: "Property listing platform with virtual tours",
      tech: ["Next.js", "Mapbox", "Cloudinary"],
      category: "Real Estate"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Building Digital Excellence for{" "}
              <span className="text-blue-600 dark:text-blue-400">Melbourne Businesses</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              PI-HUB Web Services delivers fast, modern, and scalable web solutions that drive growth and engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Get Free Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="#portfolio"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive web solutions tailored to your business needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-xl transition-shadow"
              >
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Recent Projects
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See how we've helped businesses transform their digital presence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className="p-6">
                  <div className="inline-block px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4">
                    {project.category}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Elevate Your Digital Presence?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Let's discuss how we can help your business succeed online. Get a free consultation and project quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="mailto:contact@pihubwebservices.com"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-blue-600 bg-white hover:bg-gray-100 rounded-lg transition-colors"
              >
                Email Us
              </Link>
              <Link
                href="tel:+61412345678"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-transparent hover:bg-blue-700 rounded-lg border-2 border-white transition-colors"
              >
                Call Now: +61 412 345 678
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">PI-HUB Web Services</h3>
              <p className="text-gray-400">Melbourne-based website development agency</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">📍 Melbourne, Australia</p>
              <p className="text-gray-400">© {new Date().getFullYear()} PI-HUB Web Services. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}