export class PokerProbability {
    static calculateHandStrength(playerHand, communityCards) {
        const allCards = [...playerHand, ...communityCards];
        // Avaliar a força da mão do jogador com base em combinações.
        return PokerProbability.evaluateHand(allCards);
    }

    static evaluateHand(cards) {
        // Avaliar a força da mão com base nas regras do poker.
        // (Implementação detalhada similar ao código atual para classificação de mãos.)
        const ranks = cards.map(card => card.slice(0, -1));
        const suits = cards.map(card => card.slice(-1));
        const rankCounts = {};
        const suitCounts = {};

        ranks.forEach(rank => rankCounts[rank] = (rankCounts[rank] || 0) + 1);
        suits.forEach(suit => suitCounts[suit] = (suitCounts[suit] || 0) + 1);

        const isFlush = Object.values(suitCounts).some(count => count >= 5);
        const sortedRanks = ranks
            .map(rank => isNaN(rank) ? (rank === 'A' ? 14 : rank === 'K' ? 13 : rank === 'Q' ? 12 : rank === 'J' ? 11 : 10) : parseInt(rank))
            .sort((a, b) => a - b);
        const isStraight = sortedRanks.some((rank, index, arr) => 
            index <= arr.length - 5 && arr.slice(index, index + 5).every((val, i, slice) => val === slice[0] + i)
        );

        if (isFlush && isStraight) return "Straight Flush";
        if (Object.values(rankCounts).includes(4)) return "Quadra";
        if (Object.values(rankCounts).includes(3) && Object.values(rankCounts).includes(2)) return "Full House";
        if (isFlush) return "Flush";
        if (isStraight) return "Sequência";
        if (Object.values(rankCounts).includes(3)) return "Trinca";
        if (Object.values(rankCounts).filter(count => count === 2).length === 2) return "Dois Pares";
        if (Object.values(rankCounts).includes(2)) return "Par";
        return "Carta Alta";
    }

    static simulateScenarios(playerHand, communityCards, remainingDeck, numOpponents) {
        const opponentHands = [];
        const simulations = 10000;

        let playerWins = 0, opponentWins = 0, draws = 0;

        for (let i = 0; i < simulations; i++) {
            const shuffledDeck = [...remainingDeck].sort(() => Math.random() - 0.5);
            const opponents = [];
            for (let j = 0; j < numOpponents; j++) {
                opponents.push(shuffledDeck.slice(j * 2, j * 2 + 2));
            }
            const opponentBestHands = opponents.map(hand => PokerProbability.evaluateHand([...hand, ...communityCards]));
            const playerBestHand = PokerProbability.evaluateHand([...playerHand, ...communityCards]);

            const bestOpponentHand = Math.max(...opponentBestHands);

            if (PokerProbability.compareHands(playerBestHand, bestOpponentHand) > 0) {
                playerWins++;
            } else if (PokerProbability.compareHands(bestOpponentHand, playerBestHand) > 0) {
                opponentWins++;
            } else {
                draws++;
            }
        }

        return {
            playerWinRate: (playerWins / simulations * 100).toFixed(2),
            opponentWinRate: (opponentWins / simulations * 100).toFixed(2),
            drawRate: (draws / simulations * 100).toFixed(2),
        };
    }

    static compareHands(hand1, hand2) {
        const ranking = ["Carta Alta", "Par", "Dois Pares", "Trinca", "Sequência", "Flush", "Full House", "Quadra", "Straight Flush"];
        return ranking.indexOf(hand1) - ranking.indexOf(hand2);
    }
}
