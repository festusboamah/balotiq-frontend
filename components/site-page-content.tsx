// Renders the backend's site_pages markup: blank line = new paragraph,
// "## " = heading, "- " = bullet list. See balotiq/docs/PRODUCT_SPEC.md's
// "Site content management" section — same hand-rolled format the real
// app's admin editor produces, deliberately not HTML/Markdown.
function parseBody(body: string) {
  return body.split(/\n\n+/).map(block => {
    if (block.startsWith("## ")) {
      return { type: "heading" as const, text: block.slice(3) };
    }

    const lines = block.split("\n").filter(line => line.trim() !== "");
    if (lines.length > 0 && lines.every(line => line.startsWith("- "))) {
      return {
        type: "list" as const,
        items: lines.map(line => line.slice(2)),
      };
    }

    return { type: "paragraph" as const, text: block };
  });
}

export function SitePageContent({ body }: { body: string }) {
  return (
    <>
      {parseBody(body).map((block, index) => {
        if (block.type === "heading") {
          return (
            <h2
              className="mt-10 font-heading text-xl font-bold text-foreground first:mt-0"
              key={index}
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === "list") {
          return (
            <ul className="mt-3 space-y-2.5" key={index}>
              {block.items.map(item => (
                <li
                  className="flex gap-2 text-sm leading-7 text-muted-foreground md:text-base"
                  key={item}
                >
                  <span className="text-primary">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p
            className="mt-3 text-sm leading-7 text-muted-foreground first:mt-0 first:text-foreground md:text-base"
            key={index}
          >
            {block.text}
          </p>
        );
      })}
    </>
  );
}
