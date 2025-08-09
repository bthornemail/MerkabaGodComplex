import ForceGraph3D from '3d-force-graph';
import { logger } from '../app';
export default async function openGraphView({ onKeyDown }: { onKeyDown: (ev: KeyboardEvent) => Promise<any> }) {
    // alert('HEy');
    canvas.style.width = "100vw";
    graphElement.style.width = "100vh";
    await canvas.requestFullscreen();

    // await document.documentElement.requestFullscreen();
    if ('keyboard' in navigator && 'lock' in (navigator.keyboard as any)) {
        const keyBoard: any = navigator.keyboard
        // Supported!
        keyBoard.lock(); //ll keys
        // await navigator.keyboard.lock([
        //     "KeyW",
        //     "KeyA",
        //     "KeyS",
        //     "KeyD",
        //   ]);
        document.addEventListener('keydown', async (e) => {
            await onKeyDown(e);
            keyBoard.unlock();
        });
        //     document.addEventListener('keydown', (event) => {
        //     const isMinus = (event.code === 'Minus') && !(event.ctrlKey || event.metaKey);
        //     const isPlus = (event.code === 'Equal') && event.shiftKey && !(event.ctrlKey || event.metaKey);
        //     let { x, y, z } = graph.cameraPosition();
        //     // let {x,y,z, lookAt} = graph.cameraPosition();
        //     // let {lx,ly,lz,lw} = lookAt;
        //     // alert(JSON.stringify([[{x,y,z}], [lookAt], [ms]]));

        //     if (isMinus) {
        //         graph.cameraPosition({ x, y, z: --z })//], [lookAt], 1000)
        //         // Do something when the 'A' key was pressed, but only
        //         // when not in combination with the command or control key.
        //         keyBoard.unlock();
        //     }
        //     if (isPlus) {
        //         graph.cameraPosition({ x, y, z: ++z })//, [lookAt], [ms])
        //         // Do something when the 'A' key was pressed, but only
        //         // when not in combination with the command or control key.
        //     } else {
        //         keyBoard.unlock();
        //     }
        // });
    }
    // document.getElementById('graph').classList.add('open-graph-view', true); 
    // document.querySelector('canvas').classList.add('open-graph-view', true);

};
const openGraphForm: HTMLFormElement = document.getElementById("open-graph-view-form") as HTMLFormElement;
const canvas: HTMLCanvasElement = document.querySelector("canvas") as HTMLCanvasElement;
const graphElement: HTMLDivElement = document.querySelector("#graph") as HTMLDivElement;
openGraphForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await openGraphView({ onKeyDown: async(e)=>{
        const {key,code,altKey,ctrlKey,metaKey} = e;
        return logger(`${{key,code,altKey,ctrlKey,metaKey}}`)
    } });
});