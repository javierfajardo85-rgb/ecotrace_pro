import type { Metadata } from "next";
import { DashboardContent } from "@/components/DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Merchant dashboard: cash-flow recovery, environmental fees, and auditable transaction log.",
};

export default function DashboardPage() {
  return <DashboardContent />;
}
