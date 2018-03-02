export class Preload extends Phaser.State {
  public preload() {
    const preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'bar');
    preloadBar.anchor.setTo(0.5);
    preloadBar.scale.setTo(100, 1);

    this.load.setPreloadSprite(preloadBar);

    this.load.image('block1', 'images/bean_blue.png');
    this.load.image('block2', 'images/bean_green.png');
    this.load.image('block3', 'images/bean_orange.png');
    this.load.image('block4', 'images/bean_pink.png');
    this.load.image('block5', 'images/bean_purple.png');
    this.load.image('block6', 'images/bean_yellow.png');
    this.load.image('block7', 'images/bean_red.png');
    this.load.image('block8', 'images/bean_white.png');
    this.load.image('deadBlock', 'images/bean_dead.png');
    this.load.image('background', 'images/backyard2.png');
  }

  public create() {
    this.state.start('Game');
  }
}
