"use client";

import type React from "react";
import ReactMarkdown from "react-markdown";

type MarkdownBlock =
  | {
      type: "markdown";
      content: string;
    }
  | {
      type: "table";
      headers: string[];
      rows: string[][];
    };

interface MarkdownComponentProps {
  children?: React.ReactNode;
  href?: string;
}

const markdownComponents = {
  a: ({ href, children }: MarkdownComponentProps) => (
    <a
      className="text-sky-300 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-white/40"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  ),
  code: ({ children }: MarkdownComponentProps) => (
    <code className="rounded bg-white/10 px-1.5 py-0.5 text-[0.9em] text-slate-100">
      {children}
    </code>
  ),
};

function isTableSeparatorLine(line: string) {
  return /^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*$/.test(line);
}

function splitTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const lines = markdown.split("\n");
  const blocks: MarkdownBlock[] = [];
  let currentMarkdownLines: string[] = [];

  function flushMarkdownBlock() {
    const content = currentMarkdownLines.join("\n").trim();
    if (content) {
      blocks.push({
        type: "markdown",
        content,
      });
    }
    currentMarkdownLines = [];
  }

  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    const nextLine = lines[index + 1];
    const isTableStart =
      line.includes("|") &&
      typeof nextLine === "string" &&
      isTableSeparatorLine(nextLine);

    if (!isTableStart) {
      currentMarkdownLines.push(line);
      index += 1;
      continue;
    }

    flushMarkdownBlock();

    const tableLines = [line, nextLine];
    index += 2;

    while (index < lines.length && lines[index].includes("|")) {
      tableLines.push(lines[index]);
      index += 1;
    }

    const headers = splitTableRow(tableLines[0]);
    const rows = tableLines
      .slice(2)
      .map(splitTableRow)
      .filter((row) => row.length > 0);

    blocks.push({
      type: "table",
      headers,
      rows,
    });
  }

  flushMarkdownBlock();

  return blocks;
}

export function ValueAccrualReportViewer({ markdown }: { markdown: string }) {
  const blocks = parseMarkdownBlocks(markdown);

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        if (block.type === "table") {
          return (
            <div className="overflow-x-auto" key={`table-${index}`}>
              <table className="min-w-full border-collapse rounded-xl border border-white/10 text-sm text-slate-300">
                <thead className="bg-white/5">
                  <tr className="border-white/10">
                    {block.headers.map((header) => (
                      <th
                        className="border border-white/10 px-3 py-2 text-left font-semibold text-white"
                        key={header}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr className="border-white/10" key={`row-${rowIndex}`}>
                      {row.map((cell, cellIndex) => (
                        <td
                          className="border border-white/10 px-3 py-2 align-top"
                          key={`${rowIndex}-${cellIndex}`}
                        >
                          <ReactMarkdown components={markdownComponents}>
                            {cell}
                          </ReactMarkdown>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <div
            className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-li:text-slate-300 prose-hr:border-white/10 prose-code:text-slate-100 prose-pre:bg-black/30 prose-blockquote:border-l-white/20 prose-blockquote:text-slate-300"
            key={`markdown-${index}`}
          >
            <ReactMarkdown components={markdownComponents}>
              {block.content}
            </ReactMarkdown>
          </div>
        );
      })}
    </div>
  );
}
