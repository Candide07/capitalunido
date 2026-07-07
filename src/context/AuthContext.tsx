import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    try {
      console.log('📤 1. Création dans auth.users avec:', { email, fullName, phone });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone: phone }
        }
      });

      if (error) {
        console.error('❌ Erreur auth.signUp:', error);
        return { error, data: null };
      }

      if (!data.user) {
        console.error('❌ Pas de user dans la réponse');
        return { error: new Error('No user returned'), data: null };
      }

      const userId = data.user.id;
      console.log('✅ Utilisateur créé dans auth.users, ID:', userId);

      console.log('📤 2. Insertion dans la table users...');
      console.log('📝 Données à insérer:', {
        id: userId,
        email: email,
        phone: phone || null,
        full_name: fullName,
        balance: 0,
        total_returns: 0,
        total_withdrawn: 0,
        first_deposit_date: null,
        last_daily_return: new Date().toISOString()
      });

      // Insertion avec tous les champs
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: email,
          phone: phone || null,
          full_name: fullName,
          balance: 0,
          total_returns: 0,
          total_withdrawn: 0,
          first_deposit_date: null,
          last_daily_return: new Date().toISOString()
        });

      if (insertError) {
        console.error('❌ Erreur insertion dans users:', insertError);
        console.error('❌ Message:', insertError.message);
        console.error('❌ Code:', insertError.code);
        return { error: insertError, data: null };
      }

      console.log('✅ Profil créé dans users !');
      return { data, error: null };
      
    } catch (err) {
      console.error('❌ Erreur inattendue dans signUp:', err);
      return { error: err, data: null };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};