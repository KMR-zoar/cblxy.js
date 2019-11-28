//定数の宣言

//GRS80楕円体
//長半径
var aG = 6378137.0;
//逆扁平率
var FG = 298.257222101;

//原点における縮尺係数
var sbyS = 0.9999;

//長半径
var a = 0.0;
//逆扁平率
var F = 0.0;
//第一離心率;
var e = 0.0;
//原点緯度
var phi0 = 0;
//原点経度
var lamda0 = 0;

//
// 四捨五入
// value を小数点以下 base 桁目を四捨五入
//
function round(value, base) {
   return Math.round(value * base) / base
}

// 10進法の緯度経度から直角平面座標を返す
function blxy(phi,lamda,k){
   a = aG;
   F = FG;
   genten(k);

   var xy = bl2xy(deg2rad(phi), deg2rad(lamda))
   return [round(xy[0], 10000), round(xy[1], 10000)]
}

// 60進法の緯度経度から直角平面座標を返す
function bl60xy(phi,lamda,k){
   a = aG;
   F = FG;
   genten(k);

   var xy = bl2xy(deg602rad(phi), deg602rad(lamda))
//   return [xy[0], xy[1]]
   return [round(xy[0], 10000), round(xy[1], 10000)]
}

//緯度経度(十進法)を平面直角座標に変換する計算
function xybl(phi,lamda,k) {
   a = aG;
   F = FG;
   genten(k)

   rad = xy2bl(phi, lamda);

   return [rad2deg(rad[0]), rad2deg(rad[1])]
}

//緯度経度(度分秒)を平面直角座標に変換する計算
function xybl60(phi,lamda,k) {
   a = aG;
   F = FG;
   genten(k)

   rad = xy2bl(phi, lamda);

   return [rad2deg60(rad[0]), rad2deg60(rad[1])]
}

function bl2xy(phi1,lamda1){
   e = Math.sqrt(2.0 * F - 1.0) / F;

   s0 = kocyou(phi0);
   s1 = kocyou(phi1);

   ut = a / Math.sqrt(1 - e ** 2 * Math.sin(phi1) ** 2);
   conp = Math.cos(phi1);
   t1 = Math.tan(phi1);
   dlamda = lamda1 - lamda0;
   eta2 = (e ** 2 / (1 - e ** 2)) * conp ** 2;

   v1 = 5 - t1 ** 2 + 9 * eta2 + 4 * eta2 ** 2;
   v2 = -61 + 58 * t1 ** 2 - t1 ** 4 - 270 * eta2 + 330 * t1 ** 2 * eta2;
   v3 = -1385 + 3111 * t1 ** 2 - 543 * t1 ** 4 + t1 ** 6;

   x = ((s1 - s0) + ut * conp ** 2 * t1 * dlamda ** 2 / 2 + ut * conp ** 4 * t1 * v1 * dlamda ** 4 / 24 - ut * conp ** 6 * t1 * v2 * dlamda ** 6 / 720 - ut * conp ** 8 * t1 * v3 * dlamda ** 8 / 40320) * sbyS;

   v1 = -1 + t1 ** 2 - eta2;
   v2 = -5 + 18 * t1 ** 2 - t1 ** 4 - 14 * eta2 + 58 * t1 ** 2 * eta2;
   v3 = -61 + 479 * t1 ** 2 - 179 * t1 ** 4 + t1 ** 6;

   y = (ut * conp * dlamda - ut * conp ** 3 * v1 * dlamda ** 3 / 6 - ut * conp ** 5 * v2 * dlamda ** 5 / 120 - ut * conp ** 7 * v3 * dlamda ** 7 / 5040) * sbyS;

   return [x, y];
}

