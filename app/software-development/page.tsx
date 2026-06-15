"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Cpu, ShieldCheck, Laptop2, X } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BackArrow from "../../components/backarrow";

export default function Page() {
  const [showForm,setShowForm]=useState(false);
  const [loading,setLoading]=useState(false);
  const [form,setForm]=useState({name:"",email:"",contact:""});

  const benefits=[
    {icon:Code2,title:"Custom Platforms",desc:"Built for your business."},
    {icon:Cpu,title:"Scalable Systems",desc:"Enterprise-grade architecture."},
    {icon:ShieldCheck,title:"Security First",desc:"Modern secure practices."},
    {icon:Laptop2,title:"Performance",desc:"Fast and maintainable."},
  ];

  async function handleSubmit(e:any){
    e.preventDefault();
    setLoading(true);
    await new Promise(r=>setTimeout(r,1000));
    setLoading(false);
    setShowForm(false);
  }

  return (
  <div className="min-h-screen bg-[#020202] text-white overflow-hidden">
    <Header/>
    <BackArrow/>

    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute top-20 left-20 w-[500px] h-[500px] rounded-full bg-yellow-500/10 blur-[140px]"/>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[160px]"/>
    </div>

    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-5xl text-center">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
         className="inline-flex rounded-full border border-yellow-500/20 bg-yellow-500/5 px-5 py-2 text-xs tracking-[0.3em] uppercase text-yellow-300">
         Enterprise Software Engineering
        </motion.div>

        <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}
        transition={{delay:.2}}
        className="mt-8 text-6xl lg:text-8xl font-light">
        Build <span className="font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">Extraordinary</span><br/>
        Digital Products
        </motion.h1>

        <p className="mt-8 text-zinc-400 text-xl max-w-2xl mx-auto">
        AI, enterprise platforms and custom software engineered for ambitious businesses.
        </p>

        <button onClick={()=>setShowForm(true)}
        className="mt-10 rounded-full bg-white text-black px-10 py-4 inline-flex gap-3 items-center font-semibold hover:scale-105 transition">
        Start Your Project <ArrowRight size={18}/>
        </button>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-6 py-24">
      <h2 className="text-4xl text-center mb-16 font-light">Capabilities</h2>
      <div className="grid md:grid-cols-2 gap-8">
      {benefits.map((b,i)=>{
        const Icon=b.icon;
        return(
        <motion.div whileHover={{y:-8}}
        key={i}
        className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-gradient-to-br from-yellow-500/10 to-transparent"/>
          <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6">
            <Icon className="text-yellow-400"/>
          </div>
          <h3 className="text-2xl font-semibold">{b.title}</h3>
          <p className="text-zinc-400 mt-3">{b.desc}</p>
        </motion.div>);
      })}
      </div>
    </section>

    <section className="py-24 border-y border-white/10">
      <div className="max-w-5xl mx-auto px-6">
      {["Discovery","Architecture","Development","Deployment"].map((t,i)=>(
        <div key={i} className="flex gap-6 mb-10">
          <div className="w-12 h-12 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold">{i+1}</div>
          <div>
            <h3 className="text-2xl">{t}</h3>
            <p className="text-zinc-400 mt-2">Premium engineering workflow focused on quality and scalability.</p>
          </div>
        </div>
      ))}
      </div>
    </section>

    <section className="py-28 text-center">
      <h2 className="text-5xl font-light">Let's build something remarkable.</h2>
      <button onClick={()=>setShowForm(true)}
      className="mt-10 rounded-full bg-yellow-400 text-black px-10 py-5 font-bold">
      Book Consultation
      </button>
    </section>

    {showForm &&
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50">
      <form onSubmit={handleSubmit}
      className="bg-[#0b0b0b] border border-white/10 rounded-[32px] p-8 w-full max-w-md relative">
        <button type="button" onClick={()=>setShowForm(false)} className="absolute top-5 right-5"><X/></button>
        <h2 className="text-2xl mb-6">Software Consultation</h2>
        <input className="w-full mb-4 p-4 rounded-xl bg-black border border-white/10"
        placeholder="Name" value={form.name}
        onChange={e=>setForm({...form,name:e.target.value})}/>
        <input className="w-full mb-4 p-4 rounded-xl bg-black border border-white/10"
        placeholder="Email" value={form.email}
        onChange={e=>setForm({...form,email:e.target.value})}/>
        <input className="w-full mb-6 p-4 rounded-xl bg-black border border-white/10"
        placeholder="Contact" value={form.contact}
        onChange={e=>setForm({...form,contact:e.target.value})}/>
        <button className="w-full rounded-xl bg-white text-black py-4 font-bold">
        {loading?"Submitting...":"Submit"}
        </button>
      </form>
    </div>}
    <Footer/>
  </div>);
}
