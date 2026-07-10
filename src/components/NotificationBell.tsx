import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Bell, X, CheckCircle, Gift, TrendingUp, AlertCircle } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'commission' | 'deposit' | 'withdrawal' | 'system';
  read: boolean;
  data: any;
  created_at: string;
}

interface NotificationBellProps {
  userId: string;
  lang?: 'fr' | 'en' | 'es';
  country?: 'pe' | 'mx';
}

const NotificationBell = ({ userId, lang = 'fr', country = 'pe' }: NotificationBellProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const texts = {
    fr: {
      title: '🔔 Notifications',
      markAllRead: 'Tout marquer comme lu',
      noNotifications: 'Aucune notification',
      commission: '💰 Commission reçue !',
      deposit: '✅ Dépôt confirmé !',
      withdrawal: '📤 Retrait effectué',
      system: '📢 Notification système',
      commissionMessage: 'Vous avez reçu une commission de',
      depositMessage: 'Votre dépôt de',
      depositMessageEnd: 'a été confirmé avec succès.',
      close: 'Fermer',
      currency: '€'
    },
    en: {
      title: '🔔 Notifications',
      markAllRead: 'Mark all as read',
      noNotifications: 'No notifications',
      commission: '💰 Commission received!',
      deposit: '✅ Deposit confirmed!',
      withdrawal: '📤 Withdrawal processed',
      system: '📢 System notification',
      commissionMessage: 'You received a commission of',
      depositMessage: 'Your deposit of',
      depositMessageEnd: 'has been successfully confirmed.',
      close: 'Close',
      currency: '€'
    },
    es: {
      title: '🔔 Notificaciones',
      markAllRead: 'Marcar todo como leído',
      noNotifications: 'Sin notificaciones',
      commission: '💰 ¡Comisión recibida!',
      deposit: '✅ ¡Depósito confirmado!',
      withdrawal: '📤 Retiro procesado',
      system: '📢 Notificación del sistema',
      commissionMessage: 'Has recibido una comisión de',
      depositMessage: 'Tu depósito de',
      depositMessageEnd: 'ha sido confirmado con éxito.',
      close: 'Cerrar',
      currency: '€'
    }
  };

  const t = texts[lang] || texts.fr;

  const getCurrency = (): string => {
    switch (country) {
      case 'pe': return 'S/';
      case 'mx': return '$';
      default: return '€';
    }
  };

  const currency = getCurrency();

  const fetchNotifications = async () => {
    if (!userId) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    }
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (!error) {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    
    if (unreadIds.length === 0) return;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .in('id', unreadIds);

    if (!error) {
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    }
  };

  const deleteNotification = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (!error) {
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => {
        const wasUnread = notifications.find(n => n.id === id)?.read === false;
        return wasUnread ? Math.max(0, prev - 1) : prev;
      });
    }
  };

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'commission': return <Gift className="w-5 h-5 text-purple-500" />;
      case 'deposit': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'withdrawal': return <TrendingUp className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `${minutes} min`;
    if (hours < 24) return `${hours}h`;
    return `${days}j`;
  };

  const getTranslatedTitle = (type: string) => {
    switch (type) {
      case 'commission': return t.commission;
      case 'deposit': return t.deposit;
      case 'withdrawal': return t.withdrawal;
      default: return t.system;
    }
  };

  if (!userId) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="font-bold text-gray-800">{t.title}</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                {t.markAllRead}
              </button>
            )}
          </div>

          <div className="overflow-y-auto max-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>{t.noNotifications}</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 transition-all ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                        {getTranslatedTitle(notification.type)}
                      </p>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {getTimeAgo(notification.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {notification.message}
                    </p>
                    {notification.data?.amount && (
                      <p className="text-xs font-bold text-purple-600 mt-1">
                        +{currency} {notification.data.amount.toFixed(2)}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 flex-shrink-0">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        ✅
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-xs text-gray-400 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                {t.close}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;