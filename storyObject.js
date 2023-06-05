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
    doorRequirements;
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
        this.doorRequirements = {flag: [], noflag: [], item: [], noitem: []}
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
                    isValid = this.checkFlags(a, "dia");
                    //start the first dialogue that meets all checks
                    if(isValid){
                        let node = this.dialogueNodeStarts[a];
                        this.parentScene.startDialogue(node, () => {
                            this.onClick(false);
                        })
                        break;
                    }
                    isValid = true;
                }
            }else{
                if(this.isPickable){
                    this.parentScene.addItem(this.key);
                }
                if(this.isDoor){
                    let isValid = true;
                    if(this.doorRequirements.flag[0] !== undefined) isValid = this.checkFlags(0, "door");
                    if(isValid){
                        this.parentScene.clearMessage();
                        this.parentScene.goToScene(this.doorKey);
                    }
                }
                if(this.disappearsOnInteraction){
                    this.parentScene.clearMessage();
                    this.render.destroy();
                    this.destroy();
                }
            }
        }
    }



    checkFlags(index, mode){
        let checkArray;
        if(mode === "dia") checkArray = this.dialogueRequirements;
        else if(mode === "door") checkArray = this.doorRequirements;

        for(let a = 0; a < checkArray.flag[index].length; a++){
            if(!this.parentScene.hasFlag(checkArray.flag[index][a])){
                return(false)
            }
        }
        for(let a = 0; a < checkArray.noflag[index].length; a++){
            if(this.parentScene.hasFlag(checkArray.flag[index][a])){
                return(false)
            }
        }
        for(let a = 0; a < checkArray.item[index].length; a++){
            if(!this.parentScene.hasItem(checkArray.flag[index][a])){
                return(false)
            }
        }
        for(let a = 0; a < checkArray.noitem[index].length; a++){
            if(this.parentScene.hasItem(checkArray.flag[index][a])){
                return(false)
            }
        }
        return(true);
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



    playAnim(key){
        this.render.play(key);
    }



    setDoor(key, flags, noflags, items, noitems){
        this.doorKey = key
        this.doorRequirements.flag.push(flags);
        this.doorRequirements.noflag.push(noflags);
        this.doorRequirements.item.push(items);
        this.doorRequirements.noitem.push(noitems);
    }
}