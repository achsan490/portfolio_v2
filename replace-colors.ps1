# Bulk Color Replacement Script
# This script replaces all red/rose color references with blue colors

$files = @(
    "d:\project\my-portofolioV2-main\src\components\Background.jsx",
    "d:\project\my-portofolioV2-main\src\components\CardProject.jsx",
    "d:\project\my-portofolioV2-main\src\components\SocialLinks.jsx",
    "d:\project\my-portofolioV2-main\src\components\TechStackIcon.jsx",
    "d:\project\my-portofolioV2-main\src\Pages\WelcomeScreen.jsx",
    "d:\project\my-portofolioV2-main\src\Pages\Portofolio.jsx",
    "d:\project\my-portofolioV2-main\src\Pages\Contact.jsx"
)

# Color mappings from red to blue
$colorMappings = @{
    'red-200' = 'blue-200'
    'red-300' = 'blue-300'
    'red-400' = 'blue-400'
    'red-500' = 'blue-500'
    'red-600' = 'blue-600'
    'red-700' = 'blue-700'
    'red-800' = 'blue-800'
    'red-900' = 'blue-900'
    'rose-200' = 'blue-300'
    'rose-300' = 'blue-400'
    'rose-400' = 'blue-500'
    'rose-500' = 'blue-600'
    'rose-600' = 'blue-700'
    'rose-700' = 'blue-800'
    'rose-800' = 'blue-900'
    'rose-900' = 'blue-950'
    'pink-200' = 'blue-300'
    'pink-300' = 'blue-400'
    'pink-400' = 'blue-500'
    'pink-500' = 'blue-600'
    'pink-600' = 'blue-700'
    'pink-900' = 'blue-950'
}

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        foreach ($oldColor in $colorMappings.Keys) {
            $newColor = $colorMappings[$oldColor]
            $content = $content -replace $oldColor, $newColor
        }
        
        Set-Content $file -Value $content -NoNewline
        Write-Host "Updated: $file"
    } else {
        Write-Host "File not found: $file" -ForegroundColor Yellow
    }
}

Write-Host "`nColor replacement complete!" -ForegroundColor Green
