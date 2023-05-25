class Test extends GameScene{
    
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
    scene: [Loader, MainMenu, Hallway, Hydroponics, CargoBay, LifeSupport, EngineRoom, Bridge, OutroNormal, OutroSpecial],
    title: "Space Maintenance",
});