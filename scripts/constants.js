(function (scope) {

    const SIZES = {
        PLAYER: {
            WIDTH: 80,
            HEIGHT: 70,
            SPEED: 3.8,
        },
        BULLET: {
            WIDTH: 20,
            HEIGHT: 30,
            SPEED: -9.3,
            DAMAGE: 50,
        },
        ENEMY: {
            WIDTH: 65,
            HEIGHT: 105,
            SPEED: 0.68,
            HEALTH: 100,
        },
        BOSS: {
            WIDTH: 115,
            HEIGHT: 152,
            TopSPEED: 0.27,
            LeftSPEED: 3.2,
            HEALTH: 550,
            AMPLITUDE: 0.042,
            iteration: 0,
        },

    };

    const KEY_CODES = {
        LEFT: 37,
        RIGHT: 39,
        FIRE: 32,
    };

    scope.SIZES = SIZES;
    scope.KEY_CODES = KEY_CODES;
}(window));