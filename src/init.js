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
var cursors;
var keyObj;
var cling= null;
var game = new Phaser.Game(config);


function preload(){
    this.load.multiatlas('alien', '/assets/alien.json', 'assets');
    this.load.image('blueblock', '/assets/blueblock.png');
    this.load.image('pinkblock', '/assets/pinkblock.png');
    this.load.image('blueblockvert', '/assets/blueblockvert.png');
    this.load.image('pinkblockvert', '/assets/pinkblockvert.png');
    this.load.image('portal', '/assets/portal.png');
    //console.log("PRELOAD");
}

function create(){
        
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
    platforms.create(-200, 550, 'pinkblockvert').setScale(0.4,0.4).refreshBody();
    platforms.create(1370, 420, 'pinkblock').setScale(0.4,0.4).refreshBody();
    platforms.create(250,750, 'blueblockvert').setScale(0.4,0.4).refreshBody();
    platforms.create(-350, 420, 'blueblockvert').setScale(0.4,0.4).refreshBody();
    platforms.create(-650, 820, 'blueblockvert').setScale(0.4,0.4).refreshBody();
    platforms.create(-600, 400, 'blueblock').setScale(0.4,0.4).refreshBody();
    platforms.create(-400, 0, 'blueblock').setScale(0.4,0.4).refreshBody();

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
    this.anims.create({ key: 'jump', frames: jumpframes, frameRate: 10, repeat: 0 });

    //start player
    player.setVelocityX(200);
    player.anims.play('walk', true);

    //camera
    this.cameras.main.setSize(screenwidth/2, screenheight);
    this.cameras.main.startFollow(player);

    //keyboard input
    cursors = this.input.keyboard.createCursorKeys();
    keyObj = this.input.keyboard.addKey('SPACE');
}

function update(time, delta){
    console.log(!player.body.touching.none);
    if (gameOver)
    {
        return;
    }
    if (keyObj.isDown){
        this.scene.restart();
    }

    if (cursors.left.isDown && (cling) && cling != 'left')
    {
        player.setVelocityX(-300);
        player.setVelocityY(0);
        cling = null;

        player.anims.play('walk', true);
    }
    else if (cursors.right.isDown &&(cling) && cling != 'right')
    {
        player.setVelocityX(300);
        player.setVelocityY(0);
        cling = null;

        player.anims.play('walk', true);
    }

    if (cursors.up.isDown && (cling) && cling != 'up')
    {
        player.anims.play('jump');
        player.setVelocityY(-330);
        player.setVelocityX(0);
        cling = null;
    }

    if (cursors.down.isDown && (cling) && cling != 'down')
    {
        player.setVelocityY(330);
        player.setVelocityX(0);
        cling = null;
    }

}

function stickToPlatform(){
    if (player.body.touching.down){
        cling = 'down';
    }
    if (player.body.touching.left){
        cling= 'left';
    }
    if (player.body.touching.up){
        cling = 'up';
    }
    if (player.body.touching.right){
        cling = 'right';
    }
}

function reachPortal(){
    console.log("PORTAL OVERLAP");
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
}