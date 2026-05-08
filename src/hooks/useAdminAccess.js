import { useAuth } from '@clerk/react';
import { useEffect, useState } from 'react';
import { createSupabaseAuthedClient } from '../lib/supabase';
import { fetchAdminAccess } from '../lib/restaurantApi';
import { isReservationStackConfigured } from '../lib/env';

export function useAdminAccess() {
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const [state, setState] = useState({
    isLoading: true,
    isAdmin: false,
    record: null,
    error: '',
  });

  useEffect(() => {
    let isMounted = true;

    async function loadAdminAccess() {
      if (isMounted) {
        setState((currentState) => ({
          ...currentState,
          isLoading: true,
          error: '',
        }));
      }

      if (!isLoaded) {
        return;
      }

      if (!isSignedIn || !userId || !isReservationStackConfigured) {
        if (isMounted) {
          setState({
            isLoading: false,
            isAdmin: false,
            record: null,
            error: '',
          });
        }
        return;
      }

      try {
        const client = createSupabaseAuthedClient(getToken);
        const record = await fetchAdminAccess(client);

        if (isMounted) {
          setState({
            isLoading: false,
            isAdmin: Boolean(record),
            record,
            error: '',
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            isLoading: false,
            isAdmin: false,
            record: null,
            error: error.message,
          });
        }
      }
    }

    loadAdminAccess();

    return () => {
      isMounted = false;
    };
  }, [getToken, isLoaded, isSignedIn, userId]);

  return state;
}
