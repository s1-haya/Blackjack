class Card {
    suit: string;
    rank: string;

    constructor(suit: string, rank: string) {
        this.suit = suit;
        this.rank = rank;
    }

    getRankNumber(): number{
        if ("A" == this.rank)
            return 11;
        else if ("J" == this.rank || "Q" == this.rank || "K" == this.rank)
            return 10;
        return parseInt(this.rank);
    }
}

class Deck {
    gameType: string;
    cards: Card[];
    stockPile: number;
    numberOfPlayers: number;
    deckCount: number;
    levelType: string;

    constructor(gameType: string, numberOfPlayers: number, levelType: string) {
        this.gameType = gameType;
        this.cards = [];
        this.stockPile = 52;
        this.numberOfPlayers = numberOfPlayers;
        this.deckCount = (levelType === 'easy') ? 3 : 5;
        this.resetDeck();
        this.shuffle();
    }

    shuffle(): void{
        for (let i = this.cards.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    resetDeck(): void{
        const suit = ["H", "D", "C", "S"];
        const rank = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        for (let i = 0; i < suit.length; i++) {
            for (let j = 0; j < rank.length; j++) {
                this.cards.push(new Card(suit[i], rank[j]));
            }
        }
    }

    drawOne(): Card{
        this.reduceDeck();
        return this.cards.pop();
    }

    reduceDeck(): void{
        this.stockPile--;
        if (this.stockPile < 0){
            alert('Reset the cards in the deck');
            this.deckCount--;
            this.newDeck();
        }
    }

    newDeck(): void{
        this.resetDeck();
        this.shuffle();
        this.stockPile = 52;
    }
}

class Player {
    name: string;
    type: string;
    gameType: string;
    hand: Card[];
    chips: number;
    bet: number;
    winAmount: number;
    gameStatus: string;

    constructor(name: string, type: string, gameType: string, chips = 400) {
        this.name = name;
        this.type = type;
        this.gameType = gameType;
        this.hand = [];
        this.chips = chips;
        this.bet = 0;
        this.winAmount = 0;
        this.gameStatus = 'betting';
    }

    promptAI(): GameDecision{
        let gameDecision = new GameDecision(null, null);
        switch (this.gameStatus) {
            case ('betting'):
                gameDecision = this.getBetAI();
                break;
            case ('acting'):
                gameDecision = this.getActAI();
                break;
            case ('hit'):
                gameDecision = this.getActAddAI();
                break;
        }
        return gameDecision;
    }

    promptUser(): GameDecision{
        let gameDecision =  new GameDecision(null, null);
        switch (this.gameStatus) {
            case ('betting'):
                gameDecision = new GameDecision('bet', this.bet);
                break;
            case ('acting'):
                gameDecision = this.getActUser();
                break;
            case ('hit'):
                gameDecision = this.getActUser();
                break;
        }
        return gameDecision;
    }

    promptPlayer(userData: string): GameDecision{
        let gameDecision = new GameDecision(null, null);
        switch (userData) {
            case ('ai'):
                gameDecision = this.promptAI();
                break;
            case ('user'):
                gameDecision = this.promptUser();
                break;
        }
        return gameDecision;
    }

    getHandScore() :number{
        let score = 0;
        let ace = 0;

        for (let card of this.hand) {
            if (card.rank === "A")
                ace += 1;
            score += card.getRankNumber();
        }
        while (ace > 0 && score > 21) {
            score -= 10;
            ace--;
        }
        return score;
    }

    isBlackJack(): boolean{
        if (this.getHandScore() == 21 && this.hand.length == 2) return true;
        return false;
    }

    resetPlayerBet(): void{
        this.chips += this.bet;
        this.bet = 0;
    }

    getBetAI(): GameDecision{
        const betDenominations = [5, 20, 50, 100];
        const randomIndex = Math.floor(Math.random() * betDenominations.length);
        const betAmount = betDenominations[randomIndex];
        return new GameDecision("bet", betAmount);
    }

    getActAI(): GameDecision{
        const actionList = ["surrender", "double", "hit", "stand"];
        const randomIndex = this.randomIndex(actionList.length);
        let gameDecision = new GameDecision(actionList[randomIndex], this.bet);
        if (this.isBlackJack()) gameDecision = new GameDecision('blackjack', this.bet);
        return gameDecision;
    }

    getActAddAI(): GameDecision{
        let gameDecision = new GameDecision("stand", this.bet);
        return gameDecision;
    }

    getActUser(): GameDecision{
        let gameDecision = new GameDecision(this.gameStatus, this.bet);
        if (this.isBlackJack()) gameDecision = new GameDecision('blackjack', this.bet);
        return gameDecision;
    }

    randomIndex(length: number): number{
        return Math.floor(Math.random() * length);
    }
}

class GameDecision {
    action: string;
    amount: number;

    constructor(action: string, amount: number) {
        this.action = action;
        this.amount = amount;
    }
}

class Table {
    userData: string;
    user: Player;
    gameType: string;
    betDenominations: number[];
    deck: Deck;
    house: Player;
    players: Player[];
    turnCounter: number;
    gamePhase: string;
    resultsLog: string[];
    round: number;
    levelType: string;

    constructor(userData: string, gameType: string, levelType: string) {
        this.gameType = gameType;
        this.user = new Player(userData, 'user', this.gameType);
        this.betDenominations = [5, 20, 50, 100];
        this.house = new Player('house', 'house', this.gameType, -1);
        this.players = this.setPlayers();
        this.deck = new Deck(this.gameType, 1 + this.players.length, levelType);
        this.turnCounter = 0;
        this.gamePhase = 'betting';
        this.resultsLog = [];
        this.round = 0;
        this.levelType = levelType;
    }

    setPlayers(): Player[] {
        const user = this.user;
        const ai1 = new Player('AI1', 'ai', this.gameType);
        const ai2 = new Player('AI2', 'ai', this.gameType);
        return [ai1, user, ai2];
    }

    evaluateMove(player: Player): void{
        const gameDecision = player.promptPlayer(player.type);
        if (gameDecision.action === null && gameDecision.amount === null) return null;
        else {
            player.bet = gameDecision.amount;
            player.gameStatus = gameDecision.action;
            switch (gameDecision.action) {
                case ("bet"):
                    player.gameStatus = 'acting';
                    break;
                case ("hit"):
                    if (player.getHandScore() > 21) player.gameStatus = 'bust';
                    break;
                case ("double"):
                    if (player.getHandScore() > 21) player.gameStatus = 'bust';
                    else player.gameStatus = 'stand';
                    break;
            }
            this.aiDrowOne(player);
        }
        return null;
    }

    aiDrowOne(player: Player): void{
        if (player.type === 'ai' && (player.gameStatus === 'hit' || player.gameStatus === 'double')){
            player.hand.push(this.deck.drawOne());
        }
    }

    houseAction(houseScore: number): number{
        if (houseScore > 21) {
            this.isScoreBust(houseScore, this.house);
            return houseScore;
        }
        else if(houseScore >= 17) {
            this.house.gameStatus = 'stand';
            if (this.house.isBlackJack()) this.house.gameStatus = 'blackjack';
            return houseScore;
        }
        this.house.hand.push(this.deck.drawOne());
        houseScore = this.house.getHandScore();
        this.house.gameStatus = 'hit';
        //thisに難あり→table本体がいるかも
        // View.createMainPage(this);
        return this.houseAction(houseScore);
    }

    async blackjackEvaluateAndGetRoundResults(): Promise<void>{
        this.round++;
        let res = '';
        // await setTimeout(() => this.houseAction(houseScore), 2000);
        let houseScore = this.house.getHandScore();
        // await setTimeout(() => houseScore = this.houseAction(houseScore), 2000);
        // houseScore = this.houseAction(houseScore);
        // await this.houseAction(houseScore);
        houseScore = this.houseAction(houseScore);
        let houseStatus = this.house.gameStatus;
        
        for (let player of this.players) {
            const playerScore = player.getHandScore();
            this.isScoreBust(playerScore, player); 
            let playerStatus = player.gameStatus;
            let result = this.gameStatusResult(player, houseScore, houseStatus, playerScore, playerStatus);
            player.chips += (player.winAmount);
            res += `● name: ${player.name} action: ${playerStatus}, bet: ${player.bet}, won: ${player.winAmount}, result: ${result}<br>`;
        }
        this.isGameOver();
        this.resultsLog.push(res);
    }

    blackjackAssignPlayerHands(): void{
        const playerCard = this.deck.numberOfPlayers * 2;
        if (this.deck.stockPile < playerCard){
            alert('Reset the cards in the deck');
            this.deck.deckCount--;
            if (!(this.deck.deckCount)) return ;
            this.deck.newDeck();
        }
        this.house.hand.push(this.deck.drawOne());
        this.house.hand.push(this.deck.drawOne());
        for (let player of this.players) {
            player.hand.push(this.deck.drawOne());
            player.hand.push(this.deck.drawOne());
        }
    }

    blackjackClearPlayerHandsAndBets(): void{
        for (let player of this.players) {
            player.hand = [];
            player.bet = 0;
            player.winAmount = 0;
            player.gameStatus = 'betting';
            player.chips = (this.levelType === "easy") ? player.chips - 10 : player.chips -30;
            if (player.type === 'user' && player.chips < 0){
                player.gameStatus = 'gameOver';
            }
        }
        this.resultsLog = [];
        this.house.gameStatus = 'betting';
        this.house.hand = [];
        this.gamePhase = 'betting';
        this.turnCounter = 0;
    }

    getTurnPlayer(): Player{
        return this.players[this.turnCounter % this.players.length];
    }

    haveTurn(): void{
        const currentPlayer = this.getTurnPlayer();
        switch (this.gamePhase) {
            case ('betting'):
                this.evaluateMove(currentPlayer);
                if (this.onLastPlayer()) this.gamePhase = 'acting';
                break;
            case ('acting'):
                this.evaluateMove(currentPlayer);
                if (this.allPlayerBet()) this.house.gameStatus = 'acting';
                if (this.allPlayerActionsResolved()) {
                    this.gamePhase = 'roundOver';
                    this.blackjackEvaluateAndGetRoundResults();
                }
                break;
        }
        this.turnCounter++;
        return null;
    }

    allPlayerBet(): boolean{
        for (let player of this.players) {
            if (player.gameStatus == 'betting') return false;
        }
        return true;
    }

    onFirstPlayer(): boolean{
        return this.turnCounter % this.players.length == 0;
    }

    onLastPlayer(): boolean{
        return this.turnCounter % this.players.length == this.players.length - 1;
    }

    allPlayerActionsResolved(): boolean{
        for (let player of this.players) {
            if (player.gameStatus != "double" && player.gameStatus != 'bust' && player.gameStatus != "stand" && player.gameStatus != 'surrender' && player.gameStatus != 'blackjack')
                return false;
        }
        return true;
    }

    isScoreBust(score: number, player: Player): void{
        if (score > 21) player.gameStatus = 'bust';
    }

    isGameOver(): void{
        for (let player of this.players) {
            if (player.type === 'user' && player.chips <= 0) this.gamePhase = 'gameOver';
            else if (player.type === 'ai' && player.chips <= 0) player.chips = 400;
        }
    }

    gameStatusResult(player: Player,  houseScore: number, houseStatus: string, playerScore: number, playerStatus: string): string{
        let result = '';
        if (player.gameStatus === 'surrender') {
            player.winAmount = Math.floor(player.bet / 2) * (-1);
            result = 'SURRENDER';
        }
        else if (player.isBlackJack()) {
            player.winAmount = player.bet + Math.floor(player.bet * 0.5);
            player.gameStatus = 'blackjack';
            result = 'BLACKJACK';
        }
        else if (playerStatus === 'bust') {
            player.winAmount = player.bet * (-1);
            result = 'BUST';
        }
        else if (houseStatus === 'bust' || houseScore < playerScore) {
            result = this.playerWinOrLoseRes(player, playerStatus, 'WIN');
        }
        else if (houseScore > playerScore) {
            result = this.playerWinOrLoseRes(player, playerStatus, 'LOSE');
        }
        else {
            result = 'PUSH';
        }
        return result;
    }
    
    playerWinOrLoseRes(player: Player, playerStatus: string, res: string): string{
        switch (playerStatus) {
            case ('stand'):
                if(res === 'WIN') player.winAmount = player.bet;
                else player.winAmount = player.bet * (-1);
                break;
            case ('double'):
                if(res === 'WIN') player.winAmount = player.bet * 2;
                else player.winAmount = player.bet * (-2);
                break;
        }
        return res;
    }
}

interface SuitImgURL{
    [key: string]: string;
}

class Info{
    "S": string;
    "H": string;
    "C": string;
    "D": string;
    "?": string;

    static config = {
        'startGame': <HTMLInputElement>document.getElementById('start-game'),
        'startBtn': <HTMLInputElement>document.getElementById('start-btn'),
        'mainGame': <HTMLInputElement>document.getElementById('main-game'),
        suitImgURL:<SuitImgURL> {
            "S" : "https://recursionist.io/img/spade.png",
            "H" : "https://recursionist.io/img/heart.png",
            "C" : "https://recursionist.io/img/clover.png",
            "D" : "https://recursionist.io/img/diamond.png",
            "?" : "https://recursionist.io/img/questionMark.png"
        }
    }

    static displayNone(ele: HTMLInputElement){
        ele.classList.remove("d-block");
        ele.classList.add("d-none");
    }

    static displayBlock(ele: HTMLInputElement){
        ele.classList.remove("d-none");
        ele.classList.add("d-block");
    }
}

class View{
    static createMainPage(table: Table): void{
        Info.config['mainGame'].innerHTML =
        `
        <div class="col-12 center pt-5">
            <div class="d-flex flex-column left text-white">
                <div class="py-2">
                    <h1 class="m-0">Mode: ${table.levelType.toUpperCase()}</h1>
                </div>
                <div class="pt-4">
                    <h1 class="m-0">DeckRound: ${table.deck.deckCount}</h1>
                </div>
            </div>
            <div class="">
                <p class="m-0 text-center text-white rem3">Dealer</p>
                <p class="rem1 text-center text-white m-0">Status:&nbsp; ${table.house.gameStatus}&ensp;&ensp;</a>
                <div id="houseCardDiv" class="d-flex justify-content-center pt-2 pb-4"></div>
            </div>
            <div class="right">
                <div class="text-center">
                    <h2 class="text-white">Deck</h2>
                    <div id="deck-card"></div>
                    <div class="d-flex flex-column pt-2 text-white">
                        <h2>${table.deck.stockPile}</h2>
                    </div>
                </div>
            </div>
        </div>
        <div id="playersDiv" class="d-flex justify-content-center"></div>
        <div id="actionsAndBetsDiv" class="d-flex justify-content-center pb-5 pt-4 justify-content-center">
                <div id="betsDiv" class="d-flex flex-column  w-50"></div>
        </div>
        <div id="newGameDiv" class="d-flex flex-column justify-content-center text-white"></div>
        `
        View.createCardPage(table);
        Controller.setHouseCard(table);

        const deckDiv = document.getElementById("deck-card");
        deckDiv.append(View.createSecretCard());
    }

	static createSecretCard(): HTMLInputElement{
		const cardDiv = <HTMLInputElement>document.createElement("div");
        let suit: string = "?";
        let rank: string = "?";
		cardDiv.classList.add("bg-white", "border", "mx-2");
		cardDiv.innerHTML =
		`
		<div class="text-center pt-2">
			<img src="${Info.config["suitImgURL"][suit]}" alt="" width="50" height="50">
		</div>
		<div class="text-center">
			<p class="m-0">${rank}</p>
		</div>
		`
		return cardDiv;
	}

	static createCardPage(table: Table): void{
		const cardParDiv = document.getElementById("playersDiv");
        cardParDiv.innerHTML = "";
		const cardDiv = <HTMLInputElement>document.createElement("div");
		cardDiv.classList.add("d-flex", "justify-content-center");
		for (let player of table.players){
			cardDiv.innerHTML += 
			`
            <div class="p-5 mx-4">
                <p class="m-0 text-white text-center rem3">${player.name}</p>
                <div class="text-white m-0 py-2 d-flex">
                    <p class="rem1 text-left m-0">Status:&nbsp; ${player.gameStatus}&ensp;&ensp;</a>
                    <p class="rem1 text-left m-0">Bet:&nbsp; ${player.bet}&ensp;&ensp;</a>
                    <p class="rem1 text-left m-0">Chips:&nbsp; ${player.chips}&ensp;&ensp;</a>
                </div>
                <div id="${player.name}" class="d-flex justify-content-center"></div>
			</div>
            `
            Controller.setPlayerCard(table, cardDiv, player);
		}
        cardParDiv.append(cardDiv);
	}

    static createCard(playerCard: Card): HTMLInputElement{
        const suit: string = playerCard.suit;
        const rank: string = playerCard.rank;
        const cardDiv = <HTMLInputElement>document.createElement("div");
		cardDiv.classList.add("bg-white", "border", "mx-2");
		cardDiv.innerHTML =
		`
		<div class="text-center">
			<img src="${Info.config["suitImgURL"][suit]}" alt="" width="50" height="50">
		</div>
		<div class="text-center">
			<p class="m-0">${rank}</p>
		</div>
		`
		return cardDiv;
    }

    static createBetPage(table: Table): void{
        const betDiv = document.getElementById('betsDiv');
        betDiv.innerHTML +=
        `
        <div class="pb-5">
            <p class="m-0 text-center text-white rem2">Current Money: $${table.user.chips}</p>
            <p class="m-0 text-center text-white rem3">Bet: $${table.user.bet}</p>
        </div>
        `
        const bets = document.createElement("div");
        bets.classList.add("d-flex", "justify-content-center");
        for (let bet of table.betDenominations){
            bets.innerHTML += 
            `
			<div class="input-group px-4">
				<span class="input-group-btn">
					<button type="button" id="totalBet" class="btn-green radiusBtn rounded-circle p-0 btn-lg" value=${bet}>${bet}</button>
				</span>
			</div>
            `
        }
        betDiv.append(bets);
        betDiv.innerHTML +=
        `
        <div class="d-flex justify-content-between pt-3">
            <div class="py-3">
                    <button type="submit" id="reset-btn" class="btn btn-danger py-1 px-3">Reset</button>
            </div>
            <div class="py-3">
                    <button type="submit" id="bet-btn" class="btn btn-primary py-1 px-3">Bet</button>
            </div>
        </div>
        `
        Controller.getBets(table);
        Controller.resetAndBetBtn(table); 
    }
        
    static createActPage(table: Table): void{
        const action = <HTMLInputElement>document.getElementById('actionsAndBetsDiv');
        action.innerHTML =
        `
        <div id ="actionsDiv" class="d-flex flex-wrap w-70">
            <div class="py-2">
            <a id='surrender-btn' class="text-dark btn btn-light px-5 py-1">Surrender</a>
            </div>
            <div class="py-2">
            <a id="stand-btn" class="btn btn-success px-5 py-1">Stand</a>
            </div>
            <div class="py-2">
            <a id="hit-btn" class="btn btn-warning px-5 py-1">Hit</a>
            </div>
            <div class="py-2">
            <a id="double-btn" class="btn btn-danger px-5 py-1">Double</a>
            </div>
        </div> 
        `
        Controller.actionBtn(table);
    }

    static createNextGamePage(table: Table): void{
        const nextGameDiv = document.getElementById("newGameDiv");
        nextGameDiv.innerHTML =
        `
        <div class="py-2 d-flex justify-content-center">
            <a id='nextGame-btn' class="text-white btn btn-success px-5 py-1">Next Game</a>
        </div>
        <div class="py-2 text-white">
            <h4>Round${table.round}</h4>
            <p>${table.resultsLog}</p>
        </div>
        `
        Controller.nextGame(table);
    }

    static createGameOver(table: Table): void{
        const action = <HTMLInputElement>document.getElementById('actionsAndBetsDiv');
        action.innerHTML = "";
        let res = 'GAME OVER';
        let bool = true;
        if (table.gamePhase !== 'gameOver' && table.user.gameStatus !== 'gameOver'){
            bool = false;
            if (table.players[1].chips >= 400) res = "HUGE WIN";
            else if(table.players[1].chips >= 200) res = 'WIN';
            else res = 'LOSE';
        }
        const newGameDiv = document.getElementById("newGameDiv");
        newGameDiv.innerHTML =
        `
        <div class="py-2">
            <h1>${res}&nbsp;$${table.players[1].chips}</h1>
        </div>
        <div class=" py-2 d-flex justify-content-center flex-column">
            <a id='newGame-btn' class=" btn btn-success px-5 py-1">New Game</a>
        </div>
        `
        View.resultsLog(table, bool);
        Controller.gameOver();   
    }

    static resultsLog(table: Table, bool: Boolean): void{
        if (bool && table.user.gameStatus !== 'gameOver'){
            const newGameDiv = document.getElementById("newGameDiv");
            newGameDiv.innerHTML +=
            `
            <div  class="py-2">
                <h4>Round${table.round}</h4>
                <p>${table.resultsLog}</p>
            </div>
            `
        }
    }
}

class Controller{
    static startGame(): void{
        Info.displayNone(Info.config['mainGame']);
        Info.displayBlock(Info.config['startGame']);
        let cardType = <HTMLInputElement>document.getElementById('card-game');
        cardType.addEventListener('change', function(){
            if (cardType.value == 'poker') alert('準備中');
        })

        let level = '';
        const easyBtn = <HTMLInputElement>document.getElementsByName('level')[0];
        const hardBtn = <HTMLInputElement>document.getElementsByName('level')[1];
        easyBtn.addEventListener('change', (event) => {
            level = (event.currentTarget as HTMLInputElement).value;
        })
        hardBtn.addEventListener('change', (event) => {
            level = (event.currentTarget as HTMLInputElement).value;
        })

        Info.config['startBtn'].addEventListener('click', function(){
            let userData = <HTMLInputElement>document.getElementById('userData');
            if (userData.value == "") alert('Please fill in your name');
            else if (level == "") alert('Please fill in Easy or Hard')
            else {
                Info.displayNone(Info.config['startGame']);
                Info.displayBlock(Info.config['mainGame']);
                const table = new Table(userData.value, cardType.value, level);
                Controller.mainTable(table);
            }
            
        })
    }
    
    static getBets(table: Table): void{
        const betDiv = <HTMLInputElement>document.getElementById('betsDiv');
        const totalBets = betDiv.querySelectorAll('#totalBet');        
        for (let bet of totalBets){
            const clickedBet: number =  Number((<HTMLInputElement>bet).value);
            bet.addEventListener("click", function(){
                Controller.setLimitedBet(table, clickedBet, betDiv);
            })
        }
    }

    static setLimitedBet(table: Table, clickedBet: number, betDiv: HTMLInputElement): void{
        const userChips = table.user.chips;
        const userBet = table.user.bet;
        if (userBet + clickedBet > userChips) alert("Exceed the limit. You can't no more bet.");
        else {
            table.user.bet += clickedBet;
            betDiv.innerHTML = "";
            View.createBetPage(table);
        }
    }

    static resetAndBetBtn(table: Table): void{
        const betDiv = document.getElementById('betsDiv');
        const resetBtn = document.getElementById('reset-btn');
        resetBtn.addEventListener('click', function(){
            table.user.bet = 0;
            betDiv.innerHTML = "";
            View.createBetPage(table);
        })
        
        const betBtn = document.getElementById('bet-btn');
        betBtn.addEventListener('click', function(){
            if (table.user.bet === 0) alert('please bet money!');
            else Controller.mainTable(table);
        })   
    }

    static setHouseCard(table: Table): void{
        const houseCardDiv = document.getElementById("houseCardDiv");
        if (table.gamePhase === 'betting'){
            houseCardDiv.append(View.createSecretCard());
            houseCardDiv.append(View.createSecretCard());
        }
        else if(table.gamePhase === 'acting'){
            houseCardDiv.append(View.createCard(table.house.hand[0]));
            houseCardDiv.append(View.createSecretCard());
        }
        else{
            let i = 0;
            while(table.house.hand.length != i){
                houseCardDiv.append(View.createCard(table.house.hand[i]));
                i++;
            }
        }
    }

    static setPlayerCard(table: Table, cardDiv: HTMLInputElement, player: Player): void{
        const card = cardDiv.querySelectorAll(`#${player.name}`)[0];
        if (table.gamePhase === 'betting'){
            card.append(View.createSecretCard());
            card.append(View.createSecretCard());
        }
        else{
            let i = 0;
            while(player.hand.length != i){
                card.append(View.createCard(player.hand[i]));
                i++;
            }
        }
        // cardParDiv.append(cardDiv);
        // console.log(card);
        //document.getElementByIdは不可 (null)
        //cardDiv.querySelectorAll(`#${player.name}`)はnodeList
    }

    static mainTable(table: Table): void{
        View.createMainPage(table);
        Controller.judgeDeck(table);
        const currentPlayer = table.getTurnPlayer();
        if (table.gamePhase === 'betting' && currentPlayer.type === 'user'){
            View.createBetPage(table);
            table.haveTurn();
        }
        else if(table.gamePhase === 'acting' && currentPlayer.type == 'user'){
            Controller.setAutomationOrPageAction(table);
        }
        else if(table.gamePhase === 'roundOver'){
            if (table.deck.deckCount === 0) View.createGameOver(table);
            View.createNextGamePage(table);
        }
        else if(table.gamePhase === 'gameOver'){
            View.createGameOver(table);
        }
        else setTimeout(() => Controller.automaticAI(table), 2000);
    }

    static judgeDeck(table: Table): void{
        if (table.deck.deckCount == 0 || table.user.gameStatus === 'gameOver') View.createGameOver(table);
    }

    static async automaticAI(table: Table): Promise<void>{
        if (table.gamePhase === 'betting' && table.onFirstPlayer()) {
            table.blackjackAssignPlayerHands();
        }
        table.haveTurn();
        Controller.mainTable(table);

    }

    static setAutomationOrPageAction(table: Table): void{
        if (table.user.isBlackJack() || table.user.getHandScore() > 21 || this.isAutomaticActionBtn(table)){
            table.haveTurn();
            Controller.mainTable(table);
        }
        else{
            View.createActPage(table);
            table.haveTurn();
        }
    }

    static isAutomaticActionBtn(table: Table): boolean{
        if(table.user.gameStatus === 'surrender' || table.user.gameStatus === 'stand' || table.user.gameStatus === 'double') return true;
        return false;
    }

    static randomIndex(length: number): number{
        return Math.floor(Math.random() * length);
    }
    
    static actionBtn(table: Table): void{
        const action = <HTMLInputElement>document.getElementById('actionsAndBetsDiv');
        const hitBtn = <HTMLInputElement>action.querySelector("#hit-btn");
        const standBtn = <HTMLInputElement>action.querySelector("#stand-btn");
        const surrenderBtn =<HTMLInputElement> action.querySelector("#surrender-btn");
        const doubleBtn = <HTMLInputElement>action.querySelector("#double-btn");
        if (table.user.gameStatus === 'hit'){
            surrenderBtn.classList.add('disabled');
            doubleBtn.classList.add('disabled');
        }
        Controller.hitBtn(table, hitBtn);
        Controller.standBtn(table, standBtn);
        Controller.surrenderBtn(table, surrenderBtn);
        Controller.doubleBtn(table, doubleBtn);
    }
    
    static hitBtn(table: Table, hitBtn: HTMLInputElement): void{
        hitBtn.addEventListener("click", function(){
            table.user.gameStatus = 'hit';
            table.user.hand.push(table.deck.drawOne());
            Controller.mainTable(table);
        })
    }
    
    static standBtn(table: Table, standBtn: HTMLInputElement): void{
        standBtn.addEventListener("click", function(){
            table.user.gameStatus = 'stand';
            Controller.mainTable(table);
        })
    }
    
    static surrenderBtn(table: Table, surrenderBtn: HTMLInputElement): void{
        surrenderBtn.addEventListener("click", function(){
            table.user.gameStatus = 'surrender';
            Controller.mainTable(table);
        })
    }
    
    static doubleBtn(table: Table, doubleBtn: HTMLInputElement): void{
        doubleBtn.addEventListener("click", function(){
            table.user.gameStatus = 'double';
            table.user.hand.push(table.deck.drawOne());
            Controller.mainTable(table);
        })

    }

    static nextGame(table: Table): void{
        const nextGameBtn = document.getElementById('nextGame-btn');
        nextGameBtn.addEventListener('click', function(){
            table.blackjackClearPlayerHandsAndBets();
            Controller.mainTable(table);
        })
    }
    
    static gameOver(): void{
        const newGameBtn = document.getElementById('newGame-btn');
        newGameBtn.addEventListener("click", function(){
            Controller.startGame();
        })
    }
}

Controller.startGame();
