const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game",
  physics: {
    default: "arcade",
    arcade: { debug: false }
  },
  scene: { preload, create, update }
};

let player, cursors, monsters, attackKey;
let exp = 0;
let level = 1;

const game = new Phaser.Game(config);

function preload() {
  this.load.image("player", "assets/player.png");
  this.load.image("monster", "assets/monster.png");
  this.load.image("tiles", "assets/tiles.png");
}

function create() {
  // background grid
  for (let x = 0; x < 25; x++) {
    for (let y = 0; y < 19; y++) {
      this.add.image(x * 32, y * 32, "tiles").setOrigin(0);
    }
  }

  player = this.physics.add.sprite(400, 300, "player");
  player.setCollideWorldBounds(true);

  cursors = this.input.keyboard.createCursorKeys();
  attackKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE
  );

  monsters = this.physics.add.group();

  for (let i = 0; i < 5; i++) {
    let m = monsters.create(
      Phaser.Math.Between(50, 750),
      Phaser.Math.Between(50, 550),
      "monster"
    );
    m.setVelocity(
      Phaser.Math.Between(-50, 50),
      Phaser.Math.Between(-50, 50)
    );
    m.setBounce(1);
    m.setCollideWorldBounds(true);
  }

  this.physics.add.overlap(player, monsters, hitMonster, null, this);

  this.levelText = this.add.text(10, 10, "", { fontSize: "18px", fill: "#fff" });
}

function update() {
  player.setVelocity(0);

  const speed = 160;

  if (cursors.left.isDown) player.setVelocityX(-speed);
  if (cursors.right.isDown) player.setVelocityX(speed);
  if (cursors.up.isDown) player.setVelocityY(-speed);
  if (cursors.down.isDown) player.setVelocityY(speed);

  if (Phaser.Input.Keyboard.JustDown(attackKey)) {
    attack();
  }

  this.levelText.setText(`Level: ${level}  EXP: ${exp}/5`);
}

function attack() {
  monsters.children.iterate(monster => {
    if (Phaser.Math.Distance.Between(
        player.x, player.y,
        monster.x, monster.y
      ) < 50) {
      monster.destroy();
      gainExp();
    }
  });
}

function gainExp() {
  exp++;
  if (exp >= 5) {
    level++;
    exp = 0;
  }
}

function hitMonster(player, monster) {
  player.setTint(0xff0000);
  setTimeout(() => player.clearTint(), 200);
}
