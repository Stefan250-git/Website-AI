# Setzt die freigestellte Figur (portrait-freigestellt.png, PNG mit Transparenz) in den Besprechungsraum (ueber-mich-raum.jpg).
# Aufruf: powershell -File scripts/compose_ueber_mich.ps1  (Parameter siehe unten; Werte = aktueller Stand der Website)
# Ergebnis: assets/img/ueber-mich.jpg (2400 x 1350, Figur im linken Drittel, rechts Raum für Text)
param(
  [string]$Root = "C:\Users\Hansen\Website AI\assets\img",
  [double]$PersonHeight = 0.76,   # Anteil der Bildhöhe (ganze Figur)
  [double]$PersonCenterX = 0.24,  # Mitte der Figur, Anteil der Bildbreite
  [double]$FootY = 0.965,         # Höhe der Schuhsohlen, Anteil der Bildhöhe
  [long]$Quality = 70
)
Add-Type -AssemblyName System.Drawing
$W = 2400; $H = 1350
$room = [System.Drawing.Image]::FromFile("$Root\ueber-mich-raum.jpg")
$person = [System.Drawing.Image]::FromFile("$Root\portrait-freigestellt.png")

$out = New-Object System.Drawing.Bitmap $W, $H
$g = [System.Drawing.Graphics]::FromImage($out)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

# Raum: auf volle Fläche (cover)
$s = [Math]::Max($W / $room.Width, $H / $room.Height)
$rw = [int]($room.Width * $s); $rh = [int]($room.Height * $s)
$g.DrawImage($room, [int](($W - $rw) / 2), [int](($H - $rh) / 2), $rw, $rh)

# Figur: unten bündig, im linken Drittel
$ph = [int]($H * $PersonHeight); $pw = [int]($person.Width * $ph / $person.Height)
$px = [int]($W * $PersonCenterX - $pw / 2); $py = [int]($H * $FootY) - $ph

# weicher Bodenschatten unter den Schuhen
$shadow = New-Object System.Drawing.Drawing2D.GraphicsPath
$shadow.AddEllipse([int]($px + $pw * 0.18), [int]($H * $FootY - 22), [int]($pw * 0.64), 44)
$brush = New-Object System.Drawing.Drawing2D.PathGradientBrush $shadow
$brush.CenterColor = [System.Drawing.Color]::FromArgb(70, 0, 0, 0)
$brush.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
$g.FillPath($brush, $shadow)

$g.DrawImage($person, $px, $py, $pw, $ph)

$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$p = New-Object System.Drawing.Imaging.EncoderParameters 1
$p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), $Quality
$out.Save("$Root\ueber-mich.jpg", $enc, $p)
$g.Dispose(); $out.Dispose(); $room.Dispose(); $person.Dispose()
(Get-Item "$Root\ueber-mich.jpg").Length
