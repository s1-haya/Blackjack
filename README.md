# Blackjack(MVC + OOP + TypeScript)

## 説明
MVC(Model View Controller)とOOP(オブジェクト指向プログラミング)を意識し、TypeScriptで作成したBlackjackです。

<img width="1429" alt="スクリーンショット 2022-11-28 16 22 13" src="https://user-images.githubusercontent.com/103574382/204220945-cc22dd0c-f8dd-4c8b-8dae-29059b852020.png">

## URL
https://s1-haya.github.io/Blackjack/

## 制作経緯
コンピュータサイエンスが学習できるRecursionというオンライン学習サービスでMVCとOOPについて学習し、そのアウトプットとしてBlackjackを作成しました。

## 制作期間
Blackjack本体　2週間(2022年11月14〜27日）<br>
追加機能(主にカウンティングとペーシックストラテジー)と細かな修正　4日(28日,29日,30日, 12月1日）<br>

## 使用技術
HTML/CSS/Javascript/TypeScript/<br>

## 工夫した点
### 1.設計
#### MVC
学習したMVCモデルを元に設計しました。
MVCを起用した理由はコードのリファクタリング、拡張、ソフトウェア設計を容易にするためです。
Modelを設計する際、特に工夫した点は特にゲームの進行を管理するTableクラスの設計です。
TableクラスはPlayer、Deck、Card、GameDecisionクラス全体を管理するクラスです。
Tableクラスを定義することで、ゲームの進行が円滑に進み、データの管理も容易にすることができました。
#### OOPとTypeScript
OOPとTypeScriptを起用した理由はコードの可読性やデータの保守性、拡張性の精度を上げるためです。
特に工夫した点ははコードの可読性です。
なぜなら、他の人に見せることが前提だからです。これは今回の開発にかかわらず仕事をする上でも同じことが言えると考えています。
また、拡張性やリファクタリングが容易になるという利点があるからです。
classや関数の分割や関数の入出力の型を決めることによって他の人がコードを見たときに瞬時に理解しやすい状態にし、データの管理をしやすくしました。
### 2.ゲーム性(追加機能）
追加機能はカウンティングとペーシックストラテジーです。
これらはBlackjackのゲームで実際に使われている戦略法です。
工夫した点はeasyモードとhardのモードの難易度とカウンティングとペーシックストラテジーを取り入れたゲーム性です。
取り入れた意図としてはBlackjackの初心者、上級者関係なく遊べるかつ飽きさせないようなゲームにしたかったからです。
基本実装のBlackjackはチップが$0になる以外でゲーム自体が終了することはありませんでした。
それによって上級者またはほとんどユーザーはBlackjackに対して飽きてしまう印象を残すのではないかと考えました。
なのでゲームの難易度、山札の設置、Round毎回にチップを減らす。また戦略法などを取り入れました。

## 苦労した点
### 1.実行環境とデプロイ
今回初めてTypeScriptを使用したので、初めての実行環境の作成やデプロイに3日ぐらい費やしました。
今回の経験を通して次回以降はよりスムーズにTypeScriptの実行環境を作成できると思いました。
### 2.バグの修正
今回、制作時間の半分以上はバグの修正に時間を費やしました。
MVCを初めて取り組んだということもあり、Modelの全体の処理内容をデバックで数回しかテストをせずにViewやControllerにデータを渡していたため、バグを見つけるのにどこのMVCが原因なのなかわからず大変苦労しました。
次回は一つ一つの関数の処理構造を確認するのは去ることながらModelの全体の処理構造を数回ではなく、意図した値が出ているかを確認し、バグの原因のあたりの範囲を狭めるように心がけようと思いました。

## 今後の課題
Blackjack以外のカードゲームにも対応できるような設計。

## 今後の展望
他のカードゲームとの共通部分と異なる部分をそれぞれ分割しOOPを用いて設計していきます。

## 遊び方
カジノディーラーとプレイヤーの対戦型ゲームです。<br>

### 基本ルール<br>
カードの数字の合計が「21」に近い方が勝利します。<br>

### 特別ルール<br>
DeckRoundが0になるまでカジノディーラーとプレイヤーは対戦します。
プレーヤの残りのチップによって勝敗が決まります。
難易度はeasyとhardがあります。
<br>
<br>
＊＊ゲームの途中でわからなくなったら以下を参考にしてください＊＊
#### 基本
【プレーヤの勝利】<br>
プレーヤー手札の合計がディーラーの手札の合計より大きい場合、
もしくはディーラーがbustした場合、
もしくはプレーヤーがBlackjackの場合

【ディーラーの勝利】<br>
プレーヤー手札の合計がディーラーの手札の合計より少ない場合、
もしくはプレーヤーがbustした場合、
もしくはプレーヤがsurrenderした場合

【カードの数え方】<br>
"2～9": そのままの数字<br>
"10・J・Q・K": 10<br>
"A": 1もしくは11(どちらでも良い)<br>

【基本用語】<br>
status: ディーラーまたは各プレーヤの動き<br>
chip: お金<br>
bet: $5、$20、$50、$100のボタンからchipを賭けること<br>
deal: betの合計を提示した後、ディーラーがカードを配ること<br>
stand: これ以上カードを引かないこと<br>
hit: カードをもう1枚引くこと<br>
double: 最初の2枚のカードからあと1枚だけを引くこと。bet額が2倍になること<br>
surrender: 降参すること。bet額が2分の1になること<br>
*autoBtn: *ベーシックストラテジーに基づいたボタンのこと(詳細は特別ルール)<br>
Blackjack: 最初の2枚のカードの合計が「21」であること(必ず"A"と"10"に相当するものが入る) bet額が1.5倍になること<br>
bust: カードの合計が「21」を超えること<br>
push: 引き分けのこと<br>

#### 特別
【プレーヤの勝利】<br>
DeckRoundが終了時点でプレーヤーのチップが$200以上だった場合

【ディーラーの勝利】<br>
DeckRoundが終了時点でプレーヤーのチップが$200以下だった場合
もしくはDeckRound時にプレーヤーのチップが$0以下の場合

【easy】<br>
DeckRoundは3回で毎Round後に-$10減ります。
autoBtn機能あり

【hard】<br>
DeckRoundは5回で毎Round後に-$20減ります。
autoBtn機能なし

 【基本用語】<br>
Deck: 山札(52枚) 8枚以下になると補充されます。<br>
DeckRound: 1Deckにつき1DeckRoundあります。<br>
autoBtn: ベーシックストラテジーに基づいた機能(ハードハンドとソフトハンド)。<br>
カウンティング: 場に出ているカードをカウントし、記憶していくことによって、これから配られるカードを予測するという戦略法<br>
ベーシックストラテジー: アクションボタンを決めるための基本戦略法(詳細: https://vegasdocs.com/blackjack/strategy.html ）<br>
ハードハンド: プレーヤーの手札に"A"がないベーシックストラテジーの表 <br>
ソフトハンド: プレーヤーの手札に"A"があるベーシックストラテジーの表 <br>
