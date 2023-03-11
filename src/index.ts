import { GreenField } from '@/green-field'
import config from '../deno.json' assert { type: 'json' }

// [strings][version]
console.log(`Green Field v${config.version}
   ┌>°┐
by │  │idoid
   └──┘`)

const patience = await GreenField.make(window)
GreenField.start(patience)
