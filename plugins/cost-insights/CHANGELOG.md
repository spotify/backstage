# @backstage/plugin-cost-insights

## 0.11.1

### Patch Changes

- 0b4d00687: Replaced moment and dayjs with Luxon
- Updated dependencies
  - @backstage/core-components@0.1.4

## 0.11.0

### Minor Changes

- d719926d2: **BREAKING CHANGE** Remove deprecated route registrations, meaning that it is no longer enough to only import the plugin in the app and the exported page extension must be used instead.

### Patch Changes

- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.3

## 0.10.2

### Patch Changes

- 9d906c7a1: Move `canvas` package to `devDependencies`.

## 0.10.1

### Patch Changes

- 41c3ec421: fix for query parameters with null groups
- Updated dependencies [cc592248b]
  - @backstage/core@0.7.11

## 0.10.0

### Minor Changes

- 7cbfcae48: support jsx in alert titles

### Patch Changes

- 5914a76d5: Added example client
- Updated dependencies [65e6c4541]
- Updated dependencies [5da6a561d]
  - @backstage/core@0.7.10

## 0.9.1

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- 675a569a9: chore: bump `react-use` dependency in all packages
- Updated dependencies [062bbf90f]
- Updated dependencies [889d89b6e]
- Updated dependencies [3f988cb63]
- Updated dependencies [675a569a9]
  - @backstage/core@0.7.9

## 0.9.0

### Minor Changes

- 6f1b82b14: make change ratio optional

### Patch Changes

- Updated dependencies [f65adcde7]
- Updated dependencies [80888659b]
- Updated dependencies [7b8272fb7]
- Updated dependencies [d8b81fd28]
  - @backstage/core@0.7.8
  - @backstage/theme@0.2.7
  - @backstage/config@0.1.5

## 0.8.5

### Patch Changes

- b98de52ae: Support a `name` prop for Projects for display purposes
- c614ede9a: Updated README to have up-to-date install instructions.
- Updated dependencies [9afcac5af]
- Updated dependencies [e0c9ed759]
- Updated dependencies [6eaecbd81]
  - @backstage/core@0.7.7

## 0.8.4

### Patch Changes

- d10ea17c9: fix missing type exports of public components
- Updated dependencies [fcc3ada24]
- Updated dependencies [4618774ff]
- Updated dependencies [df59930b3]
  - @backstage/core@0.7.3
  - @backstage/theme@0.2.5

## 0.8.3

### Patch Changes

- Updated dependencies [40c0fdbaa]
- Updated dependencies [2a271d89e]
- Updated dependencies [bece09057]
- Updated dependencies [169f48deb]
- Updated dependencies [8a1566719]
- Updated dependencies [4c049a1a1]
  - @backstage/core@0.7.0

## 0.8.2

### Patch Changes

- 38205492a: Default alert properties can be overridden using accessors
- Updated dependencies [3a58084b6]
- Updated dependencies [e799e74d4]
- Updated dependencies [1407b34c6]
- Updated dependencies [9615e68fb]
- Updated dependencies [49f9b7346]
- Updated dependencies [3a58084b6]
- Updated dependencies [a1f5e6545]
- Updated dependencies [2c1f2a7c2]
  - @backstage/core@0.6.3
  - @backstage/config@0.1.3

## 0.8.1

### Patch Changes

- b33fa4cf4: fixes a bug in default dismiss form where other text input persists between reason selections
- d36660721: Fix snooze quarter option
- 02d6803e8: Migrated to new composability API, exporting the plugin instance as `costInsightsPlugin`, the root `'/cost-insights'` page as `CostInsightsPage`, the `'/cost-insights/investigating-growth'` page as `CostInsightsProjectGrowthInstructionsPage`, and the `'/cost-insights/labeling-jobs'` page as `CostInsightsLabelDataflowInstructionsPage`.
- Updated dependencies [b51ee6ece]
  - @backstage/core@0.6.1

