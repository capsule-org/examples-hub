import React, { useState, useEffect } from "react";
import CodeStepLayout from "../../components/layouts/codeStepLayout";
import { CodeStepItem } from "../../types";

type Step6LogoutCodeSnippetProps = {};

const Step6LogoutCodeSnippet: React.FC<Step6LogoutCodeSnippetProps> = () => {
  const [codeItems, setCodeItems] = useState<CodeStepItem[]>([]);

  useEffect(() => {
    const loadCodeItems = async () => {
      try {
        const snippetModule = await import(/* @vite-ignore */ "../../snippets/session-management/session-management");
        setCodeItems(snippetModule.default);
      } catch (error) {
        console.error("Failed to load session management code snippets:", error);
        setCodeItems([]);
      }
    };

    loadCodeItems();
  }, []);

  return (
    <CodeStepLayout
      title="Session Management"
      codeItems={codeItems}
    />
  );
};

export default Step6LogoutCodeSnippet;
