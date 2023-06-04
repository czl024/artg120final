class Test extends GameScene{
    constructor(){ super('test', "test scene") };

    afterCreate(){
        /*
         this is how you make a new object
                                            horizontal position        is an item
                                                  -----v-----              v  disappears when clicked
                                the name of the object     vertical position            v
                                         -v-                      --v--    has dialogue
                                                                                 v
                                                                                   is a door to another scene
                                                                                               v
         */
        let orb = new storyObject(this, 'orb', 3 * this.w2 / 2, this.h2, false, true, false, false);
        orb.render.play('morb2');   //to play an animation
        orb.render.setDepth(10);    //to make this object appear in front of stuff
        orb.addDialogue([], ["talked to orb"], [], [], "intro"); //if you have no idea what this is, read the readme for editors
        orb.addDialogue(["talked to orb"], [], ["chikn"], [], "introC");
        orb.addDialogue(["talked to orb"], [], [], [], "introZ");

        if(!this.hasItem("chikn")){
            let chikn = new storyObject(this, "chikn", this.w2, this.h2, true, false, true, false);
            chikn.setDepth(0);
            chikn.render.setDepth(0);
            chikn.scale = .75;          //changes the hitbox size
            chikn.render.scale = .75;   //changes the image size
        }

        let blount = new storyObject(this, 'blount', 400, this.h2, false, false, false, true);
        blount.setDoor('test2');    //sets the scene this door leads to
        blount.scale = .5;
        blount.render.scale = .5;

        this.startDialogue('test', () => {console.log("sex")});
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
        //bg
        //this.debug = true;
        this.bg = this.add.image(this.w2, this.h2, 'intro1bg');
        this.bg.setOrigin(.5);
        this.bg.scale = 4;
        this.tutText = this.add.text(890, 880, "", {
            fontFamily: 'bahn',
            fontSize: 50,
            alpha: .6,
            color: '#f0f0f0',
		    align: 'center'
        });
        this.tutText.setOrigin(.5);

        if(!this.hasFlag("intro1 done") && !this.debug){
            this.startDialogue('1', () => {this.tutText.setText("^ Click on items to pick them up")});
        }

        if(this.hasItem("Wallet")) this.tutText.setText("");
        else if(this.debug && !this.hasItem("Wallet")) this.tutText.setText("^ Click on items to pick them up");

        let wallet = new storyObject(this, 'Wallet', 550, 785, true, true, true, true);
        wallet.setDoor('intro2')
        wallet.addDialogue([], [], [], [], "wallet");
        wallet.scale = 2;
        wallet.render.scale = 2;
    }

    sceneTransition(){

    }
}



class Intro2 extends GameScene{
    constructor(){ super('intro2', "grocery store") };

    afterCreate(){
        //this.debug = true;
        //bg
        this.bg = this.add.image(this.w2, this.h2, 'intro2bg');
        this.bg.setOrigin(.5);
        this.bg.scale = 4;

        if(this.debug) this.goToScene('intro3');
        else this.startDialogue('int2-1', () => {this.goToScene('intro3')});
    }

    sceneTransition(){
        
    }
}



class Intro3 extends GameScene{
    constructor(){ super('intro3', "outside apartment") };

    afterCreate(){
        //bg
        //this.debug = true;
        this.bg = this.add.image(this.w2, this.h2, 'intro3bg');
        this.bg.setOrigin(.5);
        this.bg.scale = 4;

        if(this.debug) this.goToScene('interro1');
        else this.startDialogue('1', () => { this.goToScene('interro1'); });
    }

    sceneTransition(){
        
    }
}



class Interrogation1 extends GameScene{
    constructor(){ super('interro1', "medbay") };

    afterCreate(){
        //bg
        this.bg = this.add.image(this.w2, this.h2, 'interro1bg');
        this.bg.setOrigin(.5);
        this.bg.scale = 4;
    }

    sceneTransition(){
        
    }
}



class Interrogation2 extends GameScene{
    constructor(){ super('interro2', "brig") };

