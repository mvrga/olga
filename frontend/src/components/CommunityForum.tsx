'use client';

import { useEffect, useState } from 'react';
import { Send, Image, Paperclip } from 'lucide-react';
import { getCommunityForum, postCommunityForum, type CommunityMessage } from '@/lib/api';

export function CommunityForum() {
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    let mounted = true;
    getCommunityForum().then((res) => mounted && setMessages(res.messages)).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const staticSeed: CommunityMessage[] = [
    {
      author: 'Maria Santos',
      avatar: 'MS',
      message: 'Bom dia pessoal! 🌅 Consegui eliminar pragas do tomate com calda de fumo. Barato e funciona!',
      time: '08:24',
      isMe: false
    },
    {
      author: 'Carlos Oliveira',
      avatar: 'CO',
      message: 'Maria, você usa quanto de fumo pra cada litro?',
      time: '08:31',
      isMe: false
    },
    {
      author: 'Você',
      avatar: 'JS',
      message: 'Boa Maria! Tenho problema parecido aqui',
      time: '08:45',
      isMe: true
    },
    {
      author: 'Maria Santos',
      avatar: 'MS',
      message: '50g de fumo pra 1L de água. Deixa de molho 24h, coa e aplica. Repete a cada 7 dias',
      time: '09:12',
      isMe: false
    },
    {
      author: 'Ana Rodrigues',
      avatar: 'AR',
      message: 'Organizando feira de orgânicos no centro dia 20! Quem quer vender junto? 🥬🍅',
      time: '09:48',
      isMe: false
    },
    {
      author: 'Carlos Oliveira',
      avatar: 'CO',
      message: 'Eu topo Ana! Quanto custa o espaço?',
      time: '10:05',
      isMe: false
    },
    {
      author: 'Ana Rodrigues',
      avatar: 'AR',
      message: 'R$ 30 por barraca. Passa no meu WhatsApp: (11) 9999-8888',
      time: '10:12',
      isMe: false
    },
    {
      author: 'José Silva',
      avatar: 'JS',
      message: 'Pessoal, chuva forte prevista pra quarta. Quem tem cultura delicada, melhor proteger 🌧️',
      time: '11:30',
      isMe: false
    }
  ];

  async function handleSend() {
    const content = text.trim();
    if (!content) return;
    try {
      const res = await postCommunityForum({ author: 'Você', message: content, avatar: 'JS', isMe: true });
      setMessages(res.messages);
      setText('');
    } catch {}
  }

  return (
    <div className="space-y-4">
      {/* Chat Header */}
      <div className="bg-white rounded-xl p-4">
        <p className="text-gray-900 mb-1">Grupo Cabreúva</p>
        <p className="text-sm text-gray-600">127 agricultores • 24 mensagens hoje</p>
      </div>

      {/* Messages */}
      <div className="space-y-3">
        {(messages.length ? messages : staticSeed).map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}
          >
            {!msg.isMe && (
              <div className="size-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 text-sm text-gray-700">
                {msg.avatar}
              </div>
            )}
            
            <div className={`flex-1 ${msg.isMe ? 'flex justify-end' : ''}`}>
              {!msg.isMe && (
                <p className="text-sm text-gray-700 mb-1">{msg.author}</p>
              )}
              <div
                className={`inline-block max-w-[85%] p-3 rounded-2xl ${
                  msg.isMe
                    ? 'bg-green-600 text-white rounded-tr-sm'
                    : 'bg-white text-gray-900 rounded-tl-sm'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
              </div>
              <p className={`text-xs text-gray-500 mt-1 ${msg.isMe ? 'text-right' : ''}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-white rounded-xl p-3 flex items-center gap-2 border border-gray-200">
        <button className="p-2 text-gray-500">
          <Image className="size-5" />
        </button>
        <button className="p-2 text-gray-500">
          <Paperclip className="size-5" />
        </button>
        <input
          type="text"
          placeholder="Escrever mensagem..."
          className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button className="p-2 bg-green-600 rounded-lg text-white" onClick={handleSend}>
          <Send className="size-5" />
        </button>
      </div>
    </div>
  );
}
