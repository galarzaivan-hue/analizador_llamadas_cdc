import fs from 'fs';
import path from 'path';

const pngPath = path.resolve('public/cndc_logo.png');
const pngBuffer = fs.readFileSync(pngPath);
const base64Png = `data:image/png;base64,${pngBuffer.toString('base64')}`;

const tsContent = `// Base64 Data URI of the official CNDC logo image
export const CNDC_LOGO_BASE64 = "${base64Png}";
`;

const targetFile = path.resolve('src/assets/cndcLogoData.ts');
fs.mkdirSync(path.dirname(targetFile), { recursive: true });
fs.writeFileSync(targetFile, tsContent);
console.log('Successfully generated src/assets/cndcLogoData.ts');
