import { motion } from 'framer-motion';
import { Target, Users, Landmark, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto font-body">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-[#556069] tracking-tighter leading-tight">
            Redefining <br /> Digital <span className="text-[#705953] italic">Finance</span>
          </h1>
          <p className="text-xl text-[#605d6a] leading-relaxed">
            Agamin was born from a vision to bring clarity to the chaotic world of cryptocurrency. We believe that professional tools should be accessible to everyone, designed with beauty and precision.
          </p>
          <div className="flex gap-4">
            <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20">Our Mission</button>
            <button className="bg-white text-[#556069] border border-[#556069]/10 px-8 py-4 rounded-2xl font-bold">The Team</button>
          </div>
        </motion.div>
        <div className="relative aspect-square">
          <div className="absolute inset-0 mesh-gradient rounded-[4rem] opacity-40 animate-pulse" />
          <img 
            src="https://images.unsplash.com/photo-1551288049-bbbda5366991?auto=format&fit=crop&q=80&w=800" 
            alt="About Agamin" 
            className="relative z-10 w-full h-full object-cover rounded-[3rem] shadow-2xl shadow-[#556069]/10 rotate-3"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-32">
        <ValueCard icon={<Target />} title="Precision" desc="Accurate, real-time data from global exchanges." />
        <ValueCard icon={<Users />} title="Community" desc="Built by traders, for the modern community." />
        <ValueCard icon={<Landmark />} title="Security" desc="Your data is encrypted and secure with us." />
        <ValueCard icon={<Heart />} title="Elegance" desc="Design that respects your digital focus." />
      </div>

      <div className="bg-[#fbdcd3] rounded-[3rem] p-16 text-center space-y-8 shadow-2xl shadow-[#705953]/5">
        <h2 className="font-headline text-4xl font-bold text-[#705953]">Join the Future of Trading</h2>
        <p className="text-[#705953]/80 max-w-2xl mx-auto text-lg leading-relaxed">
          Over 500,000 users trust Agamin for their daily market insights. It's time to elevate your strategy.
        </p>
        <button className="bg-[#705953] text-white px-12 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-transform">
          Get Started Today
        </button>
      </div>
    </div>
  );
};

const ValueCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-white/40 backdrop-blur-md p-8 rounded-[2rem] border border-[#556069]/5 shadow-lg shadow-[#556069]/5"
  >
    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
      {icon}
    </div>
    <h3 className="font-bold text-[#556069] text-xl mb-3">{title}</h3>
    <p className="text-[#605d6a] leading-relaxed">{desc}</p>
  </motion.div>
);

export default About;
