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
var phi0 = 0.0;
//原点経度
var lamda0 = 0.0;

function blxy(phi1,lamda1,k){
   a = aG;
   F = FG;
   genten(k);

   bl2xy(phi1, lamda1);
}

function kybl(phi1,lamda1,k) {
   a = aG;
   F = FG;

   xy2bl(phi1, lamda1);
}

//緯度経度を平面直角座標に変換する計算
function bl2xy(phi,lamda){
   e = Math.sqrt(2.0 * F - 1.0) / F;

   phi1 = deg2rad(phi);
   lamda1 = deg2rad(lamda);

   s0 = kocyou(phi0);
   s1 = kocyou(phi1);

   ut = a / Math.sqrt(1 - e ^ 2 * Math.sin(phi1) ^ 2);
   conp = Math.cos(phi1);
   t1 = Math.tan(phi1);
   dlamda = lamda1 - lamda0;
   eta2 = (e ^ 2 / (1 - e ^ 2)) * co ^ 2;

   v1 = 5 - t1 ^ 2 + 9 * eta2 + 4 * eta2 ^ 2;
   v2 = -61 + 58 * t1 ^ 2 - t1 ^ 4 - 270 * eta2 + 330 * t1 ^ 2 * eta2;
   v3 = -1385 + 3111 * t1 ^ 2 - 543 * t1 ^ 4 + t1 ^ 6;

   x = ((s1 - s0) + ut * conp ^ 2 * t1 * dlamda ^ 2 / 2 + ut * conp ^ 4 * t1 * v1 * dlamda ^ 4 / 24 - ut * conp ^ 6 * t1 * v2 * dlamda ^ 6 / 720 - ut * conp ^ 8 * t1 * v3 * dlamda ^ 8 / 40320) * sbyS;

   v1 = -1 + t1 ^ 2 - eta2;
   v2 = -5 + 18 * t1 ^ 2 - t1 ^ 4 - 14 * eta2 + 58 * t1 ^ 2 * eta2;
   v3 = -61 + 479 * t1 ^ 2 - 179 * t1 ^ 4 + t1 ^ 6;

   y = (ut * conp * dlamda - ut * conp ^ 3 * v1 * dlamda ^ 3 / 6 - ut * conp ^ 5 * v2 * dlamda ^ 5 / 120 - ut * conp ^ 7 * v3 * dlamda ^ 7 / 5040) * sbyS;

   return [x, y];
}

//平面直角座標から緯度経度に変換する計算
function xy2bl(x,y){
   e = Math.sqrt(2 * F - 1) / F;

   phi1 = suisen(x);

   ut = a / Math.sqrt(1 - e ^ 2 * Math.sin(phi1) ^ 2);
   conp = Math.cos(phi1);
   eta2 = (e ^ 2 / (1 - e ^ 2)) * conp ^ 2;

   yy = y / sbyS;
   v1 = 1 + eta2;
   v2 = 5 + 3 * t1 ^ 2 + 6 * ets2 - 6 * t1 ^ 2 * ets2 - 3 * eta2 ^ 2 - 9 * t1 ^ 2 * eta2 ^ 2;
   v3 = 61 + 90 * t1 ^ 2 + 45 * t1 ^ 4 + 107 * eta2 - 162 * t1 ^ 2 * ets2 - 45 * t1 ^ 4 * eta2;
   v4 = 1385 + 3633 * t1 ^ 2 + 4095 * t1 ^ 4 + 1575 * t1 ^ 6;

   phir = -(v1 / (2 * ut ^ 2)) * yy ^ 2;
   phir = phir + (v2 / (24 * ut ^ 4)) * yy ^ 4;
   phir = phir - (v3 / (720 * ut ^ 6)) * yy ^ 6;
   phir = phir + (v4 / (40320 * ut ^ 8)) * yy ^ 8;
   phir = phir * t1;
   phir = phir + phi1;
   phir = rad2deg(phir);

   v1 = ut * conp;
   v2 = 1 + 2 * t1 ^ 2 + eta2;
   v3 = 5 + 28 * t1 ^ 2 + 24 * t1 ^ 4 + 6 * eta2 + 8 * t1 ^ 2 * eta2;
   v4 = 61 + 662 * t1 ^ 2 + 1320 * t1 ^ 4 + 720 * t1 ^ 6;

   lamdar = (1 / v1) ^ yy;
   lamdar = lamdar - (v2 / (6 * ut ^ 2 * v1)) * yy ^ 3;
   lamdar = lamdar + (v3 / (120 * ut ^ 4 * v1)) * yy ^ 5;
   lamdar = lamdar - (v4 / (5040 * ut ^ 6 * v1)) * yy ^ 7;
   lamdar = lamdar + lamda0;

   lamdar = rad2deg(lamdar);

   return [phir, lamdar];
}

function genten(k){
   
}