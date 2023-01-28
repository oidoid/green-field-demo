import { GFComponentSet, SpriteFactory } from '@/green-field'
import { I16, U16 } from '@/oidlib'
import { ComponentSetJSON, Font, LevelParser } from '@/void'

interface GFComponentSetJSON extends ComponentSetJSON {
}

export namespace GFLevelParser {
  export function parse(
    factory: SpriteFactory,
    json: readonly GFComponentSetJSON[],
    font: Font,
  ): Partial<GFComponentSet>[] {
    return json.map((setJSON) => parseComponentSet(factory, setJSON, font))
  }
}

function parseComponentSet(
  factory: SpriteFactory,
  json: GFComponentSetJSON,
  font: Font,
): Partial<GFComponentSet> {
  const set: Partial<
    Record<keyof GFComponentSet, GFComponentSet[keyof GFComponentSet]>
  > = {}
  for (const [key, val] of Object.entries(json)) {
    const component = LevelParser.parseComponent(factory, font, key, val)
    if (component != null) {
      set[key as keyof GFComponentSetJSON] = component
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
      default:
        throw Error(`Unsupported level config type "${key}".`)
    }
  }
  return set as GFComponentSet
}
