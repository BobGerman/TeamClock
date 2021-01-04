<#
.Synopsis
Read environment variables

.Description
This function reads environment variables in dotenv format to the current process.

Based on this gist: https://gist.github.com/grenzi/82e6cb8215cc47879fdf3a8a4768ec09 
which is a simplification of this PowerShell module: https://github.com/rajivharris/Set-PsEnv

.Example
 Set-PsEnv

.Example
 # This is function is called by convention in PowerShell
 # Auto exports the env variable at every prompt change
 function prompt {
     Set-PsEnv
 }
#>
function Set-PsEnv {
    [CmdletBinding(SupportsShouldProcess = $true, ConfirmImpact = 'Low')]
    param($localEnvFile = "..\.env")

    #return if no env file
    if (!( Test-Path $localEnvFile)) {
        Throw "could not open $localEnvFile"
    }

    #read the local env file
    $content = Get-Content $localEnvFile -ErrorAction Stop
    Write-Verbose "Parsed .env file"

    #load the content to environment
    foreach ($line in $content) {
        # Ignore comments
        if ($line.StartsWith("#")) { continue };
        # Ignore settings we don't need
        if (!$line.StartsWith("SETUP_") -and !$line.StartsWith("REACT_APP_")) {continue};
        # Add the setting
        if ($line.Trim()) {
            $line = $line.Replace("`"","")
            $kvp = $line -split "=",2
            if ($PSCmdlet.ShouldProcess("$($kvp[0])", "set value $($kvp[1])")) {
                [Environment]::SetEnvironmentVariable($kvp[0].Trim(), $kvp[1].Trim(), "Process") | Out-Null
            }
        }
    }
}

Export-ModuleMember -Function @('Set-PsEnv')