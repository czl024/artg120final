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
        this.debug = true;
        //bg
        this.bg = this.add.image(this.w2, this.h2 + 100, 'intro1bg');
        this.bg.setOrigin(.5);
        this.bg.scale = 2.1;

        this.tutText = this.add.text(1000, 540, "", {
            fontFamily: 'bahn',
            fontSize: 50,
            alpha: .6,
            color: '#f0f0f0',
		    align: 'center'
        });
        this.tutText.setOrigin(.5);

        if(!this.hasFlag("intro1 done") && !this.debug){
            this.startDialogue('1', () => {this.tutText.setText("< Click on items to pick them up")});
        }

        if(this.hasItem("Wallet")) this.tutText.setText("");
        else if(this.debug && !this.hasItem("Wallet")) this.tutText.setText("< Click on items to pick them up");

        let wallet = new storyObject(this, 'Wallet', 595, 540, true, true, true, true);
        wallet.setDoor('intro2')
        wallet.addDialogue([], [], [], [], "wallet");
        wallet.scale = 2;
        wallet.render.scale = 2;
    }
}



class Intro2 extends GameScene{
    constructor(){ super('intro2', "grocery store") };

    afterCreate(){
        this.debug = true;
        //bg
        this.bg = this.add.image(this.w2, this.h2, 'intro2bg');
        this.bg.setOrigin(.5);
        this.bg.scale = 1;

        if(this.debug) this.goToScene('intro3');
        else this.startDialogue('int2-1', () => {this.goToScene('intro3')});
    }
}



class Intro3 extends GameScene{
    constructor(){ super('intro3', "outside apartment") };

    afterCreate(){
        //bg
        this.debug = true;
        this.bg = this.add.image(1 * this.width / 9 - 200, 1 * this.height / 10 - 500, 'intro3bg');
        this.bg.setOrigin(.5);
        this.bg.scale = 3;

        if(this.debug) this.goToScene('interro1');
        else this.startDialogue('1', () => { this.goToScene('interro1'); });
    }

    sceneTransition(){
        
    }
}



class Interrogation1 extends GameScene{
    constructor(){ super('interro1', "medbay") };

    afterCreate(){
        this.debug = true;
        if(this.debug) this.goToScene("interro2")
        //bg
        this.bg = this.add.image(this.w2, this.h2, 'interro1bg');
        this.bg.setOrigin(.5);
        this.bg.scale = 4;

        let overlay = this.add.rectangle(this.w2, this.h2, this.width, this.height, '0xF0F0F0');

        this.startDialogue('intro1', () => {
            overlay.destroy();
            let jimmy = new storyObject(this, 'jimmy', 1120, 530, false, true, true, false);
            jimmy.scale = 2.5;
            jimmy.render.scale = 2.5;
            jimmy.addDialogue([], [], [], [], '1');
            let door = new storyObject(this, 'door', 1750, 280, false, false, false, true);
            door.setDoor('interro2', ["talked to jimmy"], [], [], []);
            door.on('pointerover', () => {
                door.playAnim('open');
            })
            door.on('pointerout', () => {
                door.playAnim('closed');
            })
        });
    }

    sceneTransition(){
        
    }
}



class Interrogation2 extends GameScene{
    constructor(){ super('interro2', "brig") };

    afterCreate(){
        this.debug = true;
        if(this.debug) this.goToScene('interro3');
        //bg
        this.bg = this.add.image(this.w2, this.h2, 'interro2bg');
        this.bg.setOrigin(.5);
        this.bg.scale = 4;

        let thaliak = new storyObject(this, 'thaliak', this.w2, this.h2 + 80, false, true, true, false);
        thaliak.scale = 2.5;
        thaliak.render.scale = 2.5;
        thaliak.addDialogue([], [], [], [], 'interrogation1')
        thaliak.setDepth(2);
        thaliak.render.setDepth(1);

        let door = new storyObject(this, 'door', this.w2, 300, false, false, false, true);
        door.setDoor('interro3', ["interrogated"], [], [], []);
        door.on('pointerover', () => {
            door.playAnim('open');
        })
        door.on('pointerout', () => {
            door.playAnim('closed');
        })

        this.startDialogue('1', () => {})
    }

    sceneTransition(){
        
    }
}



class Interrogation3 extends GameScene{
    constructor(){ super('interro3', "bridge") };

