import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, phoneNumber: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error && error.message.includes('refresh_token_not_found')) {
        console.warn('Session expired or invalid. Clearing local auth state.');
        supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If profile doesn't exist, create it (Fail-safe for trigger issues)
        if (error.code === 'PGRST116') {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            const newProfile = {
              id: userId,
              email: userData.user.email,
              display_name: userData.user.user_metadata?.display_name || 'User',
              phone_number: userData.user.user_metadata?.phone_number || '',
              role: 'student',
              status: 'active'
            };
            const { error: insertError } = await supabase.from('profiles').insert([newProfile]);
            if (!insertError) {
              fetchProfile(userId); // Retry fetching now that it's created
              return;
            }
          }
        }
        throw error;
      }
      
      // Map snake_case from DB to camelCase for the app
      const mappedProfile: UserProfile = {
        uid: data.id,
        email: data.email,
        displayName: data.display_name,
        phoneNumber: data.phone_number,
        avatarUrl: data.avatar_url,
        role: data.role,
        status: data.status,
        createdAt: data.created_at,
        pinnedDocIds: data.pinned_doc_ids || [],
        dailyMotivation: data.daily_motivation,
        motivationLastUpdated: data.motivation_last_updated
      };
      
      setProfile(mappedProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string, phoneNumber: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          phone_number: phoneNumber,
        },
      },
    });
    
    if (error) {
      setLoading(false);
      throw error;
    }
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      // Map camelCase from app to snake_case for DB
      const dbUpdates: any = {};
      if (updates.displayName !== undefined) dbUpdates.display_name = updates.displayName;
      if (updates.phoneNumber !== undefined) dbUpdates.phone_number = updates.phoneNumber;
      if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;
      if (updates.role !== undefined) dbUpdates.role = updates.role;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.pinnedDocIds !== undefined) dbUpdates.pinned_doc_ids = updates.pinnedDocIds;
      if (updates.dailyMotivation !== undefined) dbUpdates.daily_motivation = updates.dailyMotivation;
      if (updates.motivationLastUpdated !== undefined) dbUpdates.motivation_last_updated = updates.motivationLastUpdated;

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id);
      
      if (error) {
        if (error.message.includes('permission denied')) {
          throw new Error('You do not have permission to update this profile.');
        }
        throw error;
      }

      // Update denormalized data in other tables if name or phone changed
      if (updates.displayName || updates.phoneNumber) {
        const updatePromises = [];

        if (updates.displayName) {
          // Update documents
          updatePromises.push(
            supabase
              .from('documents')
              .update({ author_name: updates.displayName })
              .eq('author_id', user.id)
          );
          // Update lost_found
          updatePromises.push(
            supabase
              .from('lost_found')
              .update({ author_name: updates.displayName })
              .eq('author_id', user.id)
          );
          // Update businesses
          updatePromises.push(
            supabase
              .from('businesses')
              .update({ author_name: updates.displayName })
              .eq('author_id', user.id)
          );
        }

        if (updates.phoneNumber) {
          // Update lost_found
          updatePromises.push(
            supabase
              .from('lost_found')
              .update({ author_phone: updates.phoneNumber })
              .eq('author_id', user.id)
          );
          // Update businesses
          updatePromises.push(
            supabase
              .from('businesses')
              .update({ contact_phone: updates.phoneNumber })
              .eq('author_id', user.id)
          );
        }

        await Promise.all(updatePromises);
      }
      
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
