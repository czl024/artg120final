## General Context
every "GameScene" is basically a normal phaser scene but purpose built for this game, for all intents and purposes, the only thing you need to care about are writing these 3 functions:
	`constructor()`, `afterCreate()`, `sceneTransition()`

so if you add a GameScene, it'll look a little something like
```javascript
class SceneName extends GameScene{
	constructor(){ super('sceneKey', "scene name") }

	afterCreate(){

	}

	sceneTransition(){
	
	}
}
```
the constructor is necessary for Phaser to understand that this scene does indeed exist
IT IS CRITICALLY IMPORTANT THAT YOU DONT CHANGE `'sceneKey'` ONCE YOU'RE SATISFIED WITH IT

every scene has 3 json's associated with it, a mouseover, dialogue, and animation json, the names of these jsons are based on the 'sceneKey' so if you change 'sceneKey', you MUST change these file names as well

`afterCreate()` is basically everything visual, i had to run some things in `create()` so this function handles the fact i had to do that  
`sceneTransition()` is an optional function, basically, if you move to another scene, this will play, so if you want some sound effects and fades, here's where to do it

### Adding Background Images
1) put the image in `assets/backgrounds`
2) in `game.js`, under the `Loader` class, add the following code under `preload()` :

`this.load.image('somekey', 'assets/backgrounds/yourImageName.png')`
	"somekey" should be something simple but also unique, like, iunno, `[whatever the scene name is]_bg`
	also if, for some reason, you HAVE to use a jpg, you can do that too

3) under `afterCreate()`, add the following line of code :
`this.setBG('somekey');`

### Adding an Object
this will be literally everything that isnt the background image
1) add a spritesheet for this object in `assets/spritesheets`, as a mega basic summary, a spritesheet is a single image that is tiled such that each tile is a frame in an animation
2) in `game.js`, under the `Loader` class, add the following code under `preload()` :
```javascript
this.load.spritesheet('objKey', 'assets/spritesheets/yourImageName.png', {
	frameWidth: x,
	frameHeight: y,
	endFrame: e,
})
```
all of these are pretty obvious, i think endFrame is optional but i dont honestly know

yes i wanted to automate this with a json, no i couldnt find out how, javascript is not letting me

3) under `afterCreate()`, you'll want to use this :
```js
let objName = new storyObject(this, 'objKey', x, y, bool1, bool2, bool3, bool4);
```
to explain the important bits :
`objKey` is the ID of this object, it will be used for 3 things  
	1) adding a spritesheet for a visual rendering  
	2) if this object is an item to be picked up, the player will see that it's   called 'objKey'  
	3) finding which text to display when mousing over
4) for every animation you want, you need to add a new thing to `assets/animations/sceneName_anim.json`
all of whatever's in there should be self explanatory, key being the name of the animation

as for all these bools?  
`bool1` determines whether or not the object gives the player an item on click  
`bool2` determines whether or not the object starts dialogue  
`bool3` determines whether or not the object disappears when clicked  
`bool4` determines if the object moves the player to another scene

## Adding Mouseover Text
every storyObject is supposed to have some text appear when you mouse over it
under `sceneName_mo.json`, you can add text for some object by doing this :
```json
"objKey": {
	"text": "this is the text that will appear when you mouse over something",
	"longtext": "this is the text that will appear a time after the previous text has been up"
}
```



## Adding Dialogue
i will go over how each dialogue node is structured in `sceneName_dia.json`
```
"nodeName":{
    "flags":        [],
```
this must be an array of strings, each string added to the scene's flags when dialogue starts
```
"items":        [],
```
this must be an array of strings, each string added to the player's inventory when dialogue starts
```
"itemsRemoved": [],
```
this must be an array of strings, each string is an item removed from the player's inventory on dialogue start
```
"sprite":       "orb",
```
this is the image to display in the center of the screen when dialogue starts
```
"nameplate":    "Mr. Morbius",
```
this is the text that appears above the dialogue box, usually to indicate someone's name
```
"animation":    "morb",
```
this is the animation key that plays for this node
```
"text":         ["this is a test dialogue",
                "this is the subsequent text to the intro dialogue"],
```
this must be an array of strings, each index is a click in the text box (so if theres 2 indeces, then the player will see the first index, click, then see the second index)
```
"links":        ["introA", "introB"],
```
this must be an array of strings,these are the names of the other dialogue nodes this dialogue node will lead to
```
"linktext":     {"introA": "option a",
                "introB": "option b"}
```
this must be a map where every index from "links" has a value, when the player is presented with dialogue options, they'll see the key's value string, the dialogue node to move to being the key itself


once you've done all that, under `afterCreate()` in your scene in "game.js" and after making your object, you will need to add the following line :
`objectName.addDialogue([], [], [], [], nodeName);`  
the parameters are all arrays of strings (can be empty), in order,  
the first parameter is the required flags, meaning the player MUST have these flags in order to see this dialogue  
the second parameter is the prohibited flags, meaning the player CANNOT have these flags in order to see this dialogue,  
the third parameter is the required items, meaning the player MUST have these items in order to see this dialogue  
the fourth parameter is the prohibited items, meaning the player CANNOT have these items in order to see this dialogue

if an object has multiple dialogues, it will start the first one that meets the criteria, meaning the most restrictive dialogue nodes should be added before the least restrictive  
in other words, add the dialogue in order of hardest-to-get to easiest-to-get