    afterCreate(){
        //bg
        this.bg = this.add.image(this.w2, this.h2, 'interro2bg');
        this.bg.setOrigin(.5);
        this.bg.scale = 4;
    }

    sceneTransition(){
        
    }
}



class Interrogation3 extends GameScene{
    constructor(){ super('interro3', "bridge") };

    afterCreate(){
        //bg
        this.bg = this.add.image(this.w2, this.h2, 'interro3bg');
        this.bg.setOrigin(.5);
        this.bg.scale = 4;
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



//this is all that needs to be done for this scene, no touchy
class GameMenu extends MenuScene{ constructor(){ super('ingamemenu', "in-game menu") }; }



class MainMenu extends Phaser.Scene{
    constructor(){ super('mainmenu', "pre-game menu") };

    init(){
        this.width = this.game.config.width;    //width of the game
        this.w2 = this.width / 2;
        this.height = this.game.config.height;  //height of the game
        this.h2 = this.height / 2;
    }

    create(){
        this.debug = false;
        //bg
        this.bg = this.add.image(this.w2, this.h2, 'mmbg');
        this.bg.setOrigin(.5);
        this.bg.scale = 4;

        //start game button
        this.button = this.add.rectangle(this.w2, 3 * (this.height / 4), 300, 75, '0xa73db3');
        this.button.setInteractive();
        this.button.setOrigin(.5);
        this.button.on('pointerover', () => {
            this.button.fillColor = 0xb84ec4;
        })
        this.button.on('pointerout', () => {
            this.button.fillColor = 0xa73db3;
        })
        this.button.on('pointerdown', () => {
            this.scene.start('intro1');
        })
        this.buttonText = this.add.text(this.w2, 3 * (this.height / 4), 'Start Game', {
            fontFamily: 'bahn',
            fontSize: 50,
            color: '#F0F0F0',
            align: 'center'
        });
        this.buttonText.setOrigin(.5);

        //test scene button
        if(this.debug){
            this.testButton = this.button = this.add.rectangle(this.w2, 3 * (this.height / 4) + 100, 300, 75, '0xa73db3');
            this.testButton.setInteractive();
            this.testButton.on('pointerdown', () => {
                this.scene.start('test');
            })
        }
    }
}



class Loader extends Phaser.Scene{
    constructor(){ super('loader', "load scene") };

    preload(){
        //lets people know the game is being loaded
        this.load.on('progress', (value) => {
            this.progText = this.add.text(this.game.config.width / 2, this.game.config.height / 2, `Loading...${value}`, {
                fontFamily: 'bahn',
                fontSize: 100,
                color: '#F0F0F0',
                align: 'center'
            }).setOrigin(.5);
            this.progText.destroy();
        });
        this.load.on('complete', () => {
            this.scene.start('mainmenu');
        })

        //basic images
        this.load.image('menu', `assets/spritesheets/menutab.png`);
        this.load.image('mmbg', `assets/backgrounds/TitleScreen.png`);
        this.load.image('intro1bg', `assets/backgrounds/intro1.png`);
        this.load.image('intro2bg', `assets/backgrounds/intro2.png`);
        this.load.image('intro3bg', `assets/backgrounds/intro3.png`);
        this.load.image('interro1bg', `assets/backgrounds/interrogation1.png`);
        this.load.image('interro2bg', `assets/backgrounds/interrogation2.png`);
        this.load.image('interro3bg', `assets/backgrounds/interrogation3.png`);

        //spritesheets for animations
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

        this.load.spritesheet('Wallet', "assets/spritesheets/Wallet.png",{
            frameWidth: 50,
            frameHeight: 50,
        });
    }
}



const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080,
        pixelArt: true
    },
    //every scene needs to be in here, so dont forget
    scene: [Loader, GameMenu, MainMenu, Test, Test2, Intro1, Intro2, Intro3, Interrogation1, Interrogation2, Interrogation3, Sagittarius, SagittariusCafe],
    title: "to be determined",
});