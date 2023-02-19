import { GFEnt, SpriteFactory } from '@/green-field'
import { I16, U16 } from '@/oidlib'
import { Font, LevelParser, VoidEntJSON } from '@/void'

interface GFEntJSON extends VoidEntJSON {
}

export namespace GFLevelParser {
  export function parse(
    factory: SpriteFactory,
    json: readonly GFEntJSON[],
    font: Font,
  ): Partial<GFEnt>[] {
    return json.map((setJSON) => parseComponentSet(factory, setJSON, font))
  }
}

function parseComponentSet(
  factory: SpriteFactory,
  json: GFEntJSON,
  font: Font,
): Partial<GFEnt> {
  const set: Partial<
    Record<keyof GFEnt, GFEnt[keyof GFEnt]>
  > = {}
  for (const [key, val] of Object.entries(json)) {
    const component = LevelParser.parseComponent(factory, font, key, val)
    if (component != null) {
      set[key as keyof GFEntJSON] = component
      continue
    }
    switch (key) { // to-do: fail when missing types.
      case '//':
      case 'name':
        break
      case 'health':
        set.health = { health: U16(val) }
        break
      case 'pickHealthAdder':
        set.pickHealthAdder = { delta: I16(val.delta) }
        break
      case 'spawner':
        set.spawner = {}
        break
      default:
        throw Error(`Unsupported level config type "${key}".`)
    }
  }
  return set as GFEnt
}
