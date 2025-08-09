document.querySelector("#block-node-dialog").innerHTML = `<div class="container">
<h1>Select Node</h1>
    <div>
      <button class="btn btn-success" onclick="window.helia.start();alert(heliaInstance)" disabled>Start Helia</button>
      <button class="btn btn-danger" onclick="window.helia.stop()" disabled>Stop Helia</button>
    </div>
    <!-- <form class="form"> -->
    <div class="input-group">
      <button id="connect-button" class="btn btn-primary"
        onclick="window.helia.libp2p.dialProtocol(document.querySelector('#connect-input-multiaddr').value,document.querySelector('#connect-input-protocol').value);">Dial
        Protocol</button>
      <input id="connect-input-multiaddr" placeholder="Multiaddr"
        value="/ip4/127.0.0.1/tcp/35354/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3/ws"
        class="form-control" type="text">
      <input id="connect-input-protocol" placeholder="Protocol" value="/vault_ai/0.0.1" class="form-control"
        type="text">
    </div>
    <!-- </form> -->
    <section class="node-select-grid">
      <div>
        <div class="input-group">
          <button class="btn btn-light" onclick="document.querySelector('#create-node-text-area-dialog').showModal()">Create A Node</button>
          <button id="search-nodes-button" class="btn btn-primary" onclick="window.confirm('Will be able to search for input nodes')" disabled>Search Node</button>
          <input id="input-node-string" placeholder="Input Node" value="16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3/ws" class="form-control" type="text" disabled>
          <button id="add-input-node-button" class="btn btn-primary" onclick="window.confirm('Will be able to add input nodes')" disabled>Add Node</button>
        </div>
      </div>
    </section>
    <button class="btn btn-danger" style="float: right;"
      onclick="document.querySelector('#block-node-dialog').close()">Close</button>
</div>`
