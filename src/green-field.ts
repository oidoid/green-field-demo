import {
  Assets,
  GFComponentSet,
  GFECSUpdate,
  newLevelComponents,
  SpriteFactory,
} from '@/green-field';
import { assertNonNull, I32, NonNull, Random } from '@/oidlib';
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
} from '@/void';
import { Synth } from '@/void';

export interface GreenField { // class pls
  readonly assets: Assets;
  readonly canvas: HTMLCanvasElement;
  readonly cam: Cam;
  readonly ecs: ECS<GFComponentSet, GFECSUpdate>;
  readonly input: Input;
  readonly random: Random;
  readonly rendererStateMachine: RendererStateMachine;
  /** The total number of ticks completed. ticks * tick = age. */
  ticks: number;
  age: number;
  /**
   * The exact duration in milliseconds to apply each update. Any number of
   * updates may occur per animation frame.
   */
  tick: number;
  /** The outstanding time elapsed accrual to execute in milliseconds. */
  delta: number;
  readonly instanceBuffer: InstanceBuffer;
  readonly cursor: Sprite;
}

export function GreenField(
  window: Window,
  assets: Assets,
): GreenField {
  const canvas = window.document.getElementsByTagName('canvas').item(0);
  assertNonNull(canvas, 'Canvas missing.');

  const random = new Random(I32.mod(Date.now()));

  const newRenderer = () =>
    Renderer(canvas, assets.atlas, assets.shaderLayout, assets.atlasMeta);

  const ecs = ECS<GFComponentSet, GFECSUpdate>(
    new Set([
      CamSystem,
      FollowCamSystem,
      new CursorSystem(), // Process first
      FollowPointSystem,
      RenderSystem, // Last
    ]),
  );
  ECS.addEnt(
    ecs,
    ...newLevelComponents(
      new SpriteFactory(assets.atlasMeta.filmByID),
    ) as GFComponentSet[], // to-do: fix types
  );
  ECS.flush(ecs);

  const tick = 1000 / 60;

  const cam = NonNull(ECS.query(ecs, 'cam')[0], 'Missing cam entity.').cam;
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
        self.input.reset();
      },
      newRenderer,
    }),
    tick,
    ticks: 0,
    delta: 0,
    get age() {
      return this.tick * this.ticks;
    },
    cursor: ECS.query(ecs, 'cursor', 'sprite')![0]!.sprite, // this api sucks
  };
  return self;
}

export namespace GreenField {
  export async function make(window: Window): Promise<GreenField> {
    const assets = await Assets.load();
    return GreenField(window, assets);
  }

  export function start(self: GreenField): void {
    self.input.register('add');
    self.rendererStateMachine.start();
  }

  export function stop(self: GreenField): void {
    self.input.register('remove');
    self.rendererStateMachine.stop();
    // win.close()
  }

  export function onFrame(self: GreenField, delta: number): void {
    // Add elapsed time to the pending delta total.
    self.delta += delta;

    while (self.delta >= self.tick) {
      self.delta -= self.tick;

      const update: GFECSUpdate = {
        filmByID: self.assets.atlasMeta.filmByID,
        cam: self.cam,
        ecs: self.ecs,
        tick: self.tick,
        input: self.input,
        time: self.age,
        instanceBuffer: self.instanceBuffer,
        rendererStateMachine: self.rendererStateMachine,
        cursor: self.cursor,
      };

      self.input.preupdate();

      processDebugInput(self, update);

      ECS.update(self.ecs, update);

      // should actual render be here and not in the ecs?
      self.input.postupdate(self.tick);

      self.ticks++;
    }
  }
}

function processDebugInput(self: GreenField, update: GFECSUpdate): void {
  if (update.pickHandled) return;
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
    Synth.play(Synth(), 'sawtooth', 200, 500, 0.15);
    update.pickHandled = true;
    console.log('combo');
  }
  if (self.input.isOnStart('DebugContextLoss')) {
    if (!self.rendererStateMachine.isContextLost()) {
      update.pickHandled = true;
      self.rendererStateMachine.loseContext();
      setTimeout(
        () => self.rendererStateMachine.restoreContext(),
        3000,
      );
    }
  }
}
