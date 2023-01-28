import { GFComponentSet, SpriteFactory } from '@/green-field'
import { I16, U16, Uint } from '@/oidlib'
import { ComponentSetJSON, LevelParser } from '@/void'

interface GFComponentSetJSON extends ComponentSetJSON {
}

export namespace GFLevelParser {
  export function parse(
    factory: SpriteFactory,
    json: readonly GFComponentSetJSON[],
  ): Partial<GFComponentSet>[] {
    return json.map((setJSON) => parseComponentSet(factory, setJSON))
  }
}

function parseComponentSet(
  factory: SpriteFactory,
  json: GFComponentSetJSON,
): Partial<GFComponentSet> {
  const set: Partial<GFComponentSet> = {}
  for (const [key, val] of Object.entries(json)) {
    const component = LevelParser.parseComponent(factory, key, val)
    if (component != null) {
      // deno-lint-ignore no-explicit-any
      set[key as keyof GFComponentSetJSON] = component as any
      continue
    }
    switch (key) { // to-do: fail when missing types.
      case '//':
      case 'name':
        break
      case 'health':
        set.health = U16(val)
        break
      case 'pickHealthAdder':
        set.pickHealthAdder = { delta: I16(val.delta) }
        break
      case 'spawner':
        set.spawner = []
        break
      case 'fps':
        set.fps = {
          prev: 0,
          next: { created: performance.now(), frames: Uint(0) },
        }
        break
      default:
        throw Error(`Unsupported level config type "${key}".`)
    }
  }
  return set
}
