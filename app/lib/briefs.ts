import { Redis } from "@upstash/redis";

// ─── Redis client ──────────────────────────────────────────────────────────────
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// ─── Types ─────────────────────────────────────────────────────────────────────

export type MarketPerformanceItem = {
  index: string;
  value: string;
  change: string;
  direction: "up" | "down";
};

export type KeyDevelopment = {
  headline: string;
  icon: string;
  tag: string;
  plain: string;
};

export type WhatToWatchItem = {
  item: string;
  detail: string;
};

export type TacticalInsight = {
  title: string;
  body: string;
};

export type BriefStatus = "draft" | "published";

export type Brief = {
  id: string;
  date: string;
  status: BriefStatus;
  executiveSummary: string;
  marketPerformance: MarketPerformanceItem[];
  keyDevelopments: KeyDevelopment[];
  whatToWatch: WhatToWatchItem[];
  tacticalInsight: TacticalInsight;
  createdAt: string;      // ISO string
  publishedAt: string | null;
};

export type BriefInput = Omit<Brief, "id" | "status" | "createdAt" | "publishedAt">;

// ─── Key helpers ───────────────────────────────────────────────────────────────

/** e.g. "brief:2025-03-05" */
const briefKey = (id: string) => `brief:${id}`;

/** Sorted set that tracks all brief IDs by publish timestamp */
const PUBLISHED_INDEX = "briefs:published";

/** Sorted set that tracks all brief IDs by created timestamp */
const ALL_INDEX = "briefs:all";

/** Generate an ID from today's date: "2025-03-05" */
const todayId = () => new Date().toISOString().slice(0, 10);

// ─── Functions ─────────────────────────────────────────────────────────────────

/**
 * Save a brief as a draft. ID is generated from today's date.
 * If a draft already exists for today it will be overwritten.
 */
export async function saveDraft(briefData: BriefInput): Promise<Brief> {
  try {
    const id = todayId();
    const now = new Date().toISOString();

    const brief: Brief = {
      ...briefData,
      id,
      status: "draft",
      createdAt: now,
      publishedAt: null,
    };

    await redis.set(briefKey(id), JSON.stringify(brief));

    // Track in all-briefs index (score = epoch ms for ordering)
    await redis.zadd(ALL_INDEX, {
      score: Date.now(),
      member: id,
    });

    return brief;
  } catch (error) {
    throw new Error(
      `saveDraft failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Retrieve a single brief by ID.
 * Returns null if not found.
 */
export async function getBrief(id: string): Promise<Brief | null> {
  try {
    const raw = await redis.get<string>(briefKey(id));
    if (!raw) return null;

    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return parsed as Brief;
  } catch (error) {
    throw new Error(
      `getBrief failed for id "${id}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Retrieve the most recently published brief.
 * Returns null if no published briefs exist.
 */
export async function getLatestPublished(): Promise<Brief | null> {
  try {
    // Get the single highest-scored (most recent) member
    const ids = await redis.zrange(PUBLISHED_INDEX, 0, 0, { rev: true });
    if (!ids || ids.length === 0) return null;

    const id = ids[0] as string;
    return getBrief(id);
  } catch (error) {
    throw new Error(
      `getLatestPublished failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Publish a brief: merge in any edited content, set status to 'published',
 * and record publishedAt. Also adds it to the published index.
 */
export async function publishBrief(
  id: string,
  editedData: Partial<BriefInput>
): Promise<Brief> {
  try {
    const existing = await getBrief(id);
    if (!existing) throw new Error(`Brief "${id}" not found`);

    const now = new Date().toISOString();

    const updated: Brief = {
      ...existing,
      ...editedData,
      id,                   // never allow ID to be overwritten
      status: "published",
      publishedAt: now,
    };

    await redis.set(briefKey(id), JSON.stringify(updated));

    // Add to published index (score = publish epoch ms)
    await redis.zadd(PUBLISHED_INDEX, {
      score: Date.now(),
      member: id,
    });

    return updated;
  } catch (error) {
    throw new Error(
      `publishBrief failed for id "${id}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Retrieve the last 30 briefs (any status), newest first.
 * Returns an empty array if none exist.
 */
export async function getAllBriefs(): Promise<Brief[]> {
  try {
    // Get the 30 most recent IDs from the sorted set (highest score = newest)
    const ids = await redis.zrange(ALL_INDEX, 0, 29, { rev: true });
    if (!ids || ids.length === 0) return [];

    // Fetch all in parallel
    const results = await Promise.all(
      (ids as string[]).map((id) => getBrief(id))
    );

    // Filter out any nulls (stale index entries)
    return results.filter((b): b is Brief => b !== null);
  } catch (error) {
    throw new Error(
      `getAllBriefs failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}