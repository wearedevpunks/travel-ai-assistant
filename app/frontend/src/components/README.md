# UI Components

This directory contains reusable UI components structured in atomic design pattern.

## Structure

- `atoms/`: Basic building blocks (buttons, inputs, etc.)
- `molecules/`: Combinations of atoms (forms, message headers, etc.)
- `organisms/`: Complex UI components (chat panels, messages, etc.)
- `ui/`: General UI components (shadcn/ui components)

## Chat Components

The chat components are designed to be highly reusable and not tied to any specific implementation (AI or otherwise).

### ChatPanel

A generic chat panel component that can be used for any type of chat interface:

```tsx
<ChatPanel
  messages={messages}
  inputValue={inputValue}
  onInputChange={setInputValue}
  onInputValueChange={handleInputChange}
  onSubmit={handleSubmit}
  isSubmitting={isLoading}
  renderMessageActions={message => <YourCustomActions message={message} />}
  renderExtraContent={message => <YourExtraContent message={message} />}
  renderMessageContent={message => <YourCustomContent message={message} />}
  skipRoles={["system"]}
  voicePreference={voicePreference}
  onVoicePreferenceChange={setVoicePreference}
  autoPlayTTS={autoPlayTTS}
  onAutoPlayTTSChange={setAutoPlayTTS}
/>
```

### ChatMessage

Renders a single message in the chat:

```tsx
<ChatMessage
  id="msg-1"
  author="You"
  variant="user"
  content="Hello, world!"
  headerActions={<YourCustomActions />}
  contentRenderer={() => <YourCustomContent />}
/>
```

### MessageBubble

The visual wrapper for a message:

```tsx
<MessageBubble variant="user">
  Your content here
</MessageBubble>
```

Supported variants: "user", "assistant", "system", or any custom role (will default to assistant styling)

## Text-to-Speech Components

The application includes text-to-speech functionality that leverages the backend API:

### SpeechButton

A button component that handles speech playback state:

```tsx
<SpeechButton
  state={ttsState}
  onPlay={handlePlay}
  onStop={handleStop}
/>
```

### TextToSpeechControls

Combines the SpeechButton with error handling:

```tsx
<TextToSpeechControls
  state={ttsState}
  onPlay={handlePlay}
  onStop={handleStop}
  error={ttsError}
/>
```

### VoiceSelector

Allows users to select from available voices:

```tsx
<VoiceSelector
  value={voice}
  onChange={setVoice}
/>
```

## Usage with Hooks

The `useTextToSpeech` hook provides text-to-speech functionality with a configurable endpoint:

```tsx
const { play, stop, state, error } = useTextToSpeech({
  // Specify the endpoint URL directly
  endpoint: '/v1/travel-planner/text-to-speech',
  voice: selectedVoice,
  autoPlay: autoPlayEnabled,
  onPlayStart: handlePlayStart,
  onPlayEnd: handlePlayEnd,
});

// Play text
play("This is the text to speak");
```

## Usage with AI Assistants

For AI-specific implementations, the `UserAssistant` component in the `features/user-interactions` directory provides a specialized version of these components that integrates with AI services.