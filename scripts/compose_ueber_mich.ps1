# Setzt die freigestellte Figur (portrait-freigestellt.png) in den Raum (ueber-mich-raum.jpg) -> assets/img/ueber-mich.jpg
# Aktueller Stand der Website:
#   powershell -File scripts/compose_ueber_mich.ps1 -Room assets/img/ueber-mich-raum.jpg -Person assets/img/portrait-freigestellt.png -Out assets/img/ueber-mich.jpg -PersonHeight 1.1 -PersonTop 0.05 -PersonCenterX 0.21 -RoomFocusY 1 -RoomScale 0.85 -RoomAnchorX 1 -Blur 0.22
# (Pfade absolut angeben, wenn das Skript nicht aus dem Projektordner gestartet wird.)
# Figur vom unteren Rand angeschnitten (kein Bodenkontakt).
# Kein Bodenkontakt -> kein Schweben. Raum leicht weichgezeichnet (Tiefenschärfe),
# Figur leicht an die warme Raumfarbe angeglichen.
param(
  [Parameter(Mandatory)] [string]$Room,
  [Parameter(Mandatory)] [string]$Person,
  [Parameter(Mandatory)] [string]$Out,
  [double]$PersonHeight = 0.86,   # Höhe der Figur als Anteil der Bildhöhe, unten bündig
  [double]$PersonCenterX = 0.25,  # Mitte der Figur, Anteil der Bildbreite
  [double]$PersonTop = -9,        # > -1: Oberkante der Figur (Anteil der Bildhöhe) statt unten bündig
  [double]$RoomFocusY = 0.5,      # vertikaler Ausschnitt des Raums (0 = oben, 1 = unten)
  [double]$RoomCrop = 0,          # oben und unten abschneiden (Anteil), z. B. gegen schwarze Balken im Foto
  [double]$RoomScale = 1,         # < 1: Raum kleiner, wirkt weiter weg (Ränder gespiegelt ergänzt)
  [double]$RoomAnchorX = 0.5,     # waagerechte Lage des verkleinerten Raums (0 = links, 1 = rechts)
  [double]$Blur = 0.22,           # Weichzeichnung des Raums: 1 = scharf, kleiner = weicher
  [double]$Warm = 0.04,           # Farbangleich: Rot +, Blau -
  [long]$Quality = 66
)
Add-Type -AssemblyName System.Drawing
$W = 2400; $H = 1350
$roomImg = [System.Drawing.Image]::FromFile($Room)
$personImg = [System.Drawing.Image]::FromFile($Person)
$hq = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Figur: unterste sichtbare Zeile suchen (durchsichtige Zeilen unten abschneiden)
$bottom = $personImg.Height - 1
:rows while ($bottom -gt 0) {
  for ($x = 0; $x -lt $personImg.Width; $x += 6) { if ($personImg.GetPixel($x, $bottom).A -gt 200) { break rows } }
  $bottom--
}
$srcH = $bottom + 1

# Raum: Ausschnitt ohne Balken, volle Fläche (cover), weichgezeichnet über Verkleinern/Vergrößern
$cropY = [int]($roomImg.Height * $RoomCrop); $roomH = $roomImg.Height - 2 * $cropY
$s = [Math]::Max([double]$W / $roomImg.Width, [double]$H / $roomH)  # [double]: sonst wählt PowerShell Max(int, int) und rundet ab
$rw = [int]($roomImg.Width * $s); $rh = [int]($roomH * $s)
$sw = [Math]::Max(1, [int]($W * $Blur)); $sh = [Math]::Max(1, [int]($H * $Blur))
# RoomScale < 1: Raum kleiner (weiter weg); fehlende Ränder laufen gespiegelt weiter (TileFlipXY)
$tw = [Math]::Max(1, [int]($rw * $Blur * $RoomScale)); $th = [Math]::Max(1, [int]($rh * $Blur * $RoomScale))
$tile = New-Object System.Drawing.Bitmap $tw, $th
$gt = [System.Drawing.Graphics]::FromImage($tile); $gt.InterpolationMode = $hq
$gt.DrawImage($roomImg, (New-Object System.Drawing.Rectangle 0, 0, $tw, $th), 0, $cropY, $roomImg.Width, $roomH, [System.Drawing.GraphicsUnit]::Pixel)
$gt.Dispose()
$small = New-Object System.Drawing.Bitmap $sw, $sh
$gs = [System.Drawing.Graphics]::FromImage($small)
$tb = New-Object System.Drawing.TextureBrush $tile, ([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)
$tb.TranslateTransform([single](($sw - $tw) * $RoomAnchorX), [single](($sh - $th) * $RoomFocusY))
$gs.FillRectangle($tb, 0, 0, $sw, $sh)
$gs.Dispose(); $tb.Dispose()

$canvas = New-Object System.Drawing.Bitmap $W, $H
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.InterpolationMode = $hq
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$wrap = New-Object System.Drawing.Imaging.ImageAttributes; $wrap.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)  # kein heller Saum am Rand
$g.DrawImage($small, (New-Object System.Drawing.Rectangle 0, 0, $W, $H), 0, 0, $sw, $sh, [System.Drawing.GraphicsUnit]::Pixel, $wrap)

# Figur: unten bündig angeschnitten, leicht wärmer
$ph = [int]($H * $PersonHeight); $pw = [int]($personImg.Width * $ph / $srcH)
$px = [int]($W * $PersonCenterX - $pw / 2); $py = $H - $ph
if ($PersonTop -gt -1) { $py = [int]($H * $PersonTop) }  # oben ausgerichtet, unten über den Rand hinaus angeschnitten
$cm = New-Object System.Drawing.Imaging.ColorMatrix
$cm.Matrix00 = 1 + $Warm; $cm.Matrix11 = 1; $cm.Matrix22 = 1 - $Warm; $cm.Matrix33 = 1; $cm.Matrix44 = 1
$ia = New-Object System.Drawing.Imaging.ImageAttributes
$ia.SetColorMatrix($cm)
$g.DrawImage($personImg, (New-Object System.Drawing.Rectangle $px, $py, $pw, ($ph + 2)), 0, 0, $personImg.Width, $srcH, [System.Drawing.GraphicsUnit]::Pixel, $ia)

$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$p = New-Object System.Drawing.Imaging.EncoderParameters 1
$p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), $Quality
$canvas.Save($Out, $enc, $p)
$g.Dispose(); $canvas.Dispose(); $small.Dispose(); $roomImg.Dispose(); $personImg.Dispose()
"{0}: {1} KB (Figur bis Zeile {2} von {3})" -f (Split-Path $Out -Leaf), [int]((Get-Item $Out).Length / 1KB), $srcH, $srcH
