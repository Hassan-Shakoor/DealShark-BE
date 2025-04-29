export type Message = {
  id: number;
  isUserMessage?: boolean;
  text?: string;
  loading?: boolean;
};

export const Messages: Message[] = [
  {
    id: 1,
    isUserMessage: true,
    text: "yea i’m doing good. Thankyou for asking that",
  },
  {
    id: 2,
    isUserMessage: true,
    text: "What are your interests btw?",
  },
  {
    id: 3,
    isUserMessage: false,
    text: "I have numerous interests. you tell me what are your interests and we can have discussion about it.",
  },
  {
    id: 4,
    isUserMessage: true,
    text: "Interested in sports",
  },
  {
    id: 5,
    isUserMessage: false,
    text: "That’s great! Which sport do you like the most?",
  },
  {
    id: 6,
    isUserMessage: true,
    text: "I love football. What about you?",
  },
  {
    id: 7,
    isUserMessage: false,
    text: "I enjoy basketball. It’s such a dynamic game.",
  },
  {
    id: 8,
    isUserMessage: true,
    text: "Basketball is fun too! Do you play often?",
  },
  {
    id: 9,
    isUserMessage: false,
    text: "Not as much as I’d like to, but I watch games regularly.",
  },
  {
    id: 10,
    isUserMessage: true,
    text: "That’s cool. Who’s your favorite team?",
  },
  {
    id: 11,
    isUserMessage: false,
    text: "I’m a big fan of the Lakers. What about you?",
  },
  {
    id: 12,
    isUserMessage: true,
    text: "I support Manchester United in football. Not much into basketball teams though.",
  },
  {
    id: 13,
    isUserMessage: false,
    text: "That’s awesome! Manchester United has a great history.",
  },
];