    afterCreate(){
        this.debug = true;
        if(this.debug) this.goToScene('hub');
        //bg
        this.bg = this.add.image(this.w2, this.h2, 'interro3bg');
        this.bg.setOrigin(.5);
        this.bg.scale = 4;

        let thaliak = new storyObject(this, 'thaliak', this.w2, this.h2, false, true, false, true);
        thaliak.scale = 2.5;
        thaliak.render.scale = 2.5;
        thaliak.addDialogue(["talked to thaliak"], [], [], [], 'leave1');
        thaliak.addDialogue([], [], [], [], '1');
        thaliak.setDoor('hub', ["confirmed thaliak"], [], [], []);
    }

    sceneTransition(){
        
    }
}




class Sagittarius extends GameScene{
    constructor(){ super('hub', "sagittarius hub") };

    afterCreate(){
        this.debug = true;
        if(this.debug) this.goToScene('argus')
        //bg
        this.bg = this.add.image(this.w2, this.h2, 'hubbg');
        this.bg.setOrigin(.5);
        this.bg.scale = 4;

        let door = new storyObject(this, 'hubdoor', this.width, this.height, false, false, false, true);
        door.setOrigin(1)
        door.render.setOrigin(1);
        door.scale = 4;
        door.render.scale = 4;
        door.setDoor('cafe');

        //this.startDialogue("intro1", () => {});
        if(this.hasFlag("coffee bought") || this.debug){
            let jimmy = new storyObject(this, 'jimmy', 280, 900, false, true, false, true);
            jimmy.setDepth(2);
            jimmy.render.setDepth(1);
            jimmy.scale = 2.5;
            jimmy.render.scale = 2.5;
            jimmy.addDialogue(["ready to leave"], [], [], [], 'leaveconfirmation');
            jimmy.addDialogue([], [], [], [], 'leave1');
            jimmy.setDoor('argus', ["leaving"], [], [], []);
        }
    }

    sceneTransition(){
        
    }
}



class SagittariusCafe extends GameScene{
    constructor(){ super('cafe', "sagittarius coffee shop") };

    afterCreate(){
        //bg
        this.bg = this.add.image(this.w2, this.h2, 'cafebg');
        this.bg.setOrigin(.5);
        this.bg.scale = 4;

        if(!this.hasFlag("coffee bought")) {
            let jimmy = new storyObject(this, 'jimmy', this.w2, this.height / 3, false, true, true, false);
            jimmy.addDialogue([], [], [], [], 'intro1');
            jimmy.scale = 1.5;
            jimmy.render.scale = 1.5;
        }

        let text = this.add.text(this.width / 3, 4 * this.height / 5, "Return to the hub.", {
            fontFamily: 'bahn',
            fontSize: 75,
		    color: '#F0F0F0',
		    align: 'center'
        })
        text.setOrigin(.5);
        text.setInteractive();
        text.on('pointerover', () => { text.alpha = .8 })
        text.on('pointerout', () => { text.alpha = 1 })
        text.on('pointerdown', () => { this.goToScene('hub') });
    }

    sceneTransition(){
        
    }
}



class Argus extends GameScene{
    constructor(){ super('argus', "internal astronomy location") };

    afterCreate(){
        this.debug = true;
        //bg
        this.bg = this.add.image(this.w2, this.h2, 'argusbg');
        this.bg.setOrigin(.5);
        this.bg.scale = 4;

        let door = new storyObject(this, 'argusdoor', 665, 350, false, false, false, true);
        door.setDoor('argusoffice', [], ["argus head met"], [], []);
        door.setDepth(2);
        door.render.setDepth(1);
        door.scale = 4;
        door.render.scale = 4;

        if(!this.hasFlag('argus visited')) this.startDialogue('intro1', () => {});

        let jimmy = new storyObject(this, 'jimmy', this.w2 - 5, this.h2 - 15, false, true, false, false);
        jimmy.addDialogue([], [], [], [], 'jimmy1');
        jimmy.angle = -10;
        jimmy.render.angle = -10;
    }

    sceneTransition(){
        
    }
}



class ArgusOffice extends GameScene{
    constructor(){ super('argusoffice', "internal astronomy office") };

    afterCreate(){
        //bg
        this.bg = this.add.image(this.w2, this.h2, 'argusofficebg');
        this.bg.setOrigin(.5);
        this.bg.scale = 4;
    }

    sceneTransition(){
        
    }
}



class Dianmu extends GameScene{
    constructor(){ super('dianmu', "it location") };

    afterCreate(){
        //bg
        this.bg = this.add.image(this.w2, this.h2, 'dianmubg');
        this.bg.setOrigin(.5);
        this.bg.scale = 4;
    }

