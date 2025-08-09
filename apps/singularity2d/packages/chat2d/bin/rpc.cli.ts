import { BGPT_READLINE } from "../examples";

export function postJSONRPCCommand({rl}:BGPT_READLINE) {
    // Implement the logic here...
    rpcMenu({rl});  // Return to the main menu after completion
}

export function searchPinnedCIDs({ rl }:BGPT_READLINE) {
    // Implement the logic here...
    rpcMenu({rl});  // Return to the main menu after completion
}

export function getJSONRPCCommandByCID({ rl }:BGPT_READLINE) {
    // Implement the logic here...
    rpcMenu({rl});  // Return to the main menu after completion
}

export function requestPeerToRunCommand({ rl }:BGPT_READLINE) {
    // Implement the logic here...
    rpcMenu({rl});  // Return to the main menu after completion
}

export function completeHandshakeAndRunCode({ rl }:BGPT_READLINE) {
    // Implement the logic here...
    rpcMenu({rl});  // Return to the main menu after completion
}

export function rpcMenu({ rl}:BGPT_READLINE) {
    rl.question(`
Select an action:
1. Post a JSON-RPC command.
2. Search from pinned CIDs.
3. Get a JSON-RPC command by CID and hash.
4. Request for peer to run command or run command for JSON-RPC request.
5. Complete handshake and run code and send response.
6. Exit.

Enter choice: `, (choice) => {
        switch(choice.trim()) {
            case '1': postJSONRPCCommand({ rl }); break;
            case '2': searchPinnedCIDs({ rl }); break;
            case '3': getJSONRPCCommandByCID({ rl }); break;
            case '4': requestPeerToRunCommand({ rl }); break;
            case '5': completeHandshakeAndRunCode({ rl }); break;
            case '6': rl.close(); break;
            default: 
                console.log("Invalid choice. Please select again.");
                rpcMenu({ rl });
        }
    });
}

// rpcMenu({ rl });  // Start with the main menu
