"use client";
import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Button from "./ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "./Icons";
import Image from "next/image";

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
    textareaRef?.current?.focus();
    if (!input) return;
    setLoading(true);
    try {
      await fetch(url, {
        method: "POST",
        body: JSON.stringify({ text: input, chatId }),
      });
      setInput("");
    } catch (error) {
      console.log("chat Input error");
    } finally {
      setLoading(false);
    }
  };

  const [openUploadWindow, setOpenUploadWindow] = useState<boolean>(false);

  //handling file sending
  const uploadRouteUrl = `${base}/api/friends/upload`;

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const MAX_FILE_SIZE = 20 * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setFile(null);
    setPreviewUrl(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (selectedFile.size > MAX_FILE_SIZE) {
        setErrorMessage(`File exceeds the maximum size limit of 20MB.`);
        return;
      }

      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      if (selectedFile.type.startsWith("image")) {
        reader.readAsDataURL(selectedFile);
      } else if (selectedFile.type.startsWith("video")) {
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const handleSendFile = async () => {
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target && e.target.result) {
          const base64File = (e.target.result as string).split(",")[1];

          try {
            const response = await fetch(uploadRouteUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                file: `data:${file.type};base64,${base64File}`,
                chatId,
                type: file.type,
              }),
            });
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
            setFile(null);
            setOpenUploadWindow(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    setOpenUploadWindow((prev) => !prev);
    setFile(null);
    setPreviewUrl(null);
  };

  if (openUploadWindow) {
    if (window) {
      // window.document.body.style.pointerEvents = "none";
    }
  }

  const fileUploadElement = (
    <div className="flex flex-col items-center justify-center ">
      <input
        type="file"
        accept="image/*, video/*"
        onChange={handleFileChange}
        className="mb-4 mt-2 w-full"
      />
      {errorMessage && <div className="text-red-600">{errorMessage}</div>}
      {previewUrl && (
        <div className="flex items-center justify-center">
          {file?.type.startsWith("image") && (
            <Image
              src={previewUrl}
              alt="Preview"
              className="max-h-36 max-w-fit  rounded md:max-h-60"
              width={220}
              height={220}
              property="true"
              placeholder="empty"
            />
          )}
          {file?.type.startsWith("video") && (
            <video
              controls
              controlsList=" nodownload noremoteplayback noplaybackrate nofoobar"
              className="max-h-36 max-w-full md:max-h-60"
              disablePictureInPicture
            >
              <source src={previewUrl} type={file.type} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div
        className={`chat-input border-t border-slate-600 bg-slate-900/40 px-4 py-4 `}
      >
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
            className={`${openUploadWindow ? "pointer-events-none" : null} block w-full resize-none border-0 bg-transparent text-slate-200 placeholder:text-slate-600 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6`}
            autoComplete="off"
          />
          <div
            onClick={() => textareaRef.current?.focus()}
            className={`${openUploadWindow ? "pointer-events-none" : null} py-2`}
            aria-hidden="true"
          >
            <div className=" py-px">
              <div className="h-7" />
            </div>
          </div>
          <section className="absolute bottom-0 right-0 flex justify-between py-2 pl-3 pr-2">
            <div className=" flex flex-shrink-0 gap-x-2">
              <Button name="button" onClick={handleUpload} disabled={loading}>
                {openUploadWindow ? (
                  <FontAwesomeIcon icon={Icons.faXmark} className="h-4 w-4" />
                ) : (
                  <FontAwesomeIcon
                    icon={Icons.faPaperclip}
                    className="h-4 w-4"
                  />
                )}
              </Button>
              <Button
                name="button"
                onClick={openUploadWindow ? handleSendFile : sendMessage}
                loading={loading}
                type="submit"
              >
                <FontAwesomeIcon
                  icon={Icons.faPaperPlane}
                  className="h-4 w-4"
                />
              </Button>
            </div>
          </section>
        </div>
      </div>
      {openUploadWindow ? (
        <div className="absolute inset-0 flex h-3/5 w-full items-center justify-center self-center drop-shadow-2xl">
          <div className="h-3/5 w-10/12 rounded bg-slate-800 ">
            {fileUploadElement}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ChatInput;
