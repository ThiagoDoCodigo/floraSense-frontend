import { useState, useEffect, useCallback } from "react";
import chatService from "../services/chat.service";
import type { ChatMessage } from "../models/chat.model";

export const useChatViewModel = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const streamText = async (fullText: string, messageId: string) => {
    let currentText = "";
    const chunkSize = 2;

    for (let i = 0; i < fullText.length; i += chunkSize) {
      currentText += fullText.substring(i, i + chunkSize);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, text: currentText } : msg,
        ),
      );

      await new Promise((r) => setTimeout(r, 25));
    }

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isStreaming: false } : msg,
      ),
    );
  };

  const loadInitialGreeting = useCallback(async () => {
    setIsTyping(true);
    const greeting = await chatService.getInitialGreeting();
    setIsTyping(false);

    const msgId = Date.now().toString();
    setMessages([
      {
        id: msgId,
        text: "",
        sender: "ai",
        timestamp: new Date().toISOString(),
        isStreaming: true,
      },
    ]);

    await streamText(greeting, msgId);
  }, []);

  useEffect(() => {
    loadInitialGreeting();
  }, [loadInitialGreeting]);

  const sendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMsgId = Date.now().toString();
    const newMsg: ChatMessage = {
      id: userMsgId,
      text: inputText.trim(),
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const responseText = await chatService.sendQuery(newMsg.text);

      const aiMsgId = (Date.now() + 1).toString();
      setIsTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          text: "",
          sender: "ai",
          timestamp: new Date().toISOString(),
          isStreaming: true,
        },
      ]);

      await streamText(responseText, aiMsgId);
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Desculpe, ocorreu um erro na comunicação com os servidores. Tente novamente.",
          sender: "ai",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  return {
    messages,
    inputText,
    setInputText,
    isTyping,
    sendMessage,
  };
};
