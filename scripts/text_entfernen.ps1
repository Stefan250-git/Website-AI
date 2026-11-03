# Entfernt eingebrannten Text/Karten aus einem Entwurfsbild (genutzt für assets/img/einsteiger-raum.jpg):
# powershell -File scripts/text_entfernen.ps1 -In <entwurf.png> -Out <bild.jpg> -Rects "0,0,1724,42;140,185,1400,380;125,425,880,775;860,425,1605,775"
# Maskierte Rechtecke werden per
# Pyramiden-Auffüllung (push-pull) aus der Umgebung ergänzt, danach weich nachgezeichnet.
param([string]$In, [string]$Out, [string]$Rects)  # Rects: "x0,y0,x1,y1;..."
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System; using System.Drawing; using System.Drawing.Imaging; using System.Runtime.InteropServices;
public static class Fill {
  public static void Run(Bitmap bmp, int[][] rects) {
    int w = bmp.Width, h = bmp.Height;
    var d = bmp.LockBits(new Rectangle(0,0,w,h), ImageLockMode.ReadWrite, PixelFormat.Format24bppRgb);
    int st = d.Stride; byte[] px = new byte[st*h]; Marshal.Copy(d.Scan0, px, 0, px.Length);
    float[] r = new float[w*h], g = new float[w*h], b = new float[w*h], m = new float[w*h];
    bool[] hole = new bool[w*h];
    foreach (var q in rects) for (int y=Math.Max(0,q[1]); y<Math.Min(h,q[3]); y++) for (int x=Math.Max(0,q[0]); x<Math.Min(w,q[2]); x++) hole[y*w+x]=true;
    for (int y=0;y<h;y++) for (int x=0;x<w;x++){ int i=y*w+x, o=y*st+x*3; if(!hole[i]){ b[i]=px[o]; g[i]=px[o+1]; r[i]=px[o+2]; m[i]=1; } }
    float[] fr, fg, fb; Pyr(r,g,b,m,w,h,out fr,out fg,out fb);
    // Übergang an den Rändern der Löcher weich: 3 Durchgänge Kastenweichzeichnung nur in den Löchern
    for (int pass=0; pass<3; pass++) Box(fr,fg,fb,hole,w,h,24);
    // Weiche Ränder: stark weichgezeichnete Fassung, eingeblendet über eine weichgezeichnete Lochmaske
    float[] br=(float[])fr.Clone(), bg=(float[])fg.Clone(), bb=(float[])fb.Clone(), a=new float[w*h];
    for (int i=0;i<w*h;i++) a[i]=hole[i]?1:0;
    for (int pass=0; pass<3; pass++){ Blur(br,w,h,28); Blur(bg,w,h,28); Blur(bb,w,h,28); Blur(a,w,h,45); }
    for (int y=0;y<h;y++) for (int x=0;x<w;x++){ int i=y*w+x, o=y*st+x*3; float t=hole[i]?1:Math.Min(1f,a[i]*2.2f);
      px[o]=(byte)Clamp(fb[i]*(1-t)+bb[i]*t); px[o+1]=(byte)Clamp(fg[i]*(1-t)+bg[i]*t); px[o+2]=(byte)Clamp(fr[i]*(1-t)+br[i]*t); }
    Marshal.Copy(px, 0, d.Scan0, px.Length); bmp.UnlockBits(d);
  }
  static float Clamp(float v){ return v<0?0:(v>255?255:v); }
  // Kastenweichzeichnung über das ganze Bild (laufende Summen, waagerecht und senkrecht)
  static void Blur(float[] c,int w,int h,int rad){
    float[] t=new float[w*h];
    for(int y=0;y<h;y++){ float s=0; for(int k=-rad;k<=rad;k++) s+=c[y*w+Math.Max(0,Math.Min(w-1,k))];
      for(int x=0;x<w;x++){ t[y*w+x]=s/(2*rad+1); s+=c[y*w+Math.Min(w-1,x+rad+1)]-c[y*w+Math.Max(0,x-rad)]; } }
    for(int x=0;x<w;x++){ float s=0; for(int k=-rad;k<=rad;k++) s+=t[Math.Max(0,Math.Min(h-1,k))*w+x];
      for(int y=0;y<h;y++){ c[y*w+x]=s/(2*rad+1); s+=t[Math.Min(h-1,y+rad+1)*w+x]-t[Math.Max(0,y-rad)*w+x]; } }
  }
  static void Pyr(float[] r,float[] g,float[] b,float[] m,int w,int h,out float[] or_,out float[] og,out float[] ob){
    if (w<=2||h<=2){ float sr=0,sg=0,sb=0,sm=0; for(int i=0;i<w*h;i++){sr+=r[i]*m[i];sg+=g[i]*m[i];sb+=b[i]*m[i];sm+=m[i];} if(sm==0)sm=1;
      or_=new float[w*h]; og=new float[w*h]; ob=new float[w*h]; for(int i=0;i<w*h;i++){ or_[i]=m[i]>0?r[i]:sr/sm; og[i]=m[i]>0?g[i]:sg/sm; ob[i]=m[i]>0?b[i]:sb/sm; } return; }
    int w2=(w+1)/2, h2=(h+1)/2; float[] r2=new float[w2*h2],g2=new float[w2*h2],b2=new float[w2*h2],m2=new float[w2*h2];
    for(int y=0;y<h;y++) for(int x=0;x<w;x++){ int i=y*w+x, j=(y/2)*w2+(x/2); r2[j]+=r[i]*m[i]; g2[j]+=g[i]*m[i]; b2[j]+=b[i]*m[i]; m2[j]+=m[i]; }
    for(int j=0;j<w2*h2;j++) if(m2[j]>0){ r2[j]/=m2[j]; g2[j]/=m2[j]; b2[j]/=m2[j]; m2[j]=Math.Min(1f,m2[j]); }
    float[] cr,cg,cb; Pyr(r2,g2,b2,m2,w2,h2,out cr,out cg,out cb);
    or_=new float[w*h]; og=new float[w*h]; ob=new float[w*h];
    for(int y=0;y<h;y++) for(int x=0;x<w;x++){ int i=y*w+x;
      float fx=x/2f-0.25f, fy=y/2f-0.25f; int x0=(int)Math.Floor(fx), y0=(int)Math.Floor(fy); float tx=fx-x0, ty=fy-y0;
      int xa=Math.Max(0,Math.Min(w2-1,x0)), xb=Math.Max(0,Math.Min(w2-1,x0+1)), ya=Math.Max(0,Math.Min(h2-1,y0)), yb=Math.Max(0,Math.Min(h2-1,y0+1));
      float ur=(cr[ya*w2+xa]*(1-tx)+cr[ya*w2+xb]*tx)*(1-ty)+(cr[yb*w2+xa]*(1-tx)+cr[yb*w2+xb]*tx)*ty;
      float ug=(cg[ya*w2+xa]*(1-tx)+cg[ya*w2+xb]*tx)*(1-ty)+(cg[yb*w2+xa]*(1-tx)+cg[yb*w2+xb]*tx)*ty;
      float ub=(cb[ya*w2+xa]*(1-tx)+cb[ya*w2+xb]*tx)*(1-ty)+(cb[yb*w2+xa]*(1-tx)+cb[yb*w2+xb]*tx)*ty;
      or_[i]=m[i]*r[i]+(1-m[i])*ur; og[i]=m[i]*g[i]+(1-m[i])*ug; ob[i]=m[i]*b[i]+(1-m[i])*ub; }
  }
  static void Box(float[] r,float[] g,float[] b,bool[] hole,int w,int h,int rad){
    float[] tr=(float[])r.Clone(), tg=(float[])g.Clone(), tb=(float[])b.Clone();
    for(int y=0;y<h;y++){ for(int x=0;x<w;x++){ int i=y*w+x; if(!hole[i]) continue; float sr=0,sg=0,sb=0; int n=0;
      for(int k=-rad;k<=rad;k+=4){ int xx=Math.Max(0,Math.Min(w-1,x+k)); int j=y*w+xx; sr+=r[j]; sg+=g[j]; sb+=b[j]; n++; } tr[i]=sr/n; tg[i]=sg/n; tb[i]=sb/n; } }
    for(int y=0;y<h;y++){ for(int x=0;x<w;x++){ int i=y*w+x; if(!hole[i]) continue; float sr=0,sg=0,sb=0; int n=0;
      for(int k=-rad;k<=rad;k+=4){ int yy=Math.Max(0,Math.Min(h-1,y+k)); int j=yy*w+x; sr+=tr[j]; sg+=tg[j]; sb+=tb[j]; n++; } r[i]=sr/n; g[i]=sg/n; b[i]=sb/n; } }
  }
}
"@
$src = [System.Drawing.Image]::FromFile($In); $bmp = New-Object System.Drawing.Bitmap $src; $src.Dispose()
$list = $Rects.Split(';') | ForEach-Object { ,([int[]]($_.Split(','))) }
[Fill]::Run($bmp, [int[][]]$list)
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$p = New-Object System.Drawing.Imaging.EncoderParameters 1; $p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 80L
$bmp.Save($Out, $enc, $p); $bmp.Dispose(); "{0} KB" -f [int]((Get-Item $Out).Length/1KB)
