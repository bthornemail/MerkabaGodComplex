
 const getContent = (host: string) => {
    let path: string[] = [];
    switch (host) {
        case "record":
            path.push("0")
            console.log(`record`)
        case "response":
            path.push("0")
            console.log(`response`)
        case "request":
            path.push("0")
            console.log(`request`)
        case "service":
            path.push("0")
            console.log(`input\noutput\npath`)
        case "asset":
            path.push("0")
            console.log(`id\nsignature`)
        case "content":
            path.push("0")
            console.log(`title\nsummmary\ndescription\ncontent\nimgSrc\nauthor`)
        default:
            path.push("8151920");
            console.log(`root`)
            break;
    }
    return ["m", ...path.reverse()].join("/");
}
export default getContent;