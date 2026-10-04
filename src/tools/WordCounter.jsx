import { useState } from "react";
import SEO from "../components/SEO";
function WordCounter() {
  const [text, setText] = useState("");

  const words = text.trim()
    ? text.trim().split(/\s+/).length
    : 0;

  const characters = text.length;

  const noSpaces = text.replace(/\s/g, "").length;

  const sentences = text.trim()
    ? text
        .split(/[.!?]+/)
        .filter((item) => item.trim()).length
    : 0;

  return (
    <div className="container tool-page">
        <SEO
  title="Word Counter - Count Words & Characters"
  description="Count words, characters and sentences instantly with our free online word counter."
  keywords="word counter, character counter, count words online"
/>
      <div className="tool-page-heading text-center">
        <h1>Word Counter</h1>
        <p>
          Count words, characters and sentences instantly.
        </p>
      </div>

      <div className="calculator-card">
        <textarea
          className="form-control"
          rows="10"
          placeholder="Type or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="age-results">
          <div>
            <strong>{words}</strong>
            <span>Words</span>
          </div>

          <div>
            <strong>{characters}</strong>
            <span>Characters</span>
          </div>

          <div>
            <strong>{sentences}</strong>
            <span>Sentences</span>
          </div>
        </div>

        <div className="text-center mt-3 small text-secondary">
          Characters without spaces: {noSpaces}
        </div>
      </div>
    </div>
  );
}

export default WordCounter;