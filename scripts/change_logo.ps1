Add-Type -AssemblyName System.Drawing
$imagePath = "d:\Civil\logo_clg.png"
$outputPath = "d:\Civil\logo_clg_black.png"

if (Test-Path $imagePath) {
    try {
        $img = [System.Drawing.Image]::FromFile($imagePath)
        $bmp = New-Object System.Drawing.Bitmap($img)
        $img.Dispose()

        for ($x = 0; $x -lt $bmp.Width; $x++) {
            for ($y = 0; $y -lt $bmp.Height; $y++) {
                $pixel = $bmp.GetPixel($x, $y)
                # If pixel is not completely transparent, make it black but keep original alpha
                if ($pixel.A -gt 0) {
                    $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($pixel.A, 0, 0, 0))
                }
            }
        }
        $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        Write-Host "Successfully converted logo to black."
    } catch {
        Write-Error "Failed to process image: $_"
    }
} else {
    Write-Error "File not found: $imagePath"
}
