/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from 'react-router-dom'
import { useBroadcast} from '../hooks/useBroadcast'

export function RecentNavItem({ channel }: { channel: string }) {
  return (<li className="breadcrumb-item"><Link to={channel}>{channel}</Link></li>)
}
export default function RecentNav() {
  const { activeChannels } = useBroadcast()
  return (<nav id="topic-breadcrumb-nav" aria-label="breadcrumb">
    <ol id="topic-breadcrumb" className="breadcrumb">
      {activeChannels && Object.values(activeChannels).map((channel: string, index: number) => {
        return <RecentNavItem key={index} channel={channel} />
      })}
    </ol>
  </nav>)
}