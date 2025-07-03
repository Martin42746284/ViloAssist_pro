import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Fonction pour scroller vers le bas
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Effet pour scroller vers le bas quand les messages changent
  useEffect(() => {
    scrollToBottom('auto');
  }, [messages]);

  // Effet pour maintenir le scroll en bas quand on tape
  useEffect(() => {
    if (isTyping) {
      scrollToBottom('smooth');
    }
  }, [isTyping]);

  // Réponses automatiques de l'IA
  const getAIResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    // Salutations
    if (msg.includes('bonjour') || msg.includes('salut') || msg.includes('hello')) {
      return 'Bonjour ! Je suis l\'assistant de VILO ASSIST-PRO. Comment puis-je vous aider aujourd\'hui ? 😊';
    }
    
    // Présentation
    if (msg.includes('qui êtes-vous') || msg.includes('vilo') || msg.includes('présentez')) {
      return 'VILO ASSIST-PRO est votre assistant virtuel professionnel basé à Madagascar, spécialisé en support administratif et services de télésecrétariat depuis plus de 5 ans.';
    }
    
    // Services
    if (msg.includes('service') || msg.includes('offre') || msg.includes('prestation')) {
      return 'Nous proposons :\n- Assistant administratif\n- Support client\n- Télésecrétariat médical/juridique\n- Gestion pré-comptable\n- Transcription audio/vidéo\n- Saisie de données\n\nLequel vous intéresse ?';
    }
    
    // Tarifs
    if (msg.includes('prix') || msg.includes('tarif') || msg.includes('coût') || msg.includes('combien')) {
      return 'Notre tarif est de 10€/heure pour tous services. Exemple :\n10h/semaine = 400€/mois\n20h/semaine = 800€/mois\n\nBesoin d\'une estimation précise ?';
    }
    
    // Contact
    if (msg.includes('contact') || msg.includes('joindre') || msg.includes('appeler')) {
      return 'Vous pouvez nous contacter :\n📞 +261 33 21 787 85\n📧 info@viloassistpro.com\n💬 WhatsApp disponible\n\nSouhaitez-vous programmer un appel ?';
    }
    
    // Délais
    if (msg.includes('délai') || msg.includes('temps') || msg.includes('disponibilité')) {
      return 'Nous intervenons sous 1-3 jours. Notre équipe est disponible du lundi au vendredi de 8h à 18h (GMT+3). Urgence ? Nous avons une option express !';
    }
    
    // Confidentialité
    if (msg.includes('confident') || msg.includes('sécurité') || msg.includes('données')) {
      return 'Nous garantissons :\n- NDA systématique\n- Chiffrement des données\n- Accès sécurisé\n\nVos informations sont 100% protégées.';
    }
    
    // Processus
    if (msg.includes('process') || msg.includes('commencer') || msg.includes('démarrage')) {
      return 'Notre processus :\n1. Appel découverte gratuit\n2. Proposition sur mesure\n3. Mise en place (1-3j)\n4. Lancement avec suivi\n\nIntéressé(e) ?';
    }
    
    // Témoignages
    if (msg.includes('client') || msg.includes('témoignage') || msg.includes('avis')) {
      return 'Nos clients disent :\n"Professionnalisme remarquable" - Marie D.\n"Réactivité exceptionnelle" - Pierre M.\n98% de satisfaction !';
    }
    
    // Urgence
    if (msg.includes('urgent') || msg.includes('immédiat') || msg.includes('rapide')) {
      return 'Pour les urgences :\n📞 +261 33 21 787 85 (dites "URGENT")\n⚡ Option express (+20%)\nDémarrage sous 24h !';
    }
    
    // Merci
    if (msg.includes('merci') || msg.includes('remercie')) {
      return 'Je vous en prie ! 😊 Pour un conseiller humain : +261 33 21 787 85. ';
    }
    
    // Au revoir
    if (msg.includes('au revoir') || msg.includes('bye') || msg.includes('à bientôt')) {
      return 'Au revoir ! Merci d\'avoir choisi VILO ASSIST-PRO. Contactez-nous au +261 33 21 787 85 pour toute question.';
    }
    
    // Réponse par défaut
    return 'Je n\'ai pas saisi votre demande. Voici ce que je peux expliquer :\n• Nos services\n• Nos tarifs (10€/h)\n• Notre processus\n• Nos garanties\n\nQuel sujet vous intéresse ?';
};
  const simulateTyping = async () => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    setIsTyping(false);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      const currentMessage = message.trim();
      setMessage('');

      await simulateTyping();

      const aiResponse = getAIResponse(currentMessage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
            size="icon"
            aria-label="Ouvrir le chat IA"
          >
            <MessageCircle className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
          </Button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <Card className="w-96 h-[500px] shadow-2xl border-0 flex flex-col animate-scale-in">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <div>
                    <CardTitle className="text-lg">Assistant IA</CardTitle>
                    <p className="text-xs opacity-90">En ligne • Répond instantanément</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8"
                  aria-label="Fermer le chat"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            {/* Messages Area - Conteneur fixe avec scroll */}
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {msg.sender === 'bot' && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                        {msg.sender === 'user' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                        <div className="flex-1">
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input Area - Fixé en bas */}
              <div className="border-t p-4 flex-shrink-0 bg-white dark:bg-gray-900">
                <div className="flex space-x-2">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tapez votre message..."
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm"
                    rows={1}
                    disabled={isTyping}
                    aria-label="Message"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isTyping}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 px-4"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-xs text-gray-500 text-center mt-2">
                  Propulsé par l'IA • Réponses instantanées
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default ChatWidget;