import { Mail, MessageCircle, MapPin, Clock, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ContactForm from './ContactForm';

const ContactSection = () => {
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
        console.log('Ouverture de Gmail…');
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

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 to-vilo-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 bg-clip-text text-transparent">
            Contactez-nous
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Prêt à déléguer vos tâches et à vous concentrer sur l'essentiel ? 
            Contactez-nous dès aujourd'hui pour discuter de vos besoins.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Coordonnées organisées en colonne */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Nos coordonnées
            </h3>
            
            {/* Email */}
            <Card className="border-vilo-purple-100 hover:border-vilo-purple-300 transition-all duration-300 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-vilo-purple-500 to-vilo-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm">Email</h4>
                    <p className="text-gray-600 text-sm">info@viloassistpro.com</p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-vilo-purple-600 hover:text-vilo-purple-700 text-xs"
                      onClick={handleEmail}
                    >
                      Nous écrire →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp */}
            <Card className="border-vilo-purple-100 hover:border-vilo-purple-300 transition-all duration-300 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm">WhatsApp</h4>
                    <p className="text-gray-600 text-sm">+261 33 21 787 85</p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-green-600 hover:text-green-700 text-xs"
                      onClick={handleWhatsApp}
                    >
                      Discuter →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Téléphone */}
            <Card className="border-vilo-purple-100 hover:border-vilo-purple-300 transition-all duration-300 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm">Téléphone</h4>
                    <p className="text-gray-600 text-sm">+261 33 21 787 85</p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-blue-600 hover:text-blue-700 text-xs"
                      onClick={handlePhone}
                    >
                      Appeler →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Adresse */}
            <Card className="border-vilo-purple-100">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-vilo-purple-500 to-vilo-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">Adresse</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      LOT IPF 023 Ambohijafy<br />
                      Bemasoandro<br />
                      Antananarivo, Madagascar
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Horaires */}
            <Card className="border-vilo-purple-100">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">Horaires</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Lun - Ven : 8h - 18h<br />
                      Sam : 9h - 15h<br />
                      Dim : Sur rendez-vous
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <div className="space-y-3 pt-4">
              <Button 
                onClick={handleWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <MessageCircle className="mr-2 w-4 h-4" />
                Contact rapide WhatsApp
              </Button>
              
              <Button 
                onClick={handleEmail}
                variant="outline"
                className="w-full border-vilo-purple-300 text-vilo-purple-700 hover:bg-vilo-purple-50"
                size="sm"
              >
                <Mail className="mr-2 w-4 h-4" />
                Envoyer un email
              </Button>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

        {/* Informations complémentaires */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto border border-vilo-purple-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Pourquoi choisir VILO ASSIST-PRO ?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="w-12 h-12 bg-gradient-to-br from-vilo-purple-500 to-vilo-pink-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <p className="font-semibold text-vilo-purple-700">Tarif unique</p>
                <p className="text-gray-600">10€/heure pour tous services</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-gradient-to-br from-vilo-purple-500 to-vilo-pink-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-bold">⚡</span>
                </div>
                <p className="font-semibold text-vilo-purple-700">Réponse rapide</p>
                <p className="text-gray-600">Devis sous 24h garanties</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-gradient-to-br from-vilo-purple-500 to-vilo-pink-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-bold">🔒</span>
                </div>
                <p className="font-semibold text-vilo-purple-700">Confidentialité</p>
                <p className="text-gray-600">Données 100% sécurisées</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