## 0.8.0

### Minor Changes

- 19172f5a9: add alert hooks

### Patch Changes

- 4c6a6dddd: Fixed date calculations incorrectly converting to UTC in some cases. This should be a transparent change.
- Updated dependencies [12ece98cd]
- Updated dependencies [d82246867]
- Updated dependencies [c810082ae]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [21e624ba9]
- Updated dependencies [da9f53c60]
- Updated dependencies [32c95605f]
- Updated dependencies [54c7d02f7]
  - @backstage/core@0.6.0
  - @backstage/theme@0.2.3

## 0.7.0

### Minor Changes

- 19172f5a9: add alert hooks

## 0.6.0

### Minor Changes

- fac91bcc5: Add support for additional breakdowns of daily cost data.
  This changes the type of Cost.groupedCosts returned by CostInsightsApi.getGroupDailyCost.

### Patch Changes

- 8b7ef9f8b: Allow expand functionality to top panel product chart tooltip.

## 0.5.7

### Patch Changes

- 8c2437c15: bug(cost-insights): Remove entity count when none present
- Updated dependencies [efd6ef753]
- Updated dependencies [a187b8ad0]
  - @backstage/core@0.5.0

## 0.5.6

### Patch Changes

- 9e9504ce4: Minor wording change in UI

## 0.5.5

### Patch Changes

- ab0892358: Remove test dependencies from production package list

## 0.5.4

### Patch Changes

- 3fca9adb9: Fix links in sample instructions
- Updated dependencies [a08c32ced]
  - @backstage/core@0.4.3

## 0.5.3

### Patch Changes

- c02defd57: Make alert url field optional

## 0.5.2

### Patch Changes

- 48c305e69: pin all projects selection to the top of menu list
- Updated dependencies [8ef71ed32]
  - @backstage/core@0.4.1

## 0.5.1

### Patch Changes

- 64c9fd84c: fix breakdown sorting
- Fix bar chart legend label bug for unlabeled dataflow alerts

## 0.5.0

### Minor Changes

- e3071a0d4: Add support for multiple types of entity cost breakdown.

  This change is backwards-incompatible with plugin-cost-insights 0.3.x; the `entities` field on Entity returned in product cost queries changed from `Entity[]` to `Record<string, Entity[]`.

- d6e8099ed: convert duration + last completed billing date to intervals
- 88ef11b45: Remove calendar MoM period option and fix quarter end date logic

### Patch Changes

- 90458fed6: fix react-hooks/exhaustive-deps error
- Updated dependencies [2527628e1]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [e1f4e24ef]
- Updated dependencies [1c69d4716]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
- Updated dependencies [e3bd9fc2f]
  - @backstage/core@0.4.0
  - @backstage/config@0.1.2
  - @backstage/test-utils@0.1.5
  - @backstage/theme@0.2.2

## 0.4.2

### Patch Changes

- fe7257ff0: enable SKU breakdown for unlabeled entities
- a2cfa311a: Add breakdown view to the Cost Overview panel
- 69f38457f: Add support for non-SKU breakdowns for entities in the product panels.
- bec334b33: disable support button
- b4488ddb0: Added a type alias for PositionError = GeolocationPositionError
- 00670a96e: sort product panels and navigation menu by greatest cost
  update tsconfig.json to use ES2020 api
  - @backstage/test-utils@0.1.4

## 0.4.1

### Patch Changes

- 8e6728e25: fix product icon configuration
- c93a14b49: truncate large percentages > 1000%
- Updated dependencies [475fc0aaa]
  - @backstage/core@0.3.2

## 0.4.0

### Minor Changes

- 4040d4fcb: remove cost insights currency feature flag

### Patch Changes

- 1722cb53c: Added configuration schema
- 17a9f48f6: remove excessive margin from cost overview banner
- f360395d0: UI improvements: Increase width of first column in product entity dialog table
  UI improvement: Display full cost amount in product entity dialog table
