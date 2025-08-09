// Include process module

import process from 'node:process';

// Printing process.config property value
const config = process.config;
const { OS, host_arch, target_arch } = config.variables as any;
console.log({ OS, host_arch, target_arch });
