function extractTextFromDoc(doc: any): string {
  if (!doc?.content) return "";

  let text = "";

  const walk = (node: any) => {
    if (node.type === "text") {
      text += node.text + " ";
    }
    if (node.content) {
      node.content.forEach(walk);
    }
  };

  doc.content.forEach(walk);

  return text.trim();
}

export { extractTextFromDoc };
