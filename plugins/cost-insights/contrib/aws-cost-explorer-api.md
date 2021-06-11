# Using the AWS Cost Explorer API with Cost Insights

Cost Insights currently does not provide a CostInsightsApi client out of the box, this is left up to the implementer. We plan to provide an open-source client and backend eventually that can pull cost data from different cloud providers. In the meantime, we briefly explored the AWS Cost Explorer API and wanted to share our findings. Please contribute to this documentation if you try any experiments with AWS Cost Explorer.

**Note:** Each request using the Cost Explorer API will incur a cost of \$0.01. If you anticipate high usage, adding some caching of Cost Explorer API responses could prove worthwhile over time.

## Authentication

The CostExplorerClient needs to be initialized with access keys tied to an IAM account. You'll need to attach the Cost Explorer policy to the IAM account to be able to make requests to the Cost Explorer API.

Cost Explorer permission policy:

```JSON
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ce:*"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}

```

## Setup

Install the AWS Cost Explorer SDK. The AWS docs recommend using the SDK over making calls to the API directly as it simplifies authentication and provides direct access to commands.

```bash
# From your Backstage root directory
cd packages/app
yarn add @aws-sdk/client-cost-explorer
```

## Usage of the SDK

1. Initiate a CostExplorerClient with the appropriate configuration (e.g. credentials, region).

```ts
const client = new CostExplorerClient({
  region: 'REGION',
  credentials: {
    accessKeyId: 'ACCESSKEYID',
    secretAccessKey: 'SECRETACCESSKEY',
  },
});
```

