class Card {
    private static ace: number = 11;
    private static jqk: number = 10;

    private suit: string;
    private rank: string;

    public constructor(suit: string, rank: string) {
        this.suit = suit;
        this.rank = rank;
    }

    public getSuit = (): string => {return this.suit}
    public getRank = (): string => {return this.rank}

    public getRankNumber(): number{
        switch (this.rank){
            case ("A"):
                return Card.ace;
            case ("J"):
            case ("Q"):
            case ("K"):
                return Card.jqk;
        }
        return parseInt(this.rank);
    }

    public isAce = (): boolean => {return "A" == this.rank}
}

class Deck {
    static deck: number = 52;
    static easyMode: number = 3;
    static hardMode: number = 5;

    private gameType: string;
    private cards: Card[];
    private stockPile: number;
    private numberOfPlayers: number;
    private levelType: string;
    private deckCount: number;

    constructor(gameType: string, numberOfPlayers: number, levelType: string) {
        this.gameType = gameType;
        this.cards = [];
        this.stockPile = Deck.deck;
        this.numberOfPlayers = numberOfPlayers;
        this.levelType = levelType;
        this.deckCount = (this.levelType === 'easy') ? Deck.easyMode : Deck.hardMode;
        this.resetDeck();
        this.shuffle();
    }

    public getGameType = (): string => {return this.gameType}
    public getCards = (): Card[] => {return this.cards}
    public getStockPile = (): number => {return this.stockPile}
    public getNumberOfPlayers = (): number => {return this.numberOfPlayers}
    public getLevelType = (): string => {return this.levelType}
    public getDeckCount = (): number => {return this.deckCount}

    public setDeckCount = (count: number): void => {this.deckCount = count}
    
    public newDeck(): void{
        this.resetDeck();
        this.shuffle();
        this.stockPile = Deck.deck;
    }

    private resetDeck(): void{
        const suit = ["H", "D", "C", "S"];
        const rank = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        for (let i = 0; i < suit.length; i++) {
            for (let j = 0; j < rank.length; j++) {
                this.cards.push(new Card(suit[i], rank[j]));
            }
        }
    }

