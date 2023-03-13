export * from './src/assets/assets.ts'
export * from './src/assets/gf-film-id.ts'
export * from './src/ecs/components/pick-health-adder.ts'
export * from './src/ecs/gf-ent.ts'
export * from './src/ecs/systems/pick-health-adder-system.ts'
export * from './src/ecs/systems/spawner-system.ts'
export * from './src/green-field.ts'
export * from './src/level/ent-factory.ts'
export * from './src/level/gf-level-parser.ts'
export * from './src/level/sprite-factory.ts'
export * from './src/sprite/gf-layer.ts'

import levelJSON from './src/level/level.json' assert { type: 'json' }
export const level = levelJSON

import _atlasJSON from './assets/atlas.json' assert { type: 'json' }
export const atlasJSON = _atlasJSON
