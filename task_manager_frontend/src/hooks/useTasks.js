import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import getSupabaseClient from '../lib/supabaseClient';
import { useAuth } from './useAuth';

/**
 * Task shape based on PRD:
 * id, user_id, title, description, priority, status, due_date, tags, created_at, updated_at
 * tags can be text[] or json array on Supabase; keep as an array of strings in UI.
 */

const TABLE = 'tasks';

/**
 * Build Supabase query filters based on provided filter options.
 * This applies server-side filtering for user_id, status, priority, and due_date ranges.
 */
function applyFilters(query, { user_id, status, priority, due, q } = {}) {
  // Mandatory constraint to scope to owner
  if (user_id) {
    query = query.eq('user_id', user_id);
  }

  // Optional status filter
  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  // Optional priority filter
  if (priority && priority !== 'all') {
    query = query.eq('priority', priority);
  }

  // Due filter: overdue|today|week
  if (due && due !== 'all') {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const todayISO = now.toISOString();

    if (due === 'overdue') {
      query = query.lte('due_date', todayISO);
    } else if (due === 'today') {
      const end = new Date(now);
      end.setDate(now.getDate() + 1);
      const endISO = end.toISOString();
      query = query.gte('due_date', todayISO).lt('due_date', endISO);
    } else if (due === 'week') {
      const end = new Date(now);
      end.setDate(now.getDate() + 7);
      const endISO = end.toISOString();
      query = query.gte('due_date', todayISO).lt('due_date', endISO);
    }
  }

  // Simple text search on title; using ilike for case-insensitive contains
  if (q && String(q).trim().length > 0) {
    query = query.ilike('title', `%${q.trim()}%`);
  }

  return query;
}

// PUBLIC_INTERFACE
export function useTasks(initialFilters = {}, options = {}) {
  /**
   * Hook to manage tasks list and CRUD functions.
   * Exposes:
   * - tasks: array
   * - loading: boolean
   * - error: Error|null
   * - listTasks(filters?)
   * - createTask(payload)
   * - updateTask(id, patch)
   * - deleteTask(id)
   * - setFilters(next)
   * - filters
   *
   * Filters: { status, priority, due, q, sort }
   * Sort: 'due_date' | 'priority' | 'updated_at' (default 'updated_at' desc)
   */
  const supabase = getSupabaseClient();
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(() => ({
    status: 'all',
    priority: 'all',
    due: 'all',
    q: '',
    sort: 'updated_at',
    ...initialFilters,
  }));

  // Prevent race-condition state updates
  const latestRequestId = useRef(0);

  const listTasks = useCallback(
    async (overrideFilters) => {
      const requestId = ++latestRequestId.current;
      setLoading(true);
      setError(null);

      const active = { ...filters, ...(overrideFilters || {}) };
      try {
        let query = supabase
          .from(TABLE)
          .select('*', { count: 'exact' });

        query = applyFilters(query, {
          user_id: user?.id,
          status: active.status,
          priority: active.priority,
          due: active.due,
          q: active.q,
        });

        // Sorting
        // Default: updated_at desc
        const sortKey = active.sort || 'updated_at';
        query = query.order(sortKey, { ascending: sortKey === 'priority' ? true : false });
        // For priority, ascending means low->high which matches requirement;
        // for dates and updated_at, default desc gives recent/near first.

        const { data, error: qError } = await query;
        if (qError) {
          throw new Error(qError.message || 'Failed to fetch tasks');
        }

        // Ensure latest request wins
        if (latestRequestId.current === requestId) {
          setTasks(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        // Provide safe error
        if (latestRequestId.current === requestId) {
          setError(new Error(e?.message || 'Failed to fetch tasks'));
        }
      } finally {
        if (latestRequestId.current === requestId) {
          setLoading(false);
        }
      }
    },
    [filters, supabase, user?.id]
  );

  // Initial load and when filters or user changes
  useEffect(() => {
    if (!user?.id) {
      setTasks([]);
      setLoading(false);
      setError(null);
      return;
    }
    listTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, filters.status, filters.priority, filters.due, filters.q, filters.sort]);

  const createTask = useCallback(
    async (payload) => {
      /**
       * payload: { title (required), description?, priority?, status?, due_date?, tags? }
       * user_id is injected from current user
       */
      if (!user?.id) return { error: new Error('Not authenticated') };

      setError(null);
      // Basic validation
      const title = payload?.title?.trim();
      if (!title || title.length < 1 || title.length > 120) {
        const err = new Error('Title must be between 1 and 120 characters');
        setError(err);
        return { error: err };
      }

      const insertPayload = {
        user_id: user.id,
        title,
        description: payload?.description ?? '',
        priority: payload?.priority ?? 'medium',
        status: payload?.status ?? 'todo',
        due_date: payload?.due_date ?? null,
        tags: payload?.tags ?? null,
      };

      const { data, error: iError } = await supabase
        .from(TABLE)
        .insert(insertPayload)
        .select('*')
        .single();

      if (iError) {
        const err = new Error(iError.message || 'Failed to create task');
        setError(err);
        return { error: err };
      }

      // Refresh or optimistically update
      setTasks((prev) => [data, ...prev]);
      return { data };
    },
    [supabase, user?.id]
  );

  const updateTask = useCallback(
    async (id, patch) => {
      if (!user?.id) return { error: new Error('Not authenticated') };
      if (!id) return { error: new Error('Task id required') };

      setError(null);

      // Optional validation for title length on updates
      if (patch?.title != null) {
        const t = String(patch.title).trim();
        if (t.length < 1 || t.length > 120) {
          const err = new Error('Title must be between 1 and 120 characters');
          setError(err);
          return { error: err };
        }
      }

      // Enforce ownership in update condition using eq('user_id', user.id) for extra safety (RLS should handle this).
      const { data, error: uError } = await supabase
        .from(TABLE)
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select('*')
        .single();

      if (uError) {
        const err = new Error(uError.message || 'Failed to update task');
        setError(err);
        return { error: err };
      }

      setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
      return { data };
    },
    [supabase, user?.id]
  );

  const deleteTask = useCallback(
    async (id) => {
      if (!user?.id) return { error: new Error('Not authenticated') };
      if (!id) return { error: new Error('Task id required') };

      setError(null);
      const { error: dError } = await supabase
        .from(TABLE)
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (dError) {
        const err = new Error(dError.message || 'Failed to delete task');
        setError(err);
        return { error: err };
      }

      setTasks((prev) => prev.filter((t) => t.id !== id));
      return {};
    },
    [supabase, user?.id]
  );

  const api = useMemo(
    () => ({
      tasks,
      loading,
      error,
      filters,
      setFilters,
      listTasks,
      createTask,
      updateTask,
      deleteTask,
    }),
    [tasks, loading, error, filters, listTasks, createTask, updateTask, deleteTask]
  );

  return api;
}

export default useTasks;