    private shuffle(): void{
        for (let i = this.cards.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    public drawOne(): Card{
        this.reduceDeck();
        return this.cards.pop();
    }

    public reduceDeck(): void{
        this.stockPile--;
        if (this.stockPile < 0){
            alert('Reset the cards in the deck.');
            this.deckCount--;
            this.newDeck();
        }
    }
}

interface GamePlayer{
    [key: string]: GameDecision[];
}

class Player {
    private name: string;
    private type: string;
    private gameType: string;
    private hand: Card[];
    private chips: number;
    private bet: number;
    private winAmount: number;
    private gameStatus: string;

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

    public getName = (): string => {return this.name}
    public getType = (): string => {return this.type}
    public getGameType = (): string => {return this.gameType}
    public getHand = (): Card[] => {return this.hand}
    public getChips = (): number => {return this.chips}
    public getBet = (): number => {return this.bet}
    public getWinAmount = (): number => {return this.winAmount}
    public getGameStatus = (): string => {return this.gameStatus}

    public setHand = (hand: Card[]): void => {this.hand = hand}
    public setChips = (winAmount: number): void => {this.chips += winAmount}
    public setBet = (bet: number): void => {this.bet = bet}
    public setUserBet = (bet: number): void => {this.bet += bet}
    public setWinAmount = (winAmount: number): void => {this.winAmount = winAmount}
    public setGameStatus = (gameStatus: string): void => {this.gameStatus = gameStatus}

    private setGameDecision(gameStatus: string): GameDecision[]{
        let gameDecision: GamePlayer = {};
        if(!('betting' === gameStatus || 'acting' === gameStatus || 'hit' === gameStatus)) return  [new GameDecision(null, null), new GameDecision(null, null)];
        gameDecision['betting'] = [this.getBetAI(), new GameDecision('bet', this.bet)];
        gameDecision['acting'] = [this.getActAI(), this.getActUser()];
        gameDecision['hit'] = [this.getActAddAI(), this.getActUser()];
        return gameDecision[gameStatus];
    }

    private promptAI(): GameDecision{
        console.log(this.gameStatus);
        let gameDecision = this.setGameDecision(this.gameStatus)[0];
        return gameDecision;
    }
    
    private promptUser(): GameDecision{
        console.log(this.gameStatus);
        let gameDecision =  this.setGameDecision(this.gameStatus)[1];
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
            if (card.isAce())
                ace += 1;
            score += card.getRankNumber();
        }
        for(; ace > 0 && score > 21; ace--){
            score -= 10;
        }
        return score;
    }

    isBlackJack(): boolean{return this.getHandScore() == 21 && this.hand.length == 2};

    resetPlayerBet(): void{
        this.chips += this.bet;
        this.bet = 0;
    }

    getBetAI(): GameDecision{
        const betDenominations = [5, 20, 50, 100];
        const betAmount = this.getRandomArr(betDenominations);
        return new GameDecision("bet", betAmount);
    }

    getActAI(): GameDecision{
        const actionList = ["surrender", "double", "hit", "stand"];
        const action = this.getRandomArr(actionList);
        let gameDecision = new GameDecision(action, this.bet);
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

    private randomIndex(length: number): number{return Math.floor(Math.random() * length)}

    private getRandomArr(arr: any): any{
        const randomIndex = this.randomIndex(arr.length);
        return arr[randomIndex];
    }

    isPlayerHandAce(): boolean{
        for (let playerCard of this.hand){
            if (playerCard.isAce()){
                return true;
            }
        }
        return false;
    }
}

class GameDecision {
    private action: string;
    private amount: number;

    constructor(action: string, amount: number) {
        this.action = action;
        this.amount = amount;
    }

    public getAction(): string{return this.action}
    public getAmount(): number{return this.amount}
}

class Table {
    private userData: string;
    private gameType: string;
    private user: Player;
    private betDenominations: number[];
    private house: Player;
    private players: Player[];
    private deck: Deck;
    private turnCounter: number;
    private gamePhase: string;
    private resultsLog: string[];
    private round: number;
    private levelType: string;

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

    getGameType = (): string => {return this.gameType}
    getUser = (): Player => {return this.user};
    getBetDenominations = (): number[] => {return this.betDenominations};
    getHouse = (): Player => {return this.house};
    getPlayers = (): Player[] => {return this.players};
    getDeck = (): Deck => {return this.deck};
    getTurnCounter = (): number => {return this.turnCounter};
    getGamePhase = (): string => {return this.gamePhase};
    getResultsLog = (): string[] => {return this.resultsLog};
    getRound = (): number => {return this.round};
    getLevelType = (): string => {return this.levelType};

    setGamePhase(gamePhase: string): void{
        this.gamePhase = gamePhase;
    }

    setPlayers(): Player[] {
        const user = this.user;
        const ai1 = new Player('AI1', 'ai', this.gameType);
        const ai2 = new Player('AI2', 'ai', this.gameType);
        return [ai1, user, ai2];
    }

    evaluateMove(player: Player): void{
        const gameDecision = player.promptPlayer(player.getType());
        if (gameDecision.getAction() === null && gameDecision.getAmount() === null) return null;
        else {
            player.setBet(gameDecision.getAmount());
            player.setGameStatus(gameDecision.getAction()); 
            switch (gameDecision.getAction()) {
                case ("bet"):
                    player.setGameStatus('acting');
                    break;
                case ("hit"):
                    if (player.getHandScore() > 21) player.setGameStatus('bust');
                    break;
                case ("double"):
                    if (player.getHandScore() > 21) player.setGameStatus('bust');
                    else player.setGameStatus('stand');
                    break;
            }
            this.aiDrowOne(player);
        }
        return null;
    }

    aiDrowOne(player: Player): void{
        if (player.getType() === 'ai' && (player.getGameStatus()=== 'hit' || player.getGameStatus() === 'double')){
            player.getHand().push(this.deck.drawOne());
        }
    }

    houseAction(houseScore: number): number{
        if (houseScore > 21) {
            this.isScoreBust(houseScore, this.house);
            return houseScore;
        }
        else if(houseScore >= 17) {
            this.house.setGameStatus('stand');
            if (this.house.isBlackJack()) this.house.setGameStatus('blackjack');
            return houseScore;
        }
        this.house.getHand().push(this.deck.drawOne());
        houseScore = this.house.getHandScore();
        this.house.setGameStatus('hit');
        return this.houseAction(houseScore);
    }

    blackjackEvaluateAndGetRoundResults(): void{
        this.round++;
        let res = '';
        let houseScore = this.house.getHandScore();
        houseScore = this.houseAction(houseScore);
        let houseStatus = this.house.getGameStatus();
        
        for (let player of this.players) {
            const playerScore = player.getHandScore();
            this.isScoreBust(playerScore, player); 
            let playerStatus = player.getGameStatus();
            let result = this.gameStatusResult(player, houseScore, houseStatus, playerScore, playerStatus);
            player.setChips(player.getWinAmount());
            res += `● name: ${player.getName()} action: ${playerStatus}, bet: ${player.getBet()}, won: ${player.getWinAmount()}, result: ${result}<br>`;
        }
        this.isGameOver();
        this.resultsLog.push(res);
    }

    blackjackAssignPlayerHands(): void{
        const playerCard = this.deck.getNumberOfPlayers() * 2;
        if (this.deck.getStockPile() < playerCard){
            alert('Reset the cards in the deck.');
            const deckCount = this.deck.getDeckCount();
            this.deck.setDeckCount(deckCount - 1);
            if (!(deckCount)) return ; 
            this.deck.newDeck();
        }
        this.house.getHand().push(this.deck.drawOne(), this.deck.drawOne());
        for (let player of this.players) {
            player.getHand().push(this.deck.drawOne(), this.deck.drawOne());
        }
    }

    blackjackClearPlayerHandsAndBets(): void{
        for (let player of this.players) {
            player.setHand([]);
            player.setBet(0);
            player.setWinAmount(0);
            player.setGameStatus('betting');
            player.setChips((this.levelType === "easy") ? - 10 : -20);
            if (player.getType() === 'user' && player.getChips() < 0){
                player.setGameStatus('gameOver');
            }
        }
        this.resultsLog = [];
        this.house.setGameStatus('betting');
        this.house.setHand([]);
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
                if (this.allPlayerBet()) this.house.setGameStatus('acting');
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
            if (player.getGameStatus() == 'betting') return false;
        }
        return true;
    }

    onFirstPlayer = (): boolean => {return this.turnCounter % this.players.length == 0}

    onLastPlayer = (): boolean => {return this.turnCounter % this.players.length == this.players.length - 1}

    allPlayerActionsResolved(): boolean{
        for (let player of this.players) {
            let playerGameStatus = player.getGameStatus();
            if (playerGameStatus != "double" && playerGameStatus != 'bust' && playerGameStatus != "stand" && playerGameStatus != 'surrender' && playerGameStatus != 'blackjack')
                return false;
        }
        return true;
    }

    isScoreBust(score: number, player: Player): void{
        if (score > 21) player.setGameStatus('bust');
    }

    isGameOver(): void{
        for (let player of this.players) {
            if (player.getType() === 'user' && player.getChips() <= 0) this.gamePhase = 'gameOver';
            else if (player.getType() === 'ai' && player.getChips() <= 0) player.setChips(400);
        }
    }

    gameStatusResult(player: Player,  houseScore: number, houseStatus: string, playerScore: number, playerStatus: string): string{
        let result = '';
        if (player.getGameStatus() === 'surrender') {
            player.setWinAmount(Math.floor(player.getBet() / 2) * (-1));
            result = 'SURRENDER';
        }
        else if (player.isBlackJack()) {
            player.setWinAmount(player.getBet() + Math.floor(player.getBet() * 0.5)); 
            player.setGameStatus('blackjack');
            result = 'BLACKJACK';
        }
        else if (playerStatus === 'bust') {
            player.setWinAmount(player.getBet() * (-1));
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
                if(res === 'WIN') player.setWinAmount(player.getBet());
                else player.setWinAmount(player.getBet() * (-1));
                break;
            case ('double'):
                if(res === 'WIN') player.setWinAmount(player.getBet() * 2);
                else player.setWinAmount(player.getBet() * (-2));
                break;
        }
        return res;
    }

    basicStrategy(): string{
        let userGameStatus = "";
        const user = this.user;
        const houseHand = this.house.getHand()[0];
        const userHandScore = this.user.getHandScore();
        const houseOneHandScore = houseHand.getRankNumber();

        if (user.isPlayerHandAce()) {
            userGameStatus = this.softHand(userHandScore, houseOneHandScore);
        }
        else userGameStatus = this.hardHand(userHandScore, houseOneHandScore);
        return userGameStatus;
    }

    hardHand(userHandScore: number, houseOneHandScore: number): string{
        let userGameStatus = "";
        if (userHandScore <= 8) userGameStatus = "hit";
        else if (userHandScore >= 17) userGameStatus = "stand";
        else {
            const hardHand: string[] = Info.config["hardHand"][userHandScore.toString()];
            userGameStatus = hardHand[houseOneHandScore - 2];
        }
        return userGameStatus;
    }
    
    softHand(userHandScore: number, houseOneHandScore: number): string{
        let userGameStatus = "";
        if (userHandScore >= 19) userGameStatus = "stand";
        else {
            const softHand: string[] = Info.config["softHand"][userHandScore.toString()];
            userGameStatus = softHand[houseOneHandScore - 2];
        }
        return userGameStatus;
    }
}

interface SuitImgURL{
    [key: string]: string;
}

interface BasicStrategy{
    [key: string]: string[];
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
        suitImgURL: <SuitImgURL> {
            "S" : "https://recursionist.io/img/spade.png",
            "H" : "https://recursionist.io/img/heart.png",
            "C" : "https://recursionist.io/img/clover.png",
            "D" : "https://recursionist.io/img/diamond.png",
            "?" : "https://recursionist.io/img/questionMark.png"
        },
        'hardHand':<BasicStrategy>{
            "9": ["hit", "double", "double", "double", "double", "hit", "hit", "hit", "hit","hit"],
            "10": ["double", "double", "double", "double", "double", "double", "double", "double", "hit","hit"],
            "11": ["double", "double", "double", "double", "double", "double", "double", "double", "double","hit"],
            "12": ["hit", "hit", "stand", "stand", "stand", "hit", "hit", "hit", "hit","hit"],
            "13": ["stand", "stand", "stand", "stand", "stand", "hit", "hit", "hit", "hit","hit"],
            "14": ["stand", "stand", "stand", "stand", "stand", "hit", "hit", "hit", "hit","hit"],
            "15": ["stand", "stand", "stand", "stand", "stand", "hit", "hit", "hit", "surrender", "hit"],
            "16": ["stand", "stand", "stand", "stand", "stand", "hit", "hit", "surrender", "surrender", "surrender",],
        },
        'softHand': <BasicStrategy>{
            "13": ["hit", "hit", "hit", "double", "double", "hit", "hit", "hit", "hit","hit"],
            "14": ["hit", "hit", "hit", "double", "double", "hit", "hit", "hit", "hit","hit"],
            "15": ["hit", "hit", "double", "double", "double", "hit", "hit", "hit", "hit","hit"],
            "16": ["hit", "hit", "double", "double", "double", "hit", "hit", "hit", "hit","hit"],
            "17": ["hit", "double", "double", "double", "double", "hit", "hit", "hit", "hit","hit"],
            "18": ["stand", "double", "double", "double", "double", "stand", "stand", "hit", "hit","hit"]
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
                    <h1 class="m-0">Mode: ${table.getLevelType().toUpperCase()}</h1>
                </div>
                <div class="pt-4">
                    <h1 class="m-0">DeckRound: ${table.getDeck().getDeckCount()}</h1>
                </div>
            </div>
            <div class="">
                <p class="m-0 text-center text-white rem3">Dealer</p>
                <p class="rem1 text-center text-white m-0">Status:&nbsp; ${table.getHouse().getGameStatus()}&ensp;&ensp;</a>
                <div id="houseCardDiv" class="d-flex justify-content-center pt-2 pb-4"></div>
            </div>
            <div class="right">
                <div class="text-center">
                    <h2 class="text-white">Deck</h2>
                    <div id="deck-card"></div>
                    <div class="d-flex flex-column pt-2 text-white">
                        <h2>${table.getDeck().getStockPile()}</h2>
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
		for (let player of table.getPlayers()){
			cardDiv.innerHTML += 
			`
            <div class="p-5 mx-4">
                <p class="m-0 text-white text-center rem3">${player.getName()}</p>
                <div class="text-white m-0 py-2 d-flex">
                    <p class="rem1 text-left m-0">Status&nbsp; ${player.getGameStatus()}&ensp;&ensp;</a>
                    <p class="rem1 text-left m-0">Bet&nbsp; ${player.getBet()}&ensp;&ensp;</a>
                    <p class="rem1 text-left m-0">Chips&nbsp; ${player.getChips()}&ensp;&ensp;</a>
                </div>
                <div id="${player.getName()}" class="d-flex justify-content-center"></div>
			</div>
            `
            Controller.setPlayerCard(table, cardDiv, player);
		}
        cardParDiv.append(cardDiv);
	}

