import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">PI-HUB Web Services</h3>
            <p className="text-gray-400 mb-6">
              Melbourne-based web development agency helping local businesses succeed online.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaGithub className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
              <li><a href="/portfolio" className="text-gray-400 hover:text-white">Portfolio</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-white">Services</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><span className="text-gray-400">Custom Web Development</span></li>
              <li><span className="text-gray-400">E-commerce Solutions</span></li>
              <li><span className="text-gray-400">Website Optimization</span></li>
              <li><span className="text-gray-400">Maintenance & Support</span></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400">
                <FaMapMarkerAlt className="w-5 h-5 mr-3" />
                <span>Melbourne, Australia</span>
              </li>
              <li className="flex items-center text-gray-400">
                <FaPhone className="w-5 h-5 mr-3" />
                <span>+61 412 345 678</span>
              </li>
              <li className="flex items-center text-gray-400">
                <FaEnvelope className="w-5 h-5 mr-3" />
                <span>hello@pihubwebservices.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© {currentYear} PI-HUB Web Services. All rights reserved.</p>
          <p className="mt-2 text-sm">Built with Next.js, Supabase, and ❤️ in Melbourne</p>
        </div>
      </div>
    </footer>
  );
}