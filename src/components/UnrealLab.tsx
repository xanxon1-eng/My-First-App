import React from 'react';
import { motion } from 'framer-motion';
import { Boxes, Zap, Cpu, Layers, Code, PlayCircle } from 'lucide-react';

export default function UnrealLab() {
  const architectures = [
    {
      title: "The Actor Lifecycle",
      icon: PlayCircle,
      description: "Optimizing BeginPlay vs Tick. Understanding how to scale thousands of NPCs using C++ and Data Assets.",
      tech: "C++ / GC / DataSets"
    },
    {
      title: "Gameplay Ability System",
      icon: Zap,
      description: "The core of Path of Exile style complexity. Attributes, Effects, and Tags acting as a unified logic layer.",
      tech: "GAS / Tags"
    },
    {
      title: "Procedural World Logic",
      icon: Layers,
      description: "Managing level streaming and environmental persistence based on Quest Matrix flags.",
      tech: "Sublevels / DataLayer"
    },
    {
      title: "C++ vs Blueprint",
      icon: Code,
      description: "When to use VMs (Blueprints) and when to push performance-critical systems to the Compiled layer.",
      tech: "Nativization / C++"
    }
  ];

  return (
    <div className="space-y-8 h-full">
      <header>
        <h2 className="text-3xl font-bold mb-2">Unreal Engine Lab</h2>
        <p className="text-kingfisher-muted text-lg max-w-3xl">
          Translating complex RPG mechanics into high-performance Unreal Engine 5.7 architectures. 
          Focus on **Scalability**, **Maintainability**, and **Decoupled Logic**.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {architectures.map((arch, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group p-8 bg-kingfisher-dark/40 border border-kingfisher-blue/10 rounded-[2rem] hover:border-kingfisher-blue/40 transition-all hover:bg-kingfisher-dark/60"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-kingfisher-blue/10 rounded-2xl group-hover:scale-110 transition-transform">
                <arch.icon className="w-8 h-8 text-kingfisher-blue" />
              </div>
              <span className="text-[10px] font-bold text-kingfisher-warm uppercase tracking-widest bg-kingfisher-warm/10 px-3 py-1 rounded-full border border-kingfisher-warm/20">
                {arch.tech}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-3">{arch.title}</h3>
            <p className="text-kingfisher-muted mb-6 leading-relaxed">{arch.description}</p>
            
            <button className="flex items-center gap-2 text-sm font-bold text-kingfisher-blue hover:text-kingfisher-warm transition-colors group/btn">
              Explore Architecture <Zap className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="bg-kingfisher-warm/5 rounded-[2rem] p-8 border border-kingfisher-warm/10 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-kingfisher-warm/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Cpu className="w-6 h-6 text-kingfisher-warm" /> Pro Dev Tip</h3>
          <p className="text-sm text-kingfisher-muted max-w-2xl italic leading-relaxed">
            "Don't build everything in C++. Use C++ for the heavy lifting (stat calculations, movement components, inventory backends) 
            and expose them to Blueprints for your quest designers. This is how the Witcher 3 was built — high performance core, 
            rapid iteration interface."
          </p>
        </div>
      </div>
    </div>
  );
}