//平面直角座標から緯度経度に変換する計算
function xy2bl(x,y){
   e = Math.sqrt(2 * F - 1) / F;

   phi1 = suisen(x);

   ut = a / Math.sqrt(1 - e ** 2 * Math.sin(phi1) ** 2);
   conp = Math.cos(phi1);
   t1 = Math.tan(phi1)
   eta2 = (e ** 2 / (1 - e ** 2)) * conp ** 2;

   yy = y / sbyS;
   v1 = 1 + eta2;
   v2 = 5 + 3 * t1 ** 2 + 6 * eta2 - 6 * t1 ** 2 * eta2 - 3 * eta2 ** 2 - 9 * t1 ** 2 * eta2 ** 2;
   v3 = 61 + 90 * t1 ** 2 + 45 * t1 ** 4 + 107 * eta2 - 162 * t1 ** 2 * eta2 - 45 * t1 ** 4 * eta2;
   v4 = 1385 + 3633 * t1 ** 2 + 4095 * t1 ** 4 + 1575 * t1 ** 6;

   phir = -(v1 / (2 * ut ** 2)) * yy ** 2;
   phir = phir + (v2 / (24 * ut ** 4)) * yy ** 4;
   phir = phir - (v3 / (720 * ut ** 6)) * yy ** 6;
   phir = phir + (v4 / (40320 * ut ** 8)) * yy ** 8;
   phir = phir * t1;
   phir = phir + phi1;

   v1 = ut * conp;
   v2 = 1 + 2 * t1 ** 2 + eta2;
   v3 = 5 + 28 * t1 ** 2 + 24 * t1 ** 4 + 6 * eta2 + 8 * t1 ** 2 * eta2;
   v4 = 61 + 662 * t1 ** 2 + 1320 * t1 ** 4 + 720 * t1 ** 6;

   lamdar = (1 / v1) * yy;
   lamdar = lamdar - (v2 / (6 * ut ** 2 * v1)) * yy ** 3;
   lamdar = lamdar + (v3 / (120 * ut ** 4 * v1)) * yy ** 5;
   lamdar = lamdar - (v4 / (5040 * ut ** 6 * v1)) * yy ** 7;
   lamdar = lamdar + lamda0;

   return [phir, lamdar];
}

function kocyou(ido) {
   var e2 = e ** 2.0
   var e4 = e ** 4.0
   var e6 = e ** 6.0
   var e8 = e ** 8.0
   var e10 = e ** 10.0
   var e12 = e ** 12.0
   var e14 = e ** 14.0
   var e16 = e ** 16.0

   var ax = 1.0 + 3.0 / 4.0 * e2 + 45.0 / 64.0 * e4 + 175.0 / 256.0 * e6 + 11025.0 / 16384.0 * e8 + 43659.0 / 65536.0 * e10 + 693693.0 / 1048576.0 * e12 + 19324305.0 / 29360128.0 * e14 + 4927697775.0 / 7516192768.0 * e16
   var b = 3.0 / 4.0 * e2 + 15.0 / 16.0 * e4 + 525.0 / 512.0 * e6 + 2205.0 / 2048.0 * e8 + 72765.0 / 65536.0 * e10 + 297297.0 / 262144.0 * e12 + 135270135.0 / 117440512.0 * e14 + 547521975.0 / 469762048.0 * e16
   var c = 15.0 / 64.0 * e4 + 105.0 / 256.0 * e6 + 2205.0 / 4096.0 * e8 + 10395.0 / 16384.0 * e10 + 1486485.0 / 2097152.0 * e12 + 45090045.0 / 58720256.0 * e14 + 766530765.0 / 939524096.0 * e16
   var d = 35.0 / 512.0 * e6 + 315.0 / 2048.0 * e8 + 31185.0 / 131072.0 * e10 + 165165.0 / 524288.0 * e12 + 45090045.0 / 117440512.0 * e14 + 209053845.0 / 469762048.0 * e16
   var ex = 315.0 / 16384.0 * e8 + 3465.0 / 65536.0 * e10 + 99099.0 / 1048576.0 * e12 + 4099095.0 / 29360128.0 * e14 + 348423075.0 / 1879048192.0 * e16
   var f = 693.0 / 131072 * e10 + 9009.0 / 524288.0 * e12 + 4099095.0 / 117440512.0 * e14 + 26801775.0 / 469762048.0 * e16
   var g = 3003 / 2097152.0 * e12 + 315315.0 / 58720256.0 * e14 + 11486475.0 / 939524096.0 * e16
   var h = 45045.0 / 117440512.0 * e14 + 765765.0 / 469762048.0 * e16
   var i = 765765.0 / 7516192768.0 * e16

   return a * (1.0 - e2) * (ax * ido - b * Math.sin(ido * 2.0) / 2.0 + c * Math.sin(ido * 4.0) / 4.0 - d * Math.sin(ido * 6.0) / 6.0 + ex * Math.sin(ido * 8.0) / 8.0 - f * Math.sin(ido * 10.0) / 10.0 + g * Math.sin(ido * 12.0) / 12.0 - h * Math.sin(ido * 14.0) / 14.0 + i * Math.sin(ido * 16.0) / 16.0)
}

