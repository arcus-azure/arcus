# Role-based authentication in Azure API Management made easy in Arcus Scripting v0.8
Managing roles during JWT validation was tedious and repetitive work. Luckily, the newest Arcus Scripting release changed that.

## Validating JSON web tokens in Azure API Management
The `validate-jwt` policy in Azure API Management provides the capability to enforce a valid JWT in an incoming HTTP request. One of these validation rules is whether certain roles have been assigned to a service principal. This authorization functionality is very useful to allow/deny certain functionality to users of the application.

Management of service principal roles to certain Azure Directory Applications is rather tedious. One has to look up the role assignments of an Azure Active Directory application to find out if the service principal has the correct access. Moreover, in certain scenarios, one has to wait a couple of seconds before a role assignment is available for use. All this adds to the problem of managing a service principal for validating JWTs in Azure API Management.

An example of such policy is shown here:

```xml
<validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
    <openid-config url="{{openid-config-url}}" />
    <issuers>
        <issuer>{{issuer}}</issuer>
    </issuers>
    <required-claims>
        <claim name="roles" match="any">
            <value>DummyRole</value>
        </claim>
    </required-claims>
</validate-jwt>
```

## List, add, and remove role assignments for a service principal
In a single Arcus Scripting release, we have fully fixed the problem of role assignments for a service principal. In a new `Arcus.Scripting.ActiveDirectory` PowerShell module, we have created three functions that let you list, add, and remove role assignments to let a service principal access an Azure Active Directory.

```powershell
PS> List-AzADAppRoleAssignments `
  -ClientId 'b885c208-6067-44bd-aba9-4010c62b7d85' `
  -RolesAssignedToClientId '6ea09bbd-c21c-460c-b58a-f4a720f51826'
#Found role 'FirstRole' on Active Directory Application 'main-application'
#Role 'FirstRole' is assigned to the Active Directory Application 'client-application-one' with id '6ea09bbd-c21c-460c-b58a-f4a720f51826'
#Found role 'SecondRole' on Active Directory Application 'main-application'
#Role 'SecondRole' is assigned to the Active Directory Application 'client-application-one' with id '6ea09bbd-c21c-460c-b58a-f4a720f51826'

PS> Add-AzADAppRoleAssignment `
  -ClientId "b885c208-6067-44bd-aba9-4010c62b7d85" `
  -Role "DummyRole" `
  -AssignRoleToClientId "6ea09bbd-c21c-460c-b58a-f4a720f51826"
#Active Directory Application 'main-application' does not contain the role 'DummyRole', adding the role
#Added Role 'DummyRole' to Active Directory Application 'main-application'
#Role Assignment for the role 'DummyRole' added to the Active Directory Application 'client-application-one'

PS> Remove-AzADAppRoleAssignment `
  -ClientId "b885c208-6067-44bd-aba9-4010c62b7d85" `
  -Role "DummyRole" `
  -RemoveRoleFromClientId "6ea09bbd-c21c-460c-b58a-f4a720f51826" `
#Role assignment for 'DummyRole' has been removed from Active Directory Application 'client-application-one'
```

These scripts will make sure that we can easily manage a role on the 'main' Azure application registration and assign it to another service principal.
For more information on the `Arcus.Scripting.ActiveDirectory` PowerShell module, see [our dedicated documentation](https://scripting.arcus-azure.net/features/powershell/azure-active-directory).

## Conclusion
The Arcus Scripting library is the most diverse Arcus project because it does not provide gigantic changes in specific topics, but smaller, practical solutions to sometimes tedious and/or repetitive problems that occur in client projects. This newest Arcus update is a great example of how we fixed the problem so that developers can manage their Azure API Management authorization with minimal effort.

Have a look at our [release notes](https://github.com/arcus-azure/arcus.scripting/releases/tag/v0.8.0) and [official documentation](https://scripting.arcus-azure.net/) for more information on this new release.

If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact the Arcus team at Codit](https://github.com/arcus-azure/arcus.scripting/issues/new/choose).

Thanks for reading!
The Arcus team