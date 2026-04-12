#!/usr/bin/env node
import {render} from 'ink';
// import meow from 'meow';
import App from './app.js';
import {withFullScreen} from 'fullscreen-ink';

// const cli = meow(
// 	`
// 	Usage
// 	  $ ARM_CLI

// 	Options
// 		--name  Your name

// 	Examples
// 	  $ ARM_CLI --name=Jane
// 	  Hello, Jane
// `,
// 	{
// 		importMeta: import.meta,
// 		flags: {
// 			name: {
// 				type: 'string',
// 			},
// 		},
// 	},
// );

withFullScreen(<App />).start(	);
