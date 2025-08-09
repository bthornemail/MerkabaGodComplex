import DataView from "./DataView/Data.View";
import HudView from './DataView/Hud.View';
import "./Force.Graph.View.css"

export default function ForceGraphHUD({nodeData,eventData}){
	return (<div id="hud-dataview">
		<div id="hud" style={{ gridArea: "hud" }}>
			<HudView nodeData={nodeData} eventData={eventData} />
		</div>
		<div id="dataview" style={{ gridArea: "dataview" }}>
			<DataView nodeData={nodeData} eventData={eventData} />
		</div>
	</div>)
}

