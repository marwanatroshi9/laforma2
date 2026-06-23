"use client";

import CollectionManager from "@/components/admin/CollectionManager";

export default function CareersAdmin() {
  return (
    <CollectionManager
      title="Careers"
      endpoint="/careers"
      titleKey="title"
      fields={[
        { key: "slug", label: "Slug (URL)", type: "text" },
        { key: "title", label: "Title", type: "multilang" },
        { key: "description", label: "Description", type: "multilangText" },
        { key: "location", label: "Location", type: "text", preview: true },
        { key: "employment_type", label: "Employment type", type: "text", preview: true },
        { key: "is_open", label: "Open", type: "checkbox" },
      ]}
    />
  );
}
