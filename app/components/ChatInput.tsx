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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:3000/api/message/send", {
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
    <div className="border-t border-slate-400 px-4 py-6 mb-2 sm:mb-0">
      <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-slate-700 focus-within:ring2 focus-within:ring-blue-600">
        <TextareaAutosize
          ref={textareaRef}
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
          className="'block w-full resize-none border-0 bg-transparent text-slate-200 sm:py-1.5 placeholder:text-slate-600 focus:ring-0 sm:text-sm sm:leading-6'"
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
        <section className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
          <div className="flex-shrink-0">
            <Button onClick={sendMessage} loading={loading} type="submit">
              Post
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChatInput;
