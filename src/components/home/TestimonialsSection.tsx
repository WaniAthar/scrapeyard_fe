
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    quote: "Scrapeyard reduced our development time by 70%. What used to take weeks now takes days.",
    author: "Sarah Johnson",
    role: "CTO at DataTech",
    avatar: "/placeholder.svg"
  },
  {
    quote: "The AI-powered approach means we don't have to constantly update our scraping code when websites change.",
    author: "Michael Chang",
    role: "Lead Developer at WebHarvest",
    avatar: "/placeholder.svg"
  },
  {
    quote: "We switched from traditional scraping tools to Scrapeyard and haven't looked back. It's simply better.",
    author: "Alex Rivera",
    role: "Data Engineer at InfoSystems",
    avatar: "/placeholder.svg"
  }
];

const TestimonialsSection = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by developers worldwide
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            See what our customers are saying about Scrapeyard
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                      <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
