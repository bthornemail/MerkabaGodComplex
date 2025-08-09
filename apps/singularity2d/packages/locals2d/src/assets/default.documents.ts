import { DOCUMENT } from "../modules/hypergraph"

export const defaultDocuments: Record<string,{
    document: DOCUMENT
}> = {
  "m/0": {
    document: {
      author: "local2d",
      title: "local2d",
      summary: "Home",
      version: "0.0.0"
    }
  },
  "m/1": {
    document: {
      author: "local2d",
      title: "profile",
      summary: "Profile",
      version: "0.0.0"
    }
  },
  "m/1/0": {
    document: {
      author: "local2d",
      title: "bytes",//"Bytes",
      summary: "Messages",
      version: "0.0.0"
    }
  },
  "m/1/1": {
    document: {
      author: "local2d",
      title: "documents",
      summary: "Documents",
      version: "0.0.0"
    }
  },
  "m/1/2": {
    document: {
      author: "local2d",
      title: "assets",
      summary: "Assets",
      version: "0.0.0"
    }
  },
  "m/1/3": {
    document: {
      author: "local2d",
      title: "services",
      summary: "Services",
      version: "0.0.0"
    }
  },
  "m/2": {
    document: {
      author: "local2d",
      title: "graph",
      summary: "Graph",
      version: "0.0.0"
    }
  },
  "m/3": {
    document: {
      author: "local2d",
      title: "ratings",
      summary: "Ratings",
      version: "0.0.0"
    }
  },
  "m/4": {
    document: {
      author: "local2d",
      title: "reviews",
      summary: "Reviews",
      version: "0.0.0"
    }
  },
  "and": {
    document: {
      author: "local2d",
      title: "and",
      summary: "and",
      version: "0.0.0"
    }
  },
}