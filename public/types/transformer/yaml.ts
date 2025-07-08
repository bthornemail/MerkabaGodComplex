type Block = {
    hash: string;
    timestamp: string;
    previousHash: string;
    link?: string;
    data?: string | Uint8Array;
  };
   type FRONT_MATTER = {
    attributes: FRONT_MATTER_ATTRIBUTES;
    body: string;
    frontmatter?: string;
  };
  
  type FRONT_MATTER_ATTRIBUTES = {
    title: string;
    identity: string;
    startDate: string;
    lastEdit: string;
  };
  export {FRONT_MATTER, FRONT_MATTER_ATTRIBUTES}