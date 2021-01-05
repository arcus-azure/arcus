# Gain insights in the Databricks Jobs with Arcus Background Jobs

Starting from [Arcus Background Jobs v0.2](https://github.com/arcus-azure/arcus.backgroundjobs/releases/tag/v0.2.0) we have introduced a new library to monitor Databricks clusters. The challenge with Databricks clusters in Azure is that they do not provide out-of-the-box job metrics in Azure Monitor which makes it hard to operate them. People would have to look up the status of the Databricks job themselves to figure out how it ran and using automated alerts is hard.

This post will show you how our new version of the **Arcus Background Jobs** library will help you with this problem so the next time you run a Databricks job, you'll be notified right away!

## Cluster jobs

Here's a take on some Databricks jobs which have been run on a cluster. Note the end result is shown in the last column.
![Cluster jobs](./images/cluster-jobs.png)

The outcome of this blog post would be that we could notify the consumer of the job outcome without looking it up in the Databricks cluster itself. 

## Azure Function Databricks Job Metrics

The **Arcus Background Jobs** library includes a new package in the v0.2 version called [Arcus.BackgroundJobs.Databricks](https://www.nuget.org/packages/Arcus.BackgroundJobs.Databricks/). This package contains all the necessary capabilities to query the Databricks cluster so we can retrieve the result of the completed jobs. 
We'll use an Azure Function to create a timer that will periodically query this Databricks cluster.

The job outcome itself will be written as an Application Insights Metric so we can use it later as a source of an alert.

Here's an example of how this Azure Function can be set up:

```csharp
using Arcus.Security.Core;
using Arcus.BackgroundJobs.Databricks;
using Microsoft.Azure.Databricks.Client;

namespace GainInsights
{
    public class DatabricksJobMetricsFunction
    {
        private readonly IConfiguration _configuration;
        private readonly ISecretProvider _secretProvider;

        public DatabricksJobMetricsFunction(IConfiguration configuration, ISecretProvider secretProvider)
        {
            _configuration = configuration;
            _secretProvider = secretProvider;
        }

        [FunctionName("databricks-job-metrics")]
        public async Task Run([TimerTrigger("0 */1 * * * *")]TimerInfo timer, ILogger logger)
        {
            var metricName = "Databricks Job Completed";
            var baseUrl = _configuration.GetValue<string>("Arcus:Databricks:Url");
            string secretToken = await _secretProvider.GetRawSecretAsync("Arcus.Databricks.SecretToken");

            var startOfWindow = timer.ScheduleStatus.Last;
            var endOfWindow = timer.ScheduleStatus.Next;

            using var client = DatabricksClient.CreateClient(baseUrl, secretToken);
            using (var provider = new DatabricksInfoProvider(client, logger))
            {
                await provider.MeasureJobOutcomesAsync(metricName, startOfWindow, endOfWindow);
            }
        }
    }
}
```

The `DatabricksInfoProvider` is an Arcus type that allows you to either measure the job outcomes directly, or query them so you can log them yourself. For more information on this type, see [the official docs](https://background-jobs.arcus-azure.net/features/databricks/gain-insights).

> 💡 We specify a time window in which we want the completed jobs to exist. This is now set at the start and end of each run of the Azure Function time trigger.

## Application Insights metrics and alerts

All the previous setup  will result in log metrics like the following:
```
Metric Databricks Job Completed: 1 at 12/10/2020 08:50:01 +00:00 (Context: [Run Id, 77], [Job Id, 9], [Job Name, My Databricks Job], [Outcome, success])
```

If you want them to be in Application Insights, please use [our own Application Insights Serilog sink](https://observability.arcus-azure.net/features/sinks/azure-application-insights) so the written log message is discovered as metrics and not traces.

The metrics will show up as custom metrics:

![Custom metrics](./images/custom-metrics.png)

The Databricks job outcome is available as custom dimension in the metric:

![Custom dimensions](./images/custom-dimensions.png)

If you want, you can create an alert on this metric by going to **Application Insights > Monitoring > Alerts > New alert rule**.

![New alert rule](./images/new-alert-rule.png)

There, in the alert condition, the Databricks metric will be available to you.

![Alert condition](./images/alert-condition.png)

# Conclusion

In this post we have looked on how we can monitor Databricks jobs with the new **Arcus BackgroundJobs** library. We're not inventing anything new here, only integreting existing services: Databricks job outcomes to Azure Function to Application Insights.

You'll be happy to know that we have created an project template for this with already the necessary Azure Function and packages embedded.
This template will be available starting from v0.5 in the [Arcus Templates](https://templates.arcus-azure.net/) library.

Thanks for reading!
