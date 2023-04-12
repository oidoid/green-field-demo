import {
  GFAssets,
  GFEnt,
  GFFilmID,
  loadGFAssets,
  newLevelComponents,
  PickHealthAdderSystem,
  SpawnerSystem,
  SpriteFactory,
} from '@/green-field'
import { assertNonNull, XY } from '@/ooz'
import {
  CursorSystem,
  FollowCamSystem,
  FollowPointSystem,
  FPSSystem,
  Sprite,
  Synth,
  TextSystem,
  VoidGame,
} from '@/void'

const combo = [
  ['Up'],
  ['Up'],
  ['Down'],
  ['Down'],
  ['Left'],
  ['Right'],
  ['Left'],
  ['Right'],
  ['Menu'],
  ['Action'],
] as const

export class GreenField extends VoidGame<GFEnt, GFFilmID> {
  static async new(window: Window): Promise<GreenField> {
    const canvas = window.document.getElementsByTagName('canvas').item(0)
    assertNonNull(canvas, 'Canvas missing.')
    return new GreenField(
      await loadGFAssets(),
      canvas,
      Math.random,
      window,
    )
  }

  readonly #cursor: Sprite
  readonly #underCursor: Set<Readonly<Sprite>> = new Set()

  constructor(
    assets: GFAssets,
    canvas: HTMLCanvasElement,
    random: () => number,
    window: Window,
  ) {
    super(assets, canvas, new XY(320, 280), random, window)

    this.ecs.addSystem(
      // new BeelineSystem(),
      new FollowCamSystem(),
      new CursorSystem(),
      new FollowPointSystem(),
      new TextSystem(),
      new FPSSystem(),
      new PickHealthAdderSystem(),
      new SpawnerSystem(),
    )
    this.ecs.addEnt(
      ...newLevelComponents(
        new SpriteFactory(assets.atlasMeta.filmByID),
        assets.font,
      ),
    )
    this.ecs.patch()

    this.#cursor = this.ecs.queryOne('cursor & sprite').sprite
  }

  intersectsCursor(sprite: Readonly<Sprite>): boolean {
    return this.#cursor.intersects(sprite, this.time)
    // return this.#underCursor.has(sprite)
  }

  override onFrame(): void {
    this.#underCursor.clear()
    // for (const sprite of this.queryGrid(this.#cursor.bounds)) {
    //   if (this.#cursor.intersectsSprite(sprite, this.time)) {
    //     this.#underCursor.add(sprite)
    //   }
    // }
    if (this.pickHandled) return
    if (this.input.isComboStart(...combo)) {
      const synth = new Synth()
      synth.play('sawtooth', 200, 500, 0.15)
      this.pickHandled = true
      console.log('combo')
    }
    if (
      this.input.isOnStart('DebugContextLoss') &&
      !this.renderer.isContextLost()
    ) {
      this.pickHandled = true
      this.renderer.loseContext()
      setTimeout(() => this.renderer.restoreContext(), 3000)
    }
  }
}
