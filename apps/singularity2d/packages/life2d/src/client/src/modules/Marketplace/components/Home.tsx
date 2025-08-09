import { useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import '../Marketplace.css';
import Header from './Header';
import Footer from './Footer';
import RecentHappenings from '../../../components/Recent.Happenings';

type PROGRAM_LINK = { path: string, imgSrc: string, title: string, summary: string }

function ProgramLink({ path, imgSrc, title, summary }: PROGRAM_LINK) {
  const navigate = useNavigate()
  return <div className='link-container btn btn-outline-light' onClick={() => navigate(path)}>
    <Image className='link-image' src={imgSrc} alt='NFT Image' />
    <div className='link-text' style={{ textWrap: "nowrap" }}>
      <strong>{title}</strong>
      <p className='text-dark'>{summary}</p>
    </div>
  </div>
}
function Home() {
  const links = [
    {
      path: "/Connections",
      imgSrc: "/src/images/networking-share-svgrepo-com.svg",
      title: "Peer Connections",
      summary: "peer details"
    }, {
      path: "Token",
      imgSrc: "/src/images/cash-coins-currency-svgrepo-com.svg",
      title: "Token Exchange",
      summary: "token details"
    }, {
      path: "Asset",
      imgSrc: "/src/images/barcode-svgrepo-com (2).svg",
      title: "Asset Manager",
      summary: "nft details"
    }, {
      path: "Exam",
      imgSrc: "/src/images/education-graduation-learning-school-study-svgrepo-com.svg",
      title: "Course Regstry",
      summary: "nft details"
    }, {
      path: "Service",
      imgSrc: "/src/images/process-gear-business-svgrepo-com.svg",
      title: "Service Manager",
      summary: "nft details"
    }
  ]
  return (<div id="marketplace-home-view">
    <Header />
    <div id="marketplace-home-buttons">
      {links.map(({ path, imgSrc, title, summary }: PROGRAM_LINK, index: number) => {
        return <ProgramLink
          key={index}
          path={path}
          imgSrc={imgSrc}
          title={title}
          summary={summary} />
      })}
    </div>
    <Footer />
    <div style={{ height: "100%", gridColumn: "1 / 3", alignItems: "center", display: "flex", justifyContent: "center" }}>
      <RecentHappenings />
    </div>
  </div>);
}

export default Home;
