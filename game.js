class Test extends GameScene{
    constructor(){ super('test', "test scene") };

    afterCreate(){
        let key = 'orb';
        let morbing = this.add.sprite(this.w2 / 2, this.h2, key);
        morbing.play('morb2');

        let orb = new storyObject(this, key, 3 * this.w2 / 2, this.h2, false, false, true);
        orb.render.play('morb2');
        orb.render.setDepth(99);

        let chikn = new storyObject(this, "chikn", this.w2, this.h2, false, false, false);
        chikn.render.setDepth(0);

        let test = new testobj(this, key, this.w2, this.h2);
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
    scene: [Loader, Test],
    title: "to be determined",
});