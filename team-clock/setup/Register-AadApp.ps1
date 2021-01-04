[CmdletBinding()]
param($environment = "local")

# Read environment files
Import-Module .\Set-PsEnv.psm1
Set-PsEnv "../.env.$environment"

# Settings for use in script
$appName = $env:SETUP_AAD_APPNAME
$scheme = "https://"
$hostname = $env:REACT_APP_MANIFEST_HOSTNAME
$port = $env:REACT_APP_MANIFEST_PORT
$years = $env:SETUP_AAD_YEARS_TO_EXPIRE_SECRET

"Registering application $env:SETUP_AAD_APPNAME"

# Get the tenant ID

$org = az rest --method get --url https://graph.microsoft.com/v1.0/organization | ConvertFrom-Json
$tenantId = $org.value.id

# Get Graph API service principal ID

$graphId = az ad sp list --query "[?appDisplayName=='Microsoft Graph'].appId | [0]" --all
$graphId = $graphId.Replace('"','')

# Build resource access portion of AAD app manifest
$resourceAccess = @()
$scopes = $env:REACT_APP_AAD_GRAPH_DELEGATED_SCOPES.Split(',')
Foreach ($scope in $scopes)
{
    # Get ID of the specified scope
    $scopeId = az ad sp show --id $graphId --query "oauth2Permissions[?value=='$scope'].id | [0]"
    "Including Graph scope $scope $scopeId"
    $resource = @{}
    $resource["id"] = $scopeId.Replace('"','')
    $resource["type"] = "Scope"
    $resourceAccess += $resource
}
$resourceJson =
  @{
    "resourceAppId" = $graphId
    "resourceAccess" = $resourceAccess
  } | ConvertTo-Json -Depth 4 -Compress | ConvertTo-Json
$resourceJson = "[" + $resourceJson + "]"

# Create the AAD app
"Creating AAD app $appName for $scheme$hostname`:$port in tenant $tenantId..."
$tabApp = az ad app create --display-name $appName --available-to-other-tenants $false --reply-urls $scheme$hostname`:$port --required-resource-accesses $resourceJson | ConvertFrom-Json 

# Delay to allow time for the AAD app to be created or the script will fail later on

""
"Waiting for the app to be fully provisioned..."
Start-Sleep -Seconds 10

# Add current user as app owner
"Adding current user as app owner..."
$userId = az ad signed-in-user show --query objectId -o tsv
az ad app owner add --id $tabApp.appId --owner-object-id $userId

# set SPA redirect URL - not supported in az cli yet
"Configuring SPA on the app..."
$tabAppAuthentication = @"
{"id":"$($tabApp.objectId)","spa":{"redirectUris":["$scheme$hostname`:$port"]},"publicClient":{"redirectUris":[]},"web":{"redirectUris":[],"implicitGrantSettings":{"enableAccessTokenIssuance":false,"enableIdTokenIssuance":false}}}
"@ -replace "`"", "\`""

az rest --method patch --uri "https://graph.microsoft.com/v1.0/myorganization/applications/$($tabApp.objectId)" --body "$tabAppAuthentication"

# Certificates & secrets
"Configuring a secret that will last $years years..."
$tabAppSecret = az ad app credential reset --id $tabApp.appId --credential-description "Register-AadApp" --years $years | ConvertFrom-Json

"Copy these lines to your .env.local or other .env file:"
"REACT_APP_AAD_TENANT_ID=$tenantId"
"REACT_APP_AAD_APP_ID=$($tabApp.appId)"
"REACT_APP_AAD_APP_SECRET=$($tabAppSecret.password)"

Write-Host DONE -ForegroundColor Green