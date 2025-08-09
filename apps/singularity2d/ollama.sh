#!/bin/bash

OUTPUT="env_setup.txt"
> "$OUTPUT" # Clear file

echo "Setup snapshot generated on: $(date)" >> "$OUTPUT"
echo "Project path: $(pwd)" >> "$OUTPUT"
echo -e "\n---\n" >> "$OUTPUT"

# Directory tree
echo "\$ tree -L 2 -I node_modules -I packages" | tee -a "$OUTPUT"
tree -L 2 -I node_modules -I packages >> "$OUTPUT"
echo -e "\n---\n" >> "$OUTPUT"

# package.json
if [[ -f package.json ]]; then
  echo "\$ cat package.json" | tee -a "$OUTPUT"
  cat package.json >> "$OUTPUT"
  echo -e "\n---\n" >> "$OUTPUT"
fi

# # package-lock.json, pnpm-lock.yaml, or yarn.lock (lockfile)
# if [[ -f package-lock.json ]]; then
#   echo "\$ head -40 package-lock.json (lockfile snapshot)" | tee -a "$OUTPUT"
#   head -40 package-lock.json >> "$OUTPUT"
#   echo -e "\n---\n" >> "$OUTPUT"
# elif [[ -f pnpm-lock.yaml ]]; then
#   echo "\$ head -40 pnpm-lock.yaml (lockfile snapshot)" | tee -a "$OUTPUT"
#   head -40 pnpm-lock.yaml >> "$OUTPUT"
#   echo -e "\n---\n" >> "$OUTPUT"
# elif [[ -f yarn.lock ]]; then
#   echo "\$ head -40 yarn.lock (lockfile snapshot)" | tee -a "$OUTPUT"
#   head -40 yarn.lock >> "$OUTPUT"
#   echo -e "\n---\n" >> "$OUTPUT"
# fi

# tsconfig.json and tsconfig.base.json if exist
for cfg in tsconfig.json tsconfig.base.json; do
  if [[ -f $cfg ]]; then
    echo "\$ cat $cfg" | tee -a "$OUTPUT"
    cat "$cfg" >> "$OUTPUT"
    echo -e "\n---\n" >> "$OUTPUT"
  fi
done

# mocha.config.mjs
if [[ -f mocha.config.mjs ]]; then
  echo "\$ cat mocha.config.mjs" | tee -a "$OUTPUT"
  cat mocha.config.mjs >> "$OUTPUT"
  echo -e "\n---\n" >> "$OUTPUT"
fi

# .vscode/launch.json
if [[ -f .vscode/launch.json ]]; then
  echo "\$ cat .vscode/launch.json" | tee -a "$OUTPUT"
  cat .vscode/launch.json >> "$OUTPUT"
  echo -e "\n---\n" >> "$OUTPUT"
fi

# Environment files (.env or .env.example)
for envfile in .env .env.example; do
  if [[ -f $envfile ]]; then
    echo "\$ cat $envfile" | tee -a "$OUTPUT"
    cat "$envfile" >> "$OUTPUT"
    echo -e "\n---\n" >> "$OUTPUT"
  fi
done

# Sample test specs: first 20 lines each, limit to 3 files max
echo "Sample test files (first 20 lines of up to 3 specs):" >> "$OUTPUT"
spec_files=( $(find test -name '*.spec.ts' | head -3) )
for spec in "${spec_files[@]}"; do
  echo "File: $spec" >> "$OUTPUT"
  head -20 "$spec" >> "$OUTPUT"
  echo -e "\n---\n" >> "$OUTPUT"
done
