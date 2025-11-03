// Minimal in-memory queue/store for async jobs (non-production)

export type JobStatus = 'queued' | 'processing' | 'partial' | 'completed' | 'failed' | 'canceled';

export interface JobRecord {
  id: string;
  type: string;
  status: JobStatus;
  payload: any;
  result?: any;
  tier?: string;
  userId?: string;
  idempotencyKey?: string;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface JobEventRecord {
  id: string;
  jobId: string;
  step: string;
  status: 'started' | 'succeeded' | 'failed' | 'skipped';
  log?: string;
  meta?: any;
  ts: string;
}

export interface ArtifactRecord {
  id: string;
  jobId: string;
  kind: 'pdf' | 'json' | 'html';
  url: string;
  ts: string;
}

type MemoryStore = {
  jobs: Map<string, JobRecord>;
  events: JobEventRecord[];
  artifacts: ArtifactRecord[];
};

const store: MemoryStore = (global as any).__SYMI_ASYNC_QUEUE__ || {
  jobs: new Map<string, JobRecord>(),
  events: [],
  artifacts: [],
};
(global as any).__SYMI_ASYNC_QUEUE__ = store;

function nowIso(): string {
  return new Date().toISOString();
}

function rid(len = 10): string {
  return Math.random().toString(36).slice(2, 2 + len);
}

export const memoryQueue = {
  enqueue(type: string, payload: any, opts?: { idempotencyKey?: string; tier?: string; userId?: string }) {
    const id = `${Date.now().toString(36)}_${rid(6)}`;
    const rec: JobRecord = {
      id,
      type,
      status: 'queued',
      payload,
      tier: opts?.tier,
      userId: opts?.userId,
      idempotencyKey: opts?.idempotencyKey,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    store.jobs.set(id, rec);
    return { jobId: id };
  },

  get(jobId: string): JobRecord | undefined {
    return store.jobs.get(jobId);
  },

  update(jobId: string, patch: Partial<JobRecord>) {
    const prev = store.jobs.get(jobId);
    if (!prev) return;
    const next = { ...prev, ...patch, updatedAt: nowIso() } as JobRecord;
    store.jobs.set(jobId, next);
    return next;
  },

  appendEvent(jobId: string, ev: Omit<JobEventRecord, 'id' | 'jobId' | 'ts'>) {
    const rec: JobEventRecord = { id: rid(8), jobId, ts: nowIso(), ...ev };
    store.events.push(rec);
    return rec;
  },

  listEvents(jobId: string): JobEventRecord[] {
    return store.events.filter(e => e.jobId === jobId);
  },

  addArtifact(jobId: string, art: Omit<ArtifactRecord, 'id' | 'jobId' | 'ts'>) {
    const rec: ArtifactRecord = { id: rid(8), jobId, ts: nowIso(), ...art };
    store.artifacts.push(rec);
    return rec;
  },

  listArtifacts(jobId: string): ArtifactRecord[] {
    return store.artifacts.filter(a => a.jobId === jobId);
  }
};


