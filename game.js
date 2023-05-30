class Test extends GameScene{
    constructor(){ super('test', "test scene") };

    afterCreate(){
        //let morbing = this.add.sprite(this.w2, this.h2, 'test')
        //morbing.play('morb2');

        let orb = new storyObject(this, 'orb', this.w2, this.h2, false, false, false);
        //orb.play('morb');
        this.add.image(this.w2, this.h2, 'orb');
    }
}



class GameMenu extends MenuScene{
    
}



class MainMenu extends Phaser.Scene{
    
}



class Loader extends Phaser.Scene{
    constructor(){ super('loader', "load scene") };

    preload(){
        this.load.json('sprites', `assets/spritesheets/spritesheets.json`);
    }

    create(){
        this.sprites = this.cache.json.get('sprites');
        let thisjson = this.sprites.sprites;

        this.load.spritesheet('orb', `assets/spritesheets/test.png`,{
            frameWidth: 368,
            frameHeight: 360,
        });

        this.load.spritesheet('chikn', "assets/spritesheets/chikn.png",{
            frameWidth: 1243,
            frameHeight: 1280,
        });

        
        thisjson.forEach((x) => {
            this.load.spritesheet(x.key, x.path,{
                frameWidth: x.frameWidth,
                frameHeight: x.frameHeight,
            });
        });
        
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
    scene: [Loader, Test],
    title: "to be determined",
});