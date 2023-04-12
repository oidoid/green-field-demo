import { GFEnt, SpriteFactory } from '@/green-field'
import { Font, parseComponent, VoidEntJSON } from '@/void'

interface GFEntJSON extends VoidEntJSON {
}

export function parseLevel(
  factory: SpriteFactory,
  json: Iterable<GFEntJSON>,
  font: Font,
): Partial<GFEnt>[] {
  const ents = []
  for (const entJSON of json) {
    ents.push(parseComponentSet(factory, entJSON, font))
  }
  return ents
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
    const component = parseComponent(factory, font, key, val)
    if (component != null) {
      set[key as keyof GFEntJSON] = component
      continue
    }
    switch (key) { // to-do: fail when missing types.
      case '//':
      case 'name':
        break
      case 'health':
        set.health = { points: val }
        break
      case 'pickHealthAdder':
        set.pickHealthAdder = { delta: val.delta }
        break
      case 'spawner':
        set.spawner = []
        break
      default:
        throw Error(`Unsupported level config type "${key}".`)
    }
  }
  return set as GFEnt
}
