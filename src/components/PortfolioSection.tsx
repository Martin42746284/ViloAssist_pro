import { useState, useEffect } from 'react';
import { TrendingUp, Users, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PortfolioSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCase, setSelectedCase] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('portfolio');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const caseStudies = [
    {
      title: "Cabinet d'Expertise Comptable",
      industry: "Services Financiers",
      challenge: "Surcharge administrative pendant la saison fiscale",
      solution: "Mise en place d'une équipe de 3 assistants pour la saisie comptable et le support client",
      results: [
        "Réduction de 60% du temps de traitement",
        "100% des déclarations traitées dans les délais",
        "Amélioration de 40% de la satisfaction client"
      ],
      duration: "6 mois",
      team: "3 assistants",
      savings: "15 000€"
    },
    {
      title: "E-commerce Mode",
      industry: "Commerce en ligne",
      challenge: "Gestion du service client et des commandes en forte croissance",
      solution: "Support client 6j/7 et assistance administrative pour la logistique",
      results: [
        "Temps de réponse client réduit à 2h",
        "Croissance de 80% du CA",
        "Taux de satisfaction de 98%"
      ],
      duration: "12 mois",
      team: "2 assistants",
      savings: "25 000€"
    },
    {
      title: "Cabinet Juridique",
      industry: "Services Juridiques",
      challenge: "Télésecrétariat et gestion des dossiers clients",
      solution: "Assistante dédiée pour l'accueil téléphonique et le suivi administratif",
      results: [
        "0% d'appels manqués",
        "Organisation optimisée des plannings",
        "Confidentialité absolue maintenue"
      ],
      duration: "18 mois",
      team: "1 assistante",
      savings: "20 000€"
    }
  ];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="portfolio" className="relative py-20 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/2397246-hd_1920_1080_24fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 to-vilo-purple-900/50" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center space-y-4 mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Études de Cas
          </h2>
          <p className="text-xl text-vilo-purple-200 max-w-2xl mx-auto">
            Découvrez comment nous avons aidé nos clients à atteindre leurs objectifs
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {caseStudies.map((caseStudy, index) => (
              <button
                key={index}
                onClick={() => setSelectedCase(index)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedCase === index
                    ? 'bg-gradient-to-r from-vilo-purple-400 to-vilo-pink-500 text-white shadow-lg'
                    : 'bg-white/90 text-gray-700 hover:bg-white border border-white/20 backdrop-blur-sm'
                }`}
              >
                {caseStudy.industry}
              </button>
            ))}
          </div>

          <div className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <Card className="border-0 shadow-2xl overflow-hidden bg-white/40 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 text-white p-8">
                <CardHeader className="p-0">
                  <CardTitle className="text-3xl font-bold mb-2">
                    {caseStudies[selectedCase].title}
                  </CardTitle>
                  <p className="text-vilo-purple-100 text-lg">
                    {caseStudies[selectedCase].industry}
                  </p>
                </CardHeader>
              </div>

              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                        🎯 Défi
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {caseStudies[selectedCase].challenge}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                        💡 Solution
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {caseStudies[selectedCase].solution}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <TrendingUp className="w-6 h-6 mr-2 text-vilo-purple-600" />
                        Résultats
                      </h4>
                      <div className="space-y-3">
                        {caseStudies[selectedCase].results.map((result, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                            <span className="text-gray-700">{result}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4">
                      <div className="text-center bg-vilo-purple-50 rounded-lg p-4">
                        <Clock className="w-8 h-8 text-vilo-purple-600 mx-auto mb-2" />
                        <div className="font-bold text-gray-800">{caseStudies[selectedCase].duration}</div>
                        <div className="text-sm text-gray-600">Durée</div>
                      </div>
                      <div className="text-center bg-vilo-purple-50 rounded-lg p-4">
                        <Users className="w-8 h-8 text-vilo-purple-600 mx-auto mb-2" />
                        <div className="font-bold text-gray-800">{caseStudies[selectedCase].team}</div>
                        <div className="text-sm text-gray-600">Équipe</div>
                      </div>
                      <div className="text-center bg-vilo-purple-50 rounded-lg p-4">
                        <TrendingUp className="w-8 h-8 text-vilo-purple-600 mx-auto mb-2" />
                        <div className="font-bold text-gray-800">{caseStudies[selectedCase].savings}</div>
                        <div className="text-sm text-gray-600">Économies</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                  <p className="text-gray-600 mb-4">
                    Votre projet mérite une approche sur mesure
                  </p>
                  <Button 
                    onClick={scrollToContact}
                    className="bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 hover:from-vilo-purple-700 hover:to-vilo-pink-700 text-white shadow-lg"
                  >
                    Discutons de votre projet
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;