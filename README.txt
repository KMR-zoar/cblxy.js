This software is released under the MIT License, see LICENSE.txt.
このソフトウェアはMITライセンスのもとで公開しています。LICENSE.txtをご覧ください


平面直角座標と緯度経度を相互に変換するjavascriptです。

このスクリプトでは国土地理院で公開されている計算式( http://surveycalc.gsi.go.jp/sokuchi/main.html )と、自分のRubyスクリプト( https://github.com/KMR-zoar/cblxy )を見ながら作成しました。


*注意点*
現在の状態では平面直角座標から緯度経度に変換した際、秒の小数第4位以下に誤差が発生することがありますのでご注意ください。
また、旧日本測地系のデータは変換できません。

使用する単位は緯度経度はDDMMSS.SSSです、129度30分0.213秒であれば1293000.213となります。座標はメートルで入力します。


*更新*

2014-06-12 - Zoar
ファイル作成中


K'z Minor Release - Zoar

