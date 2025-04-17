
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-8">
              Last updated: April 17, 2025
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6">
              By accessing and using Scrapeyard services ("Service"), you accept and agree to be bound by the terms 
              and conditions of this agreement. If you do not agree to these Terms of Service, you should not use our Service.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="mb-4">
              Scrapeyard provides web scraping tools and APIs ("Service") that allow users to extract data from websites. 
              The Service may include various features and functionalities as described on our website.
            </p>
            <p className="mb-6">
              We reserve the right to modify, suspend, or discontinue the Service at any time without notice. 
              We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="mb-4">
              To access certain features of the Service, you must create an account. You are responsible for maintaining 
              the confidentiality of your account information, including your password, and for all activity that occurs under your account.
            </p>
            <p className="mb-6">
              You agree to notify us immediately of any unauthorized use of your account or any other breach of security. 
              We cannot and will not be liable for any loss or damage arising from your failure to comply with this section.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
            <p className="mb-4">
              You agree to use our Service only for lawful purposes and in accordance with these Terms of Service. 
              You agree not to use the Service:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
              <li>To scrape websites that explicitly prohibit scraping in their terms of service or robots.txt file</li>
              <li>To scrape at rates that could cause harm to the target website's infrastructure</li>
              <li>To scrape personal data in violation of privacy laws</li>
              <li>To transmit or upload any material that contains viruses, trojan horses, or other harmful code</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4">5. Payment Terms</h2>
            <p className="mb-6">
              Some aspects of the Service may be provided for a fee. If you elect to use paid aspects of the Service, 
              you agree to pay all fees associated with such use. All fees are exclusive of taxes, which may be added to the fees.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p className="mb-6">
              The Service and its original content, features, and functionality are and will remain the exclusive property 
              of Scrapeyard and its licensors. The Service is protected by copyright, trademark, and other laws of both the 
              United States and foreign countries.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">7. Disclaimer of Warranties</h2>
            <p className="mb-6">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. 
              WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, 
              AND NON-INFRINGEMENT.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="mb-6">
              IN NO EVENT SHALL SCRAPEYARD, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS, BE LIABLE TO YOU FOR ANY DIRECT, 
              INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES WHATSOEVER RESULTING FROM ANY USE OF THE SERVICE.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
            <p className="mb-6">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide 
              notice of any significant changes to these Terms on our website. Your continued use of the Service after any 
              such changes constitutes your acceptance of the new Terms.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at legal@scrapeyard.com.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
