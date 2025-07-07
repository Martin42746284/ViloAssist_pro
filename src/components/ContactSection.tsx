import { Mail, MessageCircle, MapPin, Clock, Phone, Star, Zap, Shield, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ContactForm from './ContactForm';

const ContactSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleWhatsApp = () => {
    window.open('https://wa.me/261332178785', '_blank');
  };

  const handleEmail = () => {
    const email = 'manampisoa.m@zurcher.edu.mg';
    const subject = encodeURIComponent('Demande de contact');
    const body = encodeURIComponent('Bonjour,\n\nJe vous contacte depuis votre site web.\n\nCordialement,');

    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;

    try {
      if (navigator.onLine) {
        window.open(gmailURL, '_blank');
      } else {
        alert("Veuillez vérifier votre connexion Internet avant d'envoyer un message.");
      }
    } catch (error) {
      console.error("Erreur lors de l'ouverture de Gmail :", error);
      alert("Impossible d'ouvrir Gmail. Veuillez nous contacter manuellement à : " + email);
    }
  };

  const handlePhone = () => {
    window.location.href = 'tel:+261332178785';
  };

  const contactCards = [
    {
      id: 'email',
      icon: Mail,
      title: 'Email Professionnel',
      info: 'manampisoa.m@zurcher.edu.mg',
      action: 'Nous écrire',
      color: 'from-violet-500 to-purple-500',
      actionColor: 'text-violet-600 hover:text-violet-500',
      handler: handleEmail
    },
    {
      id: 'whatsapp',
      icon: MessageCircle,
      title: 'WhatsApp Business',
      info: '+261 33 21 787 85',
      action: 'Discuter maintenant',
      color: 'from-green-500 to-emerald-500',
      actionColor: 'text-green-600 hover:text-green-500',
      handler: handleWhatsApp
    },
    {
      id: 'phone',
      icon: Phone,
      title: 'Appel Direct',
      info: '+261 33 21 787 85',
      action: 'Appeler',
      color: 'from-blue-500 to-cyan-500',
      actionColor: 'text-blue-600 hover:text-blue-500',
      handler: handlePhone
    }
  ];

  const benefits = [
    {
      icon: Star,
      title: 'Tarif Transparent',
      description: '10€/heure pour tous services',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Zap,
      title: 'Réponse Ultra-Rapide',
      description: 'Devis sous 24h garanties',
      color: 'from-violet-500 to-purple-500'
    },
    {
      icon: Shield,
      title: 'Sécurité Maximale',
      description: 'Données 100% protégées',
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-40"
        >
          <source src="/videos/3195532-uhd_3840_2160_25fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-gray-900/70 to-violet-900/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-violet-900/40 via-transparent to-black/30"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* En-tête avec animation */}
        <div className="text-center space-y-6 mb-20">
          <div className="inline-flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-violet-300/50">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-white">Disponible maintenant</span>
          </div>
          
          {/* Gradient modifié blanc-orange */}
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent leading-tight">
  Contactez notre équipe</h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Prêt à déléguer vos tâches et à vous concentrer sur l'essentiel ? 
            Contactez-nous dès aujourd'hui pour discuter de vos besoins.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {/* Informations de contact - Fonds moins blancs et plus transparents */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/70 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg mr-3 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                Nos coordonnées
              </h3>
              
              <div className="space-y-4">
                {contactCards.map((card) => {
                  const IconComponent = card.icon;
                  return (
                    <Card 
                      key={card.id}
                      className={`border-gray-200 hover:border-violet-300 transition-all duration-500 hover:shadow-xl bg-white/80 backdrop-blur-sm ${hoveredCard === card.id ? 'shadow-xl scale-[1.02]' : ''}`}
                      onMouseEnter={() => setHoveredCard(card.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-sm mb-1">{card.title}</h4>
                            <p className="text-gray-600 text-sm mb-2">{card.info}</p>
                            <Button 
                              variant="link" 
                              className={`p-0 h-auto ${card.actionColor} text-sm font-semibold`}
                              onClick={card.handler}
                            >
                              {card.action} →
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Informations pratiques - Fonds moins blancs */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="border-gray-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Adresse</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        LOT IPF 023 Ambohijafy<br />
                        Bemasoandro<br />
                        Antananarivo, Madagascar
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Horaires</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Lun - Ven : 8h - 18h<br />
                        Sam : 9h - 15h<br />
                        Dim : Sur rendez-vous
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Boutons d'action rapide */}
            <div className="space-y-3">
              <Button 
                onClick={handleWhatsApp}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Contact rapide WhatsApp
              </Button>
              
              <Button 
                onClick={handleEmail}
                variant="outline"
                className="w-full border-2 border-violet-400/60 text-violet-600 hover:bg-violet-500/10 hover:text-violet-700 py-4 rounded-xl font-semibold hover:border-violet-500 transition-all duration-300"
              >
                <Mail className="mr-2 w-5 h-5" />
                Envoyer un email
              </Button>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="lg:col-span-3">
            <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-violet-300/30">
              <ContactForm />
            </div>
          </div>
        </div>

        {/* Section des avantages */}
        <div className="mt-20">
          <div className="bg-black/70 backdrop-blur-sm rounded-3xl shadow-2xl p-10 max-w-5xl mx-auto border border-violet-300/30">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-violet-300 bg-clip-text text-transparent mb-4">
                Pourquoi choisir VILO ASSIST-PRO ?
              </h3>
              <p className="text-gray-300 text-lg">L'excellence au service de votre productivité</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div 
                    key={index}
                    className="text-center group hover:transform hover:scale-105 transition-all duration-500"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold text-white text-lg mb-2">{benefit.title}</h4>
                    <p className="text-gray-300">{benefit.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 p-6 bg-gradient-to-r from-violet-900/50 to-purple-900/50 rounded-2xl border border-violet-400/30">
              <div className="flex items-center justify-center space-x-2 text-violet-300 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Engagement qualité</span>
              </div>
              <p className="text-center text-gray-300 text-sm">
                Satisfaction garantie ou nous continuons jusqu'à ce que vous soyez 100% satisfait
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;