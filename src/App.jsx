import { useState, useEffect } from 'react'

function App() {
  // useState：データを管理する（変わるとHTMLが自動更新される）
  const [entries, setEntries] = useState([])
  const [credentials, setCredentials] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

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

  // ログイン後に日記を取得
  useEffect(() => {
    if (!credentials) return
    fetch('http://127.0.0.1:8000/api/entries/', {
      headers: { 'Authorization': `Basic ${credentials}` }
    })
      .then(res => res.json())
      .then(data => setEntries(data))
  }, [credentials])

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>📔 私の日記</h2>
        <button onClick={() => setCredentials(null)}>ログアウト</button>
      </div>

      {entries.map(entry => (
        <div key={entry.id} style={{ 
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between'}}>
            <h4>{moodEmoji[entry.mood]} {entry.title}</h4>
            <span style={{ color: '#888' }}>{entry.date}</span>
          </div>
          <p>{entry.content}</p>
        </div>
      ))}
    </div>
  )
}

export default App
