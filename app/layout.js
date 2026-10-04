import "./globals.css";
import "./intro.css";
import "./overrides.css";
import "./explore.css";
import "./motion.css";
import "./history.css";
import "./atmosphere.css";
import "./reference.css";

export const metadata = {
  title: "Mật Mã Tuồng",
  description: "Vén màn · Giải mã · Cảm nhận nghệ thuật Tuồng Việt Nam.",
  icons: { icon: "/images/logo-cutout.png", shortcut: "/images/logo-cutout.png" }
};

export default function RootLayout({ children }) {
  return <html lang="vi"><body>{children}</body></html>;
}
