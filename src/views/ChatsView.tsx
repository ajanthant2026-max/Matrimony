import React, { useState } from "react";
import { Shell, DesktopShell } from "../components/Shell";
import { BrandHeader, DesktopTopbar } from "../components/Navigation";
import { useAuth } from "../context/AuthContext";
import { useMatches } from "../context/MatchesContext";
import { VerifiedBadge } from "../components/VerifiedBadge";
import { Icon } from "../components/Icon";
import { ProfileRow } from "./LikedView";
import { seedProfiles } from "../data/mockData";

function classNames(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

function ChatRoom() {
  const { profile } = useAuth();
  const { activeChat, setActiveChat, messages, sendMessage } = useMatches();
  const [messageDraft, setMessageDraft] = useState("");

  if (!activeChat) return null;

  function handleSend() {
    sendMessage(messageDraft);
    setMessageDraft("");
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col px-5 pb-24 h-full text-left">
      <button
        className="mb-3.5 w-fit text-xs font-bold text-aranyam-crimson uppercase tracking-wider hover:underline active:scale-95 transition"
        onClick={() => setActiveChat(null)}
      >
        Back to matches (சங்கமம்)
      </button>
      <div className="mb-4 flex items-center gap-3.5 rounded-2xl border border-aranyam-border bg-white p-3.5 shadow-sm">
        <img
          className="h-11 w-11 rounded-xl object-cover border border-aranyam-border"
          src={activeChat.profile.image || ""}
          alt={activeChat.profile.name}
        />
        <div>
          <p className="font-bold text-aranyam-espresso leading-snug">{activeChat.profile.name}</p>
          <p className="text-[10px] font-bold text-aranyam-gold uppercase tracking-wider mt-0.5">Encrypted sanctuary connection</p>
        </div>
        <VerifiedBadge verified={activeChat.profile.verifiedStatus} className="ml-auto" />
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-aranyam-border bg-aranyam-surfaceAlt/60 p-4 shadow-inner min-h-64">
        {messages.map((message) => {
          const mine = message.senderId === profile.uid;
          return (
            <div key={message.id} className={classNames("flex", mine ? "justify-end" : "justify-start")}>
              <div
                className={classNames(
                  "max-w-[78%] rounded-xl px-4 py-2.5 text-xs font-medium leading-relaxed shadow-sm",
                  mine 
                    ? "bg-aranyam-crimson text-white shadow-aranyam-crimson/10" 
                    : "bg-white text-aranyam-espresso border border-aranyam-border"
                )}
              >
                {message.text}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3.5 flex gap-2">
        <input
          className="h-12 min-w-0 flex-1 rounded-xl border border-aranyam-border bg-white px-4 text-xs font-bold text-aranyam-espresso outline-none focus:border-aranyam-crimson/50 shadow-inner"
          placeholder="Write with warmth and respect..."
          value={messageDraft}
          onChange={(event) => setMessageDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSend();
          }}
        />
        <button
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-aranyam-crimson text-white shadow-md shadow-aranyam-crimson/15 hover:bg-aranyam-crimson/95 transition active:scale-[0.96]"
          onClick={handleSend}
          aria-label="Send message"
        >
          <Icon name="send" className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

function DesktopChats() {
  const { matches, activeChat, setActiveChat } = useMatches();

  return (
    <DesktopShell>
      <DesktopTopbar title="சங்கமம் · Sanctuary Chats" subtitle="End-to-end encrypted-feeling chat room for connected alignments" />
      <div className="grid min-h-[calc(100vh-88px)] grid-cols-[320px_minmax(0,1fr)]">
        <div className="border-r border-aranyam-border p-5 bg-aranyam-bg/30">
          {(matches.length
            ? matches
            : [{ matchId: "demo", profile: seedProfiles[0], status: "matched" as const }]
          ).map((match) => (
            <button key={match.matchId} className="mb-3.5 w-full text-left block" onClick={() => setActiveChat(match)}>
              <ProfileRow item={match.profile} action="Active conversation" />
            </button>
          ))}
        </div>
        <div className="p-6 h-[calc(100vh-88px)] flex flex-col bg-white">
          {activeChat ? (
            <ChatRoom />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
              <Icon name="chat" className="h-10 w-10 text-aranyam-gold mb-3" />
              <p className="text-xs font-bold uppercase tracking-wider text-aranyam-charcoal">Select a matched companion to begin writing</p>
            </div>
          )}
        </div>
      </div>
    </DesktopShell>
  );
}

export function ChatsView() {
  const { matches, activeChat, setActiveChat } = useMatches();

  return (
    <>
      <Shell showNav>
        <BrandHeader compact />
        {!activeChat ? (
          <section className="space-y-3.5 px-5 pb-28 text-left">
            <h2 className="text-xl font-bold text-aranyam-espresso">Active matches (சங்கமம்)</h2>
            {(matches.length
              ? matches
              : [{ matchId: "demo", profile: seedProfiles[0], status: "matched" as const }]
            ).map(
              (match) => (
                <button
                  key={match.matchId}
                  className="w-full text-left block"
                  onClick={() => setActiveChat(match)}
                >
                  <ProfileRow item={match.profile} action="Open sanctuary chat" />
                </button>
              )
            )}
          </section>
        ) : (
          <ChatRoom />
        )}
      </Shell>
      <DesktopChats />
    </>
  );
}
