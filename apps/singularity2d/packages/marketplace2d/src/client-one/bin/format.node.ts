/* eslint-disable @typescript-eslint/no-explicit-any */
export default function formatNode(node: any, type?: string) {
  let update: any = {}
  if (!node.img) {
    node.img = "loading.svg"
  }
  if (node.img) {
    update.img = node.img.includes("/") ? node.img : `src/images/${node.img}`
  }
  if (!node.label && node.title) {
    update.label = `<div className="card">
                      <div className="card-title">${node.title ?? ""}</div>
                </div>`
  }
  if (!node.label && !node.title && node.name) {
    update.label = `<div className="card">
                      <div className="card-title">${node.name ?? ""}</div>
                </div>`
  }

  if (type === "topic") {
    update.img = `src/images/communication-svgrepo-com.svg`
    update.label = `<div className="card">
                      <div className="card-title">${node.title}</div>
                </div>`
  }
  if (type === "chat-message") {
    update.img = `src/images/message-one-svgrepo-com.svg`
    update.label = `<div className="card">
                      <div className="card-title">${node.title}</div>
                </div>`
  }
  if (type === "asset") {
    update.label = `<div className="card">
                <div className="card-title">${node.title ?? ""}</div>
                <div className="card-subtitle">${node.value ?? ""}</div>
                <div className="card-body">${node.summary ?? ""}</div>
          </div>`
  }
  return Object.assign({}, node, update)
}