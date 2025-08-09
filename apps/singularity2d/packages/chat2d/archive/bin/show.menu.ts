/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-console */
import figlet from 'figlet'
import { blink, blue, bright, red, reset, white, yellow } from './console.colors.js'
import { BlockNode, MENU_OPTION, NODE_OPTIONS, START_MENU_PROPS } from '../types/Vault.AI.types.js'

export default function showMenu (options: START_MENU_PROPS): void {
    // await super.start(options)
    console.clear()
    const { title, summary, description, alert, menu } = options
    const terminalWidth = process.stdout.columns
    const horizontalBar = '-'.repeat(terminalWidth / 3)
    console.log(blink, bright, blue, figlet.textSync(title), reset)
    console.log(bright, blue, horizontalBar, reset)
    if (alert != null) {
	console.log(bright, red, horizontalBar, reset)
	console.log(alert)
	console.log(bright, red, horizontalBar, reset)
    }
    if (summary != null) {
	console.log(summary)
	console.log(bright, white, horizontalBar, reset)
    }
    if (description != null) {
	console.log(description)
	console.log(bright, white, horizontalBar, reset)
    }
    if (menu != null) {
	menu.forEach((value: MENU_OPTION, index: number) => {
	    console.log(bright, yellow, `${index}.`, value.name, reset, value.summary)
	})
	console.log(bright, white, horizontalBar, reset)
    }
}
