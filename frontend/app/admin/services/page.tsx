"use client";

import CollectionManager from "@/components/admin/CollectionManager";

export default function ServicesAdmin() {
  return (
    <CollectionManager
      title="Services"
      endpoint="/services"
      titleKey="title"
      imageKey="image_url"
      fields={[
        { key: "title", label: "Title", type: "multilang" },
        { key: "description", label: "Description", type: "multilangText" },
        { key: "icon", label: "Icon name", type: "text" },
        { key: "image_url", label: "Image", type: "media" },
        { key: "order", label: "Order", type: "number" },
        { key: "is_published", label: "Published", type: "checkbox" },
      ]}
    />
  );
}
