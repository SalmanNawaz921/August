export interface PetalMessage {
  id: number;
  text: string;
  sub: string;
}

export const MESSAGES: PetalMessage[] = [
  { id: 0,  text: "Your laugh is the most beautiful sound in any room.",         sub: "A truth I carry everywhere" },
  { id: 1,  text: "You make ordinary moments feel like they belong in a film.",   sub: "Every single time" },
  { id: 2,  text: "I've never met anyone who sees the world quite like you do.",   sub: "And I'm grateful for it" },
  { id: 3,  text: "The way you care for people — it's rare. Don't lose that.",     sub: "It's one of my favourite things about you" },
  { id: 4,  text: "You deserve every beautiful thing the world has to offer.",     sub: "Starting with black roses" },
  { id: 5,  text: "Some people just have a pull — you have it without trying.",    sub: "Effortlessly, impossibly you" },
  { id: 6,  text: "I think about our conversations long after they're over.",      sub: "They linger like good music" },
  { id: 7,  text: "There's a stillness around you that the rest of the world lacks.", sub: "I notice it every time" },
  { id: 8,  text: "You are worth far more than you let yourself believe.",          sub: "I hope you know that" },
  { id: 9,  text: "Even your quiet moments are interesting.",                       sub: "That's not easy to pull off" },
  { id: 10, text: "Black roses suit you — beautiful, rare, and a little mysterious.", sub: "Just like you" },
  { id: 11, text: "I hope today feels as special as you make everything around you.", sub: "Happy August 1st" },
];

export function getRoseMessages(roseIndex: number): PetalMessage[] {
  const start = (roseIndex * 8) % MESSAGES.length;
  const result: PetalMessage[] = [];
  for (let i = 0; i < 8; i++) {
    result.push(MESSAGES[(start + i) % MESSAGES.length]);
  }
  return result;
}
