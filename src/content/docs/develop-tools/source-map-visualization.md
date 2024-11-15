---
title: sourcemap 可视化工具
description: sourcemap 可视化工具
---

https://github.com/evanw/source-map-visualization

```ts
const vlqTable = new Uint8Array(128);
const vlqChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (let i = 0; i < vlqTable.length; i++) vlqTable[i] = 0xFF;
for (let i = 0; i < vlqChars.length; i++) vlqTable[vlqChars.charCodeAt(i)] = i;

function generateInverseMappings(sources, data) {
  let longestDataLength = 0;

  // Scatter the mappings to the individual sources
  for (let i = 0, n = data.length; i < n; i += 6) {
    const originalSource = data[i + 2];
    if (originalSource === -1) continue;

    const source = sources[originalSource];
    let inverseData = source.data;
    let j = source.dataLength;

      // Append the mapping to the typed array
      if (j + 6 > inverseData.length) {
        const newLength = inverseData.length << 1;
        const newData = new Int32Array(newLength > 1024 ? newLength : 1024);
        newData.set(inverseData);
        source.data = inverseData = newData;
      }
      inverseData[j] = data[i];
      inverseData[j + 1] = data[i + 1];
      inverseData[j + 2] = originalSource;
      inverseData[j + 3] = data[i + 3];
      inverseData[j + 4] = data[i + 4];
      inverseData[j + 5] = data[i + 5];
      j += 6;
      source.dataLength = j;
      if (j > longestDataLength) longestDataLength = j;
    }

    // Sort the mappings for each individual source
    const temp = new Int32Array(longestDataLength);
    for (const source of sources) {
      const data = source.data.subarray(0, source.dataLength);

      // Sort lazily for performance
      let isSorted = false;
      Object.defineProperty(source, 'data', {
        get() {
          if (!isSorted) {
            temp.set(data);
            topDownSplitMerge(temp, 0, data.length, data);
            isSorted = true;
          }
          return data;
        },
      })
    }

    // From: https://en.wikipedia.org/wiki/Merge_sort
    function topDownSplitMerge(B, iBegin, iEnd, A) {
      if (iEnd - iBegin <= 6) return;
      const iMiddle = ((iEnd / 6 + iBegin / 6) >> 1) * 6;
      topDownSplitMerge(A, iBegin, iMiddle, B);
      topDownSplitMerge(A, iMiddle, iEnd, B);
      topDownMerge(B, iBegin, iMiddle, iEnd, A);
    }

    // From: https://en.wikipedia.org/wiki/Merge_sort
    function topDownMerge(A, iBegin, iMiddle, iEnd, B) {
      let i = iBegin, j = iMiddle;
      for (let k = iBegin; k < iEnd; k += 6) {
        if (i < iMiddle && (j >= iEnd ||
          // Compare mappings first by original line (index 3) and then by original column (index 4)
          A[i + 3] < A[j + 3] ||
          (A[i + 3] === A[j + 3] && A[i + 4] <= A[j + 4])
        )) {
          B[k] = A[i];
          B[k + 1] = A[i + 1];
          B[k + 2] = A[i + 2];
          B[k + 3] = A[i + 3];
          B[k + 4] = A[i + 4];
          B[k + 5] = A[i + 5];
          i += 6;
        } else {
          B[k] = A[j];
          B[k + 1] = A[j + 1];
          B[k + 2] = A[j + 2];
          B[k + 3] = A[j + 3];
          B[k + 4] = A[j + 4];
          B[k + 5] = A[j + 5];
          j += 6;
        }
      }
    }
  }

function decodeMappings(mappings, sourcesCount) {
    const n = mappings.length;
    let data = new Int32Array(1024);
    let dataLength = 0;
    let generatedLine = 0;
    let generatedLineStart = 0;
    let generatedColumn = 0;
    let originalSource = 0;
    let originalLine = 0;
    let originalColumn = 0;
    let originalName = 0;
    let needToSortGeneratedColumns = false;
    let i = 0;

    function decodeError(text) {
      const error = `Invalid VLQ data at index ${i}: ${text}`;
      showLoadingError(`The "mappings" field of the imported source map contains invalid data. ${error}.`);
      throw new Error(error);
    }

    function decodeVLQ() {
      let shift = 0;
      let vlq = 0;

      // Scan over the input
      while (true) {
        // Read a byte
        if (i >= mappings.length) decodeError('Expected extra data');
        const c = mappings.charCodeAt(i);
        if ((c & 0x7F) !== c) decodeError('Invalid character');
        const index = vlqTable[c & 0x7F];
        if (index === 0xFF) decodeError('Invalid character');
        i++;

        // Decode the byte
        vlq |= (index & 31) << shift;
        shift += 5;

        // Stop if there's no continuation bit
        if ((index & 32) === 0) break;
      }

      // Recover the signed value
      return vlq & 1 ? -(vlq >> 1) : vlq >> 1;
    }

    while (i < n) {
      let c = mappings.charCodeAt(i);

      // Handle a line break
      if (c === 59 /* ; */) {
        // The generated columns are very rarely out of order. In that case,
        // sort them with insertion since they are very likely almost ordered.
        if (needToSortGeneratedColumns) {
          for (let j = generatedLineStart + 6; j < dataLength; j += 6) {
            const genL = data[j];
            const genC = data[j + 1];
            const origS = data[j + 2];
            const origL = data[j + 3];
            const origC = data[j + 4];
            const origN = data[j + 5];
            let k = j - 6;
            for (; k >= generatedLineStart && data[k + 1] > genC; k -= 6) {
              data[k + 6] = data[k];
              data[k + 7] = data[k + 1];
              data[k + 8] = data[k + 2];
              data[k + 9] = data[k + 3];
              data[k + 10] = data[k + 4];
              data[k + 11] = data[k + 5];
            }
            data[k + 6] = genL;
            data[k + 7] = genC;
            data[k + 8] = origS;
            data[k + 9] = origL;
            data[k + 10] = origC;
            data[k + 11] = origN;
          }
        }

        generatedLine++;
        generatedColumn = 0;
        generatedLineStart = dataLength;
        needToSortGeneratedColumns = false;
        i++;
        continue;
      }

      // Ignore stray commas
      if (c === 44 /* , */) {
        i++;
        continue;
      }

      // Read the generated column
      const generatedColumnDelta = decodeVLQ();
      if (generatedColumnDelta < 0) needToSortGeneratedColumns = true;
      generatedColumn += generatedColumnDelta;
      if (generatedColumn < 0) decodeError('Invalid generated column');

      // It's valid for a mapping to have 1, 4, or 5 variable-length fields
      let isOriginalSourceMissing = true;
      let isOriginalNameMissing = true;
      if (i < n) {
        c = mappings.charCodeAt(i);
        if (c === 44 /* , */) {
          i++;
        } else if (c !== 59 /* ; */) {
          isOriginalSourceMissing = false;

          // Read the original source
          const originalSourceDelta = decodeVLQ();
          originalSource += originalSourceDelta;
          if (originalSource < 0 || originalSource >= sourcesCount) decodeError('Invalid original source');

          // Read the original line
          const originalLineDelta = decodeVLQ();
          originalLine += originalLineDelta;
          if (originalLine < 0) decodeError('Invalid original line');

          // Read the original column
          const originalColumnDelta = decodeVLQ();
          originalColumn += originalColumnDelta;
          if (originalColumn < 0) decodeError('Invalid original column');

          // Check for the optional name index
          if (i < n) {
            c = mappings.charCodeAt(i);
            if (c === 44 /* , */) {
              i++;
            } else if (c !== 59 /* ; */) {
              isOriginalNameMissing = false;

              // Read the optional name index
              const originalNameDelta = decodeVLQ();
              originalName += originalNameDelta;
              if (originalName < 0) decodeError('Invalid original name');

              // Handle the next character
              if (i < n) {
                c = mappings.charCodeAt(i);
                if (c === 44 /* , */) {
                  i++;
                } else if (c !== 59 /* ; */) {
                  decodeError('Invalid character after mapping');
                }
              }
            }
          }
        }
      }

      // Append the mapping to the typed array
      if (dataLength + 6 > data.length) {
        const newData = new Int32Array(data.length << 1);
        newData.set(data);
        data = newData;
      }
      data[dataLength] = generatedLine;
      data[dataLength + 1] = generatedColumn;
      if (isOriginalSourceMissing) {
        data[dataLength + 2] = -1;
        data[dataLength + 3] = -1;
        data[dataLength + 4] = -1;
      } else {
        data[dataLength + 2] = originalSource;
        data[dataLength + 3] = originalLine;
        data[dataLength + 4] = originalColumn;
      }
      data[dataLength + 5] = isOriginalNameMissing ? -1 : originalName;
      dataLength += 6;
    }

    return data.subarray(0, dataLength);
  }

function parseSourceMap(json) {
    try {
      json = JSON.parse(json);
    } catch (e) {
      throw e;
    }

    if (json.version !== 3) {
      throw new Error('Invalid source map');
    }

    if (!(json.sources instanceof Array) || json.sources.some(x => typeof x !== 'string')) {
      throw new Error('Invalid source map');
    }

    if (typeof json.mappings !== 'string') {
      throw new Error('Invalid source map');
    }

    const { sources, sourcesContent, names, mappings } = json;
    const emptyData = new Int32Array(0);
    for (let i = 0; i < sources.length; i++) {
      sources[i] = {
        name: sources[i],
        content: sourcesContent && sourcesContent[i] || '',
        data: emptyData,
        dataLength: 0,
      };
    }

    const data = decodeMappings(mappings, sources.length);
    generateInverseMappings(sources, data);
    return { sources, names, data };
  }


parseSourceMap(`{
  "version": 3,
  "file": "original.js",
  "sourceRoot": "",
  "sources": [
    "original.coffee"
  ],
  "names": [],
  "mappings": ";AAAa;EAAA;AAAA,MAAA,KAAA,EAAA,IAAA,EAAA,IAAA,EAAA,GAAA,EAAA,MAAA,EAAA,QAAA,EAAA,IAAA,EAAA;;EACb,MAAA,GAAW;;EACX,QAAA,GAAW;;EAGX,IAAgB,QAAhB;;IAAA,MAAA,GAAS,CAAC,GAAV;GALa;;;EAQb,MAAA,GAAS,QAAA,CAAC,CAAD,CAAA;WAAO,CAAA,GAAI;EAAX,EARI;;;EAWb,IAAA,GAAO,CAAC,CAAD,EAAI,CAAJ,EAAO,CAAP,EAAU,CAAV,EAAa,CAAb,EAXM;;;EAcb,IAAA,GACE;IAAA,IAAA,EAAQ,IAAI,CAAC,IAAb;IACA,MAAA,EAAQ,MADR;IAEA,IAAA,EAAQ,QAAA,CAAC,CAAD,CAAA;aAAO,CAAA,GAAI,MAAA,CAAO,CAAP;IAAX;EAFR,EAfW;;;EAoBb,IAAA,GAAO,QAAA,CAAC,MAAD,EAAA,GAAS,OAAT,CAAA;WACL,KAAA,CAAM,MAAN,EAAc,OAAd;EADK;;EAIP,IAAsB,8CAAtB;;IAAA,KAAA,CAAM,YAAN,EAAA;GAxBa;;;EA2Bb,KAAA;;AAAS;IAAA,KAAA,sCAAA;;mBAAA,IAAI,CAAC,IAAL,CAAU,GAAV;IAAA,CAAA;;;AA3BI",
  "sourcesContent": [
    "# Assignment:\\nnumber   = 42\\nopposite = true\\n\\n# Conditions:\\nnumber = -42 if opposite\\n\\n# Functions:\\nsquare = (x) -> x * x\\n\\n# Arrays:\\nlist = [1, 2, 3, 4, 5]\\n\\n# Objects:\\nmath =\\n  root:   Math.sqrt\\n  square: square\\n  cube:   (x) -> x * square x\\n\\n# Splats:\\nrace = (winner, runners...) ->\\n  print winner, runners\\n\\n# Existence:\\nalert \\"I knew it!\\" if elvis?\\n\\n# Array comprehensions:\\ncubes = (math.cube num for num in list)\\n"
  ]
}`)
```