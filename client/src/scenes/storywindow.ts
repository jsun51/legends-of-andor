import { Window } from "./window";
import { WindowManager } from "../utils/WindowManager"
import { storyCardWidths, storyCardHeights, 
        storyCardTexts, storyCardStyleText, storyCardStyleTitle } from '../constants'

export class StoryWindow extends Window {
    private key;
    private id;
    private okButton: Phaser.GameObjects.Image;
    private runestoneLocs;

    private x;
    private y;
    private width;
    private height;

    public constructor(key: string, data) {
        super(key, 
            {
                x: data.x - storyCardWidths[data.id]/2, 
                y: data.y - storyCardHeights[data.id]/2,
                width: storyCardWidths[data.id],
                height: storyCardHeights[data.id]
            }
        );
        this.key = key;
        this.id = data.id;
        this.x = data.x - storyCardWidths[data.id]/2;
        this.y = data.y - storyCardHeights[data.id]/2;
        this.width = storyCardWidths[data.id];
        this.height = storyCardHeights[data.id];
        this.runestoneLocs = data.locs;
    }

    protected initialize() {
        var self = this
        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5);
        this.add.text(10, 10, storyCardTexts[this.id], storyCardStyleText);
        // Extra text for runestones legend
        if (this.id == 6) {
            this.add.text(10, 130, `The locations of the stones have been discovered:\n${this.runestoneLocs}`, storyCardStyleText);
        }

        this.okButton = this.add.image(this.width-35, this.height-35, 'okay');
        this.okButton.setInteractive().setDisplaySize(30, 30).setOrigin(0);

        if (this.id == 0) {
            // Pause the collab scene for the initial story
            self.scene.sleep('collab');
        }
        // Start of game story and instructions, IDs 0, 1 and 2
        let continueCards = [0, 1, 3, 4]
        if (continueCards.includes(this.id)) {
            this.okButton.on('pointerdown', function (pointer) {
                // start the next story window
                WindowManager.create(self, `story${this.id+1}`, StoryWindow, {
                    x: this.x + storyCardWidths[this.id]/2,
                    y: this.y + storyCardHeights[this.id]/2,
                    id: this.id+1
                })
                this.scene.remove(this.key)
            }, this);
        } else if (this.id == 2) {
            this.okButton.on('pointerdown', function (pointer) {
                this.scene.bringToTop('collab')
                this.scene.wake('collab')
                this.scene.remove(this.key)
            }, this);
            // Legend A5: determine placement of the Rune Stones Legend
        } else {
            this.okButton.on('pointerdown', function (pointer) {
                this.scene.remove(this.key)
            }, this);
        }
    }
}