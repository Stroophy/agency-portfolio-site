'use client';

import { useState } from 'react';
import { FaSearch, FaFilter, FaExternalLinkAlt, FaCode } from 'react-icons/fa';

const portfolioProjects = [
  {
    id: 1,
    title: "Melbourne Residential Builder",
    category: "Web Development",
    description: "Complete website with project gallery, quote calculator, and client portal for a local construction company.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop",
    technologies: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    link: "#",
    featured: true
  },
  {
    id: 2,
    title: "Inner-city Espresso Bar",
    category: "E-commerce",
    description: "Online ordering system with inventory management and loyalty program for a popular Melbourne cafe.",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w-800&auto=format&fit=crop",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "#",
    featured: true
  },
  {
    id: 3,
    title: "Freelance Consultant Platform",
    category: "Digital Infrastructure",
    description: "Complete platform connecting freelancers with clients, including payment processing and project management.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop",
    technologies: ["Next.js", "PostgreSQL", "AWS", "Redis"],
    link: "#",
    featured: true
  },
  {
    id: 4,
    title: "Healthcare Appointment System",
    category: "Digital Infrastructure",
    description: "Medical appointment booking system with patient records and telehealth integration.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop",
    technologies: ["React Native", "Firebase", "Twilio", "Stripe"],
    link: "#"
  },
  {
    id: 5,
    title: "Real Estate Management Portal",
    category: "Web Development",
    description: "Property management system for real estate agencies with tenant portal and maintenance tracking.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop",
    technologies: ["Vue.js", "Django", "PostgreSQL", "Docker"],
    link: "#"
  },
  {
    id: 6,
    title: "Educational LMS Platform",
    category: "Digital Infrastructure",
    description: "Learning management system for online courses with video streaming and assessment tools.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop",
    technologies: ["React", "Node.js", "MongoDB", "AWS S3"],
    link: "#"
  },
  {
    id: 7,
    title: "Restaurant POS System",
    category: "Digital Infrastructure",
    description: "Point of sale system with inventory management, reporting, and kitchen display integration.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop",
    technologies: ["React", "Express.js", "SQLite", "WebSockets"],
    link: "#"
  },
  {
    id: 8,
    title: "Fitness Tracking App",
    category: "Mobile Development",
    description: "Mobile app for workout tracking, progress monitoring, and social features for gym communities.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop",
    technologies: ["React Native", "GraphQL", "Firebase", "Apple Health"],
    link: "#"
  }
];

const categories = ["All", "Web Development", "Digital Infrastructure", "E-commerce", "Mobile Development"];

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = portfolioProjects.filter(project => {
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Portfolio</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Showcasing our best work for Melbourne businesses and beyond.
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center text-gray-600 mr-2">
                <FaFilter className="mr-2" />
                <span className="font-medium">Filter:</span>
              </div>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Projects</h2>
          <p className="text-gray-600">Our most impactful work for Melbourne businesses.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {portfolioProjects.filter(p => p.featured).map((project) => (
            <div key={project.id} className="bg-white rounded-2xl shadow-xl overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                <div 
                  className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-400"
                  style={{
                    backgroundImage: `url(${project.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                    {project.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <a 
                    href={project.link}
                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
                  >
                    View Project Details
                    <FaExternalLinkAlt className="ml-2" />
                  </a>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Case Study
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* All Projects */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">All Projects</h2>
          <p className="text-gray-600 mb-6">
            Showing {filteredProjects.length} of {portfolioProjects.length} projects
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </p>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.filter(p => !p.featured).map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <div 
                    className="w-full h-full bg-gradient-to-r from-blue-300 to-purple-300"
                    style={{
                      backgroundImage: `url(${project.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                      {project.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 3).map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <a 
                    href={project.link}
                    className="inline-flex items-center text-blue-600 text-sm font-medium hover:text-blue-700"
                  >
                    <FaCode className="mr-2" />
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8 opacity-90">
            Let's create something amazing together for your Melbourne business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Your Project
            </a>
            <a 
              href="tel:+61300000000" 
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Schedule a Call
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}