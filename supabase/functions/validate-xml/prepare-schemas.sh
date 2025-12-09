#!/bin/bash
cd /tmp/cc-agent/61276964/project/supabase/functions/validate-xml/schemas

echo "export const SCHEMAS = {" > ../schemas-data.ts

for file in *.xsd; do
  echo "  '${file}': \`" >> ../schemas-data.ts
  cat "$file" >> ../schemas-data.ts
  echo "\`," >> ../schemas-data.ts
done

echo "};" >> ../schemas-data.ts
