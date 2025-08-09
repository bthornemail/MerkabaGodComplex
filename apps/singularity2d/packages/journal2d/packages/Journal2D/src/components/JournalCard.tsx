import { useCallback, useEffect, useState } from "react";
import { SimpleMdeReact } from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import frontMatter from "front-matter";
import { Button, Card } from 'react-bootstrap';
import "./styles.css";
import { MATTER_ATTRIBUTES, MATTER, formatMD, generateNewEntry } from "../App";
import { HDNodeWallet } from "ethers";
import Markdown from 'marked-react';
import { useDebounce } from "../useDebounce";

export const JournalCardTitle = ({ content, setFocused }) => {
  const [metadata, setMetadata] = useState<MATTER_ATTRIBUTES>({ identity: HDNodeWallet.createRandom().neuter().extendedKey, title: "New Entry", path:"/",startDate: new Date().toISOString(), lastEdit: new Date().toISOString() });
  // const [body, setBody] = useState("");

  useEffect(() => {
    if (typeof content === "string") {
      const parsed = frontMatter(content) as MATTER;
      // console.log(parsed)
      setMetadata(parsed.attributes || {});
      // setBody(parsed.body || "");
    } else {
      console.error("Content is not a valid string for front-matter parsing.");
    }
  }, [content]);
  return (
    <a href={"#" + metadata.identity} style={{ padding: ".25rem", textDecoration: "none", width: "min-content", display: "flex", flexDirection: "column", gap: ".5rem", height: "min-content" }} onClick={() => setFocused(metadata.identity)}>
      <small className="badge text-secondary">{metadata.title}
        <br />
        Last Edited: {new Date(metadata.lastEdit).toLocaleString()}
      </small>
    </a>
  );
};
const JournalCard = ({ content, onUpdate, focused, setFocused }) => {
  const [metadata, setMetadata] = useState<MATTER_ATTRIBUTES>(generateNewEntry().attributes);
  const [body, setBody] = useState("");

  useEffect(() => {
    if (typeof content === "string") {
      const parsed = frontMatter(content) as MATTER;
      setMetadata(parsed.attributes || {});
      setBody(parsed.body || "");
    } else {
      console.error("Content is not a valid string for front-matter parsing.");
    }
  }, [content]);
  const debouncedOnChange = useDebounce((updatedContent) => {
    setBody(updatedContent);
    onUpdate(formatMD({ body: updatedContent, attributes: metadata }));
  }, 300);

  const onChange = useCallback(
    (updatedContent) => {
      debouncedOnChange(updatedContent);
    },
    [debouncedOnChange]
  );
  useEffect(() => {
    if (focused === metadata.identity) {
      document.getElementById(metadata.identity)?.focus();
    }
  }, [focused, metadata.identity]);

  return (
    <div id={metadata.identity}>
      <Card style={{ height: "95%" }} className="my-3">
        <Card.Header>
          <h5>{metadata.title}</h5>
          <sup style={{color:"grey"}}>{metadata.path}/{HDNodeWallet.fromExtendedKey(metadata.identity).address}</sup>
          <br />
          <small>Started: {new Date(metadata.startDate).toLocaleString()}</small>
        </Card.Header>
        <Card.Body style={{ width: "100%", height: "100%" }}>
          {focused === metadata.identity ? (
            <SimpleMdeReact value={body} onChange={onChange} nonce={metadata.identity}/>
          ) : (
            <Markdown value={body} />
          )}
        </Card.Body>

        {/* <Card style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", padding: "8px" }}>
          <Image src="/src/img/file-svgrepo-com.svg" width={36} />
          <Image src="/src/img/block-svgrepo-com.svg" width={36} />
          <Image src="/src/img/server-path-svgrepo-com.svg" width={36} />
        </Card> */}

        <Card.Footer style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <small>Last Edited: {new Date(metadata.lastEdit).toLocaleString()}</small>
            {/* <Button className="btn-warning" onClick={() => verify(content)} disabled>Verify</Button> */}
            {focused === metadata.identity ? (
            <Button className="btn-success" onClick={() => setFocused("")}>
              Save
            </Button>
          ) : (
            <Button onClick={() => setFocused(metadata.identity)}>Edit</Button>
          )}
        </Card.Footer>
      </Card>
    </div>
  );
};

export default JournalCard;
