import { Check, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';

const PricingSection = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const benefits = [
    "Tous nos services inclus",
    "Équipe expérimentée et qualifiée",
    "Confidentialité garantie",
    "Support en français",
    "Flexibilité horaire",
    "Rapport qualité-prix exceptionnel"
  ];

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Circle class
    class Circle {
      x: number;
      y: number;
      radius: number;
      dx: number;
      dy: number;
      color: string;
      opacity: number;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 3 + 1;
        this.dx = (Math.random() - 0.5) * 0.5;
        this.dy = (Math.random() - 0.5) * 0.5;
        this.color = `rgba(200, 162, 200, ${Math.random() * 0.3 + 0.1})`;
        this.opacity = Math.random() * 0.5 + 0.1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.closePath();
      }

      update(width: number, height: number) {
        if (this.x + this.radius > width || this.x - this.radius < 0) {
          this.dx = -this.dx;
        }
        if (this.y + this.radius > height || this.y - this.radius < 0) {
          this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
      }
    }

    // Create circles
    const circles: Circle[] = [];
    const circleCount = Math.floor((canvas.width * canvas.height) / 5000);

    for (let i = 0; i < circleCount; i++) {
      circles.push(new Circle(canvas.width, canvas.height));
    }

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (const circle of circles) {
        circle.update(canvas.width, canvas.height);
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section id="tarifs" className="py-20 relative overflow-hidden bg-black">
      {/* Styles CSS pour les animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.3); }
          50% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.6), 0 0 60px rgba(236, 72, 153, 0.4); }
        }
        
        @keyframes slide-in {
          from { transform: translateX(-100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .video-background {
          animation: pulse 4s ease-in-out infinite;
        }
        
        .floating-overlay {
          animation: float 6s ease-in-out infinite;
        }
        
        .gradient-animated {
          background: linear-gradient(-45deg, #000000, #1e1b4b, #581c87, #000000);
          background-size: 400% 400%;
          animation: gradient-shift 8s ease infinite;
        }
        
        .glow-card {
          animation: glow 3s ease-in-out infinite;
        }
        
        .slide-in {
          animation: slide-in 0.8s ease-out;
        }
        
        .hover-scale {
          transition: transform 0.3s ease;
        }
        
        .hover-scale:hover {
          transform: scale(1.05);
        }
      `}</style>

      {/* Canvas for animated circles */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 w-full h-full opacity-30"
      />

      {/* Background Video avec animations */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover video-background opacity-20"
        >
          <source src="/videos/9783698-uhd_4096_216025fps.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas les vidéos HTML5.
        </video>
        
        {/* Overlay avec gradient animé - maintenant plus sombre */}
        <div className="absolute inset-0 gradient-animated opacity-90" />
        
        {/* Overlay flottant avec formes géométriques - plus subtil */}
        <div className="absolute inset-0 floating-overlay">
          <div className="absolute top-20 left-20 w-32 h-32 bg-purple-900/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-pink-900/20 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-32 left-40 w-40 h-40 bg-violet-900/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-fuchsia-900/20 rounded-full blur-lg animate-bounce"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-4 mb-16 slide-in">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            Tarification Simple
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Un tarif unique et transparent pour tous nos services d'assistance virtuelle
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          {/* Carte avec fond clair et couleurs inversées */}
          <Card className="relative overflow-hidden border-2 border-purple-400/30 shadow-2xl bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-sm glow-card hover-scale">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-900 to-pink-900 animate-pulse"></div>
            
            <CardHeader className="text-center pt-8">
              <div className="flex justify-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-purple-600 text-purple-600 animate-pulse" style={{animationDelay: `${i * 0.1}s`}} />
                  ))}
                </div>
              </div>
              
              <CardTitle className="text-3xl font-bold text-gray-900">
                Tarif Unique
              </CardTitle>
              
              <div className="py-6">
                <div className="flex items-baseline justify-center">
                  <span className="text-6xl font-bold bg-gradient-to-r from-purple-900 to-pink-900 bg-clip-text text-transparent animate-pulse">
                    10€
                  </span>
                  <span className="text-2xl font-semibold text-gray-700 ml-2">
                    /heure
                  </span>
                </div>
                <p className="text-gray-600 mt-2">
                  Pour tous nos services
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 slide-in hover-scale" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-900 to-pink-900 rounded-full flex items-center justify-center animate-pulse">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-800">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-300">
                <Button 
                  onClick={scrollToContact}
                  className="w-full bg-gradient-to-r from-purple-900 to-pink-900 hover:from-purple-800 hover:to-pink-800 text-white text-lg py-6 shadow-lg hover-scale animate-pulse"
                  size="lg"
                >
                  Commencer dès maintenant
                </Button>
              </div>

              <div className="text-center text-sm text-gray-600">
                <p className="font-semibold text-purple-800">
                  Gagnez un temps précieux pour vous concentrer sur l'essentiel : 
                  le développement de votre activité !
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto shadow-lg border border-gray-800 hover-scale">
            <h3 className="text-2xl font-bold text-white mb-6 animate-pulse">
              Pourquoi choisir notre tarif unique ?
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center slide-in hover-scale" style={{animationDelay: '0.2s'}}>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-bounce">
                  <span className="text-white text-2xl">💰</span>
                </div>
                <h4 className="font-bold text-white mb-2">Transparence totale</h4>
                <p className="text-gray-300">Aucun frais caché, aucune surprise. Un tarif clair et simple.</p>
              </div>
              <div className="text-center slide-in hover-scale" style={{animationDelay: '0.4s'}}>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-bounce">
                  <span className="text-white text-2xl">⚡</span>
                </div>
                <h4 className="font-bold text-white mb-2">Simplicité</h4>
                <p className="text-gray-300">Un seul tarif pour tous nos services, facile à budgétiser.</p>
              </div>
              <div className="text-center slide-in hover-scale" style={{animationDelay: '0.6s'}}>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-bounce">
                  <span className="text-white text-2xl">🎯</span>
                </div>
                <h4 className="font-bold text-white mb-2">Qualité garantie</h4>
                <p className="text-gray-300">Le même niveau d'excellence pour chaque mission.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;