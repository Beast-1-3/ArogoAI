import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX, FiSend, FiTrash2 } from "react-icons/fi";
import API from "../services/api";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your medical assistant. How can I help you with your health questions today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Send to backend with history (exclude the initial greeting)
      const history = messages.slice(1).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const { data } = await API.post("/chat", {
        message: userMessage,
        history,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble responding right now. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearHistory = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared! How can I help you with your health questions?",
      },
    ]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <FloatingButton
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiMessageCircle size={24} />
          </FloatingButton>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <ChatHeader>
              <HeaderInfo>
                <BotAvatar>🏥</BotAvatar>
                <HeaderText>
                  <BotName>Medical Assistant</BotName>
                  <BotStatus>Online</BotStatus>
                </HeaderText>
              </HeaderInfo>
              <HeaderActions>
                <ActionButton onClick={clearHistory} title="Clear chat">
                  ↻
                </ActionButton>
                <ActionButton onClick={() => setIsOpen(false)} title="Close">
                  ✕
                </ActionButton>
              </HeaderActions>
            </ChatHeader>

            <MessagesContainer>
              {messages.map((msg, index) => (
                <Message key={index} isUser={msg.role === "user"}>
                  {msg.role === "assistant" && <MessageAvatar>🏥</MessageAvatar>}
                  <MessageBubble isUser={msg.role === "user"}>
                    {msg.content}
                  </MessageBubble>
                </Message>
              ))}
              {isLoading && (
                <Message isUser={false}>
                  <MessageAvatar>🏥</MessageAvatar>
                  <MessageBubble isUser={false}>
                    <TypingIndicator>
                      <span></span>
                      <span></span>
                      <span></span>
                    </TypingIndicator>
                  </MessageBubble>
                </Message>
              )}
              <div ref={messagesEndRef} />
            </MessagesContainer>

            <InputContainer>
              <ChatInput
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a health question..."
                disabled={isLoading}
              />
              <SendButton
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiSend size={18} />
              </SendButton>
            </InputContainer>
          </ChatWindow>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;

// Styled Components
const FloatingButton = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00C9A7, #00B596);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 201, 167, 0.4);
  z-index: 1000;
`;

const ChatWindow = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 380px;
  height: 520px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;

  @media (max-width: 480px) {
    width: calc(100vw - 2rem);
    height: calc(100vh - 4rem);
    bottom: 1rem;
    right: 1rem;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #00C9A7, #00B596);
  color: white;
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const BotAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const HeaderText = styled.div``;

const BotName = styled.div`
  font-weight: 600;
  font-size: 1rem;
`;

const BotStatus = styled.div`
  font-size: 0.75rem;
  opacity: 0.9;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #009688;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  svg {
    color: #009688;
    stroke: #009688;
  }

  &:hover {
    background: white;
    transform: scale(1.05);
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: #f8fafc;
`;

const Message = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  flex-direction: ${(props) => (props.isUser ? "row-reverse" : "row")};
`;

const MessageAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const MessageBubble = styled.div`
  max-width: 75%;
  padding: 0.75rem 1rem;
  border-radius: ${(props) =>
    props.isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px"};
  background: ${(props) =>
    props.isUser ? "linear-gradient(135deg, #00C9A7, #00B596)" : "white"};
  color: ${(props) => (props.isUser ? "white" : "#1e293b")};
  font-size: 0.9rem;
  line-height: 1.5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #94a3b8;
    animation: bounce 1.4s infinite ease-in-out both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  background: white;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 100px;
  font-size: 0.9rem;
  background: #f8fafc;
  color: #1e293b;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #009688;
    background: white;
  }

  &::placeholder {
    color: #94a3b8;
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const SendButton = styled(motion.button)`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00C9A7, #00B596);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
