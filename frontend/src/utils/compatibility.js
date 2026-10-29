export function checkCompatibility(parts) {
  const issues = [];

  const processor = parts.find((part) => part.category === "Processor");
  const motherboard = parts.find((part) => part.category === "Motherboard");

  if (processor?.socket && motherboard?.socket) {
    const sameSocket = processor.socket.toUpperCase() === motherboard.socket.toUpperCase();

    if(! sameSocket){
    issues.push(
      `${processor.name} (${processor.socket}) does not fit ${motherboard.name} (${motherboard.socket}).`
    );
  }}

  return issues;
}