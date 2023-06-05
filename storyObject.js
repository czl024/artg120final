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
    render;
    dialogueRequirements;
    dialogueNodeStarts;
    doorKey;
    isDoor;



    constructor(scene, key, x, y, pickable, dialogue, disappears, isDoor){
        super(scene, x, y, key);
        
        this.setOrigin(.5);     //automatically sets origin to middle for simplicity
        this.setInteractive();
        this.isPickable = pickable;
        this.hasDialogue = dialogue;
        this.disappearsOnInteraction = disappears;
        this.parentScene = scene;
        this.render = this.parentScene.add.sprite(x, y, key);
        this.key = key;
        this.isDoor = isDoor;
        
        this.on('pointerover', () => { this.mouseover(); });
        this.on('pointerdown', () => { this.onClick(true); });
        this.on('pointerout', () => {
            this.render.clearTint();
            this.parentScene.clearMessage();
        });

        this.dialogueRequirements = {flag: [], noflag: [], item: [], noitem: []}
        this.dialogueNodeStarts = [];
    }



    mouseover(){
        //return the initial message and the long message to the parent scene from the parent scene's jsons
        this.render.setTint(0xDDDDDD);
        this.parentScene.showMessage(this.parentScene.mouseover[this.key].text);
        this.parentScene.queueMessage(this.parentScene.mouseover[this.key].longtext);
    }



    onClick(override){
        if(!this.parentScene.dialogueActive){
            if(this.hasDialogue && override){
                let isValid = true;

                //for all node starts
                for(let a = 0; a < this.dialogueNodeStarts.length; a++){
                    //check to see all required flags are set
                    for(let b = 0; b < this.dialogueRequirements.flag[a].length; b++){
                        if(!this.parentScene.hasFlag(this.dialogueRequirements.flag[a][b])){
                            isValid = false;
                        }
                    }

                    //check to see if no prohibited flags are set
                    if(isValid){
                        for(let b = 0; b < this.dialogueRequirements.noflag[a].length; b++){
                            if(this.parentScene.hasFlag(this.dialogueRequirements.noflag[a][b])){
                                isValid = false;
                            }
                        }
                    }

                    //check to see if all items are in inventory
                    if(isValid){
                        for(let b = 0; b < this.dialogueRequirements.item[a].length; b++){
                            if(!this.parentScene.hasItem(this.dialogueRequirements.item[a][b])){
                                isValid = false;
                            }
                        }
                    }

                    //check to see if no prohibited items in inventory
                    if(isValid){
                        for(let b = 0; b < this.dialogueRequirements.noitem[a].length; b++){
                            if(this.parentScene.hasItem(this.dialogueRequirements.noitem[a][b])){
                                isValid = false;
                            }
                        }
                    }

                    //start the first dialogue that meets all checks
                    if(isValid){
                        this.parentScene.startDialogue(this.dialogueNodeStarts[a], () => { this.onClick(false) })
                        break;
                    }
                    isValid = true;
                }
            }else{
                if(this.isPickable){
                    this.parentScene.addItem(this.key);
                }
                if(this.isDoor){
                    this.parentScene.clearMessage();
                    this.parentScene.goToScene(this.doorKey);
                }
                if(this.disappearsOnInteraction){
                    this.parentScene.clearMessage();
                    this.render.destroy();
                    this.destroy();
                }
            }
        }
    }



    //all but the last parameter MUST be an array
    addDialogue(flags, noflags, items, noitems, node){
        this.dialogueRequirements.flag.push(flags);
        this.dialogueRequirements.noflag.push(noflags);
        this.dialogueRequirements.item.push(items);
        this.dialogueRequirements.noitem.push(noitems);
        this.dialogueNodeStarts.push(node);
    }



    setStatus(pickable, dialogue, disappears, isDoor){
        this.isPickable = pickable;
        this.hasDialogue = dialogue;
        this.disappearsOnInteraction = disappears;
        this.isDoor = isDoor;
    }



    setDoor(key){ this.doorKey = key }
}