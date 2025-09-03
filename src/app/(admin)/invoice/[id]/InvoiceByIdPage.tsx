// app/invoices/[id]/InvoiceByIdPage.tsx
"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import axiosInstance from "@/lib/axiosinstance";
import { InvoiceLayout } from "@/components/invoices/invoice-layout";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FullDetailsModal } from "@/components/invoices/full-details-modal";

type Props = { id: string }; // only receive plain id

export default function InvoiceByIdPage({ id }: Props) {
  const [invoice, setInvoice] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axiosInstance.get(`/new-events/settlement/${id}`);
        const data = res.data;

        if (!data || !data.invoice) setError(true);
        else setInvoice(data);
      } catch (err) {
        console.error("Error fetching settlement invoice:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) {
    return (
      <main className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </main>
    );
  }

  if (error || !invoice) return notFound();

  return (
    <main className="mx-auto max-w-5xl p-0 md:p-4 print:p-0">
      <div className="flex justify-end mb-4 gap-2 print:hidden">
        <Button variant="outline" onClick={() => history.back()}>
          Back
        </Button>
        <Button onClick={() => setShowDetails(true)}>View Full Details</Button>
      </div>

      <InvoiceLayout invoice={invoice.invoice} />

      <FullDetailsModal
        open={showDetails}
        onClose={() => setShowDetails(false)}
        data={invoice}
      />
    </main>
  );
}
