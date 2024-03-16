export {}

/*
{
  id: 'b7185c7a-3714-4e76-ab86-876a0646f0b1',
  short_id: 'b7185c7a',
  project_id: '80776025-b1bd-4181-993f-8238c27d226f',
  project_name: 'test',
  environment: 'preview',
  url: 'https://b7185c7a.test-dcz.pages.dev',
  created_on: '2021-10-25T12:21:21.538963Z',
  modified_on: '2021-10-25T12:24:12.381493Z',
  latest_stage: {
    name: 'deploy',
    started_on: '2021-10-25T12:24:04.47556Z',
    ended_on: '2021-10-25T12:24:12.381493Z',
    status: 'success'
  },
  deployment_trigger: {
    type: 'github:push',
    metadata: {
      branch: 'branch',
      commit_hash: '6792f396eadca08926a7c810b7b77fa3815db1f4',
      commit_message: 'pr branch'
    }
  },
  stages: [
    {
      name: 'queued',
      started_on: '2021-10-25T12:21:21.561318Z',
      ended_on: '2021-10-25T12:21:21.54879Z',
      status: 'success'
    },
    ...
  ],
  build_config: {
    build_command: 'bash test.sh',
    destination_dir: '',
    root_dir: '',
    web_analytics_tag: null,
    web_analytics_token: null
  },
  source: {
    type: 'github',
    config: {
      owner: 'WalshyDev',
      repo_name: 'Test',
      production_branch: 'main',
      pr_comments_enabled: false
    }
  },
  env_vars: null,
  aliases: [ 'https://branch.test-dcz.pages.dev' ]
},
*/

export interface ApiResponse {
  success: boolean;
  errors: string[];
  messages: string[];
  result: Deployment[];
}

export interface AuthHeaders {
  Authorization?: string;
  'X-Auth-Email'?: string;
  'X-Auth-Key'?: string;
}

export interface Deployment {
  id: string;
  short_id: string;
  project_id: string;
  project_name: string;
  environment: 'production'|'preview';
  url: string;
  created_on: string;
  modified_on: string;

  latest_stage: Stage;
  deployment_trigger: Trigger;
  stages: Stage[];

  aliases: string[]|null;
}

export interface Stage {
  name: 'queued'|'initialize'|'clone_repo'|'build'|'deploy';
  started_on: string;
  ended_on: string;
  status: 'idle'|'active'|'success'|'failure'
}

export interface Trigger {
  type: string;
  metadata: TriggerMetadata;
}

export interface TriggerMetadata {
  branch: string;
  commit_hash: string;
  commit_message: string;
}