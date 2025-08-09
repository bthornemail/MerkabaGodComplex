#!/bin/bash

echo "Rebuilding .gitmodules and installing submodules..."

declare -A submodules=(
  ["packages/agent2d"]="git@github.com:bthornemail/agent2d.git"
  ["packages/auth2d"]="git@github.com:bthornemail/auth2d.git"
  ["packages/broker2d"]="git@github.com:bthornemail/broker2d.git"
  ["packages/chat2d"]="git@github.com:bthornemail/chat2d.git"
  ["packages/document2d"]="git@github.com:bthornemail/document2d.git"
  ["packages/hypergraph2d"]="git@github.com:bthornemail/hypergraph2d.git"
  ["packages/journal2d"]="git@github.com:bthornemail/journal2d.git"
  ["packages/knowledge2d"]="git@github.com:bthornemail/knowledge2d.git"
  ["packages/ledger2d"]="git@github.com:bthornemail/ledger2d.git"
  ["packages/life2d"]="git@github.com:bthornemail/life2d.git"
  ["packages/locals2d"]="git@github.com:bthornemail/locals2d.git"
  ["packages/marketplace2d"]="git@github.com:bthornemail/marketplace2d.git"
  ["packages/map2d"]="git@github.com:bthornemail/map2d.git"
  ["packages/network2d"]="git@github.com:bthornemail/network2d.git"
  ["packages/unity2d"]="git@github.com:bthornemail/unity2d.git"
  ["packages/universe2d"]="git@github.com:bthornemail/universe2d.git"
  ["packages/vault2d"]="git@github.com:bthornemail/vault2d.git"
#   ["pages/service-champion"]="git@github.com:bthornemail/service-champion.git"
#   ["pages/qrcoder"]="git@github.com:bthornemail/qrcoder.git"
#   ["pages/Gantt"]="git@github.com:bthornemail/Gantt.git"
#   ["pages/loveconnection.io"]="git@github.com:bthornemail/loveconnection.io.git"
#   ["pages/car.wash"]="git@github.com:bthornemail/car.wash.git"
#   ["modules/entity2d"]="git@github.com:bthornemail/entity2d.git"
#   ["modules/canvas-ui"]="git@github.com:bthornemail/canvas-ui.git"
#   ["modules/logistics_hub"]="git@github.com:bthornemail/logistics_hub.git"
#   ["modules/mqtt-broker"]="git@github.com:bthornemail/mqtt-broker.git"
#   ["modules/vault-ai"]="git@github.com:bthornemail/vault-ai.git"
#   ["modules/graph-neural-network"]="git@github.com:bthornemail/graph-neural-network.git"
#   ["modules/block-node"]="git@github.com:bthornemail/block-node.git"
#   ["modules/json-rpc-cli"]="git@github.com:bthornemail/json-rpc-cli.git"
#   ["modules/bgpt"]="git@github.com:bthornemail/bgpt.git"
#   ["modules/vector-db"]="git@github.com:bthornemail/vector-db.git"
#   ["modules/block-chain"]="git@github.com:bthornemail/block-chain.git"
#   ["modules/block-function-chain"]="git@github.com:bthornemail/block-function-chain.git"
)

for path in "${!submodules[@]}"; do
  url="${submodules[$path]}"
  echo "Adding submodule: $path → $url"
  git submodule add "$url" "$path"
done

echo "Syncing and updating submodules..."
git submodule sync
git submodule update --init --recursive

echo "✅ Submodules installed!"
