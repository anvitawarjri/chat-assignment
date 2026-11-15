import { useEffect, useRef, useState } from 'react'
import './App.css'

const usernames = ['Alan', 'Bob', 'Carol', 'Dean', 'Elin']
const emojis = ['😀', '😂', '😍', '🥳', '😎', '😊', '😭', '👍', '👏', '❤️', '🎉', '🔥', '✨', '🤔', '🙌', '💯']

function App() {
  const [messageText, setMessageText] = useState('')
  const [messages, setMessages] = useState([])
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const composerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    function closeEmojiPicker(event) {
      if (!composerRef.current?.contains(event.target)) {
        setIsEmojiPickerOpen(false)
      }
    }

    document.addEventListener('mousedown', closeEmojiPicker)
    return () => document.removeEventListener('mousedown', closeEmojiPicker)
  }, [])

  function sendMessage(event) {
    event.preventDefault()

    const trimmedMessage = messageText.trim()
    if (!trimmedMessage) return

    const randomUsername = usernames[Math.floor(Math.random() * usernames.length)]

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now(),
        username: randomUsername,
        text: trimmedMessage,
        likes: 0,
      },
    ])
    setMessageText('')
  }

  function likeMessage(messageId) {
    setMessages((currentMessages) =>
      currentMessages.map((message) =>
        message.id === messageId
          ? { ...message, likes: message.likes + 1 }
          : message,
      ),
    )
  }

  function insertEmoji(emoji) {
    const input = inputRef.current
    const cursorStart = input?.selectionStart ?? messageText.length
    const cursorEnd = input?.selectionEnd ?? messageText.length
    const nextMessage = `${messageText.slice(0, cursorStart)}${emoji}${messageText.slice(cursorEnd)}`

    setMessageText(nextMessage)
    setIsEmojiPickerOpen(false)

    requestAnimationFrame(() => {
      input?.focus()
      const nextCursorPosition = cursorStart + emoji.length
      input?.setSelectionRange(nextCursorPosition, nextCursorPosition)
    })
  }

  return (
    <main className="chat-page">
      <section className="chat-window" aria-label="Chat application">
        <header className="chat-header">
          <div className="brand-mark" aria-hidden="true">C</div>
          <div>
            <p className="eyebrow">Community space</p>
            <h1>Chat Room</h1>
          </div>
          <span className="online-status"><span></span> Live</span>
        </header>

        <section className="messages" aria-live="polite" aria-label="Messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">...</div>
              <h2>Start the conversation</h2>
              <p>Your messages will appear here for everyone in the room.</p>
            </div>
          ) : (
            <div className="message-list">
              {messages.map((message) => (
                <article className="message-card" key={message.id}>
                  <div className="avatar" aria-hidden="true">
                    {message.username.charAt(0)}
                  </div>
                  <div className="message-content">
                    <h2>{message.username}</h2>
                    <p>{message.text}</p>
                    <button
                      className="like-button"
                      type="button"
                      onClick={() => likeMessage(message.id)}
                      aria-label={`Like ${message.username}'s message`}
                    >
                      <span aria-hidden="true">Like</span>
                      <strong>{message.likes}</strong>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <form className="message-form" onSubmit={sendMessage} ref={composerRef}>
          <label className="sr-only" htmlFor="message-input">Write a message</label>
          <div className="emoji-control">
            <button
              className="emoji-button"
              type="button"
              aria-label="Choose an emoji"
              aria-expanded={isEmojiPickerOpen}
              onClick={() => setIsEmojiPickerOpen((isOpen) => !isOpen)}
            >
              ☺
            </button>
            {isEmojiPickerOpen && (
              <div className="emoji-picker" role="dialog" aria-label="Emoji picker">
                <p>Commonly used</p>
                <div className="emoji-grid">
                  {emojis.map((emoji) => (
                    <button
                      className="emoji-option"
                      type="button"
                      key={emoji}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => insertEmoji(emoji)}
                      aria-label={`Add ${emoji} emoji`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <input
            id="message-input"
            ref={inputRef}
            type="text"
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            placeholder="Write a message..."
            autoComplete="off"
          />
          <button className="send-button" type="submit">Send</button>
        </form>
      </section>
    </main>
  )
}

export default App
