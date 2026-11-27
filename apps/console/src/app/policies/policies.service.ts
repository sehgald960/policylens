import { httpResource } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ENVIRONMENT } from '../core/env';

export interface Policy {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class PoliciesService {
  readonly #env = inject(ENVIRONMENT);

  readonly listPolicies = httpResource<Policy[]>(() => ({
    url: `${this.#env.supabaseUrl}/rest/v1/policies`,
    headers: {
      apikey: this.#env.supabaseAnonKey,
      Authorization: `Bearer ${this.#env.supabaseAnonKey}`,
    },
    params: {
      select: 'id,name,status,created_at',
      order: 'created_at.desc',
    },
  }));
}
