
import { useState, useEffect } from 'react';
import { Users, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TrustNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    "🎉 15 personnes nous ont contacté cette semaine",
    "⭐ 98% de nos clients nous recommandent",
    "🚀 Plus de 500 projets réalisés avec succès",
    "💼 Certification qualité ISO 9001"
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    const messageTimer = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearInterval(messageTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 animate-slide-in-left">
      <Card className="max-w-sm shadow-lg border-l-4 border-l-vilo-purple-600 bg-white dark:bg-gray-800">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-vilo-purple-600 flex-shrink-0" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {messages[currentMessage]}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrustNotification;
