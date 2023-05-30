/*
 phaser functions
 constructor        : the very first function, establishes fundamental scene data
 init               : this will establish any scene-to-scene variable
        will also add some objects that persist in every scene, namely the menu stuff
 preload            : this will load the respective json files for dialogue and mouseover
        BOTH JSONS SHOULD BE NAMED AS SUCH : thisSceneName_dia.json AND thisSceneName_mo.json
 update             : this will handle the description boxes
 create             : does the final setup necessary to do shit
    the description box is created here

 functions 
 afterCreate        : for all intents and purposes, this is the same as create() in phaser
 createAnimations   : a function that produces animations from a json, trust me, you want this function to exist
 goToScene          : goes to the scene of a specific key, like phaser's but in a wrapper function
 defaultTransition  : default scene transition
    subclasses that need its own transition need to implement "sceneTransition()"
 dialogue           : this will start a dialogue interaction
 showMenu, hideMenu : does what you think it does
 queueMessage, showMessage, clearMessage
    unless you have a damn good reason, you should never touch these
    handles the description box text
 there are several functions for adding, checking items and flags, you shouldn't need to touch these
 */
class GameScene extends Phaser.Scene{
    sceneName;      //scene name, used for calling json files
    items;          //inventory
    flags;          //story flags, invisible to player
    relationships;  //we'll see if we even implement this
    descText;       //the text currently showing in the descBox
    queuedMessage;  //after hovering over something for long enough, the message to show in a descriptive text box
    descBox;        //this will be the object that shows text when hovering over something
    messageTime;    //the time a message was shown
    msgTimeLength;  //the duration a message should be shown
    newMsg          = false; //a flag to tell if a message is new
    dialogueActive  = false; //a flag to see if dialogue is active



    constructor(key, name){
        //set variables and whatnot
        super(key);
        this.sceneName = key;
        this.name = name;
    }



    preload(){
        //load the jsons associated with a scene
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
        this.newMsg = false;
        this.furthestDist = Math.hypot(this.w2, this.h2)
    }



    create(){
        //make the json files accessibles
        this.dialogue = this.cache.json.get('dialogue').dialogue;
        this.mouseover = this.cache.json.get('mouseover').mouseover;
        this.animations = this.cache.json.get('anims');
        this.createAnimations();

        this.descBox = this.add.text(this.w2, this.h2, "", {
            fontFamily: 'Helvetica',
            fontSize: 50,
            alpha: .6,
            color: '#f0f0f0',
            wordWrap: {width: 400, useAdvancedWrap: true},
		    align: 'center'
        });
        this.descBox.setOrigin(.5);
        this.descBox.setDepth(100);

        this.afterCreate();
    }



