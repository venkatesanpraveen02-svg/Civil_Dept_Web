Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('d:\Civil\tn.jpg')
$bmp = New-Object System.Drawing.Bitmap($img)
$pixel = $bmp.GetPixel(0, 0)
$pixel2 = $bmp.GetPixel($bmp.Width - 1, $bmp.Height - 1)
Write-Host "TopLeft: $($pixel.R), $($pixel.G), $($pixel.B), $($pixel.A)"
Write-Host "BottomRight: $($pixel2.R), $($pixel2.G), $($pixel2.B), $($pixel2.A)"
$bmp.Dispose()
$img.Dispose()
