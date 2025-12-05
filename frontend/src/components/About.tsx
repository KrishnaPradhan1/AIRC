'use client';

import { motion } from "framer-motion";
import { Briefcase, Users, Brain, CheckCircle2 } from "lucide-react";
import { ImageWithFallback } from "./ui/image-with-fallback";

const portals = [
    {
        icon: Briefcase,
        title: "Recruiter Portal",
        color: "blue",
        features: [
            "Post and manage job listings",
            "View applications dashboard",
            "AI-powered candidate ranking",
            "Download shortlisted resumes",
            "Skills analytics and insights",
        ],
    },
    {
        icon: Users,
        title: "Student Portal",
        color: "purple",
        features: [
            "Browse and search jobs",
            "Upload resume and apply",
            "Track application status",
            "AI match score feedback",
            "Profile management",
        ],
    },
    {
        icon: Brain,
        title: "AI Analysis",
        color: "green",
        features: [
            "Resume parsing (PDF/DOCX)",
            "Keyword and LLM matching",
            "Automated scoring (0-100%)",
            "Skills extraction",
            "Experience level detection",
        ],
    },
];

const techStack = [
    { category: "Frontend", tech: "React, TypeScript, Tailwind CSS, Motion", color: "from-blue-500 to-cyan-500" },
    { category: "Backend", tech: "Flask, SQLAlchemy, SQLite", color: "from-green-500 to-emerald-500" },
    { category: "Authentication", tech: "JWT, Email/OTP Verification", color: "from-purple-500 to-pink-500" },
    { category: "AI/NLP", tech: "LLM, PyPDF, Docx2txt, Custom Algorithms", color: "from-orange-500 to-red-500" },
];

export function About() {
    return (
        <section id="about" className="py-20 lg:py-32 bg-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-blue-100 to-transparent rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-purple-100 to-transparent rounded-full blur-3xl opacity-50" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col gap-4 text-center max-w-3xl mx-auto mb-16"
                >
                    <h2 className="text-3xl lg:text-5xl font-bold">
                        About the <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Project</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        A comprehensive solution for modern recruitment challenges
                    </p>
                </motion.div>

                {/* Project Overview with Image */}
                <div className="max-w-6xl mx-auto flex flex-col gap-12 mb-16">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col gap-6"
                        >
                            <h3 className="text-2xl font-semibold">Project Overview</h3>
                            <p className="text-gray-700 leading-relaxed">
                                This is a full-stack AI-powered resume classification system designed to bridge the gap between recruiters and candidates.
                                Our platform allows recruiters to post jobs and analyze candidate resumes using advanced AI technology including keyword
                                matching and LLM-based analysis. Students can search for relevant opportunities and apply by uploading their resumes,
                                which are then automatically analyzed and ranked based on job requirements.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200">Full-Stack</span>
                                <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm border border-purple-200">AI-Powered</span>
                                <span className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm border border-green-200">Real-Time</span>
                                <span className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm border border-orange-200">Secure</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl transform rotate-3 opacity-20" />
                            <ImageWithFallback
                                src="https://images.unsplash.com/photo-1642775196125-38a9eb496568?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwZGF0YXxlbnwxfHx8fDE3NjQzNjMyNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                                alt="AI Data Analysis"
                                className="relative rounded-2xl shadow-xl w-full h-[350px] object-cover"
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Portal Features */}
                <div className="max-w-6xl mx-auto flex flex-col gap-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, staggerChildren: 0.2 }}
                        className="grid gap-6 md:grid-cols-3"
                    >
                        {portals.map((portal, index) => {
                            const Icon = portal.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -8 }}
                                    className={`group flex flex-col gap-4 p-6 bg-${portal.color}-50 rounded-2xl border-2 border-${portal.color}-100 hover:border-${portal.color}-300 transition-all hover:shadow-xl`}
                                >
                                    <div className={`w-12 h-12 bg-${portal.color}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <Icon className={`h-6 w-6 text-${portal.color}-600`} />
                                    </div>
                                    <h4 className="text-lg font-semibold">{portal.title}</h4>
                                    <ul className="flex flex-col gap-3">
                                        {portal.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                                <CheckCircle2 className={`h-4 w-4 text-${portal.color}-500 mt-0.5 flex-shrink-0`} />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Technology Stack */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col gap-6"
                    >
                        <h3 className="text-2xl text-center font-semibold">Technology Stack</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            {techStack.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="relative group overflow-hidden rounded-xl border bg-white p-6 hover:shadow-lg transition-all"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                                    <div className="relative">
                                        <span className="text-sm text-gray-500 font-medium">{item.category}</span>
                                        <p className="text-gray-800 mt-2 font-medium">{item.tech}</p>
                                    </div>
                                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
