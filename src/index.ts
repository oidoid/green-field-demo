import { GreenField } from '@/green-field'
import pkg from '../package.json' assert { type: 'json' }

// [strings][version]
console.log(`Green Field v${pkg.version}
   ┌>°┐
by │  │idoid
   └──┘`)

const patience = await GreenField.make(window)
GreenField.start(patience)
