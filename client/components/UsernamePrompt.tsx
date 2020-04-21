import React, { createRef, useContext, useCallback } from "react";
import { css } from "@emotion/react";
import { Input, Box } from ".";
import { CommandContext } from "./CommandContext";
import { useInputFocus } from "../hooks/useInputFocus";

const CURSOR = "█";

type UsernamePromptProps = {
  setUsername: (username: string) => void;
};
export const UsernamePrompt = ({ setUsername }: UsernamePromptProps) => {
  const { command, setCommand } = useContext(CommandContext);
  const inputRef = createRef<HTMLInputElement>();

  const onSubmit = useCallback(() => {
    if (!command.trim()) {
      return;
    }
    setUsername(command);
    setCommand("");
  }, [command, setCommand, setUsername]);
  useInputFocus(onSubmit, inputRef);

  return (
    <Box
      css={css`
        width: 100%;
      `}
    >
      username? {command}
      {CURSOR}
      <Input
        aria-label="Enter Username"
        ref={inputRef}
        size={command.length || 1}
        value={command}
        onChange={(event) => {
          setCommand(event.target.value);
        }}
        type="text"
        css={css`
          opacity: 0.01;
          position: absolute;
          outline: none;
        `}
      />
    </Box>
  );
};
