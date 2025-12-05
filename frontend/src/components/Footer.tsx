'use client';

import { Sparkles, Github, Twitter, Linkedin, Heart } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
    const footerSections = [
        {
            title: "Product",
            links: [
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#" },
                { label: "API", href: "#" },
                { label: "Documentation", href: "#" },
            ],
        },
        {
            title: "Company",
            links: [
                { label: "About Us", href: "#about" },
                { label: "Team", href: "#team" },
                { label: "Careers", href: "#" },
                { label: "Contact", href: "#contact" },
            ],
        },
        {
            title: "Legal",
            links: [
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Cookie Policy", href: "#" },
                { label: "GDPR", href: "#" },
            ],
        },
    ];

    return (
        <footer className="border-t bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 py-12 relative z-10">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col gap-4"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2"
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                            >
                                <Sparkles className="h-6 w-6 text-blue-600" />
                            </motion.div>
                            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                AI Resume Classifier
                            </span>
                        </motion.div>
                        <p className="text-sm text-gray-600">
                            Intelligent resume classification powered by advanced LLM technology.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Twitter, href: "#" },
                                { icon: Github, href: "#" },
                                { icon: Linkedin, href: "#" },
                            ].map((social, index) => {
                                const Icon = social.icon;
                                return (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        whileHover={{ scale: 1.2, rotate: 5 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                        <Icon className="h-5 w-5" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Footer Sections */}
                    {footerSections.map((section, sectionIndex) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: (sectionIndex + 1) * 0.1 }}
                            className="flex flex-col gap-4"
                        >
                            <span className="text-sm font-semibold">{section.title}</span>
                            <div className="flex flex-col gap-2">
                                {section.links.map((link, linkIndex) => (
                                    <motion.a
                                        key={linkIndex}
                                        href={link.href}
                                        whileHover={{ x: 5 }}
                                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors relative group w-fit"
                                    >
                                        {link.label}
                                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 pt-8 border-t text-center"
                >
                    <p className="text-sm text-gray-600 flex items-center justify-center gap-2 flex-wrap">
                        © 2025 AI Resume Classifier. All rights reserved.
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1">
                            Made with
                            <motion.span
                                animate={{
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <Heart className="h-3 w-3 text-red-500 fill-red-500" />
                            </motion.span>
                            by Krishna, Nandan, Suvendu & Sameer
                        </span>
                    </p>
                </motion.div>
            </div>
        </footer>
    );
}
