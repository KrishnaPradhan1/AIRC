'use client';

import { Brain, Zap, Shield, Target, FileSearch, Users, TrendingUp, Lock } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        icon: Brain,
        title: "AI-Powered Analysis",
        description: "Advanced LLM technology understands context, skills, and experience like a human recruiter.",
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50",
    },
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Process hundreds of resumes in minutes with instant classification results.",
        color: "from-yellow-500 to-orange-600",
        bgColor: "bg-yellow-50",
    },
    {
        icon: Target,
        title: "Accurate Classification",
        description: "High accuracy in categorizing resumes by role, experience level, and skills.",
        color: "from-green-500 to-green-600",
        bgColor: "bg-green-50",
    },
    {
        icon: Shield,
        title: "Secure and Private",
        description: "Your data is encrypted and processed securely with enterprise-grade protection.",
        color: "from-purple-500 to-purple-600",
        bgColor: "bg-purple-50",
    },
    {
        icon: FileSearch,
        title: "Smart Resume Parsing",
        description: "Extract and structure information from resumes in PDF, DOCX, and other formats.",
        color: "from-indigo-500 to-indigo-600",
        bgColor: "bg-indigo-50",
    },
    {
        icon: Users,
        title: "Candidate Ranking",
        description: "Automatically rank candidates based on job requirements and qualifications.",
        color: "from-pink-500 to-pink-600",
        bgColor: "bg-pink-50",
    },
    {
        icon: TrendingUp,
        title: "Skills Analytics",
        description: "Get insights on top skills, experience levels, and candidate demographics.",
        color: "from-cyan-500 to-cyan-600",
        bgColor: "bg-cyan-50",
    },
    {
        icon: Lock,
        title: "Role-Based Access",
        description: "Separate portals for recruiters and students with tailored experiences.",
        color: "from-red-500 to-red-600",
        bgColor: "bg-red-50",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};

export function Features() {
    return (
        <section id="features" className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col gap-4 text-center max-w-3xl mx-auto mb-16"
                >
                    <h2 className="text-3xl lg:text-5xl font-bold">
                        Powerful Features for <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Modern Hiring</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        Everything you need to streamline your recruitment process
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto"
                >
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{
                                    y: -8,
                                    transition: { duration: 0.3 }
                                }}
                                className="group relative"
                            >
                                <div className="h-full flex flex-col gap-4 p-6 bg-white rounded-2xl border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300">
                                    {/* Gradient border on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl p-[2px] -z-10">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl`} />
                                    </div>

                                    <motion.div
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                        className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center`}
                                    >
                                        <Icon className={`h-6 w-6 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: "transparent" }} />
                                        <Icon className={`h-6 w-6 text-transparent absolute`} style={{
                                            background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                                            WebkitBackgroundClip: "text",
                                            backgroundClip: "text"
                                        }} />
                                    </motion.div>

                                    <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>

                                    {/* Hover effect indicator */}
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl"
                                        style={{
                                            background: `linear-gradient(to right, ${feature.color.replace('from-', '').replace(' to-', ', ')})`,
                                        }}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
