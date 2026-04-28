import { motion } from 'framer-motion';
import { LayoutGrid, Flame, Clock, Heart, ArrowUpRight } from 'lucide-react';

const NFTs = () => {
  const collections = [
    { id: 1, name: 'Ethereal Visions', floor: '1.24 ETH', volume: '4.5K ETH', items: '10K', image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'Cyber Punks 2077', floor: '0.85 ETH', volume: '12K ETH', items: '5K', image: 'https://images.unsplash.com/photo-1614728263952-84ea206f99b6?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: 'Bored Apes Vault', floor: '15.2 ETH', volume: '80K ETH', items: '10K', image: 'https://images.unsplash.com/photo-1643101809754-43a91784611a?auto=format&fit=crop&q=80&w=400' },
    { id: 4, name: 'Abstract Layers', floor: '0.12 ETH', volume: '1.2K ETH', items: '2K', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto font-body">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-[#705953] font-bold text-sm tracking-widest uppercase"
          >
            <LayoutGrid size={18} /> Digital Collectibles
          </motion.div>
          <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-[#556069] tracking-tight">NFT Market</h1>
          <p className="text-lg text-[#605d6a] max-w-xl leading-relaxed">
            Discover, track, and analyze the most prestigious NFT collections across the Ethereum and Solana networks.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20">Explore All</button>
          <button className="px-6 py-3 rounded-xl bg-white border border-[#556069]/10 text-[#556069] font-bold hover:bg-[#faf1f4] transition-colors">Stats</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
        {collections.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-[#556069]/5 overflow-hidden shadow-xl shadow-[#556069]/5 group"
          >
            <div className="aspect-square overflow-hidden relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute top-6 left-6 flex gap-2">
                 <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-full flex items-center gap-1 uppercase tracking-wider">
                   <Flame size={12} className="text-orange-500" /> Hot
                 </span>
              </div>
              <button className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-rose-500 transition-all">
                <Heart size={18} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-[#556069] group-hover:text-primary transition-colors">{item.name}</h3>
                <ArrowUpRight size={20} className="text-[#556069]/20 group-hover:text-primary transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#556069]/5">
                 <div>
                   <p className="text-[10px] uppercase tracking-widest text-[#605d6a]/60 font-bold mb-1">Floor Price</p>
                   <p className="font-bold text-[#556069]">{item.floor}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] uppercase tracking-widest text-[#605d6a]/60 font-bold mb-1">Total Volume</p>
                   <p className="font-bold text-[#556069]">{item.volume}</p>
                 </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-[#e2dded] rounded-[3rem] p-12 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl shadow-[#605d6a]/5">
         <div className="flex gap-6 items-center">
            <div className="w-16 h-16 bg-[#556069] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
               <Clock size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#605d6a] font-headline">Upcoming Drops</h3>
              <p className="text-[#605d6a]/70 font-medium">Be the first to know about exclusive NFT launches.</p>
            </div>
         </div>
         <button className="bg-white text-[#605d6a] px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform">Notify Me</button>
      </div>
    </div>
  );
};

export default NFTs;
