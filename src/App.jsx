import { useState, useEffect } from 'react'

function App() {
  // useState：データを管理する（変わるとHTMLが自動更新される）
  const [entries, setEntries] = useState([])
  const [credentials, setCredentials] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // 新規投稿フォームの状態
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newMood, setNewMood] = useState('normal')
  const [newDate, setNewDate] = useState('')

  const moodEmoji = { happy: '😊', normal: '😐', sad: '😢'}

  // ログイン処理
  async function handleLogin() {
    const cred = btoa(`${username}:${password}`)
    const response = await fetch('http://127.0.0.1:8000/api/entries/', {
      headers: { 'Authorization': `Basic ${cred}` }
    })
    if (response.ok) {
      setCredentials(cred)
      setError('')
    } else {
      setError('ログインに失敗しました')
    }
  }

  // 日記一覧を取得
  async function loadEntries() {
    const response = await fetch('http://127.0.0.1:8000/api/entries/', {
      headers: { 'Authorization': `Basic ${credentials}` }
    })
    const data = await response.json()
    setEntries(data)
  }

  useEffect(() => {
    if (!credentials) return
    loadEntries()
  }, [credentials])

  // 新規投稿
  async function handleSubmit() {
    if (!newTitle || !newContent || !newDate) {
      alert('タイトル・内容・日付は必須です')
      return
    }
    const response = await fetch('http://127.0.0.1:8000/api/entries/',  {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: newTitle,
        content: newContent,
        mood: newMood,
        date: newDate
      })
    })
    if (response.ok) {
      // フォームをリセット
      setNewTitle('')
      setNewContent('')
      setNewMood('normal')
      setNewDate('')
      setShowForm(false)
      loadEntries()     // 一覧を再取得
    }
  }

  // 削除
  async function handleDelete(id) {
    if (!window.confirm('本当に削除しますか？')) return
    await fetch(`http://127.0.0.1:8000/api/entries/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Basic ${credentials}` }
    })
    loadEntries()   // 一覧を再取得
  }

  // ログイン処理
  if (!credentials){
    return (
      <div style={{ padding: '40px', maxWidth: '400px' }}>
        <h2>📔 日記アプリ</h2>
        <input
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px'}}
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px'}}
        />
        <button onClick={handleLogin} style={{ padding: '8px 20px' }}>ログイン</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    )
  }

  // 日記一覧画面
  return (
    <div style={{ padding: '40px', maxWidth: '700px'}}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>📔 私の日記</h2>
        <div>
          <button onClick={() => setShowForm(!showForm)} style={{ marginRight: '10px', padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px'}}>
            {showForm ? 'キャンセル' : '+ 新規投稿'}
          </button>
          <button onClick={() => setCredentials(null)} style={{ padding: '8px 16px' }}>ログアウト</button>
        </div>
      </div>

      {/* 新規投稿フォーム */}
      {showForm && (
        <div style={{ border: '1px solid #4CAF50', borderRadius: '8px', padding: '20px', marginBottom: '20px'}}>
          <h4>新しい日記を書く</h4>
          <input
            type="text"
            placeholder="タイトル"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
          />
          <textarea
            placeholder="内容"
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            rows={4}
            style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
          />
          <select
            value={newMood}
            onChange={e => setNewMood(e.target.value)}
            style={{ display: 'block', marginBottom: '10px', padding: '8px' }}
          >
            <option value="happy">😊 嬉しい</option>
            <option value="normal">😐 普通</option>
            <option value="sad">😢 悲しい</option>
          </select>
          <input
            type="date"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            style={{ display: 'block', marginBottom: '10px', padding: '8px' }}
          />
          <button onClick={handleSubmit} style={{ padding: '8px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
            投稿する
          </button>
        </div>
      )}

      {/* 日記一覧 */}
      {entries.map(entry => (
        <div key={entry.id} style={{ 
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0 }}>{moodEmoji[entry.mood]} {entry.title}</h4>
            <div>
              <span style={{ color: '#888', marginRight: '12px'}}>{entry.date}</span>
              <button
                onClick={() => handleDelete(entry.id)}
                style={{ padding: '4px 10px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                削除
              </button>
            </div>
          </div>
          <p style={{ marginTop: '8px', marginBottom: 0}}>{entry.content}</p>
        </div>
      ))}
    </div>
  )
}

export default App
