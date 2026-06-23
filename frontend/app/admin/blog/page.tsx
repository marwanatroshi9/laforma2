"use client";

import CollectionManager from "@/components/admin/CollectionManager";

export default function BlogAdmin() {
  return (
    <CollectionManager
      title="Journal"
      endpoint="/blog"
      titleKey="title"
      imageKey="cover_url"
      fields={[
        { key: "slug", label: "Slug (URL)", type: "text" },
        { key: "title", label: "Title", type: "multilang" },
        { key: "excerpt", label: "Excerpt", type: "multilangText" },
        { key: "body", label: "Body", type: "multilangText" },
        { key: "cover_url", label: "Cover image", type: "media" },
        { key: "author", label: "Author", type: "text", preview: true },
        { key: "is_published", label: "Published", type: "checkbox" },
      ]}
    />
  );
}
