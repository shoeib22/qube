"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Header />

            <main className="flex-grow pt-28 pb-16 relative">
                {/* Background Gradients */}
                <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-black to-black pointer-events-none -z-10" />

                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl">
                        <h1 className="text-3xl md:text-5xl font-bold mb-10 text-[#ff7a3d]">
                            Terms and Conditions
                        </h1>

                        <h2 className="text-xl font-semibold mb-6 text-gray-200 uppercase tracking-wider">
                            QUBE TECHNOLOGIES PVT. LTD. TERMS AND CONDITIONS
                        </h2>

                        <div className="space-y-6 text-gray-300 leading-relaxed font-light">
                            <p>
                                QUBE Innovations PVT LTD operates the https://QUBE.io website and QUBE Innovations PVT LTD iOS app and QUBE Innovations PVT LTD Android app, which provides the SERVICE. This page is used to inform users regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service. If you choose to use our Service, then you agree to the collection and use of information in relation with this policy. The Personal Information that we collect are used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.
                            </p>

                            <p>
                                The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at https://QUBE.io, unless otherwise defined in this Privacy Policy.
                            </p>

                            <div className="h-px bg-white/10 my-8" />

                            <h3 className="text-2xl font-semibold mt-8 mb-4 text-white">INFORMATION COLLECTION AND USE</h3>
                            <p>
                                For a better experience while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to your name, phone number, and postal address. The information that we collect will be used to contact or identify you.
                            </p>

                            <h3 className="text-2xl font-semibold mt-8 mb-4 text-white">LOG DATA</h3>
                            <p>
                                We want to inform you that whenever you visit our Service, we collect information that your browser sends to us that is called Log Data. This Log Data may include information such as your computer’s Internet Protocol (“IP”) address, browser version, pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other statistics.
                            </p>

                            <h3 className="text-2xl font-semibold mt-8 mb-4 text-white">COOKIES</h3>
                            <p>
                                Cookies are files with small amount of data that is commonly used an anonymous unique identifier. These are sent to your browser from the website that you visit and are stored on your computer’s hard drive. Our website uses these “cookies” to collection information and to improve our Service. You have the option to either accept or refuse these cookies, and know when a cookie is being sent to your computer. If you choose to refuse our cookies, you may not be able to use some portions of our service.
                            </p>

                            <h3 className="text-2xl font-semibold mt-8 mb-4 text-white">SECURITY</h3>
                            <p>
                                We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
                            </p>

                            <h3 className="text-2xl font-semibold mt-8 mb-4 text-white">LINKS TO OTHER SITES</h3>
                            <p>
                                Our Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites, more helpful hints. We have no control over, and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
                            </p>

                            <h3 className="text-2xl font-semibold mt-8 mb-4 text-white">CHILDREN’S PRIVACY</h3>
                            <p>
                                Our Services do not address anyone under the age of 4. We do not knowingly collect personal identifiable information from children under 4. In the case we discover that a child under 4 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.
                            </p>

                            <h3 className="text-2xl font-semibold mt-8 mb-4 text-white">CHANGES TO THIS PRIVACY POLICY</h3>
                            <p>
                                We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.
                            </p>

                            <h3 className="text-2xl font-semibold mt-8 mb-4 text-white">CONTACT US</h3>
                            <p>
                                If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
