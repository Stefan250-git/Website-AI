# Bereitet das Raumfoto für „Über mich“ vor: Wandbild entfernen (Fläche zeilenweise aus der Wandfarbe links/rechts auffüllen) und kleinen Wandmonitor setzen.
# Quelle: Unsplash photo-1571624436279-b272aff752b5 (w=2400) -> assets/img/ueber-mich-raum.jpg, danach scripts/compose_ueber_mich.ps1.
# Aufruf: powershell -File scripts/raum_monitor.ps1 -In <unsplash.jpg> -Dst assets/img/ueber-mich-raum.jpg -MX 590 -MY 290 -MW 270
param(
  [Parameter(Mandatory)] [string]$In,
  [Parameter(Mandatory)] [string]$Dst,
  [int]$X0 = 50, [int]$X1 = 600, [int]$Y0 = 122, [int]$Y1 = 740,      # Bildfläche (Quelle 2400 x 1597)
  [int]$MX = 610, [int]$MY = 300, [int]$MW = 290                         # Monitor: links oben, Breite (16:9)
)
Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Image]::FromFile($In)
$bmp = New-Object System.Drawing.Bitmap $src
$src.Dispose()

# 1) Wandbild überdecken: je Zeile linear zwischen Wandfarbe links und rechts
$rect = New-Object System.Drawing.Rectangle 0, 0, $bmp.Width, $bmp.Height
$data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$stride = $data.Stride
$bytes = New-Object byte[] ($stride * $bmp.Height)
[System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)
function Avg($y, $x, $c) { $s = 0; for ($k = 0; $k -lt 6; $k++) { $s += $bytes[$y * $stride + ($x + $k) * 3 + $c] }; return $s / 6 }
for ($y = $Y0; $y -le $Y1; $y++) {
  $l = @((Avg $y ($X0 - 14) 0), (Avg $y ($X0 - 14) 1), (Avg $y ($X0 - 14) 2))
  $r = @((Avg $y ($X1 + 2) 0), (Avg $y ($X1 + 2) 1), (Avg $y ($X1 + 2) 2))
  for ($x = $X0; $x -le $X1; $x++) {
    $t = ($x - $X0) / ($X1 - $X0); $i = $y * $stride + $x * 3
    for ($c = 0; $c -lt 3; $c++) { $bytes[$i + $c] = [byte][Math]::Round($l[$c] + ($r[$c] - $l[$c]) * $t) }
  }
}
[System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $data.Scan0, $bytes.Length)
$bmp.UnlockBits($data)

# 2) Monitor: weicher Schatten, Rahmen, Bildschirm mit leichtem Verlauf und Glanz
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$MH = [int]($MW * 9 / 16)
for ($k = 14; $k -ge 1; $k--) {
  $b = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(5, 40, 35, 30))
  $g.FillRectangle($b, $MX - $k + 6, $MY - $k + 10, $MW + 2 * $k, $MH + 2 * $k); $b.Dispose()
}
$frame = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 22, 23, 26))
$g.FillRectangle($frame, $MX, $MY, $MW, $MH)
$scr = New-Object System.Drawing.Rectangle ($MX + 5), ($MY + 5), ($MW - 10), ($MH - 10)
$lg = New-Object System.Drawing.Drawing2D.LinearGradientBrush $scr, ([System.Drawing.Color]::FromArgb(255, 44, 52, 64)), ([System.Drawing.Color]::FromArgb(255, 14, 17, 22)), 35
$g.FillRectangle($lg, $scr)
$shine = New-Object System.Drawing.Drawing2D.LinearGradientBrush $scr, ([System.Drawing.Color]::FromArgb(34, 255, 255, 255)), ([System.Drawing.Color]::FromArgb(0, 255, 255, 255)), 25
$g.FillRectangle($shine, $scr)
$g.Dispose()

$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$p = New-Object System.Drawing.Imaging.EncoderParameters 1
$p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 85L
$bmp.Save($Dst, $enc, $p); $bmp.Dispose()
"ok"
