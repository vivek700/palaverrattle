"use client";
import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Button from "./ui/Button";

const ChatInput = ({
  chatPerson,
  chatId,
}: {
  chatPerson: User;
  chatId: string;
}) => {
  const base = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const url = `${base}/api/friends/message/send`;

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input) return;
    setLoading(true);
    try {
      await fetch(url, {
        method: "POST",
        body: JSON.stringify({ text: input, chatId }),
      });
      setInput("");
      textareaRef?.current?.focus();
    } catch (error) {
      console.log("chat Input error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-2 border-t border-slate-600 px-4 py-6 sm:mb-0">
      <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-slate-700 focus-within:ring-2 focus-within:ring-violet-600">
        <TextareaAutosize
          ref={textareaRef}
          name="message"
          id="message"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          placeholder={`Message ${chatPerson.name}`}
          className="'block sm:leading-6' w-full resize-none border-0 bg-transparent text-slate-200 placeholder:text-slate-600 focus:ring-0 sm:py-1.5 sm:text-sm"
          autoComplete="off"
        />
        <div
          onClick={() => textareaRef.current?.focus()}
          className="py-2"
          aria-hidden="true"
        >
          <div className="py-px">
            <div className="h-9" />
          </div>
        </div>
        <section className="absolute bottom-0 right-0 flex justify-between py-2 pl-3 pr-2">
          <div className="flex-shrink-0">
            <Button
              name="button"
              onClick={sendMessage}
              loading={loading}
              type="submit"
            >
              Post
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChatInput;
