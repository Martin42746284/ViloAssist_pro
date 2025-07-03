import { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const FAQSection = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('faq');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      question: "Comment fonctionne la collaboration à distance ?",
      answer: "Nous utilisons des outils collaboratifs modernes (Slack, Teams, Zoom) pour maintenir une communication fluide. Chaque client a un responsable de compte dédié qui coordonne les missions et assure le suivi quotidien."
    },
    {
      question: "Quels sont vos horaires de disponibilité ?",
      answer: "Nous nous adaptons aux fuseaux horaires de nos clients. Pour l'Europe, nous sommes disponibles de 6h à 15h heure française. Des arrangements spéciaux peuvent être pris selon vos besoins."
    },
    {
      question: "Comment garantissez-vous la confidentialité ?",
      answer: "Tous nos collaborateurs signent un accord de confidentialité strict. Nous utilisons des connexions sécurisées, des VPN dédiés et nous nous conformons au RGPD pour la protection des données."
    },
    {
      question: "Quel est le délai de démarrage d'une mission ?",
      answer: "En général, nous pouvons démarrer une mission sous 48h après validation du brief. Pour des besoins urgents, nous avons une équipe de réactivité qui peut intervenir sous 24h."
    },
    {
      question: "Comment se déroule la facturation ?",
      answer: "La facturation se fait au temps passé, avec un suivi précis des heures. Vous recevez un rapport détaillé chaque semaine et une facture mensuelle. Aucun minimum d'heures n'est requis."
    },
    {
      question: "Que se passe-t-il si je ne suis pas satisfait ?",
      answer: "Votre satisfaction est notre priorité. En cas de problème, nous mettons tout en œuvre pour corriger la situation. Si le problème persiste, nous ne facturons pas les heures concernées."
    },
    {
      question: "Quelles garanties offrez-vous ?",
      answer: "Nous garantissons la qualité de nos services, le respect des délais convenus, et la confidentialité absolue. Nous avons également une assurance responsabilité civile professionnelle."
    },
    {
      question: "Puis-je demander un assistant spécialisé ?",
      answer: "Absolument ! Nous avons des spécialistes dans différents domaines (comptabilité, juridique, e-commerce, etc.). Nous assignons l'assistant le plus adapté à vos besoins spécifiques."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <section id="faq" className="relative py-20 overflow-hidden text-black">
      {/* Vidéo en arrière-plan */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/9783698-uhd_4096_2160_25fps.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la vidéo HTML5.
      </video>

      {/* Overlay gradient noir → violet → rose avec opacité */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-violet-900 to-pink-800 opacity-80 z-10 backdrop-blur-sm" />

      {/* Contenu principal */}
      <div className="relative z-20 container mx-auto px-4">
        {/* En-tête */}
        <div className={`text-center space-y-4 mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center mb-4">
            <HelpCircle className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Questions Fréquentes
          </h2>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions sur nos services d'assistance virtuelle
          </p>
        </div>

        {/* Liste des questions */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className={`bg-white/20 backdrop-blur-md border border-white/30 shadow-lg transition-all duration-700 ease-in-out transform ${
                isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-6 blur-sm'
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <CardContent className="p-0">
                <button
                  onClick={() => toggleItem(index)}
                  aria-expanded={openItems.includes(index)}
                  className={`w-full text-left px-6 py-5 flex justify-between items-center transition-colors ${
                    openItems.includes(index) ? 'bg-white/10' : 'hover:bg-white/10'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                  <div
                    className={`transition-transform duration-300 ${
                      openItems.includes(index) ? 'rotate-180' : 'rotate-0'
                    }`}
                  >
                    <ChevronDown className="w-5 h-5 text-white" />
                  </div>
                </button>

                <div className={`grid transition-all duration-500 ease-in-out ${
                  openItems.includes(index) ? 'grid-rows-[1fr] opacity-100 py-4' : 'grid-rows-[0fr] opacity-0'
                }`}>
                  <div className="overflow-hidden px-6 pt-0">
                    <div className="border-t border-white/20 pt-4">
                      <p className="text-white leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-white mb-4">Vous ne trouvez pas la réponse à votre question ?</p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-3 rounded-lg font-medium transition-colors hover:bg-white/30"
          >
            Contactez-nous directement
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;