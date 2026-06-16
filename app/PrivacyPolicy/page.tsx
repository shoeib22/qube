"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  const lastUpdated = "June 16, 2026";
  const router = useRouter();

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
          onClick={() => router.back()}
          className="group flex items-center gap-2 px-4 py-2 mb-8 md:mb-12 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 backdrop-blur-sm w-fit"
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
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-lg">
            Last Updated: <span className="text-slate-200">{lastUpdated}</span>
          </p>
        </motion.div>

        {/* Content Document */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-12 backdrop-blur-sm shadow-2xl"
        >
          <div className="prose prose-invert max-w-none text-slate-300 space-y-6 leading-relaxed">
            
            <h2 className="text-2xl font-bold text-white mb-4">XEROVOLT PRIVACY STATEMENT</h2>
            <p>
              Xerovolt, and its subsidiaries or Parent Companies (collectively “Xerovolt”) are committed to protecting your privacy and providing you with a positive experience on our websites and in using our products and services (“Solution” or “Solutions”).
            </p>
            <p>
              This Privacy Statement applies to Xerovolt websites and Solutions that link to or references this Statement and describes how we handle personal information and the choices available to you regarding collection, use, access, and how to update and correct your personal information. Additional information on our personal information practices may be provided in offer descriptions, supplemental privacy statements, or notices provided prior to or at the time of data collection. Certain Xerovolt parent or subsidiary websites may have their own privacy statement that describes how we handle personal information for those websites specifically. To the extent a notice provided at the time of collection or a website or Solution specific privacy statement conflict with this Privacy Statement, such specific notice or supplemental privacy statement will control.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Collection of Your Personal Information</h2>
            <p>
              We may collect data, including personal, device information, about you as you use our websites and Solutions and interact with us. “Personal information” is any information that can be used to identify an individual, and may include name, address, email address, phone number, login information (account number, password), marketing preferences, social media account information, or payment card number. If we link other data with your personal information, we will treat that linked data as personal information. We also collect personal information from trusted third-party sources and engage third parties to collect personal information to assist us.
            </p>
            <p>We collect personal information for a variety of reasons, such as:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-400">
              <li>Processing your order, including payment transactions.</li>
              <li>Providing you with a newsletter subscription.</li>
              <li>Sending marketing communications.</li>
              <li>Creating an account.</li>
              <li>Enabling the use of certain features of our Solutions.</li>
              <li>Personalizing your experience.</li>
              <li>Providing customer service.</li>
              <li>Managing a job application.</li>
              <li>Collecting information during the testing admissions process when a computer-based certification test is administered to you.</li>
            </ul>
            <p>
              We and the third parties we engage may combine the information we collect from you over time and across our websites and Solutions with information obtained from other sources. This helps us improve its overall accuracy and completeness and helps us better tailor our interactions with you.
            </p>
            <p>
              If you choose to provide Xerovolt with a third party’s personal information (such as name, email, and phone number), you represent that you have the third party’s permission to do so. Examples include forwarding reference or marketing material to a friend or sending job referrals. Third parties may unsubscribe from any future communication following the link provided in the initial message. In some instances, Xerovolt and the third parties we engage may automatically collect data through cookies, web logs, web beacons, and other similar applications. This information is used to better understand and improve the usability, performance, and effectiveness of the website and to help tailor content or offers for you.
            </p>
            <p>
              When you use parts of the Service that require Hardware, we may collect Information from that Hardware, such as model and serial number, Hardware activity logs, and historic and current Hardware configuration. We also collect usage data from your Hardware, such as what devices are plugged into the Hardware, the location of the Hardware, whether Hardware is in dimmable mode or is in use, and how much electricity is being consumed by devices plugged into any Hardware.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Uses of Your Personal Information</h2>
            <p>We may use your personal information for the purposes of:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-400">
              <li>Operating our business, delivering, improving, and customizing our websites, mobile applications and Solutions.</li>
              <li>Sending marketing and other communications related to our business, and for other legitimate purposes permitted by applicable law.</li>
              <li>Delivering a Solution you have requested.</li>
              <li>Analyzing, supporting, and improving our Solutions and your online experience.</li>
              <li>Personalizing websites, newsletters and other communications.</li>
              <li>Administering and processing your certification exams.</li>
              <li>Sending communications to you, including for marketing or customer satisfaction purposes, either directly from Xerovolt or from our partners.</li>
            </ul>
            <p>
              In general, Xerovolt may use your Registration Data and/or other information or data we receive or collect, as well as data we derive or infer from combinations of the foregoing, for a variety of purposes, such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-400">
              <li>To facilitate the creation of and secure your account on the Service.</li>
              <li>To customize and personalize the advertising and other content we deliver to you both on the Service and via partners.</li>
              <li>To measure and analyze Service usage and enhance the user experience on our Service.</li>
              <li>To send you information that you agreed to receive.</li>
              <li>To pay third party fees for the content you see in the app.</li>
            </ul>
            
            <p>
              <strong>Sharing of Personally Identifiable Information:</strong> We do not share personally identifiable information with third parties other than as described in this policy. However, we may share your information in order to (i) protect or defend the legal rights or property of Xerovolt, or our business partners; (ii) protect the safety and security of Xerovolt users or members of the public; (iii) protect against fraud or to conduct risk management; or (iv) comply with the law. Additionally, we may share your data with our successor in interest in the event of a corporate reorganization, merger, or sale.
            </p>
            <p>
              <strong>Sharing of device data:</strong> Xerovolt may share information from devices you use to access the Service with its advertising and other partners for purposes such as security, debugging, and targeted advertising.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Access to and Accuracy of Your Personal Information</h2>
            <p>
              We need your help in keeping your personal information accurate and up to date. You can view or edit your personal information and preferences by using the account section of your profile.
            </p>
            <p>
              Some Xerovolt entities may act as or be considered “data controllers”. When a Xerovolt entity is acting as a data controller, you can exercise your rights of access and request corrections, suppression, or deactivations under applicable data protection laws directly with that Xerovolt entity by writing to support@xerovolt.com. We make good faith efforts to honor reasonable requests to access, delete, update, suppress, or correct your data within 30 days.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Your Choices and Selecting Your Communication Preferences</h2>
            <p>
              We give you the choice of receiving a variety of information related to our Solutions. You can manage your communication preferences by following the instructions included in each promotional email from us to unsubscribe, or by sending us a message through email or by mail to:
            </p>
            <p className="pl-6 border-l-2 border-cyan-500 text-slate-400 italic">
              Xerovolt<br/>
              Plot No.102, Survey No, 41 & 42, Kavuri Hills Phase 1,<br/>
              beside line of Jubilee Ridge Hotel, Guttala_Begumpet,<br/>
              Madhapur, Telangana, 500033
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Sharing Your Personal Information</h2>
            <p>We may share personal information in the following ways:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-400">
              <li>Within Xerovolt and its parent companies or subsidiaries for purposes of data processing or storage.</li>
              <li>With Xerovolt business partners or vendors, so that they may share information with you about their products or services.</li>
              <li>With business partners, service vendors, authorized third-party agents, or contractors to provide a requested Solution, service or transaction.</li>
              <li>In connection with, or during negotiations of, any merger, sale of company assets, consolidation or restructuring.</li>
              <li>In response to a request for information by a competent authority if we believe disclosure is in accordance with the law.</li>
              <li>In aggregated and/or anonymised form which cannot reasonably be used to identify you.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Security of Your Personal Information</h2>
            <p>
              We intend to protect the personal information entrusted to us and treat it securely in accordance with this Privacy Statement. Xerovolt implements physical, administrative, and technical safeguards designed to protect your personal information from unauthorized access, use, or disclosure. The Internet, however, cannot be guaranteed to be 100% secure, and we cannot ensure or warrant the security of any personal information you provide to us.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Retention of Personal Information</h2>
            <p>
              We will retain your personal information as needed to fulfill the purposes for which it was collected. We will retain and use your personal information as necessary to comply with our business requirements, legal obligations, resolve disputes, protect our assets, and enforce our agreements.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Use of Cookies and other Web Technologies</h2>
            <p>
              Like many websites, Xerovolt uses automatic data collection tools, such as cookies, embedded web links, and web beacons. These tools collect certain standard information that your browser sends to our website, such as your browser type, IP address, and click stream behavior.
            </p>
            <p>
              Some web browsers may give you the ability to enable a “do not track” feature. Xerovolt websites do not currently recognize and respond to “do not track” signals. If we do in the future, we will describe how in this Privacy Statement.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Linked Websites & Forums</h2>
            <p>
              We may provide links to other third-party websites and services that are outside our control and not covered by this Privacy Statement. We encourage you to review the privacy statements posted on those websites.
            </p>
            <p>
              If you participate in a discussion forum, local communities, or chat room on a Xerovolt website, you should be aware that the information you provide there will be made broadly available to others. Xerovolt is not responsible for the personal information you choose to submit in these forums. To request removal, contact us at support@xerovolt.com.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Children’s Privacy</h2>
            <p>
              Xerovolt encourages parents and guardians to take an active role in their children’s online activities. Xerovolt does not knowingly collect personal information from children without appropriate parental or guardian consent. 
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">How to Contact Us</h2>
            <p>
              We value your opinions. Should you have questions or comments related to this Privacy Statement, please email our privacy team at <a href="mailto:info@xerovolt.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">info@xerovolt.com</a>.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Updates to this Privacy Statement</h2>
            <p>
              We may update this Privacy Statement from time to time. If we modify our Privacy Statement, we will post the revised version here, with an updated revision date. By continuing to use our website after such revisions are in effect, you accept and agree to the revisions and to abide by them.
            </p>
          </div>
        </motion.article>
      </div>
    </main>
  );
}