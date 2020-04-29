import { WebSocket } from "mock-socket";
import { createMockSocket } from "../support/createMockSocket";

describe("mail", () => {
  beforeEach(() => {
    createMockSocket(({ onCommand, sendMessage }) => {
      onCommand("internal_login threehams", () => {
        sendMessage(100, {
          update: "Emails",
          payload: {
            emails: [
              {
                id: "1",
                status: "Unread",
                from: "thebiggest <thebiggest@example.com>",
                to: "hackster <hackster@example.com>",
                subject: "check this out",
                body:
                  "want to grow your member size? [click here](portscan|8.8.8.8)",
              },
              {
                id: "2",
                status: "Unread",
                from: "rememberme <rememberme@example.com>",
                to: "hackster <hackster@example.com>",
                subject: "omgf",
                body:
                  "omgf! are u still around? i haven't seen your in yeersss!!!!!",
              },
            ],
          },
        });
      });
      onCommand("mail read 1", () => {
        sendMessage(100, {
          update: "Emails",
          payload: {
            emails: [
              {
                id: "1",
                status: "Read",
                from: "thebiggest <thebiggest@example.com>",
                to: "hackster <hackster@example.com>",
                subject: "check this out",
                body:
                  "want to grow your member size? [click here](portscan|8.8.8.8)",
              },
              {
                id: "2",
                status: "Unread",
                from: "rememberme <rememberme@example.com>",
                to: "hackster <hackster@example.com>",
                subject: "omgf",
                body:
                  "omgf! are u still around? i haven't seen your in yeersss!!!!!",
              },
            ],
          },
        });
      });
    }).as("mockServer");
  });

  afterEach(() => {
    cy.alias("mockServer").then(({ closeServer }) => closeServer());
  });

  it("allows malicious links in emails to send commands", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        // Call some code to initialize the fake server part using MockSocket
        cy.stub(win, "WebSocket" as any, (url: string) => new WebSocket(url));
      },
    });
    cy.findByLabelText("Enter Username").type(`threehams{enter}`);
    cy.getId("messages").should("contain.text", "Logged in as threehams");

    cy.findByText(/2 unread/i).click();
    cy.findByText(/check this out/i).click();
    cy.findByText("click here").click();
    cy.findByText("q:Back").click();
    cy.findByText("q:Quit").click();
    cy.findByText("(1 unread)");
    cy.getId("messages").should("contain.text", "portscan 8.8.8.8");
  });

  it("can navigate email by keyboard", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        // Call some code to initialize the fake server part using MockSocket
        cy.stub(win, "WebSocket" as any, (url: string) => new WebSocket(url));
      },
    });
    cy.findByLabelText("Enter Username").type(`threehams{enter}`);
    cy.getId("messages").should("contain.text", "Logged in as threehams");

    cy.get("body").type("mail{enter}");

    cy.focused().should("contain.text", "check this out").click();

    cy.findByText("click here").click();
    cy.get("body").type("q");
    cy.get("body").type("q");
    cy.findByText("(1 unread)");
    cy.getId("messages").should("contain.text", "portscan 8.8.8.8");
  });
});
