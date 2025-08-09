import BlockNodeHUD from './components/Block.Node.HUD.tsx'
// import ContextHUD from './components/Context.HUD.tsx'
import ChatModal from './components/Chat.Modal.tsx'
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from './components/Error.Page.tsx'
import App from './App.tsx'
import Home from './components/Home.tsx';
// import MainHeader from './components/Main.Header.tsx'
import TopicsView from './components/Topics.View.tsx'
// import ForceGraphView from './modules/Force.Graph/Force.Graph.View.tsx';
import Graph from './components/Graph.tsx';
// import Marketplace from './modules/Marketplace/Marketplace.tsx';
// import MarketplaceHome from './modules/Marketplace/components/Home.tsx';
// import PostAssetForm from './modules/Marketplace/components/forms/Post.Asset.Form.tsx';
// import ExamNFT from './modules/Marketplace/components/ExamNFT.tsx';
// import ServiceBoard from './modules/Marketplace/components/Service.Board.tsx';
import Listings from './modules/Marketplace/components/Listings.tsx';
import Listing from './modules/Marketplace/components/Listing.tsx';
import Post from './modules/Marketplace/components/Post.tsx';
// import ViewServicesList from './modules/Marketplace/components/View.Services.List.tsx';
import MQTTNetworkHUD from './components/MQTT.Network.HUD.tsx';
import BlockchainHUD from './components/Blockchain.HUD.tsx';
import PostService from './templates/Post.Service.tsx';
import RegisterAsset from './templates/Register.Asset.tsx';
import PostExam from './templates/Post.Course.tsx';
import Token2D from './modules/Marketplace/components/Token2D.tsx';
import PostListing from './templates/Post.Listing.tsx';
import Store from './components/Store.tsx';
import SocketIoNetworkHUD from './components/Socket.IO.Network.HUD.tsx';
import Merchandise from './components/Merchandise.tsx';
import LifeMap from './modules/LifeMap/LifeMap.tsx';
import GraphHUD from './components/Graph.HUD.tsx';
import OpenDelivery from './modules/Marketplace/components/Open.Delivery.tsx';
import UserProfile from '../../life2d/src/old/user.manager/user/user.profile';
import Node from './components/Node.tsx';
import ConfirmOrder from './modules/Marketplace/components/Confirm.Order.tsx';
import Identity from './components/Identity.tsx';

const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />
      },
      // {
      //   path: "canvas",
      //   element: <MainHeader />
      // },
      {
        path: "network",
        element: <div>
          <BlockchainHUD />
          <GraphHUD />
          <MQTTNetworkHUD />
          <SocketIoNetworkHUD />
          {/* <BlockNodeHUD /> */}
        </div>
      },
      {
        path: "store",
        element: <Store />
      },
      {
        path: "store/:merchaniseId",
        element: <Merchandise />
      },
      {
        path: "Connections/*",
        element: <p>Connections
          <Outlet />
        </p>,
        children: [
          {
            path: "peer/:contactId",
            element: <h1>Peer Id</h1>
          }
        ]
      },
      {
        path: ":node",
        element: <Node/>
      },
      {
        path: "identity",
        element: <Identity/>
      },
      {
        path: "chat",
        element: <ChatModal />
      },
      // {
      //   path: "context",
      //   element: <ContextHUD />
      // },
      {
        path: "topics",
        element: <TopicsView />
      },
      {
        path: "graph",
        element: <Graph />
      },
      {
        path: "Listings",
        element: <Listings />
      },
      {
        path: "listings/:CID",
        element: <Listing />,
      },
      {
        path: "Listings/Confirm/*",
        element: <ConfirmOrder />
      },
      {
        path: "Listings/Post/*",
        element: <Post />,
        children: [
          {
            path: "",
            element: <PostListing />,
          },
          {
            path: "Asset",
            element: <RegisterAsset />,
          },
          {
            path: "Service",
            element: <PostService />,
          },
          {
            path: "Exam",
            element: <PostExam />,
          }
        ]
      },
      {
        path: "Map/*",
        element: <LifeMap />
      }
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />
}
