# Blackjack
<img width="1429" alt="スクリーンショット 2022-11-28 16 22 13" src="https://user-images.githubusercontent.com/103574382/204220945-cc22dd0c-f8dd-4c8b-8dae-29059b852020.png">

## Installation
git clone "https://github.com/s1-haya/Blackjack.git" Blackjack<br>
cd Blackjack<br>
npm start<br>
"http://localhost:8080/" <- click + CMD<br>

## 遊び方
カジノディーラーとプレイヤーの対戦型ゲームです。<br>
基本ルールはBlackjackと同様です。<br>

特別ルール
DeckRoundが終了時点でプレーヤーのチップが$200以上だった場合<br>
->プレーヤの勝利<br>
DeckRoundが終了時点でプレーヤーのチップが$200以下だった場合<br>
もしくはDeckRound時にプレーヤーのチップが$0以下の場合<br>
->ディーラーの勝利<br>

ゲームの難易度はeasyとhardから選べます。<br>
easy<br>
DeckRound 3回<br>
毎ターン後に -$10<br>

hard<br>
DeckRound 5回<br>
毎ターン後に -$30<br>


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
4 追加実装,細かいバグや修正<br>

## How
ブラックジャックのModel designの全体を把握するために紙に書いてから大まかな依存関係を把握した。<br>
(大まかにしたことによって、バグの修正に開発の半分時間費やしました。)<br>
フロントデザインは見やすさと使いやすさを意識しました。<br>
またカードゲームなので人間の心理や認識を意識した色にしました。<br>
例えば、緑色は安心する色なので、違う色に比べてプレーヤはbetしやすくなります。<br>
ViewとControllerの実装に関してはある程度汚くてもいいから最低限の全体の流れを意識しました。<br>
その後に修正や追加を行いました。特に関数は一つにつき一関数を意識しました。<br>
例えば関数の中に複数の処理内容を修正する場合は別の関数をそれぞれ作成し、それらの処理を統合する関数を作成しました。<br>





