import { useEffect, useState, useRef } from 'react';
import { Users, Globe, Award, Shield, Heart, Target, MapPin, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (isVideoLoaded) {
            videoRef.current?.play().catch(e => console.log("Auto-play prevented", e));
          }
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('about');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, [isVideoLoaded]);

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
    if (isVisible) {
      videoRef.current?.play().catch(e => console.log("Auto-play prevented", e));
    }
  };

  const values = [
    {
      icon: Shield,
      title: "Confidentialité",
      description: "Respect absolu de la confidentialité de vos données et informations",
      gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      shadowColor: "shadow-emerald-500/50",
      hoverGlow: "group-hover:shadow-emerald-400/80"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Engagement constant vers la qualité et l'amélioration continue",
      gradient: "from-amber-400 via-orange-500 to-red-500",
      shadowColor: "shadow-amber-500/50",
      hoverGlow: "group-hover:shadow-amber-400/80"
    },
    {
      icon: Heart,
      title: "Relation humaine",
      description: "Proximité et écoute pour une collaboration personnalisée",
      gradient: "from-rose-400 via-pink-500 to-purple-600",
      shadowColor: "shadow-rose-500/50",
      hoverGlow: "group-hover:shadow-rose-400/80"
    },
    {
      icon: Target,
      title: "Efficacité",
      description: "Solutions pratiques et résultats mesurables pour votre business",
      gradient: "from-violet-400 via-purple-500 to-indigo-600",
      shadowColor: "shadow-violet-500/50",
      hoverGlow: "group-hover:shadow-violet-400/80"
    }
  ];

  const teamImages = [
    "/images/devenir-chef-d-entreprise.jpg",
    "/images/istockphoto-627909282-612x612-1.jpg",
    "/images/dg.jpg",
    "/images/secretaire-commercial.jpg"
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 relative overflow-hidden">
      {/* Video Background amélioré */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={handleVideoLoaded}
          className="w-full h-full object-cover opacity-20 transition-opacity duration-1000"
          style={{ opacity: isVideoLoaded ? 0.2 : 0 }}
        >
          <source src="/videos/9669111-hd_1080_1920_25fps.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas les vidéos HTML5.
        </video>
        
        {/* Fallback image si la vidéo ne charge pas */}
        {!isVideoLoaded && (
          <img
            src="/images/fallback-bg.jpg"
            alt="Background fallback"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        )}
        
        {/* Overlay amélioré */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-slate-900/80 to-gray-800/90"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className={`text-center space-y-6 mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm px-6 py-2 rounded-full border border-purple-500/30">
            <MapPin className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-medium">Basée à Antananarivo, Madagascar</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            À propos de VILO ASSIST-PRO
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Votre partenaire de confiance pour l'assistance virtuelle depuis Madagascar. 
            Une équipe passionnée au service de votre réussite.
          </p>
        </div>

        {/* Hero Image Section */}
        <div className={`mb-20 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-800 to-blue-800 p-8 border border-purple-500/20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white space-y-6">
                <h3 className="text-4xl font-bold">
                  5+ Années d'Excellence
                </h3>
                <p className="text-xl opacity-90 leading-relaxed">
                  Depuis notre création, nous avons bâti notre réputation sur la qualité, 
                  la fiabilité et l'innovation dans l'assistance virtuelle.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {teamImages.slice(0, 4).map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Team member ${index + 1}`}
                        className="w-12 h-12 rounded-full border-3 border-purple-400 object-cover shadow-lg"
                      />
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">Notre équipe dédiée</div>
                    <div className="opacity-75">10+ professionnels experts</div>
                  </div>
                </div>
              </div>
              <div className="relative">
  <video
    autoPlay
    muted
    loop
    playsInline
    className="rounded-2xl shadow-xl object-cover w-full h-80 lg:h-96"
  >
    <source src="/videos/3626148-uhd_4096_2160_25fps.mp4" type="video/mp4" />
    Votre navigateur ne supporte pas les vidéos HTML5.
  </video>
  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 to-transparent"></div>
</div>
            </div>
          </div>
        </div>

        {/* Story and Mission */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="space-y-6">
              <h3 className="text-4xl font-bold text-white flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-400" />
                Notre Histoire
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Fondée il y a plus de 5 ans, VILO ASSIST-PRO est née de la vision de créer un pont 
                entre l'expertise malgache et les besoins des entreprises francophones. Basée à 
                Antananarivo, notre équipe combine savoir-faire local et standards internationaux.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Nous avons accompagné plus de 100 clients dans leur croissance en leur offrant 
                des services d'assistance virtuelle de haute qualité, tout en maintenant des 
                tarifs compétitifs grâce à notre implantation stratégique à Madagascar.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-6 pt-6">
              <div className="text-center bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-purple-500/20 transform hover:scale-105 transition-all duration-500 group">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-2xl shadow-purple-500/50 group-hover:shadow-purple-400/70 transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110">
                    <Users className="w-10 h-10 text-white drop-shadow-lg" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                  </div>
                </div>
                <div className="font-bold text-3xl text-white mb-1 group-hover:text-purple-400 transition-colors">10+</div>
                <div className="text-sm text-gray-400 font-medium">Collaborateurs</div>
              </div>
              <div className="text-center bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-blue-500/20 transform hover:scale-105 transition-all duration-500 group">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-2xl shadow-blue-500/50 group-hover:shadow-cyan-400/70 transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110">
                    <Globe className="w-10 h-10 text-white drop-shadow-lg" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                  </div>
                </div>
                <div className="font-bold text-3xl text-white mb-1 group-hover:text-cyan-400 transition-colors">3</div>
                <div className="text-sm text-gray-400 font-medium">Continents</div>
              </div>
              <div className="text-center bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-emerald-500/20 transform hover:scale-105 transition-all duration-500 group">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-2xl shadow-emerald-500/50 group-hover:shadow-green-400/70 transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110">
                    <Award className="w-10 h-10 text-white drop-shadow-lg" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                  </div>
                </div>
                <div className="font-bold text-3xl text-white mb-1 group-hover:text-emerald-400 transition-colors">5+</div>
                <div className="text-sm text-gray-400 font-medium">Années</div>
              </div>
            </div>
          </div>

          <div className={`space-y-6 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="/images/image.jpg"
                alt="Bureau moderne VILO ASSIST-PRO"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-800/95 to-pink-800/95 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <h4 className="text-3xl font-bold mb-6">Notre Mission</h4>
                  <p className="text-lg leading-relaxed mb-6">
                    Permettre aux entrepreneurs et entreprises de se concentrer sur leur cœur de métier 
                    en déléguant leurs tâches administratives à une équipe compétente et fiable.
                  </p>
                  <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                    <p className="text-center font-semibold italic text-lg">
                      "Votre succès est notre priorité. Ensemble, nous construisons votre avenir."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team showcase */}
        <div className={`mb-20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-4">Notre Équipe Dédiée</h3>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Des professionnels passionnés et expérimentés, unis par la même vision : votre réussite.
            </p>
          </div>
          
          <div className="flex justify-center items-center gap-4 flex-wrap">
            {teamImages.map((img, index) => (
              <div
                key={index}
                className="relative group cursor-pointer transform transition-all duration-300 hover:scale-110"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={img}
                  alt={`Membre de l'équipe ${index + 1}`}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-purple-400 shadow-lg group-hover:shadow-xl"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300"></div>
              </div>
            ))}
            {/* <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg border-4 border-purple-400">
              +6
            </div> */}
          </div>
        </div>

        {/* Values */}
        <div className="space-y-12">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-white mb-4">Nos Valeurs</h3>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Les principes qui guident chacune de nos actions et décisions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className={`border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-110 hover:-translate-y-4 bg-gray-800/90 backdrop-blur-sm group cursor-pointer overflow-hidden relative border border-gray-700/50 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                } ${value.shadowColor} ${value.hoverGlow}`}
                style={{ transitionDelay: `${600 + index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-20 transition-all duration-700`}></div>
                
                <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="absolute top-4 left-4 w-2 h-2 bg-white/50 rounded-full animate-ping"></div>
                  <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute bottom-6 left-8 w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                </div>

                <CardContent className="p-8 text-center relative z-10">
                  <div className="relative mb-6">
                    <div className={`w-24 h-24 bg-gradient-to-br ${value.gradient} rounded-3xl mx-auto flex items-center justify-center shadow-2xl transform transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 ${value.shadowColor} ${value.hoverGlow}`}>
                      <value.icon className="w-12 h-12 text-white drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500" />
                      
                      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-60 transition-all duration-700 blur-xl transform scale-150`}></div>
                      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-30 transition-all duration-700 blur-2xl transform scale-200`}></div>
                    </div>
                    
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                      <div className={`absolute top-0 left-1/2 w-3 h-3 bg-gradient-to-r ${value.gradient} rounded-full transform -translate-x-1/2 animate-spin`} style={{transformOrigin: '50% 48px', animationDuration: '3s'}}></div>
                      <div className={`absolute top-1/2 right-0 w-2 h-2 bg-gradient-to-r ${value.gradient} rounded-full transform -translate-y-1/2 animate-spin`} style={{transformOrigin: '-48px 50%', animationDuration: '4s', animationDirection: 'reverse'}}></div>
                    </div>
                  </div>
                  
                  <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-500" 
                      style={{backgroundImage: `linear-gradient(to right, ${value.gradient.split(' ')[0]} var(--tw-gradient-stops))`}}>
                    {value.title}
                  </h4>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {value.description}
                  </p>
                  
                  <div className={`w-0 h-1 bg-gradient-to-r ${value.gradient} mx-auto mt-4 group-hover:w-full transition-all duration-700 rounded-full`}></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Office location showcase */}
        <div className={`mt-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden group">
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
              <img
                src="/images/images.jpg"
                alt="Antananarivo cityscape"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-cyan-400/30 to-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-400/30 to-pink-600/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-emerald-400/30 to-teal-600/30 rounded-full blur-2xl animate-bounce" style={{animationDelay: '2s'}}></div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-cyan-500/50 group-hover:shadow-cyan-400/70 transition-all duration-700 transform group-hover:rotate-12 group-hover:scale-110">
                  <MapPin className="w-12 h-12 text-white drop-shadow-2xl animate-bounce" />
                  
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl transform scale-150"></div>
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl transform scale-200"></div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 border-2 border-cyan-400/50 rounded-full animate-ping"></div>
                  <div className="absolute w-32 h-32 border border-blue-400/30 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h4 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-200 bg-clip-text text-transparent">
                Basés à Antananarivo
              </h4>
              <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                Depuis le cœur de Madagascar, nous servons nos clients à travers le monde, 
                combinant proximité culturelle francophone et excellence technique.
              </p>
              
              {/* <div className="flex justify-center mt-8 space-x-4">
                <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <span className="text-cyan-300 font-medium">🌍 International</span>
                </div>
                <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <span className="text-blue-300 font-medium">🇫🇷 Francophone</span>
                </div>
                <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <span className="text-purple-300 font-medium">⚡ 24/7</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;