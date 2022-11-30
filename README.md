# Blackjack(MVC + OOP + TS)

## 説明
MVCとOOPを意識し、TSで作成したBlackjackです。

【基本用語】<br>
　OOP(Object-Oriented Programming) モノの作成と操作に基づいて構成されたプログラム<br>
　MVCモデル Model View Controllerの三つの役割に整理した概念のこと<br>
  &emsp;・Model:表示や入力に関連しない処理<br>
  &emsp;・View:表示や入力に関する処理<br>
  &emsp;・Controller:ViewとModelの橋渡し役<br>
　TS(TypeScript)　静的言語、JavaScriptを拡張した言語<br>

<img width="1429" alt="スクリーンショット 2022-11-28 16 22 13" src="https://user-images.githubusercontent.com/103574382/204220945-cc22dd0c-f8dd-4c8b-8dae-29059b852020.png">

## URL
https://s1-haya.github.io/Blackjack/

## 遊び方
カジノディーラーとプレイヤーの対戦型ゲームです。<br>

&emsp;基本ルール<br>
カードの数字の合計が「21」に近い方が勝利します。<br>
betする前は手札の中身は分かりません。<br>
deal後、プレイヤーは2枚、ディーラーは1枚表示されます。<br>
stand,hit,double,surrender,autoのアクションボタンを用いて対戦します。<br>

&emsp;&emsp;プレーヤー手札の合計がディーラーの手札の合計より大きい場合<br>
&emsp;&emsp;もしくはディーラーがbustした場合<br>
&emsp;&emsp;もしくはプレーヤーがblackjackの場合<br>
&emsp;&emsp;->プレーヤの勝利<br>
&emsp;&emsp;プレーヤー手札の合計がディーラーの手札の合計より少ない場合<br>
&emsp;&emsp;もしくはプレーヤーがbustした場合<br>
&emsp;&emsp;もしくはプレーヤがsurrenderした場合<br>
&emsp;&emsp;->ディーラーの勝利<br>

【カードの数え方】<br>
「2～9」　      そのままの数字<br>
「10・J・Q・K」 "10"<br>
「A」         "1" もしくは　"11"(どちらでも良い)<br>

【基本用語】<br>
 status: ディーラーまたは各プレーヤの動き<br>
 chip: お金、$<br>
 bet: $5,$20,$50,$100のボタンからchipを賭けること<br>
 deal: betの合計を提示した後、ディーラーがカードを配ること<br>
 stand: これ以上カードを引かないこと<br>
 hit: カードをもう1枚引くこと<br>
 double: 最初の2枚のカードからあと1枚だけを引くこと。bet額が2倍になること<br>
 surrender: 降参すること。bet額が2分の1になること<br>
 *auto: *ベーシックストラテジーに基づいたボタンのこと(詳細は特別ルール)<br>
 blackjack: 最初の2枚のカードの合計が「21」であること(必ず"A"と"10"に相当するものが入る) bet額が1.5倍になること<br>
 bust: カードの合計が「21」を超えること<br>
 push: 引き分けのこと<br>

&emsp;特別ルール<br>
Deck Roundが0になるまでカジノディーラーとプレイヤーは対戦します。<br>
プレーヤの残りのchipsによって勝敗が決まります。<br>
難易度はEasyとHardがあります。<br>

  Deck Roundが終了時点でプレーヤーのチップが$200以上だった場合<br>
  ->プレーヤの勝利<br>
  Deck Roundが終了時点でプレーヤーのチップが$200以下だった場合<br>
  もしくはDeck Round時にプレーヤーのチップが$0以下の場合<br>
  ->ディーラーの勝利<br>

