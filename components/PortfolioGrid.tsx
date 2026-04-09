import { FaCoffee, FaStore, FaPalette, FaLaptopCode } from 'react-icons/fa';

const projects = [
  {
    id: 1,
    title: 'Melbourne Cafe Website',
    description: 'Modern website for local cafe with online ordering and table booking.',
    category: 'Business Website',
    icon: <FaCoffee className="text-2xl text-orange-500" />,
    tech: ['Next.js', 'Tailwind', 'Supabase'],
    budget: '$3k-$5k',
    image: '/api/placeholder/400/300',
    featured: true
  },
  {
    id: 2,
    title: 'Artisan E-commerce Store',
    description: 'Full-featured online store for Melbourne-based artisan crafts.',
    category: 'E-commerce',
    icon: <FaStore className="text-2xl text-green-500" />,
    tech: ['Next.js', 'Stripe', 'Supabase'],
    budget: '$5k-$10k',
    image: '/api/placeholder/400/300',
    featured: true
  },
  {
    id: 3,
    title: 'Designer Portfolio',
    description: 'Clean portfolio website for Melbourne UI/UX designer.',
    category: 'Portfolio',
    icon: <FaPalette className="text-2xl text-purple-500" />,
    tech: ['Next.js', 'Framer Motion', 'Tailwind'],
    budget: '$1k-$3k',
    image: '/api/placeholder/400/300',
    featured: true
  },
  {
    id: 4,
    title: 'Business Web Application',
    description: 'Custom web app for local business management.',
    category: 'Web App',
    icon: <FaLaptopCode className="text-2xl text-blue-500" />,
    tech: ['Next.js', 'TypeScript', 'PostgreSQL'],
    budget: '$10k+',
    image: '/api/placeholder/400/300',
    featured: false
  }
];

export default function PortfolioGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <div 
          key={project.id} 
          className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
            project.featured ? 'border-2 border-blue-500' : ''
          }`}
        >
          {/* Project Image */}
          <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
            <div className="text-4xl">
              {project.icon}
            </div>
          </div>
          
          {/* Project Content */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                <span className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full mt-2">
                  {project.category}
                </span>
              </div>
              {project.featured && (
                <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-600 rounded-full">
                  Featured
                </span>
              )}
            </div>
            
            <p className="text-gray-600 mb-4">{project.description}</p>
            
            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((tech, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
            
            {/* Project Details */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Budget: <span className="font-semibold text-gray-700">{project.budget}</span>
              </div>
              <a 
                href={`/portfolio/${project.id}`} 
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View Details →
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}