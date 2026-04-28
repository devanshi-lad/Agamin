import { motion } from 'framer-motion';
import { BookOpen, Video, FileText, HelpCircle, ArrowRight } from 'lucide-react';

const Learn = () => {
  return (
    <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto font-body">
      <header className="text-center mb-24 space-y-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e6c8bf]/20 text-[#705953] text-sm font-bold tracking-wider uppercase"
        >
          <BookOpen size={18} /> Education Hub
        </motion.div>
        <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-[#556069] tracking-tighter">
          Master the <span className="text-[#705953] italic">Market</span>
        </h1>
        <p className="text-xl text-[#605d6a] max-w-3xl mx-auto leading-relaxed">
          From blockchain basics to advanced trading strategies, our curriculum is designed to make you a confident investor.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-32">
        <CategoryCard 
          icon={<FileText className="text-blue-500" />} 
          title="Beginners Guide" 
          desc="Start your journey here. Learn what crypto is and how blockchain works."
          count="12 Articles"
        />
        <CategoryCard 
          icon={<Video className="text-purple-500" />} 
          title="Video Tutorials" 
          desc="Visual deep dives into technical analysis and exchange operations."
          count="45 Videos"
        />
        <CategoryCard 
          icon={<TrendingUp className="text-emerald-500" />} 
          title="Trading Strategy" 
          desc="Advanced patterns, risk management, and algorithmic trading insights."
          count="18 Guides"
        />
      </div>

      <div className="space-y-12">
        <h2 className="text-3xl font-bold text-[#556069] font-headline border-l-4 border-[#705953] pl-6">Popular Articles</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ArticleItem title="Understanding Layer 2 Solutions" time="15 min read" difficulty="Intermediate" />
          <ArticleItem title="How to Secure Your Cold Wallet" time="8 min read" difficulty="Beginner" />
          <ArticleItem title="Introduction to DeFi Yield Farming" time="25 min read" difficulty="Advanced" />
          <ArticleItem title="The Future of NFTs in Gaming" time="10 min read" difficulty="Intermediate" />
        </div>
      </div>

      <div className="mt-32 bg-white/40 backdrop-blur-md rounded-[3rem] p-12 flex flex-col md:flex-row gap-12 items-center border border-[#556069]/5 shadow-2xl shadow-[#556069]/5">
         <div className="w-full md:w-1/2 space-y-6">
           <h3 className="text-3xl font-bold text-[#556069] font-headline">Got Questions?</h3>
           <p className="text-[#605d6a] text-lg">Our community of 500k+ traders is here to help. Join the conversation and learn together.</p>
           <button className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
             Visit Help Center <ArrowRight size={20} />
           </button>
         </div>
         <div className="w-full md:w-1/2 aspect-video bg-[#c5d0db]/20 rounded-3xl flex items-center justify-center">
            <HelpCircle size={64} className="text-[#556069]/10" />
         </div>
      </div>
    </div>
  );
};

const CategoryCard = ({ icon, title, desc, count }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-white/40 backdrop-blur-md p-10 rounded-[2.5rem] border border-[#556069]/5 shadow-lg shadow-[#556069]/5 group"
  >
    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-[#556069] mb-4 font-headline">{title}</h3>
    <p className="text-[#605d6a] mb-8 leading-relaxed font-medium">{desc}</p>
    <span className="text-xs font-bold text-[#705953] bg-[#705953]/10 px-4 py-2 rounded-full uppercase tracking-widest">{count}</span>
  </motion.div>
);

const ArticleItem = ({ title, time, difficulty }) => (
  <div className="flex justify-between items-center p-8 bg-white/40 backdrop-blur-md rounded-[2rem] border border-[#556069]/5 hover:bg-white transition-all cursor-pointer group shadow-sm">
    <div className="space-y-1">
      <h4 className="font-bold text-[#556069] text-lg group-hover:translate-x-1 transition-transform">{title}</h4>
      <div className="flex gap-4 text-xs font-bold text-[#605d6a]/40">
        <span>{time}</span>
        <span>•</span>
        <span className={difficulty === 'Advanced' ? 'text-[#705953]' : difficulty === 'Intermediate' ? 'text-blue-500' : 'text-emerald-500'}>{difficulty}</span>
      </div>
    </div>
    <ArrowRight size={20} className="text-[#556069]/20 group-hover:text-primary transition-colors" />
  </div>
);

const TrendingUp = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

export default Learn;
