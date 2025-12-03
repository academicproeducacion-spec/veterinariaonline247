param(
    [string]$Root = "$PSScriptRoot",
    [string]$HostUrl = "http://localhost:8000/"
)

Write-Host "Static server starting..." -ForegroundColor Cyan
Write-Host "Root: $Root" -ForegroundColor Cyan
Write-Host "Listening on: $HostUrl" -ForegroundColor Green

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($HostUrl)
$listener.Start()

# Simple MIME types
$mimeMap = @{
    ".html" = "text/html";
    ".htm"  = "text/html";
    ".css"  = "text/css";
    ".js"   = "application/javascript";
    ".png"  = "image/png";
    ".jpg"  = "image/jpeg";
    ".jpeg" = "image/jpeg";
    ".svg"  = "image/svg+xml";
    ".gif"  = "image/gif";
    ".ico"  = "image/x-icon";
}

try {
    while ($true) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.AbsolutePath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($path)) { $path = 'index.html' }
        $filePath = Join-Path $Root $path

        if (Test-Path $filePath -PathType Leaf) {
            try {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = $mimeMap[$ext]
                if (-not $contentType) { $contentType = 'application/octet-stream' }
                $response.ContentType = $contentType
                $response.StatusCode = 200
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                $response.StatusCode = 500
                $err = [System.Text.Encoding]::UTF8.GetBytes("Internal Server Error")
                $response.OutputStream.Write($err,0,$err.Length)
            }
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
            $response.OutputStream.Write($msg,0,$msg.Length)
        }

        $response.Close()
    }
} finally {
    $listener.Stop()
}