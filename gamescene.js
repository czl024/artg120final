/*
 phaser functions
 constructor        : the very first function, establishes fundamental scene data
 init               : this will establish any scene-to-scene variable
        will also add some objects that persist in every scene, namely the menu stuff
 preload            : this will load the respective json files for dialogue and mouseover
        BOTH JSONS SHOULD BE NAMED AS SUCH : thisSceneName_dia.json AND thisSceneName_mo.json
 update             : this will handle the description boxes
 create             : does the final setup necessary to do shit

 functions 
 afterCreate        : for all intents and purposes, this is the same as create() in phaser
 createAnimations   : a function that produces animations from a json, trust me, you want this function to exist
 goToScene          : goes to the scene of a specific key, like phaser's but in a wrapper function
 defaultTransition  : default scene transition
    subclasses that need its own transition need to implement "sceneTransition()"
 dialogue           : this will start a dialogue interaction
 showMenu, hideMenu : does what you think it does
 */
class GameScene extends Phaser.Scene{
    sceneName;      //scene name, used for calling json files
    items;          //inventory
    flags;          //story flags, invisible to player
    relationships;  //we'll see if we even implement this
    queuedMessage;  //after hovering over something for long enough, the message to show in a descriptive text box
    descBox;        //this will be the object that shows text when hovering over something
    storyObjects;   //SHOULD be used to store all storyObjects



    constructor(key, name){
        super(key);
        this.sceneName = key;
        this.name = name;
        this.storyObjects = {};
    }



    preload(){
        this.load.json('dialogue', `assets/dialogue/${this.sceneName}_dia.json`);
        this.load.json('mouseover', `assets/mouseover/${this.sceneName}_mo.json`);
        this.load.json('anims', `assets/spritesheets/animations/${this.sceneName}_anim.json`);
    }



    init(data){
        //establish important variables/values
        this.items = data.items || [];
        this.flags = data.flags || [];
        this.relationships = data.relationships || [];
        this.width = this.game.config.width;    //width of the game
        this.height = this.game.config.height;  //height of the game
        this.w2 = this.width / 2;               //width of the game / 2
        this.h2 = this.height / 2;              //height of the game / 2
        
    }



    create(){
        this.dialogue = this.cache.json.get('dialogue');
        this.mouseover = this.cache.json.get('mouseover');
        this.animations = this.cache.json.get('anims');
        this.createAnimations();
        this.afterCreate();
    }



    createAnimations(){
        console.log(this.animations.animations);
        let thisjson = this.animations.animations;
        thisjson.forEach((x) => {
            const anim = {
                key: x.key,
                frames: this.anims.generateFrameNumbers(x.spriteSheet, {
                    start: x.startFrame,
                    end: x.endFrame,
                    first: x.firstFrame
                }),
                frameRate: x.frameRate,
                repeat: x.repeat
            }
            this.anims.create(anim);
        });
    }



    update(){
        
    }



    //CREATE MUST BE IMPLEMENTED BY SUBCLASS



    //SCENETRANSITION MUST BE IMPLEMENTED BY SUBCLASS



    addObject(key, x, y, pickable, dialogue, disappears){
        let obj = new storyObject(this, key, x, y, pickable, dialogue, disappears);
        this.storyObjects.set(key, obj);
    }



    goToScene(key){
        //if sceneTransition isnt implemented then run the default transition
        if(this.sceneTransition !== undefined) this.sceneTransition();
        else this.defaultTransition();
        this.scene.start(key, {
            items: this.items,
            flags: this.flags,
            relationships: this.relationships
        });
    }



    defaultTransition(){

    }



    dialogue(){

    }



    queueMessage(text){
        this.queuedMessage = text;
    }



    clearQueue(){
        this.queuedMessage = "";
    }
}





/*
 This is the menu, which shows inventory and some settings.
 phaser functions
 constructor        : nothing special here
 init               : this will read scene-to-scene data, the main difference being going back to the scene the menu was called from
 update             : this will handle the description boxes
 create             : this will create everything visual
 */
class MenuScene extends Phaser.Scene{
    itemList;   //this will be the object that lists the items
    descBox;    //this will be the object that describes whatever is hovered over



    constructor(key, name){
        super(key);
        this.name = name;
    }



    init(data){
        this.callScene = data.callScene;
        this.items = data.items;
        this.flags = data.flags;
        this.relationships = data.relationships;
    }



    create(){

    }
}