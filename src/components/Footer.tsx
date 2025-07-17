import { Mail, MessageCircle, MapPin } from 'lucide-react';
import { useEffect } from 'react';

const Footer = () => {
  const handleWhatsApp = () => {
    const phoneNumber = '261332178785';
    const message = encodeURIComponent("Bonjour, je souhaite parler avec vous concernant Vilo Assist Pro.");
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
    window.open(url, '_blank');
  };

  const handleEmail = () => {
    const email = 'heritiana.l@zurcher.edu.mg';
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

  useEffect(() => {
    const video = document.createElement('video');
    video.src = '/videos/10915129-hd_3840_2160_30fps.mp4';
    video.load();
  }, []);

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/10915129-hd_3840_2160_30fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70" />
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Bloc 1 - À propos */}
          <div className="space-y-3 bg-white/50 p-4 rounded-xl shadow-lg backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-black rounded-xl overflow-hidden flex items-center justify-center">
                <img 
                  src="../public/Blue and White vintage School Logo.png" 
                  alt="Logo VILO ASSIST-PRO" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-800 via-violet-600 to-red-600 bg-clip-text text-transparent">
                VILO ASSIST-PRO
              </span>
            </div>
            <p className="text-gray-800 leading-relaxed text-sm">
              Votre partenaire d'assistance virtuelle depuis Madagascar. 
              Plus de 5 ans d'expérience au service des professionnels francophones.
            </p>
          </div>

          {/* Bloc 2 - Services */}
          <div className="space-y-3 bg-white/50 p-4 rounded-xl shadow-lg backdrop-blur-sm">
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-800 via-violet-600 to-red-600 bg-clip-text text-transparent">
              Nos Services
            </h3>
            <div className="space-y-2 text-gray-800 text-sm">
              <p>• Assistant administratif</p>
              <p>• Support client</p>
              <p>• Télésecrétariat</p>
              <p>• Gestion financière</p>
              <p>• Et bien plus...</p>
            </div>
          </div>

          {/* Bloc 3 - Contact */}
          <div className="space-y-4 bg-white/50 p-5 rounded-xl shadow-lg backdrop-blur-sm">
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-800 via-violet-600 to-red-600 bg-clip-text text-transparent">
              Contact
            </h3>
            <div className="space-y-2 text-gray-800 text-sm">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-pink-600" />
                <span>info@viloassistpro.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-4 h-4 text-pink-600" />
                <span>+261 33 21 787 85</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-pink-600 mt-0.5" />
                <span>
                  LOT IPF 023 Ambohijafy Bemasoandro<br />
                  Antananarivo, Madagascar
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bas de page */}
        <div className="border-t border-gray-300 mt-6 pt-4 bg-white/50 p-4 rounded-xl shadow-md backdrop-blur-sm">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-center md:text-left text-gray-800 text-sm">
              © {new Date().getFullYear()} VILO ASSIST-PRO. Tous droits réservés.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={handleEmail}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg transition-colors text-sm text-gray-800"
              >
                Nous écrire
              </button>
              <button 
                onClick={handleWhatsApp}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-3 py-2 rounded-lg transition-colors text-sm text-white"
              >
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;