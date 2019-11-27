(function (scope) {
    const {SIZES} = scope;

    class GameObjectFactory {
        constructor(width, height) {
            this.bounds = {
                width,
                height,
            }
        }

        createPlayer() {
            const {width, height} = this.bounds;
            const {WIDTH, HEIGHT} = SIZES.PLAYER;
            const left = (width - WIDTH) / 2;
            const top = height - HEIGHT - (HEIGHT / 2);
            const player = {left, top};

            return player;
        }

        createBullet(top, left) {
            const {DAMAGE} = SIZES.BULLET;
            left += (SIZES.PLAYER.WIDTH - SIZES.BULLET.WIDTH) / 2;
            top = top - SIZES.BULLET.WIDTH;
            const bullet = {top, left, DAMAGE};
            return bullet;
        }

        createEnemy(top, left) {
            const {width} = this.bounds;
            const {WIDTH, HEIGHT, HEALTH} = SIZES.ENEMY;
            top = -HEIGHT;
            left = parseInt(Math.random() * (width - WIDTH));
            const enemy = {top, left, HEALTH};
            return enemy;
        }

        creatBossObject() {
            const {width} = this.bounds;
            const {WIDTH, HEIGHT, HEALTH, iteration} = SIZES.BOSS;
            const left = (width - WIDTH) / 2;
            const top = -HEIGHT;
            const boss = {top, left, HEALTH, iteration};
            return boss;
        }
    }

    scope.GameObjectFactory = GameObjectFactory;
}(window));