/**
 * Supabase mock for test mode.
 * Replaces the real Supabase client when NODE_ENV === "test" so API
 * integration tests don't hang waiting for a real Supabase instance.
 *
 * The mock stores data in-memory so CRUD operations work end-to-end.
 */

import type { Database } from "./types";

// ── In-memory store ────────────────────────────────────────────────────────────

const stores: Record<string, Map<string, Record<string, any>>> = {
  projects: new Map(),
  certificates: new Map(),
  companies: new Map(),
};

function resetStores() {
  for (const key of Object.keys(stores)) {
    stores[key] = new Map();
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────────────

let idCounter = 0;
function generateId(): string {
  idCounter++;
  return `mock-id-${idCounter}-${Date.now()}`;
}

function cloneDeep<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// ── PostgREST-style builder chain ───────────────────────────────────────────────

type ResolvedShape = { data: any; error: any; count?: number };

class QueryChain implements PromiseLike<ResolvedShape> {
  private table: string;
  private operation: "select" | "insert" | "update" | "delete";
  private payload: Record<string, any> | null = null;
  private filters: { field: string; op: string; value: any }[] = [];
  private orders: { field: string; asc: boolean }[] = [];
  private rangeStart: number | null = null;
  private rangeEnd: number | null = null;
  private wantSingle = false;
  private wantSelect = false;
  private withCount = false;

  constructor(table: string, operation: "select" | "insert" | "update" | "delete", payload?: Record<string, any>) {
    this.table = table;
    this.operation = operation;
    this.payload = payload || null;
  }

  // ── Chainable query modifiers ──

  select(_fields?: string, opts?: { count?: "exact" }) {
    this.wantSelect = true;
    if (opts?.count === "exact") this.withCount = true;
    return this;
  }

  eq(field: string, value: any) {
    this.filters.push({ field, op: "eq", value });
    return this;
  }

  in(field: string, values: any[]) {
    this.filters.push({ field, op: "in", value: values });
    return this;
  }

  order(field: string, opts?: { ascending?: boolean }) {
    this.orders.push({ field, asc: opts?.ascending ?? true });
    return this;
  }

  range(start: number, end: number) {
    this.rangeStart = start;
    this.rangeEnd = end;
    return this;
  }

  single() {
    this.wantSingle = true;
    return this;
  }

  // ── Promise-like resolve ──

  then<TResult1 = ResolvedShape, TResult2 = never>(
    onfulfilled?: ((value: ResolvedShape) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    const result = this._resolve();
    return Promise.resolve(result).then(onfulfilled, onrejected);
  }

  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null): PromiseLike<ResolvedShape | TResult> {
    return Promise.resolve(this._resolve()).catch(onrejected);
  }

  finally(onfinally?: (() => void) | null): PromiseLike<ResolvedShape> {
    return Promise.resolve(this._resolve()).finally(onfinally);
  }

  // ── Internal resolver ──

  private _resolve(): ResolvedShape {
    const store = stores[this.table];
    if (!store) {
      const error = { message: `Table "${this.table}" not found`, code: "NOT_FOUND" };
      return { data: null, error, count: 0 };
    }

    try {
      switch (this.operation) {
        case "select":
          return this._resolveSelect(store);
        case "insert":
          return this._resolveInsert(store);
        case "update":
          return this._resolveUpdate(store);
        case "delete":
          return this._resolveDelete(store);
        default:
          return { data: null, error: { message: "Unknown operation", code: "UNKNOWN" }, count: 0 };
      }
    } catch (err: any) {
      return { data: null, error: { message: err.message, code: "MOCK_ERROR" }, count: 0 };
    }
  }

  private _matchesFilters(item: Record<string, any>): boolean {
    for (const f of this.filters) {
      const val = item[f.field];
      switch (f.op) {
        case "eq":
          if (val !== f.value) return false;
          break;
        case "in":
          if (!Array.isArray(f.value) || !f.value.includes(val)) return false;
          break;
      }
    }
    return true;
  }

  private _resolveSelect(store: Map<string, Record<string, any>>): ResolvedShape {
    let items = Array.from(store.values()).filter((item) => this._matchesFilters(item));

    // Apply ordering
    for (const o of this.orders) {
      items.sort((a, b) => {
        const av = a[o.field];
        const bv = b[o.field];
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        if (typeof av === "boolean" && typeof bv === "boolean") {
          // boolean: false first when ascending, true first when descending
          return o.asc ? (av === bv ? 0 : av ? 1 : -1) : (av === bv ? 0 : av ? -1 : 1);
        }
        if (typeof av === "string" && typeof bv === "string") {
          return o.asc ? av.localeCompare(bv) : bv.localeCompare(av);
        }
        return o.asc ? (av < bv ? -1 : 1) : (av < bv ? 1 : -1);
      });
    }

    // Apply range
    if (this.rangeStart != null && this.rangeEnd != null) {
      items = items.slice(this.rangeStart, this.rangeEnd + 1);
    }

    const count = this.withCount ? store.size : undefined;

    if (this.wantSingle) {
      const result: ResolvedShape = {
        data: items[0] || null,
        error: null,
        count,
      };
      return result;
    }

    return { data: cloneDeep(items), error: null, count };
  }

  private _resolveInsert(store: Map<string, Record<string, any>>): ResolvedShape {
    if (!this.payload) {
      return { data: null, error: { message: "No data provided", code: "MOCK_ERROR" }, count: 0 };
    }

    const id = this.payload.id || generateId();
    const record = {
      ...this.payload,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    store.set(id, record);

    if (this.wantSelect && this.wantSingle) {
      return { data: cloneDeep(record), error: null, count: 1 };
    }
    if (this.wantSelect) {
      return { data: [cloneDeep(record)], error: null, count: 1 };
    }

    return { data: null, error: null, count: 0 };
  }

  private _resolveUpdate(store: Map<string, Record<string, any>>): ResolvedShape {
    if (!this.payload) {
      return { data: null, error: { message: "No data provided", code: "MOCK_ERROR" }, count: 0 };
    }

    // Find matching records by filter
    const matching: Record<string, any>[] = [];
    for (const [id, record] of store.entries()) {
      const item = { id, ...record };
      if (this._matchesFilters(item)) {
        const updated = { ...record, ...this.payload, updated_at: new Date().toISOString() };
        store.set(id, updated);
        matching.push(updated);
      }
    }

    if (this.wantSingle) {
      return { data: matching.length > 0 ? cloneDeep(matching[0]) : null, error: null };
    }

    if (this.wantSelect) {
      return { data: cloneDeep(matching), error: null };
    }

    return { data: null, error: null };
  }

  private _resolveDelete(store: Map<string, Record<string, any>>): ResolvedShape {
    // Delete matching records by filter
    const toDelete: string[] = [];
    for (const [id, record] of store.entries()) {
      const item = { id, ...record };
      if (this._matchesFilters(item)) {
        toDelete.push(id);
      }
    }
    for (const id of toDelete) {
      store.delete(id);
    }

    return { data: null, error: null };
  }
}

// ── Mock Supabase client ────────────────────────────────────────────────────────

export function createMockSupabaseClient() {
  resetStores();

  return {
    from(table: string) {
      return {
        select: (fields?: string, opts?: { count?: "exact" }) =>
          new QueryChain(table, "select").select(fields, opts),
        insert: (payload: Record<string, any>) =>
          new QueryChain(table, "insert", payload),
        update: (payload: Record<string, any>) =>
          new QueryChain(table, "update", payload),
        delete: () =>
          new QueryChain(table, "delete"),
      };
    },
    auth: {
      getUser: async () => ({
        data: { user: null },
        error: null,
      }),
      signOut: async () => ({
        error: null,
      }),
      exchangeCodeForSession: async (_code: string) => ({
        error: null,
      }),
      signInWithOAuth: async (_opts: any) => ({
        data: { url: "http://localhost:3000/mock-oauth-url" },
        error: null,
      }),
    },
  };
}

export type MockSupabaseClient = ReturnType<typeof createMockSupabaseClient>;
