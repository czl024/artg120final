class Test extends GameScene{
    constructor(){ super('test', "test scene") };

    afterCreate(){
        let orb = new storyObject(this, 'orb', 3 * this.w2 / 2, this.h2, false, true, false);
        orb.render.play('morb2');
        orb.render.setDepth(99);
        orb.addDialogue([], ["talked to orb"], [], [], "intro");
        orb.addDialogue(["talked to orb"], [], ["chikn"], [], "introC");
        orb.addDialogue(["talked to orb"], [], [], [], "introZ");

        if(!this.hasItem("chikn")){
            let chikn = new storyObject(this, "chikn", this.w2, this.h2, true, false, true, false);
            chikn.render.setDepth(0);
        }

        let blount = new storyObject(this, 'blount', 100, 100, false, false, false, true);
        blount.setDoor('test2');
    }
}



class Test2 extends GameScene{
    constructor(){ super('test2', "test scene2") };

    afterCreate(){
        let someText = this.add.text(this.w2, this.h2, "this is scene 2");
        someText.setInteractive();
        someText.on('pointerdown', () =>{
            this.goToScene('test');
        })
    }
}



class GameMenu extends MenuScene{
    
}



class MainMenu extends Phaser.Scene{
    
}



class Loader extends Phaser.Scene{
    constructor(){ super('loader', "load scene") };

    preload(){
        this.load.spritesheet('orb', `assets/spritesheets/orb.png`,{
            frameWidth: 368,
            frameHeight: 360,
            endFrame: 1
        });

        this.load.spritesheet('chikn', "assets/spritesheets/chikn.jpg",{
            frameWidth: 1243,
            frameHeight: 1280,
        });

        this.load.spritesheet('blount', "assets/spritesheets/420.jpg",{
            frameWidth: 1024,
            frameHeight: 1280,
        });
    }

    create(){
        this.scene.start('test');
    }
}



const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    //every scene needs to be in here, so dont forget
    scene: [Loader, Test, Test2],
    title: "to be determined",
});