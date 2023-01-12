import { AtlasMeta } from '@/atlas-pack';
import { GFFilmID } from '@/green-field';
import { assertExists } from 'std/testing/asserts.ts';
import atlasJSON from '../../assets/atlas.json' assert { type: 'json' };

Deno.test('Atlas and FilmIDs are aligned.', () => {
  const atlasMeta = atlasJSON as unknown as AtlasMeta<GFFilmID>;
  for (const id of GFFilmID.values) {
    assertExists(atlasMeta.filmByID[id], `Atlas missing ${id} FilmID.`);
  }
  for (const id of Object.keys(atlasMeta.filmByID)) {
    assertExists(GFFilmID.values.has(id as GFFilmID), `FilmID missing ${id}.`);
  }
});
