
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Layers, Award, Code } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">About Scrapeyard</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              Scrapeyard is a cutting-edge AI-powered web scraping platform designed to help developers, 
              data scientists, and businesses extract valuable data from the web with ease and precision.
            </p>
            
            <div className="grid gap-8 md:grid-cols-3 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Layers className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">Our Mission</h3>
                <p className="text-gray-600 text-center">
                  To democratize access to web data by providing powerful, accessible scraping tools
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">Our Values</h3>
                <p className="text-gray-600 text-center">
                  Building with integrity, transparency, and respect for website terms of service
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">Our Technology</h3>
                <p className="text-gray-600 text-center">
                  Leveraging AI and machine learning to create the most advanced scraping tools
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="mb-4">
              Founded in 2023, Scrapeyard was born from a simple observation: web scraping was too complex and 
              time-consuming for most developers. Our founders, all experienced in data engineering, wanted to create 
              a solution that would make web data accessible to everyone, regardless of their technical expertise.
            </p>
            
            <p className="mb-4">
              What started as a side project quickly evolved into a comprehensive platform used by thousands of 
              developers worldwide. Today, Scrapeyard processes millions of web pages daily, helping businesses 
              make data-driven decisions with the freshest web data available.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Team</h2>
            <p className="mb-4">
              Scrapeyard is powered by a diverse team of engineers, data scientists, and product specialists who 
              share a passion for making web data accessible. Based across the globe, our team brings together 
              expertise from top tech companies and research institutions.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Responsible Scraping</h2>
            <p>
              We believe in ethical web scraping. Our platform is designed to respect robots.txt files, 
              implement appropriate rate limiting, and adhere to website terms of service. We encourage all 
              our users to practice responsible data collection and provide tools to help them do so.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