2. Initiate a command with the relevant input parameters. The SDK provides a variety of commands, but you can access most cost data using the [GetCostAndUsageCommand](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_GetCostAndUsage.html) commands with the relevant [parameters](#GetCostAndUsageCommand-Parameters).

```ts
const command = new GetCostAndUsageCommand(params);
```

3. Call the `send` operation on the Cost Explorer client with the command object.

```ts
// async/await.
try {
  const data = await client.send(command);
  // process data.
} catch (error) {
  // error handling.
} finally {
  // finally.
}
```

## Implementing methods on [CostInsightsApi](https://github.com/backstage/backstage/blob/master/plugins/cost-insights/src/api/CostInsightsApi.ts)

We can use the data provided by the Cost Explorer API to implement CostInsightsApi methods such as `getGroupDailyCost`, `getProjectDailyCost`, and `getProductInsights`. You'll still need to provide external data for methods such as `getUserGroups` and `getAlerts`.

### 1. [getGroupDailyCost](https://github.com/backstage/backstage/blob/master/plugins/cost-insights/src/api/CostInsightsApi.ts#L93)

The `getGroupDailyCost` method is expected to return daily cost aggregations for a given group and interval time frame as a [`Cost`](https://github.com/backstage/backstage/blob/master/plugins/cost-insights/src/types/Cost.ts).

#### Total Daily cost

By using the `GetCostAndUsageCommand` command with some simple parameters, you should be able to use the response to construct a `Cost` object to represent daily cost aggregations.

Sample command:

```ts
const command = new GetCostAndUsageCommand({
  TimePeriod: { Start: '2020-12-01', End: '2021-01-02' },
  Metrics: ['Unblended Cost'],
  Filter: {
    Dimensions: { Key: 'LINKED_ACCOUNT', Values: ['ACCOUNT_ID'] },
  },
  Granularity: 'DAILY',
});
```

The response provides a `ResultsByTime` array, where each [object](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_ResultByTime.html) contains the time period and costs for a single day. This should give you enough data to represent the `aggregation` field with some minor reformatting.

Sample response:

```ts
   {
     ...
     ResultsByTime: [
       {
         Estimated: false,
         TimePeriod: {
           End: '2020-12-02',
           Start: '2020-12-01',
         },
         Total: { UnblendedCost: { Amount: '9392.30', Unit: 'USD' } },
       },
       {
         Estimated: false,
         TimePeriod: {
           End: '2020-12-03',
           Start: '2020-12-02',
         },
         Total: { UnblendedCost: { Amount: '1543.93', Unit: 'USD' } },
       },
     ],
   }
```

#### Daily cost breakdown

You can optionally provide a `groupedCosts` field on the `Cost` object to view daily costs broken down by specific groupings. Each key-value pair on `groupedCosts` will result in an additional tab in the top panel that displays an area chart of costs broken down by that key.

You can get grouped daily costs from the API by using the `GetCostAndUsageCommand` command with a [`GroupBy`](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_GetCostAndUsage.html#awscostmanagement-GetCostAndUsage-request-GroupBy) parameter. For example, you can use the `SERVICE` dimension to group costs by cloud product.

Sample command:

```ts
const command = new GetCostAndUsageCommand({
  TimePeriod: { Start: '2020-12-01', End: '2021-01-02' },
  Metrics: ['Unblended Cost'],
  Filter: {
    Dimensions: { Key: 'LINKED_ACCOUNT', Values: ['ACCOUNT_ID'] },
  },
  Granularity: 'DAILY',
  GroupBy: [
    {
      Type: 'DIMENSION',
      Key: 'SERVICE',
    },
  ],
});
```

The `ResultsByTime` objects provide a `Groups` array with an entry for each group and its costs for the given day. Since `groupedCosts` expects a separate `Cost` object per group, you'll need to aggregate daily cost data for each group from the response.

Sample Response:

```ts
{
  ...
  ResultsByTime: [
    {
      TimePeriod: {
        End: '2020-12-02',
        Start: '2020-12-01',
      },
      Estimated: false,
      Groups: [
        {
          Keys: ['Amazon Simple Storage Service'],
          Metrics: {
            UnblendedCost: { Amount: '169.442', Unit: 'USD' },
          },
        },
        {
          Keys: ['Amazon Relational Database Service'],
          Metrics: {
            UnblendedCost: { Amount: '74.11115', Unit: 'USD' },
          },
        },
        ...
      ],
    },
  ],
}
```

Sample `groupedCosts` based on the response:

```ts
{
  product: [
    {
      id: 'Amazon Simple Storage Service',
      aggregation: [
        { date: '2020-12-01', amount: 169.442 },
        ...,
      ]
    },
    {
      id: 'Amazon Relational Database Service',
      aggregation: [
        { date: '2020-12-01', amount: 74.11115 },
        ...
      ]
    },
  ]
}
```

### 2. [getProjectDailyCost](https://github.com/backstage/backstage/blob/master/plugins/cost-insights/src/api/CostInsightsApi.ts#L111)

The `getProjectDailyCost` method is expected to return daily cost aggregations for a given billing entity and interval time frame as a [`Cost`](https://github.com/backstage/backstage/blob/master/plugins/cost-insights/src/types/Cost.ts).

This should be similar to the `getGroupDailyCost` method implementation, but with an updated `LINKED_ACCOUNT` filter to get narrower cost data for a lower-level linked account.

### 3. [getProductInsights](https://github.com/backstage/backstage/blob/master/plugins/cost-insights/src/api/CostInsightsApi.ts#L111)

The `getProductInsights` method is expected to return cost aggregations for a particular cloud product and interval time frame as an [`Entity`](https://github.com/backstage/backstage/blob/master/plugins/cost-insights/src/types/Entity.ts).

#### Cloud product cost by resource

The Cost Explorer API doesn't provide resource level costs by default. To achieve this, you need to add [cost allocation tags](#cost-allocation-tags) to each resource and use those tags to group costs.

Once resources have been tagged, we can filter by the service (ex: S3) and group by the tag key (ex: S3-Bucket-Name). Any resources that do not have a value for the given tag will be grouped into a single cost group where the key is not the bucket name, but the tag key with a $ appended (ex: S3-Bucket-Name$). We can aggregate the daily costs for each resource and provide the data for the comparison in the bar chart.

Sample command:

```ts
const command = new GetCostAndUsageCommand({
  TimePeriod: {
    End: '2020-12-02',
    Start: '2020-12-01',
  },
  Metrics: ['UnblendedCost'],
  Granularity: 'DAILY',
  Filter: {
    And: [
      { Dimensions: { Key: 'LINKED_ACCOUNT', Values: ['ACCOUNT_ID'] } },
      {
        Dimensions: {
          Key: 'SERVICE',
          Values: ['Amazon Simple Storage Service'],
        },
      },
    ],
  },
  GroupBy: [{ Type: 'TAG', Key: 'S3-Bucket-Name' }],
});
```

The `ResultsByTime` objects provide a `Groups` array with an entry for each resource and its costs for the given day. You'll need to aggregate cost data into two bucketed time periods (e.g. month vs month, or quarter vs quarter) for each resource since this is the expected data type for the `aggregation` field on `Entity`.

Sample response:

```ts
{
  ...
  ResultsByTime: [
    {
      TimePeriod: {
        End: '2020-12-02',
        Start: '2020-12-01',
      },
      Estimated: false,
      Groups: [
        {
          Keys: ['S3-Bucket-Name$'],
          Metrics: {
            UnblendedCost: { Amount: '345.23', Unit: 'USD' },
          },
        },
        {
          Keys: ['Bucket1'],
          Metrics: {
            UnblendedCost: { Amount: '111.09', Unit: 'USD' },
          },
        },
        {
          Keys: ['Bucket2'],
          Metrics: {
            UnblendedCost: { Amount: '254.1111', Unit: 'USD' },
          },
        },
      ],
    },
     ],
   };

```

#### Resource cost breakdown

There are a couple of options for breaking down costs for a resource.

1. We can use `USAGE_TYPE` (units used to measure usage for each service) supported by the `GroupBy` field. This requires the lowest amount of effort as we can easily add it to the existing resource request. Examples usage types for EC2: `BoxUsage:c1.medium(Hrs)`, `BoxUsage:m3.xlarge(Hrs)`, and `BoxUsage:t1.micro(Hrs)`

2. Similar to resources, we can use custom tags to group the data. For example, you’re able to tag objects within a bucket so that would be one way to get more granularity within a resource. More info on object tagging [here](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-tagging.html).

## Cost Allocation Tags

Tags are labels that you can assign to an AWS resource, each with a key and value. You can use cost allocation tags to track your AWS costs on a detailed level. You can tag resources through the AWS UI by using the Tags tab on the relevant resource screen. You can also add tags programmatically via the relevant cloud product API.

After tagging your resources (either through UI or API), you still need to activate the tags through the UI. Once tags are activated there’s a 24-hour delay until you see the data in Cost Explorer. The tags don’t apply to historical data, so you only get cost allocation for dates after the tag activation date. More info on activating tags [here](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/activating-tags.html).

### Adding Tags

We've looked into how tagging works for some popular AWS products, but unfortunately the methods seem to be different depending on the service. You'd also need to implement the client and get permissions for each service to be able to add tags programmatically.

S3 Tagging:
There's currently no capability to specify a tag during bucket creation. You must first create the bucket and then perform a second action to add the tag. You can tag buckets through the AWS console, but in order to do this programmatically, you'll need to use and have access to the S3 API. Additionally, there's no way to specify multiple buckets when tagging, so you would need to make a request to tag each bucket. More on tagging buckets through the API [here](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutBucketTagging.html).

Similar to S3, you can add tags through the UI as well the EC2 API itself. The [`CreateTags`](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateTags.html) method allows you to tag multiple resources (up to a 1000) at a time. You can also specify tags when launching instances or include them in the launch templates. More on EC2 tagging [here](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html).

## [GetCostAndUsageCommand Parameters](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_GetCostAndUsage.html#API_GetCostAndUsage_RequestParameters)

1. TimePeriod (required):
   Expects an inclusive `Start` and exclusive `End` date in YYYY-MM-DD format.

2. Metrics (required):
   Valid values: AmortizedCost, BlendedCost, NetAmortizedCost, NetUnblendedCost, NormalizedUsageAmount, UnblendedCost, and UsageQuantity

   While you can choose any cost dataset, we've used 'UnblendedCost' in the examples above as it is used by the majority of AWS users. More information on different cost types [here](https://aws.amazon.com/blogs/aws-cost-management/understanding-your-aws-cost-datasets-a-cheat-sheet/).

3. Granularity:
   Valid values: DAILY, MONTHLY, or HOURLY.

   We've used the 'DAILY' granularity above as it allows for the most flexibility depending on the requested time period.

4. GroupBy:
   Valid values: AZ, INSTANCE_TYPE, LEGAL_ENTITY_NAME, LINKED_ACCOUNT, OPERATION, PLATFORM, PURCHASE_TYPE, SERVICE, TAGS, TENANCY, RECORD_TYPE, and USAGE_TYPE.
