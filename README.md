# Blackjack

## Installation
git clone "https://github.com/s1-haya/Blackjack.git" Blackjack<br>
cd Blackjack<br>
npm start<br>
"http://localhost:8080/" <- click + CMD<br>

## Usage
カジノディーラーとプレイヤーの対戦型ゲームです。<br>
プレイヤーはカジノディーラーよりも「カードの合計が21点」に近ければ勝利となり、配当を得ることができます。ただしプレイヤーの「カードの合計が21点」を超えてしまうと、その時点で負けとなります。<br>

## 苦労した点
初め、blackjackのmodel構造がいまいちピンと来なかったので紙に書きながら全体を把握した。<br>
バグを見つけるのがとにかく大変でした。typescriptのデバックの設定を途中からしたので、一日ぐらい時間費やした。<br>
結局、最初からtypescriptのデバックの設定をし、書いたコードclassごとに確認した。<br>
