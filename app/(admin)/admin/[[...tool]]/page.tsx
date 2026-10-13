import type { Metadata, Viewport } from "next";
import Studio from "./Studio";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function AdminPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return (
      <main style={{ font: "16px system-ui", padding: 40, maxWidth: 560 }}>
        <h1>Admin isn&apos;t connected yet</h1>
        <p>Add NEXT_PUBLIC_SANITY_PROJECT_ID to your environment variables (see README, step 3), then redeploy.</p>
      </main>
    );
  }
  return <Studio />;
}
