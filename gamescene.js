/*
 phaser functions
 constructor        : the very first function, establishes fundamental scene data
 init               : this will establish any scene-to-scene variable
        will also add some objects that persist in every scene, namely the menu stuff
 preload            : this will load the respective json files for dialogue and mouseover
        BOTH JSONS SHOULD BE NAMED AS SUCH : thisSceneName_dia.json AND thisSceneName_mo.json
 update             : this will handle the description boxes
 create             : THIS MUST BE IMPLEMENTED BY SUBCLASSES

 functions 
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



    constructor(key, name){
        super(key);
        this.sceneName = key;
        this.name = name;
    }



    preload(){
        this.preload.json('dialogue', `assets/dialogue/${this.key}_dia.json`);
        this.preload.json('mouseover', `assets/mouseover/${this.key}_mo.json`);
    }



    init(data){
        this.items = data.items || [];
        this.flags = data.flags || [];
        this.relationships = data.relationships || [];
    }



    update(){
        
    }



    //CREATE MUST BE IMPLEMENTED BY SUBCLASS



    goToScene(key){
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





/*
 this object exists for the sake of making coding easier to read and do
 */
class storyObject extends Phaser.GameObject.Sprite{
    isPickable;
    hasDialogue;



    constructor(){
        super();
    }




}