/**
 * Utility functions for playing alert sounds
 */

let audioInstance: HTMLAudioElement | null = null;

/**
 * Initialize audio instance for SOS alert
 * File should be placed in: public/assets/audio/sos.mp3
 */
const getAudioInstance = (): HTMLAudioElement => {
  if (!audioInstance) {
    // In Vite, files in public folder are served from root
    audioInstance = new Audio("/assets/audio/sos.mp3");
    audioInstance.volume = 0.8; // Set volume to 80%
    audioInstance.preload = "auto";
    // Handle errors gracefully
    audioInstance.addEventListener("error", () => {
      console.warn("Failed to load SOS audio file. Please ensure /assets/audio/sos.mp3 exists in public folder.");
    });
  }
  return audioInstance;
};

/**
 * Play critical alert sound using SOS audio file
 * Audio will loop until stopped
 */
export const playCriticalAlertSound = () => {
  try {
    const audio = getAudioInstance();
    
    // Set loop to true so audio plays continuously
    audio.loop = true;
    
    // Reset to beginning if already playing
    audio.currentTime = 0;
    
    // Play the audio
    audio.play().catch((error) => {
      console.error("Error playing alert sound:", error);
      // Fallback: try to play again after user interaction
      document.addEventListener(
        "click",
        () => {
          audio.loop = true;
          audio.play().catch(console.error);
        },
        { once: true }
      );
    });
  } catch (error) {
    console.error("Error playing alert sound:", error);
  }
};

/**
 * Stop the critical alert sound
 */
export const stopCriticalAlertSound = () => {
  try {
    if (audioInstance) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
      audioInstance.loop = false;
    }
  } catch (error) {
    console.error("Error stopping alert sound:", error);
  }
};