    createAnimations(){
        //run through the entire json and create animations from it
        //you can thank me for writing this function later
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



    update(time, delta){
        //set description text
        this.descBox.setText(this.descText);

        //if a message was JUST added
        if(this.newMsg){
            this.messageTime = time;
            this.newMsg = false;
        }
        //increment a timer to get the message
        if(!this.newMsg && this.descText != ""){
            if(time - this.messageTime >= this.msgTimeLength){
                this.descText = this.queuedMessage;
            }
        }

        let dx = this.input.activePointer.worldX - this.w2;
        dx /= 1.35;
        let dy = this.input.activePointer.worldY - this.h2;
        dy /= 1.4;
        this.descBox.x = dx + this.w2;
        this.descBox.y = dy + this.h2;
    }



    //SCENETRANSITION MUST BE IMPLEMENTED BY SUBCLASS



    setBG(key){
        let bg = this.add.image(this.w2, this.h2, key);
        bg.setOrigin(.5);
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



    startDialogue(startNode){
        //initialize stuff
        let node = this.dialogue[startNode];
        this.dialogueActive = true;
        let finishedTalking = false;    //determines what happens on click
        let optionsVisible = false;     //determines if the player can see dialogue options
        this.clearMessage();
        let txtIndex = 0;       //is the index of text to display
        let queuedDia = "";     //this is the text to show
        let writerIndex = 0;    //where the typewriter is looking
        let displayedDia = "";  //this is whats currently shown
        let textDelay = 15;     //time between each character in ms
        let links = [];         //stores dialogue option text
        let linkButtons = []    //stores dialogue option buttons

        //text position and whatnot
        let textX = 0;
        let textY = 2 * this.height / 3;
        let textWidth = this.width - 100;

        //the sprite
        let character = this.add.sprite(this.w2, this.h2, node.sprite);
        character.setOrigin(.5);
        //have the sprite play an animation 
        character.play(node.animation);
        //the dialogue box
        let dialogueBox = this.add.rectangle(0, textY, this.width, this.height / 3, '0x111111');
        dialogueBox.setOrigin(0);
        dialogueBox.setAlpha(.75);
        dialogueBox.setInteractive();
        //the nameplate
        let namePlate = this.add.rectangle(this.width / 2, textY - 30, node.nameplate.length * 20, 60, '0xDCDCDC');
        namePlate.setOrigin(.5);
        //the text stuff
        let dialogueText = this.add.text(50, textY + 50, "", {
            fontFamily: 'Helvetica',
            fontSize: 45,
            color: "#f0f0f0",
            wordWrap: {width: textWidth, useAdvancedWrap: true}
        });
        let nameText = this.add.text(this.width / 2, textY - 30, node.nameplate, {
            fontFamily: 'Helvetica',
            fontSize: 30,
            color: "#101010",
        });
        nameText.setOrigin(.5);



        //actually do stuff
        //load the text
        queuedDia = node.text[txtIndex];
        //display text with typewriter effect
        this.time.addEvent({
            callback: () =>{
                displayedDia += queuedDia[writerIndex];
                dialogueText.setText(displayedDia);
                writerIndex++;
            },
            repeat: queuedDia.length - 1,
            delay: textDelay
        });
        //set gamestate when dialogue is done
        this.time.delayedCall(queuedDia.length * textDelay, () => {
            finishedTalking = true;
            //handle any items/flags
            //this has to be here to prevent flags/items from triggering other dialogue
            for(let f = 0; f < node.flags.length; f++){
                this.addFlag(node.flags[f]);
            }
            for(let i = 0; i < node.items.length; i++){
                this.addItem(node.items[i]);
            }
            for(let x = 0; x < node.itemsRemoved.length; x++){
                this.removeItem(node.itemsRemoved[x]);
            }
        });
        //do this when the dialoguebox is clicked
        dialogueBox.on('pointerdown', () => {
            if(finishedTalking && !optionsVisible){                    //dont let player skip ahead
                if(txtIndex + 1 < node.text.length){    //theres more text to show
                    finishedTalking = false;
                    txtIndex++;
                    writerIndex = 0;
                    displayedDia = "";
                    queuedDia = node.text[txtIndex];
                    //just repeating the display text stuff
                    this.time.addEvent({
                        callback: () =>{
                            displayedDia += queuedDia[writerIndex];
                            dialogueText.setText(displayedDia);
                            writerIndex++;
                        },
                        repeat: queuedDia.length - 1,
                        delay: textDelay
                    });
                    this.time.delayedCall(queuedDia.length * textDelay, () => {
                        finishedTalking = true;
                    });
                }else{  //theres no more dialogue to show
                    if(node.links.length != 0){ //there are dialogue options
                        optionsVisible = true
                        for(let a = 0; a < node.links.length; a++){
                            //this is the button
                            linkButtons.push(this.add.rectangle(this.w2, (a + 1) * (textY / (node.links.length + 1)), node.linktext[node.links[a]].length * 30, 60, "0x111111"));
                            linkButtons[a].setOrigin(.5);
                            linkButtons[a].setInteractive();
                            linkButtons[a].on('pointerdown', () => {
                                character.destroy();
                                dialogueBox.destroy();
                                namePlate.destroy();
                                dialogueText.destroy();
                                nameText.destroy();
                                links.forEach((element) => {element.destroy()});
                                linkButtons.forEach((element) => {element.destroy()});
                                this.startDialogue(node.links[a]);
                            })
                            
                            //this is the text
                            links.push(this.add.text(this.w2, (a + 1) * (textY / (node.links.length + 1)), node.linktext[node.links[a]], {
                                fontFamily: 'Helvetica',
                                fontSize: 50,
                                color: "#f0f0f0",
                                wordWrap: {width: textWidth, useAdvancedWrap: true}
                            }));
                            links[a].setOrigin(.5);
                        }
                    }else{  //the dialogue is over, cleanup everything
                        character.destroy();
                        dialogueBox.destroy();
                        namePlate.destroy();
                        dialogueText.destroy();
                        nameText.destroy();
                        this.dialogueActive = false;
                    }
                }
            }
        })
    }



    queueMessage(text){ if(!this.dialogueActive) this.queuedMessage = text; }

    showMessage(text){
        if(!this.dialogueActive){
            this.descText = text;
            this.newMsg = true;
            this.msgTimeLength = (this.descText.length * 50) + 1000;
        }
    }

    //resets all description text stuff as though nothing ever happened
    clearMessage(){
        this.descText = "";
        this.queuedMessage = "";
        this.msgTimeLength = 0;
    }



    addItem(item){ this.items.push(item); }

    hasItem(item){
        if(this.searchArray(this.items, item) == -1) return(false);
        return(true);
    }

    removeItem(item){
        let index = searchArray(this.items, item);
        if(index != -1) this.items.splice(index, 1);
    }

    addFlag(flag){
        if(!this.hasFlag(flag)){
            this.flags.push(flag);
        }
    }

    hasFlag(flag){
        if(this.searchArray(this.flags, flag) == -1){
            return(false);
        }
        return(true);
    }

    searchArray(list, string){
        let returnval = -1;
        list.forEach((i, e) =>{
            if(i === string){
                returnval = e;
            }
        });
        return(returnval);
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