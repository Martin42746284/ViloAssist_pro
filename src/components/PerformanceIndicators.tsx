
import AnimatedCounter from './AnimatedCounter';

const PerformanceIndicators = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="text-white">
            <div className="text-4xl md:text-5xl font-bold mb-2">
              <AnimatedCounter end={500} suffix="+" className="text-white" />
            </div>
            <div className="text-lg opacity-90">Projets réalisés</div>
          </div>
          <div className="text-white">
            <div className="text-4xl md:text-5xl font-bold mb-2">
              <AnimatedCounter end={150} suffix="+" className="text-white" />
            </div>
            <div className="text-lg opacity-90">Clients satisfaits</div>
          </div>
          <div className="text-white">
            <div className="text-4xl md:text-5xl font-bold mb-2">
              <AnimatedCounter end={98} suffix="%" className="text-white" />
            </div>
            <div className="text-lg opacity-90">Taux de satisfaction</div>
          </div>
          <div className="text-white">
            <div className="text-4xl md:text-5xl font-bold mb-2">
              <AnimatedCounter end={5} suffix="+" className="text-white" />
            </div>
            <div className="text-lg opacity-90">Années d'expérience</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceIndicators;
