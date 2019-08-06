var screenwidth = 800;
var screenheight = 600;
//grid unit
var gu = 160;

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
    platforms.create(5*gu, 3*gu, 'blueblock').refreshBody();
    platforms.create(2*gu, 1*gu, 'blueblock').setScale(0.4,0.4).refreshBody();
    platforms.create(3*gu, 1*gu, 'pinkblock').setScale(0.4,0.4).refreshBody();
    platforms.create(4*gu, 1*gu, 'pinkblock').setScale(0.4,0.4).refreshBody();
    platforms.create(1*gu, -3*gu, 'blueblock').setScale(0.4,0.4).refreshBody();
    platforms.create(6*gu, -2*gu, 'blueblockvert').setScale(0.4,0.4).refreshBody();
    platforms.create(5*gu, -1*gu, 'pinkblock').setScale(0.4,0.4).refreshBody();
    platforms.create(4*gu, 7*gu, 'pinkblock').setScale(0.4,0.4).refreshBody();
    platforms.create(8*gu, 6*gu, 'pinkblock').setScale(0.4,0.4).refreshBody();
    platforms.create(9*gu, 6 *gu, 'pinkblock').setScale(0.4,0.4).refreshBody();
    platforms.create(9*gu, 4*gu, 'pinkblock').setScale(0.4,0.4).refreshBody();
    platforms.create(-2*gu, 4*gu, 'pinkblockvert').setScale(0.4,0.4).refreshBody();
    platforms.create(9*gu, 3*gu, 'pinkblockvert').setScale(0.4,0.4).refreshBody();
    platforms.create(2*gu, 5*gu, 'pinkblock').setScale(0.4,0.4).refreshBody();
    platforms.create(1*gu, 5*gu, 'pinkblock').setScale(0.4,0.4).refreshBody();
    platforms.create(0, 4*gu,'blueblockvert').setScale(0.4,0.4).refreshBody();
    platforms.create(-2*gu, 3*gu, 'blueblockvert').setScale(0.4,0.4).refreshBody();
    platforms.create(-4*gu, 5*gu, 'blueblock').setScale(0.4,0.4).refreshBody();
    platforms.create(-3*gu, 5*gu, 'blueblock').setScale(0.4,0.4).refreshBody();
    platforms.create(-4*gu, 2*gu, 'blueblockvert').setScale(0.4,0.4).refreshBody();
    platforms.create(-3*gu, 0, 'blueblockvert').setScale(0.4,0.4).refreshBody();
    platforms.create(-2*gu, 0, 'blueblock').setScale(0.4,0.4).refreshBody();
    platforms.create(-4*gu, -2*gu, 'pinkblockvert').setScale(0.4,0.4).refreshBody();
    platforms.create(4*gu, 2*gu, 'blueblockvert').setScale(0.4,0.4).refreshBody();

    //portal
    portal = this.physics.add.sprite(1270, -400, 'portal');

    //player (alien)
    
    player = this.physics.add.sprite(2*gu, 2*gu, 'alien', 'walk_0001.png');
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
    this.cameras.main.setSize(screenwidth, screenheight);
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
    
    player.setTint(0xff0000);
    this.add.text(1270, -200, "WINNER", { fontFamily: 'Verdana, Tahoma' });
    player.anims.play('turn');
    this.physics.pause();
    gameOver = true;
}