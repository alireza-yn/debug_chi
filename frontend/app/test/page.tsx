"use client";
import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";

const Page: React.FC = () => {
  const [code, setCode] = useState<string>('print("Hello, world!")');

  return (
    <div className="flex justify-center mt-10" dir="ltr">
      <MonacoEditor
        height="500px"
        width="700px"
        language="python"
        theme="vs-dark"
        value={code}
        onChange={(newValue) => setCode(newValue || "")}
        options={{
          fontSize: 60,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default Page;
