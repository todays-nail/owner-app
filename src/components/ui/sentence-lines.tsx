import { Fragment } from "react";

type SentenceLinesProps = {
  text: string;
};

function splitSentences(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return [];
  }

  const chunks = normalized.match(/[^.!?]+[.!?]*/g);
  if (!chunks) {
    return [normalized];
  }

  return chunks.map((chunk) => chunk.trim()).filter(Boolean);
}

export default function SentenceLines({ text }: SentenceLinesProps) {
  const lines = splitSentences(text);

  return (
    <>
      {lines.map((line, index) => (
        <Fragment key={`${line}-${index}`}>
          {index > 0 ? <br /> : null}
          {line}
        </Fragment>
      ))}
    </>
  );
}
