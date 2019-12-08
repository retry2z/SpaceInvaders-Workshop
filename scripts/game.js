(function (scope) {
    const {
        Renderer,
        GameObjectFactory,
        SIZES,
        KEY_CODES,
        CollusionDetector,
    } = scope;

    const setupCanvas = function (gameContainer, width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        gameContainer.appendChild(canvas);
        return canvas;
    };

    const chanceFunction = (chance) => {
        const value = Math.random() * 100;
        return value < chance;
    };

    const eventChecker = {
        checker: () => {
            eventChecker.bossChecker();
        },


        bossChecker: () => {
            if (scope.score > 0 && scope.score < 5) {
                game.bossEvent = true;
            }
        },


        isGoLeftEvent: (event) => event.keyCode === KEY_CODES.LEFT,
        isGoRightEvent: (event) => event.keyCode === KEY_CODES.RIGHT,
        isFireEvent: (event) => event.keyCode === KEY_CODES.FIRE,
    };


    class Game {
        constructor(selector, width, height) {
            this.gameContainer = document.querySelector(selector);
            this.startButton = document.getElementById('game-start');
            this.canvas = setupCanvas(this.gameContainer, width, height);
            this.bounds = {
                width,
                height,
            };
            this.Renderer = new Renderer(this.canvas, this.bounds);
            this.GameObjectFactory = new GameObjectFactory(width, height);
            this.CollusionDetector = new CollusionDetector();
            this.ScoreBoard = new ScoreBoard();

            this.bossEvent = false;
            this.started = false;
            this.playerProfil = false;
            this.bossProfile = false;
            this.bullets = [];
            this.enemies = [];

            this._attachGameEvents();
        }

        // ------------------------------ Handle Movement ------------------------------ // ************************* Move out in new class and file

        _handlePlayerEvent(event) {
            const {SPEED, WIDTH} = SIZES.PLAYER;

            let alpha = 0;
            if (eventChecker.isGoLeftEvent(event)) {
                alpha = -1;
            } else if (eventChecker.isGoRightEvent(event)) {
                alpha = +1;
            }
            this.playerProfil.left += alpha * SPEED;
            this.playerProfil.left = Math.max(this.playerProfil.left, 0);
            this.playerProfil.left = Math.min(this.playerProfil.left, this.bounds.width - WIDTH);
        }

        _handleBossEvent() {
            const {LeftSPEED, TopSPEED, AMPLITUDE, WIDTH} = SIZES.BOSS;
            let angryLevel = 1;
            let Amplitude = AMPLITUDE;

            if (this.bossProfile.HEALTH <= 350) {
                game.bossEvent = false;
                angryLevel = 2.5;
                Amplitude = 0.045;
            }

            let alpha = 0;
            let direction = Math.cos(this.bossProfile.iteration);
            this.bossProfile.iteration += (Amplitude / angryLevel);

            if (direction > 0) {
                alpha = +1;

            } else {
                alpha = -1;
            }

            this.bossProfile.top += TopSPEED / angryLevel;
            this.bossProfile.left += LeftSPEED * alpha * angryLevel;
            this.bossProfile.left = Math.max(this.bossProfile.left, WIDTH);
            this.bossProfile.left = Math.min(this.bossProfile.left, this.bounds.width - (WIDTH * 2));
        }

        _handleEnemyEvent() {
            const {SPEED: enemySpeed, HEIGHT} = SIZES.ENEMY;
            const {height} = this.bounds;

            this.enemies.forEach((enemy) => {
                if (enemy.HEALTH <= 50) {
                    enemy.top -= enemySpeed;
                } else {
                    enemy.top += enemySpeed;
                }
                enemy.isDead = enemy.top >= height || -HEIGHT >= enemy.top; // *********************** move to collusion check
            });
            console.log(this.enemies.length);
        }

        _handleBulletEvent() { // ******************************************* rewrite with template guns Power in CreateBulletProfile
            const {SPEED: bulletSpeed} = SIZES.BULLET;

            this.bullets.forEach((bullet) => {
                bullet.top += bulletSpeed;
                bullet.isDead = bullet.top <= 0; // *********************** move to collusion check
            });
        }


        // ------------------------------ Create / Remove Profiles ------------------------------ // move in game object factory or new class creat Object Profile

        createBossProfile() {
            if (this.bossProfile) {
                return;
            }
            this.bossProfile = this.GameObjectFactory.creatBossObject();
        }

        createPlayerProfile() {
            if (this.playerProfil) {
                return;
            }
            this.playerProfil = this.GameObjectFactory.createPlayer();
        }

        createEnemyProfile(multiply) {
            let count = multiply || 1;

            for (let i = 0; i < count; i++) {
                const enemy = this.GameObjectFactory.createEnemy();
                const currentEnemyIndex = this.enemies.length;
                const lastCreatedEnemy = this.enemies[currentEnemyIndex - 1];

                if (!currentEnemyIndex) {
                    this.enemies.push(enemy);
                } else {
                    const firstCollusionBox = this.CollusionDetector.getCollusionBox(enemy, SIZES.ENEMY);
                    const secondCollusionBox = this.CollusionDetector.getCollusionBox(lastCreatedEnemy, SIZES.ENEMY);
                    if (!this.CollusionDetector.checkCollusion(firstCollusionBox, secondCollusionBox)) {
                        this.enemies.push(enemy);
                    }
                }
            }

        }

        createBulletProfile() {
            if (this.bulletProfil) {
                const {top, left} = this.playerProfil;
                const bullet = this.GameObjectFactory.createBullet(top, left);
                if (this.bullets.length >= 1) {
                    return;
                }
                this.bullets.push(bullet);
                this.bulletProfil = false;
            }
        }

        creatNewGameObjects() {
            if (this.bossEvent) {
                this.createBossProfile();
            } else {
                if (!this.enemies.length) {
                    this.createEnemyProfile(2);
                } else if (chanceFunction(0.75) && !this.bossEvent) {
                    this.createEnemyProfile();
                }
            }

            this.createBulletProfile();
            this.createPlayerProfile();
        }

        checkForCollusion() {
            const {CollusionDetector} = this;
            CollusionDetector._collusionBetweenArray(this.bullets, this.enemies, SIZES.BULLET, SIZES.ENEMY); // *********************** Rewrite

            if (this.bossProfile) {
                this.bullets.forEach(bullet => {
                    const hasCollusion = CollusionDetector._collusionBetweenObjects(bullet, SIZES.BULLET, this.bossProfile, SIZES.BOSS);
                    if (!hasCollusion) {
                        return;
                    }
                    bullet.isDead = true;
                    this.bossProfile.HEALTH -= bullet.DAMAGE;
                });
            }
        }

        // ------------------------------ Game Functions ------------------------------ //

        start() {
            if (this.started) {
                return;
            }
            this.started = true;
            this._gameLoop();
            this.gameContainer.focus();
            this.startButton.blur();
            this.gameContainer.setAttribute('class', 'box view');
            this.startButton.style.display = "none";
        }

        _attachGameEvents() {
            const {isGoLeftEvent, isGoRightEvent, isFireEvent} = eventChecker;

            window.addEventListener('keydown', (ev) => {
                if (isGoLeftEvent(ev) || isGoRightEvent(ev)) {
                    this.playerMovingKey = ev;
                }
                if (isFireEvent(ev)) {
                    this.bulletProfil = true;
                }
            });

            window.addEventListener('keyup', (ev) => {
                if (isGoLeftEvent(ev) || isGoRightEvent(ev)) {
                    this.playerMovingKey = false;
                }
                if (isFireEvent(ev)) {
                    this.bulletProfil = false;
                }
            });
        }

        _renderProfiles() {
            if (this.playerProfil) {
                const {left, top} = this.playerProfil;
                this.Renderer.renderPlayer(left, top);
            }
            if (this.bullets.length) {
                this.Renderer.renderBullets(this.bullets);
            }
            if (this.enemies.length) {
                this.Renderer.renderEnemies(this.enemies);
            }

            if (this.bossProfile) {
                this.Renderer.renderBoss(this.bossProfile);
            }
        }

        _updatePositions() {
            if (this.playerMovingKey) {
                this._handlePlayerEvent(this.playerMovingKey);
            }

            if (this.bossProfile) {
                this._handleBossEvent();
            }

            if (this.bullets.length) {
                this._handleBulletEvent();
            }

            if (this.enemies.length) {
                this._handleEnemyEvent();
            }
        }

        _removeDeadGameObjects() {
            this.bullets = this.bullets.filter(bullet => !bullet.isDead);
            this.enemies = this.enemies.filter(enemy => !enemy.isDead);

            if (this.bossProfile.HEALTH <= 0) {
                this.ScoreBoard.incScore(100);
                this.bossProfile = false;
                this.bossEvent = false;
            }
        }

        _gameLoop() {
            this.Renderer.clear();
            this._renderProfiles();
            this._updatePositions();
            this.creatNewGameObjects();
            this.checkForCollusion();
            this._removeDeadGameObjects();
            eventChecker.checker();

            window.requestAnimationFrame(() => {
                this._gameLoop();
            });
        }
    }

    scope.Game = Game;
    scope.eventChecker = eventChecker;
    scope.score = 0;
})
(window);


