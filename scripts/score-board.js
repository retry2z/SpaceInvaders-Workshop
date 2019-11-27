(function (scope) {

    class ScoreBoard {
        constructor() {
            this.scoreElement = document.getElementById('score');
        }

        incScore(points) {
            scope.score += points;
            this.scoreElement.textContent = scope.score.toString().padStart(4,'0');
        }
    }

    scope.ScoreBoard = ScoreBoard;
}(window));
