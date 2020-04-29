import React, { useState, useContext, forwardRef } from "react";
import { Email } from "../../types";
import { Static } from "runtypes";
import { Markdown } from "../library/Markdown";
import { CommandLink } from "../library/CommandLink";
import { Link } from "../library/Link";
import { css } from "@emotion/react";
import { Box } from "..";
import { CommandContext } from "../CommandContext";
import { useFocusSwitching } from "../../hooks/useFocusSwitching";
import { useKeyHandler } from "../../hooks/useHotKey";

type MailProgramProps = {
  emails: Array<Static<typeof Email>>;
};
export const MailProgram = ({ emails }: MailProgramProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { sendCommand } = useContext(CommandContext);
  const focusSwitchRef = useFocusSwitching(emails.length);

  useKeyHandler((keyCode) => {
    if (keyCode === "q") {
      if (selectedId) {
        setSelectedId(null);
      } else {
        sendCommand("background");
      }
    }
  });

  if (selectedId) {
    const email = emails.find((mail) => mail.id === selectedId)!;

    return (
      <Box>
        <Link
          marginBottom={1}
          block
          href="back"
          onClick={() => {
            setSelectedId(null);
          }}
          highlightFocus
        >
          q:Back
        </Link>
        <div>
          <div>Date: {Date.now()}</div>
          <div>From: {email.from}</div>
          <div>To: {email.to}</div>
          <Box marginBottom={1}>Subject: {email.subject}</Box>
          <Markdown>{email.body}</Markdown>
        </div>
      </Box>
    );
  }

  return (
    <>
      <CommandLink block href="background" highlightFocus>
        q:Quit
      </CommandLink>
      <Box marginTop={1}>Unread</Box>
      {!emails.length && <Box>No messages.</Box>}
      {emails.map((email, index) => {
        return (
          <EmailListItem
            ref={focusSwitchRef(index)}
            key={email.id}
            email={email}
            onClick={() => {
              sendCommand(`mail read ${email.id}`);
              setSelectedId(email.id);
            }}
          />
        );
      })}
    </>
  );
};

type EmailListItemProps = {
  email: Email;
  onClick: () => void;
};
const EmailListItem = forwardRef<HTMLAnchorElement, EmailListItemProps>(
  ({ email, onClick }: EmailListItemProps, ref) => {
    return (
      <Link block href="mail open" onClick={onClick} ref={ref}>
        <pre
          css={css`
            display: inline-block;
          `}
        >
          {email.from.slice(0, 8).padEnd(8)} |{" "}
        </pre>
        {email.subject}
      </Link>
    );
  },
);
