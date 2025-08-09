export type BGPT_READLINE_COMMAND = {
    name: string;
    rpc: {
      method: string;
      params: any[];
    };
    allowedArgs: string[];
  };
export default function parseReadlineToExecsync(input: string,commandsFromDB?:BGPT_READLINE_COMMAND[]): {command:string,args?: string[]} {
    const parts = input.trim().split(" ");
    const command = parts[0];
    const filename = parts[1];
    if (!commandsFromDB) {
        console.error("Command not allowed!");
        return {command};
      }
    // Check if the command is in the database
    const commandData = commandsFromDB.find(cmd => cmd.name === command);
    if (!commandData) {
      console.error("Command not allowed!");
      return {command};
    }
  
    let args: string[] = [filename];
  
    // Parse and validate arguments
    for (let i = 2; i < parts.length; i++) {
      const [argName] = parts[i].split("=");
      if (commandData.allowedArgs.includes(argName)) {
        args.push(argName);
        const argValue = parts[i].split("=")[1];
        if (argValue) {
          args.push(argValue);
        }
      } else {
        console.error(`Argument ${argName} not allowed for command ${command}!`);
        return {command, args} ;
      }
    }
  
    // Execute the command
    return({command, args});
  }