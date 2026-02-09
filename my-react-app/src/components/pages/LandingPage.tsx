import React from 'react';
import { ArrowRight, MapPin, Phone, Mail, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/ui/Logo';

// Assets
import heroImg from '@/assets/luxury_interior_hero_1770009357994.png';
import detailImg from '@/assets/architectural_detail_1_1770009373773.png';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#F6EFE6] text-[#1F1F1F] selection:bg-[#CFAE70] selection:text-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-[#F6EFE6]/80 backdrop-blur-md border-b border-[#1F1F1F]/10">
                <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-16 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Logo size={24} className="text-[#1F1F1F]" />
                        <span className="text-xl sm:text-2xl font-display font-bold tracking-[0.1em] uppercase">Boxway</span>
                    </div>

                    <div className="hidden md:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.2em]">
                        <a href="#about" className="hover:text-[#6B8E23] transition-colors">Philosophy</a>
                        <a href="#projects" className="hover:text-[#6B8E23] transition-colors">Portfolio</a>
                        <a href="#services" className="hover:text-[#6B8E23] transition-colors">Approach</a>
                        <Link to="/login" className="btn-primary">Client Portal</Link>
                    </div>

                    <div className="md:hidden">
                        <Link to="/login" className="text-[10px] font-bold uppercase tracking-[0.2em] bg-[#1F1F1F] text-white px-4 py-2 rounded">Portal</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative h-screen flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImg}
                        alt="Luxury Interior"
                        className="w-full h-full object-cover scale-105 animate-slow-zoom"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-8 md:px-16 w-full text-white">
                    <div className="max-w-2xl animate-fade-in-up">
                        <span className="inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.4em] mb-4 sm:mb-6 text-[#6B8E23]">Premium Architecture & Interior</span>
                        <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-bold leading-[1.1] mb-6 sm:mb-8">
                            Spaces That <br />
                            <span className="font-light italic">Inspire.</span>
                        </h1>
                        <p className="text-base sm:text-lg font-light text-white/80 mb-8 sm:mb-10 max-w-md leading-relaxed">
                            Crafting timeless architectural masterpieces and bespoke interiors that define elegance and sophistication.
                        </p>
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                            <button className="btn-gold">Explore Works</button>
                            <button className="flex items-center gap-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] hover:text-[#CFAE70] transition-colors group">
                                Watch Reel <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Detail Section */}
            <section id="about" className="py-20 sm:py-32 px-6 sm:px-8 md:px-16 max-w-[1440px] mx-auto overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 sm:gap-24 items-center">
                    <div className="relative">
                        <img
                            src={detailImg}
                            alt="Detail"
                            className="w-full aspect-[4/5] object-cover"
                        />
                        <div className="absolute -bottom-6 -right-6 sm:-bottom-12 sm:-right-12 w-32 h-32 sm:w-48 sm:h-48 bg-[#1F1F1F] flex items-center justify-center p-4 sm:p-8 text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] leading-loose text-center">
                            Excellence In Every Detail
                        </div>
                    </div>

                    <div className="space-y-8 sm:space-y-12">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#6B8E23] mb-4 block">Our Philosophy</span>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold leading-tight">
                                Where Minimalism <br />
                                Meets Grandeur.
                            </h2>
                        </div>

                        <p className="text-[#8E8E8E] text-base sm:text-lg leading-relaxed font-light">
                            We believe that luxury is not about excess, but about the perfect harmony between space, material, and light. Our designs are a testament to the quiet power of refined aesthetics.
                        </p>

                        <div className="grid grid-cols-2 gap-8 sm:gap-12 pt-4 sm:pt-8 border-t border-[#1F1F1F]/5">
                            <div>
                                <span className="block text-2xl sm:text-3xl font-display font-bold mb-2">12+</span>
                                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E8E8E]">Years Excellence</span>
                            </div>
                            <div>
                                <span className="block text-2xl sm:text-3xl font-display font-bold mb-2">250+</span>
                                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E8E8E]">Projects Delivered</span>
                            </div>
                        </div>

                        <button className="btn-outline">Curated Experience</button>
                    </div>
                </div>
            </section>

            {/* Projects Grid Heading */}
            <section id="projects" className="py-20 sm:py-24 bg-[#1F1F1F] text-[#F6EFE6]">
                <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 mb-12 sm:mb-20">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#CFAE70] mb-4 block">Selected Works</span>
                            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold lowercase italic tracking-tighter">
                                the portfolio_
                            </h2>
                        </div>
                        <p className="max-w-xs text-[#8E8E8E] text-xs sm:text-sm leading-relaxed">
                            A curated selection of our most prestigious architectural and interior projects across South India.
                        </p>
                    </div>

                    {/* Project List */}
                    <div className="space-y-0 border-t border-[#C7BFB4]/10">
                        {[
                            { id: '01', name: 'Deccan Tower Penthouse', location: 'Bengaluru', type: 'Residential' },
                            { id: '02', name: 'Cauvery Vista Retreat', location: 'Kochi', type: 'Hospitality' },
                            { id: '03', name: 'Marina Sky Villa', location: 'Chennai', type: 'Residential' },
                            { id: '04', name: 'Nilgiri Design Estate', location: 'Coimbatore', type: 'Commercial' },
                        ].map((p, i) => (
                            <div key={i} className="group border-b border-[#C7BFB4]/10 py-8 sm:py-10 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/[0.02] sm:hover:px-8 transition-all duration-500 cursor-pointer gap-4">
                                <div className="flex items-center gap-6 sm:gap-12">
                                    <span className="text-[10px] font-bold text-[#C65D3E] tabular-nums">{p.id}</span>
                                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold group-hover:italic transition-all leading-tight">{p.name}</h3>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-12 sm:gap-24 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E8E8E] group-hover:text-[#FAF3E0] transition-colors border-t border-white/5 sm:border-0 pt-4 sm:pt-0">
                                    <span>{p.location}</span>
                                    <span>{p.type}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#F6EFE6] py-16 sm:py-24 px-6 sm:px-16 border-t border-[#1F1F1F]/10">
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
                    <div className="sm:col-span-2 space-y-8">
                        <div className="flex items-center gap-3">
                            <Logo size={24} className="text-[#1F1F1F]" />
                            <span className="text-xl sm:text-2xl font-display font-bold tracking-[0.1em] uppercase">Boxway.</span>
                        </div>
                        <p className="max-w-sm text-[#8E8E8E] text-base sm:text-lg font-light leading-relaxed">
                            Elevating the standard of structural artistry and interior luxury. Join us in redefining the modern habitat.
                        </p>
                        <div className="flex items-center gap-4 sm:gap-6">
                            {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="p-2.5 sm:p-3 rounded-full border border-[#4E342E]/20 hover:border-[#C65D3E] hover:text-[#6B8E23] transition-all">
                                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B8E23]">Inquiries</span>
                        <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm font-medium">
                            <a href="mailto:bespoke@boxway.in" className="flex items-center gap-3 hover:text-[#C65D3E] transition-colors"><Mail className="w-4 h-4" /> bespoke@boxway.in</a>
                            <a href="tel:+919876543210" className="flex items-center gap-3 hover:text-[#C65D3E] transition-colors"><Phone className="w-4 h-4" /> +91 98765 43210</a>
                        </div>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B8E23]">Studio</span>
                        <div className="flex items-start gap-3 text-xs sm:text-sm font-medium leading-relaxed">
                            <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                            <span>42, Design Square, Indiranagar,<br className="hidden sm:block" /> Bengaluru, KA 560038</span>
                        </div>
                    </div>
                </div>
            </footer>

            <div className="py-8 text-center border-t border-[#C7BFB4]/10 text-[9px] font-bold uppercase tracking-[0.4em] text-[#8E8E8E]">
                © 2026 Boxway Architecture. All Rights Reserved.
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slowZoom 20s ease-in-out infinite alternate;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
        </div>
    );
};

export default LandingPage;
