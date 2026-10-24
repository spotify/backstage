import { releases } from './releases';

function tryToLoadCustomSidebar(ref) {
  try {
    return require(ref);
  } catch (e) {
    return [];
  }
}

const catalogSidebar = tryToLoadCustomSidebar(
  '../docs/features/software-catalog/api/sidebar.ts',
);
const searchSidebar = tryToLoadCustomSidebar(
  '../docs/features/search/api/sidebar.ts',
);
const scaffolderSidebar = tryToLoadCustomSidebar(
  '../docs/features/software-templates/api/sidebar.ts',
);

function sidebarElementWithIndex(
  element: {
    description?: string;
    differentiator?: string;
    label: string;
    docId?: string;
  },
  children: Array<string | object>,
) {
  const { label, description, differentiator = '' } = element;
  return {
    type: 'category',
    label,
    description,
    link: {
      type: 'generated-index',
      title: label,
      slug: `/${differentiator}${label
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')}/generated-index`,
    },
    items: children,
  };
}

export default {
  docs: [
    'landing-page/doc-landing-page',
    sidebarElementWithIndex({ label: 'Overview' }, [
      'overview/what-is-backstage',
      'overview/technical-overview',
      'overview/architecture-overview',
      'overview/roadmap',
      'overview/threat-model',
      'overview/versioning-policy',
    ]),
    sidebarElementWithIndex({ label: 'Getting Started' }, [
      'getting-started/index',
      sidebarElementWithIndex({ label: 'Configuring Backstage' }, [
        'getting-started/config/database',
        'getting-started/config/authentication',
        'getting-started/configure-app-with-plugins',
        'getting-started/homepage',
      ]),
      'getting-started/ci',
      sidebarElementWithIndex({ label: 'Deploying Backstage' }, [
        'deployment/index',
        'deployment/scaling',
        'deployment/docker',
        'deployment/k8s',
      ]),
      sidebarElementWithIndex({ label: 'Using Backstage' }, [
        'getting-started/logging-in',
        'getting-started/viewing-catalog',
        'getting-started/view-what-you-own',
        'getting-started/viewing-entity-relationships',
        'getting-started/filter-catalog',
        sidebarElementWithIndex({ label: 'Managing Components' }, [
          'getting-started/register-a-component',
          'getting-started/create-a-component',
          'getting-started/update-a-component',
          'getting-started/unregister-delete-component',
        ]),
        'features/techdocs/creating-and-publishing',
      ]),
      'overview/support',
      'getting-started/keeping-backstage-updated',
    ]),
    ...(process.env.GOLDEN_PATH
      ? [
          sidebarElementWithIndex({ label: 'Golden Paths' }, [
            sidebarElementWithIndex({ label: '000 - Adoption' }, [
              'golden-path/adoption/getting-started',
              'golden-path/adoption/leadership-buy-in',
              'golden-path/adoption/setting-up-a-poc',
              'golden-path/adoption/first-stakeholder-feedback',
              'golden-path/adoption/customizing-your-instance',
              'golden-path/adoption/preparing-for-ga',
            ]),
            sidebarElementWithIndex({ label: '001 - Create an App' }, [
              'golden-path/create-app/index',
              'golden-path/create-app/npx-create-app',
              'golden-path/create-app/local-development',
              'golden-path/create-app/installing-plugins',
              'golden-path/create-app/logging-in',
              'golden-path/create-app/custom-theme',
              'golden-path/create-app/keeping-backstage-updated',
            ]),
            sidebarElementWithIndex({ label: '002 - Plugins' }, [
              'golden-path/plugins/index',
              'golden-path/plugins/why-build-plugins',
              'golden-path/plugins/sustainable-plugin-development',
              sidebarElementWithIndex({ label: 'Backend Plugins' }, [
                'golden-path/plugins/backend/first-steps',
                'golden-path/plugins/backend/poking-around',
                'golden-path/plugins/backend/persistence',
                'golden-path/plugins/backend/reading-from-source',
                'golden-path/plugins/backend/testing',
              ]),
              sidebarElementWithIndex({ label: 'Frontend Plugins' }, [
                'golden-path/plugins/frontend/first-steps',
                'golden-path/plugins/frontend/poking-around',
                'golden-path/plugins/frontend/dynamic-config',
                'golden-path/plugins/frontend/http-client',
                'golden-path/plugins/frontend/testing',
              ]),
            ]),
            sidebarElementWithIndex({ label: '003 - Deployment' }, [
              'golden-path/deployment/index',
            ]),
            sidebarElementWithIndex({ label: '004 - Adoption' }, [
              'golden-path/adoption/getting-started',
              'golden-path/adoption/leadership-buy-in',
              'golden-path/adoption/setting-up-a-poc',
              'golden-path/adoption/first-stakeholder-feedback',
              'golden-path/adoption/customize-your-instance',
              'golden-path/adoption/preparing-for-ga',
              'golden-path/adoption/plugin-ownership',
              'golden-path/adoption/full-catalog',
            ]),
          ]),
        ]
      : []),
    sidebarElementWithIndex(
      {
        label: 'Core Features',
        description: 'Features powering the core of Backstage.',
      },
      [
        sidebarElementWithIndex(
          {
            label: 'AI',
            description:
              'Features in Backstage you can leverage with your AI tools.',
          },
          [
            'ai/overview',
            'ai/ai-in-the-catalog',
            'ai/mcp-actions',
            'ai/well-known-actions',
            'ai/skills',
            'ai/well-known-skills',
          ],
        ),
        sidebarElementWithIndex(
          {
            label: 'Auth and Identity',
            description: 'Authentication and identity management features.',
          },
          [
            'auth/index',
            sidebarElementWithIndex(
              {
                label: 'Included providers',
                description:
                  'Pre-configured authentication providers included with Backstage.',
              },
              [
                'auth/auth0/provider',
                'auth/atlassian/provider',
                'auth/aws-alb/provider',
                'auth/microsoft/provider',
                'auth/microsoft/easy-auth',
                'auth/bitbucket/provider',
                'auth/bitbucketServer/provider',
                'auth/cloudflare/provider',
                'auth/github/provider',
                'auth/gitlab/provider',
                'auth/google/provider',
                'auth/google/gcp-iap-auth',
                'auth/guest/provider',
                'auth/keycloak/provider',
                'auth/okta/provider',
                'auth/oauth2-proxy/provider',
                'auth/onelogin/provider',
                'auth/vmware-cloud/provider',
              ],
            ),
            'auth/identity-resolver',
            'auth/oauth',
            'auth/oidc',
            'auth/add-auth-provider',
            'auth/service-to-service-auth',
            'auth/offline-access',
            'auth/autologout',
            'auth/troubleshooting',
          ],
        ),
        sidebarElementWithIndex(
          {
            label: 'Kubernetes',
            description: 'Use Kubernetes right from Backstage.',
          },
          [
            'features/kubernetes/overview',
            'features/kubernetes/installation',
            'features/kubernetes/configuration',
            'features/kubernetes/authentication',
            'features/kubernetes/authentication-strategies',
            'features/kubernetes/troubleshooting',
            'features/kubernetes/proxy',
            'features/kubernetes/audit-events',
          ],
        ),
        sidebarElementWithIndex(
          {
            label: 'Notifications',
            description: 'Know when important events happen in Backstage.',
          },
          [
            'notifications/index',
            'notifications/processors',
            'notifications/usage',
          ],
        ),
        sidebarElementWithIndex(
          {
            label: 'Permissions',
            description: 'Access control for your Backstage instance.',
          },
          [
            'permissions/overview',
            'permissions/concepts',
            'permissions/getting-started',
            'permissions/writing-a-policy',
            'permissions/frontend-integration',
            'permissions/custom-rules',
            sidebarElementWithIndex(
              {
                label: 'Tutorial: using Permissions in your plugin',
                description:
                  'Step-by-step guide for plugin authors on using Permissions.',
              },
              [
                'permissions/plugin-authors/01-setup',
                'permissions/plugin-authors/02-adding-a-basic-permission-check',
                'permissions/plugin-authors/03-adding-a-resource-permission-check',
                'permissions/plugin-authors/04-authorizing-access-to-paginated-data',
                'permissions/plugin-authors/05-frontend-authorization',
              ],
            ),
          ],
        ),
        sidebarElementWithIndex(
          { label: 'Search', description: 'Using Search within Backstage.' },
          [
            'features/search/search-overview',
            'features/search/getting-started',
            'features/search/concepts',
            {
              type: 'category',
              label: 'API',
              link:
                searchSidebar.length > 0
                  ? {
                      type: 'generated-index',
                      title: 'Search API',
                      slug: '/category/search-api',
                    }
                  : {
                      type: 'doc',
                      id: 'openapi/generated-docs/404',
                    },
              items: searchSidebar,
            },
            'features/search/architecture',
            'features/search/search-engines',
            {
              type: 'category',
              label: 'Collators',
              link: { type: 'doc', id: 'features/search/collators' },
              items: ['features/search/custom-collators'],
            },
            'features/search/how-to-guides',
          ],
        ),
        sidebarElementWithIndex(
          {
            label: 'Software Catalog',
            description: 'Manage and explore your software components.',
          },
          [
            'features/software-catalog/software-catalog-overview',
            'features/software-catalog/life-of-an-entity',
            'features/software-catalog/configuration',
            'features/software-catalog/system-model',
            'features/software-catalog/descriptor-format',
            'features/software-catalog/references',
            'features/software-catalog/well-known-annotations',
            'features/software-catalog/well-known-relations',
            'features/software-catalog/well-known-statuses',
            'features/software-catalog/extending-the-model',
            {
              type: 'category',
              label: 'External integrations',
              link: {
                type: 'doc',
                id: 'features/software-catalog/external-integrations/index',
              },
              items: [
                'features/software-catalog/external-integrations/entity-providers',
                'features/software-catalog/external-integrations/processors',
                'features/software-catalog/external-integrations/incremental-entity-providers',
              ],
            },
            'features/software-catalog/catalog-customization',
            'features/software-catalog/entity-presentation',
            'features/software-catalog/audit-events',
            {
              type: 'category',
              label: 'API',
              link:
                catalogSidebar.length > 0
                  ? {
                      type: 'generated-index',
                      title: 'Catalog API',
                      slug: '/category/catalog-api',
                    }
                  : {
                      type: 'doc',
                      id: 'openapi/generated-docs/404',
                    },
              items: catalogSidebar,
            },
            'features/software-catalog/creating-the-catalog-graph',
            'features/software-catalog/faq',
          ],
        ),
        sidebarElementWithIndex(
          {
            label: 'Software Templates',
            description: 'Create and manage software templates.',
          },
          [
            'features/software-templates/software-templates-index',
            'features/software-templates/configuration',
            'features/software-templates/adding-templates',
            'features/software-templates/writing-templates',
            'features/software-templates/input-examples',
            'features/software-templates/ui-options-examples',
            'features/software-templates/builtin-actions',
            'features/software-templates/writing-custom-actions',
            'features/software-templates/writing-tests-for-actions',
            'features/software-templates/writing-custom-field-extensions',
            'features/software-templates/writing-custom-step-layouts',
            'features/software-templates/authorizing-scaffolder-template-details',
            'features/software-templates/dry-run-testing',
            'features/software-templates/experimental',
            'features/software-templates/templating-extensions',
            'features/software-templates/audit-events',
            {
              type: 'category',
              label: 'API',
              link:
                scaffolderSidebar.length > 0
                  ? {
                      type: 'generated-index',
                      title: 'Scaffolder API',
                      slug: '/category/scaffolder-api',
                    }
                  : {
                      type: 'doc',
                      id: 'openapi/generated-docs/404',
                    },
              items: scaffolderSidebar,
            },
          ],
        ),
        sidebarElementWithIndex(
          {
            label: 'TechDocs',
            description: 'Documentation as code for your software.',
          },
          [
            'features/techdocs/techdocs-overview',
            'features/techdocs/getting-started',
            'features/techdocs/concepts',
            'features/techdocs/addons',
            'features/techdocs/architecture',
            {
              type: 'category',
              label: 'Engines',
              link: { type: 'doc', id: 'features/techdocs/engines' },
              items: ['features/techdocs/engines-zensical'],
            },
            'features/techdocs/extensions',
            'features/techdocs/creating-and-publishing',
            'features/techdocs/configuration',
            'features/techdocs/using-cloud-storage',
            'features/techdocs/configuring-ci-cd',
            'features/techdocs/cli',
            'features/techdocs/how-to-guides',
            'features/techdocs/troubleshooting',
            'features/techdocs/faqs',
          ],
        ),
      ],
    ),
    sidebarElementWithIndex(
      {
        label: 'Integrations',
        description: 'Connect and integrate with external services.',
      },
      [
        'integrations/index',
        sidebarElementWithIndex({ label: 'AWS S3' }, [
          'integrations/aws-s3/locations',
          'integrations/aws-s3/discovery',
        ]),
        sidebarElementWithIndex({ label: 'Azure Blob Storage' }, [
          'integrations/azure-blobStorage/locations',
          'integrations/azure-blobStorage/discovery',
        ]),
        sidebarElementWithIndex({ label: 'Azure DevOps' }, [
          'integrations/azure/locations',
          'integrations/azure/discovery',
        ]),
        sidebarElementWithIndex({ label: 'Microsoft Entra ID' }, [
          'integrations/azure/org',
        ]),
        sidebarElementWithIndex({ label: 'Bitbucket Cloud' }, [
          'integrations/bitbucketCloud/locations',
          'integrations/bitbucketCloud/discovery',
        ]),
        sidebarElementWithIndex({ label: 'Bitbucket Server' }, [
          'integrations/bitbucketServer/locations',
          'integrations/bitbucketServer/discovery',
        ]),
        sidebarElementWithIndex({ label: 'Datadog' }, [
          'integrations/datadog-rum/installation',
        ]),
        sidebarElementWithIndex({ label: 'Gerrit' }, [
          'integrations/gerrit/locations',
          'integrations/gerrit/discovery',
        ]),
        sidebarElementWithIndex({ label: 'GitHub' }, [
          'integrations/github/locations',
          'integrations/github/discovery',
          'integrations/github/org',
          'integrations/github/github-apps',
        ]),
        sidebarElementWithIndex({ label: 'GitLab' }, [
          'integrations/gitlab/locations',
          'integrations/gitlab/discovery',
          'integrations/gitlab/org',
        ]),
        sidebarElementWithIndex({ label: 'Gitea' }, [
          'integrations/gitea/locations',
          'integrations/gitea/discovery',
        ]),
        sidebarElementWithIndex({ label: 'Harness' }, [
          'integrations/harness/locations',
        ]),
        sidebarElementWithIndex({ label: 'Google GCS' }, [
          'integrations/google-cloud-storage/locations',
        ]),
        sidebarElementWithIndex({ label: 'Keycloak' }, [
          'integrations/keycloak/org',
        ]),
        sidebarElementWithIndex({ label: 'LDAP' }, ['integrations/ldap/org']),
        sidebarElementWithIndex({ label: 'Okta' }, ['integrations/okta/org']),
      ],
    ),
    sidebarElementWithIndex(
      {
        label: 'Configuration',
        description: 'Manage static configuration files and settings.',
      },
      ['conf/index', 'conf/reading', 'conf/writing', 'conf/defining'],
    ),
    sidebarElementWithIndex(
      {
        label: 'Framework',
        description: 'Core framework concepts and architecture.',
      },
      [
        sidebarElementWithIndex(
          {
            label: 'Backend System',
            description: 'Backend system components and architecture.',
          },
          [
            'backend-system/index',
            sidebarElementWithIndex(
              {
                label: 'Architecture',
                description: 'Architecture of the backend system.',
                differentiator: 'backend-system/',
              },
              [
                'backend-system/architecture/index',
                'backend-system/architecture/services',
                'backend-system/architecture/plugins',
                'backend-system/architecture/extension-points',
                'backend-system/architecture/modules',
                'backend-system/architecture/feature-loaders',
                'backend-system/architecture/naming-patterns',
              ],
            ),
            sidebarElementWithIndex(
              {
                label: 'Building Backends',
                description: 'Guides on building backend systems.',
              },
              [
                'backend-system/building-backends/index',
                'backend-system/building-backends/migrating',
              ],
            ),
            sidebarElementWithIndex(
              {
                label: 'Building Plugins & Modules',
                description: 'Guides on building plugins and modules.',
              },
              [
                'backend-system/building-plugins-and-modules/index',
                'backend-system/building-plugins-and-modules/testing',
                'backend-system/building-plugins-and-modules/migrating',
              ],
            ),
            sidebarElementWithIndex(
              {
                label: 'Core Services',
                description: 'Core services of the backend system.',
              },
              [
                'backend-system/core-services/index',
                'backend-system/core-services/auditor',
                'backend-system/core-services/auth',
                'backend-system/core-services/cache',
                'backend-system/core-services/database',
                'backend-system/core-services/discovery',
                'backend-system/core-services/http-auth',
                'backend-system/core-services/http-router',
                'backend-system/core-services/identity',
                'backend-system/core-services/lifecycle',
                'backend-system/core-services/logger',
                'backend-system/core-services/metrics',
                'backend-system/core-services/permissions',
                'backend-system/core-services/permissions-registry',
                'backend-system/core-services/plugin-metadata',
                'backend-system/core-services/root-config',
                'backend-system/core-services/root-health',
                'backend-system/core-services/root-http-router',
                'backend-system/core-services/root-instance-metadata',
                'backend-system/core-services/root-lifecycle',
                'backend-system/core-services/root-logger',
                'backend-system/core-services/scheduler',
                'backend-system/core-services/token-manager',
                'backend-system/core-services/url-reader',
                'backend-system/core-services/user-info',
                'backend-system/core-services/actions-registry',
                'backend-system/core-services/actions',
              ],
            ),
          ],
        ),
        sidebarElementWithIndex(
          {
            label: 'Frontend System',
            description: 'Frontend system components and architecture.',
          },
          [
            'frontend-system/index',
            sidebarElementWithIndex(
              {
                label: 'Architecture',
                description: 'Architecture of the frontend system.',
                differentiator: 'frontend-system/',
              },
              [
                'frontend-system/architecture/index',
                'frontend-system/architecture/app',
                'frontend-system/architecture/plugins',
                'frontend-system/architecture/extensions',
                'frontend-system/architecture/extension-blueprints',
                'frontend-system/architecture/extension-overrides',
                'frontend-system/architecture/sharing-extensions',
                'frontend-system/architecture/references',
                'frontend-system/architecture/utility-apis',
                'frontend-system/architecture/routes',
                'frontend-system/architecture/naming-patterns',
                'frontend-system/architecture/migrations',
              ],
            ),
            sidebarElementWithIndex(
              {
                label: 'Building Plugins',
                description: 'Guides on building frontend plugins.',
              },
              [
                'frontend-system/building-plugins/index',
                'frontend-system/building-plugins/testing',
                'frontend-system/building-plugins/common-extension-blueprints',
                'frontend-system/building-plugins/built-in-data-refs',
                'frontend-system/building-plugins/migrating',
                'frontend-system/building-plugins/internationalization',
                'frontend-system/building-plugins/analytics',
                'frontend-system/building-plugins/feature-flags',
              ],
            ),
            sidebarElementWithIndex(
              {
                label: 'Building Apps',
                description: 'Guides on building frontend applications.',
              },
              [
                'frontend-system/building-apps/index',
                'frontend-system/building-apps/installing-plugins',
                'frontend-system/building-apps/configuring-extensions',
                'frontend-system/building-apps/built-in-extensions',
                'frontend-system/building-apps/plugin-conversion',
                'frontend-system/building-apps/module-federation',
                'frontend-system/building-apps/migrating',
                'frontend-system/building-apps/app-visualizer',
              ],
            ),
            sidebarElementWithIndex(
              {
                label: 'Utility APIs',
                description: 'Utility APIs for the frontend system.',
              },
              [
                'frontend-system/utility-apis/index',
                'frontend-system/utility-apis/creating',
                'frontend-system/utility-apis/consuming',
                'frontend-system/utility-apis/configuring',
                'frontend-system/utility-apis/testing',
              ],
            ),
          ],
        ),
        sidebarElementWithIndex(
          {
            label: 'Backstage CLI',
            description: 'Command-line interface for Backstage.',
          },
          [
            'tooling/cli/overview',
            'tooling/cli/build-system',
            'tooling/cli/commands',
            'tooling/cli/templates',
            sidebarElementWithIndex(
              {
                label: 'CLI Modules',
                description:
                  'Documentation for each CLI module and its commands.',
              },
              [
                'tooling/cli/modules',
                'tooling/cli/module-auth',
                'tooling/cli/module-actions',
                'tooling/cli/module-build',
                'tooling/cli/module-config',
                'tooling/cli/module-github',
                'tooling/cli/module-info',
                'tooling/cli/module-lint',
                'tooling/cli/module-maintenance',
                'tooling/cli/module-migrate',
                'tooling/cli/module-new',
                'tooling/cli/module-test',
                'tooling/cli/module-translations',
                'tooling/cli/module-package-manager-yarn',
              ],
            ),
            'tooling/cli/building-cli-modules',
            sidebarElementWithIndex(
              {
                label: 'Local Development',
                description:
                  'Guides for local development using Backstage CLI.',
              },
              [
                'tooling/local-dev/linking-local-packages',
                'tooling/local-dev/debugging',
                'tooling/local-dev/profiling',
              ],
            ),
            'tooling/package-managers',
            'tooling/package-metadata',
          ],
        ),
        'tooling/codemods',
        sidebarElementWithIndex(
          {
            label: 'User Interface',
            description: 'User interface customization and configuration.',
          },
          [
            'conf/user-interface/index',
            'conf/user-interface/logo',
            'conf/user-interface/icons',
            'conf/user-interface/sidebar',
          ],
        ),
        sidebarElementWithIndex(
          {
            label: 'OpenAPI',
            description:
              'Work with OpenAPI specifications and generate clients.',
          },
          [
            'openapi/01-getting-started',
            'openapi/generate-client',
            'openapi/test-case-validation',
          ],
        ),
      ],
    ),
    sidebarElementWithIndex(
      {
        label: 'Tutorials',
        description:
          'Step-by-step tutorials for various Backstage features and use cases.',
      },
      [
        sidebarElementWithIndex(
          {
            label: 'Non-technical',
            description: 'Non-technical tutorials and guides.',
          },
          ['overview/adopting'],
        ),
        sidebarElementWithIndex(
          {
            label: 'Technical',
            description: 'Technical tutorials and guides.',
          },
          [
            'tutorials/configuring-plugin-databases',
            'tutorials/manual-knex-rollback',
            'tutorials/switching-sqlite-postgres',
            'tutorials/using-backstage-proxy-within-plugin',
            'tutorials/corporate-proxy',
            'tutorials/enable-public-entry',
            'tutorials/setup-opentelemetry',
            'tutorials/integrating-event-driven-updates-with-entity-providers',
            'accessibility/index',
          ],
        ),
        sidebarElementWithIndex(
          {
            label: 'Migrations',
            description:
              'Guides for migrating between different versions and systems.',
          },
          [
            'tutorials/jest30-migration',
            'tutorials/react-router-stable-migration',
            'tutorials/react18-migration',
            'tutorials/package-role-migration',
            'tutorials/yarn-migration',
            'tutorials/migrate-to-mui5',
            'tutorials/auth-service-migration',
            'tutorials/jsx-transform-migration',
          ],
        ),
      ],
    ),
    sidebarElementWithIndex(
      {
        label: 'Plugins (Legacy)',
        description:
          'Legacy plugin development documentation for the old frontend system. For new development, see the Frontend System and Backend System sections under Framework.',
      },
      [
        'plugins/index',
        'plugins/create-a-plugin',
        'plugins/plugin-development',
        'plugins/structure-of-a-plugin',
        'plugins/integrating-plugin-into-software-catalog',
        'plugins/integrating-search-into-plugins',
        'plugins/composability',
        'plugins/internationalization',
        'plugins/analytics',
        'plugins/feature-flags',
        sidebarElementWithIndex(
          {
            label: 'Backends and APIs',
            description: 'Build and manage backend services and APIs.',
          },
          [
            'plugins/proxying',
            'plugins/backend-plugin',
            'plugins/call-existing-api',
          ],
        ),
        sidebarElementWithIndex(
          { label: 'Testing', description: 'Testing plugins and modules.' },
          ['plugins/testing'],
        ),
        sidebarElementWithIndex(
          { label: 'Publishing', description: 'Publishing your plugins.' },
          ['plugins/add-to-directory', 'plugins/plugin-directory-audit'],
        ),
        'plugins/observability',
        'plugins/new-backend-system',
      ],
    ),
    sidebarElementWithIndex(
      { label: 'FAQ', description: 'Frequently asked questions and answers.' },
      ['faq/index', 'faq/product', 'faq/technical'],
    ),
    sidebarElementWithIndex(
      {
        label: 'Contribute',
        description: 'Information on contributing to Backstage.',
      },
      [
        'contribute/index',
        'contribute/getting-involved',
        'contribute/project-structure',
        'contribute/doc-style-guide',
      ],
    ),
    sidebarElementWithIndex(
      {
        label: 'References',
        description: 'Reference materials and documentation.',
      },
      [
        sidebarElementWithIndex(
          {
            label: 'Designing for Backstage',
            description:
              'Guidelines and resources for designing Backstage components.',
          },
          [
            'dls/design',
            'dls/component-design-guidelines',
            'dls/contributing-to-storybook',
            'dls/figma',
          ],
        ),
        sidebarElementWithIndex(
          {
            label: 'Architecture Decision Records (ADRs)',
            description:
              'Documentation of architectural decisions made in Backstage.',
          },
          [
            'architecture-decisions/adrs-overview',
            'architecture-decisions/adrs-adr001',
            'architecture-decisions/adrs-adr002',
            'architecture-decisions/adrs-adr003',
            'architecture-decisions/adrs-adr004',
            'architecture-decisions/adrs-adr005',
            'architecture-decisions/adrs-adr006',
            'architecture-decisions/adrs-adr007',
            'architecture-decisions/adrs-adr008',
            'architecture-decisions/adrs-adr009',
            'architecture-decisions/adrs-adr010',
            'architecture-decisions/adrs-adr011',
            'architecture-decisions/adrs-adr012',
            'architecture-decisions/adrs-adr013',
            'architecture-decisions/adrs-adr014',
            'architecture-decisions/adrs-adr015',
          ],
        ),
        'api/deprecations',
        'references/glossary',
        'api/utility-apis',
        'references/index',
      ],
    ),
  ],
  releases: {
    'Release Notes': releases.map(release => `releases/${release}`),
  },
};
