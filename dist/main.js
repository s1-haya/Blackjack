/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./docs/src/test.ts":
/*!**************************!*\
  !*** ./docs/src/test.ts ***!
  \**************************/
/***/ (function() {

eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nclass Card {\n    constructor(suit, rank) {\n        this.suit = suit;\n        this.rank = rank;\n    }\n    getRankNumber() {\n        if (\"A\" == this.rank)\n            return 11;\n        else if (\"J\" == this.rank || \"Q\" == this.rank || \"K\" == this.rank)\n            return 10;\n        return parseInt(this.rank);\n    }\n}\nclass Deck {\n    constructor(gameType, numberOfPlayers, levelType) {\n        this.gameType = gameType;\n        this.cards = [];\n        this.stockPile = 52;\n        this.numberOfPlayers = numberOfPlayers;\n        this.deckCount = (levelType === 'easy') ? 3 : 5;\n        this.resetDeck();\n        this.shuffle();\n    }\n    shuffle() {\n        for (let i = this.cards.length - 1; i >= 0; i--) {\n            const j = Math.floor(Math.random() * (i + 1));\n            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];\n        }\n    }\n    resetDeck() {\n        const suit = [\"H\", \"D\", \"C\", \"S\"];\n        const rank = [\"A\", \"2\", \"3\", \"4\", \"5\", \"6\", \"7\", \"8\", \"9\", \"10\", \"J\", \"Q\", \"K\"];\n        for (let i = 0; i < suit.length; i++) {\n            for (let j = 0; j < rank.length; j++) {\n                this.cards.push(new Card(suit[i], rank[j]));\n            }\n        }\n    }\n    drawOne() {\n        this.reduceDeck();\n        return this.cards.pop();\n    }\n    reduceDeck() {\n        this.stockPile--;\n        if (this.stockPile < 0) {\n            alert('Reset the cards in the deck');\n            this.deckCount--;\n            this.newDeck();\n        }\n    }\n    newDeck() {\n        this.resetDeck();\n        this.shuffle();\n        this.stockPile = 52;\n    }\n}\nclass Player {\n    constructor(name, type, gameType, chips = 400) {\n        this.name = name;\n        this.type = type;\n        this.gameType = gameType;\n        this.hand = [];\n        this.chips = chips;\n        this.bet = 0;\n        this.winAmount = 0;\n        this.gameStatus = 'betting';\n    }\n    promptAI() {\n        let gameDecision = new GameDecision(null, null);\n        switch (this.gameStatus) {\n            case ('betting'):\n                gameDecision = this.getBetAI();\n                break;\n            case ('acting'):\n                gameDecision = this.getActAI();\n                break;\n            case ('hit'):\n                gameDecision = this.getActAddAI();\n                break;\n        }\n        return gameDecision;\n    }\n    promptUser() {\n        let gameDecision = new GameDecision(null, null);\n        switch (this.gameStatus) {\n            case ('betting'):\n                gameDecision = new GameDecision('bet', this.bet);\n                break;\n            case ('acting'):\n                gameDecision = this.getActUser();\n                break;\n            case ('hit'):\n                gameDecision = this.getActUser();\n                break;\n        }\n        return gameDecision;\n    }\n    promptPlayer(userData) {\n        let gameDecision = new GameDecision(null, null);\n        switch (userData) {\n            case ('ai'):\n                gameDecision = this.promptAI();\n                break;\n            case ('user'):\n                gameDecision = this.promptUser();\n                break;\n        }\n        return gameDecision;\n    }\n    getHandScore() {\n        let score = 0;\n        let ace = 0;\n        for (let card of this.hand) {\n            if (card.rank === \"A\")\n                ace += 1;\n            score += card.getRankNumber();\n        }\n        while (ace > 0 && score > 21) {\n            score -= 10;\n            ace--;\n        }\n        return score;\n    }\n    isBlackJack() {\n        if (this.getHandScore() == 21 && this.hand.length == 2)\n            return true;\n        return false;\n    }\n    resetPlayerBet() {\n        this.chips += this.bet;\n        this.bet = 0;\n    }\n    getBetAI() {\n        const betDenominations = [5, 20, 50, 100];\n        const randomIndex = Math.floor(Math.random() * betDenominations.length);\n        const betAmount = betDenominations[randomIndex];\n        return new GameDecision(\"bet\", betAmount);\n    }\n    getActAI() {\n        const actionList = [\"surrender\", \"double\", \"hit\", \"stand\"];\n        const randomIndex = this.randomIndex(actionList.length);\n        let gameDecision = new GameDecision(actionList[randomIndex], this.bet);\n        if (this.isBlackJack())\n            gameDecision = new GameDecision('blackjack', this.bet);\n        return gameDecision;\n    }\n    getActAddAI() {\n        let gameDecision = new GameDecision(\"stand\", this.bet);\n        return gameDecision;\n    }\n    getActUser() {\n        let gameDecision = new GameDecision(this.gameStatus, this.bet);\n        if (this.isBlackJack())\n            gameDecision = new GameDecision('blackjack', this.bet);\n        return gameDecision;\n    }\n    randomIndex(length) {\n        return Math.floor(Math.random() * length);\n    }\n}\nclass GameDecision {\n    constructor(action, amount) {\n        this.action = action;\n        this.amount = amount;\n    }\n}\nclass Table {\n    constructor(userData, gameType, levelType) {\n        this.gameType = gameType;\n        this.user = new Player(userData, 'user', this.gameType);\n        this.betDenominations = [5, 20, 50, 100];\n        this.house = new Player('house', 'house', this.gameType, -1);\n        this.players = this.setPlayers();\n        this.deck = new Deck(this.gameType, 1 + this.players.length, levelType);\n        this.turnCounter = 0;\n        this.gamePhase = 'betting';\n        this.resultsLog = [];\n        this.round = 0;\n        this.levelType = levelType;\n    }\n    setPlayers() {\n        const user = this.user;\n        const ai1 = new Player('AI1', 'ai', this.gameType);\n        const ai2 = new Player('AI2', 'ai', this.gameType);\n        return [ai1, user, ai2];\n    }\n    evaluateMove(player) {\n        const gameDecision = player.promptPlayer(player.type);\n        if (gameDecision.action === null && gameDecision.amount === null)\n            return null;\n        else {\n            player.bet = gameDecision.amount;\n            player.gameStatus = gameDecision.action;\n            switch (gameDecision.action) {\n                case (\"bet\"):\n                    player.gameStatus = 'acting';\n                    break;\n                case (\"hit\"):\n                    if (player.getHandScore() > 21)\n                        player.gameStatus = 'bust';\n                    break;\n                case (\"double\"):\n                    if (player.getHandScore() > 21)\n                        player.gameStatus = 'bust';\n                    else\n                        player.gameStatus = 'stand';\n                    break;\n            }\n            this.aiDrowOne(player);\n        }\n        return null;\n    }\n    aiDrowOne(player) {\n        if (player.type === 'ai' && (player.gameStatus === 'hit' || player.gameStatus === 'double')) {\n            player.hand.push(this.deck.drawOne());\n        }\n    }\n    houseAction(houseScore) {\n        if (houseScore > 21) {\n            this.isScoreBust(houseScore, this.house);\n            return houseScore;\n        }\n        else if (houseScore >= 17) {\n            this.house.gameStatus = 'stand';\n            if (this.house.isBlackJack())\n                this.house.gameStatus = 'blackjack';\n            return houseScore;\n        }\n        this.house.hand.push(this.deck.drawOne());\n        houseScore = this.house.getHandScore();\n        this.house.gameStatus = 'hit';\n        //thisに難あり→table本体がいるかも\n        // View.createMainPage(this);\n        return this.houseAction(houseScore);\n    }\n    blackjackEvaluateAndGetRoundResults() {\n        return __awaiter(this, void 0, void 0, function* () {\n            this.round++;\n            let res = '';\n            // await setTimeout(() => this.houseAction(houseScore), 2000);\n            let houseScore = this.house.getHandScore();\n            // await setTimeout(() => houseScore = this.houseAction(houseScore), 2000);\n            // houseScore = this.houseAction(houseScore);\n            // await this.houseAction(houseScore);\n            houseScore = this.houseAction(houseScore);\n            let houseStatus = this.house.gameStatus;\n            for (let player of this.players) {\n                const playerScore = player.getHandScore();\n                this.isScoreBust(playerScore, player);\n                let playerStatus = player.gameStatus;\n                let result = this.gameStatusResult(player, houseScore, houseStatus, playerScore, playerStatus);\n                player.chips += (player.winAmount);\n                res += `● name: ${player.name} action: ${playerStatus}, bet: ${player.bet}, won: ${player.winAmount}, result: ${result}<br>`;\n            }\n            this.isGameOver();\n            this.resultsLog.push(res);\n        });\n    }\n    blackjackAssignPlayerHands() {\n        const playerCard = this.deck.numberOfPlayers * 2;\n        if (this.deck.stockPile < playerCard) {\n            alert('Reset the cards in the deck');\n            this.deck.deckCount--;\n            if (!(this.deck.deckCount))\n                return;\n            this.deck.newDeck();\n        }\n        this.house.hand.push(this.deck.drawOne());\n        this.house.hand.push(this.deck.drawOne());\n        for (let player of this.players) {\n            player.hand.push(this.deck.drawOne());\n            player.hand.push(this.deck.drawOne());\n        }\n    }\n    blackjackClearPlayerHandsAndBets() {\n        for (let player of this.players) {\n            player.hand = [];\n            player.bet = 0;\n            player.winAmount = 0;\n            player.gameStatus = 'betting';\n            player.chips = (this.levelType === \"easy\") ? player.chips - 10 : player.chips - 30;\n            if (player.type === 'user' && player.chips < 0) {\n                player.gameStatus = 'gameOver';\n            }\n        }\n        this.resultsLog = [];\n        this.house.gameStatus = 'betting';\n        this.house.hand = [];\n        this.gamePhase = 'betting';\n        this.turnCounter = 0;\n    }\n    getTurnPlayer() {\n        return this.players[this.turnCounter % this.players.length];\n    }\n    haveTurn() {\n        const currentPlayer = this.getTurnPlayer();\n        switch (this.gamePhase) {\n            case ('betting'):\n                this.evaluateMove(currentPlayer);\n                if (this.onLastPlayer())\n                    this.gamePhase = 'acting';\n                break;\n            case ('acting'):\n                this.evaluateMove(currentPlayer);\n                if (this.allPlayerBet())\n                    this.house.gameStatus = 'acting';\n                if (this.allPlayerActionsResolved()) {\n                    this.gamePhase = 'roundOver';\n                    this.blackjackEvaluateAndGetRoundResults();\n                }\n                break;\n        }\n        this.turnCounter++;\n        return null;\n    }\n    allPlayerBet() {\n        for (let player of this.players) {\n            if (player.gameStatus == 'betting')\n                return false;\n        }\n        return true;\n    }\n    onFirstPlayer() {\n        return this.turnCounter % this.players.length == 0;\n    }\n    onLastPlayer() {\n        return this.turnCounter % this.players.length == this.players.length - 1;\n    }\n    allPlayerActionsResolved() {\n        for (let player of this.players) {\n            if (player.gameStatus != \"double\" && player.gameStatus != 'bust' && player.gameStatus != \"stand\" && player.gameStatus != 'surrender' && player.gameStatus != 'blackjack')\n                return false;\n        }\n        return true;\n    }\n    isScoreBust(score, player) {\n        if (score > 21)\n            player.gameStatus = 'bust';\n    }\n    isGameOver() {\n        for (let player of this.players) {\n            if (player.type === 'user' && player.chips <= 0)\n                this.gamePhase = 'gameOver';\n            else if (player.type === 'ai' && player.chips <= 0)\n                player.chips = 400;\n        }\n    }\n    gameStatusResult(player, houseScore, houseStatus, playerScore, playerStatus) {\n        let result = '';\n        if (player.gameStatus === 'surrender') {\n            player.winAmount = Math.floor(player.bet / 2) * (-1);\n            result = 'SURRENDER';\n        }\n        else if (player.isBlackJack()) {\n            player.winAmount = player.bet + Math.floor(player.bet * 0.5);\n            player.gameStatus = 'blackjack';\n            result = 'BLACKJACK';\n        }\n        else if (playerStatus === 'bust') {\n            player.winAmount = player.bet * (-1);\n            result = 'BUST';\n        }\n        else if (houseStatus === 'bust' || houseScore < playerScore) {\n            result = this.playerWinOrLoseRes(player, playerStatus, 'WIN');\n        }\n        else if (houseScore > playerScore) {\n            result = this.playerWinOrLoseRes(player, playerStatus, 'LOSE');\n        }\n        else {\n            result = 'PUSH';\n        }\n        return result;\n    }\n    playerWinOrLoseRes(player, playerStatus, res) {\n        switch (playerStatus) {\n            case ('stand'):\n                if (res === 'WIN')\n                    player.winAmount = player.bet;\n                else\n                    player.winAmount = player.bet * (-1);\n                break;\n            case ('double'):\n                if (res === 'WIN')\n                    player.winAmount = player.bet * 2;\n                else\n                    player.winAmount = player.bet * (-2);\n                break;\n        }\n        return res;\n    }\n}\nclass Info {\n    static displayNone(ele) {\n        ele.classList.remove(\"d-block\");\n        ele.classList.add(\"d-none\");\n    }\n    static displayBlock(ele) {\n        ele.classList.remove(\"d-none\");\n        ele.classList.add(\"d-block\");\n    }\n}\nInfo.config = {\n    'startGame': document.getElementById('start-game'),\n    'startBtn': document.getElementById('start-btn'),\n    'mainGame': document.getElementById('main-game'),\n    suitImgURL: {\n        \"S\": \"https://recursionist.io/img/spade.png\",\n        \"H\": \"https://recursionist.io/img/heart.png\",\n        \"C\": \"https://recursionist.io/img/clover.png\",\n        \"D\": \"https://recursionist.io/img/diamond.png\",\n        \"?\": \"https://recursionist.io/img/questionMark.png\"\n    }\n};\nclass View {\n    static createMainPage(table) {\n        Info.config['mainGame'].innerHTML =\n            `\n        <div class=\"col-12 center pt-5\">\n            <div class=\"d-flex flex-column left text-white\">\n                <div class=\"py-2\">\n                    <h1 class=\"m-0\">Mode: ${table.levelType.toUpperCase()}</h1>\n                </div>\n                <div class=\"pt-4\">\n                    <h1 class=\"m-0\">DeckRound: ${table.deck.deckCount}</h1>\n                </div>\n            </div>\n            <div class=\"\">\n                <p class=\"m-0 text-center text-white rem3\">Dealer</p>\n                <p class=\"rem1 text-center text-white m-0\">Status:&nbsp; ${table.house.gameStatus}&ensp;&ensp;</a>\n                <div id=\"houseCardDiv\" class=\"d-flex justify-content-center pt-2 pb-4\"></div>\n            </div>\n            <div class=\"right\">\n                <div class=\"text-center\">\n                    <h2 class=\"text-white\">Deck</h2>\n                    <div id=\"deck-card\"></div>\n                    <div class=\"d-flex flex-column pt-2 text-white\">\n                        <h2>${table.deck.stockPile}</h2>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div id=\"playersDiv\" class=\"d-flex justify-content-center\"></div>\n        <div id=\"actionsAndBetsDiv\" class=\"d-flex justify-content-center pb-5 pt-4 justify-content-center\">\n                <div id=\"betsDiv\" class=\"d-flex flex-column  w-50\"></div>\n        </div>\n        <div id=\"newGameDiv\" class=\"d-flex flex-column justify-content-center text-white\"></div>\n        `;\n        View.createCardPage(table);\n        Controller.setHouseCard(table);\n        const deckDiv = document.getElementById(\"deck-card\");\n        deckDiv.append(View.createSecretCard());\n    }\n    static createSecretCard() {\n        const cardDiv = document.createElement(\"div\");\n        let suit = \"?\";\n        let rank = \"?\";\n        cardDiv.classList.add(\"bg-white\", \"border\", \"mx-2\");\n        cardDiv.innerHTML =\n            `\n\t\t<div class=\"text-center pt-2\">\n\t\t\t<img src=\"${Info.config[\"suitImgURL\"][suit]}\" alt=\"\" width=\"50\" height=\"50\">\n\t\t</div>\n\t\t<div class=\"text-center\">\n\t\t\t<p class=\"m-0\">${rank}</p>\n\t\t</div>\n\t\t`;\n        return cardDiv;\n    }\n    static createCardPage(table) {\n        const cardParDiv = document.getElementById(\"playersDiv\");\n        cardParDiv.innerHTML = \"\";\n        const cardDiv = document.createElement(\"div\");\n        cardDiv.classList.add(\"d-flex\", \"justify-content-center\");\n        for (let player of table.players) {\n            cardDiv.innerHTML +=\n                `\n            <div class=\"p-5 mx-4\">\n                <p class=\"m-0 text-white text-center rem3\">${player.name}</p>\n                <div class=\"text-white m-0 py-2 d-flex\">\n                    <p class=\"rem1 text-left m-0\">Status:&nbsp; ${player.gameStatus}&ensp;&ensp;</a>\n                    <p class=\"rem1 text-left m-0\">Bet:&nbsp; ${player.bet}&ensp;&ensp;</a>\n                    <p class=\"rem1 text-left m-0\">Chips:&nbsp; ${player.chips}&ensp;&ensp;</a>\n                </div>\n                <div id=\"${player.name}\" class=\"d-flex justify-content-center\"></div>\n\t\t\t</div>\n            `;\n            Controller.setPlayerCard(table, cardDiv, player);\n        }\n        cardParDiv.append(cardDiv);\n    }\n    static createCard(playerCard) {\n        const suit = playerCard.suit;\n        const rank = playerCard.rank;\n        const cardDiv = document.createElement(\"div\");\n        cardDiv.classList.add(\"bg-white\", \"border\", \"mx-2\");\n        cardDiv.innerHTML =\n            `\n\t\t<div class=\"text-center\">\n\t\t\t<img src=\"${Info.config[\"suitImgURL\"][suit]}\" alt=\"\" width=\"50\" height=\"50\">\n\t\t</div>\n\t\t<div class=\"text-center\">\n\t\t\t<p class=\"m-0\">${rank}</p>\n\t\t</div>\n\t\t`;\n        return cardDiv;\n    }\n    static createBetPage(table) {\n        const betDiv = document.getElementById('betsDiv');\n        betDiv.innerHTML +=\n            `\n        <div class=\"pb-5\">\n            <p class=\"m-0 text-center text-white rem2\">Current Money: $${table.user.chips}</p>\n            <p class=\"m-0 text-center text-white rem3\">Bet: $${table.user.bet}</p>\n        </div>\n        `;\n        const bets = document.createElement(\"div\");\n        bets.classList.add(\"d-flex\", \"justify-content-center\");\n        for (let bet of table.betDenominations) {\n            bets.innerHTML +=\n                `\n\t\t\t<div class=\"input-group px-4\">\n\t\t\t\t<span class=\"input-group-btn\">\n\t\t\t\t\t<button type=\"button\" id=\"totalBet\" class=\"btn-green radiusBtn rounded-circle p-0 btn-lg\" value=${bet}>${bet}</button>\n\t\t\t\t</span>\n\t\t\t</div>\n            `;\n        }\n        betDiv.append(bets);\n        betDiv.innerHTML +=\n            `\n        <div class=\"d-flex justify-content-between pt-3\">\n            <div class=\"py-3\">\n                    <button type=\"submit\" id=\"reset-btn\" class=\"btn btn-danger py-1 px-3\">Reset</button>\n            </div>\n            <div class=\"py-3\">\n                    <button type=\"submit\" id=\"bet-btn\" class=\"btn btn-primary py-1 px-3\">Bet</button>\n            </div>\n        </div>\n        `;\n        Controller.getBets(table);\n        Controller.resetAndBetBtn(table);\n    }\n    static createActPage(table) {\n        const action = document.getElementById('actionsAndBetsDiv');\n        action.innerHTML =\n            `\n        <div id =\"actionsDiv\" class=\"d-flex flex-wrap w-70\">\n            <div class=\"py-2\">\n            <a id='surrender-btn' class=\"text-dark btn btn-light px-5 py-1\">Surrender</a>\n            </div>\n            <div class=\"py-2\">\n            <a id=\"stand-btn\" class=\"btn btn-success px-5 py-1\">Stand</a>\n            </div>\n            <div class=\"py-2\">\n            <a id=\"hit-btn\" class=\"btn btn-warning px-5 py-1\">Hit</a>\n            </div>\n            <div class=\"py-2\">\n            <a id=\"double-btn\" class=\"btn btn-danger px-5 py-1\">Double</a>\n            </div>\n        </div> \n        `;\n        Controller.actionBtn(table);\n    }\n    static createNextGamePage(table) {\n        const nextGameDiv = document.getElementById(\"newGameDiv\");\n        nextGameDiv.innerHTML =\n            `\n        <div class=\"py-2 d-flex justify-content-center\">\n            <a id='nextGame-btn' class=\"text-white btn btn-success px-5 py-1\">Next Game</a>\n        </div>\n        <div class=\"py-2 text-white\">\n            <h4>Round${table.round}</h4>\n            <p>${table.resultsLog}</p>\n        </div>\n        `;\n        Controller.nextGame(table);\n    }\n    static createGameOver(table) {\n        const action = document.getElementById('actionsAndBetsDiv');\n        action.innerHTML = \"\";\n        let res = 'GAME OVER';\n        let bool = true;\n        if (table.gamePhase !== 'gameOver' && table.user.gameStatus !== 'gameOver') {\n            bool = false;\n            if (table.players[1].chips >= 400)\n                res = \"HUGE WIN\";\n            else if (table.players[1].chips >= 200)\n                res = 'WIN';\n            else\n                res = 'LOSE';\n        }\n        const newGameDiv = document.getElementById(\"newGameDiv\");\n        newGameDiv.innerHTML =\n            `\n        <div class=\"py-2\">\n            <h1>${res}&nbsp;$${table.players[1].chips}</h1>\n        </div>\n        <div class=\" py-2 d-flex justify-content-center flex-column\">\n            <a id='newGame-btn' class=\" btn btn-success px-5 py-1\">New Game</a>\n        </div>\n        `;\n        View.resultsLog(table, bool);\n        Controller.gameOver();\n    }\n    static resultsLog(table, bool) {\n        if (bool && table.user.gameStatus !== 'gameOver') {\n            const newGameDiv = document.getElementById(\"newGameDiv\");\n            newGameDiv.innerHTML +=\n                `\n            <div  class=\"py-2\">\n                <h4>Round${table.round}</h4>\n                <p>${table.resultsLog}</p>\n            </div>\n            `;\n        }\n    }\n}\nclass Controller {\n    static startGame() {\n        Info.displayNone(Info.config['mainGame']);\n        Info.displayBlock(Info.config['startGame']);\n        let cardType = document.getElementById('card-game');\n        cardType.addEventListener('change', function () {\n            if (cardType.value == 'poker')\n                alert('準備中');\n        });\n        let level = '';\n        const easyBtn = document.getElementsByName('level')[0];\n        const hardBtn = document.getElementsByName('level')[1];\n        easyBtn.addEventListener('change', (event) => {\n            level = event.currentTarget.value;\n        });\n        hardBtn.addEventListener('change', (event) => {\n            level = event.currentTarget.value;\n        });\n        Info.config['startBtn'].addEventListener('click', function () {\n            let userData = document.getElementById('userData');\n            if (userData.value == \"\")\n                alert('Please fill in your name');\n            if (level == \"\")\n                alert('Please fill in Easy or Hard');\n            else {\n                Info.displayNone(Info.config['startGame']);\n                Info.displayBlock(Info.config['mainGame']);\n                const table = new Table(userData.value, cardType.value, level);\n                Controller.mainTable(table);\n            }\n        });\n    }\n    static getBets(table) {\n        const betDiv = document.getElementById('betsDiv');\n        const totalBets = betDiv.querySelectorAll('#totalBet');\n        for (let bet of totalBets) {\n            const clickedBet = Number(bet.value);\n            bet.addEventListener(\"click\", function () {\n                Controller.setLimitedBet(table, clickedBet, betDiv);\n            });\n        }\n    }\n    static setLimitedBet(table, clickedBet, betDiv) {\n        const userChips = table.user.chips;\n        const userBet = table.user.bet;\n        if (userBet + clickedBet > userChips)\n            alert(\"Exceed the limit. You can't no more bet.\");\n        else {\n            table.user.bet += clickedBet;\n            betDiv.innerHTML = \"\";\n            View.createBetPage(table);\n        }\n    }\n    static resetAndBetBtn(table) {\n        const betDiv = document.getElementById('betsDiv');\n        const resetBtn = document.getElementById('reset-btn');\n        resetBtn.addEventListener('click', function () {\n            table.user.bet = 0;\n            betDiv.innerHTML = \"\";\n            View.createBetPage(table);\n        });\n        const betBtn = document.getElementById('bet-btn');\n        betBtn.addEventListener('click', function () {\n            if (table.user.bet === 0)\n                alert('please bet money!');\n            else\n                Controller.mainTable(table);\n        });\n    }\n    static setHouseCard(table) {\n        const houseCardDiv = document.getElementById(\"houseCardDiv\");\n        if (table.gamePhase === 'betting') {\n            houseCardDiv.append(View.createSecretCard());\n            houseCardDiv.append(View.createSecretCard());\n        }\n        else if (table.gamePhase === 'acting') {\n            houseCardDiv.append(View.createCard(table.house.hand[0]));\n            houseCardDiv.append(View.createSecretCard());\n        }\n        else {\n            let i = 0;\n            while (table.house.hand.length != i) {\n                houseCardDiv.append(View.createCard(table.house.hand[i]));\n                i++;\n            }\n        }\n    }\n    static setPlayerCard(table, cardDiv, player) {\n        const card = cardDiv.querySelectorAll(`#${player.name}`)[0];\n        if (table.gamePhase === 'betting') {\n            card.append(View.createSecretCard());\n            card.append(View.createSecretCard());\n        }\n        else {\n            let i = 0;\n            while (player.hand.length != i) {\n                card.append(View.createCard(player.hand[i]));\n                i++;\n            }\n        }\n        // cardParDiv.append(cardDiv);\n        // console.log(card);\n        //document.getElementByIdは不可 (null)\n        //cardDiv.querySelectorAll(`#${player.name}`)はnodeList\n    }\n    static mainTable(table) {\n        View.createMainPage(table);\n        Controller.judgeDeck(table);\n        const currentPlayer = table.getTurnPlayer();\n        if (table.gamePhase === 'betting' && currentPlayer.type === 'user') {\n            View.createBetPage(table);\n            table.haveTurn();\n        }\n        else if (table.gamePhase === 'acting' && currentPlayer.type == 'user') {\n            Controller.setAutomationOrPageAction(table);\n        }\n        else if (table.gamePhase === 'roundOver') {\n            if (table.deck.deckCount === 0)\n                View.createGameOver(table);\n            View.createNextGamePage(table);\n        }\n        else if (table.gamePhase === 'gameOver') {\n            View.createGameOver(table);\n        }\n        else\n            setTimeout(() => Controller.automaticAI(table), 2000);\n    }\n    static judgeDeck(table) {\n        if (table.deck.deckCount == 0 || table.user.gameStatus === 'gameOver')\n            View.createGameOver(table);\n    }\n    static automaticAI(table) {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (table.gamePhase === 'betting' && table.onFirstPlayer()) {\n                table.blackjackAssignPlayerHands();\n            }\n            table.haveTurn();\n            Controller.mainTable(table);\n        });\n    }\n    static setAutomationOrPageAction(table) {\n        if (table.user.isBlackJack() || table.user.getHandScore() > 21 || this.isAutomaticActionBtn(table)) {\n            table.haveTurn();\n            Controller.mainTable(table);\n        }\n        else {\n            View.createActPage(table);\n            table.haveTurn();\n        }\n    }\n    static isAutomaticActionBtn(table) {\n        if (table.user.gameStatus === 'surrender' || table.user.gameStatus === 'stand' || table.user.gameStatus === 'double')\n            return true;\n        return false;\n    }\n    static randomIndex(length) {\n        return Math.floor(Math.random() * length);\n    }\n    static actionBtn(table) {\n        const action = document.getElementById('actionsAndBetsDiv');\n        const hitBtn = action.querySelector(\"#hit-btn\");\n        const standBtn = action.querySelector(\"#stand-btn\");\n        const surrenderBtn = action.querySelector(\"#surrender-btn\");\n        const doubleBtn = action.querySelector(\"#double-btn\");\n        if (table.user.gameStatus === 'hit') {\n            surrenderBtn.classList.add('disabled');\n            doubleBtn.classList.add('disabled');\n        }\n        Controller.hitBtn(table, hitBtn);\n        Controller.standBtn(table, standBtn);\n        Controller.surrenderBtn(table, surrenderBtn);\n        Controller.doubleBtn(table, doubleBtn);\n    }\n    static hitBtn(table, hitBtn) {\n        hitBtn.addEventListener(\"click\", function () {\n            table.user.gameStatus = 'hit';\n            table.user.hand.push(table.deck.drawOne());\n            Controller.mainTable(table);\n        });\n    }\n    static standBtn(table, standBtn) {\n        standBtn.addEventListener(\"click\", function () {\n            table.user.gameStatus = 'stand';\n            Controller.mainTable(table);\n        });\n    }\n    static surrenderBtn(table, surrenderBtn) {\n        surrenderBtn.addEventListener(\"click\", function () {\n            table.user.gameStatus = 'surrender';\n            Controller.mainTable(table);\n        });\n    }\n    static doubleBtn(table, doubleBtn) {\n        doubleBtn.addEventListener(\"click\", function () {\n            table.user.gameStatus = 'double';\n            table.user.hand.push(table.deck.drawOne());\n            Controller.mainTable(table);\n        });\n    }\n    static nextGame(table) {\n        const nextGameBtn = document.getElementById('nextGame-btn');\n        nextGameBtn.addEventListener('click', function () {\n            table.blackjackClearPlayerHandsAndBets();\n            Controller.mainTable(table);\n        });\n    }\n    static gameOver() {\n        const newGameBtn = document.getElementById('newGame-btn');\n        newGameBtn.addEventListener(\"click\", function () {\n            Controller.startGame();\n        });\n    }\n}\nController.startGame();\n\n\n//# sourceURL=webpack://blackjack/./docs/src/test.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./docs/src/test.ts"]();
/******/ 	
/******/ })()
;