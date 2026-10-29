
export function checkBuild(parts) {
  const { cpu, motherboard, ram, gpu, psu } = parts;
  const errors = [];
  const warnings = [];


  if (cpu && motherboard && cpu.specs.socket !== motherboard.specs.socket) {
    errors.push(
      `${cpu.name} uses the ${cpu.specs.socket} socket, but ${motherboard.name} uses ${motherboard.specs.socket}.`
    );
  }


  if (ram && motherboard && ram.specs.ramType !== motherboard.specs.ramType) {
    errors.push(
      `${ram.name} is ${ram.specs.ramType}, but ${motherboard.name} supports ${motherboard.specs.ramType}.`
    );
  }

  // Rule 3: power supply must meet the GPU's recommended wattage
  if (psu && gpu && psu.specs.wattage < gpu.specs.recommendedPsu) {
    errors.push(
      `${gpu.name} needs at least ${gpu.specs.recommendedPsu}W, but ${psu.name} is only ${psu.specs.wattage}W.`
    );
  }

  // Rule 4: estimate total power use (CPU + GPU + about 100W for everything else)
  const estimatedWattage =
    (cpu?.specs.tdp || 0) + (gpu?.specs.tdp || 0) + 100;

  if (psu && psu.specs.wattage < estimatedWattage * 1.2) {
    warnings.push(
      `Your parts use about ${estimatedWattage}W. A ${psu.specs.wattage}W power supply leaves very little spare room.`
    );
  }

  const totalPrice = Object.values(parts)
    .filter(Boolean)
    .reduce((sum, p) => sum + p.price, 0);

  return {
    compatible: errors.length === 0,
    errors,
    warnings,
    estimatedWattage,
    totalPrice,
  };
}