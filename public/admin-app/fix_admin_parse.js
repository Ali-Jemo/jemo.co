const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

code = code.replace(
  /<td dir="ltr" style="text-align:right; font-size:14px; color:var\(--primary\);">\$\{app\.telegram \|\| '-'\}<\/td>/g,
  '<td dir="ltr" style="text-align:right; font-size:14px; color:var(--primary);">${app.telegram ? (app.telegram.includes(\'|\') ? app.telegram.split(\'|\')[1] : app.telegram) : \'-\'}</td>'
);

code = code.replace(
  /onclick="acceptApplication\('\$\{app\.id\}', '\$\{app\.telegram\}'/g,
  'onclick="acceptApplication(\'${app.id}\', \'${app.telegram ? app.telegram.split(\\'|\\')[0] : \'\'}\''
);

code = code.replace(
  /onclick="rejectApplication\('\$\{app\.id\}', '\$\{app\.telegram\}'\)"/g,
  'onclick="rejectApplication(\'${app.id}\', \'${app.telegram ? app.telegram.split(\\'|\\')[0] : \'\'}\')"'
);

code = code.replace(
  /formData\.append\("caption", `🎓 \*\*تهانينا! تمت الموافقة على طلبك\.\*\*\\n\\nتجد مرفقاً بطاقة الدخول الرسمية \(VIP\) الخاصة بك\.\\n\\nنتطلع لرؤيتك!`\);\n\s*formData\.append\("parse_mode", "Markdown"\);/g,
  'formData.append("caption", `🎓 <b>تهانينا! تمت الموافقة على طلبك.</b>\\n\\nتجد مرفقاً بطاقة الدخول الرسمية (VIP) الخاصة بك.\\n\\nنتطلع لرؤيتك!`);\n    formData.append("parse_mode", "HTML");'
);

fs.writeFileSync('script.js', code);
