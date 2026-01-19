# Replace Red Colors with Blue Colors
$files = Get-ChildItem -Path "src" -Include *.jsx,*.css -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace hex colors
    $content = $content -replace '#dc2626', '#2563eb'  # red-600 -> blue-600
    $content = $content -replace '#f43f5e', '#3b82f6'  # rose-500 -> blue-500
    $content = $content -replace '#ef4444', '#3b82f6'  # red-500 -> blue-500
    
    # Replace Tailwind classes
    $content = $content -replace 'from-red-', 'from-blue-'
    $content = $content -replace 'to-red-', 'to-blue-'
    $content = $content -replace 'via-red-', 'via-blue-'
    $content = $content -replace 'from-rose-', 'from-cyan-'
    $content = $content -replace 'to-rose-', 'to-cyan-'
    $content = $content -replace 'via-rose-', 'via-cyan-'
    $content = $content -replace 'border-red-', 'border-blue-'
    $content = $content -replace 'border-rose-', 'border-cyan-'
    $content = $content -replace 'bg-red-', 'bg-blue-'
    $content = $content -replace 'bg-rose-', 'bg-cyan-'
    $content = $content -replace 'text-red-', 'text-blue-'
    $content = $content -replace 'text-rose-', 'text-cyan-'
    $content = $content -replace 'hover:from-red-', 'hover:from-blue-'
    $content = $content -replace 'hover:to-red-', 'hover:to-blue-'
    $content = $content -replace 'hover:from-rose-', 'hover:from-cyan-'
    $content = $content -replace 'hover:to-rose-', 'hover:to-cyan-'
    $content = $content -replace 'hover:border-red-', 'hover:border-blue-'
    $content = $content -replace 'hover:border-rose-', 'hover:border-cyan-'
    $content = $content -replace 'focus:ring-red-', 'focus:ring-blue-'
    $content = $content -replace 'shadow-red-', 'shadow-blue-'
    $content = $content -replace 'shadow-rose-', 'shadow-cyan-'
    
    # Replace pink with blue variants
    $content = $content -replace 'from-pink-', 'from-sky-'
    $content = $content -replace 'to-pink-', 'to-sky-'
    $content = $content -replace 'via-pink-', 'via-sky-'
    
    Set-Content $file.FullName -Value $content -NoNewline
}

Write-Host "Color replacement completed!" -ForegroundColor Green
