import React, { useEffect, useState } from 'react';

const API_URL = 'http://13.232.72.134:4000/api';

interface Tweet {
  id: number;
  content: string;
  createdAt: string;
  author: { id: number; username: string };
}

function App() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchTweets() {
    const res = await fetch(`${API_URL}/tweets`);
    const data = await res.json();
    setTweets(data);
  }

  async function register() {
    setLoading(true);
    await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    setLoading(false);
  }

  async function login() {
    setLoading(true);
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.token) setToken(data.token);
    setLoading(false);
  }

  async function postTweet() {
    if (!token) return;
    setLoading(true);
    await fetch(`${API_URL}/tweets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ content })
    });
    setContent('');
    await fetchTweets();
    setLoading(false);
  }

  useEffect(() => { fetchTweets(); }, []);

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Basic Social</h1>
      {!token && (
        <div className="bg-white p-4 rounded shadow space-y-2">
          <input className="border p-2 w-full" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
          <input className="border p-2 w-full" type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
          <div className="flex gap-2">
            <button disabled={loading} onClick={register} className="flex-1 bg-gray-200 hover:bg-gray-300 p-2 rounded">Register</button>
            <button disabled={loading} onClick={login} className="flex-1 bg-blue-500 text-white hover:bg-blue-600 p-2 rounded">Login</button>
          </div>
        </div>
      )}
      {token && (
        <div className="bg-white p-4 rounded shadow space-y-2">
          <textarea className="border p-2 w-full" placeholder="What's happening?" maxLength={280} value={content} onChange={e => setContent(e.target.value)} />
          <button disabled={loading || content.length === 0} onClick={postTweet} className="bg-blue-500 text-white hover:bg-blue-600 p-2 rounded">Tweet</button>
        </div>
      )}
      <div className="space-y-3">
        {tweets.map(t => (
          <div key={t.id} className="bg-white p-3 rounded shadow">
            <div className="text-sm text-gray-600">@{t.author.username} · {new Date(t.createdAt).toLocaleString()}</div>
            <div>{t.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
