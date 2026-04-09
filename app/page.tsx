import PortfolioGrid from '@/components/PortfolioGrid';
import HeroSection from '@/components/HeroSection';
import TechStack from '@/components/TechStack';
import Services from '@/components/Services';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Portfolio Projects */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Portfolio</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Showcasing our best work for Melbourne businesses. Each project tells a story of innovation, collaboration, and results.
          </p>
        </div>
        <PortfolioGrid />
      </section>

      {/* Services */}
      <Services />

      {/* Tech Stack */}
      <TechStack />

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Build Your Website?</h2>
          <p className="text-xl mb-8 opacity-90">
            Let's turn your vision into a stunning, functional website that drives results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get a Free Quote
            </a>
            <a 
              href="/portfolio" 
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              View All Projects
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}