const getHost = (host: string) => {
    let path: string[] = [];
    path.push("8151920");
    switch (host) {
        case "customer":
            path.push("0");
            console.log(`customer`);
        case "contractor":
            path.push("0");
            console.log(`contractor`);
        case "consumer":
            path.push("0");
            console.log(`consumer`);
        case "provider":
            path.push("0");
            console.log(`provider`);
        case "host":
            path.push("0");
            console.log(`host`);
        default:
            console.log(`root`)
            break;
    }
    console.log(["m", ...path.reverse()].join("/"))
    return ["m", ...path.reverse()].join("/");
}
export default getHost;
