/* eslint-disable @typescript-eslint/no-explicit-any */
export default function HudView(props: any) {
  const { eventData } = props
  return (<>
    Hud
    { eventData && <div className="card">
      <div className="card-body">X: {eventData.x}, Y: {eventData.y}</div>
      <div className="card-footer">{eventData.timeStamp}</div>
    </div>}
  </>)
}