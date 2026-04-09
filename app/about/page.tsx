import { FaMapMarkerAlt, FaUsers, FaRocket, FaHandshake } from 'react-icons/fa';

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Isuru Munasinghe",
      role: "Founder & Lead Developer",
      bio: "10+ years experience in full-stack development and digital infrastructure.",
      expertise: ["Cloud Architecture", "API Design", "System Security"]
    },
    {
      name: "Alex Chen",
      role: "Frontend Specialist",
      bio: "Expert in modern React/Next.js development and user experience design.",
      expertise: ["React/Next.js", "UI/UX Design", "Performance Optimization"]
    },
    {
      name: "Sarah Johnson",
      role: "Digital Strategist",
      bio: "Helps businesses transform their digital presence with strategic planning.",
      expertise: ["Digital Strategy", "Business Analysis", "Project Management"]
    },
    {
      name: "Michael Rodriguez",
      role: "DevOps Engineer",
      bio: "Specializes in cloud infrastructure, CI/CD pipelines, and system reliability.",
      expertise: ["AWS/Azure", "Docker/Kubernetes", "Monitoring & Logging"]
    }
  ];

  const values = [
    {
      title: "Melbourne-First",
      description: "We understand local business needs and the Melbourne market.",
      icon: <FaMapMarkerAlt className="text-3xl text-blue-600" />
    },
    {
      title: "Collaborative Approach",
      description: "We work with you, not just for you. Your success is our success.",
      icon: <FaUsers className="text-3xl text-purple-600" />
    },
    {
      title: "Innovation Driven",
      description: "Always exploring new technologies and better ways to solve problems.",
      icon: <FaRocket className="text-3xl text-green-600" />
    },
    {
      title: "Long-term Partnerships",
      description: "We build relationships that last beyond project completion.",
      icon: <FaHandshake className="text-3xl text-orange-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Stroophy Digital Services</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Melbourne-based digital agency crafting beautiful, functional solutions for local businesses since 2020.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                Stroophy Digital Services (SDS) was founded in Melbourne with a simple mission: to help local businesses thrive in the digital age.
              </p>
              <p>
                What started as a small web development studio has grown into a comprehensive digital agency offering everything from simple websites to complex digital infrastructure solutions.
              </p>
              <p>
                We believe that every Melbourne business deserves access to high-quality digital services, regardless of size. That's why we work with startups, SMEs, and established enterprises alike.
              </p>
              <p>
                Today, we're proud to be one of Melbourne's leading digital agencies, combining technical expertise with deep understanding of local business needs.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <span className="text-2xl font-bold text-blue-600">50+</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Projects Completed</h3>
                  <p className="text-gray-600">Across various industries in Melbourne</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <span className="text-2xl font-bold text-purple-600">100%</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Client Retention</h3>
                  <p className="text-gray-600">Our clients stay with us for ongoing support</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <span className="text-2xl font-bold text-green-600">24/7</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Support Available</h3>
                  <p className="text-gray-600">We're here when you need us</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-orange-100 p-3 rounded-lg mr-4">
                  <span className="text-2xl font-bold text-orange-600">5★</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Average Rating</h3>
                  <p className="text-gray-600">From our satisfied Melbourne clients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Stroophy Digital Services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The talented individuals behind Stroophy Digital Services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{member.name}</h3>
                <p className="text-blue-600 font-semibold text-center mb-4">{member.role}</p>
                <p className="text-gray-600 text-center mb-4">{member.bio}</p>
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Expertise:</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Want to Work With Us?</h2>
          <p className="text-xl mb-8 opacity-90">
            We're always looking for talented individuals and exciting projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Join Our Team
            </a>
            <a 
              href="/portfolio" 
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              See Our Work
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}