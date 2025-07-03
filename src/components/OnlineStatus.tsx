
import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const OnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`flex items-center space-x-2 text-sm ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span>En ligne</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span>Hors ligne</span>
        </>
      )}
    </div>
  );
};

export default OnlineStatus;
