import { FilmByID } from '@/atlas-pack';
import { GFComponentSet, GFFilmID } from '@/green-field';
import { ECS, ECSUpdate, Sprite } from '@/void';

export interface GFECSUpdate extends ECSUpdate {
  readonly filmByID: FilmByID<GFFilmID>;
  readonly cursor: Sprite;
  readonly ecs: ECS<GFComponentSet, GFECSUpdate>;
}
