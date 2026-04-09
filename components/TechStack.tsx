import { FaReact, FaNodeJs, FaDatabase, FaCloud, FaCodeBranch } from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss, SiTypescript, SiSupabase, SiVercel } from 'react-icons/si';

export default function TechStack() {
  const technologies = [
    { icon: <SiNextdotjs className="text-3xl" />, name: 'Next.js', color: 'text-black' },
    { icon: <FaReact className="text-3xl" />, name: 'React', color: 'text-blue-500' },
    { icon: <SiTypescript className="text-3xl" />, name: 'TypeScript', color: 'text-blue-600' },
    { icon: <SiTailwindcss className="text-3xl" />, name: 'Tailwind CSS', color: 'text-teal-500' },
    { icon: <SiSupabase className="text-3xl" />, name: 'Supabase', color: 'text-green-500' },
    { icon: <FaNodeJs className="text-3xl" />, name: 'Node.js', color: 'text-green-600' },
    { icon: <FaDatabase className="text-3xl" />, name: 'PostgreSQL', color: 'text-blue-400' },
    { icon: <SiVercel className="text-3xl" />, name: 'Vercel', color: 'text-black' },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Tech Stack</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We use cutting-edge technologies to build fast, scalable, and maintainable websites.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {technologies.map((tech, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`mb-3 ${tech.color}`}>
                {tech.icon}
              </div>
              <span className="text-sm font-medium text-gray-700">{tech.name}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our technology choices ensure your website is performant, secure, and ready to scale 
            as your business grows. We stay updated with the latest tools and best practices.
          </p>
        </div>
      </div>
    </section>
  );
}