(function (scope) {
    const {SIZES} = scope;

    class Renderer {

        constructor(canvas, bounds) {
            this.ctx = canvas.getContext('2d');
            this.bounds = bounds;

            this.preLoadImage('bossImage', './images/bossProfile.png');
            this.preLoadImage('playerImage', './images/playerProfile.png');
            this.preLoadImage('bulletImage', './images/bulletProfile.png');
            this.preLoadImage('enemyImage', './images/enemyProfile.png');
        }

        preLoadImage(propName, src) {
            const image = new Image();
            image.src = src;
            image.onload = () => {
                this[propName] = image;
            };
        }

        clear() {
            const {ctx} = this;
            const {width, height} = this.bounds;
            ctx.clearRect(0, 0, width, height);
        }

        renderBoss(boss) {
            const {ctx} = this;
            const {WIDTH, HEIGHT} = SIZES.BOSS;
            const {left, top} = boss;
            if (this.bossImage) {
                ctx.drawImage(this.bossImage, left, top, WIDTH, HEIGHT);
            }
        }

        renderPlayer(left, top) {
            const {ctx} = this;
            const {WIDTH, HEIGHT} = SIZES.PLAYER;
            if (this.playerImage) {
                ctx.drawImage(this.playerImage, left, top, WIDTH, HEIGHT);
            }
        }

        renderBullets(bullets) {
            bullets.forEach((bullet) => {
                this.renderBullet(bullet);
            });
        }

        renderBullet(bullet) {
            const {ctx} = this;
            const {WIDTH, HEIGHT} = SIZES.BULLET;
            if (this.bulletImage) {
                ctx.drawImage(this.bulletImage, bullet.left, bullet.top, WIDTH, HEIGHT);
            }

        }

        renderEnemies(enemies) {
            enemies.forEach(enemy => {
                this.renderEnemy(enemy);
            });
        }

        renderEnemy(enemy) {
            const {ctx} = this;
            const {WIDTH, HEIGHT} = SIZES.ENEMY;
            const {left, top} = enemy;
            if (this.playerImage) {
                ctx.drawImage(this.enemyImage, left, top, WIDTH, HEIGHT);
            }
        }

    }

    scope.Renderer = Renderer;
}(window));