import { FilmByID } from '@/atlas-pack'
import { Cam, ECS, Game, Input, RendererStateMachine } from '@/void'

import {
  GFAssets,
  GFEnt,
  GFFilmID,
  newLevelComponents,
  PickHealthAdderSystem,
  SpawnerSystem,
  SpriteFactory,
} from '@/green-field'
import { assertNonNull, Immutable } from '@/ooz'
import {
  CamSystem,
  CursorSystem,
  FollowCamSystem,
  FollowPointSystem,
  FPSSystem,
  RenderSystem,
  Sprite,
  Synth,
  TextSystem,
} from '@/void'

const combo = Immutable(
  [
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
  ] as const,
)

export class GreenField implements Game<GFEnt, GFFilmID> {
  static async new(window: Window): Promise<GreenField> {
    const canvas = window.document.getElementsByTagName('canvas').item(0)
    assertNonNull(canvas, 'Canvas missing.')
    return new GreenField(await GFAssets.load(), canvas, Math.random)
  }

  readonly cam: Readonly<Cam>
  readonly filmByID: FilmByID<GFFilmID>
  readonly ecs: ECS<GFEnt>
  readonly input: Readonly<Input>
  pickHandled: boolean = false
  readonly renderer: RendererStateMachine

  readonly #cursor: Sprite
  readonly #random: () => number
  /** The running age in milliseconds. */
  #time: number = 0
  /** The exact duration in milliseconds to apply on a given update step. */
  #tick: number = 1

  constructor(
    assets: GFAssets,
    canvas: HTMLCanvasElement,
    random: () => number,
  ) {
    this.ecs = new ECS<GFEnt>()
    this.ecs.addSystem(
      new CamSystem(),
      new FollowCamSystem(),
      new CursorSystem(),
      new FollowPointSystem(),
      new TextSystem(),
      new FPSSystem(),
      new PickHealthAdderSystem(),
      new SpawnerSystem(),
      new RenderSystem<GFEnt>(assets.shaderLayout),
    )
    this.ecs.addEnt(
      ...newLevelComponents(
        new SpriteFactory(assets.atlasMeta.filmByID),
        assets.font,
      ),
    )

    this.ecs.patch()
    this.cam = this.ecs.queryOne('cam').cam

    this.filmByID = assets.atlasMeta.filmByID
    this.input = new Input(this.cam)
    this.renderer = new RendererStateMachine({
      assets,
      window,
      canvas,
      onFrame: (delta) => this.#onFrame(delta),
      onPause: () => this.onPause(),
    })
    this.#random = random
    this.#cursor = this.ecs.queryOne('cursor & sprite').sprite
  }

  get cursor(): Sprite {
    return this.#cursor
  }

  onFrame(): void {
    if (this.pickHandled) return
    if (this.input.isComboStart(...combo)) {
      Synth.play(Synth(), 'sawtooth', 200, 500, 0.15)
      this.pickHandled = true
      console.log('combo')
    }
    if (
      this.input.isOnStart('DebugContextLoss') &&
      !this.renderer.isContextLost()
    ) {
      this.pickHandled = true
      this.renderer.loseContext()
      setTimeout(
        () => this.renderer.restoreContext(),
        3000,
      )
    }
  }

  #onFrame(delta: number): void {
    this.#tick = delta
    this.#time += delta
    this.pickHandled = false

    this.input.preupdate()

    this.onFrame()

    this.ecs.run(this)

    // should actual render be here and not in the ecs?
    this.input.postupdate(this.tick)
  }

  onPause(): void {
    this.input.reset()
  }

  random(): number {
    return this.#random()
  }

  start(): void {
    this.input.register('add')
    this.renderer.start()
  }

  stop(): void {
    this.input.register('remove')
    this.renderer.stop()
    // win.close()
  }

  get tick(): number {
    return this.#tick
  }

  get time(): number {
    return this.#time
  }
}
