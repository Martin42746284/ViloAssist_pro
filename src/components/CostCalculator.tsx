
import { useState, useEffect } from 'react';
import { Calculator, Clock, Euro, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CostCalculator = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
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

    const section = document.getElementById('calculator');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const services = [
    { id: 'admin', name: 'Assistant administratif', baseRate: 10 },
    { id: 'support', name: 'Support client', baseRate: 10 },
    { id: 'telesecretary', name: 'Télésecrétariat', baseRate: 10 },
    { id: 'accounting', name: 'Gestion financière', baseRate: 10 },
    { id: 'social', name: 'Community management', baseRate: 10 },
    { id: 'data', name: 'Saisie de données', baseRate: 10 },
    { id: 'translation', name: 'Traduction', baseRate: 10 },
    { id: 'research', name: 'Recherche web', baseRate: 10 }
  ];

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculateCost = () => {
    const totalHourlyRate = selectedServices.length * 10; // 10€ per service per hour
    const weeklyTotal = totalHourlyRate * hoursPerWeek;
    const monthlyTotal = weeklyTotal * 4.33; // Average weeks per month
    const yearlyTotal = monthlyTotal * 12;

    return {
      hourlyRate: totalHourlyRate,
      weeklyTotal: Math.round(weeklyTotal * 100) / 100,
      monthlyTotal: Math.round(monthlyTotal * 100) / 100,
      yearlyTotal: Math.round(yearlyTotal * 100) / 100,
      savings: Math.round((yearlyTotal * 0.4) * 100) / 100 // Estimated savings vs in-house
    };
  };

  const costs = calculateCost();

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="calculator" className="py-20 bg-gradient-to-br from-vilo-purple-50 to-vilo-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className={`text-center space-y-4 mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center mb-4">
            <Calculator className="w-16 h-16 text-vilo-purple-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 bg-clip-text text-transparent">
            Calculateur de Coût
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Estimez le coût de vos besoins en assistance virtuelle en quelques clics
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Configuration */}
          <Card className={`shadow-xl transition-all duration-1000 dark:bg-gray-800 dark:border-gray-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Configurez vos besoins
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Services souhaités (10€/h par service) :
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        selectedServices.includes(service.id)
                          ? 'bg-gradient-to-r from-vilo-purple-500 to-vilo-pink-500 text-white shadow-lg scale-105'
                          : 'bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-vilo-purple-300 dark:hover:border-vilo-purple-400'
                      }`}
                    >
                      {service.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Heures par semaine : {hoursPerWeek}h
                </label>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="5"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #ec4899 ${(hoursPerWeek - 5) / 35 * 100}%, #e5e7eb ${(hoursPerWeek - 5) / 35 * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>5h</span>
                  <span>20h</span>
                  <span>40h</span>
                </div>
              </div>

              <div className="bg-vilo-purple-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Services sélectionnés :</h4>
                {selectedServices.length > 0 ? (
                  <div className="space-y-1">
                    {selectedServices.map(serviceId => {
                      const service = services.find(s => s.id === serviceId);
                      return (
                        <div key={serviceId} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700 dark:text-gray-300">{service?.name}</span>
                          <span className="text-vilo-purple-600 dark:text-vilo-purple-400 font-medium">
                            10€/h
                          </span>
                        </div>
                      );
                    })}
                    <div className="border-t pt-2 mt-2 border-gray-300 dark:border-gray-600">
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-gray-800 dark:text-gray-200">Total par heure :</span>
                        <span className="text-vilo-purple-600 dark:text-vilo-purple-400">
                          {costs.hourlyRate}€/h
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Sélectionnez au moins un service</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Résultats */}
          <Card className={`shadow-xl transition-all duration-1000 dark:bg-gray-800 dark:border-gray-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Estimation des coûts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border-2 border-vilo-purple-200 dark:border-vilo-purple-400">
                  <Clock className="w-8 h-8 text-vilo-purple-600 dark:text-vilo-purple-400 mb-2" />
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{costs.hourlyRate}€</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">par heure</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {selectedServices.length} service(s) × 10€
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border-2 border-vilo-purple-200 dark:border-vilo-purple-400">
                  <Euro className="w-8 h-8 text-vilo-purple-600 dark:text-vilo-purple-400 mb-2" />
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{costs.weeklyTotal}€</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">par semaine</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {hoursPerWeek}h × {costs.hourlyRate}€
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-vilo-purple-500 to-vilo-pink-500 rounded-lg p-6 text-white">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{costs.monthlyTotal}€</div>
                  <div className="text-vilo-purple-100">par mois</div>
                  <div className="text-xs text-vilo-purple-200 mt-1">
                    {costs.weeklyTotal}€ × 4.33 semaines
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-gray-700 dark:text-gray-300">Coût annuel estimé</span>
                  <span className="font-bold text-gray-800 dark:text-gray-100">{costs.yearlyTotal}€</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700 dark:text-gray-300 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                    Économies vs employé interne
                  </span>
                  <span className="font-bold text-green-600">+{costs.savings}€</span>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Avantages inclus :</h4>
                <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                  <li>✓ Pas de charges sociales</li>
                  <li>✓ Pas de congés payés</li>
                  <li>✓ Pas de formation initiale</li>
                  <li>✓ Flexibilité totale</li>
                  <li>✓ Support technique inclus</li>
                </ul>
              </div>

              <Button 
                onClick={scrollToContact}
                className="w-full bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 hover:from-vilo-purple-700 hover:to-vilo-pink-700 text-white py-6 text-lg"
                disabled={selectedServices.length === 0}
              >
                Obtenir un devis personnalisé
              </Button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                *Estimation basée sur nos tarifs standards. Devis personnalisé gratuit et sans engagement.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CostCalculator;
