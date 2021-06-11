# Cost Insights

Cost Insights is a plugin to help engineers visualize, understand and optimize their cloud costs. The Cost Insights page shows daily cost data for a team, trends over time, and comparisons with the business metrics you care about.

At Spotify, we find that cloud costs are optimized organically when:

- Engineers see cost data in their daily work (that is, in Backstage).
- It's clear when cloud costs need attention.
- The data is shown in software terms familiar to them.
- Alerts and recommendations are targeted and actionable.

Cost Insights shows trends over time, at the granularity of Backstage catalog entities - rather than the cloud provider's concepts. It can be used to troubleshoot cost anomalies, and promote cost-saving infrastructure migrations.

Learn more with the Backstage blog post [New Cost Insights plugin: The engineer's solution to taming cloud costs](https://backstage.io/blog/2020/10/22/cost-insights-plugin).

## Install

```bash
# From your Backstage root directory
cd packages/app
yarn add @backstage/plugin-cost-insights
```

## Setup

1. Configure `app-config.yaml`. See [Configuration](#configuration).

2. Create a CostInsights client. Clients must implement the [CostInsightsApi](https://github.com/backstage/backstage/blob/master/plugins/cost-insights/src/api/CostInsightsApi.ts) interface. Create your own or [use a template](https://github.com/backstage/backstage/blob/master/plugins/cost-insights/src/example/templates/CostInsightsClient.ts) to get started.

```ts
// path/to/CostInsightsClient.ts
import { CostInsightsApi } from '@backstage/plugin-cost-insights';

export class CostInsightsClient implements CostInsightsApi { ... }
```

**Note:** We've briefly explored using the AWS Cost Explorer API to implement a Cost Insights client. Learn more about our findings [here](https://github.com/backstage/backstage/blob/master/plugins/cost-insights/contrib/aws-cost-explorer-api.md).

3. Import the client and the Cost Insights plugin API to your Backstage instance.

```ts
// packages/app/src/api.ts
import { createApiFactory } from '@backstage/core';
import { costInsightsApiRef } from '@backstage/plugin-cost-insights';
import { CostInsightsClient } from './path/to/file';

export const apis = [
  createApiFactory({
    api: costInsightsApiRef,
    deps: {},
    factory: () => new CostInsightsClient(),
  }),
];
```

4. Add the `CostInsightsPage` extension to your `App.tsx`:

```tsx
// packages/app/src/App.tsx
import { CostInsightsPage } from '@backstage/plugin-cost-insights';

<FlatRoutes>
  ...
  <Route path="/cost-insights" element={<CostInsightsPage />} />
  ...
</FlatRoutes>;
```

5. Add Cost Insights to your app Sidebar.

To expose the plugin to your users, you can integrate the `cost-insights` route anyway that suits your application, but most commonly it is added to the Sidebar.

```diff
// packages/app/src/sidebar.tsx
+ import MoneyIcon from '@material-ui/icons/MonetizationOn';

 ...

 export const AppSidebar = () => (
   <Sidebar>
     <SidebarLogo />
     <SidebarSearch />
     <SidebarDivider />
     {/* Global nav, not org-specific */}
     <SidebarItem icon={HomeIcon} to="./" text="Home" />
     <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
     <SidebarItem icon={LibraryBooks} to="/docs" text="Docs" />
     <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
     <SidebarDivider />
     <SidebarItem icon={MapIcon} to="tech-radar" text="Tech Radar" />
+    <SidebarItem icon={MoneyIcon} to="cost-insights" text="Cost Insights" />
     {/* End global nav */}
     <SidebarDivider />
     <SidebarSpace />
     <SidebarDivider />
     <SidebarSettings />
   </Sidebar>
 );
```

## Configuration

Cost Insights has only two required configuration fields: a map of cloud `products` for showing cost breakdowns and `engineerCost` - the average yearly cost of an engineer including benefits. Products must be defined as keys on the `products` field.

You can optionally supply a product `icon` to display in Cost Insights navigation. See the [type file](https://github.com/backstage/backstage/blob/master/plugins/cost-insights/src/types/Icon.ts) for supported types and Material UI icon [mappings](https://github.com/backstage/backstage/blob/master/plugins/cost-insights/src/utils/navigation.tsx).

**Note:** Product keys should be unique and camelCased. Backstage does not support underscores in configuration keys.

### Basic

```yaml
## ./app-config.yaml
costInsights:
  engineerCost: 200000
  products:
    productA:
      name: Some Cloud Product ## required
      icon: storage
    productB:
      name: Some Other Cloud Product
      icon: data
```

### Metrics (Optional)

In the `Cost Overview` panel, users can choose from a dropdown of business metrics to see costs as they relate to a metric, such as daily active users. Metrics must be defined as keys on the `metrics` field. A user-friendly name is **required**. Metrics will be provided to the `getDailyMetricData` API method via the `metric` parameter.

An optional `default` field can be set to `true` to set the default comparison metric to daily cost in the Cost Overview panel.

```yaml
## ./app-config.yaml
costInsights:
  engineerCost: 200000
  products:
    productA:
      name: Some Cloud Product
      icon: storage
    productB:
      name: Some Other Cloud Product
      icon: data
  metrics:
    metricA:
      name: Metric A ## required
      default: true
    metricB:
      name: Metric B
    metricC:
      name: Metric C
```

## Alerts

The CostInsightsApi `getAlerts` method may return any type of alert or recommendation (called collectively "Action Items" in Cost Insights) that implements the [Alert type](https://github.com/backstage/backstage/blob/master/plugins/cost-insights/src/types/Alert.ts). This allows you to deliver any alerts or recommendations specific to your infrastructure or company migrations.

To learn more about using Cost Insights' ready-to-use alerts, see the alerts [README](https://github.com/backstage/backstage/blob/master/plugins/cost-insights/src/alerts/README.md).

Example implementations of custom alerts, forms and components can be found in the [examples](https://github.com/backstage/backstage/tree/master/plugins/cost-insights/src/example) directory.
