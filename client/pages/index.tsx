import "core-js/stable";
import { setAutoFreeze } from "immer";
import { Global, css } from "@emotion/core";
import React, { useMemo, useState, useEffect } from "react";
import Head from "next/head";
import {
  Box,
  Messages,
  CommandPrompt,
  Status,
  UsernamePrompt,
  ResourcesBar,
  DevicesBar,
  Flex,
  ProcessesPanel,
} from "../components";
import { CommandContext } from "../components/CommandContext";
import { useSession } from "../components/useSession";
import { useStore } from "../components/useStore";
import { useCommandHistory } from "../components/useCommandHistory";
import { useSteppedScroll } from "../components/useSteppedScroll";
import { TerminalOverlay } from "../components/TerminalOverlay";
import { EmailPanel } from "../components/EmailPanel";
import { MailProgram } from "../components/MailProgram";
import { Program } from "../types";
import { useLocalCommands } from "../components/UseLocalCommands";

setAutoFreeze(false);

export const Index = () => {
  const [username, setUsername] = useSession();
  const [openProgram, setOpenProgram] = useState<Program | null>(null);
  const {
    addMessage,
    readyState,
    sendCommand: sendServerCommand,
    state,
  } = useStore(username);
  const [command, setCommand] = useState("");
  const { setPrevCommand, setNextCommand } = useCommandHistory(
    state.commandHistory,
    setCommand,
  );
  const sendCommand = useLocalCommands({
    username,
    sendServerCommand,
    setOpenProgram,
    addMessage,
  });
  const scrollToBottom = useSteppedScroll();

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom, state.messages]);

  const commandContextValue = useMemo(() => {
    return {
      command,
      setCommand,
      sendCommand,
      setPrevCommand,
      setNextCommand,
    };
  }, [command, sendCommand, setNextCommand, setPrevCommand]);

  return (
    <CommandContext.Provider value={commandContextValue}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Global
        styles={css`
          body {
            margin: 0;
            text-shadow: 0.02956275843481219px 0 1px rgba(0, 30, 255, 0.5),
              -0.02956275843481219px 0 1px rgba(255, 0, 80, 0.3), 0 0 3px;
            background-color: black;
            background-image: radial-gradient(#111, #181818 120%);
            min-height: 100vh;
          }

          body,
          input {
            color: #43d731;
            font-size: 20px;
            margin: 0;
            font-family: "Fira Code", monospace;
          }

          pre {
            font-size: inherit;
            font-family: "Fira Code", monospace;
            margin: 0;
          }

          ul {
            margin-top: 0;
            margin-bottom: 0;
            padding-left: 0;
          }

          li {
            list-style-type: none;
          }

          a {
            color: #bff3b8;
            text-decoration: none;
            &:hover {
              color: white;
            }
          }
        `}
      />
      <TerminalOverlay />
      <Flex
        alignItems="start"
        css={css`
          min-height: 100vh;
        `}
      >
        <Box
          width={200}
          gridArea="leftbar"
          padding={4}
          css={css`
            position: sticky;
            top: 0;
          `}
        >
          {state.resources && <ResourcesBar resources={state.resources} />}
          {state.devices && <DevicesBar devices={state.devices} />}
          {state.emails && <EmailPanel emails={state.emails} />}
          {state.processes && <ProcessesPanel processes={state.processes} />}
        </Box>
        <Box gridArea="main" padding={4}>
          {!openProgram && (
            <>
              <Status readyState={readyState} />
              <Messages messages={state.messages} />
              {username ? (
                <CommandPrompt username={username} />
              ) : (
                <UsernamePrompt setUsername={setUsername} />
              )}
            </>
          )}
          {openProgram === "mail" && <MailProgram emails={state.emails} />}
        </Box>
      </Flex>
    </CommandContext.Provider>
  );
};

export default Index;
