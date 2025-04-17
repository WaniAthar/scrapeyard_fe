
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-8">
              Last updated: April 17, 2025
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to Scrapeyard ("we," "our," or "us"). We are committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you visit our website and use our web scraping services.
            </p>
            <p className="mb-6">
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, 
              please do not access the site or use our services.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-medium mb-2">2.1 Personal Data</h3>
            <p className="mb-4">
              We may collect personal identification information from users in various ways, including, but not limited to, 
              when users visit our site, register on the site, subscribe to our service, and in connection with other 
              activities, services, features, or resources we make available. Users may be asked for, as appropriate:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Name</li>
              <li>Email address</li>
              <li>Company name</li>
              <li>Billing information</li>
            </ul>
            
            <h3 className="text-xl font-medium mb-2">2.2 Usage Data</h3>
            <p className="mb-6">
              We may also collect information on how the service is accessed and used. This usage data may include 
              information such as your computer's Internet Protocol address, browser type, browser version, the pages 
              of our service that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect in various ways, including to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Provide, operate, and maintain our website and services</li>
              <li>Improve, personalize, and expand our website and services</li>
              <li>Understand and analyze how you use our website and services</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you about our services, updates, and other information</li>
              <li>Process your transactions and manage your account</li>
              <li>Find and prevent fraud</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4">4. Cookies</h2>
            <p className="mb-6">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. 
              Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct 
              your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="mb-6">
              The security of your data is important to us, but remember that no method of transmission over the Internet, 
              or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect 
              your personal data, we cannot guarantee its absolute security.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">6. Changes to This Privacy Policy</h2>
            <p className="mb-6">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
              You are advised to review this Privacy Policy periodically for any changes.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@scrapeyard.com.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
