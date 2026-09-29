"""Check the static page's basic content using only the Python standard library."""

from html.parser import HTMLParser
from pathlib import Path


class PageParser(HTMLParser):
    VOID_TAGS = {
        "area", "base", "br", "col", "embed", "hr", "img", "input",
        "link", "meta", "param", "source", "track", "wbr",
    }

    def __init__(self):
        super().__init__()
        self.elements = []
        self.stack = []

    def handle_starttag(self, tag, attrs):
        element = {"tag": tag, "attrs": dict(attrs), "text": ""}
        self.elements.append(element)
        if tag not in self.VOID_TAGS:
            self.stack.append(element)

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index]["tag"] == tag:
                del self.stack[index:]
                break

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.VOID_TAGS:
            self.handle_endtag(tag)

    def handle_data(self, data):
        for element in self.stack:
            element["text"] += data


def main():
    results = []

    def check(name, passed):
        results.append(passed)
        print(f"{'PASS' if passed else 'FAIL'}: {name}")

    path = Path(__file__).resolve().parents[1] / "index.html"
    try:
        source = path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as error:
        check(f"index.html is readable — {error}", False)
        return 1

    check("index.html exists and is nonempty", bool(source.strip()))
    page = PageParser()
    page.feed(source)
    page.close()

    def matches(tag=None, element_id=None, text=None):
        return any(
            (tag is None or element["tag"] == tag)
            and (element_id is None or element["attrs"].get("id") == element_id)
            and (text is None or " ".join(element["text"].split()) == text)
            for element in page.elements
        )

    check('Page title is "Software Factory"', matches("title", text="Software Factory"))
    check('Heading is "Software Factory"', matches("h1", text="Software Factory"))
    check('Initial status is "Factory is running"',
          matches(element_id="status", text="Factory is running"))
    check('Button is labeled "Run Factory"',
          matches("button", "run-factory", "Run Factory"))
    check('Initial counter is "Orders processed: 0"',
          matches(element_id="order-count", text="Orders processed: 0"))

    for element_id in ("status", "run-factory", "order-count"):
        count = sum(element["attrs"].get("id") == element_id for element in page.elements)
        check(f'ID "{element_id}" exists exactly once', count == 1)

    check("Document language is declared", any(
        element["tag"] == "html" and (element["attrs"].get("lang") or "").strip()
        for element in page.elements
    ))
    viewports = [
        element["attrs"].get("content") or "" for element in page.elements
        if element["tag"] == "meta" and element["attrs"].get("name") == "viewport"
    ]
    check("Mobile viewport uses device width and initial scale 1", any(
        {"width=device-width", "initial-scale=1"}.issubset(
            {"".join(part.split()) for part in content.split(",")}
        ) for content in viewports
    ))
    return 0 if all(results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
