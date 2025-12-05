import { Github, Linkedin, Mail, Code2, Database, Palette, Brain } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const team = [
  {
    name: "Krishna Pradhan",
    role: "Full Stack Developer",
    bio: "Project lead specializing in system architecture and AI integration",
    icon: Code2,
    gradient: "from-blue-600 to-cyan-600",
  },
  {
    name: "Nandan Panda",
    role: "Backend Developer",
    bio: "Backend specialist focusing on API development and database design",
    icon: Database,
    gradient: "from-green-600 to-emerald-600",
  },
  {
    name: "Suvendu Karan",
    role: "Frontend Developer",
    bio: "Frontend expert creating intuitive and responsive user interfaces",
    icon: Palette,
    gradient: "from-purple-600 to-pink-600",
  },
  {
    name: "Sameer Kumar Sahu",
    role: "AI/ML Developer",
    bio: "AI specialist implementing resume parsing and classification algorithms",
    icon: Brain,
    gradient: "from-orange-600 to-red-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function Team() {
  return (
    <section id="team" className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
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
            Meet Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Team</span>
          </h2>
          <p className="text-lg text-gray-600">
            Four passionate developers bringing this vision to life
          </p>
        </motion.div>

        {/* Team Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl transform rotate-1 opacity-20" />
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1739298061740-5ed03045b280?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG9mZmljZXxlbnwxfHx8fDE3NjQzMjUyNzB8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Team Collaboration"
              className="relative rounded-3xl shadow-2xl w-full h-[300px] lg:h-[400px] object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto"
        >
          {team.map((member, index) => {
            const Icon = member.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  y: -12,
                  transition: { duration: 0.3 }
                }}
                className="group relative"
              >
                <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-2xl border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all h-full">
                  {/* Gradient border on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl p-[2px] -z-10`}>
                    <div className="absolute inset-0 bg-white rounded-2xl" />
                  </div>
                  
                  {/* Avatar with icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <div className={`flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br ${member.gradient} text-white text-4xl shadow-lg`}>
                      {member.name.charAt(0)}
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-100"
                    >
                      <Icon className={`h-5 w-5 bg-gradient-to-br ${member.gradient} bg-clip-text`} style={{ 
                        WebkitTextFillColor: "transparent",
                        backgroundImage: `linear-gradient(to bottom right, ${member.gradient.replace('from-', 'rgb(59, 130, 246)').replace(' to-', ', rgb(147, 51, 234)')})`,
                        backgroundClip: "text",
                      }} />
                    </motion.div>
                  </motion.div>
                  
                  <div className="flex flex-col gap-2 text-center">
                    <h3 className="text-xl group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                      {member.name}
                    </h3>
                    <p className={`text-sm bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent`}>
                      {member.role}
                    </p>
                    <p className="text-sm text-gray-600">{member.bio}</p>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <motion.a
                      href="#"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${member.gradient} bg-opacity-10 hover:bg-opacity-100 transition-all group/icon`}
                    >
                      <Github className="h-4 w-4 text-gray-600 group-hover/icon:text-white transition-colors" />
                    </motion.a>
                    <motion.a
                      href="#"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${member.gradient} bg-opacity-10 hover:bg-opacity-100 transition-all group/icon`}
                    >
                      <Linkedin className="h-4 w-4 text-gray-600 group-hover/icon:text-white transition-colors" />
                    </motion.a>
                    <motion.a
                      href="#"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${member.gradient} bg-opacity-10 hover:bg-opacity-100 transition-all group/icon`}
                    >
                      <Mail className="h-4 w-4 text-gray-600 group-hover/icon:text-white transition-colors" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