function suisen(x) {
   var s0 = kocyou(phi0)
   var m = s0 + x / sbyS
   var cnt = 0
   var phin = phi0
   var e2 = e ** 2.0
   var phi0x = phin

   do {
      cnt = cnt + 1
      phi0x = phin
      var sn = kocyou(phin)
      var v1 = 2.0 * (sn - m) * ((1.0 - e2 * Math.sin(phin) ** 2.0) ** 1.5)
      var v2 = 3.0 * e2 * (sn - m) * Math.sin(phin) * Math.cos(phin) * Math.sqrt(1.0 - e2 * Math.sin(phin) ** 2.0) - 2.0 * a * (1.0 - e2)
      phin = phin + v1 / v2
   } while ((Math.abs(phin - phi0x) >= 0.00000000000001) && cnt <= 100)
   return phin
}

function genten(k) {
   var err = "座標系が正しく指定されていません"

   switch (k) {
      case 1:
         degen = [330000.0,1293000.0]
         break;
      case 2:
         degen = [330000.0,1310000.0]
         break;
      case 3:
         degen = [360000.0,1321000.0]
         break;
      case 4:
         degen = [330000.0,1333000.0]
         break;
      case 5:
         degen = [360000.0,1342000.0]
         break;
      case 6:
         degen = [360000.0,1360000.0]
         break;
      case 7:
         degen = [360000.0,1371000.0]
         break;
      case 8:
         degen = [360000.0,1383000.0]
         break;
      case 9:
         degen = [360000.0,1395000.0]
         break;
      case 10:
         degen = [400000.0,1405000.0]
         break;
      case 11:
         degen = [440000.0,1401500.0]
         break;
      case 12:
         degen = [440000.0,1421500.0]
         break;
      case 13:
         degen = [440000.0,1441500.0]
         break;
      case 14:
         degen = [260000.0,1420000.0]
         break;
      case 15:
         degen = [260000.0,1273000.0]
         break;
      case 16:
         degen = [260000.0,1240000.0]
         break;
      case 17:
         degen = [260000.0,1310000.0]
         break;
      case 18:
         degen = [200000.0,1360000.0]
         break;
      case 19:
         degen = [260000.0,1540000.0]  
         break;
      default:
         degen = err
         break
   }

   if (degen != err) {
      phi0 = deg602rad(degen[0])
      lamda0 = deg602rad(degen[1])
   }
}

function deg2rad(deg) {
   return deg * (Math.PI / 180)
}

// 緯度経度(度分秒)から緯度経度(10進数)の変換
function deg602deg(deg) {
   var fugou = 1
   if (deg < 0) {
      fugou  = -1.0
   }

   deg = Math.abs(deg)

   var angle = Math.floor(deg / 10000.0)
   var minute = Math.floor((deg / 100.0) - (angle * 100.0))
   var second =  deg - (angle * 10000.0) - (minute * 100.0)
   return fugou * (angle + (minute + (second / 60.0)) / 60.0)
}

// 緯度経度(度分秒)から radian への変換
function deg602rad(deg) {
   var radbase = Math.PI / 180.0
   var fugou = 1
   if (deg < 0) {
      fugou  = -1.0
   }

   deg = Math.abs(deg)

   var angle = Math.floor(deg / 10000.0)
   var minute = Math.floor((deg / 100.0) - (angle * 100.0))
   var second =  deg - (angle * 10000.0) - (minute * 100.0)
   var rad = fugou * (angle + (minute + (second / 60.0)) / 60.0)
   return rad * radbase
}

// radian から緯度経度(10進数)への変換
function rad2deg(rad) {
   return round(rad * (180 / Math.PI), 100000000)
}

// radian から緯度経度(度分秒)への変換
// 小数点以下６桁目で四捨五入
function rad2deg60(rad) {

   var degbase = 180.0 / Math.PI

   var fugou = 1.0
   if (rad < 0) {
      fugou = -1.0
   }

   rad = Math.abs(rad)

   rad = rad * degbase
   var angle = Math.floor(rad)
   rad = (rad - angle) * 60.0
   var minute = Math.floor(rad)
   var second = (rad - minute) * 60.0

   return round(fugou * (angle * 10000.0 + minute * 100.0 + second) ,100000)
}

// 緯度経度(10進数)から緯度経度(度分秒)への変換
function deg2deg60(deg) {
   var fugou = 1.0
   if (deg < 0) {
      fugou = -1.0
   }

   deg = Math.abs(deg)

   var angle = Math.floor(deg)
   deg = (deg - angle) * 60.0
   var minute = Math.floor(deg)
   var second = (deg - minute) * 60.0

   return round(fugou * (angle * 10000.0 + minute * 100.0 + second) ,100000)
    
}

