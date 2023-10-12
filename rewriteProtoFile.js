function rewriteProtoFile(content, increment) {
    const lines = content.split('\n');
    let currentNumber = 1;
    let isEnum = false;
    let insideMessageOrEnum = false;

    const newLines = lines.map(line => {
      if (line.includes('message') || line.includes('enum')) {
        currentNumber = line.includes('enum') ? 0 : 1;
        isEnum = line.includes('enum');
        insideMessageOrEnum = true;
      }

      if (line.includes('}') && insideMessageOrEnum) {
        insideMessageOrEnum = false;
      }

      if (insideMessageOrEnum && line.includes('=') && line.includes(';')) {
        const lineParts = line.split('=');
        const comment = lineParts[1].split(';')[1] || ''; // 提取注释
        lineParts[1] = ` ${currentNumber};${comment}`; // 保留注释
        currentNumber += increment;
        return lineParts.join('=');
      }
      return line;
    });

    return newLines.join('\n');
  }