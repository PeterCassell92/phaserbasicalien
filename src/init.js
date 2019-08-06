var screenwidth = 1400;
var screenheight = 900;

const config = {
    width: screenwidth,
    height: screenheight,
    parent: "container",
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}
var gameOver;
var player;
var game = new Phaser.Game(config);


function preload(){
    this.load.multiatlas('alien', '/assets/alien.json', 'assets');
    this.load.image('blueblock', '/assets/blueblock.png');
    this.load.image('pinkblock', '/assets/pinkblock.png');
    this.load.image('portal', '/assets/portal.png');
    //console.log("PRELOAD");
}

function create(){
    //keyboard input
    cursors = this.input.keyboard.createCursorKeys();
    
    //platforms
    platforms = this.physics.add.staticGroup();
    platforms.create(750, 400, 'blueblock').refreshBody();
    platforms.create(250, 220, 'blueblock').setScale(0.4,0.4).refreshBody();
    platforms.create(442, 220, 'pinkblock').setScale(0.4,0.4).refreshBody();
    platforms.create(634, 220, 'pinkblock').setScale(0.4,0.4).refreshBody();
    platforms.create(670, -120, 'pinkblock').setScale(0.4,0.4).refreshBody();
    platforms.create(570, 1000, 'pinkblock').setScale(0.4,0.4).refreshBody();
    platforms.create(970, 900, 'pinkblock').setScale(0.4,0.4).refreshBody();
    platforms.create(1170, 860, 'pinkblock').setScale(0.4,0.4).refreshBody();
    platforms.create(1370, 550, 'pinkblock').setScale(0.4,0.4).refreshBody();
    platforms.create(1370, 420, 'pinkblock').setScale(0.4,0.4).refreshBody();

    //portal
    portal = this.physics.add.sprite(1270, -400, 'portal');

    //player (alien)
    
    player = this.physics.add.sprite(200, 400, 'alien', 'walk_0001.png');
    player.setScale(0.3, 0.3);
    player.setBounce(0);
    
    //player collision / overlap physics
    this.physics.add.collider(player, platforms, stickToPlatform, null, this);
    this.physics.add.overlap(player,portal,reachPortal,null,this);
    
    
    //player anims
    var walkframes = this.anims.generateFrameNames('alien', {
        start: 1, end: 4, zeroPad: 4,
        prefix: 'walk_', suffix: '.png'
    });
    this.anims.create({ key: 'walk', frames: walkframes, frameRate: 10, repeat: -1 });

    var jumpframes = this.anims.generateFrameNames('alien', {
        start: 1, end: 4, zeroPad: 4,
        prefix: 'jump_', suffix: '.png'
    });
    this.anims.create({ key: 'jump', frames: jumpframes, frameRate: 10, repeat: -1 });

    //start player
    player.setVelocityX(200);
    player.anims.play('walk', true);

    //camera
    this.cameras.main.setSize(screenwidth/2, screenheight);
    this.cameras.main.startFollow(player);
}

function update(time, delta){
    console.log(!player.body.touching.none);
    if (gameOver)
    {
        return;
    }

    if (cursors.left.isDown && (player.body.touching.down || player.body.touching.up || player.body.touching.right))
    {
        player.setVelocityX(-300);
        player.setVelocityY(0);

        player.anims.play('walk', true);
    }
    else if (cursors.right.isDown &&(player.body.touching.down || player.body.touching.left || player.body.touching.up))
    {
        player.setVelocityX(300);
        player.setVelocityY(0);

        player.anims.play('walk', true);
    }

    if (cursors.up.isDown && (player.body.touching.down || player.body.touching.left || player.body.touching.right))
    {
        player.anims.play('jump');
        player.setVelocityY(-330);
        player.setVelocityX(0);
    }

    if (cursors.down.isDown && (player.body.touching.up|| player.body.touching.left || player.body.touching.right))
    {
        player.setVelocityY(330);
        player.setVelocityX(0);
    }

}

function stickToPlatform(){
    if (player.body.touching.down){
        player.setVelocityY(20);
        player.setVelocityX(0);
    }
    if (player.body.touching.left){
        player.setVelocityY(0);
        player.setVelocityX(-20);
    }
    if (player.body.touching.up){
        player.setVelocityY(-20);
        player.setVelocityX(0);
    }
    if (player.body.touching.right){
        player.setVelocityY(0);
        player.setVelocityX(20);
    }
}

function reachPortal(){
    console.log("PORTAL OVERLAP");
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
}