    static createCard(playerCard: Card): HTMLInputElement{
        const suit: string = playerCard.getSuit();
        const rank: string = playerCard.getRank();
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
            <p class="m-0 text-center text-white rem2">Current Money: $${table.getUser().getChips()}</p>
            <p class="m-0 text-center text-white rem3">Bet: $${table.getUser().getBet()}</p>
        </div>
        `
        const bets = document.createElement("div");
        bets.classList.add("d-flex", "justify-content-center");
        for (let bet of table.getBetDenominations()){
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
            <div class="py-2">
            <a id="auto-btn" class="btn btn-secondary px-5 py-1">Auto</a>
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
            <h4>Round${table.getRound()}</h4>
            <p>${table.getResultsLog()}</p>
        </div>
        `
        Controller.nextGame(table);
    }

    static createGameOver(table: Table): void{
        const action = <HTMLInputElement>document.getElementById('actionsAndBetsDiv');
        action.innerHTML = "";
        let res = 'GAME OVER';
        let bool = true;
        if (table.getGamePhase() !== 'gameOver' && table.getUser().getGameStatus() !== 'gameOver'){
            bool = false;
            if (table.getPlayers()[1].getChips() >= 400) res = "HUGE WIN";
            else if(table.getPlayers()[1].getChips() >= 200) res = 'WIN';
            else res = 'LOSE';
        }
        const newGameDiv = document.getElementById("newGameDiv");
        newGameDiv.innerHTML =
        `
        <div class="py-2">
            <h1>${res}&nbsp;$${table.getPlayers()[1].getChips()}</h1>
        </div>
        <div class=" py-2 d-flex justify-content-center flex-column">
            <a id='newGame-btn' class=" btn btn-success px-5 py-1">New Game</a>
        </div>
        `
        View.resultsLog(table, bool);
        Controller.gameOver();   
    }

