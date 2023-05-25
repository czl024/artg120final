class Test extends GameScene{
    
}



class GameMenu extends MenuScene{
    
}



class MainMenu extends Phaser.Scene{
    
}



class Loader extends Phaser.Scene{
    
}



const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    //every scene needs to be in here, so dont forget
    scene: [Loader, MainMenu, ],
    title: "to be determined",
});