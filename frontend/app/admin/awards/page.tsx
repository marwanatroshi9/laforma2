"use client";

import CollectionManager from "@/components/admin/CollectionManager";

export default function AwardsAdmin() {
  return (
    <CollectionManager
      title="Awards"
      endpoint="/awards"
      titleKey="title"
      imageKey="image_url"
      fields={[
        { key: "title", label: "Title", type: "multilang" },
        { key: "organization", label: "Organization", type: "text", preview: true },
        { key: "year", label: "Year", type: "number", preview: true },
        { key: "description", label: "Description", type: "multilangText" },
        { key: "image_url", label: "Image", type: "media" },
        { key: "order", label: "Order", type: "number" },
      ]}
    />
  );
}
