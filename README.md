# CF Pages Await

Wait for a Cloudflare Pages build to finish so you can do actions like purge cache, update Workers, etc.

## Usage
```yml
- name: Await CF Pages
  uses: WalshyDev/cf-pages-await@v1
  with:
    accountEmail: ${{ secrets.CF_ACCOUNT_EMAIL  }}
    apiKey: ${{ secrets.CF_API_KEY  }}
    accountId: '4e599df4216133509abaac54b109a647'
    project: 'example-pages-project'
```

### Example
```yml
name: Deploy
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Wait for CF Pages
      id: cf-pages
      uses: WalshyDev/cf-pages-await@v1
      with:
        accountEmail: ${{ secrets.CF_ACCOUNT_EMAIL  }}
        apiKey: ${{ secrets.CF_API_KEY  }}
        accountId: '4e599df4216133509abaac54b109a647'
        project: 'test'
    - run: |
        curl -X \
          -H "X-Auth-Email: ${{ secrets.CF_ACCOUNT_EMAIL }}" \
          -H "X-Auth-Key: ${{ secrets.CF_API_KEY }}" \
          -H "Content-Type: application/json" \
          --data '{"purge_everything":true}' \
          https://api.cloudflare.com/client/v4/zones/8d0c8239f88f98a8cb82ec7bb29b8556/purge_cache
```

## Outputs
* `id`          - Deployment ID, example: `50ff553c-da5d-4846-8188-25ae82a3bb7d`
* `environment` - Envrionment for this deployment, either `production` or `preview`
* `url`         - URL for this deployment
* `alias`       - Alias URL (Will be the branch URL such as `fix-issue.project.pages.dev` or be the deployment URL)
* `success`     - If the deployment was successful