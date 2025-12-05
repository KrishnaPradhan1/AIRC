import { Upload, FileSearch, Brain, Target, CheckCircle, Users } from "lucide-react";
import { motion } from "motion/react";

const steps = [
  {
    icon: Upload,
    title: "Post Job or Upload Resume",
    description: "Recruiters post job requirements, students upload their resumes",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: FileSearch,
    title: "AI Parses Content",
    description: "Our AI engine extracts skills, experience, and qualifications",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Brain,
    title: "Smart Matching",
    description: "LLM technology matches candidates with job requirements",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Target,
    title: "Ranking & Scoring",
    description: "Candidates are ranked and scored based on match quality",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: CheckCircle,
    title: "Shortlist & Review",
    description: "Recruiters review top candidates and download summaries",
    color: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-50",
  },
  {
    icon: Users,
    title: "Connect & Hire",
    description: "Connect with the best candidates and complete the hiring process",
    color: "from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-50",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl lg:text-5xl">
            How It <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-lg text-gray-600">
            Simple, fast, and intelligent recruitment process
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Desktop/Tablet View - Timeline */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Connection line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 origin-left"
                style={{ top: "80px" }}
              />
              
              <div className="grid grid-cols-3 gap-8 mb-12">
                {steps.slice(0, 3).map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className="relative flex flex-col items-center text-center gap-4 pt-32"
                    >
                      {/* Step number and icon */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="absolute -top-0"
                      >
                        <div className={`relative w-32 h-32 ${step.bgColor} rounded-full flex items-center justify-center border-4 border-white shadow-xl`}>
                          <div className={`absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white text-sm shadow-lg`}>
                            {index + 1}
                          </div>
                          <Icon className={`h-12 w-12 bg-gradient-to-br ${step.color} bg-clip-text`} style={{ 
                            WebkitTextFillColor: "transparent",
                            backgroundImage: `linear-gradient(to bottom right, ${step.color.replace('from-', 'rgb(59, 130, 246)').replace(' to-', ', rgb(147, 51, 234)')})`,
                            backgroundClip: "text",
                          }} />
                        </div>
                      </motion.div>
                      
                      <h3 className="text-lg">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-8">
                {steps.slice(3, 6).map((step, index) => {
                  const Icon = step.icon;
                  const actualIndex = index + 3;
                  return (
                    <motion.div
                      key={actualIndex}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: actualIndex * 0.2 }}
                      className="relative flex flex-col items-center text-center gap-4 pt-32"
                    >
                      {/* Step number and icon */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="absolute -top-0"
                      >
                        <div className={`relative w-32 h-32 ${step.bgColor} rounded-full flex items-center justify-center border-4 border-white shadow-xl`}>
                          <div className={`absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white text-sm shadow-lg`}>
                            {actualIndex + 1}
                          </div>
                          <Icon className={`h-12 w-12 bg-gradient-to-br ${step.color} bg-clip-text`} style={{ 
                            WebkitTextFillColor: "transparent",
                            backgroundImage: `linear-gradient(to bottom right, ${step.color.replace('from-', 'rgb(59, 130, 246)').replace(' to-', ', rgb(147, 51, 234)')})`,
                            backgroundClip: "text",
                          }} />
                        </div>
                      </motion.div>
                      
                      <h3 className="text-lg">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile View - Vertical */}
          <div className="md:hidden flex flex-col gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex gap-6 items-start"
                >
                  {/* Vertical line */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                      className={`absolute left-8 top-20 w-1 h-full bg-gradient-to-b ${step.color} origin-top`}
                    />
                  )}
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`relative flex-shrink-0 w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10`}
                  >
                    <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white text-xs`}>
                      {index + 1}
                    </div>
                    <Icon className={`h-6 w-6 bg-gradient-to-br ${step.color} bg-clip-text`} style={{ 
                      WebkitTextFillColor: "transparent",
                      backgroundImage: `linear-gradient(to bottom right, ${step.color.replace('from-', 'rgb(59, 130, 246)').replace(' to-', ', rgb(147, 51, 234)')})`,
                      backgroundClip: "text",
                    }} />
                  </motion.div>
                  
                  {/* Content */}
                  <div className="flex flex-col gap-2 flex-1 pt-2">
                    <h3 className="text-lg">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
