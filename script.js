
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('phaser', 'Untitled.png');
    game.load.image('bullet', 'coco.png');
    game.load.spritesheet('veggies', 'ultrafastparrot.gif', 32, 32);
    game.load.spritesheet('skill','prideparrot.gif', 32, 32);

}

var sprite;
var bullets;
var veggies;
var skill;
var cursors;
var qntAlvos = 20;
var contador = 0;
var bool = true;

var bulletTime = 0;
var bullet;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    //  This will check Group vs. Group collision (bullets vs. veggies!)

    criarJogo();

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 20; i++)
    {
        var b = bullets.create(0, 0, 'bullet');
        b.name = 'bullet' + i;
        b.exists = false;
        b.visible = false;
        b.checkWorldBounds = true;
        b.events.onOutOfBounds.add(resetBullet, this);
    }

    sprite = game.add.sprite(400, 500, 'phaser');
    game.physics.enable(sprite, Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

}

function criarJogo(){
  skill = game.add.group();
  skill.enableBody = true;
  skill.physicsBodyType = Phaser.Physics.ARCADE;

  veggies = game.add.group();
  veggies.enableBody = true;
  veggies.physicsBodyType = Phaser.Physics.ARCADE;

  var d = skill.create(game.world.randomX, Math.random() * 500, 'skill', game.rnd.integerInRange(0, 36));
  d.name = 'skillPiercing';
  d.body.imovable = true;

  for (var i = 0; i < qntAlvos; i++)
  {
      var c = veggies.create(game.world.randomX, Math.random() * 500, 'veggies', game.rnd.integerInRange(0, 36));
      c.name = 'veg' + i;
      c.body.immovable = true;
  }
}

function update() {

    //  As we don't need to exchange any velocities or motion we can the 'overlap' check instead of 'collide'
    game.physics.arcade.overlap(bullets, veggies, collisionHandler, null, this);
    game.physics.arcade.overlap(bullets, skill, collisionHandler2, null, this);

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x = -300;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.velocity.x = 300;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        fireBullet();
    }

}

function fireBullet () {

    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(sprite.x + 35, sprite.y - 8);
            bullet.body.velocity.y = -300;
            bulletTime = game.time.now + 150;
        }
    }

}

//  Called if the bullet goes out of the screen
function resetBullet (bullet) {

    bullet.kill();

}

//  Called if the bullet hits one of the veg sprites
function collisionHandler (bullet, veg) {

    if(bool){
      bullet.kill();
    }
    veg.kill();
    contador++;
    if(contador == qntAlvos){
      alert("Você venceu! Clique em ok para começar novamente.")
      contador = 0;
      criarJogo();
      bool = true;
    }

}

function collisionHandler2 (bullet, skill) {

    bullet.kill();
    skill.kill();
    bool = false;

}
