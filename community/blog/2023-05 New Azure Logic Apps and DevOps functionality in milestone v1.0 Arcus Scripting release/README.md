# New Azure Logic Apps and DevOps functionality in milestone v1.0 Arcus Scripting release
We recently released the milestone v1.0 release in the Arcus Scripting library. Besides new functionality, this is a milestone in bringing reliable scripting functionality to projects.

## Azure Logic Apps
Azure Logic Apps functionality has been a part of the Arcus Scripting library for a long time. The recent changes only expand the usability further to bring real added value to projects working with Logic Apps.

### Resubmit failed instances on an Azure Logic App
One of the hurdles with managing failed Azure Logic Apps instances is that you have to manually resubmit each instance individually in the Azure Portal. There is no 'batch' functionality available for this kind of operation. That is why the new v1.0 release has a new command in the `Arcus.Scripting.LogicApps` PowerShell module that lets you interact with the Logic App in a more high-level way. Instead of specifying each failed instance separately, it uses date filtering to get many failed instances in a given time frame.

```powershell
PS> Resubmit-FailedAzLogicAppRuns `
  -ResourceGroupName "rg-common-dev" `
  -LogicAppName "rcv-shopping-order-sftp" `
  -StartTime "2023-05-01 00:00:00" `
  -EndTime "2023-05-01 10:00:00"
# Successfully resubmitted all failed instances for the Azure Logic App 'rcv-shopping-order-sftp' in resource group 'rg-common-dev' from '2023-05-01 00:00:00' and until '2023-05-01 10:00:00'
```

🔗 For more information on this particular command and other Logic Apps-related commands in this module, [see our feature documentation](https://scripting.arcus-azure.net/Features/powershell/azure-logic-apps).

### Cancel running instances on an Azure Logic App
Same as with failed Logic Apps instances, there is no 'batch' functionality to cancel running instances on an Azure Logic App in the Azure Portal. This is particularly a problem when the instances were accidentally triggered with a big load. With a combination of several Azure PowerShell commands, you can mimic this functionality but it is not maintainable or easy to transfer to other projects that require the same or similar functionality. Arcus Scripting v1.0 also includes a 'batch' version of canceling many running Azure Logic Apps instances in one go.

```powershell
PS> Cancel-AzLogicAppRuns `
  -ResourceGroupName "rg-common-dev" `
  -LogicAppName "rcv-shopping-order-sftp"
# Successfully cancelled all running instances for the Azure Logic App 'rcv-shopping-order-sftp' in resource group 'rg-common-dev'
```

🚩 It is important to note that this functionality is externally requested by a contributor. It is yet another a great example of how the usability of the Arcus Scripting library. It is fully grown out of the challenges and struggles of interacting with Azure-related resources using PowerShell. An extra layer that makes this interaction more comfortable and logical.

🔗 For more information on this particular command and other Logic Apps-related commands in this module, [see our feature documentation](https://scripting.arcus-azure.net/Features/powershell/azure-logic-apps).

## Azure DevOps
There is not even an Azure DevOps package that lets you interact with DevOps-related custom functionality. Interacting with DevOps functionality requires constant research for the correct syntax and possibilities. Luckily, with Arcus Scripting we have bundled commonly used functionality in the `Arcus.Scripting.DevOps` module which the v1.0 release enhances even further. 

### Set a variable as secret
Setting a secret in Azure DevOps dynamically at runtime requires you to write a specially designed host message. Because of this fragile way of working, we already had a command that was able to do this for you. This release now adds the option to dynamically write a variable as a secret. This means that it is not publicly logged in the build output so is handled with more care.

```powershell
PS> Set-AzDevOpsVariable "my-variable" "my-variable-value" -AsSecret
##vso[task.setvariable variable=my-variable;issecret=true]***
```

🔗 For more information on this particular command and other DevOps-related commands in this module, [see our feature documentation](https://scripting.arcus-azure.net/Features/powershell/azure-devops).

### Set a custom retention period
We were already able to programmatically retain an Azure DevOps build indefinitely. In some scenarios, though, indefinite is too long. Especially if you have to delete them manually. The new v1.0 release will let you pass in the number of days such a build should be saved, making the command more flexible for numerous scenarios.

```powershell
PS> Save-AzDevOpsBuild `
  -ProjectId $(System.TeamProjectId) `
  -BuildId $(Build.BuildId) `
  -DaysToKeep 10
# Saved Azure DevOps build for 10 days with build ID $BuildId in project $ProjectId
```

💡 The variables `$(System.TeamProjectId)` and `$(Build.BuildId)` are predefined Azure DevOps variables. Information on them can be found [here](https://docs.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=yaml).

## Conclusion
We have released Arcus Scripting v1.0! 🎉

This new major release has besides some great new and enhanced functionality a big role to play. From now on we are confident that the Arcus Scripting library is ready for the public. It has been used across several projects, has received many enhancement and feature requests, which makes it mature enough for us to decide to take this milestone of a step.

Have a look at our [release notes](https://github.com/arcus-azure/arcus.scripting/releases/tag/v1.0.0) and [official documentation](https://scripting.arcus-azure.net/) for more information on this new release.

If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact the Arcus team at Codit](https://github.com/arcus-azure/arcus.scripting/issues/new/choose).

Thanks for reading!
The Arcus team