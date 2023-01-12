import { GFComponentSet, GFLevelParser, SpriteFactory } from '@/green-field';
import level from './level.json' assert { type: 'json' };

export function newLevelComponents(
  factory: SpriteFactory,
): Partial<GFComponentSet>[] {
  // to-do: detect mobile platforms and hide cursor initially.
  // to-do: limit cursor movement to play area.
  return [
    ...GFLevelParser.parse(factory, level),
  ];
}
