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
  Cam,
  CamSystem,
  CursorSystem,
  FollowCamSystem,
  FollowPointSystem,
  FPSSystem,
  Input,
  RenderSystem,
  Sprite,
  Synth,
  TextSystem,
  VoidGame,
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

export class GreenField extends VoidGame<GFEnt, GFFilmID> {
  static async new(window: Window): Promise<GreenField> {
    const canvas = window.document.getElementsByTagName('canvas').item(0)
    assertNonNull(canvas, 'Canvas missing.')
    return new GreenField(await GFAssets.load(), canvas, Math.random)
  }

  override readonly cam: Readonly<Cam>
  override readonly input: Input

  readonly #cursor: Sprite

  constructor(
    assets: GFAssets,
    canvas: HTMLCanvasElement,
    random: () => number,
  ) {
    super(assets, canvas, random)

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
    this.input = new Input(this.cam)
    this.#cursor = this.ecs.queryOne('cursor & sprite').sprite
  }

  get cursor(): Sprite {
    return this.#cursor
  }

  override onFrame(): void {
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
      setTimeout(() => this.renderer.restoreContext(), 3000)
    }
  }
}
