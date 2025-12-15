import { useState } from 'react';
import { Check, Shield, Clock, DollarSign, Star, ArrowRight, Phone, Mail } from 'lucide-react';

export default function SellerLanding() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for fixed navigation
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission - could integrate with backend
    alert('Thank you! We will contact you shortly.');
    setFormData({ name: '', email: '', phone: '', message: '' });
    setShowForm(false);
  };

  const benefits = [
    {
      icon: DollarSign,
      title: 'Top Prices',
      description: 'Get the best rates for your diabetic test strips',
    },
    {
      icon: Clock,
      title: 'Fast Payment',
      description: 'Receive payment within 24-48 hours after approval',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'HIPAA compliant and fully insured transactions',
    },
    {
      icon: Star,
      title: 'Easy Process',
      description: 'Simple 3-step process: Send, Verify, Get Paid',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Contact Us',
      description: 'Reach out via phone, email, or fill out our form',
    },
    {
      number: '2',
      title: 'Get Quote',
      description: 'We provide a competitive quote for your supplies',
    },
    {
      number: '3',
      title: 'Ship & Get Paid',
      description: 'Send your items and receive payment quickly',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      rating: 5,
      text: 'Sold my test strips quickly and got paid within 2 days. Highly recommend!',
    },
    {
      name: 'John D.',
      rating: 5,
      text: 'The process was so easy and the prices were fair. Will sell again!',
    },
    {
      name: 'Maria L.',
      rating: 5,
      text: 'Professional service and fast payment. Very satisfied!',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex-shrink-0">
              <img src="/logo.png" alt="Striply" className="h-32 w-auto" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              <span className="text-green-600">Sell Diabetic Supplies</span>
              <br />
              <span className="text-gray-800">Quick, Safe & Secure!</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
              Turn your unused diabetic test strips into cash. We offer the best prices and fastest payments in the industry.
            </p>
            <div className="mt-8 bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 inline-block">
              <p className="text-lg font-bold text-yellow-900">
                🎉 Special Offer: $10 Bonus for First-Time Sellers!
              </p>
              <p className="text-sm text-yellow-700 mt-1">*Terms and conditions apply</p>
            </div>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                SELL NOW
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <a
                href="tel:+1234567890"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-green-600 text-base font-medium rounded-lg text-green-600 bg-white hover:bg-green-50 transition-colors"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="benefits" className="py-16 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Sell With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-16 bg-gradient-to-br from-green-50 to-blue-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full text-2xl font-bold mb-4 mx-auto">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{step.title}</h3>
                  <p className="text-gray-600 text-center">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-8 h-0.5 bg-green-600 transform -translate-y-1/2">
                    <ArrowRight className="absolute right-0 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-16 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Our Sellers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <p className="text-sm font-semibold text-gray-900">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-green-600" />
              <span className="text-gray-700 font-medium">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-6 w-6 text-green-600" />
              <span className="text-gray-700 font-medium">Fully Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 text-green-600" />
              <span className="text-gray-700 font-medium">5-Star Rated</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-green-600" />
              <span className="text-gray-700 font-medium">Fast Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Sell Your Test Strips?</h2>
          <p className="text-xl mb-8 text-green-50">
            Get started today and receive your $10 first-time seller bonus!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:+1234567890"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-green-600 transition-colors"
            >
              <Phone className="mr-2 h-5 w-5" />
              (123) 456-7890
            </a>
            <a
              href="mailto:sell@striply.com"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-green-600 transition-colors"
            >
              <Mail className="mr-2 h-5 w-5" />
              sell@striply.com
            </a>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showForm && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowForm(false)}
            ></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit} className="bg-white px-6 py-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Get Started Today</h3>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Message (Optional)</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Tell us about your supplies..."
                    />
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img src="/logo.png" alt="Striply" className="h-32 w-auto mb-4" />
              <p className="text-gray-400">
                Your trusted partner for diabetic test strip business management.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => handleScrollTo('how-it-works')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleScrollTo('benefits')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Benefits
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleScrollTo('testimonials')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Testimonials
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <a href="tel:+1234567890" className="hover:text-white transition-colors">
                    (123) 456-7890
                  </a>
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href="mailto:sell@striply.com" className="hover:text-white transition-colors">
                    sell@striply.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Striply. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

