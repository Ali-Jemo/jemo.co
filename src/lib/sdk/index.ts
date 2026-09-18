/**
 * JEMO Discovery Registry Client SDK (TypeScript / JavaScript)
 * Zero external dependencies — works in Node 18+, Bun, Deno, Cloudflare Workers, and modern browsers.
 */

export interface ClientConfig {
  apiKey: string;
  endpoint?: string;
  timeout?: number;
}

export interface ResearchObjectInput {
  title: string;
  titleEn?: string;
  field?: string;
  researchType?: string;
  research_type?: string;
  question?: string;
  findings?: string;
  abstract?: string;
  methodology?: string;
  tools?: string[];
  toolsUsed?: string[];
  confidence?: string;
  accuracyCheck?: string;
  codeUrl?: string;
  datasetUrl?: string;
  authorName?: string;
  author_name?: string;
}

export interface ReplicationInput {
  type?: "replication" | "challenge" | "evidence" | "correction" | "extension";
  findings: string;
  methodology?: string;
  confidence?: string;
  reproducedAccuracy?: number;
  evidenceUrl?: string;
  author?: string;
}

export interface ListOptions {
  q?: string;
  field?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

export interface PublishResult {
  success: boolean;
  id: string;
  slug: string;
  url: string;
  data: Record<string, unknown>;
}

export class JemoApiError extends Error {
  public status: number;
  public details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "JemoApiError";
    this.status = status;
    this.details = details;
  }
}

export class ResearchRegistry {
  private apiKey: string;
  private endpoint: string;
  private timeout: number;

  constructor(config: ClientConfig) {
    if (!config.apiKey || typeof config.apiKey !== "string") {
      throw new Error("ResearchRegistry requires a valid 'apiKey' (e.g. 'jemo_live_res_...').");
    }
    this.apiKey = config.apiKey.trim();
    this.endpoint = (config.endpoint || "https://jemo.co/api").replace(/\/$/, "");
    this.timeout = config.timeout || 30_000;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.endpoint}${path.startsWith("/") ? path : `/${path}`}`;
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), this.timeout) : null;

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller ? controller.signal : undefined,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "X-API-Key": this.apiKey,
          Accept: "application/json",
          ...options.headers,
        },
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg =
          body?.message || body?.error || `API request failed with status ${response.status}: ${response.statusText}`;
        throw new JemoApiError(errorMsg, response.status, body);
      }

      return body as T;
    } finally {
      clearTimeout(timeoutId ?? undefined);
    }
  }

  /**
   * Publishes a new Research Object to the registry.
   */
  public async publishObject(input: ResearchObjectInput): Promise<PublishResult> {
    return this.request<PublishResult>("/research", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  /** Python-style snake_case alias */
  public async publish_object(input: ResearchObjectInput): Promise<PublishResult> {
    return this.publishObject(input);
  }

  /**
   * Retrieves a single Research Object by its slug or ID.
   */
  public async getObject(slugOrId: string): Promise<Record<string, unknown>> {
    const res = await this.request<{ success: boolean; data: Record<string, unknown> }>(
      `/research/${encodeURIComponent(slugOrId)}`
    );
    return res.data;
  }

  /** Python-style snake_case alias */
  public async get_object(slugOrId: string): Promise<Record<string, unknown>> {
    return this.getObject(slugOrId);
  }

  /**
   * Lists and searches across published research objects.
   */
  public async listObjects(
    options: ListOptions = {}
  ): Promise<{ items: Record<string, unknown>[]; total: number; limit: number; offset: number }> {
    const params = new URLSearchParams();
    if (options.q) params.set("q", options.q);
    if (options.field) params.set("field", options.field);
    if (options.type) params.set("type", options.type);
    if (options.limit) params.set("limit", options.limit.toString());
    if (options.offset) params.set("offset", options.offset.toString());

    const queryStr = params.toString() ? `?${params.toString()}` : "";
    return this.request(`/research${queryStr}`);
  }

  /** Python-style snake_case alias */
  public async list_objects(options: ListOptions = {}) {
    return this.listObjects(options);
  }

  /**
   * Records a peer replication or challenge against an existing research object.
   */
  public async replicateObject(
    slugOrId: string,
    data: ReplicationInput
  ): Promise<{ success: boolean; message: string; paperSlug: string; data: Record<string, unknown> }> {
    return this.request(`/research/${encodeURIComponent(slugOrId)}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /** Python-style snake_case alias */
  public async replicate_object(slugOrId: string, data: ReplicationInput) {
    return this.replicateObject(slugOrId, data);
  }
}

// Default export
export default ResearchRegistry;
