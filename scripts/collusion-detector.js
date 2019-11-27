(function (scope) {
    class CollusionDetector {

        constructor() {
            this.scoreBoard = new ScoreBoard();
        }

        checkCollusion(x, y) {
            const hasHorizontalCollision =
                (x.left <= y.left && y.left <= x.right) ||
                (x.left <= y.right && y.right <= x.right) ||
                (y.left <= x.left && x.left <= y.right) ||
                (y.left <= x.right && x.right <= y.right);

            const hasVerticalCollision =
                (x.top <= y.top && y.top <= x.bottom) ||
                (x.top <= y.bottom && y.bottom <= x.bottom) ||
                (y.top <= x.top && x.top <= y.bottom) ||
                (y.top <= x.bottom && x.bottom <= y.bottom);

            return hasHorizontalCollision && hasVerticalCollision;
        }

        getCollusionBox = (position, bounds) => {
            const {left, top} = position;
            const {WIDTH, HEIGHT} = bounds;
            return {
                left,
                right: left + WIDTH,
                top,
                bottom: top + HEIGHT,
            };
        };

        _collusionBetweenArray(firstObject, secondObject, firstObjectSIZES, secondObjectSIZES) {
            firstObject.forEach(firstObjectElements => {
                const firstCollusionBox = this.getCollusionBox(firstObjectElements, firstObjectSIZES);
                secondObject.forEach(secondObjectElements => {
                    if (secondObjectElements.isDead || firstObjectElements.isDead) {
                        return;
                    }
                    const secondCollusionBox = this.getCollusionBox(secondObjectElements, secondObjectSIZES);
                    if (this.checkCollusion(firstCollusionBox, secondCollusionBox)) {
                        secondObjectElements.HEALTH -= firstObjectElements.DAMAGE;
                        if (secondObjectElements.HEALTH) {
                            firstObjectElements.isDead = true;
                            return;
                        }
                        this.scoreBoard.incScore(1);
                        firstObjectElements.isDead = true;
                        secondObjectElements.isDead = true;
                    }
                });
            });
        }


        _collusionBetweenObjects(fistObject, firstObjectSIZES, secondObject, secondObjectSIZES) {
            if (secondObject.isDead || fistObject.isDead) {
                return;
            }
            const firstCollusionBox = this.getCollusionBox(fistObject, firstObjectSIZES);
            const secondCollusionBox = this.getCollusionBox(secondObject, secondObjectSIZES);
            const resultCollusion = this.checkCollusion(firstCollusionBox, secondCollusionBox);

            return resultCollusion;
        }
    }

    scope.CollusionDetector = CollusionDetector;
}(window));