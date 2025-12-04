/**
 * Monster Catalog - Stores and retrieves monster persona definitions
 */

import { MonsterPersona } from './types';

/**
 * MonsterCatalog class manages the collection of 15 predefined monster personas
 */
export class MonsterCatalog {
  private readonly monsters: MonsterPersona[];

  constructor() {
    this.monsters = [
      {
        name: 'Vampire',
        traits: ['aristocratic', 'immortal', 'nocturnal', 'sophisticated', 'ancient'],
        traitSummary: 'aristocratic, immortal, nocturnal, sophisticated, ancient'
      },
      {
        name: 'Werewolf',
        traits: ['primal', 'chaotic', 'transformative', 'passionate', 'wild'],
        traitSummary: 'primal, chaotic, transformative, passionate, wild'
      },
      {
        name: 'Cthulhu',
        traits: ['insanity-inducing', 'ancient', 'unknowable', 'cosmic', 'dread'],
        traitSummary: 'insanity-inducing, ancient, unknowable, cosmic, dread'
      },
      {
        name: "Frankenstein's Monster",
        traits: ['misunderstood', 'constructed', 'lonely', 'searching', 'strong'],
        traitSummary: 'misunderstood, constructed, lonely, searching, strong'
      },
      {
        name: 'Mummy',
        traits: ['cursed', 'vengeful', 'eternal', 'wrapped', 'entombed'],
        traitSummary: 'cursed, vengeful, eternal, wrapped, entombed'
      },
      {
        name: 'Zombie',
        traits: ['mindless', 'relentless', 'contagious', 'hungry', 'shambling'],
        traitSummary: 'mindless, relentless, contagious, hungry, shambling'
      },
      {
        name: 'Banshee',
        traits: ['sorrowful', 'loud', 'prophetic', 'ethereal', 'wailing'],
        traitSummary: 'sorrowful, loud, prophetic, ethereal, wailing'
      },
      {
        name: 'Witch',
        traits: ['cunning', 'mystical', 'powerful', 'herbology', 'secretive'],
        traitSummary: 'cunning, mystical, powerful, herbology, secretive'
      },
      {
        name: 'Headless Horseman',
        traits: ['spectral', 'seeking', 'swift', 'determined', 'rider'],
        traitSummary: 'spectral, seeking, swift, determined, rider'
      },
      {
        name: 'Cryptid',
        traits: ['mysterious', 'prophetic', 'elusive', 'folklore', 'unseen'],
        traitSummary: 'mysterious, prophetic, elusive, folklore, unseen'
      },
      {
        name: 'Grim Reaper',
        traits: ['inevitable', 'neutral', 'finality', 'silent', 'collector'],
        traitSummary: 'inevitable, neutral, finality, silent, collector'
      },
      {
        name: 'Poltergeist',
        traits: ['invisible', 'destructive', 'mischievous', 'noisy', 'energetic'],
        traitSummary: 'invisible, destructive, mischievous, noisy, energetic'
      },
      {
        name: 'Demogorgon',
        traits: ['interdimensional', 'primal', 'terrifying', 'predator', 'gate-opener'],
        traitSummary: 'interdimensional, primal, terrifying, predator, gate-opener'
      },
      {
        name: 'Alien Parasite',
        traits: ['infiltrating', 'subtle', 'control', 'hidden', 'symbiotic'],
        traitSummary: 'infiltrating, subtle, control, hidden, symbiotic'
      },
      {
        name: 'Gorgon',
        traits: ['stone', 'transformative', 'deadly', 'beautiful', 'serpentine'],
        traitSummary: 'stone, transformative, deadly, beautiful, serpentine'
      }
    ];
  }

  /**
   * Get all monster personas from the catalog
   */
  getAll(): MonsterPersona[] {
    // Return a copy to maintain immutability
    return this.monsters.map(monster => ({
      name: monster.name,
      traits: [...monster.traits],
      traitSummary: monster.traitSummary
    }));
  }

  /**
   * Get a specific monster persona by name
   * @param name - The name of the monster to retrieve
   * @returns The monster persona or null if not found
   */
  getByName(name: string): MonsterPersona | null {
    const monster = this.monsters.find(m => m.name === name);
    if (!monster) {
      return null;
    }
    // Return a copy to maintain immutability
    return {
      name: monster.name,
      traits: [...monster.traits],
      traitSummary: monster.traitSummary
    };
  }
}
