import { useState } from 'react';
import { Calendar, Clock, User, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useAppointments } from '@/hooks/useAppointments';
import { toast } from '@/hooks/use-toast';

const AppointmentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [client_name, setClientName] = useState<string>('');
  const [client_email, setClientEmail] = useState<string>('');
  const { createAppointment, isLoading } = useAppointments();

  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const handleBooking = async () => {
    if (selectedDate && selectedTime && client_name && client_email) {
      const result = await createAppointment(
        client_name,    
        client_email,
        selectedDate,
        selectedTime 
      );
      
      if (result) {
        toast({
            title: "Rendez-vous envoyé",
            description: "Vous pouvez maintenant vous connecter",
        });
        // Réinitialiser le formulaire
        setClientName('');
        setClientEmail('');
        setSelectedTime('');
        setSelectedDate(new Date());
      }
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || date.getDay() === 0 || date.getDay() === 6;
  };

  return (
    <section id="appointment" className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/10915129-hd_3840_2160_30fps.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas les vidéos HTML5.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 bg-clip-text text-transparent mb-4">
            Prenez rendez-vous
          </h2>
          <p className="text-xl text-gray-200 dark:text-gray-300 max-w-2xl mx-auto">
            Réservez directement un créneau pour discuter de vos besoins
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Calendrier */}
          <Card className="hover:shadow-lg transition-shadow duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-vilo-purple-600" />
                Choisissez une date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDateDisabled}
                className="rounded-md border"
              />
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Du lundi au vendredi uniquement
              </p>
            </CardContent>
          </Card>

          {/* Créneaux horaires et informations client */}
          <Card className="hover:shadow-lg transition-shadow duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-vilo-purple-600" />
                Informations de rendez-vous
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Informations client */}
              <div className="space-y-3">
                <div>
                  <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom complet *
                  </label>
                  <input
                    id="client_name"
                    type="text"
                    value={client_name}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Votre nom complet"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vilo-purple-500 focus:border-transparent dark:bg-gray-700/50 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    id="client_email"
                    type="email"
                    value={client_email}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vilo-purple-500 focus:border-transparent dark:bg-gray-700/50 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Créneaux horaires */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Choisissez un horaire *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                      className={`transition-all duration-200 ${
                        selectedTime === time 
                          ? "bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 transform scale-105" 
                          : "hover:scale-105"
                      }`}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedDate && selectedTime && client_name && client_email && (
                <div className="mt-6 p-4 bg-vilo-purple-50/80 dark:bg-vilo-purple-900/30 rounded-lg border border-vilo-purple-200 dark:border-vilo-purple-700">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    <span className="font-medium">Récapitulatif</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Client :</strong> {client_name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Email :</strong> {client_email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <strong>Rendez-vous :</strong> {selectedDate.toLocaleDateString('fr-FR')} à {selectedTime}
                  </p>
                  <Button 
                    onClick={handleBooking}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 hover:from-vilo-purple-700 hover:to-vilo-pink-700 transform hover:scale-105 transition-all duration-200"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {isLoading ? 'Enregistrement...' : 'Confirmer le rendez-vous'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AppointmentCalendar;