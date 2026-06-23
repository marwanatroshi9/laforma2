"use client";

import CollectionManager from "@/components/admin/CollectionManager";

export default function ClientsAdmin() {
  return (
    <CollectionManager
      title="Clients"
      endpoint="/clients"
      titleKey="name"
      imageKey="logo_url"
      fields={[
        { key: "name", label: "Name", type: "text" },
        { key: "logo_url", label: "Logo", type: "media" },
        { key: "website", label: "Website", type: "text", preview: true },
        { key: "order", label: "Order", type: "number" },
      ]}
    />
  );
}