- 259d848ee: Fix savings/excess display calculation
- Updated dependencies [1722cb53c]
  - @backstage/core@0.3.1
  - @backstage/test-utils@0.1.3

## 0.3.0

### Minor Changes

- 0703edee0: rename: Tooltip -> BarChartTooltip
  rename: TooltipItem -> BarChartTooltipItem
  Deprecate BarChartData in favor of BarChartOptions
  Export BarChartLegend component
  Update BarChart props to accept options prop
  Deprecate ProductCost type in favor of Entity. Update CostInsightsApi

### Patch Changes

- 9a294574c: Fix styling issue on Cost Insights product panels with no cost
- Updated dependencies [7b37d65fd]
- Updated dependencies [4aca74e08]
- Updated dependencies [e8f69ba93]
- Updated dependencies [0c0798f08]
- Updated dependencies [0c0798f08]
- Updated dependencies [199237d2f]
- Updated dependencies [6627b626f]
- Updated dependencies [4577e377b]
  - @backstage/core@0.3.0
  - @backstage/theme@0.2.1

## 0.2.0

### Minor Changes

- cab473771: This PR adds Spotify's Cost Insights Tool. Cost Insights explains costs from cloud services in an understandable way, using software terms familiar to your engineers. This tool helps you and your team make trade-offs between cost optimization efforts and your other priorities.

  Cost Insights features:

  Daily cost graph by team or billing account
  Cost comparison against configurable business metrics
  Insights panels for configurable cloud products your company uses
  Cost alerts and recommendations
  Selectable time periods for month over month, or quarter over quarter cost comparison
  Conversion of cost growth into average engineer cost (configurable) to help optimization trade-off decisions

  ![plugin-cost-insights](https://user-images.githubusercontent.com/3030003/94430416-e166d380-0161-11eb-891c-9ce10187683e.gif)

  This PR adds the Cost Insights frontend React plugin with a defined CostInsightsApi. We include an example client with static data in the expected format. This API should talk with a cloud billing backend that aggregates billing data from your cloud provider.

  Fixes #688 💵

- bb48b9833: Added getLastCompleteBillingDate to the CostInsightsApi to reason about completeness of billing data
- 6a84cb072: Enable custom alert types in Cost Insights
- e7d4ac7ce: - getProjectDailyCost and getGroupDailyCost no longer accept a metric as a parameter
  - getDailyMetricData added to API for fetching daily metric data for given interval
  - dailyCost removed as configurable metric
  - default field added to metric configuration for displaying comparison metric data in top panel
  - Metric.kind can no longer be null
  - MetricData type added
- 0e67c6b40: Remove product filters from query parameters

### Patch Changes

- 8d1360aa9: export test utilities for mocking context
- 0ee9e9f66: migrate type utilities out of type definition files
- 5c70f3d35: expose alerts utilities for export
- fd8384d7e: prefer named exports
- 26e69ab1a: Remove cost insights example client from demo app and export from plugin
  Create cost insights dev plugin using example client
  Make PluginConfig and dependent types public
- Updated dependencies [819a70229]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [482b6313d]
- Updated dependencies [1c60f716e]
- Updated dependencies [144c66d50]
- Updated dependencies [b79017fd3]
- Updated dependencies [6d97d2d6f]
- Updated dependencies [93a3fa3ae]
- Updated dependencies [782f3b354]
- Updated dependencies [2713f28f4]
- Updated dependencies [406015b0d]
- Updated dependencies [82759d3e4]
- Updated dependencies [ac8d5d5c7]
- Updated dependencies [ebca83d48]
- Updated dependencies [aca79334f]
- Updated dependencies [c0d5242a0]
- Updated dependencies [3beb5c9fc]
- Updated dependencies [754e31db5]
- Updated dependencies [1611c6dbc]
  - @backstage/core@0.2.0
  - @backstage/theme@0.2.0
  - @backstage/test-utils@0.1.2
