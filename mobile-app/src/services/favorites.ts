import { supabase } from '@services/supabase';

export interface Favorite {
  id: string;
  user_id: string;
  promotion_id: string;
  created_at: string;
}

/**
 * Add a promotion to favorites
 */
export const addFavorite = async (
  userId: string,
  promotionId: string
): Promise<Favorite> => {
  try {
    // Check if already favorited
    const { data: existing, error: checkError } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('promotion_id', promotionId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existing) {
      return existing;
    }

    // Create favorite
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        promotion_id: promotionId,
      })
      .select()
      .single();

    if (error) throw error;

    // Track analytics
    await supabase.from('analytics_events').insert({
      user_id: userId,
      promotion_id: promotionId,
      event_type: 'favorite',
    });

    return data;
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

/**
 * Remove a promotion from favorites
 */
export const removeFavorite = async (
  userId: string,
  promotionId: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('promotion_id', promotionId);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

/**
 * Get user's favorite promotions
 */
export const getFavorites = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select(
        `
        *,
        promotion:promotions (
          *,
          business:businesses (*)
        )
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

/**
 * Check if a promotion is favorited
 */
export const isFavorited = async (
  userId: string,
  promotionId: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('promotion_id', promotionId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};

/**
 * Get favorite IDs for a user (for quick lookup)
 */
export const getFavoriteIds = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('promotion_id')
      .eq('user_id', userId);

    if (error) throw error;

    return data?.map((f) => f.promotion_id) || [];
  } catch (error) {
    console.error('Error fetching favorite IDs:', error);
    return [];
  }
};
