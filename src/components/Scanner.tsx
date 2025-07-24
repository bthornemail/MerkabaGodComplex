import { useCallback, useContext, useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { ControllerContext } from "../hooks/useController";
import BarcodeScanner from "react-qr-barcode-scanner";

export default function Scanner() {
    const {
        error,
        setError,
        isLoading,
        useContextualSearch,
        selectedNode,
        searchResults,
        setUseContextualSearch,
        setSelectedNode,
        setSearchResults,
        setIsLoading,
    } = useContext(ControllerContext);
    const [value, setValue] = useState<string>("");
    return (<div>
        {isLoading && <div className="zg-loading">Searching...</div>}
        {error && <div className="zg-error">{error}</div>}// Can be anything instead of `maxWidth` that limits the width.
        <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
            <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={value}
                viewBox={`0 0 256 256`}
            />
        </div>

        <BarcodeScanner
            width={500}
            height={500}
            onUpdate={(err, result) => {
                if (result) setValue(result.getText());
                else setValue("Not Found");
                result?.getText() && alert(JSON.stringify(result,null,2))
            }}
        />
    </div>);
}