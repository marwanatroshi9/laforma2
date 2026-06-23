/** Renders a JSON-LD <script> for structured data / rich results.
 *  `<` is escaped to `<` so admin-supplied content can never close the
 *  <script> tag early (prevents an HTML/JS injection break-out). */
export default function JsonLd({ data }: { data: Record<string, any> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
