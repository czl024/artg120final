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
    menuTab;        //this is the menu button



    constructor(key, name){
        //set variables and whatnot
        super(key);
        this.sceneName = key;
        this.name = name;
    }



    preload(){
        //load the jsons associated with a scene
        this.load.json('dialogue', `assets/jsons/${this.sceneName}/${this.sceneName}_dia.json`);
        this.load.json('mouseover', `assets/jsons/${this.sceneName}/${this.sceneName}_mo.json`);
        this.load.json('anims', `assets/jsons/${this.sceneName}/${this.sceneName}_anim.json`);
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

        //initialize the description text
        this.descBox = this.add.text(this.w2, this.h2, "", {
            fontFamily: 'Helvetica',
            fontSize: 50,
            alpha: .6,
            color: '#f0f0f0',
            wordWrap: {width: 400, useAdvancedWrap: true},
		    align: 'center'
        });
        this.descBox.setStroke('0x111111', 5);
        this.descBox.setOrigin(.5);
        this.descBox.setDepth(100);
        this.descBox.setAlpha(.8);

        //the menu button
        this.menuTab = this.add.image(125, -68, 'menu');
        this.menuTab.setDepth(89);
        this.menuTab.setOrigin(.5, 0);
        this.menuTab.scale = 1.25;
        this.menuTab.setInteractive();
        this.menuTab.on('pointerover', () =>{
            this.add.tween({
                targets: this.menuTab,
                y: 0,
                ease: 'quad.out',
                duration: 150
            })
        });
        this.menuTab.on('pointerout', () =>{
            this.add.tween({
                targets: this.menuTab,
                y: -68,
                ease: 'quad.out',
                duration: 150
            })
        });
        this.menuTab.on('pointerdown', () =>{
            this.scene.start('ingamemenu', {
                callScene: this,
                items: this.items,
                flags: this.flags,
                relationships: this.relationships
            });
        });

        //subclasses implement this
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

        //change position of the desc text based on cursor from center
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
        let sceneFilter;        //the screen darkener behind the dialogue
        let overlay;            //an invisible overlay

        //text position and whatnot
        let textX = 0;
        let textY = 2 * this.height / 3;
        let textWidth = this.width - 100;

        //the thing that makes the screen darker
        sceneFilter = this.add.rectangle(this.w2, this.h2, this.width, this.height, '0xf0f0f0')
        sceneFilter.setAlpha(.25);
        sceneFilter.setDepth(90);
        overlay = this.add.rectangle(this.w2, this.h2, this.width, this.height, '0xf0f0f0')
        overlay.setAlpha(.01);
        overlay.setDepth(199)
        overlay.setInteractive();
        //the sprite
        let character = this.add.sprite(this.w2, this.h2, node.sprite);
        character.setOrigin(.5);
        //have the sprite play an animation 
        character.play(node.animation);
        character.setDepth(90);
        //the dialogue box
        let dialogueBox = this.add.rectangle(0, textY, this.width, this.height / 3, '0x111111');
        dialogueBox.setOrigin(0);
        dialogueBox.setAlpha(.75);
        dialogueBox.setInteractive();
        dialogueBox.setDepth(100);
        //the nameplate
        let namePlate = this.add.rectangle(this.width / 2, textY - 30, node.nameplate.length * 20, 60, '0xDCDCDC');
        namePlate.setOrigin(.5);
        namePlate.setDepth(100);
        //the text stuff
        let dialogueText = this.add.text(50, textY + 50, "", {
            fontFamily: 'Helvetica',
            fontSize: 45,
            color: "#f0f0f0",
            wordWrap: {width: textWidth, useAdvancedWrap: true}
        });
        dialogueText.setDepth(101);
        let nameText = this.add.text(this.width / 2, textY - 30, node.nameplate, {
            fontFamily: 'Helvetica',
            fontSize: 30,
            color: "#101010",
        });
        nameText.setOrigin(.5);
        nameText.setDepth(101);



        //actually do stuff
        this.menuTab.disableInteractive();
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
        overlay.on('pointerdown', () => {
            if(finishedTalking && !optionsVisible){     //dont let player skip ahead
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
                            linkButtons[a].setAlpha(.75);
                            linkButtons[a].setDepth(200);
                            linkButtons[a].setInteractive();
                            linkButtons[a].on('pointerdown', () => {
                                character.destroy();
                                dialogueBox.destroy();
                                namePlate.destroy();
                                dialogueText.destroy();
                                nameText.destroy();
                                sceneFilter.destroy();
                                links.forEach((element) => {element.destroy()});
                                linkButtons.forEach((element) => {element.destroy()});
                                overlay.destroy();
                                this.menuTab.setInteractive();
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
                            links[a].setDepth(201);
                        }
                    }else{  //the dialogue is over, cleanup everything
                        character.destroy();
                        dialogueBox.destroy();
                        namePlate.destroy();
                        dialogueText.destroy();
                        nameText.destroy();
                        this.dialogueActive = false;
                        sceneFilter.destroy();
                        overlay.destroy();
                        this.menuTab.setInteractive();
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
    activeButton;   //determines which item is selected
    descBoxText;
    upButton;
    downButton;
    fsButton
    index;
    maxIndex;



    constructor(key, name){
        super(key);
        this.name = name;
        this.itemList = [];
        this.index = 0;
    }



    init(data){
        this.callScene = data.callScene;    //this is the scene that called the menu
        this.items = data.items || [];
        this.flags = data.flags || [];
        this.relationships = data.relationships || [];
        this.width = this.game.config.width;    //width of the game
        this.height = this.game.config.height;  //height of the game
        this.w2 = this.width / 2;               //width of the game / 2
        this.h2 = this.height / 2;              //height of the game / 2
    }



    preload(){
        this.load.json('inventory', 'assets/jsons/inventory.json');
    }



    create(){
        this.activeButton = undefined;
        this.inventory = this.cache.json.get('inventory');
        //background
        let bg = this.add.rectangle(this.w2, this.h2, this.width, this.height, '0x252525');

        //itemDescription
        let descBoxBorder = this.add.rectangle(1 * this.width / 3 - 100, 2 * this.height / 3 - 5, 850, 550, '0x353535');
        descBoxBorder.setOrigin(.5);
        let descBox = this.add.rectangle(1 * this.width / 3 - 100, 2 * this.height / 3 - 5, 800, 500, '0x505050');
        descBox.setOrigin(.5);
        this.descBoxText = this.add.text(1 * this.width / 3 - 100, 2 * this.height / 3 - 5, "", {
            fontFamily: 'Helvetica',
            fontSize: 40,
            color: '#F0F0F0',
            wordWrap: {width: 750, useAdvancedWrap: true},
            align: 'center'
        })
        this.descBoxText.setOrigin(.5);

        //the back button
        let backButton = this.add.rectangle(280, 115, 325, 50, '0xB5B5B5');
        backButton.setOrigin(.5);
        backButton.setInteractive();
        backButton.on('pointerover', () => {
            this.add.tween({
                targets: backButton,
                alpha: .8,
                duration: 100
            })
        });
        backButton.on('pointerout', () => {
            this.add.tween({
                targets: backButton,
                alpha: 1,
                duration: 100
            })
        });
        backButton.on('pointerdown', () => {
            this.scene.start(this.callScene, {
                items: this.items,
                flags: this.flags,
                relationships: this.relationships
            });
        })
        let backButtonText = this.add.text(280, 115, "Return to Game", {
            fontFamily: 'Helvetica',
            fontSize: 40,
            color: '#0F0F0F',
		    align: 'center'
        });
        backButtonText.setOrigin(.5);

        //itemList
        let itemBoxBorder = this.add.rectangle(4 * this.width / 5 - 75, this.h2, 700, 900, '0x353535');
        itemBoxBorder.setOrigin(.5);
        let itemBox = this.add.rectangle(4 * this.width / 5 - 75, this.h2, 650, 850, '0x505050');
        itemBox.setOrigin(.5);
        let itemTitle = this.add.text(4 * this.width / 5 - 75, this.h2 / 4 + 15, "Inventory", {
            fontFamily: 'Helvetica',
            fontSize: 50,
            color: "#F0F0F0",
        });
        itemTitle.setOrigin(.5);
        while(this.itemList.length > 0){
            this.itemList.pop();
        }
        for(let a = 2; a < 14; a++){
            this.itemList.push(new InventoryButton(this, 4 * this.width / 5 - 75, (this.h2 / 4 + 30) + (a * 55), a));
        }
        for(let b = 0; b < 12; b++){
            this.itemList[b].setButtonText(this.items[b]);
        }
        //the up button
        this.upButton = this.add.rectangle(4 * this.width / 5 - 75, this.h2 / 4 + 85, 650, 55, '0x727272');
        this.upButton.setInteractive();
        this.upButton.on('pointerover', () => { this.upButton.fillColor -= 0x111111 });
        this.upButton.on('pointerout', () => { this.upButton.fillColor += 0x111111 });
        this.upButton.on('pointerdown', () => {
            if(this.index > 0) this.index--;            //prevent the player from infinitely scrolling up
            if(this.items.length > 12) this.maxIndex = 12;
            else this.maxIndex = this.items.length;
            console.log(this.itemList.length);
            for(let x = 0; x < this.maxIndex; x++){ //change the text of the buttons
                this.itemList[x].setButtonText(this.items[x + this.index]);
            }
            this.add.tween({
                targets: this.upButton,
                alpha: .25,
                duration: 50,
            })
            console.log(this.index)
        });
        this.upButton.on('pointerup', () => {
            this.add.tween({
                targets: this.upButton,
                alpha: 1,
                duration: 50,
            })
        })
        this.add.text(4 * this.width / 5 - 75, this.h2 / 4 + 87.5, '^^^', {
            fontFamily: 'Helvetica',
            fontSize: 45,
            color: "#111111",
        }).setOrigin(.5);
        //the down button
        this.downButton = this.add.rectangle(4 * this.width / 5 - 75, this.h2 / 4 + 800, 650, 55, '0x727272');
        this.downButton.setInteractive();
        this.downButton.on('pointerover', () => { this.downButton.fillColor -= 0x111111 });
        this.downButton.on('pointerout', () => { this.downButton.fillColor += 0x111111 });
        this.downButton.on('pointerdown', () => {
            if(this.items.length + this.index > 12) this.index++;   //prevent the player from infinitely scrolling down
            for(let x = 0; x < this.items.length; x++){             //change the text of the buttons
                this.itemList[x].setButtonText(this.items[x + this.index]);
            }
            this.add.tween({
                targets: this.downButton,
                alpha: .25,
                duration: 50,
            })
            console.log(this.index)
        });
        this.downButton.on('pointerup', () => {
            this.add.tween({
                targets: this.downButton,
                alpha: 1,
                duration: 50,
            })
        })
        this.add.text(4 * this.width / 5 - 75, this.h2 / 4 + 800, 'vvv', {
            fontFamily: 'Helvetica',
            fontSize: 40,
            color: "#111111",
        }).setOrigin(.5);

        //fullscreen button
        this.fsButton = this.add.rectangle(780, 115, 350, 50, '0xB5B5B5');
        this.fsButton.setInteractive();
        this.fsButton.on('pointerover', () => {
            this.add.tween({
                targets: this.fsButton,
                alpha: .8,
                duration: 100
            })
        });
        this.fsButton.on('pointerout', () => {
            this.add.tween({
                targets: this.fsButton,
                alpha: 1,
                duration: 100
            })
        });
        this.fsButton.on('pointerdown', () => {
            this.scale.toggleFullscreen();
        });
        this.add.text(780, 115, "Toggle Fullscreen", {
            fontFamily: 'Helvetica',
            fontSize: 40,
            color: '#0F0F0F',
		    align: 'center'
        }).setOrigin(.5);
    }



    setButton(index){
        let activeItemText = this.itemList[index].text;
        console.log(`old : ${this.activeButton}, new : ${index}`);

        //deactivate the previous button
        if(this.activeButton != undefined){
            this.itemList[this.activeButton].button.fillColor += 0x333333;
            this.itemList[this.activeButton].buttonText.clearTint();
        }
        //activate the button
        this.activeButton = index;
        this.itemList[this.activeButton].button.fillColor -= 0x333333;
        this.itemList[this.activeButton].buttonText.setTintFill(0xF0F0F0);
        if(this.itemList[this.activeButton].buttonText.text === "") this.descBoxText.setText("");
        else this.descBoxText.setText(this.inventory[activeItemText]);
    }
}



class InventoryButton{
    button;
    buttonText;
    text;
    parentScene;
    index;



    constructor(scene, x, y, i){
        this.text = "";
        this.index = i - 2;
        this.parentScene = scene;
        this.button = this.parentScene.add.rectangle(x, y, 650, 55, '0x727272');
        this.button.setOrigin(.5);
        this.button.setInteractive();
        this.button.on('pointerover', () => { this.button.fillColor -= 0x111111 });
        this.button.on('pointerout', () => { this.button.fillColor += 0x111111 });
        this.button.on('pointerdown', () => { this.parentScene.setButton(this.index) })
        this.buttonText = this.parentScene.add.text(x, y, "", {
            fontFamily: 'Helvetica',
            fontSize: 40,
            color: "#111111",
        });
        this.buttonText.setOrigin(.5);
    }



    setButtonText(inText){
        this.text = inText;
        this.buttonText.setText(this.text);
    }
}