    static resultsLog(table: Table, bool: Boolean): void{
        if (bool && table.getUser().getGameStatus() !== 'gameOver'){
            const newGameDiv = document.getElementById("newGameDiv");
            newGameDiv.innerHTML +=
            `
            <div  class="py-2">
                <h4>Round${table.getRound()}</h4>
                <p>${table.getResultsLog()}</p>
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
            if (cardType.value == 'poker') alert("No poker currently being played. Please change to blackjack.");
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
            if (userData.value == "") alert('Please fill in your name.');
            else if (level == "") alert('Please fill in Easy or Hard.');
            else if (cardType.value == "poker") alert("No poker currently being played. Please change to blackjack.");
            else {
                Info.displayNone(Info.config['startGame']);
                Info.displayBlock(Info.config['mainGame']);
                console.log(cardType.value);
                const table = new Table(userData.value, cardType.value, level);
                Controller.mainTable(table);
                return null;
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
        const userChips = table.getUser().getChips();
        const userBet = table.getUser().getBet();
        if (userBet + clickedBet > userChips) alert("Exceed the limit. You can't no more bet.");
        else {
            table.getUser().setUserBet(clickedBet);
            betDiv.innerHTML = "";
            View.createBetPage(table);
        }
    }

    static resetAndBetBtn(table: Table): void{
        const betDiv = document.getElementById('betsDiv');
        const resetBtn = document.getElementById('reset-btn');
        resetBtn.addEventListener('click', function(){
            table.getUser().setBet(0);
            betDiv.innerHTML = "";
            View.createBetPage(table);
        })
        
        const betBtn = document.getElementById('bet-btn');
        betBtn.addEventListener('click', function(){
            if (table.getUser().getBet() === 0) alert('please bet money!');
            else Controller.mainTable(table);
        })   
    }

    static setHouseCard(table: Table): void{
        const houseCardDiv = document.getElementById("houseCardDiv");
        if (table.getGamePhase() === 'betting'){
            houseCardDiv.append(View.createSecretCard());
            houseCardDiv.append(View.createSecretCard());
        }
        else if(table.getGamePhase() === 'acting'){
            houseCardDiv.append(View.createCard(table.getHouse().getHand()[0]));
            houseCardDiv.append(View.createSecretCard());
        }
        else{
            let i = 0;
            while(table.getHouse().getHand().length != i){
                houseCardDiv.append(View.createCard(table.getHouse().getHand()[i]));
                i++;
            }
        }
    }

    static setPlayerCard(table: Table, cardDiv: HTMLInputElement, player: Player): void{
        const card = cardDiv.querySelectorAll(`#${player.getName()}`)[0];
        if (table.getGamePhase() === 'betting'){
            card.append(View.createSecretCard());
            card.append(View.createSecretCard());
        }
        else{
            let i = 0;
            while(player.getHand().length != i){
                card.append(View.createCard(player.getHand()[i]));
                i++;
            }
        }
    }

    static mainTable(table: Table): void{
        View.createMainPage(table);
        Controller.judgeDeck(table);
        const currentPlayer = table.getTurnPlayer();
        if (table.getGamePhase() === 'betting' && currentPlayer.getType() === 'user'){
            Controller.setGameOverOrPageBet(table);
        }
        else if(table.getGamePhase() === 'acting' && currentPlayer.getType() == 'user'){
            Controller.setAutomationOrPageAction(table);
        }
        else if(table.getGamePhase() === 'roundOver'){
            if (!(table.getDeck().getDeckCount())) View.createGameOver(table);
            View.createNextGamePage(table);
        }
        else if(table.getGamePhase() === 'gameOver'){
            View.createGameOver(table);
        }
        else setTimeout(() => Controller.automaticAI(table), 2000);
    }

    static judgeDeck(table: Table): void{
        if ((!(table.getDeck().getDeckCount())) || table.getUser().getGameStatus() === 'gameOver') View.createGameOver(table);
    }

    static async automaticAI(table: Table): Promise<void>{
        if (table.getGamePhase() === 'betting' && table.onFirstPlayer()) {
            table.blackjackAssignPlayerHands();
        }
        table.haveTurn();
        Controller.mainTable(table);

    }

    static setGameOverOrPageBet(table: Table): void{
        if (table.getUser().getChips() <= 0){
            table.getUser().setGameStatus('gameOver');
            View.createGameOver(table);
        }
        else {
            View.createBetPage(table);
            table.haveTurn();
        }
    }

    static setAutomationOrPageAction(table: Table): void{
        if (table.getUser().isBlackJack() || table.getUser().getHandScore() > 21 || this.isAutomaticActionBtn(table)){
            table.haveTurn();
            Controller.mainTable(table);
        }
        else{
            View.createActPage(table);
            table.haveTurn();
        }
    }

    static isAutomaticActionBtn(table: Table): boolean{
        if(table.getUser().getGameStatus() === 'surrender' || table.getUser().getGameStatus() === 'stand' || table.getUser().getGameStatus() === 'double') return true;
        return false;
    }

    static randomIndex(length: number): number{
        return Math.floor(Math.random() * length);
    }
    
    static actionBtn(table: Table): void{
        const action = <HTMLInputElement>document.getElementById('actionsAndBetsDiv');
        const autoBtn = <HTMLInputElement>action.querySelector("#auto-btn");
        const hitBtn = <HTMLInputElement>action.querySelector("#hit-btn");
        const standBtn = <HTMLInputElement>action.querySelector("#stand-btn");
        const surrenderBtn =<HTMLInputElement> action.querySelector("#surrender-btn");
        const doubleBtn = <HTMLInputElement>action.querySelector("#double-btn");

        if (table.getUser().getGameStatus() === 'hit'){
            surrenderBtn.classList.add('disabled');
            doubleBtn.classList.add('disabled');
        }
        if (table.getUser().getHand().length > 2 || table.getLevelType() == 'hard'){
            autoBtn.classList.add('disabled');
        }

        Controller.autoBtn(table, autoBtn);
        Controller.hitBtn(table, hitBtn);
        Controller.standBtn(table, standBtn);
        Controller.surrenderBtn(table, surrenderBtn);
        Controller.doubleBtn(table, doubleBtn);
    }
    
    static autoBtn(table: Table, hitBtn: HTMLInputElement): void{
        hitBtn.addEventListener("click", function(){
            table.getUser().setGameStatus(table.basicStrategy());
            const userGameStatus = table.getUser().getGameStatus();
            if (Controller.isDrawOneAction(userGameStatus)){
                table.getUser().getHand().push(table.getDeck().drawOne());
            }
            Controller.mainTable(table);
        })
    }

    static isDrawOneAction(userGameStatus: string): boolean{
        if (userGameStatus === 'hit' || userGameStatus === 'double') return true;
        return false;
    }

    static hitBtn(table: Table, hitBtn: HTMLInputElement): void{
        hitBtn.addEventListener("click", function(){
            table.getUser().setGameStatus('hit');
            table.getUser().getHand().push(table.getDeck().drawOne());
            Controller.mainTable(table);
        })
    }
    
    static standBtn(table: Table, standBtn: HTMLInputElement): void{
        standBtn.addEventListener("click", function(){
            table.getUser().setGameStatus('stand');
            Controller.mainTable(table);
        })
    }
    
    static surrenderBtn(table: Table, surrenderBtn: HTMLInputElement): void{
        surrenderBtn.addEventListener("click", function(){
            table.getUser().setGameStatus('surrender');
            Controller.mainTable(table);
        })
    }
    
    static doubleBtn(table: Table, doubleBtn: HTMLInputElement): void{
        doubleBtn.addEventListener("click", function(){
            table.getUser().setGameStatus('double');
            table.getUser().getHand().push(table.getDeck().drawOne());
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
            location.reload();
        })
    }
}

Controller.startGame();

