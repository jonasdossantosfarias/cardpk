// probabilityCalculator.js
export class PokerProbability {
    constructor(deck, playerHand, communityCards) {
        this.deck = deck; // Array of all cards in the deck
        this.playerHand = playerHand; // Array of player's hand cards
        this.communityCards = communityCards; // Array of community cards
    }

    static calculateOdds(handStrength, opponentStrength) {
        // Simulated odds based on hand strengths
        return handStrength / (handStrength + opponentStrength);
    }

    getPossibleHands(cards, numCards = 5) {
        // Generate all possible combinations of cards
        const combinations = [];
        const combine = (start, chosen) => {
            if (chosen.length === numCards) {
                combinations.push([...chosen]);
                return;
            }
            for (let i = start; i < cards.length; i++) {
                chosen.push(cards[i]);
                combine(i + 1, chosen);
                chosen.pop();
            }
        };
        combine(0, []);
        return combinations;
    }

    evaluateHandStrength(hand) {
        // Example evaluation logic (e.g., Full House, Flush, etc.)
        // Will return a numerical score for hand ranking
        return Math.random() * 100; // Placeholder logic
    }

    simulateOpponentHands(numOpponents) {
        const remainingDeck = this.deck.filter(card => 
            !this.playerHand.includes(card) && 
            !this.communityCards.includes(card)
        );
        const opponentHands = [];
        for (let i = 0; i < numOpponents; i++) {
            opponentHands.push(remainingDeck.splice(0, 2));
        }
        return opponentHands;
    }

    calculateWinningProbability(numOpponents) {
        const opponentHands = this.simulateOpponentHands(numOpponents);
        const playerStrength = this.evaluateHandStrength([...this.playerHand, ...this.communityCards]);
        
        let playerWins = 0, opponentWins = 0, draws = 0;

        for (const opponent of opponentHands) {
            const opponentStrength = this.evaluateHandStrength([...opponent, ...this.communityCards]);
            if (playerStrength > opponentStrength) playerWins++;
            else if (playerStrength < opponentStrength) opponentWins++;
            else draws++;
        }

        const total = playerWins + opponentWins + draws;
        return {
            playerWinRate: ((playerWins / total) * 100).toFixed(2),
            opponentWinRate: ((opponentWins / total) * 100).toFixed(2),
            drawRate: ((draws / total) * 100).toFixed(2),
        };
    }
}

