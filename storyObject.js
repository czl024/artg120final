/*
 this object exists for the sake of making coding easier to read and do
 constructor    : sets parameters
 pushAnimation  : stores the animation into the object for quick calling later
 playAnimation  : plays the animation, assuming it's in the object
 mouseover      : returns a message to be displayed immediately and a message queued if player stays hovering over it
 mouseout       : returns a message to the parent scene indicating the pointer is no longer over the object
 onClick        : starts dialogue, if set to true, returns the key if it's a pickable item, and destroys the object, if that is set to true
 */
 class storyObject extends Phaser.GameObjects.Sprite{
    isPickable;
    hasDialogue;
    disappearsOnInteraction;
    key;
    parentScene;



    constructor(scene, key, x, y, pickable, dialogue, disappears){
        super(scene, x, y, key);
        this.setOrigin(.5);     //automatically sets origin to middle for simplicity
        this.setInteractive();
        this.isPickable = pickable;
        this.hasDialogue = dialogue;
        this.disappearsOnInteraction = disappears;
        this.parentScene = scene;
        this.key = key;
        
        this.on('pointerover', () => { this.mouseover() });
        this.on('pointerdown', () => { this.onClick() });
        this.on('pointerout', () => { this.parentScene.queueMessage("") });
    }



    mouseover(){
        console.log("mouseover");
        //return the initial message and the long message to the parent scene from the parent scene's jsons
        //this.parentScene.queueMessage("test");
    }



    onClick(){
        console.log("clicked");/*
        if(this.hasDialogue){
            //call parent scene functions
        }
        if(this.isPickable){

        }*/
        //if(this.disappearsOnInteraction) this.destroy();
    }
}