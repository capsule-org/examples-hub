import React, { useState, useEffect } from "react";
import CodeStepLayout from "../../components/layouts/codeStepLayout";
import { CodeStepItem } from "../../types";

type Step5ExportSessionCodeSnippetProps = {};

const Step5ExportSessionCodeSnippet: React.FC<Step5ExportSessionCodeSnippetProps> = () => {
  const [codeItems, setCodeItems] = useState<CodeStepItem[]>([]);

  useEffect(() => {
    const loadCodeItems = async () => {
      try {
        const exportModule = await import(/* @vite-ignore */ "../../snippets/export-session/export");
        setCodeItems(exportModule.default);
      } catch (error) {
        console.error("Failed to load export session code snippets:", error);
        setCodeItems([]);
      }
    };

    loadCodeItems();
  }, []);

  return (
    <CodeStepLayout
      title="Export & Import Sessions"
      codeItems={codeItems}
    />
  );
};

export default Step5ExportSessionCodeSnippet;
