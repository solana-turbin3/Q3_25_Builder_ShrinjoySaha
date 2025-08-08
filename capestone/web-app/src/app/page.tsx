"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Smartphone, Zap, Shield, Users, Trophy, ArrowRight, CheckCircle, Star, Mail } from 'lucide-react';

const PopLandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [email, setEmail] = useState('');
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // X.com (Twitter) Logo Component
  const XLogo: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_WEBAPP_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ email }),
      });

      if (response.ok) {
        setIsEmailSubmitted(true);
        console.log("Email submitted:", email);
        setTimeout(() => {
          setIsEmailSubmitted(false);
          setEmail("");
        }, 1000);
      } else {
        console.error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting email:", error);
    }
  };

  const testimonials = [
    { name: "Alex Chen", role: "DevCon Attendee", text: "Got my NFT instantly after the keynote. PoP made networking so much easier!" },
    { name: "Sarah Johnson", role: "University Student", text: "Love collecting attendance NFTs from my blockchain courses. It's like Pokemon for education!" },
    { name: "Marcus Rodriguez", role: "Event Organizer", text: "PoP revolutionized our conference attendance tracking. Zero fraud, 100% engagement." }
  ];

  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "GPS Verification",
      description: "Pinpoint location accuracy ensures you're actually there"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "NFC & Bluetooth",
      description: "Multiple verification methods for foolproof attendance"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Rewards",
      description: "Get your NFT the moment you check in - no waiting"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Tamper-Proof",
      description: "Blockchain-secured attendance that can't be faked"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              PoP
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:text-purple-300 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-purple-300 transition-colors">How it Works</a>
            <a href="#testimonials" className="hover:text-purple-300 transition-colors">Testimonials</a>
            <a href="https://x.com/PoPCheckIn" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors">
              <XLogo className="w-5 h-5" />
            </a>
            <button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto text-center">
          <div 
            className="transform transition-transform duration-1000"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Proof of Presence
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Earn collectible NFTs just by showing up. GPS-verified, blockchain-secured, 
              gasless attendance rewards powered by Solana.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-2">
                <span>Start Collecting</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 backdrop-blur-sm hover:bg-white/10">
                Watch Demo
              </button>
            </div>

            {/* Social Links - Top Section */}
            <div className="flex justify-center items-center space-x-6 mb-8">
              <span className="text-gray-300">Follow us for updates:</span>
              <a 
                href="https://x.com/PoPCheckIn"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-110 border border-white/20 group"
              >
                <XLogo className="w-6 h-6 text-white group-hover:text-purple-300 transition-colors duration-300" />
              </a>
            </div>

            {/* Email Signup */}
            <div className="max-w-md mx-auto mb-12">
              <div className="text-center mb-4">
                <p className="text-gray-300">🚀 Get early access and exclusive NFT drops</p>
              </div>
              <form onSubmit={handleEmailSubmit} className="relative">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-12 pr-4 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isEmailSubmitted}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-green-500 disabled:to-green-600 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 whitespace-nowrap flex items-center space-x-2 cursor-pointer"
                  >
                    {isEmailSubmitted ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Joined!</span>
                      </>
                    ) : (
                      <span>Join Waitlist</span>
                    )}
                  </button>
                </div>
              </form>
              <p className="text-xs text-gray-400 text-center mt-3">
                Be the first to know when PoP launches. No spam, just NFT magic! ✨
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="text-3xl font-bold text-purple-400 mb-2">50K+</div>
                <div className="text-gray-300">NFTs Minted</div>
              </div>
              <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="text-3xl font-bold text-blue-400 mb-2">200+</div>
                <div className="text-gray-300">Events Verified</div>
              </div>
              <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="text-3xl font-bold text-pink-400 mb-2">99.9%</div>
                <div className="text-gray-300">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Revolutionary Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Cutting-edge technology meets real-world verification
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group backdrop-blur-md bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="text-purple-400 mb-4 group-hover:text-pink-400 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-300">Three simple steps to earn your attendance NFT</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Check In",
                description: "Open the app at any supported event and tap check-in",
                icon: <Smartphone className="w-12 h-12" />
              },
              {
                step: "02", 
                title: "Get Verified",
                description: "Your location is verified using GPS, NFC, or Bluetooth",
                icon: <Shield className="w-12 h-12" />
              },
              {
                step: "03",
                title: "Earn NFT",
                description: "Receive your unique attendance NFT instantly on Solana",
                icon: <Trophy className="w-12 h-12" />
              }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-purple-100 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-400 text-lg">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            What People Say
          </h2>
          
          <div className="backdrop-blur-md bg-white/5 rounded-3xl p-12 border border-white/10 relative overflow-hidden">
            <div className="absolute top-4 left-6">
              <div className="flex space-x-1">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            
            <div className="mt-8">
              <p className="text-2xl mb-8 text-gray-200 italic leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </p>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full"></div>
                <div className="text-left">
                  <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                  <div className="text-gray-400">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-purple-400 w-8' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl p-12 border border-white/20">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Ready to Start Collecting?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users already earning NFTs for real-world attendance. 
              Download PoP today and never miss a reward again.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-2">
                <span>Download for iOS</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-2">
                <span>Download for Android</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center items-center space-x-4 text-sm text-gray-400">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Free to download</span>
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Gasless transactions</span>
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Instant rewards</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-50 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">PoP</span>
              </div>
              <p className="text-gray-400">
                The future of event attendance verification, powered by blockchain technology.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center text-gray-400">
            <p>&copy; 2025 Proof of Presence. All rights reserved. Built on Solana.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PopLandingPage;