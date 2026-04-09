const technologies = {
  frontend: [
    { name: 'Next.js 15', color: 'bg-black text-white' },
    { name: 'React', color: 'bg-blue-100 text-blue-600' },
    { name: 'TypeScript', color: 'bg-blue-50 text-blue-700' },
    { name: 'Tailwind CSS', color: 'bg-teal-100 text-teal-600' },
  ],
  backend: [
    { name: 'Supabase', color: 'bg-green-100 text-green-600' },
    { name: 'PostgreSQL', color: 'bg-blue-100 text-blue-600' },
    { name: 'Node.js', color: 'bg-green-50 text-green-700' },
  ],
  deployment: [
    { name: 'Vercel', color: 'bg-black text-white' },
    { name: 'GitHub', color: 'bg-gray-800 text-white' },
    { name: 'Docker', color: 'bg-blue-100 text-blue-600' },
  ]
};

export default function TechStack() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Modern Tech Stack</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We use cutting-edge technologies to build fast, secure, and scalable websites.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Frontend */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
              Frontend
            </h3>
            <div className="flex flex-wrap gap-3">
              {technologies.frontend.map((tech, index) => (
                <span 
                  key={index} 
                  className={`px-4 py-2 rounded-lg font-medium ${tech.color}`}
                >
                  {tech.name}
                </span>
              ))}
            </div>
            <p className="mt-6 text-gray-600">
              Modern React framework with server-side rendering, optimized performance, and excellent SEO.
            </p>
          </div>
          
          {/* Backend */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
              Backend & Database
            </h3>
            <div className="flex flex-wrap gap-3">
              {technologies.backend.map((tech, index) => (
                <span 
                  key={index} 
                  className={`px-4 py-2 rounded-lg font-medium ${tech.color}`}
                >
                  {tech.name}
                </span>
              ))}
            </div>
            <p className="mt-6 text-gray-600">
              Scalable backend with real-time capabilities, secure authentication, and robust data management.
            </p>
          </div>
          
          {/* Deployment */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
              Deployment & Tools
            </h3>
            <div className="flex flex-wrap gap-3">
              {technologies.deployment.map((tech, index) => (
                <span 
                  key={index} 
                  className={`px-4 py-2 rounded-lg font-medium ${tech.color}`}
                >
                  {tech.name}
                </span>
              ))}
            </div>
            <p className="mt-6 text-gray-600">
              Automated deployment pipelines, version control, and containerization for reliable delivery.
            </p>
          </div>
        </div>
        
        {/* Benefits */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 mb-2">Fast</div>
            <div className="text-gray-700">Lightning-fast page loads</div>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600 mb-2">Secure</div>
            <div className="text-gray-700">Enterprise-grade security</div>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600 mb-2">Scalable</div>
            <div className="text-gray-700">Grows with your business</div>
          </div>
          <div className="text-center p-6 bg-yellow-50 rounded-xl">
            <div className="text-2xl font-bold text-yellow-600 mb-2">SEO Ready</div>
            <div className="text-gray-700">Optimized for search engines</div>
          </div>
        </div>
      </div>
    </section>
  );
}