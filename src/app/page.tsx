/**
 * Root page — redirect handled by proxy.ts.
 * When a user visits "/", proxy.ts redirects to "/<lang>".
 * This page only renders if someone bypasses the proxy.
 */
export default function RootPage() {
  return null;
}