    sceneTransition(){
        
    }
}



class DianmuOffice extends GameScene{
    constructor(){ super('dianmuoffice', "it office") };

    afterCreate(){
        //bg
        this.bg = this.add.image(this.w2, this.h2, 'dianmuofficebg');
        this.bg.setOrigin(.5);
        this.bg.scale = 4;
    }

    sceneTransition(){
        
    }
}



class Ikeithea extends GameScene{
    constructor(){ super('ikeithea', "preftl planet") };

    afterCreate(){
        //bg
        this.bg = this.add.image(this.w2, this.h2, 'ikeithea');
        this.bg.setOrigin(.5);
        this.bg.scale = 4;
    }

    sceneTransition(){
        
    }
}



class IkeitheaOffice extends GameScene{
    constructor(){ super('ikeitheaoffice', "preftl office") };

    afterCreate(){
        //bg
        this.bg = this.add.image(this.w2, this.h2, 'ikeithea');
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

        //title text
        this.add.text(this.w2, this.h2 / 2, "Wireless Discordance", {
            fontFamily: 'bahn',
            fontSize: 175,
            color: '#F0F0F0',
            align: 'center'
        }).setOrigin(.5)

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

        let bgPath = "assets/backgrounds"
        let spPath = "assets/spritesheets"
        //basic images
        this.load.image('menu', `${spPath}/menutab.png`);
        this.load.image('mmbg', `${bgPath}/TitleScreen.png`);
        this.load.image('intro1bg', `${bgPath}/intro1.png`);
        this.load.image('intro2bg', `${bgPath}/intro2.png`);
        this.load.image('intro3bg', `${bgPath}/intro3.png`);
        this.load.image('interro1bg', `${bgPath}/interrogation1.png`);
        this.load.image('interro2bg', `${bgPath}/interrogation2.png`);
        this.load.image('interro3bg', `${bgPath}/interrogation3.png`);
        this.load.image('hubbg', `${bgPath}/SagittariusGalacticHub.png`);
        this.load.image('cafebg', `${bgPath}/SagittariusCoffeeShop.png`);
        this.load.image('argusbg', `${bgPath}/StationOrbitingBrownDwarf.png`);
        this.load.image('argusofficebg', `${bgPath}/InternalAstronomyOffice.png`);
        this.load.image('dianmubg', `${bgPath}/FrozenPlanet.png`);
        this.load.image('dianmuofficebg', `${bgPath}/InternalAstronomyOffice.png`);
        this.load.image('ikeitheabg', `${bgPath}/UnderwaterCity.png`);
        this.load.image('ikeitheaofficebg', `${bgPath}/PreLightspeedManagementOffice.png`);

        //spritesheets for animations
        this.load.spritesheet('orb', `${spPath}/orb.png`,{
            frameWidth: 368,
            frameHeight: 360,
            endFrame: 1
        });

        this.load.spritesheet('chikn', `${spPath}/chikn.jpg`,{
            frameWidth: 1243,
            frameHeight: 1280,
        });

        this.load.spritesheet('blount', `${spPath}/420.jpg`,{
            frameWidth: 1024,
            frameHeight: 1280,
        });

        this.load.spritesheet('Wallet', `${spPath}/Wallet.png`,{
            frameWidth: 50,
            frameHeight: 50,
        });

        this.load.spritesheet('jimmy', `${spPath}/JimmySpritesheet.png`,{
            frameWidth: 120,
            frameHeight: 160,
        });

        this.load.spritesheet('thaliak', `${spPath}/Thaliak.png`,{
            frameWidth: 120,
            frameHeight: 160,
        });

        this.load.spritesheet('door', `${spPath}/door.png`,{
            frameWidth: 229,
            frameHeight: 381,
        });

        this.load.spritesheet('hubdoor', `${spPath}/hubdoor205x189.png`,{
            frameWidth: 205,
            frameHeight: 189
        });

        this.load.spritesheet('argusdoor', `${spPath}/argusdoor73x109.png`,{
            frameWidth: 73,
            frameHeight: 109
        });
    }
}



const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080,
        zoom: 4,
        pixelArt: true
    },
    //every scene needs to be in here, so dont forget
    scene: [Loader, GameMenu, MainMenu, Test, Test2, Intro1, Intro2, Intro3, Interrogation1, Interrogation2, Interrogation3, Sagittarius, SagittariusCafe, Argus, ArgusOffice, Dianmu, DianmuOffice, Ikeithea, IkeitheaOffice],
    title: "to be determined",
});