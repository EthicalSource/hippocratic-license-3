#!/bin/bash

base=HL

modules=(
    bds 
    ecocide 
    tax
)

# For each module combine with one or more of the other modules.
# Example: bds, bds ecocide, bds ecocide tax.
# Example: ecocide, ecocide tax
# Example: tax, tax bds,  
declare -a license-combo
for i in "${!modules[@]}"; do
    #echo "Key: $i, value: ${modules[$i]}"
    for j in "${!modules[@]}"; do
        builder[$i+1]=${modules[$i]}
        
    done
done

# Sourced from: https://dev.to/meleu/how-to-join-array-elements-in-a-bash-script-303a
joinByChar() {
  local IFS="$1"
  shift
  echo "$*"
}

#joinByChar '-' "${builder[@]^^}"

echo ${builder[@]}

