import {
  Assets,
  FPSSystem,
  GFComponentSet,
  GFECSUpdate,
  newLevelComponents,
  PickHealthAdderSystem,
  SpawnerSystem,
  SpriteFactory,
} from '@/green-field'
import { assertNonNull, I32, NonNull, Random } from '@/oidlib'
import {
  Cam,
  CamSystem,
  CursorSystem,
  ECS,
  FollowCamSystem,
  FollowPointSystem,
  Input,
  InstanceBuffer,
  Renderer,
  RendererStateMachine,
  RenderSystem,
  Sprite,
  Synth,
} from '@/void'

export interface GreenField extends GFECSUpdate { // class pls
  readonly assets: Assets
  readonly canvas: HTMLCanvasElement
  readonly cam: Cam
  readonly ecs: ECS<GFComponentSet, GFECSUpdate>
  readonly input: Input
  readonly random: Random
  readonly rendererStateMachine: RendererStateMachine
  tick: number
  time: number

  readonly instanceBuffer: InstanceBuffer
  readonly cursor: Sprite
}

export function GreenField(
  window: Window,
  assets: Assets,
): GreenField {
  const canvas = window.document.getElementsByTagName('canvas').item(0)
  assertNonNull(canvas, 'Canvas missing.')

  const random = new Random(I32.mod(Date.now()))

  const newRenderer = () =>
    Renderer(canvas, assets.atlas, assets.shaderLayout, assets.atlasMeta)

  const ecs = ECS<GFComponentSet, GFECSUpdate>(
    new Set([
      CamSystem,
      FollowCamSystem,
      new CursorSystem(), // Process first
      FollowPointSystem,
      new FPSSystem(),
      new PickHealthAdderSystem(),
      new SpawnerSystem(),
      RenderSystem, // Last
    ]),
  )
  ECS.addEnt(
    ecs,
    ...newLevelComponents(
      new SpriteFactory(assets.atlasMeta.filmByID),
    ) as GFComponentSet[], // to-do: fix types
  )
  ECS.flush(ecs)

  const cam = NonNull(ECS.query(ecs, 'cam')[0], 'Missing cam entity.').cam
  const self: GreenField = {
    assets,
    cam,
    canvas,
    random,
    instanceBuffer: new InstanceBuffer(assets.shaderLayout),
    ecs,
    input: new Input(cam),
    rendererStateMachine: new RendererStateMachine({
      window,
      canvas,
      onFrame: (delta) => GreenField.onFrame(self, delta),
      onPause: () => {
        self.input.reset()
      },
      newRenderer,
    }),
    tick: 1,
    time: 0,
    cursor: ECS.query(ecs, 'cursor', 'sprites')![0]!.sprites[0], // this api sucks

    filmByID: assets.atlasMeta.filmByID,
  }
  return self
}

export namespace GreenField {
  export async function make(window: Window): Promise<GreenField> {
    const assets = await Assets.load()
    return GreenField(window, assets)
  }

  export function start(self: GreenField): void {
    self.input.register('add')
    self.rendererStateMachine.start()
  }

  export function stop(self: GreenField): void {
    self.input.register('remove')
    self.rendererStateMachine.stop()
    // win.close()
  }

  export function onFrame(self: GreenField, delta: number): void {
    self.tick = delta
    self.time += delta
    self.pickHandled = false

    self.input.preupdate()

    processDebugInput(self)

    ECS.update(self.ecs, self)

    // should actual render be here and not in the ecs?
    self.input.postupdate(self.tick)
  }
}

function processDebugInput(self: GreenField): void {
  if (self.pickHandled) return
  if (
    self.input.isComboStart(
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
    )
  ) {
    Synth.play(Synth(), 'sawtooth', 200, 500, 0.15)
    self.pickHandled = true
    console.log('combo')
  }
  if (
    self.input.isOnStart('DebugContextLoss') &&
    !self.rendererStateMachine.isContextLost()
  ) {
    self.pickHandled = true
    self.rendererStateMachine.loseContext()
    setTimeout(
      () => self.rendererStateMachine.restoreContext(),
      3000,
    )
  }
}
