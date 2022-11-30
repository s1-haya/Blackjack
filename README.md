# Blackjack(MVC + OOP + TS)

## 説明
MVCとOOPを意識し、TSで作成したBlackjackです。

【基本用語】
　OOP(Object-Oriented Programming) モノの作成と操作に基づいて構成されたプログラム
　MVCモデル Model View Controllerの三つの役割に整理した概念のこと
  ・Model:表示や入力に関連しない処理
  ・View:表示や入力に関する処理
  ・Controller:ViewとModelの橋渡し役
　TS(TypeScript)　静的言語、JavaScriptを拡張した言語

<img width="1429" alt="スクリーンショット 2022-11-28 16 22 13" src="https://user-images.githubusercontent.com/103574382/204220945-cc22dd0c-f8dd-4c8b-8dae-29059b852020.png">

## URL
https://s1-haya.github.io/Blackjack/

## 遊び方
カジノディーラーとプレイヤーの対戦型ゲームです。<br>
基本ルール<br>
カードの数字の合計が「21」に近い方が勝利します。<br>
betする前は手札の中身は分かりません。<br>
deal後、プレイヤーは2枚、ディーラーは1枚表示されます。<br>
stand,hit,double,surrender,autoのアクションボタンを用いて対戦します。<br>
  プレーヤー手札の合計がディーラーの手札の合計より大きい場合<br>
  もしくはディーラーがbustした場合<br>
  もしくはプレーヤーがblackjackの場合<br>
  ->プレーヤの勝利<br>
  プレーヤー手札の合計がディーラーの手札の合計より少ない場合<br>
  もしくはプレーヤーがbustした場合<br>
  もしくはプレーヤがsurrenderした場合<br>
  ->ディーラーの勝利<br>

【カードの数え方】
「2～9」　      そのままの数字
「10・J・Q・K」 "10"
「A」         "1" もしくは　"11"(どちらでも良い)

【基本用語】
 status: ディーラーまたは各プレーヤの動き
 chip: お金、$
 bet: $5,$20,$50,$100のボタンからchipを賭けること
 deal: betの合計を提示した後、ディーラーがカードを配ること
 stand: これ以上カードを引かないこと
 hit: カードをもう1枚引くこと
 double: 最初の2枚のカードからあと1枚だけを引くこと。bet額が2倍になること
 surrender: 降参すること。bet額が2分の1になること
 *auto: *ベーシックストラテジーに基づいたボタンのこと(詳細は特別ルール)
 blackjack: 最初の2枚のカードの合計が「21」であること(必ず"A"と"10"に相当するものが入る) bet額が1.5倍になること
 bust: カードの合計が「21」を超えること
 push: 引き分けのこと

特別ルール<br>
Deck Roundが0になるまでカジノディーラーとプレイヤーは対戦します。
プレーヤの残りのchipsによって勝敗が決まります。
難易度はEasyとHardがあります。
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
             　easy　　hard<br>
  Deck Round 　3回　　　5回<br>
  毎ターン後に 　-$10    -$20<br>
  auto Btn　  　⭕️     　❌<br>

  auto btn: ベーシックストラテジーに基づいた機能(ハードハンドとソフトハンド)
 【基本用語】
 Deck: 山札(52枚)
 Deck Round: 1Deckにつき1Deck Round
 カウンティング: 場に出ているカードをカウントし、記憶していくことによって、これから配られるカードを予測するという戦略法<br>
 ベーシックストラテジー: アクションボタンを決めるための基本戦略法(以下の表）
 ハードハンド: プレーヤーの手札に"A"がないベーシックストラテジーの表 (h: hit, s: stand R: surrender, D: Double)
 *例えば　プレーヤー 4, J
       　ディーラー 6.  
        {\color{red}s}: stand
                ディーラー(オープンカード)                           
             2  3  4  5  6  7  8  9 10  A
　     8以下　h  h  h  h  h  h  h  h  h  h
   プ  9     h  D  D  D  D  h  h  h  h  h
   レ  10    D  D  D  D  D  D  D  D  h  h
   ｜  11    D  D  D  D  D  D  D  D  D  h
   ヤ  12    s  h  s  s  s  h  h  h  h  h
   の  13    s  s  s  s  s  h  h  h  h  h
   手  14    s  s  s  s  {\color{red}s}  h  h  h  h  h
   札  15    s  s  s  s  s  h  h  h  R  h
       16    s  s  s  s  s  h  h  R  R  R
       17 上 s  s  s  s  s  s  s  s  s  s
       
 ソフトハンド: プレーヤーの手札に"A"があるベーシックストラテジーの表  (h: hit, s: stand, D: Double)
               ディーラー(オープンカード)
             2  3  4  5  6  7  8  9  10  A
   プ  A.2.   h  h  h  D  D  h  h  h  h  h
   レ  A.3    h  h  h  D  D  h  h  h  h  h
   ｜  A.4    h  h  D  D  D  h  h  h  h  h
   ヤ  A.5    h  h  D  D  D  h  h  h  h  h
   の  A.6    h  D  D  D  D  h  h  h  h  h
   手  A.7    h  D  D  D  D  h  h  h  h  h
   札  A.8    s  s  s  s  s  s  s  s  s  s
       A.9    s  s  s  s  s  s  s  s  s  s

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



