import { ChangeEvent } from "react";
import { useBroadcast} from "../hooks/useBroadcast"
export default function CurrentTopics() {
  const {
    subscriptions,
    activeChannels,
    viewChannel,
  } = useBroadcast();
  return (<form id="topics-form" className="form input-group">
    <select id="topics" className="form-select" onChange={(e: ChangeEvent<HTMLSelectElement>)=>viewChannel(e.currentTarget.value)} aria-label="Small select example"  name="topics">
      <option value="Topics">Topics</option>
      <optgroup label="Subscriptions">
        {subscriptions && Array.from(subscriptions).map((subscription: string,key:number)=>{
          return (<option key={key} value={subscription}>{activeChannels.has(subscription)? `\u{1F7E9}` : "\u{1F7E5}"}{subscription}</option>)
        })}
      </optgroup>
    </select>
    <input type="text" className="form-control" name="topic" />
    <button type="submit" className="btn btn-primary">Search</button>
  </form>)
}