　Deck Roundは1回につき52枚のカード<br>
　カードは徐々に減っていきます。(カウンティング)<br>
　8枚以下になると補充されます。<br>

  Deck Roundが終了時点でプレーヤーのチップが$200以上だった場合<br>
  ->プレーヤの勝利<br>
  Deck Roundが終了時点でプレーヤーのチップが$200以下だった場合<br>
  もしくはDeck Round時にプレーヤーのチップが$0以下の場合<br>
  ->ディーラーの勝利<br>

  ゲームの難易度はeasyとhardから選べます。<br>
  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;easy&emsp;&emsp;&emsp;hard<br>
  Deck Round &nbsp;3回　　　&nbsp;5回<br>
  毎ターン後に &emsp;-$10    &emsp;-$20<br>
  auto btn　 &emsp;⭕️     　&emsp;❌<br>

  
 【基本用語】<br>
 Deck: 山札(52枚)<br>
 Deck Round: 1Deckにつき1Deck Round<br>
 カウンティング: 場に出ているカードをカウントし、記憶していくことによって、これから配られるカードを予測するという戦略法<br>
 auto btn: ベーシックストラテジーに基づいた機能(ハードハンドとソフトハンド)<br>
 ベーシックストラテジー: アクションボタンを決めるための基本戦略法(以下の表）<br>
 ハードハンド: プレーヤーの手札に"A"がないベーシックストラテジーの表 (h: hit, s: stand R: surrender, D: Double)<br>
 *例えば　プレーヤー 4, J<br>
 &emsp;&emsp;&emsp;&emsp;&emsp;ディーラー 6   <br>
 &emsp;&emsp;&emsp;&emsp;&emsp;s: stand<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ディーラー(オープンカード)   <br>                        
             2  3  4  5  6  7  8  9 10  A<br>
　     8以下　h  h  h  h  h  h  h  h  h  h<br>
   プ  9     h  D  D  D  D  h  h  h  h  h<br>
   レ  10    D  D  D  D  D  D  D  D  h  h<br>
   ｜  11    D  D  D  D  D  D  D  D  D  h<br>
   ヤ  12    s  h  s  s  s  h  h  h  h  h<br>
   の  13    s  s  s  s  s  h  h  h  h  h<br>
   手  14    s  s  s  s  s  h  h  h  h  h<br>
   札  15    s  s  s  s  s  h  h  h  R  h<br>
       16    s  s  s  s  s  h  h  R  R  R<br>
       17 上 s  s  s  s  s  s  s  s  s  s<br>
       
 ソフトハンド: プレーヤーの手札に"A"があるベーシックストラテジーの表  (h: hit, s: stand, D: Double)<br>
               ディーラー(オープンカード)<br>
             2  3  4  5  6  7  8  9  10  A<br>
   プ  A.2.   h  h  h  D  D  h  h  h  h  h<br>
   レ  A.3    h  h  h  D  D  h  h  h  h  h<br>
   ｜  A.4    h  h  D  D  D  h  h  h  h  h<br>
   ヤ  A.5    h  h  D  D  D  h  h  h  h  h<br>
   の  A.6    h  D  D  D  D  h  h  h  h  h<br>
   手  A.7    h  D  D  D  D  h  h  h  h  h<br>
   札  A.8    s  s  s  s  s  s  s  s  s  s<br>
       A.9    s  s  s  s  s  s  s  s  s  s<br>

## Why
Recursion Project5<br>
以下のような知識をoutputするため<br>
● ソフトウェア開発<br>
● Typescript and OOPを用いての実装<br>
● MVC Architecture<br>

## What
大まかな実装手順<br>
1 Model Design<br>
(debug)<br>
2 フロントデザイン<br>
(debug)<br>
3 View, Controller<br>
(debug)<br>
4 追加実装<br>
-> カウンティング、ベーシックストラテジー<br>
細かいバグや修正<br>

## How
ブラックジャックのModel designの全体を把握するために紙に書いてから大まかな依存関係を把握した。<br>
(大まかにしたことによって、バグの修正に開発の半分時間費やしました。)<br>
フロントデザインは見やすさと使いやすさを意識しました。<br>
またカードゲームなので人間の心理や認識を意識した色にしました。<br>
例えば、緑色は安心する色なので、違う色に比べてプレーヤはbetしやすくなります。<br>
ViewとControllerの実装に関してはある程度汚くてもいいから最低限の全体の流れを意識しました。<br>
その後に修正や追加を行いました。特に関数は一つにつき一関数を意識しました。<br>
例えば関数の中に複数の処理内容を修正する場合は別の関数をそれぞれ作成し、それらの処理を統合する関数を作成しました。<br>



