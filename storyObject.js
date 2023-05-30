/*
 this object exists for the sake of making coding easier to read and do
 constructor    : sets parameters
 mouseover      : returns a message to be displayed immediately and a message queued if player stays hovering over it
 onClick        : starts dialogue, if set to true, returns the key if it's a pickable item, and destroys the object, if that is set to true



 IF YOU WANT TO CHANGE THE SPRITE VISUALLY (such as this.spriteName.x or this.spriteName.setDepth(x))
 YOU MUST DO "this.storyObjectName.render.x" or "this.storyObjectName.render.setDepth(x)"
 */
 class storyObject extends Phaser.GameObjects.Sprite{
    isPickable;
    hasDialogue;
    disappearsOnInteraction;
    key;
    parentScene;
    render



    constructor(scene, key, x, y, pickable, dialogue, disappears){
        super(scene, x, y, key);
        
        this.setOrigin(.5);     //automatically sets origin to middle for simplicity
        this.setInteractive();
        this.isPickable = pickable;
        this.hasDialogue = dialogue;
        this.disappearsOnInteraction = disappears;
        this.parentScene = scene;
        this.render = this.parentScene.add.sprite(x, y, key);
        this.key = key;
        
        this.on('pointerover', () => { this.mouseover(); });
        this.on('pointerdown', () => { this.onClick(); });
        this.on('pointerout', () => { this.parentScene.clearMessage(); });
    }



    mouseover(){
        console.log("mouseover");
        //return the initial message and the long message to the parent scene from the parent scene's jsons
        this.parentScene.showMessage(this.parentScene.mouseover[this.key].text);
        this.parentScene.queueMessage(this.parentScene.mouseover[this.key].longtext);
    }



    onClick(){
        console.log("clicked");
        if(this.hasDialogue){
            //call parent scene functions
        }
        if(this.isPickable){
            //add some item to player inventory
        }
        if(this.disappearsOnInteraction){
            this.parentScene.clearMessage();
            this.render.destroy();
            this.destroy();
        }
    }
}



class testobj extends Phaser.GameObjects.Sprite{
    constructor(scene, key, x, y){
        super(scene, x, y, key);
    }
}