# User Interactions Feature

This feature provides reusable components for building chat-based AI assistants.

## Components

### UserAssistant

A reusable base component for building various AI assistants. It provides:
- Chat functionality using AI SDK
- Voice preference management
- Text-to-speech capability
- Tool output rendering

Usage:
```tsx
import { UserAssistant } from "@/features/user-interactions"

export const MyAssistant = () => {
  const renderMessageActions = (message) => {
    // Render custom actions for each message
  }

  const renderToolOutputs = (message) => {
    // Render custom tool outputs
  }

  return (
    <UserAssistant
      initialSystemMessage="You are a helpful assistant..."
      renderMessageActions={renderMessageActions}
      renderToolOutputs={renderToolOutputs}
      // Optional: Override voice settings
      // voiceType="nova"    // Options: "alloy", "echo", "fable", "onyx", "nova", "shimmer"
      // autoPlay="on"       // Options: "on", "off"
    />
  )
}
```

### TextToSpeech

A reusable component for text-to-speech functionality.

### BaseToolOutput

A base component for rendering tool outputs.

## Voice Preferences

Voice preferences are now shared across all assistants by default. This means that when a user chooses a voice in one assistant, all assistants will use the same voice settings. The settings are stored in local storage using shared keys.

You can override these settings for a specific assistant by using the `voiceType` and `autoPlay` props:

```tsx
<UserAssistant
  // ... other props
  voiceType="nova"   // Override the voice for this assistant
  autoPlay="on"      // Override autoplay for this assistant
/>
```

If you set these override props, they will also update the shared preferences, so other assistants will adopt the same settings unless they have their own overrides.

## Hooks

### useVoicePreferences

A hook for managing voice preferences across different assistants:

```tsx
const { 
  voicePreference, 
  autoPlayTTS, 
  setVoicePreference, 
  setAutoPlayTTS 
} = useVoicePreferences()  // Uses the default shared storage keys
```

## Creating a New Assistant

1. Create a new folder for your assistant
2. Extend the base components as needed
3. Create custom tool output renderers
4. Use the UserAssistant component to compose your assistant

See the TravelPlannerChatPanel implementation for a complete example.