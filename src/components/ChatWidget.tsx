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

  // Fonction pour normaliser le texte et gérer les fautes de frappe
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
      .replace(/[^a-z0-9\s]/g, ' ') // Remplacer la ponctuation par des espaces
      .replace(/\s+/g, ' ') // Remplacer plusieurs espaces par un seul
      .trim();
  };

  // Fonction pour calculer la distance de Levenshtein (similarité entre mots)
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

  // Fonction pour vérifier si un mot est similaire à un mot clé
  const isSimilar = (word: string, keyword: string, threshold: number = 2): boolean => {
    if (word.includes(keyword) || keyword.includes(word)) return true;
    if (Math.abs(word.length - keyword.length) > threshold) return false;
    return levenshteinDistance(word, keyword) <= threshold;
  };

  // Fonction pour vérifier si le message contient des mots-clés similaires
  const containsSimilarWords = (message: string, keywords: string[]): boolean => {
    const normalizedMessage = normalizeText(message);
    const words = normalizedMessage.split(' ');
    
    return keywords.some(keyword => {
      const normalizedKeyword = normalizeText(keyword);
      return words.some(word => isSimilar(word, normalizedKeyword));
    });
  };

  // Réponses automatiques de l'IA avec gestion des fautes de frappe
  const getAIResponse = (userMessage: string): string => {
    const msg = normalizeText(userMessage);
    
    // Salutations - avec variations et fautes de frappe
    if (containsSimilarWords(msg, ['bonjour', 'bonsoir', 'bonne', 'salut', 'hello', 'hi', 'hey', 'coucou', 'bnjr', 'bjr', 'slt'])) {
      return 'Bonjour ! Je suis l\'assistant de VILO ASSIST-PRO. Comment puis-je vous aider aujourd\'hui ? 😊';
    }
    
    // Présentation - avec variations
    if (containsSimilarWords(msg, ['qui', 'etes', 'vous', 'vilo', 'presentez', 'presentation', 'entreprise', 'societe', 'compagnie', 'koi', 'ki', 'c\'est', 'cest'])) {
      return 'VILO ASSIST-PRO est votre assistant virtuel professionnel basé à Madagascar, spécialisé en support administratif et services de télésecrétariat depuis plus de 5 ans.';
    }
    
    // Services - avec variations et fautes courantes
    if (containsSimilarWords(msg, ['service', 'services', 'offre', 'offres', 'prestation', 'prestations', 'proposez', 'faites', 'specialite', 'competence', 'srvc', 'servic', 'ofre', 'presta'])) {
      return 'Nous proposons :\n- Assistant administratif\n- Support client\n- Télésecrétariat médical/juridique\n- Gestion pré-comptable\n- Transcription audio/vidéo\n- Saisie de données\n\nLequel vous intéresse ?';
    }
    
    // Tarifs - avec variations et fautes courantes
    if (containsSimilarWords(msg, ['prix', 'tarif', 'tarifs', 'cout', 'coute', 'combien', 'montant', 'budget', 'facturation', 'facturer', 'pri', 'tariff', 'cou', 'cbien', 'conbien'])) {
      return 'Notre tarif est de 10€/heure pour tous services. Exemple :\n10h/semaine = 400€/mois\n20h/semaine = 800€/mois\n\nBesoin d\'une estimation précise ?';
    }
    
    // Contact - avec variations
    if (containsSimilarWords(msg, ['contact', 'contacter', 'joindre', 'appeler', 'telephone', 'email', 'mail', 'whatsapp', 'joindre', 'rdv', 'rendez', 'vous', 'kontak', 'kontakt', 'apeler', 'tel', 'numero'])) {
      return 'Vous pouvez nous contacter :\n📞 +261 33 21 787 85\n📧 info@viloassistpro.com\n💬 WhatsApp disponible\n\nSouhaitez-vous programmer un appel ?';
    }
    
    // Délais - avec variations
    if (containsSimilarWords(msg, ['delai', 'delais', 'temps', 'duree', 'disponibilite', 'disponible', 'quand', 'rapidement', 'vite', 'dlai', 'temp', 'dure', 'dispo', 'qand', 'kan'])) {
      return 'Nous intervenons sous 1-3 jours. Notre équipe est disponible du lundi au vendredi de 8h à 18h (GMT+3). Urgence ? Nous avons une option express !';
    }
    
    // Confidentialité - avec variations
    if (containsSimilarWords(msg, ['confidentiel', 'confidentialite', 'securite', 'secure', 'donnees', 'protection', 'proteger', 'prive', 'secret', 'nda', 'konfidentiel', 'secu', 'donne', 'protec'])) {
      return 'Nous garantissons :\n- NDA systématique\n- Chiffrement des données\n- Accès sécurisé\n\nVos informations sont 100% protégées.';
    }
    
    // Processus - avec variations
    if (containsSimilarWords(msg, ['processus', 'process', 'commencer', 'demarrer', 'demarrage', 'debut', 'etapes', 'procedure', 'comment', 'proses', 'comencer', 'demarer', 'debuter', 'koman'])) {
      return 'Notre processus :\n1. Appel découverte gratuit\n2. Proposition sur mesure\n3. Mise en place (1-3j)\n4. Lancement avec suivi\n\nIntéressé(e) ?';
    }
    
    // Équipe & compétences - avec variations
    if (containsSimilarWords(msg, ['equipe', 'team', 'competence', 'skill', 'formation', 'experience', 'personnel', 'assistant', 'qualification', 'ekip', 'kompetans', 'formasion', 'experians'])) {
      return 'Notre équipe :\n• Assistants diplômés\n• Formation continue\n• Bilingues FR/EN\n• Spécialisations sectorielles\n• 5 ans d\'expérience moyenne';
    }
    
    // Clients cibles - avec variations
    if (containsSimilarWords(msg, ['client', 'clients', 'cible', 'target', 'pme', 'tpe', 'entrepreneur', 'professionnel', 'liberal', 'medecin', 'juriste', 'avocat', 'kliant', 'sib', 'profesionel'])) {
      return 'Nos clients :\n• Entrepreneurs & TPE/PME\n• Professionnels libéraux\n• Cabinets médicaux/juridiques\n• Consultants indépendants\n• Startups en croissance';
    }
    
    // Zone géographique - avec variations
    if (containsSimilarWords(msg, ['zone', 'geographique', 'pays', 'france', 'europe', 'afrique', 'canada', 'suisse', 'belgique', 'luxembourg', 'international', 'geo', 'frans', 'zona'])) {
      return 'Nous travaillons avec :\n• France & Europe francophone\n• Canada (Québec)\n• Afrique francophone\n• Fuseau horaire adapté (GMT+3)\n• Service 100% à distance';
    }
    
    // Outils & technologies - avec variations
    if (containsSimilarWords(msg, ['outil', 'outils', 'logiciel', 'technologie', 'plateforme', 'software', 'systeme', 'materiel', 'informatique', 'util', 'teknoloji', 'plataform', 'sistem'])) {
      return 'Nos outils :\n• Suite Microsoft 365\n• Google Workspace\n• Logiciels métiers\n• CRM (Salesforce, HubSpot)\n• Outils de visio (Zoom, Teams)\n• Plateformes sécurisées';
    }
    
    // Contrats & conditions - avec variations
    if (containsSimilarWords(msg, ['contrat', 'condition', 'engagement', 'duree', 'resiliation', 'clause', 'facturation', 'paiement', 'modalite', 'garan', 'kondition', 'engajman', 'rezil'])) {
      return 'Nos conditions :\n• Contrat flexible\n• Engagement mensuel\n• Facturation horaire ou forfait\n• Paiement sécurisé\n• Résiliation sous 15 jours\n• Essai gratuit possible';
    }
    
    // Témoignages - avec variations
    if (containsSimilarWords(msg, ['client', 'clients', 'temoignage', 'temoignages', 'avis', 'opinion', 'retour', 'satisfaction', 'reference', 'references', 'klient', 'temoin', 'avi', 'satisfac'])) {
      return 'Nos clients disent :\n"Professionnalisme remarquable" - Marie D.\n"Réactivité exceptionnelle" - Pierre M.\n98% de satisfaction !';
    }
    
    // Avantages - avec variations
    if (containsSimilarWords(msg, ['avantage', 'benefice', 'plus', 'valeur', 'choisir', 'difference', 'pourquoi', 'atout', 'force', 'avanta', 'benef', 'valer', 'poukoi'])) {
      return 'Nos avantages :\n✓ Économie jusqu\'à 50%\n✓ Flexibilité horaire\n✓ Qualité premium\n✓ Réactivité 24h/24\n✓ Adaptabilité totale\n✓ Confidentialité absolue';
    }
    
    // Évolution & adaptation - avec variations
    if (containsSimilarWords(msg, ['evolution', 'changement', 'adapter', 'modifier', 'augmenter', 'reduire', 'volume', 'besoin', 'changement', 'evol', 'adapt', 'modif', 'chanjman'])) {
      return 'Nous adaptons :\n• Changement d\'assistant\n• Augmentation volume\n• Réduction service\n• Nouveaux besoins\n• Spécialisation\n\nFlexibilité totale !';
    }
    
    // Offres & promotions - avec variations
    if (containsSimilarWords(msg, ['offre', 'promotion', 'reduction', 'remise', 'rabais', 'gratuit', 'essai', 'decouverte', 'preferentiel', 'of', 'promo', 'reduc', 'remis'])) {
      return 'Offre spéciale :\n• 1ère heure offerte\n• -10% 20h+/mois\n• Essai 5h sans engagement\n\nDemandez votre devis personnalisé !';
    }
    
    // Questions diverses - avec variations
    if (containsSimilarWords(msg, ['autre', 'divers', 'question', 'info', 'information', 'document', 'site', 'web', 'reseau', 'social', 'blog', 'otr', 'kesion', 'enfo'])) {
      return 'Plus d\'infos :\n🌐 www.viloassistpro.com\n📧 contact@viloassistpro.com\n📱 LinkedIn/Facebook\n\nAutre question ?';
    }
    
    // Urgence - avec variations
    if (containsSimilarWords(msg, ['urgent', 'urgence', 'immediat', 'immediate', 'rapide', 'rapidement', 'vite', 'emergency', 'urgen', 'imadiat', 'rapid', 'vit', 'emergensy'])) {
      return 'Pour les urgences :\n📞 +261 33 21 787 85 (dites "URGENT")\n⚡ Option express (+20%)\nDémarrage sous 24h !';
    }
    
    // Remerciements - avec variations
    if (containsSimilarWords(msg, ['merci', 'mercy', 'remercie', 'thanks', 'thank', 'remercier', 'mersi', 'mrc', 'thx', 'remerse'])) {
      return 'Je vous en prie ! 😊 Pour un conseiller humain : +261 33 21 787 85. ';
    }
    
    // Au revoir - avec variations
    if (containsSimilarWords(msg, ['au', 'revoir', 'aurevoir', 'bye', 'bientot', 'salut', 'ciao', 'tchao', 'goodbye', 'good', 'bye', 'revoire', 'biento', 'biento', 'byebye'])) {
      return 'Au revoir ! Merci d\'avoir choisi VILO ASSIST-PRO. Contactez-nous au +261 33 21 787 85 pour toute question.';
    }

    // Aide générale - avec variations
    if (containsSimilarWords(msg, ['aide', 'aider', 'help', 'assistance', 'support', 'soutien', 'aidez', 'moi', 'ed', 'assistans', 'suport', 'soutien'])) {
      return 'Je suis là pour vous aider ! Je peux vous renseigner sur :\n• Nos services\n• Nos tarifs (10€/h)\n• Notre processus\n• Nos garanties\n\nQue souhaitez-vous savoir ?';
    }
    
    // Réponse par défaut améliorée
    return 'Je n\'ai pas bien compris votre demande. Voici ce que je peux vous expliquer :\n• Nos services et prestations\n• Nos tarifs (10€/h)\n• Notre processus de travail\n• Nos garanties de confidentialité\n• Comment nous contacter\n\nPouvez-vous reformuler votre question ?';
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