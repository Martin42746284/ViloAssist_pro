import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const testimonials = [
    {
      name: "Marie Dubois",
      company: "Cabinet d'Expertise Comptable",
      role: "Directrice",
      content: "VILO ASSIST-PRO nous accompagne depuis 3 ans. Leur professionnalisme et leur discrétion sont remarquables. Nous avons gagné un temps précieux sur nos tâches administratives.",
      rating: 5,
      avatar: "👩‍💼",
      bgImage: "/images/im.jpg"
    },
    {
      name: "Pierre Martin",
      company: "Consulting Digital",
      role: "CEO",
      content: "L'équipe de VILO est réactive et très compétente. Ils ont géré notre support client pendant la période de forte croissance avec une excellence remarquable.",
      rating: 5,
      avatar: "👨‍💻",
      bgImage: "/images/122.jpg"
    },
    {
      name: "Sophie Laurent",
      company: "E-commerce Fashion",
      role: "Fondatrice",
      content: "Grâce à VILO ASSIST-PRO, je peux me concentrer sur le développement de mon business. Leur assistance administrative est d'une qualité irréprochable.",
      rating: 5,
      avatar: "👩‍🚀",
      bgImage: "/images/temoin.jpg"
    },
    {
      name: "Jean Rousseau",
      company: "Cabinet Juridique",
      role: "Avocat Associé",
      content: "La confidentialité et le sérieux de VILO nous ont convaincus. Ils gèrent notre télésecrétariat avec un professionnalisme exceptionnel.",
      rating: 5,
      avatar: "⚖️",
      bgImage: "/images/rousseau.jpg"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('testimonials');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className={`text-center space-y-4 mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 bg-clip-text text-transparent">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Découvrez ce que nos clients pensent de nos services d'assistance virtuelle
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="relative rounded-xl overflow-hidden">
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center z-0"
                      style={{ backgroundImage: `url(${testimonial.bgImage})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 to-vilo-purple-900/50" />
                    </div>
                    
                    <Card className="border-0 shadow-2xl bg-transparent">
                      <CardContent className="p-8 md:p-12 text-center relative z-10">
                        <div className="mb-6">
                          <Quote className="w-12 h-12 text-vilo-purple-200 mx-auto mb-4" />
                          <div className="flex justify-center mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        
                        <blockquote className="text-lg md:text-xl text-white mb-8 italic leading-relaxed">
                          "{testimonial.content}"
                        </blockquote>
                        
                        <div className="flex items-center justify-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-vilo-purple-500 to-vilo-pink-500 rounded-full flex items-center justify-center text-2xl">
                            {testimonial.avatar}
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-white">{testimonial.name}</div>
                            <div className="text-vilo-purple-200 font-medium">{testimonial.role}</div>
                            <div className="text-gray-300 text-sm">{testimonial.company}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/80 hover:bg-white border-vilo-purple-200 shadow-lg z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/80 hover:bg-white border-vilo-purple-200 shadow-lg z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentTestimonial
                  ? 'bg-gradient-to-r from-vilo-purple-500 to-vilo-pink-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 bg-clip-text text-transparent mb-2">
              5+
            </div>
            <div className="text-gray-600 dark:text-gray-300">Années d'expérience</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 bg-clip-text text-transparent mb-2">
              150+
            </div>
            <div className="text-gray-600 dark:text-gray-300">Clients satisfaits</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 bg-clip-text text-transparent mb-2">
              98%
            </div>
            <div className="text-gray-600 dark:text-gray-300">Taux de satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;