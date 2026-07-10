import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, phone: string, referralCode?: string) => Promise<{ error: any, data: any }>;
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

  // ⚠️ La génération du code d'affiliation se fait désormais UNIQUEMENT côté
  // base de données, via le trigger Postgres "generate_affiliate_code" sur
  // auth.users (voir supabase_fix_affiliate_trigger.sql). On ne la fait plus
  // ici pour éviter que deux codes soient créés pour le même utilisateur.

  const signUp = async (email: string, password: string, fullName: string, phone: string, referralCode?: string) => {
    try {
      console.log('📤 Inscription avec:', { email, fullName, phone, referralCode });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            full_name: fullName, 
            phone: phone,
            referral_code: referralCode || null
          }
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
      console.log('✅ Utilisateur créé, ID:', userId);

      // 👈 Insertion dans users avec les bonnes colonnes
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

      // ℹ️ Le code d'affiliation est déjà créé automatiquement à ce stade
      // par le trigger Postgres sur auth.users (pas d'appel côté React ici).

      // 👈 Traiter le parrainage
      if (referralCode) {
        console.log('📤 Traitement du parrainage avec le code:', referralCode);
        
        const { data: referrer } = await supabase
          .from('affiliate_codes')
          .select('user_id')
          .eq('code', referralCode)
          .maybeSingle();
        
        if (referrer) {
          console.log('✅ Parrain trouvé:', referrer.user_id);

          // ℹ️ La création des lignes "referrals" (sur 3 niveaux) et la mise à
          // jour des compteurs affiliate_stats sont désormais gérées
          // automatiquement par le trigger Postgres "process_new_referral",
          // déclenché par la mise à jour de referred_by juste en dessous.
          await supabase
            .from('users')
            .update({ referred_by: referrer.user_id })
            .eq('id', userId);
          
          console.log('✅ Parrainage créé !');
        } else {
          console.log('⚠️ Aucun parrain trouvé pour le code:', referralCode);
        }
      }

      return { data, error: null };
      
    } catch (err) {
      console.error('❌ Erreur inattendue:', err);
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