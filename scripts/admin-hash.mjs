import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline";
// Never pass the password as a command argument. Run this interactively on your own computer.
if (!process.stdin.isTTY) {
  console.error("Jalankan di terminal interaktif pada komputer Anda.");
  process.exit(1);
}
const rl = createInterface({ input: process.stdin, output: process.stdout });
process.stdout.write(
  "Password admin (minimal 14 karakter; tidak ditampilkan): ",
);
rl._writeToOutput = () => {};
rl.question("", (password) => {
  rl.close();
  process.stdout.write("\n");
  if (password.length < 14 || password.length > 256) {
    console.error("Gunakan 14–256 karakter.");
    process.exit(1);
  }
  const salt = randomBytes(16).toString("hex");
  console.log(
    "Salin nilai berikut langsung ke ADMIN_PASSWORD_HASH di Vercel, jangan ke chat:",
  );
  console.log(`${salt}:${scryptSync(password, salt, 64).toString("hex")}`);
});
