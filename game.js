class Test extends GameScene{
    constructor(){ super('test', "test scene") };

    afterCreate(){
        let orb = new storyObject(this, 'orb', 3 * this.w2 / 2, this.h2, false, true, false);
        orb.render.play('morb2');
        orb.render.setDepth(10);
        orb.addDialogue([], ["talked to orb"], [], [], "intro");
        orb.addDialogue(["talked to orb"], [], ["chikn"], [], "introC");
        orb.addDialogue(["talked to orb"], [], [], [], "introZ");

        if(!this.hasItem("chikn")){
            let chikn = new storyObject(this, "chikn", this.w2, this.h2, true, false, true, false);
            chikn.render.setDepth(0);
            chikn.scale = .75;
            chikn.render.scale = .75;
        }

        let blount = new storyObject(this, 'blount', 400, this.h2, false, false, false, true);
        blount.setDoor('test2');
        blount.scale = .5;
        blount.render.scale = .5;
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



class Intro1 extends GameScene{
    constructor(){ super('intro1', "home") };

    afterCreate(){

    }

    sceneTransition(){

    }
}



class Intro2 extends GameScene{
    constructor(){ super('intro2', "grocery store") };

    afterCreate(){

    }

    sceneTransition(){
        
    }
}



class Intro3 extends GameScene{
    constructor(){ super('intro3', "outside apartment") };

    afterCreate(){

    }

    sceneTransition(){
        
    }
}



class Interrogation1 extends GameScene{
    constructor(){ super('intero1', "medbay") };

    afterCreate(){

    }

    sceneTransition(){
        
    }
}



class Interrogation2 extends GameScene{
    constructor(){ super('intero2', "brig") };

    afterCreate(){

    }

    sceneTransition(){
        
    }
}



class Interrogation3 extends GameScene{
    constructor(){ super('intero3', "bridge") };

    afterCreate(){

    }

    sceneTransition(){
        
    }
}



class Outro extends GameScene{
    constructor(){ super('outro', "outro") };

    afterCreate(){

    }

    sceneTransition(){
        
    }
}



class Sagittarius extends GameScene{
    constructor(){ super('hub', "sagittarius hub") };

    afterCreate(){

    }

    sceneTransition(){
        
    }
}



class SagittariusCafe extends GameScene{
    constructor(){ super('hubcafe', "sagittarius coffee shop") };

    afterCreate(){

    }

    sceneTransition(){
        
    }
}



class GameMenu extends MenuScene{
    constructor(){ super('ingamemenu', "in-game menu") };
}



class MainMenu extends Phaser.Scene{
    constructor(){ super('mainmenu', "pre-game menu") };
}



class Loader extends Phaser.Scene{
    constructor(){ super('loader', "load scene") };

    preload(){
        this.load.image('menu', `assets/spritesheets/menutab.png`);
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
    scene: [Loader, GameMenu, MainMenu, Test, Test2, Intro1, Intro2, Intro3, Interrogation1, Interrogation2, Interrogation3, Sagittarius, SagittariusCafe],
    title: "to be determined",
});