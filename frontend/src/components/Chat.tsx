'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Send } from 'lucide-react';
import { decide } from '@/lib/api';


import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Message {
  text: string;
  isUser: boolean;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Olá! Como posso ajudar você hoje?', isUser: false },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const data = await decide(input);
      const botMessage: Message = { text: data.reply, isUser: false };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error);
      const errorMessage: Message = { text: 'Desculpe, não consegui me conectar ao servidor. Tente novamente mais tarde.', isUser: false };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100">
      <div className="p-4 border-b flex items-center gap-3 bg-gray-50/60 rounded-t-2xl">
        <Avatar>
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-lg text-green-900">Assistente Virtual</h3>
          <p className="text-sm text-gray-500">Online</p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div key={index} className={`flex items-end gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              {!message.isUser && (
                <Avatar className="size-8">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${message.isUser ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                <p className="text-sm">{message.text}</p>
              </div>
              {message.isUser && (
                <Avatar className="size-8">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>EU</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-white rounded-b-2xl">
        <div className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Converse com o assistente..."
            disabled={loading}
            className="rounded-full py-6 pr-16"
          />
          <Button
            onClick={handleSendMessage}
            disabled={loading}
            size="icon"
            className="absolute top-1/2 -translate-y-1/2 right-2 rounded-full bg-green-600 hover:bg-green-700">
            <Send className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
