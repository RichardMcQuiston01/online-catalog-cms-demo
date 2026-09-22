/**
 * Rich-text helpers for the demo:
 * - htmlToRichText: converts contenteditable HTML into a RichTextDocument
 * - richTextToHtml: renders a RichTextDocument to an HTML string for display
 * - richTextToEditableHtml: renders a RichTextDocument back to editable HTML
 *
 * The package ships builders/validators but no renderer, so this is
 * demo-only glue around its `RichTextDocument` / `InlineNode` types.
 */
import type {
  InlineNode,
  RichTextDocument,
  RichTextNode,
} from '@richardmcquiston01/online-catalog-cms';

export function htmlToRichText(html: string): RichTextDocument {
  const div = document.createElement('div');
  div.innerHTML = html;

  function parseInlines(node: Node): InlineNode[] {
    const nodes: InlineNode[] = [];
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? '';
        if (text) nodes.push({ type: 'text', text });
      } else if (child.nodeName === 'STRONG' || child.nodeName === 'B') {
        for (const n of parseInlines(child)) {
          nodes.push(n.type === 'text' ? { ...n, bold: true } : n);
        }
      } else if (child.nodeName === 'EM' || child.nodeName === 'I') {
        for (const n of parseInlines(child)) {
          nodes.push(n.type === 'text' ? { ...n, italic: true } : n);
        }
      } else if (child.nodeName === 'CODE') {
        const text = child.textContent ?? '';
        if (text) nodes.push({ type: 'text', text, code: true });
      } else if (child.nodeName === 'A') {
        const el = child as Element;
        nodes.push({
          type: 'link',
          href: el.getAttribute('href') ?? '#',
          children: parseInlines(child),
        });
      } else {
        nodes.push(...parseInlines(child));
      }
    }
    return nodes;
  }

  const richNodes: RichTextNode[] = [];
  for (const child of Array.from(div.childNodes)) {
    if (child.nodeName === 'P') {
      const children = parseInlines(child);
      if (children.length > 0) richNodes.push({ type: 'paragraph', children });
    } else if (/^H[1-6]$/.test(child.nodeName)) {
      richNodes.push({
        type: 'heading',
        level: Number.parseInt(child.nodeName[1], 10) as 1 | 2 | 3 | 4 | 5 | 6,
        children: parseInlines(child),
      });
    } else if (child.nodeName === 'UL' || child.nodeName === 'OL') {
      const items: InlineNode[][] = [];
      for (const li of (child as Element).querySelectorAll('li')) {
        items.push(parseInlines(li));
      }
      richNodes.push({
        type: 'list',
        ordered: child.nodeName === 'OL',
        items,
      });
    } else if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
      richNodes.push({
        type: 'paragraph',
        children: [{ type: 'text', text: child.textContent }],
      });
    }
  }

  return { version: 1, nodes: richNodes };
}

function renderInlines(inlines: InlineNode[]): string {
  return inlines
    .map((n) => {
      if (n.type === 'text') {
        let t = escapeHtml(n.text);
        if (n.bold) t = `<strong>${t}</strong>`;
        if (n.italic) t = `<em>${t}</em>`;
        if (n.code) t = `<code>${t}</code>`;
        return t;
      }
      return `<a href="${escapeAttr(n.href)}">${renderInlines(n.children)}</a>`;
    })
    .join('');
}

export function richTextToHtml(doc: RichTextDocument | undefined): string {
  if (!doc?.nodes?.length) return '';

  return doc.nodes
    .map((node) => {
      switch (node.type) {
        case 'paragraph':
          return `<p>${renderInlines(node.children)}</p>`;
        case 'heading':
          return `<h${node.level}>${renderInlines(node.children)}</h${node.level}>`;
        case 'list': {
          const tag = node.ordered ? 'ol' : 'ul';
          const items = node.items
            .map((i) => `<li>${renderInlines(i)}</li>`)
            .join('');
          return `<${tag}>${items}</${tag}>`;
        }
        case 'blockquote':
          return `<blockquote>${renderInlines(node.children)}</blockquote>`;
        case 'image':
          return `<img src="${escapeAttr(node.src)}" alt="${escapeAttr(node.alt)}" />`;
        default:
          return '';
      }
    })
    .join('\n');
}

export function richTextToEditableHtml(
  doc: RichTextDocument | undefined
): string {
  if (!doc?.nodes?.length) return '';

  return doc.nodes
    .map((node) => {
      switch (node.type) {
        case 'paragraph':
          return `<p>${renderInlines(node.children)}</p>`;
        case 'heading':
          return `<h${node.level}>${renderInlines(node.children)}</h${node.level}>`;
        case 'list': {
          const tag = node.ordered ? 'ol' : 'ul';
          const items = node.items
            .map((i) => `<li>${renderInlines(i)}</li>`)
            .join('');
          return `<${tag}>${items}</${tag}>`;
        }
        default:
          return '';
      }
    })
    .join('');
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(str: string): string {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
