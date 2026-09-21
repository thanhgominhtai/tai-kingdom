Add-Type -AssemblyName System.Drawing

$root = 'D:\minhtai_22401270\y2\TTNN\btcanvas'
$storeDir = Join-Path $root 'public\assets\store'
if (-not (Test-Path $storeDir)) {
    New-Item -ItemType Directory -Path $storeDir -Force | Out-Null
}

$assetsDir = Join-Path $root 'public\game-assets'

function Get-SafeImage($relPath) {
    $full = Join-Path $assetsDir $relPath
    if (Test-Path $full) {
        return [System.Drawing.Bitmap]::FromFile($full)
    }
    return $null
}

# 1. ICON 512x512
$iconBmp = New-Object System.Drawing.Bitmap(512, 512)
$g = [System.Drawing.Graphics]::FromImage($iconBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

$gradRect = New-Object System.Drawing.Rectangle(0, 0, 512, 512)
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($gradRect, 
    [System.Drawing.Color]::FromArgb(255, 30, 68, 87), 
    [System.Drawing.Color]::FromArgb(255, 15, 32, 40), 
    [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)
$g.FillRectangle($brush, $gradRect)
$brush.Dispose()

$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 230, 185, 75), 16)
$g.DrawRectangle($borderPen, 8, 8, 496, 496)
$borderPen.Dispose()

$castle = Get-SafeImage 'buildings\castle.png'
if ($castle) {
    $castleFrameW = [Math]::Floor($castle.Width / 4)
    $srcRect = New-Object System.Drawing.Rectangle(0, 0, $castleFrameW, $castle.Height)
    $dstRect = New-Object System.Drawing.Rectangle(106, 50, 300, 300)
    $g.DrawImage($castle, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $castle.Dispose()
}

$warrior = Get-SafeImage 'units\warrior-attack.png'
if ($warrior) {
    $srcRect = New-Object System.Drawing.Rectangle(0, 0, 192, 192)
    $dstRect = New-Object System.Drawing.Rectangle(160, 240, 200, 200)
    $g.DrawImage($warrior, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $warrior.Dispose()
}

$bannerBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 20, 28, 35))
$g.FillRectangle($bannerBrush, 24, 400, 464, 80)
$bannerBrush.Dispose()
$bannerBorderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 230, 185, 75), 4)
$g.DrawRectangle($bannerBorderPen, 24, 400, 464, 80)
$bannerBorderPen.Dispose()

$font = New-Object System.Drawing.Font('Impact', 32, [System.Drawing.FontStyle]::Bold)
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 220, 100))
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center
$textRect = New-Object System.Drawing.RectangleF(24, 400, 464, 80)
$g.DrawString("tai'kingdom", $font, $textBrush, $textRect, $sf)
$font.Dispose()
$textBrush.Dispose()
$g.Dispose()

$iconPath = Join-Path $storeDir 'icon-512.png'
$iconBmp.Save($iconPath, [System.Drawing.Imaging.ImageFormat]::Png)
$iconBmp.Dispose()
Write-Output ("Created: " + $iconPath)

# 2. COVER 1280x720 (16:9)
$coverBmp = New-Object System.Drawing.Bitmap(1280, 720)
$g = [System.Drawing.Graphics]::FromImage($coverBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

# Sky & Ground
$skyRect = New-Object System.Drawing.Rectangle(0, 0, 1280, 360)
$skyBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($skyRect, 
    [System.Drawing.Color]::FromArgb(255, 80, 160, 215), 
    [System.Drawing.Color]::FromArgb(255, 140, 205, 240), 
    [System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
$g.FillRectangle($skyBrush, $skyRect)
$skyBrush.Dispose()

$groundRect = New-Object System.Drawing.Rectangle(0, 360, 1280, 360)
$groundBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($groundRect, 
    [System.Drawing.Color]::FromArgb(255, 75, 145, 85), 
    [System.Drawing.Color]::FromArgb(255, 45, 95, 55), 
    [System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
$g.FillRectangle($groundBrush, $groundRect)
$groundBrush.Dispose()

# Trees
$tree = Get-SafeImage 'resources\tree1.png'
if ($tree) {
    for ($tx = 20; $tx -lt 1260; $tx += 180) {
        $g.DrawImage($tree, $tx, 270, 140, 180)
    }
    $tree.Dispose()
}

# Castles & Buildings
$castle = Get-SafeImage 'buildings\castle.png'
if ($castle) {
    $castleW = [Math]::Floor($castle.Width / 4)
    $srcRect = New-Object System.Drawing.Rectangle(0, 0, $castleW, $castle.Height)
    $g.DrawImage($castle, (New-Object System.Drawing.Rectangle(120, 200, 320, 320)), $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawImage($castle, (New-Object System.Drawing.Rectangle(840, 200, 320, 320)), $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $castle.Dispose()
}

$barracks = Get-SafeImage 'buildings\barracks.png'
if ($barracks) {
    $barW = [Math]::Floor($barracks.Width / 4)
    $srcRect = New-Object System.Drawing.Rectangle(0, 0, $barW, $barracks.Height)
    $g.DrawImage($barracks, (New-Object System.Drawing.Rectangle(460, 300, 192, 192)), $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $barracks.Dispose()
}

# Units
$warrior = Get-SafeImage 'units\warrior-attack.png'
if ($warrior) {
    $srcRect = New-Object System.Drawing.Rectangle(0, 0, 192, 192)
    $g.DrawImage($warrior, (New-Object System.Drawing.Rectangle(360, 420, 160, 160)), $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $warrior.Dispose()
}

$archer = Get-SafeImage 'units\archer-attack.png'
if ($archer) {
    $srcRect = New-Object System.Drawing.Rectangle(0, 0, 192, 192)
    $g.DrawImage($archer, (New-Object System.Drawing.Rectangle(660, 420, 160, 160)), $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $archer.Dispose()
}

# Title banner
$bannerBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(235, 20, 32, 42))
$g.FillRectangle($bannerBrush, 290, 40, 700, 120)
$bannerBrush.Dispose()
$bannerBorderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 235, 190, 80), 5)
$g.DrawRectangle($bannerBorderPen, 290, 40, 700, 120)
$bannerBorderPen.Dispose()

$titleFont = New-Object System.Drawing.Font('Impact', 44, [System.Drawing.FontStyle]::Bold)
$titleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 225, 110))
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center
$g.DrawString("tai'kingdom", $titleFont, $titleBrush, (New-Object System.Drawing.RectangleF(290, 45, 700, 65)), $sf)

$subFont = New-Object System.Drawing.Font('Arial', 18, [System.Drawing.FontStyle]::Bold)
$subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 220, 240, 255))
$g.DrawString("2D Realtime Strategy · Build, Expand & Defend", $subFont, $subBrush, (New-Object System.Drawing.RectangleF(290, 108, 700, 40)), $sf)

$titleFont.Dispose()
$titleBrush.Dispose()
$subFont.Dispose()
$subBrush.Dispose()
$g.Dispose()

$coverPath = Join-Path $storeDir 'cover-1280x720.png'
$coverBmp.Save($coverPath, [System.Drawing.Imaging.ImageFormat]::Png)
$coverBmp.Dispose()
Write-Output ("Created: " + $coverPath)

# 3. SCREENSHOT-1 1280x720 (gameplay view)
$shotBmp = New-Object System.Drawing.Bitmap(1280, 720)
$g = [System.Drawing.Graphics]::FromImage($shotBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

# Full grassy map
$mapBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 72, 138, 76))
$g.FillRectangle($mapBrush, 0, 0, 1280, 720)
$mapBrush.Dispose()

# Grid/water decor
$waterBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 52, 120, 168))
$g.FillRectangle($waterBrush, 0, 600, 1280, 120)
$waterBrush.Dispose()

