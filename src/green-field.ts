import {
  Assets,
  GFEnt,
  GFRunState,
  newLevelComponents,
  PickHealthAdderSystem,
  SpawnerSystem,
  SpriteFactory,
} from '@/green-field'
import { assertNonNull, NonNull } from '@/ooz'
import {
  CamSystem,
  CursorSystem,
  ECS,
  FollowCamSystem,
  FollowPointSystem,
  FPSSystem,
  Input,
  InstanceBuffer,
  Renderer,
  RendererStateMachine,
  RenderSystem,
  Synth,
  TextSystem,
} from '@/void'

export interface GreenField extends GFRunState { // class pls
  readonly assets: Assets
  readonly canvas: HTMLCanvasElement
  readonly ecs: ECS<GFEnt>
  tick: number
  time: number
}

export function GreenField(
  window: Window,
  assets: Assets,
): GreenField {
  const canvas = window.document.getElementsByTagName('canvas').item(0)
  assertNonNull(canvas, 'Canvas missing.')

  const random = Math.random

  const newRenderer = () =>
    Renderer(canvas, assets.atlas, assets.shaderLayout, assets.atlasMeta)

  const ecs = new ECS<GFEnt>()
  ecs.addSystem(
    new CamSystem(),
    new FollowCamSystem(),
    new CursorSystem(),
    new FollowPointSystem(),
    new TextSystem(),
    new FPSSystem(),
    new PickHealthAdderSystem(),
    new SpawnerSystem(),
    new RenderSystem<GFEnt>(),
  )
  ecs.addEnt(
    ...newLevelComponents(
      new SpriteFactory(assets.atlasMeta.filmByID),
      assets.font,
    ) as GFEnt[], // to-do: fix types
  )
  ecs.patch()

  const cam = NonNull(ecs.query('cam')[0], 'Missing cam entity.').cam
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
      onPause: () => self.input.reset(),
      newRenderer,
    }),
    tick: 1,
    time: 0,
    cursor: ecs.query('cursor & sprite')[0]!.sprite,
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

    self.ecs.run(self)

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
