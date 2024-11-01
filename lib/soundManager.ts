// src/utils/soundManager.ts
import { Audio } from 'expo-av';

class SoundManager {
  private sounds: {
    timerStart?: Audio.Sound;
    timerEnd?: Audio.Sound;
    tick?: Audio.Sound;
  } = {};

  async loadSounds() {
    try {
      const { sound: timerStart } = await Audio.Sound.createAsync(
        require('../assets/sounds/start.wav')
      );
      const { sound: timerEnd } = await Audio.Sound.createAsync(
        require('../assets/sounds/complete.wav')
      );
      const { sound: tick } = await Audio.Sound.createAsync(
        require('../assets/sounds/tick.wav')
      );

      this.sounds = {
        timerStart,
        timerEnd,
        tick
      };

      // Set up audio mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
    } catch (error) {
      console.error('Error loading sounds:', error);
    }
  }

  async playSound(type: 'timerStart' | 'timerEnd' | 'tick') {
    try {
      const sound = this.sounds[type];
      if (sound) {
        await sound.replayAsync();
      }
    } catch (error) {
      console.error(`Error playing ${type} sound:`, error);
    }
  }

  async unloadSounds() {
    try {
      for (const sound of Object.values(this.sounds)) {
        if (sound) {
          await sound.unloadAsync();
        }
      }
    } catch (error) {
      console.error('Error unloading sounds:', error);
    }
  }
}

export const soundManager = new SoundManager();