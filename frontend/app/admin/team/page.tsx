"use client";

import CollectionManager from "@/components/admin/CollectionManager";

export default function TeamAdmin() {
  return (
    <CollectionManager
      title="Team"
      endpoint="/team"
      titleKey="name"
      imageKey="photo_url"
      fields={[
        { key: "name", label: "Name", type: "text", preview: false },
        { key: "position", label: "Position", type: "multilang", preview: true },
        { key: "bio", label: "Biography", type: "multilangText" },
        { key: "photo_url", label: "Photo", type: "media" },
        { key: "social_links", label: "Social links", type: "social" },
        { key: "order", label: "Order", type: "number" },
        { key: "is_published", label: "Published", type: "checkbox" },
      ]}
    />
  );
}
