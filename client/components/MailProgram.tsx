import React, { useState } from "react";
import { Email } from "../types";
import { Static } from "runtypes";
import { Markdown } from "./Markdown";
import { CommandLink } from "./CommandLink";
import { Link } from "./Link";
import { css } from "@emotion/core";

type MailProgramProps = {
  emails: Array<Static<typeof Email>>;
};
export const MailProgram = ({ emails }: MailProgramProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  let body;
  if (!emails.length) {
    body = <div>You have no messages.</div>;
  } else if (selectedId) {
    const email = emails.find((mail) => mail.id === selectedId)!;
    body = (
      <div>
        <div>From: {email.from}</div>
        <div>To: {email.to}</div>
        <div>Subject: {email.subject}</div>
        <br />
        <Markdown>{email.body}</Markdown>
      </div>
    );
  } else {
    body = (
      <div>
        {emails.map((email, index) => {
          return (
            <div key={index}>
              <Link
                href="mail open"
                onClick={() => {
                  setSelectedId(email.id);
                }}
              >
                <pre
                  css={css`
                    display: inline-block;
                  `}
                >
                  {email.from.slice(0, 8).padEnd(8)} |{" "}
                </pre>
                {email.subject}
              </Link>
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div>
      <div>
        {!selectedId && (
          <CommandLink href="close" highlightFocus>
            Close
          </CommandLink>
        )}
        {selectedId && (
          <Link
            href="back"
            onClick={() => {
              setSelectedId(null);
            }}
            highlightFocus
          >
            Back
          </Link>
        )}
      </div>
      <br />
      {body}
    </div>
  );
};
