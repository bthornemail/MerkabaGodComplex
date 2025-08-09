import { useState } from "react";

type MARKETPLACE_LINKS = {
  path: string,
  imgSrc: string,
  title: string,
  summary: string
}
export const useMarketplace = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [links, setLinks] = useState<MARKETPLACE_LINKS[]>([
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
  ]);
  return { links,setLinks,error:errorMessage }
}
