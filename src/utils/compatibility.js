export function checkCompatibility(parts) {
  const issues = [];

  const processor = parts.find((part) => part.category === "Processor");
  const motherboard = parts.find((part) => part.category === "Motherboard");

  if (processor && motherboard && processor.socket !== motherboard.socket) {
    issues.push(
      `${processor.name} (${processor.socket}) does not fit ${motherboard.name} (${motherboard.socket}).`
    );
  }

  return issues;
}