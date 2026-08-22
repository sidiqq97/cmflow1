# CMFlow Local Static Web Server (PowerShell .NET HttpListener)
$port = 8080
$path = $PSScriptRoot

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
    Write-Host "=================================================" -ForegroundColor Green
    Write-Host "🚀 Serveur CMFlow demarre sur http://localhost:$port/" -ForegroundColor Green
    Write-Host "=================================================" -ForegroundColor Green
} catch {
    Write-Host "Impossible de démarrer le serveur sur le port $port. Erreur: $_" -ForegroundColor Red
    exit 1
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($rawUrl) -or $rawUrl -eq "/") {
            $rawUrl = "index.html"
        }
        elseif ($rawUrl.StartsWith("v/") -or $rawUrl.StartsWith("approve/")) {
            $rawUrl = "client-review.html"
        }

        $localFile = Join-Path $path $rawUrl
        $fullPath = [System.IO.Path]::GetFullPath($localFile)
        $rootPath = [System.IO.Path]::GetFullPath($path)

        # Protection Anti-Path Traversal : interdire l'accès hors du dossier racine
        if (-not $fullPath.StartsWith($rootPath, [System.StringComparison]::OrdinalIgnoreCase)) {
            $response.StatusCode = 403
            $forbidden = [System.Text.Encoding]::UTF8.GetBytes("<h1>403 Forbidden - Access Denied</h1>")
            $response.ContentType = "text/html"
            $response.ContentLength64 = $forbidden.Length
            $response.OutputStream.Write($forbidden, 0, $forbidden.Length)
            $response.OutputStream.Close()
            continue
        }

        if (Test-Path $fullPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $mime = $mimeTypes[$ext]
            if (-not $mime) { $mime = "application/octet-stream" }

            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("X-Content-Type-Options", "nosniff")
            $response.AddHeader("X-Frame-Options", "SAMEORIGIN")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found</h1>")
            $response.ContentType = "text/html"
            $response.ContentLength64 = $notFound.Length
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
        }
        $response.OutputStream.Close()
    } catch {
        # continue loop
    }
}
