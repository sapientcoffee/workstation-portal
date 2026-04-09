export const coffeeMessages = [
  "Espresso yourself!",
  "Brew can do it!",
  "Take life one sip at a time.",
  "You're brewing up a storm!",
  "Stay grounded.",
  "Better latte than never.",
  "Sip happens.",
  "Mug life.",
  "Caffeine and kindness.",
  "Procaffeinating: the tendency to not start anything until you've had a cup of coffee.",
  "Coffee: the most important meal of the day.",
  "Decaf? No thanks.",
  "Life's too short for bad coffee.",
  "A yawn is a silent scream for coffee.",
  "Drink coffee, do stupid things faster with more energy."
];

let lastReturnedMessage = null;

export function getRandomMessage(currentMessage = null) {
  const previous = currentMessage !== null ? currentMessage : lastReturnedMessage;
  
  let newMessage;
  do {
    const randomIndex = Math.floor(Math.random() * coffeeMessages.length);
    newMessage = coffeeMessages[randomIndex];
  } while (newMessage === previous);
  
  lastReturnedMessage = newMessage;
  return newMessage;
}
