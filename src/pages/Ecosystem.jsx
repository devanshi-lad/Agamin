import { motion } from 'framer-motion';
import { Layers, Network, Globe, Activity } from 'lucide-react';

const Ecosystem = () => {
  return (
    <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto font-body">
      <header className="text-center mb-24 space-y-6">
        <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-[#556069] tracking-tighter">
          The <span className="text-[#705953] italic">Agamin</span> Ecosystem
        </h1>
        <p className="text-xl text-[#605d6a] max-w-3xl mx-auto leading-relaxed">
          A seamless integration of data, analytics, and community designed to power your financial journey.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        <EcosystemCard 
          icon={<Network size={32} />} 
          title="Global Data Mesh" 
          desc="Aggregated real-time data from 100+ decentralized and centralized exchanges worldwide."
          color="bg-[#c5d0db]"
        />
        <EcosystemCard 
          icon={<Layers size={32} />} 
          title="Multi-Chain Support" 
          desc="Track assets across Ethereum, Solana, Binance Smart Chain, and 20+ other networks."
          color="bg-[#e2dded]"
        />
        <EcosystemCard 
          icon={<Globe size={32} />} 
          title="Institutional Access" 
          desc="API endpoints and websocket streams for professional traders and hedge funds."
          color="bg-[#dec0b8]"
        />
        <EcosystemCard 
          icon={<Activity size={32} />} 
          title="Market Liquidity" 
          desc="Deep order book analysis and liquidity scoring for every asset in our vault."
          color="bg-[#fbdcd3]"
        />
      </div>

      <div className="bg-[#556069] rounded-[3rem] p-16 text-white overflow-hidden relative shadow-2xl shadow-[#556069]/20">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="font-headline text-4xl font-bold leading-tight">Interconnected Infrastructure</h2>
            <p className="text-[#bdc8d2] text-lg leading-relaxed">
              Our ecosystem is built on a foundation of reliability and speed. We process over 1 billion requests daily with 99.99% uptime, ensuring you always have the pulse of the market.
            </p>
            <div className="flex gap-8 border-t border-white/10 pt-8">
              <div>
                <p className="text-3xl font-bold">12ms</p>
                <p className="text-[#bdc8d2] text-sm font-medium">Avg. Latency</p>
              </div>
              <div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-[#bdc8d2] text-sm font-medium">Data Points</p>
              </div>
              <div>
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-[#bdc8d2] text-sm font-medium">Monitoring</p>
              </div>
            </div>
          </div>
          <div className="aspect-square bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center">
             <Network size={120} className="text-white/20 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

const EcosystemCard = ({ icon, title, desc, color }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className={`${color} p-12 rounded-[3rem] border border-black/5 flex flex-col justify-between h-[400px] shadow-xl shadow-black/5`}
  >
    <div className="w-16 h-16 bg-white/30 rounded-[1.5rem] flex items-center justify-center text-[#556069]">
      {icon}
    </div>
    <div className="space-y-4">
      <h3 className="font-headline text-3xl font-bold text-[#556069]">{title}</h3>
      <p className="text-[#556069]/70 text-lg leading-relaxed font-medium">{desc}</p>
    </div>
  </motion.div>
);

export default Ecosystem;