# Buildings on field
$castle = Get-SafeImage 'buildings\castle.png'
if ($castle) {
    $castleW = [Math]::Floor($castle.Width / 4)
    $srcRect = New-Object System.Drawing.Rectangle(0, 0, $castleW, $castle.Height)
    $g.DrawImage($castle, (New-Object System.Drawing.Rectangle(150, 180, 280, 280)), $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $castle.Dispose()
}

$barracks = Get-SafeImage 'buildings\barracks.png'
if ($barracks) {
    $barW = [Math]::Floor($barracks.Width / 4)
    $srcRect = New-Object System.Drawing.Rectangle(0, 0, $barW, $barracks.Height)
    $g.DrawImage($barracks, (New-Object System.Drawing.Rectangle(520, 220, 180, 180)), $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $barracks.Dispose()
}

$archery = Get-SafeImage 'buildings\archery.png'
if ($archery) {
    $archW = [Math]::Floor($archery.Width / 4)
    $srcRect = New-Object System.Drawing.Rectangle(0, 0, $archW, $archery.Height)
    $g.DrawImage($archery, (New-Object System.Drawing.Rectangle(760, 200, 180, 180)), $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $archery.Dispose()
}

# Gold mine
$gold = Get-SafeImage 'resources\gold1.png'
if ($gold) {
    $g.DrawImage($gold, 1000, 160, 120, 120)
    $gold.Dispose()
}

# Troops
$warrior = Get-SafeImage 'units\warrior-attack.png'
if ($warrior) {
    $srcRect = New-Object System.Drawing.Rectangle(0, 0, 192, 192)
    $g.DrawImage($warrior, (New-Object System.Drawing.Rectangle(460, 360, 140, 140)), $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawImage($warrior, (New-Object System.Drawing.Rectangle(560, 380, 140, 140)), $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $warrior.Dispose()
}

$archer = Get-SafeImage 'units\archer-attack.png'
if ($archer) {
    $srcRect = New-Object System.Drawing.Rectangle(0, 0, 192, 192)
    $g.DrawImage($archer, (New-Object System.Drawing.Rectangle(720, 360, 140, 140)), $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $archer.Dispose()
}

# Ingame HUD Top Bar
$hudBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 25, 33, 44))
$g.FillRectangle($hudBrush, 0, 0, 1280, 52)
$hudBrush.Dispose()

$hudFont = New-Object System.Drawing.Font('Arial', 14, [System.Drawing.FontStyle]::Bold)
$hudTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 235, 210))
$g.DrawString("GOLD: 1,450   WOOD: 820   MEAT: 340   POPULATION: 18/30", $hudFont, $hudTextBrush, 30, 16)
$g.DrawString("WAVE 4/10 · ENEMIES APPROACHING", $hudFont, (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 130, 110))), 860, 16)

# Minimap in bottom right
$mapBoxBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 20, 25, 30))
$g.FillRectangle($mapBoxBrush, 1080, 520, 180, 180)
$mapBoxBrush.Dispose()
$mapBorderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 230, 185, 75), 3)
$g.DrawRectangle($mapBorderPen, 1080, 520, 180, 180)
$mapBorderPen.Dispose()

$hudFont.Dispose()
$hudTextBrush.Dispose()
$g.Dispose()

$shotPath = Join-Path $storeDir 'screenshot-1.png'
$shotBmp.Save($shotPath, [System.Drawing.Imaging.ImageFormat]::Png)
$shotBmp.Dispose()
Write-Output ("Created: " + $shotPath)
