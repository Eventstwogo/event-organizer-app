// app/invoices/[id]/page.tsx
import React from "react";
import InvoiceByIdPage from "./InvoiceByIdPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params); // ✅ unwrap the params Promise
  return <InvoiceByIdPage id={id} />;
}
