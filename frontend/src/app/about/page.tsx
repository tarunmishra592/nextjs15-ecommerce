import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FiAward, FiUsers, FiGlobe } from 'react-icons/fi'

export default function AboutPage() {
  const stats = [
    { value: '10K+', label: 'Happy Customers', icon: <FiUsers className="w-6 h-6" /> },
    { value: '5+', label: 'Years in Business', icon: <FiAward className="w-6 h-6" /> },
    { value: '50+', label: 'Countries Served', icon: <FiGlobe className="w-6 h-6" /> }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Our Story</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Founded in 2018, we're passionate about delivering quality products with exceptional customer service.
        </p>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-col items-center">
              <div className="p-3 bg-green-100 rounded-full text-green-600 mb-2">
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              {stat.label}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Alex Johnson', role: 'Founder & CEO', image: '/team/alex.jpg' },
            { name: 'Sarah Miller', role: 'Head of Design', image: '/team/sarah.jpg' },
            { name: 'David Chen', role: 'Lead Developer', image: '/team/david.jpg' },
            { name: 'Maria Garcia', role: 'Customer Support', image: '/team/maria.jpg' }
          ].map((member) => (
            <Card key={member.name} className="group overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  
                </div>
              </div>
              <CardHeader>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to shop with us?</h2>
        <Button size="lg" className="bg-green-600 hover:bg-green-700">
          Browse Products
        </Button>
      </section>
    </div>
  )
}