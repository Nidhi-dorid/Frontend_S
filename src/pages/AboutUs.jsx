import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Globe, ExternalLink, Share2, Info, MessageSquare, Target, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

const AboutUs = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const staggering = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="flex-1 space-y-8 p-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <motion.div 
                className="text-center space-y-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
                    About & Connect
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Building a bridge between citizens and administration for a smarter, more responsive city.
                </p>
            </motion.div>

            <motion.div 
                variants={staggering}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                {/* About Section */}
                <div className="space-y-6">
                    <motion.div variants={fadeIn}>
                        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
                            <div className="h-2 bg-brand-orange w-full" />
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="p-3 bg-brand-orange/10 rounded-xl text-brand-orange group-hover:scale-110 transition-transform">
                                    <Target size={24} />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl text-brand-navy">Our Mission</CardTitle>
                                    <CardDescription>Why we exist</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="text-gray-600 leading-relaxed">
                                Our mission is to empower every citizen to participate in city improvement. 
                                By providing a transparent, efficient, and direct channel to report civic issues, 
                                we ensure that local voices are heard and problems are solved promptly.
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeIn}>
                        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
                            <div className="h-2 bg-brand-navy w-full" />
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="p-3 bg-brand-navy/10 rounded-xl text-brand-navy group-hover:scale-110 transition-transform">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl text-brand-navy">Our Story</CardTitle>
                                    <CardDescription>How it all began</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="text-gray-600 leading-relaxed">
                                SCRS (Smart City Reporting System) started as a simple idea to eliminate bureaucracy in civic maintenance. 
                                We realized that many city issues go unreported simply because the process was too complex. 
                                Today, we are a digital bridge connecting thousands of citizens with their local government.
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeIn} className="bg-brand-navy text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:scale-150 transition-transform duration-700">
                            <Info size={120} />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Need immediate help?</h3>
                        <p className="text-brand-bg/80 mb-6">Our support team is available mon-fri, 9am - 5pm to assist you with any urgent civic concerns.</p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-brand-orange" />
                                <span>support@scrs.gov</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-brand-orange" />
                                <span>+1 (555) 000-SC-RS</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Contact Section */}
                <motion.div variants={fadeIn}>
                    <Card className="border-none shadow-2xl h-full flex flex-col">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-brand-orange text-white text-xs font-bold rounded-full tracking-wider uppercase">Contact</span>
                            </div>
                            <CardTitle className="text-3xl text-brand-navy font-bold">Connect with Us</CardTitle>
                            <CardDescription className="text-base">
                                Have a suggestion or a question? We'd love to hear from you.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" placeholder="John Doe" className="bg-gray-50/50 border-gray-200 focus:ring-brand-orange" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" type="email" placeholder="john@example.com" className="bg-gray-50/50 border-gray-200 focus:ring-brand-orange" />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" placeholder="How can we help?" className="bg-gray-50/50 border-gray-200 focus:ring-brand-orange" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea id="message" placeholder="Type your message here..." className="min-h-[150px] bg-gray-50/50 border-gray-200 focus:ring-brand-orange resize-none" />
                                </div>

                                <Button size="lg" className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white font-bold py-6 group">
                                    <MessageSquare className="mr-2 group-hover:rotate-12 transition-transform" size={20} />
                                    Send Message
                                </Button>
                            </form>

                            <div className="mt-12 flex flex-col items-center gap-6 pt-8 border-t border-gray-100">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Follow our journey</p>
                                <div className="flex gap-4">
                                    {[
                                        { icon: <Globe size={20} />, href: "#", color: "hover:text-blue-500" },
                                        { icon: <ExternalLink size={20} />, href: "#", color: "hover:text-gray-800" },
                                        { icon: <Share2 size={20} />, href: "#", color: "hover:text-brand-orange" }
                                    ].map((social, i) => (
                                        <a key={i} href={social.href} className={`p-3 bg-gray-100 rounded-full text-gray-400 transition-all duration-300 transform hover:-translate-y-1 hover:bg-white hover:shadow-md ${social.color}`}>
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Bottom Footer Details */}
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 1 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-12 border-t border-gray-100"
            >
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-brand-navy/5 rounded-2xl text-brand-navy">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-brand-navy">Our Headquarters</h4>
                        <p className="text-sm text-gray-500">123 City Center Plaza, Hubli-Dharwad, Karnataka 580001</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-brand-navy/5 rounded-2xl text-brand-navy">
                        <Phone size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-brand-navy">Phone Support</h4>
                        <p className="text-sm text-gray-500">Support: +91 98765 43210<br />Admin: +91 91234 56789</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-brand-navy/5 rounded-2xl text-brand-navy">
                        <Mail size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-brand-navy">Email Us</h4>
                        <p className="text-sm text-gray-500">contact@scrs-hub.org<br />media@scrs-hub.org</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AboutUs;
