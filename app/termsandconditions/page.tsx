"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, FileText, Globe, Lock, Shield, AlertCircle, User } from "lucide-react";

export default function TermsAndConditions() {
  const lastUpdated = "June 16, 2026";
  
  // Note: For Next.js, uncomment the following line and the import statement:
  // import { useRouter } from "next/navigation";
  // const router = useRouter();

  const handleBack = () => {
    // In a real Next.js app, replace this with: router.back()
    console.log("Navigating back in Next.js environment");
    // Fallback for preview environment
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const sections = [
    {
      id: "info-collection",
      icon: <FileText className="w-6 h-6 text-cyan-400" />,
      title: "Information Collection and Use",
      content: (
        <p>
          For a better experience while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to your name, phone number, and postal address. The information that we collect will be used to contact or identify you.
        </p>
      ),
    },
    {
      id: "log-data",
      icon: <Globe className="w-6 h-6 text-indigo-400" />,
      title: "Log Data",
      content: (
        <p>
          We want to inform you that whenever you visit our Service, we collect information that your browser sends to us that is called Log Data. This Log Data may include information such as your computer’s Internet Protocol (“IP”) address, browser version, pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other statistics.
        </p>
      ),
    },
    {
      id: "cookies",
      icon: <Lock className="w-6 h-6 text-purple-400" />,
      title: "Cookies",
      content: (
        <p>
          Cookies are files with small amount of data that is commonly used an anonymous unique identifier. These are sent to your browser from the website that you visit and are stored on your computer’s hard drive. Our website uses these “cookies” to collection information and to improve our Service. You have the option to either accept or refuse these cookies, and know when a cookie is being sent to your computer. If you choose to refuse our cookies, you may not be able to use some portions of our service.
        </p>
      ),
    },
    {
      id: "security",
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      title: "Security",
      content: (
        <p>
          We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
        </p>
      ),
    },
    {
      id: "links",
      icon: <AlertCircle className="w-6 h-6 text-blue-400" />,
      title: "Links to Other Sites",
      content: (
        <p>
          Our Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites, more helpful hints. We have no control over, and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
        </p>
      ),
    },
    {
      id: "childrens-privacy",
      icon: <User className="w-6 h-6 text-pink-400" />,
      title: "Children’s Privacy",
      content: (
        <p>
          Our Services do not address anyone under the age of 4. We do not knowingly collect personal identifiable information from children under 4. In the case we discover that a child under 4 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.
        </p>
      ),
    },
    {
      id: "changes",
      icon: <FileText className="w-6 h-6 text-orange-400" />,
      title: "Changes to this Policy",
      content: (
        <p>
          We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.
        </p>
      ),
    }
  ];

  return (
    <main className="min-h-screen bg-[#030712] text-slate-300 font-sans py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_100%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={handleBack}
          className="group flex items-center gap-2 px-4 py-2 mb-8 md:mb-12 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 backdrop-blur-sm w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm font-medium tracking-wide">Back</span>
        </motion.button>

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Terms & Conditions
          </h1>
          <p className="text-slate-400 text-lg">
            Last Updated: <span className="text-slate-200">{lastUpdated}</span>
          </p>
          
          <div className="max-w-3xl mx-auto mt-8 bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 text-left backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4">Xerovolt Agreement</h2>
            <p className="text-slate-300 leading-relaxed space-y-4">
              Xerovolt operates the Xerovolt website and Xerovolt iOS app and Xerovolt Android app, which provides the SERVICE. This page is used to inform users regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service. If you choose to use our Service, then you agree to the collection and use of information in relation with this policy. The Personal Information that we collect are used for providing and improving the Service. We will not use or share your information with anyone except as described in this Policy.
            </p>
          </div>
        </motion.div>

        {/* Content Sections mapped to cards */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:border-white/10 transition-colors duration-300 flex flex-col md:flex-row gap-6 items-start"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                {section.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight mb-3">
                  {section.title}
                </h3>
                <div className="text-slate-300 leading-relaxed">
                  {section.content}
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        {/* Contact Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-8 backdrop-blur-md"
        >
          <Mail className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Need Clarification?</h3>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            If you have any questions or suggestions about our Terms and Conditions, do not hesitate to contact us.
          </p>
          <a 
            href="mailto:info@xerovolt.com" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-slate-950 font-semibold hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </main>
  );
}